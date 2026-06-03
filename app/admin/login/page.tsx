"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Invalid password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 noise relative overflow-hidden">
      <div className="absolute inset-0 bg-[#d4f600]/3 blur-[200px] rounded-full w-96 h-96 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="space-y-1">
          <p className="text-[#555] text-xs uppercase tracking-widest">Admin access</p>
          <h1 className="text-3xl font-bold">Sign in</h1>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#d4f600] transition-colors"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#d4f600] text-black py-3 text-sm font-bold hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>
      </div>
    </div>
  );
}
