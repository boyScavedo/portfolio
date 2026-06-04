import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

type Post = InferSelectModel<typeof posts>;

export const revalidate = 3600; // cache 1 hour

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  let allPosts: Post[] = [];
  try {
    allPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.publishedAt))
      .limit(20);
  } catch {
    allPosts = [];
  }

  const lastBuild = allPosts[0]?.updatedAt ?? new Date();

  const items = allPosts
    .map((p) => {
      const categories = (p.tags ?? [])
        .map((t) => `      <category>${t}</category>`)
        .join("\n");
      return `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${base}/blog/${p.slug}</link>
      <guid isPermaLink="true">${base}/blog/${p.slug}</guid>
      <pubDate>${p.publishedAt ? new Date(p.publishedAt).toUTCString() : new Date(p.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${p.excerpt ?? ""}]]></description>
      <author>noreply@jeevanadh.com (Jeevan Adhikari)</author>
${categories}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/modules/content/">
  <channel>
    <title>Jeevan Adhikari - Blog</title>
    <link>${base}/blog</link>
    <description>Thoughts, tutorials, and ideas on software development by Jeevan Adhikari.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <managingEditor>noreply@jeevanadh.com (Jeevan Adhikari)</managingEditor>
    <webMaster>noreply@jeevanadh.com (Jeevan Adhikari)</webMaster>
    <ttl>60</ttl>
    <atom:link href="${base}/blog/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
