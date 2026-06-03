import type { Metadata } from "next";
import ContactForm from "./contact-form";
import ScrollReveal from "@/components/scroll-reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jeevan Shrestha.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col pt-24">
      <section className="relative px-6 py-20 noise overflow-hidden min-h-screen flex items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#d4f600]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="mx-auto max-w-6xl relative z-10 w-full grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div className="space-y-6">
              <p className="text-xs text-[#555] uppercase tracking-widest">Let&apos;s talk</p>
              <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-tight">
                Say<br /><span className="text-[#d4f600]">Hello.</span>
              </h1>
              <p className="text-[#888] text-lg leading-relaxed max-w-sm">
                Have a project in mind, want to collaborate, or just want to connect? Drop me a message.
              </p>
              <div className="space-y-4 pt-4">
                <a href="mailto:shrestha9842889901@gmail.com" className="flex items-center gap-3 text-[#555] hover:text-[#d4f600] transition-colors group">
                  <span className="w-10 h-10 rounded-xl border border-[#2a2a2a] bg-[#111] flex items-center justify-center group-hover:border-[#d4f600]/40 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium">shrestha9842889901@gmail.com</span>
                </a>
                <a href="https://github.com/boyScavedo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#555] hover:text-[#d4f600] transition-colors group">
                  <span className="w-10 h-10 rounded-xl border border-[#2a2a2a] bg-[#111] flex items-center justify-center group-hover:border-[#d4f600]/40 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium">@boyScavedo</span>
                </a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
