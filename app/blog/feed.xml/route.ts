import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt))
    .limit(20);

  const items = allPosts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${base}/blog/${p.slug}</link>
      <guid>${base}/blog/${p.slug}</guid>
      <pubDate>${p.publishedAt ? new Date(p.publishedAt).toUTCString() : ""}</pubDate>
      <description><![CDATA[${p.excerpt ?? ""}]]></description>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Jeevan Shrestha — Blog</title>
    <link>${base}/blog</link>
    <description>Thoughts, tutorials, and ideas on software development.</description>
    <language>en-us</language>
    <atom:link href="${base}/blog/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
