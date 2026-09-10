"use client";

import React, { useState } from "react";
import { ArrowUpRight, X, CheckCircle2 } from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface ProjectItem {
  id: string;
  num: string;
  badge: string;
  title: string;
  shortDescription: string;
  description: string;
  results: string[];
  techStack: string[];
  githubUrl: string;
  featured?: boolean;
  color: string;
}

const projectData: ProjectItem[] = [
  {
    id: "ai-chatbot",
    num: "01",
    badge: "AI / LLM REASONING",
    title: "AI Portfolio Chatbot",
    shortDescription:
      "A recruiter-focused AI assistant providing instant, conversational access to architectural qualifications, project telemetry, and candidate evaluation.",
    description:
      "The chatbot integrates real-time token streaming with fallback rate-limiting, custom system prompt boundaries, and low-latency response generation. It enables recruiters and hiring managers to probe technical qualifications interactively.",
    results: [
      "Zero-latency multi-turn conversational streaming",
      "Robust client-side rate limiting & IP token bucket",
      "Contextual multi-agent routing for portfolio knowledge",
    ],
    techStack: ["Next.js 16", "Vercel AI SDK", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/renneco27-crypto/cortesportfolio",
    featured: true,
    color: "#e63946",
  },
  {
    id: "trash-for-cash",
    num: "02",
    badge: "IOT / SUSTAINABILITY",
    title: "CampusTrash4Cash",
    shortDescription:
      "A sustainability-focused incentives platform encouraging responsible waste sorting across academic campuses through dynamic QR verification.",
    description:
      "A full-stack mobile and cloud architecture that issues tokenized digital credits when students deposit recyclables into designated receptacles. Features real-time vendor settlement and ledger accountability.",
    results: [
      "Sub-second QR scan and transaction confirmation",
      "Promotes cleaner educational environments",
      "Incentivized peer recycling economy",
    ],
    techStack: ["React Native", "Firebase", "Node.js", "QR Verification"],
    githubUrl: "https://github.com/crisantohcortes1-commits/-Trash4CashBarcode",
    color: "#f4a261",
  },
  {
    id: "auto-cert",
    num: "03",
    badge: "AUTOMATION / VISION",
    title: "AutoCertificationAI",
    shortDescription:
      "An intelligent batch-generation platform creating thousands of cryptographically verifiable certificates in seconds.",
    description:
      "High-throughput pipeline that ingests CSV rosters and dynamically generates print-ready certificates with auto-adjusting text kerning, typographic bounding boxes, and QR authenticity links.",
    results: [
      "95% reduction in administrative certification time",
      "Automated typographic kerning and canvas scaling",
      "Bulk parallel PDF/image rendering engine",
    ],
    techStack: ["Python", "OpenCV", "PIL", "Batch Queues"],
    githubUrl: "https://github.com/renneco27-crypto/AutoCertificationAI",
    color: "#e63946",
  },
  {
    id: "student-grading",
    num: "04",
    badge: "EDTECH / ANALYTICS",
    title: "Student Grading & Projection App",
    shortDescription:
      "A self-assessment and academic performance forecasting engine for engineering cohorts.",
    description:
      "Interactive data analytics system analyzing weighted coursework components to project final grade outcomes, allowing students to simulate score requirements for academic honors.",
    results: [
      "Real-time predictive grade trajectory modeling",
      "Interactive weighted GPA calculators",
      "Instant scenario simulation for exam targets",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Chart Engines"],
    githubUrl: "https://github.com/crisantohcortes1-commits/studentself_gradingapp",
    color: "#9b2226",
  },
];

export default function EditorialProjects() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="relative w-full bg-[#050505] text-white py-24 px-6 md:px-16 border-t border-[#1a1a1a] select-none">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-6 border-b border-[#1c1c1c]">
        <div>
          <span className="font-mono text-xs tracking-widest text-[#e63946] uppercase block mb-2">
            [ 03 // DEPLOYED SYSTEMS &amp; SCHEMATICS ]
          </span>
          <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tight">
            Selected Engineering Works
          </h2>
        </div>
        <div className="font-mono text-xs text-[#777] mt-4 md:mt-0 uppercase">
          INDEXED BY RELEVANCE &amp; ARCHITECTURAL IMPACT
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projectData.map((project) => (
          <div
            key={project.id}
            className={`group relative bg-[#0a0a0a] border border-[#222222] p-8 flex flex-col justify-between transition-all duration-300 hover:border-[#555555] hover:bg-[#0e0e0e] ${
              project.featured ? "md:col-span-2 bg-[#0c0c0c] border-[#2d2d2d]" : ""
            }`}
          >
            {/* Top metadata */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-mono text-xs tracking-widest text-[#f4a261] uppercase">
                  PROJECT {project.num} // {project.badge}
                </span>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="font-mono text-xs text-[#888] hover:text-white flex items-center gap-1 uppercase transition-colors cursor-pointer"
                >
                  <span>INSPECT SPEC</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-2xl md:text-4xl font-normal tracking-tight text-white mb-4 group-hover:text-[#ececec] transition-colors">
                {project.title}
              </h3>

              <p className="text-[#a0a0a0] text-sm md:text-base font-light leading-relaxed mb-8 max-w-3xl">
                {project.shortDescription}
              </p>
            </div>

            {/* Bottom Stack & Links */}
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[0.72rem] uppercase tracking-wider text-[#ccc] bg-[#161616] border border-[#2c2c2c] px-3 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#1a1a1a]">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider text-white hover:text-[#e63946] flex items-center gap-1.5 transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>Repository</span>
                </a>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="font-mono text-xs uppercase tracking-wider text-[#888] hover:text-white transition-colors cursor-pointer"
                >
                  Detailed Blueprint &rarr;
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Blueprint Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#0d0d0d] border border-[#333] p-8 md:p-12 text-white shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-[#888] hover:text-white transition-colors p-2"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="font-mono text-xs tracking-widest text-[#e63946] uppercase mb-2">
              [ SPECIFICATION SHEET // {selectedProject.badge} ]
            </div>

            <h3 className="text-3xl md:text-4xl font-normal tracking-tight mb-6">
              {selectedProject.title}
            </h3>

            <div className="space-y-6 text-[#b0b0b0] font-light leading-relaxed text-sm md:text-base">
              <p>{selectedProject.description}</p>

              <div>
                <h4 className="font-mono text-xs uppercase tracking-widest text-white mb-3">
                  KEY ARCHITECTURAL OUTCOMES:
                </h4>
                <ul className="space-y-2">
                  {selectedProject.results.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#e63946] shrink-0 mt-1" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

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

            <div className="mt-8 pt-6 border-t border-[#222] flex justify-between items-center">
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-wider bg-white text-black font-bold px-5 py-2.5 hover:bg-[#ccc] transition-colors inline-flex items-center gap-2"
              >
                <GithubIcon className="w-4 h-4" />
                <span>View Source Code</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

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
    </section>
  );
}
