import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { likes } from "@/db/schema";
import { and, eq, count } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

const MAX_LIKES = 5;

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function GET(req: NextRequest) {
  const ip = getIp(req);
  const { searchParams } = new URL(req.url);
  const postId = Number(searchParams.get("postId"));
  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  const [totalResult, userResult, slotResult] = await Promise.all([
    db.select({ count: count() }).from(likes).where(and(eq(likes.postId, postId), eq(likes.active, true))),
    db.select({ count: count() }).from(likes).where(and(eq(likes.postId, postId), eq(likes.ip, ip), eq(likes.active, true))),
    db.select({ count: count() }).from(likes).where(and(eq(likes.postId, postId), eq(likes.ip, ip))),
  ]);

  return NextResponse.json({
    total: totalResult[0]?.count ?? 0,
    userLikes: userResult[0]?.count ?? 0,
    slotsUsed: slotResult[0]?.count ?? 0,
    maxLikes: MAX_LIKES,
  });
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(`like:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  const [slotResult] = await db
    .select({ count: count() })
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.ip, ip)));
  const slotsUsed = slotResult?.count ?? 0;

  const [activeResult] = await db
    .select({ id: likes.id })
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.ip, ip), eq(likes.active, true)))
    .limit(1);

  if (activeResult) {
    await db
      .update(likes)
      .set({ active: false })
      .where(eq(likes.id, activeResult.id));
    return NextResponse.json({ ok: true, action: "unliked" });
  }

  if (slotsUsed >= MAX_LIKES) {
    return NextResponse.json({ error: "Max likes reached", ok: false, action: "blocked" }, { status: 400 });
  }

  await db.insert(likes).values({ postId, ip, active: true });
  return NextResponse.json({ ok: true, action: "liked" });
}
