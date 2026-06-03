import Link from "next/link";
import ProjectForm from "../project-form";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/projects" className="text-sm text-[#555] hover:text-white transition-colors">← Projects</Link>
        <h1 className="text-2xl font-bold mt-1">New project</h1>
      </div>
      <ProjectForm />
    </div>
  );
}
