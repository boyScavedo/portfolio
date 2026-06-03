import type { Metadata } from "next";
import ContactForm from "./contact-form";
import { FadeUp } from "@/components/animated-section";
import { getProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jeevan Adhikari.",
};

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 w-full">
      <FadeUp>
        <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest">~/contact</p>
        <h1 className="font-mono font-black text-4xl text-[#e0e0e0] mt-1">
          contact<span className="text-[#d4f600]">_</span>
        </h1>
        <p className="text-xs font-mono text-[#555] mt-2">have a project in mind? i&apos;d love to hear about it.</p>
      </FadeUp>

      <div className="mt-10 grid md:grid-cols-2 gap-8 items-start">
        <FadeUp delay={1}>
          <div className="space-y-4">
            <div className="border border-[#1a1a1a] rounded-[2px]">
              <div className="px-4 py-2 border-b border-[#1a1a1a]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// reach me</span>
              </div>
              <div className="p-4 space-y-3">
                <a
                  href="mailto:jeevanadhikaritech@gmail.com"
                  className="flex items-center gap-3 text-[#555] hover:text-[#d4f600] transition-colors group"
                >
                  <span className="w-8 h-8 rounded-[2px] border border-[#2a2a2a] bg-[#0d0d0d] flex items-center justify-center group-hover:border-[#d4f600]/40 transition-colors flex-shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-xs font-mono">jeevanadhikaritech@gmail.com</span>
                </a>
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[#555] hover:text-[#d4f600] transition-colors group"
                  >
                    <span className="w-8 h-8 rounded-[2px] border border-[#2a2a2a] bg-[#0d0d0d] flex items-center justify-center group-hover:border-[#d4f600]/40 transition-colors flex-shrink-0">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </span>
                    <span className="text-xs font-mono">github.com/boyScavedo</span>
                  </a>
                )}
              </div>
            </div>

            <div className="border border-[#1a1a1a] rounded-[2px] p-4">
              <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest mb-2">// response time</p>
              <p className="text-xs font-mono text-[#e0e0e0]">usually within 24h</p>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={2}>
          <ContactForm />
        </FadeUp>
      </div>
    </div>
  );
}
