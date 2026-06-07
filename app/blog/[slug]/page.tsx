import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { posts, comments, likes } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { formatDate, readingTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import LikeButton from "./like-button";
import CommentSection from "./comment-section";

const markdownComponents: Components = {
  a: ({ href, children, ...props }) => {
    const isExternal = typeof href === "string" && (href.startsWith("http") || href.startsWith("//"));
    return (
      <a href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} {...props}>
        {children}
      </a>
    );
  },
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!post) return {};
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const ogImage = post.coverUrl
    ? { url: post.coverUrl, width: 1200, height: 630, alt: post.title }
    : { url: `${base}/opengraph-image`, width: 1200, height: 630, alt: "Jeevan Adhikari" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: ["Jeevan Adhikari"],
      tags: post.tags ?? undefined,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post] = await db.select().from(posts).where(and(eq(posts.slug, slug), eq(posts.published, true))).limit(1);
  if (!post) notFound();

  const [approvedComments, likeCount] = await Promise.all([
    db.select().from(comments).where(and(eq(comments.postId, post.id), eq(comments.approved, true))),
    db.select({ count: count() }).from(likes).where(and(eq(likes.postId, post.id), eq(likes.active, true))),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <article>
        <header className="mb-12 space-y-5">
          <div className="flex flex-wrap gap-2">
            {(post.tags ?? []).map((tag) => (
              <span key={tag} className="rounded-full border border-[#2a2a2a] bg-[#111] px-3 py-1 text-xs text-[#888]">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-[#555]">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
            )}
            <span className="w-1 h-1 rounded-full bg-[#333]" />
            <span>{readingTime(post.content)} min read</span>
          </div>
          {post.coverUrl && (
            <img src={post.coverUrl} alt={post.title} className="w-full rounded-2xl object-cover max-h-80 border border-[#1a1a1a]" />
          )}
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-10 pt-8 border-t border-[#1a1a1a]">
          <LikeButton postId={post.id} initialCount={likeCount[0]?.count ?? 0} />
        </div>
      </article>

      <section className="mt-16 pt-8 border-t border-[#1a1a1a]">
        <CommentSection postId={post.id} comments={approvedComments} />
      </section>
    </div>
  );
}
