"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";

type Comment = { id: number; name: string; body: string; createdAt: Date };

export default function CommentSection({ postId, comments }: { postId: number; comments: Comment[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, name, email, body }),
      });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) { setName(""); setEmail(""); setBody(""); }
    } catch {
      setStatus("error");
    }
  }

  const inputClass = "w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#d4f600] transition-colors";

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold">
        Comments {comments.length > 0 && <span className="text-[#555] font-normal text-lg">({comments.length})</span>}
      </h2>

      {comments.length === 0 ? (
        <p className="text-[#555] text-sm">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="rounded-2xl border border-[#1a1a1a] bg-[#111] p-5 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#d4f600]/20 border border-[#d4f600]/30 flex items-center justify-center text-xs font-bold text-[#d4f600] uppercase">
                  {c.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <time className="text-xs text-[#555]">{formatDate(c.createdAt)}</time>
                </div>
              </div>
              <p className="text-sm text-[#888] leading-relaxed pl-11">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-[#1a1a1a] bg-[#111] p-6 space-y-4">
        <h3 className="font-bold text-lg">Leave a comment</h3>
        {status === "done" ? (
          <p className="text-sm text-[#d4f600]">Thanks! Your comment is awaiting moderation.</p>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              <input type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
            <textarea required rows={4} placeholder="Your comment *" value={body} onChange={(e) => setBody(e.target.value)} className={`${inputClass} resize-none`} />
            {status === "error" && <p className="text-sm text-red-500">Something went wrong. Try again.</p>}
            <button type="submit" disabled={status === "loading"} className="rounded-full bg-[#d4f600] text-black px-6 py-2.5 text-sm font-bold hover:bg-white transition-colors disabled:opacity-50">
              {status === "loading" ? "Submitting…" : "Post comment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
