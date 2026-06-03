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
        <label className="text-xs font-medium text-[#555] uppercase tracking-wider">Content (Markdown) *</label>
        <textarea
          required
          rows={20}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          className="w-full font-mono rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#d4f600] transition-colors resize-y"
        />
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
