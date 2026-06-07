"use client";

import { useState, useEffect } from "react";

export default function LikeButton({ postId, initialCount }: { postId: number; initialCount: number }) {
  const [total, setTotal] = useState(initialCount);
  const [userLikes, setUserLikes] = useState(0);
  const [slotsUsed, setSlotsUsed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/likes?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.total);
        setUserLikes(data.userLikes);
        setSlotsUsed(data.slotsUsed);
      })
      .catch(() => {});
  }, [postId]);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (data.action === "liked") {
        setTotal((c) => c + 1);
        setUserLikes(1);
        setSlotsUsed((c) => c + 1);
      } else if (data.action === "unliked") {
        setTotal((c) => Math.max(0, c - 1));
        setUserLikes(0);
      } else if (data.action === "blocked") {
        setError("Max likes reached");
      } else if (res.status === 429) {
        setError("Too many requests");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const atMax = slotsUsed >= 5;

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={loading || (atMax && userLikes === 0)}
        className={`flex items-center gap-2 rounded-sm border px-6 py-2.5 text-sm font-mono font-bold transition-all ${
          userLikes > 0
            ? "border-[#d4f600] bg-[#d4f600]/10 text-[#d4f600]"
            : atMax
              ? "border-[#333] text-[#555] opacity-50 cursor-not-allowed"
              : "border-[#333] text-[#888] hover:border-[#d4f600] hover:text-[#d4f600]"
        }`}
      >
        <svg className="w-4 h-4" fill={userLikes > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {total}
      </button>
      {error && <span className="text-xs text-red-400 font-mono">{error}</span>}
    </div>
  );
}
