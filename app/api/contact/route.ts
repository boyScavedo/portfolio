import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  // 1 message per hour per IP
  if (!rateLimit(`contact:${ip}`, 1, 60 * 60_000)) {
    return NextResponse.json({ error: "One message per hour allowed." }, { status: 429 });
  }

  const { name, email, subject, body, captchaToken } = await req.json();

  if (!captchaToken || !(await verifyTurnstile(captchaToken, ip))) {
    return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
  }

  if (!name || !email || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (name.length > 100 || email.length > 255 || body.length > 5000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (subject && subject.length > 255) {
    return NextResponse.json({ error: "Subject too long" }, { status: 400 });
  }

  await db.insert(messages).values({
    name: name.trim(),
    email: email.trim(),
    subject: subject?.trim() || null,
    body: body.trim(),
  });

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const nodemailer = await import("nodemailer");
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      });
      await transport.sendMail({
        from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `[portfolio] ${subject || "new message"} — ${name}`,
        text: `From: ${name} <${email}>\nSubject: ${subject || "(none)"}\n\n${body}`,
        replyTo: email,
      });
    } catch {
      // Email failed silently — message still saved in DB
    }
  }

  return NextResponse.json({ ok: true });
}
