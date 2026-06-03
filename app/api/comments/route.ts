import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  // 1 comment per minute per IP
  if (!rateLimit(`comment:${ip}`, 1, 60_000)) {
    return NextResponse.json({ error: "One comment per minute allowed." }, { status: 429 });
  }

  const { postId, name, email, body, captchaToken } = await req.json();

  if (!captchaToken || !(await verifyTurnstile(captchaToken, ip))) {
    return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
  }

  if (!postId || !name || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (name.length > 100 || body.length > 5000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (typeof postId !== "number" || !Number.isInteger(postId) || postId < 1) {
    return NextResponse.json({ error: "Invalid postId" }, { status: 400 });
  }

  await db.insert(comments).values({
    postId,
    name: name.trim(),
    email: email?.trim() || null,
    body: body.trim(),
    approved: true,
  });

  return NextResponse.json({ ok: true });
}
