import { notFound } from "next/navigation";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import ProjectForm from "../project-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, Number(id))).limit(1);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/projects" className="text-sm text-[#555] hover:text-white transition-colors">← Projects</Link>
        <h1 className="text-2xl font-bold mt-1">Edit project</h1>
      </div>
      <ProjectForm initial={{
        ...project,
        tags: (project.tags ?? []).join(", "),
        imageUrl: project.imageUrl ?? "",
        demoUrl: project.demoUrl ?? "",
        githubUrl: project.githubUrl ?? "",
        longDescription: project.longDescription ?? "",
        status: project.status ?? "active",
      }} />
    </div>
  );
}
