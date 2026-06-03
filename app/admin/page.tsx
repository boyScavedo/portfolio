import Link from "next/link";
import { db } from "@/db";
import { posts, projects, comments, skills } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import LogoutButton from "./logout-button";

export default async function AdminPage() {
  const [[postCount], [projectCount], [pendingCount], [skillCount]] = await Promise.all([
    db.select({ count: count() }).from(posts),
    db.select({ count: count() }).from(projects),
    db.select({ count: count() }).from(comments).where(eq(comments.approved, false)),
    db.select({ count: count() }).from(skills),
  ]);

  const sections = [
    { title: "Posts", count: postCount.count, href: "/admin/posts", description: "Manage blog posts" },
    { title: "Projects", count: projectCount.count, href: "/admin/projects", description: "Manage portfolio projects" },
    { title: "Skills", count: skillCount.count, href: "/admin/skills", description: "Manage skills list" },
    { title: "Comments", count: pendingCount.count, href: "/admin/comments", description: `${pendingCount.count} pending approval`, highlight: pendingCount.count > 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin</h1>
        <LogoutButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`rounded-xl border p-5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors space-y-2 ${
              s.highlight
                ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30"
                : "border-neutral-200 dark:border-neutral-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{s.title}</span>
              <span className="text-2xl font-bold">{s.count}</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
