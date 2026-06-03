"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Profile } from "@/lib/profile";
import { STATUS_LABELS } from "@/lib/profile";

const word = (text: string, delay: number) => (
  <motion.span
    key={text}
    className="inline-block overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.01, delay }}
  >
    <motion.span
      className="inline-block"
      initial={{ y: "110%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {text}
    </motion.span>
  </motion.span>
);

export default function Hero({ profile }: { profile: Profile }) {
  const status = STATUS_LABELS[profile.availabilityStatus] ?? STATUS_LABELS.available;
  const firstName = profile.name.split(" ")[0];
  const lastName = profile.name.split(" ").slice(1).join(" ");

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Glow */}
      <motion.div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,246,0,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl w-full">
        {/* Status badge */}
        <motion.div
          className="flex items-center gap-2.5 mb-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ background: status.color }}
            />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: status.color }} />
          </span>
          <span className="text-sm font-medium" style={{ color: status.color }}>
            {status.label}
            {profile.currentCompany && (
              <>
                {" "}—{" "}
                {profile.currentCompanyUrl ? (
                  <a href={profile.currentCompanyUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    {profile.currentCompany}
                  </a>
                ) : (
                  <span>{profile.currentCompany}</span>
                )}
              </>
            )}
          </span>
        </motion.div>

        {/* Name */}
        <h1 className="text-[clamp(3.5rem,11vw,9rem)] font-black leading-[0.88] tracking-tight mb-8">
          <div className="overflow-hidden">
            {word(firstName, 0.4)}
          </div>
          <div className="overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ color: "#d4f600" }}
            >
              {lastName}
            </motion.span>
          </div>
        </h1>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            className="space-y-3 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
          >
            <p className="text-xl font-medium text-[#888]">{profile.role}</p>
            <p className="text-base text-[#666] leading-relaxed">{profile.tagline}</p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            <MagneticButton href="/projects" primary>
              View work →
            </MagneticButton>
            <MagneticButton href="/contact">
              Get in touch
            </MagneticButton>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-6 flex items-center gap-3 text-[#444]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            className="w-px h-16 bg-gradient-to-b from-transparent via-[#444] to-transparent origin-top"
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs uppercase tracking-[0.2em] rotate-90 origin-left translate-y-3">scroll</span>
        </motion.div>
      </div>
    </section>
  );
}

function MagneticButton({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) {
  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
      <Link
        href={href}
        className={`rounded-full px-8 py-3.5 text-sm font-bold transition-colors inline-block ${
          primary
            ? "bg-[#d4f600] text-black hover:bg-white"
            : "border border-[#333] text-[#888] hover:border-[#d4f600] hover:text-[#d4f600]"
        }`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
