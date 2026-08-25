"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Cpu, Server, Terminal, ShieldCheck, ArrowRight, Zap, Code2, Database } from "lucide-react";

interface SlideData {
  id: string;
  tag: string;
  title: string;
  kicker: string;
  description: string;
  color: string;
  blocks: { color: string; label: string; sub: string }[];
  tags: string[];
}

const slides: SlideData[] = [
  {
    id: "01",
    tag: "[ MODULE 01 // ARCHITECTURAL CORE ]",
    title: "DISTRIBUTED CLOUD &\nSYSTEM PIPELINES",
    kicker: "01 / HIGH PERFORMANCE INFRASTRUCTURE",
    description:
      "Engineering resilient backends with sub-millisecond edge routing, asynchronous streaming microservices, and database transaction atomicity.",
    color: "#e63946",
    blocks: [
      { color: "#e63946", label: "EDGE RUNTIME", sub: "Cloudflare & Vercel Workers" },
      { color: "#f4a261", label: "DATA STREAM", sub: "Neon Postgres & Upstash Redis" },
      { color: "#9b2226", label: "CONTAINERS", sub: "Docker & Linux Daemons" },
      { color: "#1a1a1a", label: "SECURITY", sub: "Turnstile, Zero-Trust MFA" },
    ],
    tags: ["TypeScript", "Next.js 16", "PostgreSQL", "Redis", "Docker", "REST & GraphQL"],
  },
  {
    id: "02",
    tag: "[ MODULE 02 // INTELLIGENT RUNTIMES ]",
    title: "AI WORKFLOWS &\nNEURAL AGENTS",
    kicker: "02 / APPLIED MACHINE INTELLIGENCE",
    description:
      "Deploying high-throughput LLM reasoning loops, function calling pipelines, and semantic RAG systems built for enterprise scale.",
    color: "#f4a261",
    blocks: [
      { color: "#f4a261", label: "AGENT FRAMEWORK", sub: "Vercel AI SDK & Gemini Pro" },
      { color: "#e63946", label: "VECTOR INDEX", sub: "High-Dimensional Embeddings" },
      { color: "#222222", label: "LATENCY MASK", sub: "Token Streaming WebSockets" },
      { color: "#9b2226", label: "GUARDRAILS", sub: "Deterministic Schema Enforcers" },
    ],
    tags: ["Vercel AI SDK", "Anthropic Claude", "OpenAI", "Vector DBs", "Prompt Engineering"],
  },
  {
    id: "03",
    tag: "[ MODULE 03 // VISUAL & SYSTEM ENGINEERING ]",
    title: "SWISS EDITORIAL &\nGRAPHICAL COMPUTE",
    kicker: "03 / KINETIC UI & 2D PHYSICS",
    description:
      "Designing mathematical layouts adhering to International Typographic Style with custom shaders, mechanical wipe physics, and strict accessibility.",
    color: "#9b2226",
    blocks: [
      { color: "#9b2226", label: "2D CANVAS", sub: "Interactive Node Graphs" },
      { color: "#e63946", label: "KINETIC PHYSICS", sub: "Mechanical PowerPoint Wipes" },
      { color: "#f4a261", label: "TYPOGRAPHY", sub: "Grotesque & Monospace Grid" },
      { color: "#161616", label: "WEBGL 3D", sub: "Three.js Hardware Shaders" },
    ],
    tags: ["WebGL", "Three.js", "Tailwind CSS", "GSAP / Framer", "Figma", "Design Systems"],
  },
];

export default function MistralSlideSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const slide = slides[activeSlide];

  return (
    <section id="stack" className="relative w-full bg-[#050505] text-white py-20 px-6 md:px-16 border-t border-[#1a1a1a] select-none">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-6 border-b border-[#1c1c1c]">
        <div>
          <div className="text-xs font-mono tracking-widest text-[#e63946] mb-2 uppercase">
            [ ARCHITECTURAL MANIFESTO &amp; STACK ]
          </div>
          <h2 className="text-4xl md:text-6xl font-light tracking-tight uppercase">
            System Modules &amp; Kinetic Logic
          </h2>
        </div>

        {/* Slide Controller Tabs (PowerPoint style slide selector) */}
        <div className="flex items-center gap-2 mt-6 md:mt-0">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveSlide(idx)}
              className={`font-mono text-xs px-4 py-2 uppercase border transition-all duration-150 cursor-pointer ${
                activeSlide === idx
                  ? "bg-white text-black border-white font-bold"
                  : "bg-[#111] text-[#888] border-[#262626] hover:border-[#555] hover:text-white"
              }`}
            >
              MODULE {s.id}
            </button>
          ))}
        </div>
      </div>

      {/* Kinetic Slide Viewport Container */}
      <div className="relative min-h-[580px] w-full border border-[#222222] bg-[#090909] p-6 md:p-12 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 40, clipPath: "inset(0 0 0 100%)" }}
            animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0 0%)" }}
            exit={{ opacity: 0, x: -40, clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex flex-col justify-between h-full"
          >
            {/* Top Row: Title + Expanding Description */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
              {/* Giant Typography Column */}
              <div className="lg:col-span-7">
                <div className="font-mono text-xs tracking-widest text-[#e63946] uppercase mb-3">
                  {slide.tag}
                </div>
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight whitespace-pre-line text-[#efefef] leading-[1.05]">
                  {slide.title}
                </h3>
              </div>

              {/* Editorial Description Column */}
              <div className="lg:col-span-5 bg-[#121212] border border-[#262626] p-6 rounded-[2px]">
                <div className="font-mono text-[0.75rem] tracking-wider text-[#f4a261] uppercase mb-2">
                  {slide.kicker}
                </div>
                <p className="text-[#a0a0a0] text-sm md:text-base font-light leading-relaxed mb-6">
                  {slide.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2">
                  {slide.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[0.7rem] uppercase tracking-wider text-white bg-[#1c1c1c] border border-[#333] px-2.5 py-1"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row: Rigid Mistral Color Blocks with Stiff Physics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {slide.blocks.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 + i * 0.08, ease: "easeOut" }}
                  className="group relative h-36 p-5 flex flex-col justify-between border border-[#262626] rounded-[2px] transition-transform hover:-translate-y-1 hover:border-[#555] duration-200"
                  style={{ backgroundColor: `${b.color}15`, borderLeftColor: b.color, borderLeftWidth: "3px" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[0.7rem] text-[#888] uppercase">
                      BLOCK 0{i + 1}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-[1px]"
                      style={{ backgroundColor: b.color }}
                    ></span>
                  </div>

                  <div>
                    <div className="font-mono text-xs font-bold tracking-wider text-white uppercase mb-1">
                      {b.label}
                    </div>
                    <div className="text-[0.8rem] text-[#aaa] font-light">
                      {b.sub}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Metric Floor Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 border-t border-[#1a1a1a] pt-6 font-mono text-xs text-[#777]">
        <div>
          <span className="text-white text-base block font-bold">99.9%</span>
          UPTIME SLA STANDARD
        </div>
        <div>
          <span className="text-white text-base block font-bold">&lt; 45ms</span>
          GLOBAL TTFB LATENCY
        </div>
        <div>
          <span className="text-white text-base block font-bold">100%</span>
          TYPESAFE SCHEMA VALIDATION
        </div>
        <div>
          <span className="text-white text-base block font-bold">0.00s</span>
          ZERO RUNTIME REGRESSIONS
        </div>
      </div>
    </section>
  );
}
