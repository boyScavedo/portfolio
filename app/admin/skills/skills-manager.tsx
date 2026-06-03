"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Skill = { id: number; category: string; name: string; level: number | null; order: number };

export default function SkillsManager({ initial }: { initial: Skill[] }) {
  const router = useRouter();
  const [skills, setSkills] = useState(initial);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, name, level: 80, order }),
    });
    setSaving(false);
    if (res.ok) {
      const skill = await res.json();
      setSkills((s) => [...s, skill]);
      setName("");
    }
  }

  async function remove(id: number) {
    await fetch("/api/admin/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSkills((s) => s.filter((sk) => sk.id !== id));
    router.refresh();
  }

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  const inputClass = "bg-[#0d0d0d] border border-[#2a2a2a] rounded-[2px] px-3 py-2 text-sm font-mono text-[#e0e0e0] placeholder:text-[#444] focus:outline-none focus:border-[#d4f600] transition-colors";

  return (
    <div className="space-y-6">
      <div className="border border-[#1a1a1a] rounded-[2px]">
        <div className="px-4 py-2 border-b border-[#1a1a1a]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// add skill</span>
        </div>
        <form onSubmit={add} className="p-4 flex flex-wrap gap-3 items-end">
          <div className="space-y-1">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#555]">category</label>
            <input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Frontend" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#555]">name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="React" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#555]">order</label>
            <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} className={`w-20 ${inputClass}`} />
          </div>
          <button type="submit" disabled={saving} className="rounded-[2px] bg-[#d4f600] text-black px-4 py-2 text-xs font-mono font-bold hover:bg-white transition-colors disabled:opacity-50">
            {saving ? "adding..." : "+ add"}
          </button>
        </form>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="border border-[#1a1a1a] rounded-[2px] p-8 text-center text-[#444] font-mono text-sm">
          no skills yet — add one above
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="border border-[#1a1a1a] rounded-[2px]">
            <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4f600]">{cat}</span>
              <span className="text-[10px] font-mono text-[#555]">{items.length}</span>
            </div>
            <div className="p-3 flex flex-wrap gap-2">
              {items.map((s) => (
                <div key={s.id} className="group flex items-center gap-1.5 border border-[#2a2a2a] rounded-[2px] px-2.5 py-1 text-xs font-mono text-[#888] hover:border-[#d4f600]/40 transition-colors">
                  {s.name}
                  <button onClick={() => remove(s.id)} className="text-[#444] hover:text-red-400 transition-colors ml-0.5 leading-none" title="Remove">×</button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
