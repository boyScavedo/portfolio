import Link from "next/link";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { asc } from "drizzle-orm";
import SkillsManager from "./skills-manager";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const all = await db.select().from(skills).orderBy(asc(skills.order));

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">← Admin</Link>
        <h1 className="text-2xl font-bold mt-1">Skills</h1>
      </div>
      <SkillsManager initial={all} />
    </div>
  );
}
