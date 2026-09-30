"use client";

import { useState } from "react";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  tags: string[] | null;
};

/**
 * Publishes a draft through the existing admin PUT route. Deliberately reuses
 * that endpoint rather than adding a publish-specific API — one code path for
 * "make this live" means the form and this button cannot drift apart.
 */
export default function PublishButton({ post }: { post: Post }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function publish() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverUrl: post.coverUrl,
          tags: post.tags ?? [],
          published: true,
        }),
      });
      if (!res.ok) throw new Error(`Publish failed (${res.status})`);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md border border-[#d4f600]/30 bg-[#d4f600]/5 px-3 py-2 font-mono text-xs text-[#d4f600]">
          Published
        </span>
        <a
          href={`/blog/${post.slug}`}
          className="rounded-md bg-[#d4f600] px-4 py-2 font-mono text-xs font-semibold text-black transition-opacity hover:opacity-85"
        >
          View live post →
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={publish}
        disabled={busy}
        className="rounded-md bg-[#d4f600] px-4 py-2 font-mono text-xs font-semibold text-black transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? "Publishing…" : "Publish"}
      </button>
      {error && <span className="font-mono text-xs text-red-400">{error}</span>}
    </div>
  );
}