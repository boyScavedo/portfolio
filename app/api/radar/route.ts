import { NextResponse } from "next/server";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { verifyRadarKey } from "@/lib/auth";
import { parseDigest } from "@/lib/digest";
import { sendRadarEmail } from "@/lib/radar-mail";

export const dynamic = "force-dynamic";

/**
 * Ingestion endpoint for the Tech Radar runner.
 *
 * POST the raw digest file as `text/markdown`. The post lands as a draft and an
 * email goes out with a preview link; publishing stays a deliberate human step.
 */

/** Minimum gap between radar posts. Chosen to match the runner's 12h cadence
 *  with slack, so a manual retry cannot slip a second draft in beside a run. */
const MIN_GAP_HOURS = 20;
const MIN_GAP_MS = MIN_GAP_HOURS * 60 * 60 * 1000;

/** Guards against a runaway sender filling the posts table with junk. */
const MAX_BODY_BYTES = 1024 * 1024;

export async function POST(req: Request): Promise<NextResponse> {
  if (!verifyRadarKey(req.headers.get("authorization"))) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // Reject oversized bodies before reading them fully into memory.
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  // The filename is a query param so the date stays in the radar's local time
  // rather than being re-derived from the server clock.
  const filename = new URL(req.url).searchParams.get("filename") ?? undefined;
  const digest = parseDigest(raw, filename);

  if (!digest.content.trim()) {
    return NextResponse.json({ ok: false, error: "empty_digest" }, { status: 400 });
  }

  // --- rate limit -------------------------------------------------------
  // Guards the whole radar series from creation time, drafts included, so an
  // unapproved draft still consumes the window. This also makes the endpoint
  // idempotent: a retried POST of the same file hits the 429, not a dupe.
  const last = await db
    .select({ createdAt: posts.createdAt })
    .from(posts)
    .where(eq(posts.source, "radar"))
    .orderBy(desc(posts.createdAt))
    .limit(1);

  const lastCreatedAt = last[0]?.createdAt ?? null;
  const elapsedMs = lastCreatedAt ? Date.now() - lastCreatedAt.getTime() : Infinity;
  const blocked = elapsedMs < MIN_GAP_MS;

  const [total] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(posts)
    .where(eq(posts.source, "radar"));

  const [recent] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(posts)
    .where(
      and(eq(posts.source, "radar"), gte(posts.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)))
    );

  const counts = {
    radarPostsTotal: total?.n ?? 0,
    radarPostsLast24h: recent?.n ?? 0,
  };

  if (blocked && lastCreatedAt) {
    const retryAt = new Date(lastCreatedAt.getTime() + MIN_GAP_MS);
    const waitMs = retryAt.getTime() - Date.now();
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        message: `A radar draft was created ${Math.round(elapsedMs / 3600000)}h ago. Next post allowed after ${retryAt.toISOString()}.`,
        lastPostedAt: lastCreatedAt.toISOString(),
        retryAt: retryAt.toISOString(),
        retryAfterHours: Math.ceil(waitMs / 3600000),
        ...counts,
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(waitMs / 1000)) },
      }
    );
  }

  // --- slug -------------------------------------------------------------
  // Date-based so URLs stay readable. The 20h window does not strictly prevent
  // two posts on one calendar date (e.g. 01:00 then 23:00), so fall back to a
  // time suffix instead of letting the unique index reject the insert.
  const dateSlug = digest.date ? `tech-radar-${digest.date}` : "tech-radar";
  const slug = await freeSlug(db, dateSlug);

  // --- insert -----------------------------------------------------------
  let id: number;
  try {
    const inserted = await db
      .insert(posts)
      .values({
        title: digest.title,
        slug,
        excerpt: digest.excerpt || null,
        content: digest.content,
        tags: digest.tags,
        published: false,
        publishedAt: null,
        source: "radar",
      })
      .returning({ id: posts.id });
    id = inserted[0].id;
  } catch (err) {
    console.error("[radar] insert failed:", err);
    return NextResponse.json({ ok: false, error: "insert_failed" }, { status: 500 });
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? new URL(req.url).origin;
  const previewUrl = `${base.replace(/\/$/, "")}/admin/posts/${id}/preview`;

  // Mail is best-effort: the draft is already stored, and a flaky SMTP server
  // must not make the runner think the post failed and retry it into a 429.
  let emailed = true;
  try {
    emailed = await sendRadarEmail({ title: digest.title, previewUrl, excerpt: digest.excerpt });
  } catch (err) {
    console.error("[radar] notification email failed:", err);
    emailed = false;
  }

  return NextResponse.json(
    {
      ok: true,
      id,
      slug,
      published: false,
      url: previewUrl,
      publicUrl: `${base.replace(/\/$/, "")}/blog/${slug}`,
      emailed,
      // Counts were read before the insert, so this post is not in them yet.
      // Report it as included: the caller wants to know where it now stands.
      radarPostsTotal: counts.radarPostsTotal + 1,
      radarPostsLast24h: counts.radarPostsLast24h + 1,
    },
    { status: 200 }
  );
}

/** Add a time suffix only if the base slug is taken. */
async function freeSlug(dbx: typeof db, base: string): Promise<string> {
  const taken = await dbx
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.slug, base))
    .limit(1);
  if (taken.length === 0) return base;

  const stamp = new Date().toISOString().slice(11, 16).replace(":", "");
  const withTime = `${base}-${stamp}`;
  const clash = await dbx
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.slug, withTime))
    .limit(1);
  if (clash.length === 0) return withTime;

  // Last resort; keeps the insert from failing on the unique index.
  let n = 2;
  while (true) {
    const candidate = `${base}-${stamp}-${n}`;
    const dup = await dbx
      .select({ slug: posts.slug })
      .from(posts)
      .where(eq(posts.slug, candidate))
      .limit(1);
    if (dup.length === 0) return candidate;
    n++;
  }
}