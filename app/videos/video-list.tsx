"use client";

import { useState, useMemo, useEffect } from "react";
import { formatDate } from "@/lib/utils";

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function VideoList({ videos }: { videos: Video[] }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    return !q ? videos : videos.filter((v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q));
  }, [videos, debouncedQuery]);

  if (videos.length === 0) {
    return (
      <div className="border border-[#1a1a1a] rounded-[2px] p-12 text-center">
        <p className="font-mono text-xs text-[#444]">no videos yet · check back soon</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="border border-[#1a1a1a] rounded-[2px]">
        <div className="px-3 py-1.5 border-b border-[#1a1a1a]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// search</span>
        </div>
        <div className="p-3 flex items-center gap-2">
          <span className="text-[#555] font-mono text-xs">$</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="grep videos..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-[#e0e0e0] placeholder:text-[#333]"
          />
          {query && <button onClick={() => setQuery("")} className="text-[#444] hover:text-[#e0e0e0] font-mono text-xs transition-colors">x</button>}
        </div>
      </div>

      <div className="font-mono text-xs text-[#444]">
        {filtered.length === videos.length ? `${videos.length} videos` : `${filtered.length} / ${videos.length} videos`}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#1a1a1a] rounded-[2px] p-12 text-center text-[#444] font-mono text-sm">
          no results found
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <a
              key={v.id}
              href={v.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-[#1a1a1a] rounded-[2px] overflow-hidden hover:border-[#d4f600]/30 transition-all block"
            >
              <div className="relative">
                <img src={v.thumbnail} alt={v.title} className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-[2px] bg-[#d4f600] flex items-center justify-center">
                    <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="px-3 py-2 border-t border-[#1a1a1a]">
                <p className="text-[10px] font-mono text-[#444] mb-1">{formatDate(new Date(v.publishedAt))}</p>
                <h2 className="text-xs font-mono font-bold text-[#e0e0e0] line-clamp-2 group-hover:text-[#d4f600] transition-colors">{v.title}</h2>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
