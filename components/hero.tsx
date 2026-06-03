"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Profile } from "@/lib/profile";
import { STATUS_LABELS } from "@/lib/profile-constants";

export default function Hero({ profile }: { profile: Profile }) {
  const status = STATUS_LABELS[profile.availabilityStatus] ?? STATUS_LABELS.available;

  return (
    <section className="relative min-h-[calc(100vh-60px)] flex flex-col justify-center px-6 py-16 overflow-hidden">
      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <motion.div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,246,0,0.05) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl w-full space-y-8">
        {/* Terminal prompt */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-mono text-xs text-[#555] flex items-center gap-2"
        >
          <span className="text-[#888]">~</span>
          <span className="text-[#d4f600] mx-1">❯</span>
          <motion.span
            className="inline-block w-2 h-[1em] bg-[#d4f600] align-middle"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>

        {/* Status */}
        <motion.div
          className="flex items-center gap-2 font-mono text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: status.color }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: status.color }} />
          </span>
          <span style={{ color: status.color }}>{status.label}</span>
          {profile.currentCompany && (
            <span className="text-[#444]">
              — {profile.currentCompanyUrl ? (
                <a href={profile.currentCompanyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#d4f600] transition-colors">{profile.currentCompany}</a>
              ) : profile.currentCompany}
            </span>
          )}
        </motion.div>

        {/* Name */}
        <div>
          <motion.h1
            className="font-mono font-black leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(3rem,10vw,8rem)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span className="text-[#e0e0e0]">{profile.name.split(" ")[0]}</span>
            <br />
            <span className="text-[#d4f600]">{profile.name.split(" ").slice(1).join(" ")}</span>
          </motion.h1>
        </div>

        {/* Info panel */}
        <motion.div
          className="border border-[#1a1a1a] rounded-[2px] max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="px-3 py-1.5 border-b border-[#1a1a1a] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#333]" />
            <span className="w-2 h-2 rounded-full bg-[#333]" />
            <span className="w-2 h-2 rounded-full bg-[#d4f600]/40" />
            <span className="text-[10px] font-mono text-[#555] ml-1">whoami.sh</span>
          </div>
          <div className="p-4 space-y-2 font-mono text-sm">
            <div className="flex gap-3">
              <span className="text-[#555] min-w-[80px]">role</span>
              <span className="text-[#d4f600]">{profile.role}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#555] min-w-[80px]">tagline</span>
              <span className="text-[#999]">{profile.tagline}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#555] min-w-[80px]">location</span>
              <span className="text-[#999]">{profile.location ?? "Nepal"}</span>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/projects"
            className="rounded-[2px] bg-[#d4f600] text-black px-6 py-2.5 text-xs font-mono font-bold hover:bg-white transition-colors"
          >
            ./view-work.sh
          </Link>
          <Link
            href="/contact"
            className="rounded-[2px] border border-[#333] text-[#888] px-6 py-2.5 text-xs font-mono hover:border-[#d4f600] hover:text-[#d4f600] transition-colors"
          >
            ./contact.sh
          </Link>
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[2px] border border-[#1a1a1a] text-[#555] px-6 py-2.5 text-xs font-mono hover:border-[#555] hover:text-[#999] transition-colors"
            >
              resume.pdf ↗
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
