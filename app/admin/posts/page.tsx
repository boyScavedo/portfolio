import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import DeleteButton from "./delete-button";

export default async function AdminPostsPage() {
  const all = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">← Admin</Link>
          <h1 className="text-2xl font-bold mt-1">Posts</h1>
        </div>
        <Link href="/admin/posts/new" className="rounded-lg bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 transition-colors">
          New post
        </Link>
      </div>

      {all.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No posts yet.</p>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800">
          {all.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 gap-4">
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${post.published ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="font-medium truncate">{post.title}</p>
                <p className="text-xs text-neutral-500">{formatDate(post.createdAt)}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/admin/posts/${post.id}`} className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                  Edit
                </Link>
                <DeleteButton id={post.id} endpoint="/api/admin/posts" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
