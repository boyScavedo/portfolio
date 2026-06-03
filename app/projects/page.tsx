import type { Metadata } from "next";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built — web apps, tools, and experiments.",
};

export default async function ProjectsPage() {
  const allProjects = await db.select().from(projects).orderBy(asc(projects.order));
  const allTags = Array.from(new Set(allProjects.flatMap((p) => p.tags ?? [])));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 space-y-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Things I&apos;ve built.</p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <span key={tag} className="rounded-full border border-neutral-200 dark:border-neutral-800 px-3 py-1 text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      {allProjects.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No projects yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((p) => (
            <div key={p.id} className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors flex flex-col">
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover" />
              )}
              <div className="p-5 flex flex-col flex-1 space-y-3">
                <h2 className="font-semibold">{p.title}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 flex-1">{p.description}</p>
                {(p.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {(p.tags ?? []).map((tag) => (
                      <span key={tag} className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  {p.demoUrl && (
                    <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                      Live demo ↗
                    </a>
                  )}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-neutral-500 hover:underline">
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
