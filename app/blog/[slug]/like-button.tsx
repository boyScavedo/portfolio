"use client";

import { useState } from "react";

export default function LikeButton({ postId, initialCount }: { postId: number; initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (liked || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) { setCount((c) => c + 1); setLiked(true); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={`flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-bold transition-all ${
        liked
          ? "border-[#d4f600] bg-[#d4f600]/10 text-[#d4f600]"
          : "border-[#333] text-[#888] hover:border-[#d4f600] hover:text-[#d4f600]"
      }`}
    >
      <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {count} {count === 1 ? "like" : "likes"}
    </button>
  );
}
