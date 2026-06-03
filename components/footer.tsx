import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-auto">
      <div className="mx-auto max-w-5xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
        <p>© {new Date().getFullYear()} jeevan.dev — All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/blog/feed.xml" className="hover:text-neutral-900 dark:hover:text-white transition-colors">RSS</Link>
          <a href="https://github.com/boyScavedo" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors">GitHub</a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 dark:hover:text-white transition-colors">YouTube</a>
        </div>
      </div>
    </footer>
  );
}
