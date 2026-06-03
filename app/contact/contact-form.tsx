"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#d4f600] transition-colors";

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-[#d4f600]/30 bg-[#d4f600]/5 p-10 text-center space-y-3">
        <p className="text-3xl">👋</p>
        <p className="font-bold text-xl text-[#d4f600]">Message sent!</p>
        <p className="text-[#888] text-sm">I&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[#1a1a1a] bg-[#111] p-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#555] uppercase tracking-wider">Name *</label>
          <input required value={form.name} onChange={set("name")} placeholder="Jeevan Shrestha" className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#555] uppercase tracking-wider">Email *</label>
          <input required type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputClass} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#555] uppercase tracking-wider">Subject</label>
        <input value={form.subject} onChange={set("subject")} placeholder="Project collaboration, question…" className={inputClass} />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#555] uppercase tracking-wider">Message *</label>
        <textarea required rows={5} value={form.body} onChange={set("body")} placeholder="Tell me what you're thinking…" className={`${inputClass} resize-none`} />
      </div>
      {status === "error" && <p className="text-sm text-red-400">Something went wrong. Try again.</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-[#d4f600] text-black py-3 text-sm font-bold hover:bg-white transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}
