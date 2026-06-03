import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { posts, projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatDate, readingTime } from "@/lib/utils";
import { getProfile } from "@/lib/profile";
import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/animated-section";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jeevan Adhikari — Full Stack Engineer",
  description: "Jeevan Adhikari is a full stack engineer and developer from Nepal. I build fast, accessible web apps with React, Next.js, TypeScript and Node.js. Explore my projects, blog, and work.",
  openGraph: {
    title: "Jeevan Adhikari — Full Stack Engineer",
    description: "Jeevan Adhikari is a full stack engineer from Nepal building things for the web.",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  },
};

const FALLBACK_TECH = ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Tailwind CSS", "Docker", "REST APIs", "Git"];
const FALLBACK_MARQUEE = ["ship fast", "learn daily", "build in public", "stay curious", "write code", "share knowledge"];

export default async function Home() {
  const [profile, latestPosts, featuredProjects] = await Promise.all([
    getProfile(),
    db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt)).limit(3).catch(() => []),
    db.select().from(projects).where(eq(projects.featured, true)).orderBy(projects.order).limit(3).catch(() => []),
  ]);
  const techStack = (profile.techStack && profile.techStack.length > 0) ? profile.techStack : FALLBACK_TECH;
  const marqueeItems = (profile.marqueeItems && profile.marqueeItems.length > 0) ? profile.marqueeItems : FALLBACK_MARQUEE;

  return (
    <div className="flex flex-col">
      <Hero profile={profile} />

      <Marquee items={techStack} />

      {/* Status panel */}
      <FadeUp className="mx-auto max-w-6xl px-6 py-10 w-full">
        <div className="border border-[#1a1a1a] rounded-[2px]">
          <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4f600]/40" />
            <span className="text-[10px] font-mono text-[#555] ml-1">status.json</span>
          </div>
          <div className="p-4 flex flex-wrap gap-6 font-mono text-sm">
            <div className="space-y-0.5">
              <p className="text-[10px] text-[#555] uppercase tracking-widest">currently</p>
              <p className="text-[#e0e0e0]">
                {profile.availabilityStatus === "employed" && profile.currentCompany
                  ? `working @ ${profile.currentCompany}`
                  : profile.availabilityStatus === "freelancing"
                  ? "freelancing"
                  : profile.availabilityStatus === "available"
                  ? "open to work"
                  : profile.availabilityStatus === "open_to_offers"
                  ? "open to offers"
                  : "focused / not looking"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-[#555] uppercase tracking-widest">open to</p>
              <p className="text-[#e0e0e0]">
                {profile.workType === "freelance" ? "freelance / contract" : profile.workType === "fulltime" ? "full-time roles" : profile.workType === "both" ? "freelance & full-time" : "not looking"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] text-[#555] uppercase tracking-widest">based in</p>
              <p className="text-[#e0e0e0]">{profile.location ?? "Nepal"}</p>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Featured Projects */}
      <section className="mx-auto max-w-6xl px-6 pb-16 w-full space-y-6">
        <FadeUp>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono text-[#d4f600] uppercase tracking-widest mb-0.5">~/projects</p>
              <h2 className="font-mono font-black text-2xl text-[#e0e0e0]">personal projects</h2>
            </div>
            <Link href="/projects" className="text-xs font-mono text-[#555] hover:text-[#d4f600] transition-colors hidden sm:block">
              all projects →
            </Link>
          </div>
        </FadeUp>

        {featuredProjects.length === 0 ? (
          <FadeUp>
            <div className="border border-[#1a1a1a] rounded-[2px] p-12 text-center text-[#444] font-mono text-xs">
              no featured projects yet
            </div>
          </FadeUp>
        ) : (
          <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <StaggerItem key={p.id}>
                <ProjectCard project={p} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      <Marquee items={marqueeItems} accent reverse />

      {/* Latest Posts */}
      <section className="mx-auto max-w-6xl px-6 py-16 w-full space-y-6">
        <FadeUp>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono text-[#d4f600] uppercase tracking-widest mb-0.5">~/blog</p>
              <h2 className="font-mono font-black text-2xl text-[#e0e0e0]">from the blog</h2>
            </div>
            <Link href="/blog" className="text-xs font-mono text-[#555] hover:text-[#d4f600] transition-colors hidden sm:block">
              all posts →
            </Link>
          </div>
        </FadeUp>

        {latestPosts.length === 0 ? (
          <FadeUp>
            <div className="border border-[#1a1a1a] rounded-[2px] p-12 text-center text-[#444] font-mono text-xs">
              no posts yet
            </div>
          </FadeUp>
        ) : (
          <StaggerContainer className="space-y-2">
            {latestPosts.map((post) => (
              <StaggerItem key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group flex items-center justify-between border border-[#1a1a1a] rounded-[2px] p-4 hover:border-[#d4f600]/30 hover:bg-[#0d0d0d] transition-all gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#555]">
                      {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
                      <span>·</span>
                      <span>{readingTime(post.content)} min read</span>
                    </div>
                    <h3 className="font-mono font-bold text-sm text-[#e0e0e0] group-hover:text-[#d4f600] transition-colors truncate">{post.title}</h3>
                    {post.excerpt && <p className="text-xs font-mono text-[#555] line-clamp-1">{post.excerpt}</p>}
                  </div>
                  <span className="text-[#444] group-hover:text-[#d4f600] transition-all flex-shrink-0 font-mono">→</span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* CTA */}
      <FadeUp className="mx-auto max-w-6xl px-6 pb-20 w-full">
        <div className="border border-[#d4f600]/30 rounded-[2px] bg-[#d4f600]/5 p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(212,246,0,0.08) 0%, transparent 70%)" }} />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-[#d4f600] uppercase tracking-widest">~/contact</p>
              <h2 className="font-mono font-black text-3xl md:text-4xl text-[#e0e0e0] leading-tight">
                let&apos;s build<br /><span className="text-[#d4f600]">something.</span>
              </h2>
              <p className="text-xs font-mono text-[#555]">have a project in mind? i&apos;d love to hear about it.</p>
            </div>
            <Link href="/contact" className="flex-shrink-0 rounded-[2px] bg-[#d4f600] text-black px-8 py-3 font-mono font-bold text-xs hover:bg-white transition-colors whitespace-nowrap">
              start a conversation →
            </Link>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

function ProjectCard({ project }: { project: { id: number; title: string; description: string; imageUrl: string | null; tags: string[] | null; demoUrl: string | null; githubUrl: string | null; featured: boolean } }) {
  return (
    <Link href={`/projects/${project.id}`} className="group border border-[#1a1a1a] rounded-[2px] overflow-hidden hover:border-[#d4f600]/30 transition-all flex flex-col">
      {project.imageUrl ? (
        <img src={project.imageUrl} alt={project.title} className="w-full h-36 object-cover" />
      ) : (
        <div className="w-full h-16 bg-[#0d0d0d] flex items-center justify-center border-b border-[#1a1a1a]">
          <span className="font-mono font-black text-3xl text-[#1e1e1e] select-none">{project.title[0]}</span>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-mono font-bold text-sm text-[#e0e0e0] group-hover:text-[#d4f600] transition-colors">{project.title}</h3>
        <p className="text-xs font-mono text-[#555] flex-1 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {(project.tags ?? []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-[2px] border border-[#222] px-1.5 py-0.5 text-[10px] font-mono text-[#444]">{tag}</span>
          ))}
        </div>
        <div className="flex gap-3 pt-2 border-t border-[#1a1a1a]">
          {project.demoUrl && (
            <span className="text-[10px] font-mono text-[#d4f600]">live ↗</span>
          )}
          {project.githubUrl && (
            <span className="text-[10px] font-mono text-[#555]">github ↗</span>
          )}
          <span className="ml-auto text-[10px] font-mono text-[#444] group-hover:text-[#d4f600] transition-colors">view →</span>
        </div>
      </div>
    </Link>
  );
}
