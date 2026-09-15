import Image from "next/image";
import Link from "next/link";
import { GitFork, ExternalLink } from "lucide-react";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  variant: "compact" | "featured";
}

export default function ProjectCard({ project, variant }: ProjectCardProps) {
  if (variant === "featured") {
    return (
      <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900 overflow-hidden grid md:grid-cols-2">
        <div className="relative h-56 md:h-auto bg-zinc-800">
          <Image src={project.thumbnailSrc} alt={project.title} fill className="object-cover opacity-80" />
        </div>
        <div className="p-6 flex flex-col gap-4">
          <span className="inline-block rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400 capitalize w-fit">
            {project.category}
          </span>
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <p className="text-sm text-zinc-400">{project.problemStatement}</p>
          <ul className="flex flex-wrap gap-2">
            {project.results.map((r) => (
              <li key={r} className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs text-yellow-400">{r}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.techStack.map((t) => (
              <span key={t} className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-mono text-zinc-400">{t}</span>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            {project.liveDemoUrl && (
              <Link href={project.liveDemoUrl} className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300">
                <ExternalLink size={14} /> Live Demo
              </Link>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white">
                <GitFork size={14} /> View Code
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900 overflow-hidden flex flex-col">
      <div className="relative h-40 bg-zinc-800">
        <Image src={project.thumbnailSrc} alt={project.title} fill className="object-cover opacity-80" />
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <span className="inline-block rounded-full bg-violet-400/10 px-3 py-1 text-xs text-violet-400 capitalize w-fit">
          {project.category}
        </span>
        <h3 className="text-base font-semibold text-white">{project.title}</h3>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.techStack.map((t) => (
            <span key={t} className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-mono text-zinc-400">{t}</span>
          ))}
        </div>
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-violet-400 mt-1">
            <GitFork size={12} /> View Code
          </a>
        )}
      </div>
    </div>
  );
}
