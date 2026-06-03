import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { posts, comments, likes } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import { formatDate, readingTime } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LikeButton from "./like-button";
import CommentSection from "./comment-section";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.coverUrl ? [post.coverUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);

  if (!post) notFound();

  const [approvedComments, likeCount] = await Promise.all([
    db.select().from(comments).where(and(eq(comments.postId, post.id), eq(comments.approved, true))),
    db.select({ count: count() }).from(likes).where(eq(likes.postId, post.id)),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <article>
        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap gap-1">
            {(post.tags ?? []).map((tag) => (
              <span key={tag} className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-snug">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
            )}
            <span>{readingTime(post.content)} min read</span>
          </div>
          {post.coverUrl && (
            <img src={post.coverUrl} alt={post.title} className="w-full rounded-xl object-cover max-h-80" />
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-10 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <LikeButton postId={post.id} initialCount={likeCount[0]?.count ?? 0} />
        </div>
      </article>

      <section className="mt-16">
        <CommentSection postId={post.id} comments={approvedComments} />
      </section>
    </div>
  );
}
