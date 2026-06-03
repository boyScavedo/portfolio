import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";
import DeleteButton from "./delete-button";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const all = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-[#555] hover:text-white transition-colors">← Admin</Link>
          <h1 className="text-2xl font-bold mt-1 text-white">Posts</h1>
        </div>
        <Link href="/admin/posts/new" className="rounded-full bg-[#d4f600] text-black px-6 py-2.5 text-sm font-bold hover:bg-white transition-colors">
          New post
        </Link>
      </div>

      {all.length === 0 ? (
        <p className="text-[#555]">No posts yet.</p>
      ) : (
        <div className="divide-y divide-[#2a2a2a] rounded-xl border border-[#2a2a2a]">
          {all.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 gap-4">
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${post.published ? "bg-[#d4f600]/10 border border-[#d4f600]/20 text-[#d4f600]" : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#555]"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="font-medium truncate text-white">{post.title}</p>
                <p className="text-xs text-[#555]">{formatDate(post.createdAt)}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/admin/posts/${post.id}`} className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#555] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors">
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
