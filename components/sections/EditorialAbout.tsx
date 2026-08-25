"use client";

import React from "react";
import Image from "next/image";
import { Check, Terminal, ArrowUpRight } from "lucide-react";

export default function EditorialAbout() {
  return (
    <section id="about" className="relative w-full bg-[#050505] text-white py-24 px-6 md:px-16 border-t border-[#1a1a1a] select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-6 border-b border-[#1c1c1c]">
        <div>
          <span className="font-mono text-xs tracking-widest text-[#e63946] uppercase block mb-2">
            [ 02 // BIOGRAPHY &amp; CAPABILITIES ]
          </span>
          <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tight">
            Developer by Logic. Designer by Eye.
          </h2>
        </div>
        <div className="font-mono text-xs text-[#777] mt-4 md:mt-0 uppercase">
          BASED IN PHILIPPINES // DEPLOYED WORLDWIDE
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Portrait & Visual Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="relative w-full aspect-[4/5] bg-[#0c0c0c] border border-[#222] overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
            <Image
              src="/images/lawrence-face.jpg"
              alt="Lawrence Cortes"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent font-mono text-xs flex justify-between items-center text-white">
              <span>LAWRENCE MANZO CORTES</span>
              <span className="text-[#e63946]">[STATUS: ONLINE]</span>
            </div>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-[#222] font-mono text-xs text-[#888] space-y-2">
            <div className="flex justify-between border-b border-[#1c1c1c] pb-2">
              <span className="text-white">LOCATION</span>
              <span>Cebu / Ormoc, Philippines</span>
            </div>
            <div className="flex justify-between border-b border-[#1c1c1c] pb-2">
              <span className="text-white">FOCUS</span>
              <span>Full-Stack, AI, Systems</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-white">AVAILABILITY</span>
              <span className="text-[#f4a261]">Open to Internships &amp; Roles</span>
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Bio & Metric Blocks */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-8">
          <div className="space-y-6 text-[#a5a5a5] font-light leading-relaxed text-base md:text-lg">
            <p>
              I bridge the strict, mathematical discipline of distributed software engineering with high-concept Swiss typography and brutalist UI design. Every system I build is engineered for deterministic latency, mathematical visual hierarchy, and relentless reliability.
            </p>
            <p>
              Having engineered full-scale AI agent workflows, real-time IoT incentives platforms, and automated computer-vision generators, I treat software architecture as functional art where every millisecond and pixel has a defined purpose.
            </p>
          </div>

          {/* Metric Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#1c1c1c]">
            <div className="bg-[#0c0c0c] border border-[#222] p-4">
              <div className="font-mono text-2xl md:text-3xl font-bold text-white mb-1">
                4+
              </div>
              <div className="font-mono text-[0.7rem] uppercase text-[#777]">
                Shipped Systems
              </div>
            </div>

            <div className="bg-[#0c0c0c] border border-[#222] p-4">
              <div className="font-mono text-2xl md:text-3xl font-bold text-[#e63946] mb-1">
                -30%
              </div>
              <div className="font-mono text-[0.7rem] uppercase text-[#777]">
                CPA Reduction
              </div>
            </div>

            <div className="bg-[#0c0c0c] border border-[#222] p-4">
              <div className="font-mono text-2xl md:text-3xl font-bold text-[#f4a261] mb-1">
                +20%
              </div>
              <div className="font-mono text-[0.7rem] uppercase text-[#777]">
                Lead Capture
              </div>
            </div>

            <div className="bg-[#0c0c0c] border border-[#222] p-4">
              <div className="font-mono text-2xl md:text-3xl font-bold text-white mb-1">
                25%
              </div>
              <div className="font-mono text-[0.7rem] uppercase text-[#777]">
                Workflow Savings
              </div>
            </div>
          </div>

          {/* Key Principles Checklist */}
          <div className="bg-[#0e0e0e] border border-[#222] p-6 space-y-3">
            <div className="font-mono text-xs tracking-wider text-white uppercase mb-2">
              ENGINEERING PILLARS:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-[#aaa]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#e63946]"></span>
                <span>Type-Safe Strict Compilations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#f4a261]"></span>
                <span>Sub-50ms Global Edge Routing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#e63946]"></span>
                <span>International Typographic System</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#f4a261]"></span>
                <span>Zero-Trust API Hardening</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
