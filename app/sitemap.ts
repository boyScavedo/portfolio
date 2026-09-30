import type { MetadataRoute } from "next";
import { db } from "@/db";
import { posts, projects } from "@/db/schema";
import { eq } from "drizzle-orm";

// Without this the sitemap is prerendered once at build time and stays frozen
// until the next deploy. Radar posts land every 12h, so a build-time sitemap
// hides all of them. Hourly ISR keeps them discoverable.
export const revalidate = 3600;

// Static routes do not change between deploys. Using new Date() here made every
// deploy look like a site-wide edit and told crawlers to recheck all of them.
const STATIC_LASTMOD = new Date("2026-01-01T00:00:00.000Z");

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
    { url: base, lastModified: STATIC_LASTMOD, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: STATIC_LASTMOD, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projects`, lastModified: STATIC_LASTMOD, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: STATIC_LASTMOD, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/news`, lastModified: STATIC_LASTMOD, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/videos`, lastModified: STATIC_LASTMOD, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/contact`, lastModified: STATIC_LASTMOD, changeFrequency: "monthly", priority: 0.5 },
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
