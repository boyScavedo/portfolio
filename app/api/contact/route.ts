import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";

export async function POST(req: NextRequest) {
  const { name, email, subject, body } = await req.json();

  if (!name || !email || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (name.length > 100 || email.length > 255 || body.length > 5000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  await db.insert(messages).values({
    name: name.trim(),
    email: email.trim(),
    subject: subject?.trim() || null,
    body: body.trim(),
  });

  // Optional email via Resend — silently skips if key not set
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "portfolio@notifications.jeevanshrestha.dev",
        to: "shrestha9842889901@gmail.com",
        subject: `New message from ${name}: ${subject || "(no subject)"}`,
        text: `From: ${name} <${email}>\n\n${body}`,
        replyTo: email,
      });
    } catch {
      // Email failed — message is still saved in DB
    }
  }

  return NextResponse.json({ ok: true });
}
