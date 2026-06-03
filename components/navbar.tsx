"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/about", label: "about" },
  { href: "/projects", label: "projects" },
  { href: "/blog", label: "blog" },
  { href: "/videos", label: "videos" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 h-[60px]">
        <Link href="/" className="font-mono font-bold text-sm text-[#e0e0e0] hover:text-[#d4f600] transition-colors tracking-tight">
          <span className="text-[#555]">/home/</span>jeevan<span className="text-[#d4f600]">_</span>
        </Link>

        <ul className="hidden md:flex items-center gap-1 text-xs font-mono">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-3 py-1.5 rounded-[2px] transition-colors ${
                  pathname === href || pathname.startsWith(href + "/")
                    ? "text-[#d4f600] bg-[#d4f600]/8"
                    : "text-[#666] hover:text-[#e0e0e0] hover:bg-[#1a1a1a]"
                }`}
              >
                {pathname === href || pathname.startsWith(href + "/") ? `[${label}]` : label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="rounded-[2px] bg-[#d4f600] text-black px-4 py-1.5 text-xs font-mono font-bold hover:bg-white transition-colors"
          >
            contact →
          </Link>
        </div>

        <button
          className="md:hidden p-1 text-[#666] hover:text-[#e0e0e0] transition-colors font-mono text-xs"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? "[×]" : "[≡]"}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-[#1a1a1a] bg-[#0a0a0a]">
          <ul className="flex flex-col px-6 py-4 gap-2">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block text-xs font-mono py-1.5 transition-colors ${
                    pathname === href ? "text-[#d4f600]" : "text-[#666] hover:text-[#e0e0e0]"
                  }`}
                >
                  {pathname === href ? `> ${label}` : `  ${label}`}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="inline-block rounded-[2px] bg-[#d4f600] text-black px-4 py-1.5 text-xs font-mono font-bold"
              >
                contact →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
