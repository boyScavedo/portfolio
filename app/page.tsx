import Link from "next/link";
import { db } from "@/db";
import { posts, projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatDate, readingTime } from "@/lib/utils";
import Marquee from "@/components/marquee";
import ScrollReveal from "@/components/scroll-reveal";

const TECH_STACK = ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Tailwind CSS", "Docker", "AWS", "Machine Learning"];

export default async function Home() {
  const [latestPosts, featuredProjects] = await Promise.all([
    db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt)).limit(3),
    db.select().from(projects).where(eq(projects.featured, true)).orderBy(projects.order).limit(3),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 noise overflow-hidden">
        {/* Accent glow blob */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#d4f600]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl w-full space-y-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#d4f600] animate-pulse" />
            <span className="text-sm font-medium text-[#888] uppercase tracking-widest">Available for work</span>
          </div>

          <h1 className="text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.9] tracking-tight">
            Jeevan<br />
            <span className="text-[#d4f600]">Shrestha</span>
          </h1>

          <p className="max-w-lg text-lg text-[#888] leading-relaxed">
            Developer, blogger & creator. I build web applications, share what I learn, and make content about software development.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/projects"
              className="rounded-full bg-[#d4f600] text-black px-8 py-3 text-sm font-bold hover:bg-white transition-colors"
            >
              View work →
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[#333] text-white px-8 py-3 text-sm font-bold hover:border-[#d4f600] hover:text-[#d4f600] transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#555]">
          <span className="text-xs uppercase tracking-widest">scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#555] to-transparent" />
        </div>
      </section>

      {/* Marquee */}
      <Marquee items={TECH_STACK} />

      {/* Bento stats */}
      <section className="mx-auto max-w-6xl px-6 py-20 w-full">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { number: "3+", label: "Years of experience" },
              { number: featuredProjects.length > 0 ? `${featuredProjects.length}+` : "10+", label: "Projects built" },
              { number: latestPosts.length > 0 ? `${latestPosts.length}+` : "20+", label: "Blog posts" },
              { number: "∞", label: "Things to learn" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[#1a1a1a] bg-[#111] p-6 space-y-2 hover:border-[#d4f600]/30 transition-colors group">
                <p className="text-4xl font-bold text-[#d4f600] group-hover:scale-105 transition-transform origin-left">{stat.number}</p>
                <p className="text-sm text-[#555]">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Featured Projects */}
      <section className="mx-auto max-w-6xl px-6 pb-20 w-full space-y-10">
        <ScrollReveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-[#555] uppercase tracking-widest mb-2">Selected work</p>
              <h2 className="text-4xl font-bold">Projects</h2>
            </div>
            <Link href="/projects" className="text-sm text-[#888] hover:text-[#d4f600] transition-colors pb-1">
              All projects →
            </Link>
          </div>
        </ScrollReveal>

        {featuredProjects.length === 0 ? (
          <ScrollReveal delay={100}>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#111] p-12 text-center text-[#555] text-sm">
              No featured projects yet. Add some from the admin panel.
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p, i) => (
              <ScrollReveal key={p.id} delay={i * 100}>
                <div className="group rounded-2xl border border-[#1a1a1a] bg-[#111] overflow-hidden hover:border-[#d4f600]/40 transition-all hover:-translate-y-1 h-full flex flex-col">
                  {p.imageUrl && (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-44 object-cover" />
                  )}
                  <div className="p-6 flex flex-col flex-1 space-y-3">
                    <h3 className="font-bold text-lg group-hover:text-[#d4f600] transition-colors">{p.title}</h3>
                    <p className="text-sm text-[#666] flex-1 line-clamp-3">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(p.tags ?? []).map((tag) => (
                        <span key={tag} className="rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-0.5 text-xs text-[#888]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 pt-2 border-t border-[#1a1a1a]">
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

      {/* Marquee accent */}
      <Marquee items={["Build in public", "Ship fast", "Learn daily", "Create value", "Stay curious", "Write code"]} accent speed="slow" />

      {/* Latest Posts */}
      <section className="mx-auto max-w-6xl px-6 py-20 w-full space-y-10">
        <ScrollReveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-[#555] uppercase tracking-widest mb-2">From the blog</p>
              <h2 className="text-4xl font-bold">Latest posts</h2>
            </div>
            <Link href="/blog" className="text-sm text-[#888] hover:text-[#d4f600] transition-colors pb-1">
              All posts →
            </Link>
          </div>
        </ScrollReveal>

        {latestPosts.length === 0 ? (
          <ScrollReveal delay={100}>
            <div className="rounded-2xl border border-[#1a1a1a] bg-[#111] p-12 text-center text-[#555] text-sm">
              No posts yet. Write your first post from the admin panel.
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-4">
            {latestPosts.map((post, i) => (
              <ScrollReveal key={post.id} delay={i * 100}>
                <Link href={`/blog/${post.slug}`} className="group flex items-center justify-between rounded-2xl border border-[#1a1a1a] bg-[#111] p-6 hover:border-[#d4f600]/40 transition-all hover:-translate-y-0.5 gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-[#555]">
                      {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
                      <span>{readingTime(post.content)} min read</span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-[#d4f600] transition-colors truncate">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-[#666] line-clamp-1">{post.excerpt}</p>}
                  </div>
                  <span className="text-[#555] group-hover:text-[#d4f600] transition-colors flex-shrink-0 text-xl">→</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <ScrollReveal>
        <section className="mx-auto max-w-6xl px-6 pb-20 w-full">
          <div className="relative rounded-3xl bg-[#d4f600] p-12 md:p-16 overflow-hidden noise">
            <div className="absolute top-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-bold text-black leading-tight">
                  Let&apos;s work<br />together.
                </h2>
                <p className="text-black/60 font-medium">Have a project in mind? Let&apos;s talk.</p>
              </div>
              <Link
                href="/contact"
                className="flex-shrink-0 rounded-full bg-black text-white px-8 py-4 font-bold text-sm hover:bg-[#111] transition-colors"
              >
                Start a conversation →
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
