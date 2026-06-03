import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await db.select().from(posts).orderBy(posts.createdAt);
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const slug = body.slug || slugify(body.title);
  const [post] = await db.insert(posts).values({
    title: body.title,
    slug,
    excerpt: body.excerpt || null,
    content: body.content,
    coverUrl: body.coverUrl || null,
    tags: body.tags || [],
    published: body.published ?? false,
    publishedAt: body.published ? new Date() : null,
  }).returning();
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [post] = await db
    .update(posts)
    .set({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      coverUrl: body.coverUrl,
      tags: body.tags,
      published: body.published,
      publishedAt: body.published && !body.publishedAt ? new Date() : body.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, body.id))
    .returning();
  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await db.delete(posts).where(eq(posts.id, id));
  return NextResponse.json({ ok: true });
}
