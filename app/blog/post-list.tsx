"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import TagCombobox from "@/components/tag-combobox";
import { formatDate, readingTime } from "@/lib/utils";

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  tags: string[] | null;
  publishedAt: Date | null;
};

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function PostList({ posts, allTags }: { posts: Post[]; allTags: string[] }) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, 250);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchTag = activeTags.length === 0 || activeTags.every((t) => (p.tags ?? []).includes(t));
      const q = debouncedQuery.toLowerCase();
      const matchQuery = !q || p.title.toLowerCase().includes(q) || (p.excerpt ?? "").toLowerCase().includes(q);
      return matchTag && matchQuery;
    });
  }, [posts, debouncedQuery, activeTags]);

  return (
    <div className="space-y-6">
      {/* Search + filter */}
      <div className="border border-[#1a1a1a] rounded-[2px]">
        <div className="px-3 py-1.5 border-b border-[#1a1a1a]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// search & filter</span>
        </div>
        <div className="p-3 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[#555] font-mono text-xs">$</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="grep posts..."
              className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-[#e0e0e0] placeholder:text-[#333]"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-[#444] hover:text-[#e0e0e0] font-mono text-xs transition-colors">x</button>
            )}
          </div>
          {allTags.length > 0 && (
            <TagCombobox allTags={allTags} selected={activeTags} onChange={setActiveTags} />
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="font-mono text-xs text-[#444]">
        {filtered.length === posts.length ? `${posts.length} posts` : `${filtered.length} / ${posts.length} posts`}
      </div>

      {/* Post list */}
      {filtered.length === 0 ? (
        <div className="border border-[#1a1a1a] rounded-[2px] p-12 text-center text-[#444] font-mono text-sm">
          no results found
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex items-center justify-between border border-[#1a1a1a] rounded-[2px] p-4 hover:border-[#d4f600]/30 hover:bg-[#0d0d0d] transition-all gap-4"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-3 text-[10px] font-mono text-[#555]">
                  {post.publishedAt && <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>}
                  <span>·</span>
                  <span>{readingTime(post.content)} min read</span>
                </div>
                <h2 className="font-mono font-bold text-sm text-[#e0e0e0] group-hover:text-[#d4f600] transition-colors truncate">{post.title}</h2>
                {post.excerpt && <p className="text-xs font-mono text-[#555] line-clamp-1">{post.excerpt}</p>}
                <div className="flex flex-wrap gap-1">
                  {(post.tags ?? []).map((tag) => (
                    <span key={tag} className="rounded-[2px] border border-[#222] px-1.5 py-0.5 text-[10px] font-mono text-[#444]">{tag}</span>
                  ))}
                </div>
              </div>
              <span className="text-[#444] group-hover:text-[#d4f600] transition-all flex-shrink-0 font-mono text-sm">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
