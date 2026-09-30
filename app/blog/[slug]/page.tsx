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
  // Must match the page's own filter. Querying without `published` leaks an
  // unpublished draft's title and excerpt into the served <head> even though
  // the body renders a 404.
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.published, true)))
    .limit(1);
  if (!post) return { robots: { index: false, follow: false } };
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const ogImage = post.coverUrl
    ? { url: post.coverUrl, width: 1200, height: 630, alt: post.title }
    : { url: `${base}/opengraph-image`, width: 1200, height: 630, alt: "Jeevan Adhikari" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    robots: { index: true, follow: true },
    alternates: { canonical: `${base}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      url: `${base}/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
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

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const canonical = `${base}/blog/${post.slug}`;
  const image = post.coverUrl ?? `${base}/opengraph-image`;

  // BlogPosting (a subtype of Article) is what makes a post eligible for rich
  // results. Author points at the Person node in the root layout via @id.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonical}#post`,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: [image],
    author: { "@id": `${base}/#person` },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    inLanguage: "en-US",
    isPartOf: { "@id": `${base}/#website` },
    keywords: (post.tags ?? []).join(", ") || undefined,
  };

  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
