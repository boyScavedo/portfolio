import type { Metadata } from "next";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { asc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Jeevan Shrestha — developer, creator, and blogger.",
};

export default async function AboutPage() {
  const allSkills = await db.select().from(skills).orderBy(asc(skills.order));

  const grouped = allSkills.reduce<Record<string, typeof allSkills>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 space-y-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">About me</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p>
            Hi! I&apos;m Jeevan Shrestha — a developer passionate about building useful things for the web.
            I write about my learnings, share projects, and create content on YouTube.
          </p>
          <p>
            When I&apos;m not coding, I&apos;m exploring new technologies, writing blog posts, or filming videos about
            software development.
          </p>
        </div>
      </section>

      {Object.keys(grouped).length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold">Skills</h2>
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm font-medium"
                    >
                      {s.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Get in touch</h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Want to collaborate or just say hi? Reach me at{" "}
          <a href="mailto:shrestha9842889901@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            shrestha9842889901@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
