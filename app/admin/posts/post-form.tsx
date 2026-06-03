"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  function set(key: keyof Post, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
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
        <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Content (Markdown) *</label>
        <textarea
          required
          rows={20}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          className="w-full font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="rounded" />
        <span className="text-sm font-medium">Published</span>
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-lg bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 transition-colors disabled:opacity-50">
          {saving ? "Saving…" : "Save post"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
          Cancel
        </button>
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
      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{label}</label>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
