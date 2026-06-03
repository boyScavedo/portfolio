import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatDate, readingTime } from "@/lib/utils";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/animated-section";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts, tutorials, and ideas on software development.",
};

export default async function BlogPage() {
  const allPosts = await db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt));
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags ?? [])));

  return (
    <div className="flex flex-col pt-24">
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute bottom-0 right-0 pointer-events-none" style={{ background: "radial-gradient(500px circle at 100% 100%, rgba(212,246,0,0.04), transparent)" }} />
        <div className="mx-auto max-w-4xl relative z-10">
          <FadeUp>
            <p className="text-xs text-[#d4f600] font-mono mb-2">03 /</p>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tight">
              The<br /><span className="text-[#d4f600]">Blog</span>
            </h1>
            <p className="text-[#555] mt-4 text-lg">
              {allPosts.length} post{allPosts.length !== 1 ? "s" : ""} on software, ideas, and learnings.
            </p>
          </FadeUp>

          {allTags.length > 0 && (
            <FadeUp delay={1}>
              <div className="flex flex-wrap gap-2 mt-8">
                {allTags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-1 text-xs text-[#666] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 w-full">
        {allPosts.length === 0 ? (
          <FadeUp>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-16 text-center text-[#555]">
              No posts yet. Check back soon.
            </div>
          </FadeUp>
        ) : (
          <StaggerContainer className="space-y-3">
            {allPosts.map((post) => (
              <StaggerItem key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group flex items-center justify-between rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-6 hover:border-[#d4f600]/30 hover:bg-[#111] transition-all gap-4">
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-[#555]">
                      {post.publishedAt && <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>}
                      <span>{readingTime(post.content)} min read</span>
                    </div>
                    <h2 className="font-bold text-lg group-hover:text-[#d4f600] transition-colors truncate">{post.title}</h2>
                    {post.excerpt && <p className="text-sm text-[#555] line-clamp-2">{post.excerpt}</p>}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(post.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 text-xs text-[#555]">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[#555] group-hover:text-[#d4f600] group-hover:translate-x-1 transition-all flex-shrink-0 text-xl">→</span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>
    </div>
  );
}
