"use client";

import { useRouter } from "next/navigation";

export default function CommentActions({ id, approved }: { id: number; approved: boolean }) {
  const router = useRouter();

  async function approve() {
    await fetch("/api/admin/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved: true }),
    });
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this comment?")) return;
    await fetch("/api/admin/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      {!approved && (
        <button onClick={approve} className="rounded-lg border border-green-200 dark:border-green-800 px-3 py-1.5 text-xs text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-colors">
          Approve
        </button>
      )}
      <button onClick={remove} className="rounded-lg border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
        Delete
      </button>
    </div>
  );
}
