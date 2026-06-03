"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id?: number;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  demoUrl: string;
  githubUrl: string;
  tags: string;
  featured: boolean;
  order: number;
};

export default function ProjectForm({ initial }: { initial?: Partial<Project> }) {
  const router = useRouter();
  const [form, setForm] = useState<Project>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    longDescription: initial?.longDescription ?? "",
    imageUrl: initial?.imageUrl ?? "",
    demoUrl: initial?.demoUrl ?? "",
    githubUrl: initial?.githubUrl ?? "",
    tags: Array.isArray(initial?.tags) ? (initial.tags as unknown as string[]).join(", ") : (initial?.tags ?? ""),
    featured: initial?.featured ?? false,
    order: initial?.order ?? 0,
  });
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      id: initial?.id,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const res = await fetch("/api/admin/projects", {
      method: initial?.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) { router.push("/admin/projects"); router.refresh(); }
  }

  const set = (k: keyof Project, v: string | boolean | number) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Title *" value={form.title} onChange={(v) => set("title", v)} required />
      <Field label="Short description *" value={form.description} onChange={(v) => set("description", v)} required />
      <div className="space-y-1">
        <label className="text-xs font-medium text-[#555] uppercase tracking-wider">Long description</label>
        <textarea rows={4} value={form.longDescription} onChange={(e) => set("longDescription", e.target.value)}
          className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#d4f600] transition-colors resize-none" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Image URL" value={form.imageUrl} onChange={(v) => set("imageUrl", v)} placeholder="https://..." />
        <Field label="Tags (comma-separated)" value={form.tags} onChange={(v) => set("tags", v)} />
        <Field label="Demo URL" value={form.demoUrl} onChange={(v) => set("demoUrl", v)} placeholder="https://..." />
        <Field label="GitHub URL" value={form.githubUrl} onChange={(v) => set("githubUrl", v)} placeholder="https://github.com/..." />
        <div className="space-y-1">
          <label className="text-xs font-medium text-[#555] uppercase tracking-wider">Order</label>
          <input type="number" value={form.order} onChange={(e) => set("order", Number(e.target.value))}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#d4f600] transition-colors" />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
        <span className="text-sm font-medium">Featured on homepage</span>
      </label>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="rounded-full bg-[#d4f600] text-black px-6 py-2.5 text-sm font-bold hover:bg-white transition-colors disabled:opacity-50">
          {saving ? "Saving…" : "Save project"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-full border border-[#2a2a2a] px-6 py-2.5 text-sm text-[#555] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-[#555] uppercase tracking-wider">{label}</label>
      <input required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#d4f600] transition-colors" />
    </div>
  );
}
