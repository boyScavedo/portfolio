import type { Metadata } from "next";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import PostList from "./post-list";

type Post = InferSelectModel<typeof posts>;

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and ideas on software development.",
};

export default async function BlogPage() {
  let allPosts: Post[] = [];
  try {
    allPosts = await db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt));
  } catch {
    allPosts = [];
  }
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags ?? [])));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 w-full">
      <div className="mb-8 space-y-1">
        <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest">~/blog</p>
        <h1 className="font-mono font-black text-4xl text-[#e0e0e0]">
          blog<span className="text-[#d4f600]">_</span>
        </h1>
        <p className="text-xs font-mono text-[#555]">
          {allPosts.length} post{allPosts.length !== 1 ? "s" : ""} · thoughts, tutorials, learnings
        </p>
      </div>

      <PostList posts={allPosts} allTags={allTags} />
    </div>
  );
}
