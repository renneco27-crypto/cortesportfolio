"use client";

import React, { useEffect, useState } from "react";

export default function WireframeMeshLoader() {
  const [isDone, setIsDone] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Lock body scroll while wireframe is showing
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 1 second display timer, then seamlessly transition to the actual website
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsDone(true);
        document.body.style.overflow = originalOverflow;
      }, 400); // 400ms fade duration
    }, 1000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#050505] text-white overflow-y-auto select-none transition-opacity duration-400 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={isFading}
    >
      {/* ── 1. SwissNavbar Wireframe ── */}
      <header className="fixed top-0 left-0 w-full h-[60px] z-50 flex justify-between items-center px-6 md:px-10 bg-[#050505]/95 backdrop-blur-md border-b border-[#1c1c1f]">
        {/* Brand / Logo Wireframe */}
        <div className="flex items-center gap-3">
          <div className="wireframe-glint h-4 w-48 rounded-[2px] bg-[#1e1e22] border border-[#33333a]" />
          <div className="h-3 w-20 rounded-[2px] bg-[#e63946]/30 border border-[#e63946]/50" />
        </div>

        {/* Center Navigation Links Wireframe */}
        <nav className="hidden md:flex items-center gap-7">
          <div className="wireframe-glint h-3.5 w-14 rounded-[2px] bg-[#1c1c20] border border-[#2e2e36]" />
          <div className="wireframe-glint h-3.5 w-24 rounded-[2px] bg-[#1c1c20] border border-[#2e2e36]" />
          <div className="wireframe-glint h-3.5 w-20 rounded-[2px] bg-[#1c1c20] border border-[#2e2e36]" />
          <div className="wireframe-glint h-3.5 w-16 rounded-[2px] bg-[#1c1c20] border border-[#2e2e36]" />
        </nav>

        {/* Right CTA Action Buttons Wireframe */}
        <div className="flex items-center gap-3">
          <div className="wireframe-glint h-8 w-24 rounded-[2px] bg-[#1f1f24] border border-[#383842] flex items-center justify-center">
            <div className="h-2.5 w-14 rounded bg-[#33333c]" />
          </div>
          <div className="wireframe-glint w-8 h-8 rounded-[2px] bg-[#161618] border border-[#2b2b30]" />
        </div>
      </header>

      {/* ── Main Page Layout Wireframe (1:1 Match with Lawrence Cortes Portfolio) ── */}
      <main className="w-full min-h-screen flex flex-col items-center pt-[60px]">
        {/* ── 2. EditorialHero Section Wireframe (h-[85vh]) ── */}
        <section className="relative w-full h-[85vh] flex flex-col justify-center items-center text-center px-6 md:px-16 border-b border-[#141416]">
          {/* Subtle 3D Hero Scene Outline Canvas Grid */}
          <div className="absolute inset-x-8 inset-y-12 rounded border border-[#1a1a20] pointer-events-none opacity-40 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border border-dashed border-[#262630] rounded flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#e63946]/50 animate-ping" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center max-w-4xl w-full">
            {/* Eyebrow Tag: ENGINEERING PORTFOLIO // 2026 */}
            <div className="wireframe-glint h-4 w-56 rounded-[2px] bg-[#221c1f] border border-[#e63946]/40 mb-4 flex items-center justify-center">
              <div className="h-2 w-44 rounded bg-[#e63946]/50" />
            </div>

            {/* Main H1 Title: Lawrence Cortes (animated stretch) */}
            <div className="wireframe-stretch wireframe-glint h-12 sm:h-16 md:h-20 w-4/5 max-w-xl rounded-[2px] bg-[#222228] border border-[#3d3d48] mb-4" />

            {/* Subtitle: Full-Stack Web Systems • Cloud Infrastructure • UI/UX Architecture */}
            <div className="wireframe-stretch wireframe-glint h-4 md:h-5 w-3/5 max-w-lg rounded-[2px] bg-[#1c1c22] border border-[#30303a] mb-8" />

            {/* Terminal Console Line: $ system.init() — ready for full-stack & cloud deployment */}
            <div className="wireframe-glint inline-flex items-center h-10 px-4 w-full max-w-lg bg-[#111114] border-l-2 border-[#e63946] border-y border-r border-[#26262e] rounded-r-[2px] gap-3">
              <div className="wireframe-stretch h-3 w-64 rounded bg-[#2e2e38]" />
              <span className="inline-block w-2.5 h-4 bg-white/80 animate-pulse ml-auto" />
            </div>
          </div>
        </section>

        {/* ── 3. EditorialAbout Section Wireframe ── */}
        <section className="relative w-full max-w-6xl mx-auto py-20 px-6 md:px-16 border-b border-[#141416]">
          {/* Section Header: [ 01 // ABOUT LAWRENCE CORTES ] */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-[#1c1c20] mb-12">
            <div className="space-y-3 w-full max-w-md">
              <div className="h-3 w-48 rounded bg-[#e63946]/40 border border-[#e63946]/30" />
              <div className="wireframe-stretch wireframe-glint h-8 w-full rounded bg-[#24242c] border border-[#383844]" />
            </div>
            <div className="wireframe-glint h-3 w-40 rounded bg-[#1c1c22] border border-[#2b2b34] mt-4 md:mt-0" />
          </div>

          {/* Grid: Portrait (Left) & Narrative Bio (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Portrait Box Wireframe */}
            <div className="lg:col-span-4">
              <div className="wireframe-glint relative w-full aspect-square max-w-[340px] mx-auto lg:mx-0 rounded-[2px] border border-[#33333c] bg-[#16161a] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#202028] border border-[#383846]" />
              </div>
            </div>

            {/* Bio Narrative Lines Wireframe */}
            <div className="lg:col-span-8 space-y-4">
              <div className="wireframe-stretch wireframe-glint h-4 w-full rounded bg-[#222228] border border-[#32323c]" />
              <div className="wireframe-stretch wireframe-glint h-4 w-11/12 rounded bg-[#222228] border border-[#32323c]" />
              <div className="wireframe-stretch wireframe-glint h-4 w-4/5 rounded bg-[#222228] border border-[#32323c]" />
              <div className="wireframe-stretch wireframe-glint h-4 w-full rounded bg-[#222228] border border-[#32323c] pt-2" />
              <div className="wireframe-stretch wireframe-glint h-4 w-3/4 rounded bg-[#222228] border border-[#32323c]" />

              {/* Quote Bar Wireframe */}
              <div className="wireframe-glint h-8 w-full max-w-xl bg-[#141418] border-l-2 border-[#e63946] border-y border-r border-[#22222a] p-2 mt-4 flex items-center">
                <div className="wireframe-stretch h-3 w-4/5 rounded bg-[#2a2a34]" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. EditorialGitHub Activity Section Wireframe ── */}
        <section className="relative w-full max-w-6xl mx-auto py-16 px-6 md:px-16">
          <div className="flex justify-between items-center pb-6 border-b border-[#1c1c20] mb-8">
            <div className="h-3.5 w-40 rounded bg-[#e63946]/40 border border-[#e63946]/30" />
            <div className="wireframe-glint h-3 w-32 rounded bg-[#1c1c22] border border-[#2b2b34]" />
          </div>

          {/* Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="wireframe-glint h-20 rounded-[2px] bg-[#141418] border border-[#2b2b34] p-4 flex flex-col justify-between"
              >
                <div className="h-2.5 w-24 rounded bg-[#24242d]" />
                <div className="h-6 w-16 rounded bg-[#2e2e3a] border border-[#3e3e4c]" />
              </div>
            ))}
          </div>

          {/* GitHub Activity Heatmap Grid Skeleton */}
          <div className="wireframe-glint w-full h-32 rounded-[2px] bg-[#121216] border border-[#282832] p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-3 w-32 rounded bg-[#24242e]" />
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div key={lvl} className="w-3 h-3 rounded-[1px] bg-[#24242e] border border-[#343440]" />
                ))}
              </div>
            </div>
            <div className="w-full h-16 rounded bg-[#18181e] border border-[#282834] flex items-center justify-center">
              <div className="wireframe-stretch h-2 w-3/4 rounded bg-[#2a2a36]" />
            </div>
          </div>
        </section>
      </main>

      {/* ── 5. EditorialChatWidget Wireframe (Bottom-Right Floating [ INTERACT ]) ── */}
      <div className="fixed bottom-6 right-6 z-[70] flex items-center gap-3 bg-[#0a0a0a] border border-[#33333c] px-5 py-3 rounded-none shadow-2xl wireframe-glint">
        <div className="wireframe-stretch h-3 w-20 rounded bg-[#30303a]" />
        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
      </div>

      {/* ── Shimmer Glint & Expansion Keyframes ── */}
      <style jsx>{`
        @keyframes glint {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .wireframe-glint {
          position: relative;
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.12) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: glint 1.8s infinite linear;
        }

        @keyframes expandLength {
          0%, 100% {
            transform: scaleX(0.96);
            transform-origin: left;
          }
          50% {
            transform: scaleX(1.02);
            transform-origin: left;
          }
        }

        .wireframe-stretch {
          animation: expandLength 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
