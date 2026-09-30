"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownComponents } from "@/lib/markdown";

type Post = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  tags: string;
  published: boolean;
};

export default function PostForm({ initial }: { initial?: Partial<Post> }) {
  const router = useRouter();
  const [form, setForm] = useState<Post>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    coverUrl: initial?.coverUrl ?? "",
    tags: Array.isArray(initial?.tags) ? (initial.tags as unknown as string[]).join(", ") : (initial?.tags ?? ""),
    published: initial?.published ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"write" | "preview">("write");

  function set(key: keyof Post, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.content.trim()) {
      setError("Content is required.");
      setTab("write");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      id: initial?.id,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const res = await fetch("/api/admin/posts", {
      method: initial?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      setError("Save failed. Try again.");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Title *" value={form.title} onChange={(v) => set("title", v)} required />
        <Field label="Slug" value={form.slug} onChange={(v) => set("slug", v)} placeholder="auto-generated if empty" />
      </div>
      <Field label="Excerpt" value={form.excerpt} onChange={(v) => set("excerpt", v)} placeholder="Short summary" />
      <Field label="Cover image URL" value={form.coverUrl} onChange={(v) => set("coverUrl", v)} placeholder="https://..." />
      <Field label="Tags (comma-separated)" value={form.tags} onChange={(v) => set("tags", v)} placeholder="nextjs, react, tutorial" />
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-[#555] uppercase tracking-wider">Content (Markdown) *</label>
          <div className="flex gap-1 rounded-lg border border-[#2a2a2a] bg-[#111] p-0.5">
            {(["write", "preview"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1 font-mono text-xs capitalize transition-colors ${
                  tab === t ? "bg-[#d4f600] text-black" : "text-[#555] hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === "write" ? (
          <textarea
            required
            rows={20}
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            className="w-full font-mono rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#d4f600] transition-colors resize-y"
          />
        ) : (
          // Same renderer as the live article, so what you see here is what publishes.
          <div className="min-h-[20rem] rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-5 py-4">
            <div className="prose prose-lg max-w-none prose-invert">
              {form.content.trim() ? (
                <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                  {form.content}
                </ReactMarkdown>
              ) : (
                <p className="text-sm text-[#555]">Nothing to preview yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="rounded" />
        <span className="text-sm font-medium">Published</span>
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-full bg-[#d4f600] text-black px-6 py-2.5 text-sm font-bold hover:bg-white transition-colors disabled:opacity-50">
          {saving ? "Saving…" : "Save post"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-full border border-[#2a2a2a] px-6 py-2.5 text-sm text-[#555] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors">
          Cancel
        </button>
        {initial?.id && (
          <a
            href={`/admin/posts/${initial.id}/preview`}
            className="rounded-full border border-[#2a2a2a] px-6 py-2.5 text-sm text-[#555] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors"
          >
            Full preview
          </a>
        )}
      </div>
    </form>
  );
}

function Field({ label, value, onChange, placeholder, required }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-[#555] uppercase tracking-wider">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#d4f600] transition-colors"
      />
    </div>
  );
}
