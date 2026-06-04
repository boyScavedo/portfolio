import type { Metadata } from "next";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import ProjectList from "./project-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I build and use - personal tools, experiments, and side projects.",
};

export default async function ProjectsPage() {
  const allProjects = await db.select().from(projects).orderBy(asc(projects.order));
  const allTags = Array.from(new Set(allProjects.flatMap((p) => p.tags ?? [])));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 w-full">
      <div className="mb-8 space-y-1">
        <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest">~/projects</p>
        <h1 className="font-mono font-black text-4xl text-[#e0e0e0]">
          projects<span className="text-[#d4f600]">_</span>
        </h1>
        <p className="text-xs font-mono text-[#555]">
          {allProjects.length} project{allProjects.length !== 1 ? "s" : ""} · tools I build and use daily
        </p>
      </div>

      <ProjectList projects={allProjects} allTags={allTags} />
    </div>
  );
}
