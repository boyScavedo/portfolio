import Link from "next/link";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import DeleteButton from "../posts/delete-button";

export default async function AdminProjectsPage() {
  const all = await db.select().from(projects).orderBy(asc(projects.order));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">← Admin</Link>
          <h1 className="text-2xl font-bold mt-1">Projects</h1>
        </div>
        <Link href="/admin/projects/new" className="rounded-lg bg-neutral-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 hover:bg-neutral-700 transition-colors">
          New project
        </Link>
      </div>

      {all.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No projects yet.</p>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-800">
          {all.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {p.featured && (
                    <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 px-2 py-0.5 text-xs font-medium">Featured</span>
                  )}
                </div>
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-xs text-neutral-500 truncate">{p.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/admin/projects/${p.id}`} className="rounded-lg border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                  Edit
                </Link>
                <DeleteButton id={p.id} endpoint="/api/admin/projects" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
