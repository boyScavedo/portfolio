import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatDate, readingTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and ideas on software development.",
};

export default async function BlogPage() {
  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt));

  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags ?? [])));

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          {allPosts.length} post{allPosts.length !== 1 ? "s" : ""} on software, ideas, and learnings.
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className="rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {allPosts.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No posts yet. Check back soon.</p>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {allPosts.map((post) => (
            <article key={post.id} className="py-6 group">
              <Link href={`/blog/${post.slug}`} className="space-y-2 block">
                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                  {post.publishedAt && <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>}
                  <span>{readingTime(post.content)} min read</span>
                </div>
                <h2 className="text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3">{post.excerpt}</p>
                )}
                <div className="flex flex-wrap gap-1 pt-1">
                  {(post.tags ?? []).map((tag) => (
                    <span key={tag} className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
