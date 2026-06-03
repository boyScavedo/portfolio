"use client";

import { useState } from "react";
import Turnstile from "@/components/turnstile";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", body: "" });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaToken) {
      setErrorMsg("Complete the captcha first.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg((data as { error?: string }).error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Try again.");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-[2px] border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2.5 text-sm font-mono text-[#e0e0e0] placeholder:text-[#444] focus:outline-none focus:border-[#d4f600]/50 transition-colors";

  if (status === "done") {
    return (
      <div className="border border-[#d4f600]/30 rounded-[2px] bg-[#d4f600]/5 p-10 text-center space-y-3">
        <p className="font-mono font-bold text-lg text-[#d4f600]">// message sent</p>
        <p className="font-mono text-xs text-[#666]">i&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <div className="border border-[#1a1a1a] rounded-[2px]">
      <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#d4f600]/40" />
        <span className="text-[10px] font-mono text-[#555] ml-1">message.sh</span>
      </div>
      <form onSubmit={submit} className="p-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#555] uppercase tracking-widest">name *</label>
            <input required value={form.name} onChange={set("name")} placeholder="Jeevan Adhikari" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-[#555] uppercase tracking-widest">email *</label>
            <input required type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className={inputClass} />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-[#555] uppercase tracking-widest">subject</label>
          <input value={form.subject} onChange={set("subject")} placeholder="project collaboration, question..." className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-[#555] uppercase tracking-widest">message *</label>
          <textarea required rows={5} value={form.body} onChange={set("body")} placeholder="tell me what you&apos;re thinking..." className={`${inputClass} resize-none`} />
        </div>
        <Turnstile onToken={setCaptchaToken} />
        {status === "error" && <p className="text-xs font-mono text-red-400">// error: {errorMsg}</p>}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full rounded-[2px] bg-[#d4f600] text-black py-2.5 text-xs font-mono font-bold hover:bg-white transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "$ sending..." : "$ send message →"}
        </button>
      </form>
    </div>
  );
}
