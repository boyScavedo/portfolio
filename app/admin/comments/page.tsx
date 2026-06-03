import Link from "next/link";
import { db } from "@/db";
import { comments, posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import CommentActions from "./comment-actions";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const all = await db
    .select({ comment: comments, postTitle: posts.title, postSlug: posts.slug })
    .from(comments)
    .leftJoin(posts, eq(comments.postId, posts.id))
    .orderBy(desc(comments.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">← Admin</Link>
        <h1 className="text-2xl font-bold mt-1">Comments</h1>
      </div>

      {all.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {all.map(({ comment, postTitle, postSlug }) => (
            <div key={comment.id} className={`rounded-xl border p-5 space-y-3 ${comment.approved ? "border-neutral-200 dark:border-neutral-800" : "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.name}</span>
                    {!comment.approved && (
                      <span className="rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 px-2 py-0.5 text-xs font-medium">Pending</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">{formatDate(comment.createdAt)}</p>
                  {postTitle && (
                    <Link href={`/blog/${postSlug}`} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                      on: {postTitle}
                    </Link>
                  )}
                </div>
                <CommentActions id={comment.id} approved={comment.approved} />
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{comment.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
