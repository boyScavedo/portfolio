"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";

type Comment = {
  id: number;
  name: string;
  body: string;
  createdAt: Date;
};

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
      if (res.ok) {
        setStatus("done");
        setName("");
        setEmail("");
        setBody("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-10">
      <h2 className="text-xl font-semibold">
        Comments {comments.length > 0 && <span className="text-neutral-400 font-normal">({comments.length})</span>}
      </h2>

      {comments.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-semibold uppercase">
                {c.name[0]}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{c.name}</span>
                  <time className="text-neutral-500 dark:text-neutral-400 text-xs">{formatDate(c.createdAt)}</time>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
        <h3 className="font-medium mb-4">Leave a comment</h3>
        {status === "done" ? (
          <p className="text-sm text-green-600 dark:text-green-400">
            Thanks! Your comment is awaiting moderation.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Email (optional, not displayed)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="body" className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                id="body"
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            {status === "error" && (
              <p className="text-sm text-red-500">Something went wrong. Try again.</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Submitting…" : "Submit comment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
