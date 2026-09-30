import { notFound } from "next/navigation";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import PostArticle from "@/components/post-article";
import PublishButton from "./publish-button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

/**
 * Full-article preview of a draft, using the same renderer as /blog/[slug].
 *
 * This exists because the public article route filters on `published = true`,
 * so a draft has no reachable URL otherwise — which would leave the email
 * notification pointing at a 404. Guarded by the existing /admin middleware.
 */
export default async function PreviewPostPage({ params }: Props) {
  const { id } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.id, Number(id))).limit(1);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 pb-20">
      <div className="mb-10 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={`/admin/posts/${post.id}`}
            className="text-sm text-[#555] transition-colors hover:text-white"
          >
            ← Edit
          </Link>
          <Link
            href="/admin/posts"
            className="text-sm text-[#555] transition-colors hover:text-white"
          >
            All posts
          </Link>
        </div>

        {post.published ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-[#2a2a2a] bg-[#111] px-3 py-2 font-mono text-xs text-[#888]">
              Already published
            </span>
            <a
              href={`/blog/${post.slug}`}
              className="rounded-md border border-[#2a2a2a] px-4 py-2 font-mono text-xs text-[#e0e0e0] transition-colors hover:border-[#d4f600] hover:text-[#d4f600]"
            >
              View live post →
            </a>
          </div>
        ) : (
          <>
            <PublishButton post={post} />
            <p className="font-mono text-xs text-[#555]">
              Not visible on the site until you publish.
            </p>
          </>
        )}
      </div>

      <PostArticle
        post={post}
        banner={post.published ? undefined : "Draft preview — this is what the published post will look like."}
      />
    </div>
  );
}