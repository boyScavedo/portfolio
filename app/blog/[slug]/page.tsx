import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { posts, comments, likes } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";
import PostArticle from "@/components/post-article";
import LikeButton from "./like-button";
import CommentSection from "./comment-section";

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
      <PostArticle post={post} />

      <div className="mt-10 pt-8 border-t border-[#1a1a1a]">
        <LikeButton postId={post.id} initialCount={likeCount[0]?.count ?? 0} />
      </div>

      <section className="mt-16 pt-8 border-t border-[#1a1a1a]">
        <CommentSection postId={post.id} comments={approvedComments} />
      </section>
    </div>
  );
}
