import Link from "next/link";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { asc } from "drizzle-orm";
import DeleteButton from "../posts/delete-button";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const all = await db.select().from(projects).orderBy(asc(projects.order));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-sm text-[#555] hover:text-white transition-colors">← Admin</Link>
          <h1 className="text-2xl font-bold mt-1 text-white">Projects</h1>
        </div>
        <Link href="/admin/projects/new" className="rounded-full bg-[#d4f600] text-black px-6 py-2.5 text-sm font-bold hover:bg-white transition-colors">
          New project
        </Link>
      </div>

      {all.length === 0 ? (
        <p className="text-[#555]">No projects yet.</p>
      ) : (
        <div className="divide-y divide-[#2a2a2a] rounded-xl border border-[#2a2a2a]">
          {all.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {p.featured && (
                    <span className="inline-block rounded-full bg-[#d4f600]/10 border border-[#d4f600]/20 text-[#d4f600] px-2 py-0.5 text-xs font-medium">Featured</span>
                  )}
                </div>
                <p className="font-medium truncate text-white">{p.title}</p>
                <p className="text-xs text-[#555] truncate">{p.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link href={`/admin/projects/${p.id}`} className="rounded-lg border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#555] hover:border-[#d4f600]/40 hover:text-[#d4f600] transition-colors">
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
