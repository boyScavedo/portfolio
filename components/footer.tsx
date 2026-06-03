import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/" className="font-bold text-xl text-white">
            JA<span className="text-[#d4f600]">.</span>
          </Link>
          <p className="text-xs text-[#555]">© {new Date().getFullYear()} Jeevan Shrestha. All rights reserved.</p>
        </div>

        <div className="flex gap-6 text-sm text-[#555]">
          <Link href="/blog/feed.xml" className="hover:text-[#d4f600] transition-colors">RSS</Link>
          <a href="https://github.com/boyScavedo" target="_blank" rel="noopener noreferrer" className="hover:text-[#d4f600] transition-colors">GitHub</a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#d4f600] transition-colors">YouTube</a>
          <Link href="/contact" className="hover:text-[#d4f600] transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
