import Link from "next/link";
import { db } from "@/db";
import { posts, projects, comments, skills, messages } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import LogoutButton from "./logout-button";

async function getStats() {
  try {
    const [[postCount], [projectCount], [pendingComments], [skillCount], [unreadMessages]] = await Promise.all([
      db.select({ count: count() }).from(posts),
      db.select({ count: count() }).from(projects),
      db.select({ count: count() }).from(comments).where(eq(comments.approved, false)),
      db.select({ count: count() }).from(skills),
      db.select({ count: count() }).from(messages).where(eq(messages.read, false)),
    ]);
    return { postCount: postCount.count, projectCount: projectCount.count, pendingComments: pendingComments.count, skillCount: skillCount.count, unreadMessages: unreadMessages.count, error: null };
  } catch (e) {
    return { postCount: 0, projectCount: 0, pendingComments: 0, skillCount: 0, unreadMessages: 0, error: (e as Error).message };
  }
}

export default async function AdminPage() {
  const stats = await getStats();

  const sections = [
    { title: "posts", count: stats.postCount, href: "/admin/posts", sub: "blog posts" },
    { title: "projects", count: stats.projectCount, href: "/admin/projects", sub: "personal projects" },
    { title: "skills", count: stats.skillCount, href: "/admin/skills", sub: "skill entries" },
    { title: "comments", count: stats.pendingComments, href: "/admin/comments", sub: "pending approval", alert: stats.pendingComments > 0 },
    { title: "messages", count: stats.unreadMessages, href: "/admin/messages", sub: "unread inbox", alert: stats.unreadMessages > 0 },
    { title: "profile", count: null, href: "/admin/profile", sub: "identity & status" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-[#1a1a1a] pb-6">
        <div>
          <p className="text-[10px] font-mono text-[#555] uppercase tracking-widest mb-1">~/admin</p>
          <h1 className="font-mono font-black text-3xl text-[#e0e0e0]">dashboard<span className="text-[#d4f600]">_</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2px] border border-[#2a2a2a] px-4 py-2 text-xs font-mono text-[#888] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors"
          >
            view site ↗
          </Link>
          <LogoutButton />
        </div>
      </div>

      {stats.error && (
        <div className="rounded-[2px] border border-red-500/30 bg-red-500/10 p-4 text-xs font-mono text-red-400">
          // db error: {stats.error}. run <code className="bg-red-500/20 px-1">npx drizzle-kit push</code> to apply schema migrations.
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`rounded-[2px] border p-5 transition-all group ${
              s.alert
                ? "border-[#d4f600]/30 bg-[#d4f600]/5 hover:bg-[#d4f600]/8"
                : "border-[#1a1a1a] bg-[#0d0d0d] hover:border-[#2a2a2a]"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <p className={`font-mono text-4xl font-black group-hover:text-[#d4f600] transition-colors ${s.alert ? "text-[#d4f600]" : "text-[#e0e0e0]"}`}>
                {s.count ?? "→"}
              </p>
              {s.alert && <span className="rounded-[2px] bg-[#d4f600] text-black text-[10px] font-mono font-black px-1.5 py-0.5">!</span>}
            </div>
            <p className="font-mono font-bold text-sm text-[#e0e0e0]">{s.title}</p>
            <p className="font-mono text-[10px] text-[#555] mt-0.5">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[2px] border border-[#1a1a1a] bg-[#0d0d0d]">
          <div className="px-4 py-2 border-b border-[#1a1a1a]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// create</span>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {[
              { label: "new post", href: "/admin/posts/new" },
              { label: "new project", href: "/admin/projects/new" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-[2px] border border-[#2a2a2a] px-4 py-3 text-xs font-mono text-[#888] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors flex items-center justify-between">
                {l.label} <span>+</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2px] border border-[#1a1a1a] bg-[#0d0d0d]">
          <div className="px-4 py-2 border-b border-[#1a1a1a]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#555]">// manage</span>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {[
              { label: "edit profile", href: "/admin/profile" },
              { label: "manage skills", href: "/admin/skills" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-[2px] border border-[#2a2a2a] px-4 py-3 text-xs font-mono text-[#888] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors flex items-center justify-between">
                {l.label} <span>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
