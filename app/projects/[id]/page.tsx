import { notFound } from "next/navigation";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, Number(id))).limit(1);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const [project] = await db.select().from(projects).where(eq(projects.id, Number(id))).limit(1);
  if (!project) notFound();

  return (
    <div className="flex flex-col pt-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6 pb-24 w-full">
        {/* Back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#555] hover:text-white transition-colors mb-10"
        >
          ← All projects
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            {project.featured && (
              <span className="rounded-full bg-[#d4f600]/10 border border-[#d4f600]/20 px-2.5 py-0.5 text-xs font-bold text-[#d4f600]">Featured</span>
            )}
            {project.status && project.status !== "active" && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                project.status === "planned"
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : project.status === "scrapped"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-[#1a1a1a] border-[#2a2a2a] text-[#666]"
              }`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">{project.title}</h1>
          <p className="text-lg text-[#666] leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(project.tags ?? []).map((tag) => (
              <span key={tag} className="rounded-full bg-[#1a1a1a] border border-[#2a2a2a] px-2.5 py-0.5 text-xs text-[#666]">{tag}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#d4f600] text-black px-6 py-2.5 text-sm font-bold hover:bg-white transition-colors">
                Live demo ↗
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#333] text-[#888] px-6 py-2.5 text-sm font-bold hover:border-[#d4f600] hover:text-[#d4f600] transition-colors">
                GitHub ↗
              </a>
            )}
          </div>
        </div>

        {/* Cover image */}
        {project.imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-[#1a1a1a] mb-10">
            <img src={project.imageUrl} alt={project.title} className="w-full object-cover max-h-[480px]" />
          </div>
        )}

        {/* Content */}
        {project.longDescription ? (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none
            prose-headings:font-black prose-headings:tracking-tight
            prose-a:text-[#d4f600] prose-a:no-underline hover:prose-a:underline
            prose-code:bg-[#1a1a1a] prose-code:rounded prose-code:px-1
            prose-pre:bg-[#111] prose-pre:border prose-pre:border-[#1a1a1a]
            prose-blockquote:border-l-[#d4f600] prose-blockquote:text-[#888]
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.longDescription}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] p-10 text-center text-[#555] text-sm">
            No detailed description yet.
          </div>
        )}
      </div>
    </div>
  );
}
