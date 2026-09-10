"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import SwissNavbar from "@/components/layout/SwissNavbar";
import NodeCanvas from "@/components/ui/NodeCanvas";
import EditorialChatWidget from "@/components/ui/EditorialChatWidget";
import { projectsData } from "@/data/projects";
import type { Project } from "@/types";
import { ArrowUpRight, X, CheckCircle2, Search, ExternalLink, ArrowLeft } from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const CATEGORIES = [
  { id: "all", label: "All Works" },
  { id: "ai", label: "AI & LLM" },
  { id: "edtech", label: "EdTech" },
  { id: "automation", label: "Automation" },
  { id: "web", label: "Web Systems" },
  { id: "sustainability", label: "Sustainability" },
  { id: "accessibility", label: "Accessibility" },
  { id: "marketing", label: "Marketing" },
];

export default function DedicatedProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesCategory =
        selectedCategory === "all" || project.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        (project.shortDescription && project.shortDescription.toLowerCase().includes(q)) ||
        project.description.toLowerCase().includes(q) ||
        project.techStack.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="bg-[#050505] min-h-screen text-white relative flex flex-col">
      <NodeCanvas />
      <SwissNavbar />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-24 flex-1">
        {/* Breadcrumb & Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs text-[#888] hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Main Overview</span>
          </Link>
          <div className="font-mono text-xs text-[#555] hidden sm:block">
            TOTAL INDEXED: <span className="text-white font-bold">{projectsData.length}</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-8 border-b border-[#1c1c1c]">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#e63946] uppercase block mb-2">
              [ 03 // DEPLOYED SYSTEMS &amp; SCHEMATICS ]
            </span>
            <h1 className="text-4xl md:text-6xl font-light uppercase tracking-tight text-white">
              Selected Engineering Works
            </h1>
          </div>
          <div className="font-mono text-xs text-[#777] mt-4 md:mt-0 uppercase">
            INDEXED BY RELEVANCE &amp; ARCHITECTURAL IMPACT
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-10 pb-6 border-b border-[#141414]">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-[2px] transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-white text-black font-bold"
                    : "bg-[#111] text-[#888] border border-[#222] hover:border-[#444] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stack or title..."
              className="w-full bg-[#111] border border-[#222] focus:border-white text-white font-mono text-xs pl-9 pr-4 py-2 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <article
                key={project.id}
                className="group relative bg-[#090909] border border-[#202020] hover:border-[#444] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Project Image Header */}
                <div className="relative w-full h-56 md:h-64 bg-[#141414] overflow-hidden border-b border-[#1c1c1c]">
                  <Image
                    src={project.thumbnailSrc}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-black/30" />

                  {/* Top Metadata Bar */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <span className="font-mono text-[0.7rem] uppercase tracking-widest px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/15 text-[#f4a261]">
                      SYS.{(index + 1).toString().padStart(2, "0")} // {project.badge || project.category}
                    </span>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="font-mono text-[0.7rem] uppercase tracking-wider px-2.5 py-1 bg-black/80 backdrop-blur-md border border-white/15 text-[#aaa] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>INSPECT SPEC</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="text-2xl font-normal tracking-tight text-white mb-3 group-hover:text-[#ececec] transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-[#a0a0a0] text-sm font-light leading-relaxed mb-6">
                      {project.shortDescription || project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[0.68rem] uppercase tracking-wider text-[#bbb] bg-[#141414] border border-[#282828] px-2.5 py-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#1a1a1a]">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs uppercase tracking-wider text-white hover:text-[#e63946] flex items-center gap-1.5 transition-colors"
                        >
                          <GithubIcon className="w-4 h-4" />
                          <span>Source Code</span>
                        </a>
                      )}

                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs uppercase tracking-wider text-[#a78bfa] hover:text-white flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Site</span>
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="font-mono text-xs uppercase tracking-wider text-[#888] hover:text-white ml-auto transition-colors cursor-pointer"
                      >
                        Detailed Blueprint &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-[#222] bg-[#0a0a0a] rounded-[2px]">
            <p className="font-mono text-sm text-[#777] uppercase">
              No projects matched the search criteria &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 font-mono text-xs text-white underline uppercase cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Blueprint / Spec Lightbox Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#0d0d0d] border border-[#333] p-8 md:p-12 text-white shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-[#888] hover:text-white transition-colors p-2 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="font-mono text-xs tracking-widest text-[#e63946] uppercase mb-2">
              [ SPECIFICATION SHEET // {selectedProject.badge || selectedProject.category} ]
            </div>

            <h3 className="text-3xl md:text-4xl font-normal tracking-tight mb-4">
              {selectedProject.title}
            </h3>

            {/* Modal Image Preview */}
            <div className="relative w-full h-52 md:h-64 bg-[#141414] border border-[#222] mb-6 overflow-hidden rounded-[2px]">
              <Image
                src={selectedProject.thumbnailSrc}
                alt={selectedProject.title}
                fill
                className="object-cover object-top"
              />
            </div>

            <div className="space-y-6 text-[#b0b0b0] font-light leading-relaxed text-sm md:text-base">
              <p>{selectedProject.description}</p>

              {selectedProject.results && selectedProject.results.length > 0 && (
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-white mb-3">
                    KEY ARCHITECTURAL OUTCOMES:
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.results.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#e63946] shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-white mb-3">
                  ENGINEERING STACK:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs uppercase text-white bg-[#1a1a1a] border border-[#333] px-3 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#222] flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-wider bg-white text-black font-bold px-5 py-2.5 hover:bg-[#ccc] transition-colors inline-flex items-center gap-2"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>View Repository</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}

                {selectedProject.liveDemoUrl && (
                  <a
                    href={selectedProject.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-wider bg-[#141414] text-white border border-[#333] hover:border-white px-5 py-2.5 transition-colors inline-flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="font-mono text-xs uppercase text-[#888] hover:text-white transition-colors cursor-pointer"
              >
                Close Spec [ESC]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Widgets */}
      <EditorialChatWidget />
    </main>
  );
}
