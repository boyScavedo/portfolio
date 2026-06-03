import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db.select().from(profile).limit(1);
  return NextResponse.json(rows[0] ?? null);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  const rows = await db.select().from(profile).limit(1);

  if (rows.length === 0) {
    const [created] = await db.insert(profile).values({
      name: body.name,
      role: body.role,
      tagline: body.tagline,
      bio: body.bio,
      availabilityStatus: body.availabilityStatus,
      currentCompany: body.currentCompany || null,
      currentCompanyUrl: body.currentCompanyUrl || null,
      workType: body.workType,
      openToWork: body.openToWork,
      location: body.location,
      githubUrl: body.githubUrl || null,
      youtubeUrl: body.youtubeUrl || null,
      twitterUrl: body.twitterUrl || null,
      linkedinUrl: body.linkedinUrl || null,
      resumeUrl: body.resumeUrl || null,
      updatedAt: new Date(),
    }).returning();
    return NextResponse.json(created);
  }

  const [updated] = await db.update(profile).set({
    name: body.name,
    role: body.role,
    tagline: body.tagline,
    bio: body.bio,
    availabilityStatus: body.availabilityStatus,
    currentCompany: body.currentCompany || null,
    currentCompanyUrl: body.currentCompanyUrl || null,
    workType: body.workType,
    openToWork: body.openToWork,
    location: body.location,
    githubUrl: body.githubUrl || null,
    youtubeUrl: body.youtubeUrl || null,
    twitterUrl: body.twitterUrl || null,
    linkedinUrl: body.linkedinUrl || null,
    resumeUrl: body.resumeUrl || null,
    updatedAt: new Date(),
  }).where(eq(profile.id, rows[0].id)).returning();
  return NextResponse.json(updated);
}
