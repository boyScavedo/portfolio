"use client";

import { useRouter } from "next/navigation";

export default function MessageActions({ id, read }: { id: number; read: boolean }) {
  const router = useRouter();

  async function markRead() {
    const res = await fetch("/api/admin/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.status === 401) { window.location.href = "/admin/login"; return; }
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this message?")) return;
    const res = await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.status === 401) { window.location.href = "/admin/login"; return; }
    router.refresh();
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      {!read && (
        <button onClick={markRead} className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#888] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors">
          Mark read
        </button>
      )}
      <button onClick={remove} className="rounded-lg border border-red-900/50 px-3 py-1.5 text-xs text-red-500 hover:bg-red-950/30 transition-colors">
        Delete
      </button>
    </div>
  );
}
