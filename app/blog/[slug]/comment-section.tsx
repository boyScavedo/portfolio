"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import Turnstile from "@/components/turnstile";

type Comment = { id: number; name: string; body: string; createdAt: Date };

function ReportButton({ commentId }: { commentId: number }) {
  const [done, setDone] = useState(false);

  async function report() {
    if (done) return;
    await fetch("/api/comments/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });
    setDone(true);
  }

  return (
    <button
      onClick={report}
      className={`text-[10px] font-mono transition-colors ${done ? "text-red-400 cursor-default" : "text-[#444] hover:text-red-400"}`}
    >
      {done ? "reported" : "report"}
    </button>
  );
}

export default function CommentSection({ postId, comments }: { postId: number; comments: Comment[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error" | "captcha">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [localComments, setLocalComments] = useState(comments);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaToken) {
      setStatus("captcha");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, name, email, body, captchaToken }),
      });
      if (res.ok) {
        setStatus("done");
        setLocalComments((prev) => [
          ...prev,
          { id: Date.now(), name: name.trim(), body: body.trim(), createdAt: new Date() },
        ]);
        setName(""); setEmail(""); setBody(""); setCaptchaToken(null);
        setTimeout(() => setStatus("idle"), 3000);
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

  const inputClass = "w-full rounded-[2px] border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm font-mono text-[#e0e0e0] placeholder:text-[#444] focus:outline-none focus:border-[#d4f600]/50 transition-colors";

  return (
    <div className="space-y-6">
      <div className="border border-[#1a1a1a] rounded-[2px]">
        <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// comments</span>
          <span className="text-[10px] font-mono text-[#444]">{localComments.length}</span>
        </div>

        {localComments.length === 0 ? (
          <div className="p-6 text-xs font-mono text-[#444]">no comments yet — be the first.</div>
        ) : (
          <div className="divide-y divide-[#1a1a1a]">
            {localComments.map((c) => (
              <div key={c.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-[2px] border border-[#2a2a2a] bg-[#d4f600]/10 flex items-center justify-center text-[10px] font-bold font-mono text-[#d4f600] uppercase flex-shrink-0">
                      {c.name[0]}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#e0e0e0]">{c.name}</span>
                    <time className="text-[10px] font-mono text-[#444]">{formatDate(c.createdAt)}</time>
                  </div>
                  <ReportButton commentId={c.id} />
                </div>
                <p className="text-xs font-mono text-[#888] leading-relaxed pl-8">{c.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border border-[#1a1a1a] rounded-[2px]">
        <div className="px-4 py-2 border-b border-[#1a1a1a]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// leave a comment</span>
        </div>
        <form onSubmit={submit} className="p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="name *" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            <input type="email" placeholder="email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
          <textarea required rows={4} placeholder="your comment *" value={body} onChange={(e) => setBody(e.target.value)} className={`${inputClass} resize-none`} />
          <Turnstile onToken={setCaptchaToken} />
          {status === "captcha" && <p className="text-xs font-mono text-yellow-400">// complete the captcha first.</p>}
          {status === "error" && <p className="text-xs font-mono text-red-400">// error: {errorMsg}</p>}
          {status === "done" && <p className="text-xs font-mono text-[#d4f600]">// comment posted.</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-[2px] bg-[#d4f600] text-black px-5 py-2 text-xs font-mono font-bold hover:bg-white transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "$ posting..." : "$ post comment"}
          </button>
        </form>
      </div>
    </div>
  );
}
