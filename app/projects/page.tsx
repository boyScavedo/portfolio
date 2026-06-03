import type { Metadata } from "next";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/animated-section";

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I've built — web apps, tools, and experiments.",
};

export default async function ProjectsPage() {
  const allProjects = await db.select().from(projects).orderBy(asc(projects.order));

  return (
    <div className="flex flex-col pt-24">
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute top-0 left-0 pointer-events-none" style={{ background: "radial-gradient(600px circle at 0 0, rgba(212,246,0,0.04), transparent)" }} />
        <div className="mx-auto max-w-6xl relative z-10">
          <FadeUp>
            <p className="text-xs text-[#d4f600] font-mono mb-2">02 /</p>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tight">
              Selected<br /><span className="text-[#d4f600]">Work</span>
            </h1>
            <p className="text-[#555] mt-4 text-lg">
              {allProjects.length} project{allProjects.length !== 1 ? "s" : ""} — apps, tools, and experiments.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 w-full">
        {allProjects.length === 0 ? (
          <FadeUp>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-16 text-center text-[#555]">
              No projects yet — add some from the admin panel.
            </div>
          </FadeUp>
        ) : (
          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((p) => (
              <StaggerItem key={p.id}>
                <div className="group rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden hover:border-[#d4f600]/30 hover:bg-[#111] transition-all hover:-translate-y-1 h-full flex flex-col">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-24 bg-[#111] flex items-center justify-center border-b border-[#1a1a1a]">
                      <span className="text-5xl font-black text-[#1e1e1e] select-none">{p.title[0]}</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1 gap-3">
                    {p.featured && (
                      <span className="self-start rounded-full bg-[#d4f600]/10 border border-[#d4f600]/20 px-2.5 py-0.5 text-xs font-bold text-[#d4f600]">Featured</span>
                    )}
                    <h2 className="font-bold text-lg group-hover:text-[#d4f600] transition-colors leading-snug">{p.title}</h2>
                    <p className="text-sm text-[#666] flex-1 leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(p.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-0.5 text-xs text-[#666]">{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-3 border-t border-[#1a1a1a]">
                      {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#d4f600] hover:underline">Live ↗</a>}
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#555] hover:text-white transition-colors">GitHub ↗</a>}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>
    </div>
  );
}
