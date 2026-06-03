"use client";

import { useState, useRef, useEffect, useMemo } from "react";

type Props = {
  allTags: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

export default function TagCombobox({ allTags, selected, onChange, placeholder = "filter by tag..." }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = query.toLowerCase();
    return allTags.filter((t) => !selected.includes(t) && (!q || t.toLowerCase().includes(q)));
  }, [allTags, selected, query]);

  function select(tag: string) {
    onChange([...selected, tag]);
    setQuery("");
  }

  function remove(tag: string) {
    onChange(selected.filter((t) => t !== tag));
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex flex-wrap gap-1.5 items-center rounded-[2px] border border-[#2a2a2a] bg-[#0d0d0d] px-2 py-1.5 focus-within:border-[#d4f600]/50 transition-colors min-h-[32px]">
        {selected.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-[2px] border border-[#d4f600]/40 bg-[#d4f600]/10 px-1.5 py-0.5 text-[10px] font-mono text-[#d4f600]">
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="hover:text-white transition-colors leading-none"
            >
              x
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-xs font-mono text-[#e0e0e0] placeholder:text-[#444]"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-20 mt-1 border border-[#2a2a2a] rounded-[2px] bg-[#0d0d0d] max-h-48 overflow-y-auto">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onMouseDown={(e) => { e.preventDefault(); select(tag); }}
              className="w-full text-left px-3 py-1.5 text-xs font-mono text-[#888] hover:bg-[#1a1a1a] hover:text-[#d4f600] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
