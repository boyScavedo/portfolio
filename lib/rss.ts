import type { InferSelectModel } from "drizzle-orm";
import { posts } from "@/db/schema";

type Post = InferSelectModel<typeof posts>;

export type RssChannel = {
  /** Absolute URL of this feed, e.g. `${base}/news/feed.xml`. */
  feedPath: string;
  /** Landing page the feed describes, used for <channel><link>. */
  pagePath: string;
  title: string;
  description: string;
  /** Limit the caller pulls to; applied here so both feeds behave the same. */
  limit?: number;
};

/** Escape for an XML text node. CDATA cannot be used as the only defence
 *  because a `]]>` inside post content would close the section early. */
function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Build an RSS 2.0 document for a set of posts.
 *
 * Shared by /blog/feed.xml and /news/feed.xml so the two channels stay in sync.
 * `lastBuildDate` is the wall-clock time this document was generated — readers
 * use it to decide whether to refetch, so pinning it to the newest post's date
 * makes a feed look permanently stale and suppresses polling.
 */
export function buildRss(
  base: string,
  channel: RssChannel,
  items: Post[]
): string {
  const feedUrl = `${base}${channel.feedPath}`;
  const limit = channel.limit ?? 20;
  const generatedAt = new Date();

  const entries = items
    .slice(0, limit)
    .map((p) => {
      const link = `${base}/blog/${p.slug}`;
      const published = p.publishedAt ?? p.createdAt;
      const categories = (p.tags ?? [])
        .map((t) => `      <category>${xml(t)}</category>`)
        .join("\n");
      return `    <item>
      <title>${xml(p.title)}</title>
      <link>${xml(link)}</link>
      <guid isPermaLink="true">${xml(link)}</guid>
      <pubDate>${published.toUTCString()}</pubDate>
      <description>${xml(p.excerpt ?? "")}</description>
      <author>noreply@jeevanadhikari.com (Jeevan Adhikari)</author>${categories ? `\n${categories}` : ""}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/modules/content/">
  <channel>
    <title>${xml(channel.title)}</title>
    <link>${xml(`${base}${channel.pagePath}`)}</link>
    <description>${xml(channel.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${generatedAt.toUTCString()}</lastBuildDate>
    <pubDate>${items[0] ? (items[0].publishedAt ?? items[0].createdAt).toUTCString() : generatedAt.toUTCString()}</pubDate>
    <managingEditor>noreply@jeevanadhikari.com (Jeevan Adhikari)</managingEditor>
    <webMaster>noreply@jeevanadhikari.com (Jeevan Adhikari)</webMaster>
    <ttl>60</ttl>
    <atom:link href="${xml(feedUrl)}" rel="self" type="application/rss+xml" />
${entries}
  </channel>
</rss>`;
}

export function rssResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}