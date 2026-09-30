import { db } from "@/db";
import { posts } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { buildRss, rssResponse } from "@/lib/rss";

export const revalidate = 3600;

/**
 * Radar digests only. These publish every 12h, so this channel is what
 * actually carries new content — /blog/feed.xml is hand-written and can go
 * months between posts, which makes it a poor polling signal for readers.
 */
export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  let allPosts: (typeof posts.$inferSelect)[] = [];
  try {
    allPosts = await db
      .select()
      .from(posts)
      .where(and(eq(posts.published, true), eq(posts.source, "radar")))
      .orderBy(desc(posts.publishedAt));
  } catch {
    allPosts = [];
  }

  return rssResponse(
    buildRss(base, {
      feedPath: "/news/feed.xml",
      pagePath: "/news",
      title: "Jeevan Adhikari - Tech Radar",
      description:
        "Automated tech radar digests — AI, agents, open source and security, twice daily.",
    }, allPosts)
  );
}