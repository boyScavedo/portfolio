import Link from "next/link";
import { db } from "@/db";
import { posts, projects, comments, skills, messages } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import LogoutButton from "./logout-button";

export default async function AdminPage() {
  const [[postCount], [projectCount], [pendingComments], [skillCount], [unreadMessages]] = await Promise.all([
    db.select({ count: count() }).from(posts),
    db.select({ count: count() }).from(projects),
    db.select({ count: count() }).from(comments).where(eq(comments.approved, false)),
    db.select({ count: count() }).from(skills),
    db.select({ count: count() }).from(messages).where(eq(messages.read, false)),
  ]);

  const sections = [
    { title: "Posts", count: postCount.count, href: "/admin/posts", sub: "Blog posts" },
    { title: "Projects", count: projectCount.count, href: "/admin/projects", sub: "Portfolio projects" },
    { title: "Skills", count: skillCount.count, href: "/admin/skills", sub: "Skill entries" },
    { title: "Comments", count: pendingComments.count, href: "/admin/comments", sub: "Pending approval", alert: pendingComments.count > 0 },
    { title: "Messages", count: unreadMessages.count, href: "/admin/messages", sub: "Unread messages", alert: unreadMessages.count > 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#555] uppercase tracking-widest">Dashboard</p>
          <h1 className="text-3xl font-bold mt-1">Admin</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`rounded-2xl border p-6 hover:-translate-y-0.5 transition-all space-y-3 group ${
              s.alert
                ? "border-[#d4f600]/30 bg-[#d4f600]/5"
                : "border-[#1a1a1a] bg-[#111]"
            }`}
          >
            <p className={`text-4xl font-black group-hover:text-[#d4f600] transition-colors ${s.alert ? "text-[#d4f600]" : "text-white"}`}>
              {s.count}
            </p>
            <div>
              <p className="font-semibold text-sm">{s.title}</p>
              <p className="text-xs text-[#555]">{s.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-[#1a1a1a] bg-[#111] p-6">
        <h2 className="font-semibold mb-4 text-sm text-[#555] uppercase tracking-widest">Quick links</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "New post", href: "/admin/posts/new" },
            { label: "New project", href: "/admin/projects/new" },
            { label: "View site", href: "/" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full border border-[#2a2a2a] px-4 py-2 text-sm text-[#888] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors">
              {l.label} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
