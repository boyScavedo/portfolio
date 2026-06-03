"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Skill = { id: number; category: string; name: string; level: number | null; order: number };

export default function SkillsManager({ initial }: { initial: Skill[] }) {
  const router = useRouter();
  const [skills, setSkills] = useState(initial);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [level] = useState(80);
  const [order, setOrder] = useState(0);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, name, level, order }),
    });
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

  return (
    <div className="space-y-8">
      <form onSubmit={add} className="flex flex-wrap gap-3 items-end rounded-xl border border-neutral-200 dark:border-neutral-800 p-5">
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Category</label>
          <input required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Frontend"
            className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Skill name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="React"
            className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))}
            className="w-20 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button type="submit" className="rounded-lg bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 transition-colors">
          Add skill
        </button>
      </form>

      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500">{cat}</h3>
          <div className="flex flex-wrap gap-2">
            {items.map((s) => (
              <div key={s.id} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm">
                {s.name}
                <button onClick={() => remove(s.id)} className="text-neutral-400 hover:text-red-500 transition-colors ml-1">×</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
