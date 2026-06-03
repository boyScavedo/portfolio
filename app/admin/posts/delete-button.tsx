"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id, endpoint }: { id: number; endpoint: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Delete? This cannot be undone.")) return;
    await fetch(endpoint, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg border border-red-900/50 px-3 py-1.5 text-xs text-red-500 hover:bg-red-950/30 transition-colors"
    >
      Delete
    </button>
  );
}
