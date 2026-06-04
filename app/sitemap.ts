import type { MetadataRoute } from "next";
import { db } from "@/db";
import { posts, projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  let allPosts: { slug: string; updatedAt: Date }[] = [];
  let allProjects: { id: number; createdAt: Date }[] = [];
  try {
    allPosts = await db.select({ slug: posts.slug, updatedAt: posts.updatedAt }).from(posts).where(eq(posts.published, true));
  } catch {
    allPosts = [];
  }
  try {
    allProjects = await db.select({ id: projects.id, createdAt: projects.createdAt }).from(projects);
  } catch {
    allProjects = [];
  }

  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/videos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...allPosts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...allProjects.map((p) => ({
      url: `${base}/projects/${p.id}`,
      lastModified: p.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
