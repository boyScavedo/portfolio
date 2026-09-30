import type { Metadata } from "next";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import PostList from "../blog/post-list";

type Post = InferSelectModel<typeof posts>;

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "News",
  description: "Automated Tech Radar digests — AI, agents, open source and security, twice daily.",
  alternates: {
    canonical: `${BASE_URL}/news`,
    types: { "application/rss+xml": `${BASE_URL}/news/feed.xml` },
  },
};

/**
 * The machine-written half of the writing. Shares PostList with /blog so
 * filtering and layout stay identical; only the query differs.
 */
export default async function NewsPage() {
  let allPosts: Post[] = [];
  try {
    allPosts = await db
      .select()
      .from(posts)
      .where(and(eq(posts.published, true), eq(posts.source, "radar")))
      .orderBy(desc(posts.publishedAt));
  } catch {
    allPosts = [];
  }
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags ?? [])));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 w-full">
      <div className="mb-8 space-y-1">
        <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest">~/news</p>
        <h1 className="font-mono font-black text-4xl text-[#e0e0e0]">
          news<span className="text-[#d4f600]">_</span>
        </h1>
        <p className="text-xs font-mono text-[#555]">
          {allPosts.length} digest{allPosts.length !== 1 ? "s" : ""} · tech radar, twice daily
        </p>
      </div>

      <PostList posts={allPosts} allTags={allTags} />
    </div>
  );
}