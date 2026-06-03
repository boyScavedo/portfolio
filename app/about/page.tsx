import type { Metadata } from "next";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { asc } from "drizzle-orm";
import Marquee from "@/components/marquee";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Jeevan Shrestha — developer, creator, and blogger.",
};

export default async function AboutPage() {
  const allSkills = await db.select().from(skills).orderBy(asc(skills.order));
  const grouped = allSkills.reduce<Record<string, typeof allSkills>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});
  const skillNames = allSkills.map((s) => s.name);

  return (
    <div className="flex flex-col pt-24">
      {/* Hero */}
      <section className="relative px-6 py-20 noise overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4f600]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10">
          <ScrollReveal>
            <p className="text-xs text-[#555] uppercase tracking-widest mb-4">About me</p>
            <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] tracking-tight mb-8">
              Developer<br /><span className="text-[#d4f600]">& Creator</span>
            </h1>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <ScrollReveal delay={100}>
              <div className="space-y-5 text-[#888] text-lg leading-relaxed">
                <p>
                  Hi! I&apos;m <span className="text-white font-semibold">Jeevan Shrestha</span> — a developer passionate about building useful things for the web.
                  I write about my learnings, share projects, and create content on YouTube.
                </p>
                <p>
                  My focus is on building fast, accessible, and well-designed web applications.
                  I believe in learning in public and sharing knowledge freely.
                </p>
                <p>
                  When I&apos;m not coding, I&apos;m exploring new technologies, writing blog posts, or filming videos about software development.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Location", value: "Nepal" },
                  { label: "Focus", value: "Full-stack" },
                  { label: "Available", value: "For work" },
                  { label: "Email", value: "Let's talk" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[#1a1a1a] bg-[#111] p-5">
                    <p className="text-xs text-[#555] uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {skillNames.length > 0 && <Marquee items={skillNames} />}

      {/* Skills */}
      {Object.keys(grouped).length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 w-full space-y-12">
          <ScrollReveal>
            <p className="text-xs text-[#555] uppercase tracking-widest mb-2">What I work with</p>
            <h2 className="text-4xl font-bold">Skills</h2>
          </ScrollReveal>

          <div className="space-y-10">
            {Object.entries(grouped).map(([category, items], ci) => (
              <ScrollReveal key={category} delay={ci * 80}>
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-[#d4f600]">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-xl border border-[#2a2a2a] bg-[#111] px-4 py-2 text-sm font-medium text-white hover:border-[#d4f600]/50 hover:text-[#d4f600] transition-colors cursor-default"
                      >
                        {s.name}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20 w-full">
        <ScrollReveal>
          <div className="rounded-3xl border border-[#1a1a1a] bg-[#111] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-1">Want to work together?</h3>
              <p className="text-[#555]">Reach out anytime.</p>
            </div>
            <a
              href="mailto:shrestha9842889901@gmail.com"
              className="rounded-full bg-[#d4f600] text-black px-8 py-3 text-sm font-bold hover:bg-white transition-colors flex-shrink-0"
            >
              shrestha9842889901@gmail.com →
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
