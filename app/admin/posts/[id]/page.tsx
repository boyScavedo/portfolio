import { notFound } from "next/navigation";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import PostForm from "../post-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const [post] = await db.select().from(posts).where(eq(posts.id, Number(id))).limit(1);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit post</h1>
      <PostForm initial={{ ...post, tags: (post.tags ?? []).join(", "), excerpt: post.excerpt ?? "", coverUrl: post.coverUrl ?? "" }} />
    </div>
  );
}
