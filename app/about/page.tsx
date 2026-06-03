import type { Metadata } from "next";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { asc } from "drizzle-orm";
import { getProfile } from "@/lib/profile";
import { STATUS_LABELS } from "@/lib/profile-constants";
import Marquee from "@/components/marquee";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/animated-section";
import Link from "next/link";

export const dynamic = "force-dynamic";

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
    <div className="mx-auto max-w-6xl px-6 py-12 w-full space-y-12">
      {/* Header */}
      <FadeUp>
        <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest">~/about</p>
        <h1 className="font-mono font-black text-4xl text-[#e0e0e0] mt-1">
          about<span className="text-[#d4f600]">_</span>
        </h1>
      </FadeUp>

      {/* Bio + meta */}
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <FadeUp delay={1}>
          <div className="border border-[#1a1a1a] rounded-[2px]">
            <div className="px-4 py-2 border-b border-[#1a1a1a]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// bio</span>
            </div>
            <div className="p-4 space-y-3 font-mono text-sm text-[#888] leading-relaxed">
              <p>
                hi, i&apos;m <span className="text-[#e0e0e0] font-bold">{profile.name}</span> —{" "}
                {profile.bio ?? "a developer passionate about building useful things for the web."}
              </p>
              {profile.aboutParagraph2 && <p>{profile.aboutParagraph2}</p>}
              {profile.aboutParagraph3 && <p>{profile.aboutParagraph3}</p>}
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-[2px] border border-[#333] px-4 py-1.5 text-xs font-mono text-[#e0e0e0] hover:border-[#d4f600] hover:text-[#d4f600] transition-colors mt-2"
                >
                  resume.pdf ↗
                </a>
              )}
            </div>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-2 gap-2">
          {[
            { label: "location", value: profile.location ?? "Nepal" },
            { label: "role", value: profile.role },
            { label: "status", value: status.label, color: status.color },
            {
              label: profile.currentCompany ? "company" : "open to",
              value: profile.currentCompany ??
                (profile.workType === "freelance" ? "freelance" :
                 profile.workType === "fulltime" ? "full-time" :
                 profile.workType === "both" ? "both" : "not looking"),
            },
          ].map((item) => (
            <StaggerItem key={item.label}>
              <div className="border border-[#1a1a1a] rounded-[2px] p-3">
                <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest mb-1">{item.label}</p>
                <p className="font-mono text-xs font-bold" style={item.color ? { color: item.color } : { color: "#e0e0e0" }}>
                  {item.value}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Social links */}
      {(profile.githubUrl || profile.twitterUrl || profile.linkedinUrl || profile.youtubeUrl) && (
        <FadeUp>
          <div className="border border-[#1a1a1a] rounded-[2px]">
            <div className="px-4 py-2 border-b border-[#1a1a1a]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// links</span>
            </div>
            <div className="p-3 flex flex-wrap gap-2">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-[2px] border border-[#2a2a2a] px-3 py-1.5 text-xs font-mono text-[#888] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors">
                  github ↗
                </a>
              )}
              {profile.twitterUrl && (
                <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="rounded-[2px] border border-[#2a2a2a] px-3 py-1.5 text-xs font-mono text-[#888] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors">
                  twitter ↗
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="rounded-[2px] border border-[#2a2a2a] px-3 py-1.5 text-xs font-mono text-[#888] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors">
                  linkedin ↗
                </a>
              )}
              {profile.youtubeUrl && (
                <a href={profile.youtubeUrl} target="_blank" rel="noopener noreferrer" className="rounded-[2px] border border-[#2a2a2a] px-3 py-1.5 text-xs font-mono text-[#888] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors">
                  youtube ↗
                </a>
              )}
            </div>
          </div>
        </FadeUp>
      )}

      {skillNames.length > 0 && <Marquee items={skillNames} speed={20} />}

      {/* Skills */}
      {Object.keys(grouped).length > 0 && (
        <section className="space-y-4">
          <FadeUp>
            <p className="text-[10px] font-mono text-[#d4f600] uppercase tracking-widest">~/about/skills</p>
            <h2 className="font-mono font-black text-2xl text-[#e0e0e0] mt-0.5">what i work with</h2>
          </FadeUp>
          <div className="space-y-3">
            {Object.entries(grouped).map(([category, items], ci) => (
              <FadeUp key={category} delay={ci * 0.3}>
                <div className="border border-[#1a1a1a] rounded-[2px]">
                  <div className="px-4 py-2 border-b border-[#1a1a1a] flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4f600]">{category}</span>
                    <span className="text-[10px] font-mono text-[#555]">{items.length}</span>
                  </div>
                  <StaggerContainer className="p-3 flex flex-wrap gap-1.5">
                    {items.map((s) => (
                      <StaggerItem key={s.id}>
                        <span className="rounded-[2px] border border-[#2a2a2a] px-2.5 py-1 text-xs font-mono text-[#888] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors cursor-default">
                          {s.name}
                        </span>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <FadeUp>
        <div className="border border-[#1a1a1a] rounded-[2px] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest">// collaborate</p>
            <h3 className="font-mono font-black text-xl text-[#e0e0e0]">want to work together?</h3>
            <p className="text-xs font-mono text-[#555]">reach out anytime — usually respond within 24h.</p>
          </div>
          <Link href="/contact" className="flex-shrink-0 rounded-[2px] bg-[#d4f600] text-black px-6 py-2.5 text-xs font-mono font-bold hover:bg-white transition-colors whitespace-nowrap">
            let&apos;s talk →
          </Link>
        </div>
      </FadeUp>
    </div>
  );
}
