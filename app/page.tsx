import Link from "next/link";
import { db } from "@/db";
import { posts, projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatDate, readingTime } from "@/lib/utils";

export default async function Home() {
  const [latestPosts, featuredProjects] = await Promise.all([
    db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.publishedAt))
      .limit(3),
    db
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(projects.order)
      .limit(3),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 space-y-24">
      {/* Hero */}
      <section className="space-y-6">
        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          Hey, I&apos;m Jeevan
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">
          Developer, blogger,<br />
          <span className="text-neutral-400 dark:text-neutral-500">and creator.</span>
        </h1>
        <p className="max-w-xl text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
          I build web applications, share what I learn, and create content about software development.
          This is my corner of the internet.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
          >
            View projects
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            Read blog
          </Link>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Featured Projects</h2>
            <Link href="/projects" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              All projects →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((p) => (
              <div key={p.id} className="group rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors space-y-3">
                {p.imageUrl && (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-32 object-cover rounded-lg" />
                )}
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1">
                  {(p.tags ?? []).map((tag) => (
                    <span key={tag} className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 pt-1">
                  {p.demoUrl && (
                    <a href={p.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                      Live demo ↗
                    </a>
                  )}
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-neutral-500 hover:underline">
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Posts</h2>
            <Link href="/blog" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
              All posts →
            </Link>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {latestPosts.map((post) => (
              <article key={post.id} className="py-5 group">
                <Link href={`/blog/${post.slug}`} className="space-y-1 block">
                  <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                    {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
                    <span>{readingTime(post.content)} min read</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{post.excerpt}</p>
                  )}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(post.tags ?? []).map((tag) => (
                      <span key={tag} className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs text-neutral-600 dark:text-neutral-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
