import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { comments } from "@/db/schema";

export async function POST(req: NextRequest) {
  const { postId, name, email, body } = await req.json();

  if (!postId || !name || !body) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (name.length > 100 || body.length > 5000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  await db.insert(comments).values({
    postId,
    name: name.trim(),
    email: email?.trim() || null,
    body: body.trim(),
    approved: false,
  });

  return NextResponse.json({ ok: true });
}
