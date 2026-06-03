import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const all = await db.select().from(projects).orderBy(projects.order);
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [project] = await db.insert(projects).values({
    title: body.title,
    description: body.description,
    longDescription: body.longDescription || null,
    imageUrl: body.imageUrl || null,
    demoUrl: body.demoUrl || null,
    githubUrl: body.githubUrl || null,
    tags: body.tags || [],
    featured: body.featured ?? false,
    order: body.order ?? 0,
  }).returning();
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const [project] = await db.update(projects).set({
    title: body.title,
    description: body.description,
    longDescription: body.longDescription,
    imageUrl: body.imageUrl,
    demoUrl: body.demoUrl,
    githubUrl: body.githubUrl,
    tags: body.tags,
    featured: body.featured,
    order: body.order,
  }).where(eq(projects.id, body.id)).returning();
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await db.delete(projects).where(eq(projects.id, id));
  return NextResponse.json({ ok: true });
}
