"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import TagCombobox from "@/components/tag-combobox";

type Project = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  tags: string[] | null;
  featured: boolean;
  status: string;
};

const STATUS_LABELS: Record<string, string> = {
  active: "active",
  planned: "planned",
  scrapped: "scrapped",
  personal: "personal",
};

const STATUS_COLORS: Record<string, string> = {
  active: "text-[#d4f600]",
  planned: "text-blue-400",
  scrapped: "text-red-400",
  personal: "text-purple-400",
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ProjectList({ projects, allTags }: { projects: Project[]; allTags: string[] }) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [activeStatus, setActiveStatus] = useState("");
  const debouncedQuery = useDebounce(query, 250);

  const statuses = Array.from(new Set(projects.map((p) => p.status)));

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchTag = activeTags.length === 0 || activeTags.every((t) => (p.tags ?? []).includes(t));
      const matchStatus = !activeStatus || p.status === activeStatus;
      const q = debouncedQuery.toLowerCase();
      const matchQuery = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchTag && matchStatus && matchQuery;
    });
  }, [projects, debouncedQuery, activeTags, activeStatus]);

  return (
    <div className="space-y-6">
      <div className="border border-[#1a1a1a] rounded-[2px]">
        <div className="px-3 py-1.5 border-b border-[#1a1a1a]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// filter</span>
        </div>
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[#555] font-mono text-xs">$</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="grep projects..."
              className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-[#e0e0e0] placeholder:text-[#333]"
            />
            {query && <button onClick={() => setQuery("")} className="text-[#444] hover:text-[#e0e0e0] font-mono text-xs transition-colors">x</button>}
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(activeStatus === s ? "" : s)}
                className={`rounded-[2px] border px-2.5 py-0.5 text-xs font-mono transition-colors ${
                  activeStatus === s
                    ? `${STATUS_COLORS[s] ?? "text-[#999]"} border-current bg-[#1a1a1a]`
                    : "border-[#2a2a2a] text-[#555] hover:border-[#555]"
                }`}
              >
                {STATUS_LABELS[s] ?? s}
              </button>
            ))}
            {allTags.length > 0 && (
              <div className="w-full">
                <TagCombobox allTags={allTags} selected={activeTags} onChange={setActiveTags} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="font-mono text-xs text-[#444]">
        {filtered.length === projects.length ? `${projects.length} projects` : `${filtered.length} / ${projects.length} projects`}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-[#1a1a1a] rounded-[2px] p-12 text-center text-[#444] font-mono text-sm">
          no results found
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="relative group border border-[#1a1a1a] rounded-[2px] overflow-hidden hover:border-[#d4f600]/30 transition-all flex flex-col">
              <Link href={`/projects/${p.id}`} className="absolute inset-0 z-0" aria-label={p.title} />
              <div className="px-3 py-2 border-b border-[#1a1a1a] flex items-center justify-between bg-[#0d0d0d]">
                <span className={`text-[10px] font-mono ${STATUS_COLORS[p.status] ?? "text-[#555]"}`}>
                  {STATUS_LABELS[p.status] ?? p.status}
                </span>
                {p.featured && <span className="text-[10px] font-mono text-[#d4f600]">* featured</span>}
              </div>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} className="w-full h-32 object-cover" />
              ) : (
                <div className="w-full h-16 bg-[#0d0d0d] flex items-center justify-center">
                  <span className="font-mono font-black text-3xl text-[#1e1e1e]">{p.title[0]}</span>
                </div>
              )}
              <div className="p-4 flex flex-col flex-1 gap-2">
                <h2 className="font-mono font-bold text-sm text-[#e0e0e0] group-hover:text-[#d4f600] transition-colors">{p.title}</h2>
                <p className="text-xs font-mono text-[#555] flex-1 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {(p.tags ?? []).slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-[2px] border border-[#222] px-1.5 py-0.5 text-[10px] font-mono text-[#444]">{tag}</span>
                  ))}
                </div>
                <div className="relative z-10 flex gap-3 pt-2 border-t border-[#1a1a1a] items-center">
                  {p.demoUrl && (
                    <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-[#d4f600] hover:underline">live ↗</a>
                  )}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-[#555] hover:text-[#999] transition-colors">github ↗</a>
                  )}
                  <span className="ml-auto text-[10px] font-mono text-[#444] group-hover:text-[#d4f600] transition-colors">details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
