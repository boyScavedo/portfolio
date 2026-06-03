import Link from "next/link";
import { db } from "@/db";
import { posts, projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatDate, readingTime } from "@/lib/utils";
import { getProfile } from "@/lib/profile";
import Hero from "@/components/hero";
import Marquee from "@/components/marquee";
import { FadeUp, StaggerContainer, StaggerItem, ScaleIn } from "@/components/animated-section";

const TECH_STACK = ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Tailwind CSS", "Docker", "REST APIs", "Git"];

export default async function Home() {
  const [profile, latestPosts, featuredProjects] = await Promise.all([
    getProfile(),
    db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt)).limit(3),
    db.select().from(projects).where(eq(projects.featured, true)).orderBy(projects.order).limit(3),
  ]);

  return (
    <div className="flex flex-col">
      <Hero profile={profile} />

      <Marquee items={TECH_STACK} />

      {/* Currently section */}
      <FadeUp className="mx-auto max-w-6xl px-6 py-16 w-full">
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-8 grid md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-[#555] uppercase tracking-widest">Currently</p>
            <p className="font-semibold text-white">
              {profile.availabilityStatus === "employed" && profile.currentCompany
                ? `Working at ${profile.currentCompany}`
                : profile.availabilityStatus === "freelancing"
                ? "Freelancing"
                : profile.availabilityStatus === "available"
                ? "Looking for opportunities"
                : profile.availabilityStatus === "open_to_offers"
                ? "Open to new offers"
                : "Focused on personal projects"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-[#555] uppercase tracking-widest">Open to</p>
            <p className="font-semibold text-white">
              {profile.workType === "freelance" ? "Freelance work" : profile.workType === "fulltime" ? "Full-time roles" : profile.workType === "both" ? "Freelance & full-time" : "Not looking"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-[#555] uppercase tracking-widest">Based in</p>
            <p className="font-semibold text-white">{profile.location ?? "Nepal"}</p>
          </div>
        </div>
      </FadeUp>

      {/* Featured Projects */}
      <section className="mx-auto max-w-6xl px-6 pb-20 w-full space-y-10">
        <FadeUp>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-[#d4f600] font-mono mb-2">01 /</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Selected work</h2>
            </div>
            <Link href="/projects" className="text-sm text-[#888] hover:text-[#d4f600] transition-colors pb-1 hidden sm:block">
              All projects →
            </Link>
          </div>
        </FadeUp>

        {featuredProjects.length === 0 ? (
          <FadeUp>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-16 text-center text-[#555] text-sm">
              No featured projects yet. Add some from the admin panel.
            </div>
          </FadeUp>
        ) : (
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <StaggerItem key={p.id}>
                <ProjectCard project={p} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        <div className="sm:hidden">
          <Link href="/projects" className="text-sm text-[#888] hover:text-[#d4f600] transition-colors">
            All projects →
          </Link>
        </div>
      </section>

      <Marquee items={["Ship fast", "Learn daily", "Build in public", "Stay curious", "Write code", "Share knowledge"]} accent reverse />

      {/* Latest Posts */}
      <section className="mx-auto max-w-6xl px-6 py-20 w-full space-y-10">
        <FadeUp>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-[#d4f600] font-mono mb-2">02 /</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">From the blog</h2>
            </div>
            <Link href="/blog" className="text-sm text-[#888] hover:text-[#d4f600] transition-colors pb-1 hidden sm:block">
              All posts →
            </Link>
          </div>
        </FadeUp>

        {latestPosts.length === 0 ? (
          <FadeUp>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-16 text-center text-[#555] text-sm">
              No posts yet. Write your first post from the admin panel.
            </div>
          </FadeUp>
        ) : (
          <StaggerContainer className="space-y-3">
            {latestPosts.map((post) => (
              <StaggerItem key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group flex items-center justify-between rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-6 hover:border-[#d4f600]/30 hover:bg-[#111] transition-all gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-[#555]">
                      {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
                      <span>{readingTime(post.content)} min read</span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-[#d4f600] transition-colors truncate">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-[#555] line-clamp-1">{post.excerpt}</p>}
                  </div>
                  <span className="text-[#555] group-hover:text-[#d4f600] transition-all group-hover:translate-x-1 flex-shrink-0 text-xl">→</span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* CTA */}
      <ScaleIn className="mx-auto max-w-6xl px-6 pb-24 w-full">
        <div className="relative rounded-3xl bg-[#d4f600] p-12 md:p-20 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-black/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-black/5 blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-black text-black leading-tight tracking-tight">
                Let&apos;s build<br />something.
              </h2>
              <p className="text-black/50 font-medium text-lg">Have a project in mind? I&apos;d love to hear about it.</p>
            </div>
            <Link href="/contact" className="flex-shrink-0 rounded-full bg-black text-white px-10 py-4 font-bold text-sm hover:bg-[#111] transition-colors whitespace-nowrap">
              Start a conversation →
            </Link>
          </div>
        </div>
      </ScaleIn>
    </div>
  );
}

function ProjectCard({ project }: { project: { id: number; title: string; description: string; imageUrl: string | null; tags: string[] | null; demoUrl: string | null; githubUrl: string | null; featured: boolean } }) {
  return (
    <div className="group rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden hover:border-[#d4f600]/30 hover:bg-[#111] transition-all hover:-translate-y-1 h-full flex flex-col cursor-default">
      {project.imageUrl ? (
        <img src={project.imageUrl} alt={project.title} className="w-full h-44 object-cover" />
      ) : (
        <div className="w-full h-28 bg-[#111] flex items-center justify-center border-b border-[#1a1a1a]">
          <span className="text-5xl font-black text-[#1e1e1e] select-none">{project.title[0]}</span>
        </div>
      )}
      <div className="p-6 flex flex-col flex-1 gap-3">
        <h3 className="font-bold text-lg group-hover:text-[#d4f600] transition-colors leading-snug">{project.title}</h3>
        <p className="text-sm text-[#666] flex-1 leading-relaxed line-clamp-3">{project.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {(project.tags ?? []).map((tag) => (
            <span key={tag} className="rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-0.5 text-xs text-[#666]">{tag}</span>
          ))}
        </div>
        <div className="flex gap-4 pt-3 border-t border-[#1a1a1a]">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#d4f600] hover:underline">Live ↗</a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#555] hover:text-white transition-colors">GitHub ↗</a>
          )}
        </div>
      </div>
    </div>
  );
}
