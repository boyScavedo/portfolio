import Link from "next/link";
import PostForm from "../post-form";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/posts" className="text-sm text-[#555] hover:text-white transition-colors">← Posts</Link>
        <h1 className="text-2xl font-bold mt-1">New post</h1>
      </div>
      <PostForm />
    </div>
  );
}
