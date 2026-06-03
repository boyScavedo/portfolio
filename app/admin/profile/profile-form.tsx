"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/profile";

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available for work", desc: "Actively looking for new opportunities" },
  { value: "open_to_offers", label: "Open to offers", desc: "Employed but open to better opportunities" },
  { value: "freelancing", label: "Freelancing", desc: "Currently working as a freelancer" },
  { value: "employed", label: "Employed", desc: "Working full-time, not looking" },
  { value: "busy", label: "Not available", desc: "Focused, not taking new work" },
];

const WORK_TYPE_OPTIONS = [
  { value: "fulltime", label: "Full-time roles" },
  { value: "freelance", label: "Freelance / contract" },
  { value: "both", label: "Both full-time & freelance" },
  { value: "none", label: "Not looking" },
];

export default function ProfileForm({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial.name ?? "Jeevan Adhikari",
    role: initial.role ?? "Full Stack Engineer",
    tagline: initial.tagline ?? "",
    bio: initial.bio ?? "",
    availabilityStatus: initial.availabilityStatus ?? "available",
    currentCompany: initial.currentCompany ?? "",
    currentCompanyUrl: initial.currentCompanyUrl ?? "",
    workType: initial.workType ?? "fulltime",
    openToWork: initial.openToWork ?? true,
    location: initial.location ?? "Nepal",
    githubUrl: initial.githubUrl ?? "",
    youtubeUrl: initial.youtubeUrl ?? "",
    twitterUrl: initial.twitterUrl ?? "",
    linkedinUrl: initial.linkedinUrl ?? "",
    resumeUrl: initial.resumeUrl ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, openToWork: form.availabilityStatus !== "busy" && form.availabilityStatus !== "employed" }),
    });
    setSaving(false);
    if (res.ok) { setSaved(true); router.refresh(); }
  }

  const inputClass = "w-full rounded-xl border border-[#2a2a2a] bg-[#0d0d0d] px-4 py-3 text-sm text-white placeholder:text-[#444] focus:outline-none focus:border-[#d4f600] transition-colors";
  const labelClass = "block text-xs font-bold text-[#555] uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* Availability — most important, shown first */}
      <div className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-6 space-y-5">
        <h2 className="font-bold text-lg text-[#d4f600]">Work Status</h2>
        <div className="grid gap-3">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                form.availabilityStatus === opt.value
                  ? "border-[#d4f600]/40 bg-[#d4f600]/5"
                  : "border-[#1a1a1a] hover:border-[#2a2a2a]"
              }`}
            >
              <input
                type="radio"
                name="availabilityStatus"
                value={opt.value}
                checked={form.availabilityStatus === opt.value}
                onChange={set("availabilityStatus")}
                className="accent-[#d4f600]"
              />
              <div>
                <p className="font-semibold text-sm">{opt.label}</p>
                <p className="text-xs text-[#555]">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className={labelClass}>Open to</label>
            <select value={form.workType} onChange={set("workType")} className={inputClass}>
              {WORK_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Current company (if employed)</label>
            <input value={form.currentCompany} onChange={set("currentCompany")} placeholder="Company name" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Company URL (optional)</label>
            <input value={form.currentCompanyUrl} onChange={set("currentCompanyUrl")} placeholder="https://company.com" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Identity */}
      <div className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-6 space-y-4">
        <h2 className="font-bold text-lg">Identity</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Name</label>
            <input required value={form.name} onChange={set("name")} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Role / Title</label>
            <input value={form.role} onChange={set("role")} placeholder="Full Stack Engineer" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input value={form.location} onChange={set("location")} placeholder="Nepal" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Tagline (shown in hero)</label>
          <input value={form.tagline} onChange={set("tagline")} placeholder="Building things for the web & beyond." className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Bio (shown on about page)</label>
          <textarea rows={4} value={form.bio} onChange={set("bio")} placeholder="A few sentences about yourself..." className={`${inputClass} resize-none`} />
        </div>
      </div>

      {/* Links */}
      <div className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-6 space-y-4">
        <h2 className="font-bold text-lg">Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: "githubUrl" as const, label: "GitHub URL" },
            { key: "youtubeUrl" as const, label: "YouTube URL" },
            { key: "twitterUrl" as const, label: "Twitter / X URL" },
            { key: "linkedinUrl" as const, label: "LinkedIn URL" },
            { key: "resumeUrl" as const, label: "Resume / CV URL" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input value={form[key]} onChange={set(key)} placeholder="https://..." className={inputClass} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="rounded-full bg-[#d4f600] text-black px-8 py-3 text-sm font-bold hover:bg-white transition-colors disabled:opacity-50">
          {saving ? "Saving…" : "Save profile"}
        </button>
        {saved && <p className="text-sm text-[#d4f600]">Saved!</p>}
      </div>
    </form>
  );
}
