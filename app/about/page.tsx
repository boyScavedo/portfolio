import type { Metadata } from "next";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getProfile, STATUS_LABELS } from "@/lib/profile";
import Marquee from "@/components/marquee";
import { FadeUp, StaggerContainer, StaggerItem, ScaleIn } from "@/components/animated-section";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Jeevan Adhikari — full stack engineer, creator, and blogger.",
};

export default async function AboutPage() {
  const [profile, allSkills] = await Promise.all([
    getProfile(),
    db.select().from(skills).orderBy(asc(skills.order)),
  ]);

  const grouped = allSkills.reduce<Record<string, typeof allSkills>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});
  const skillNames = allSkills.map((s) => s.name);
  const status = STATUS_LABELS[profile.availabilityStatus] ?? STATUS_LABELS.available;

  return (
    <div className="flex flex-col pt-24">
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(212,246,0,0.04) 0%, transparent 70%)" }} />
        <div className="mx-auto max-w-6xl relative z-10">
          <FadeUp>
            <p className="text-xs text-[#d4f600] font-mono mb-2">00 /</p>
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.9] tracking-tight mb-12">
              About<br /><span className="text-[#d4f600]">me.</span>
            </h1>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <FadeUp delay={1}>
              <div className="space-y-5 text-[#777] text-lg leading-relaxed">
                <p>
                  Hi! I&apos;m <span className="text-white font-semibold">{profile.name}</span> — {profile.bio ?? "a developer passionate about building useful things for the web."}
                </p>
                <p>
                  My focus is on building fast, accessible, and well-designed web applications.
                  I believe in learning in public and sharing knowledge freely.
                </p>
                <p>
                  When I&apos;m not coding, I&apos;m exploring new technologies, writing blog posts, or filming videos about software development.
                </p>
                {profile.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#333] px-6 py-2.5 text-sm font-bold text-white hover:border-[#d4f600] hover:text-[#d4f600] transition-colors mt-2">
                    Download CV ↗
                  </a>
                )}
              </div>
            </FadeUp>

            <StaggerContainer className="grid grid-cols-2 gap-3">
              {[
                { label: "Location", value: profile.location ?? "Nepal" },
                { label: "Role", value: profile.role },
                {
                  label: "Status",
                  value: status.label,
                  color: status.color,
                },
                {
                  label: profile.currentCompany ? "Working at" : "Open to",
                  value: profile.currentCompany ??
                    (profile.workType === "freelance" ? "Freelance" :
                     profile.workType === "fulltime" ? "Full-time" :
                     profile.workType === "both" ? "Both" : "Not looking"),
                },
              ].map((item) => (
                <StaggerItem key={item.label}>
                  <div className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-5 hover:border-[#2a2a2a] transition-colors">
                    <p className="text-xs text-[#555] uppercase tracking-widest mb-1.5">{item.label}</p>
                    <p className="font-semibold text-sm" style={item.color ? { color: item.color } : {}}>
                      {item.value}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {skillNames.length > 0 && <Marquee items={skillNames} speed={20} />}

      {Object.keys(grouped).length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 w-full space-y-12">
          <FadeUp>
            <p className="text-xs text-[#d4f600] font-mono mb-2">Skills /</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">What I work with</h2>
          </FadeUp>
          <div className="space-y-12">
            {Object.entries(grouped).map(([category, items], ci) => (
              <FadeUp key={category} delay={ci * 0.5}>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4f600]">{category}</h3>
                  <StaggerContainer className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <StaggerItem key={s.id}>
                        <div className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] px-4 py-2.5 text-sm font-medium text-white hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors cursor-default">
                          {s.name}
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>
      )}

      <ScaleIn className="mx-auto max-w-6xl px-6 pb-24 w-full">
        <div className="rounded-3xl border border-[#1a1a1a] bg-[#0d0d0d] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-black tracking-tight">Want to work together?</h3>
            <p className="text-[#555]">Reach out anytime. I usually respond within 24 hours.</p>
          </div>
          <Link
            href="/contact"
            className="rounded-full bg-[#d4f600] text-black px-8 py-3.5 text-sm font-bold hover:bg-white transition-colors flex-shrink-0 whitespace-nowrap"
          >
            Let&apos;s talk →
          </Link>
        </div>
      </ScaleIn>
    </div>
  );
}
