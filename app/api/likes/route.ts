import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { likes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(`like:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { postId } = await req.json();
  if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });

  const existing = await db
    .select()
    .from(likes)
    .where(and(eq(likes.postId, postId), eq(likes.ip, ip)))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(likes).where(and(eq(likes.postId, postId), eq(likes.ip, ip)));
    return NextResponse.json({ ok: true, action: "unliked" });
  }

  await db.insert(likes).values({ postId, ip });
  return NextResponse.json({ ok: true, action: "liked" });
}
