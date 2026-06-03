import type { Metadata } from "next";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built — web apps, tools, and experiments.",
};

export default async function ProjectsPage() {
  const allProjects = await db.select().from(projects).orderBy(asc(projects.order));

  return (
    <div className="flex flex-col pt-24">
      <section className="relative px-6 py-20 noise overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#d4f600]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10 space-y-4">
          <ScrollReveal>
            <p className="text-xs text-[#555] uppercase tracking-widest">Portfolio</p>
            <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight">
              Selected<br /><span className="text-[#d4f600]">Work</span>
            </h1>
            <p className="text-[#555] mt-4 max-w-md">
              {allProjects.length} project{allProjects.length !== 1 ? "s" : ""} — web apps, tools, and experiments.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 w-full">
        {allProjects.length === 0 ? (
          <ScrollReveal>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#111] p-16 text-center text-[#555]">
              No projects yet — add some from the admin panel.
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 60}>
                <div className="group rounded-2xl border border-[#1a1a1a] bg-[#111] overflow-hidden hover:border-[#d4f600]/40 transition-all hover:-translate-y-1 h-full flex flex-col">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-24 bg-[#1a1a1a] flex items-center justify-center">
                      <span className="text-4xl font-black text-[#2a2a2a]">{p.title[0]}</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1 gap-3">
                    {p.featured && (
                      <span className="self-start rounded-full bg-[#d4f600]/10 border border-[#d4f600]/20 px-2.5 py-0.5 text-xs font-medium text-[#d4f600]">
                        Featured
                      </span>
                    )}
                    <h2 className="font-bold text-lg group-hover:text-[#d4f600] transition-colors">{p.title}</h2>
                    <p className="text-sm text-[#666] flex-1">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(p.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-0.5 text-xs text-[#888]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-3 border-t border-[#1a1a1a]">
                      {p.demoUrl && (
                        <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#d4f600] hover:underline">
                          Live demo ↗
                        </a>
                      )}
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#555] hover:text-white transition-colors">
                          GitHub ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
