// components/showcase/scenes/HeroShrink.tsx
// Layer 2 – full-viewport light hero that clip-shrinks into a framed window.
// Inside the frame the Build Marker morphs into the Cursor Buddy, then the LC ribbon.
import React from "react";
import { HeroBuildMarker, CursorBuddy, LCRibbon } from "../svg/Markers";
import { techAvatars } from "@/data/showcase";

interface HeroShrinkProps {
  onHire: () => void;
  onSeeWork: () => void;
}

export default function HeroShrink({ onHire, onSeeWork }: HeroShrinkProps) {
  return (
    <div className="js-hero-layer absolute inset-0 z-20 flex items-center justify-center">
      {/* Frame ring – matches the clip target size (see .lc-frame-size in showcase.css) */}
      <div className="js-frame-ring lc-frame-size pointer-events-none absolute z-30 rounded-[14px] opacity-0" />

      <div className="js-morph-box lc-gpu lc-noise relative h-screen w-screen overflow-hidden bg-studio">
        <div className="js-vignette pointer-events-none absolute inset-0 bg-gradient-to-b from-[#b8b8b8] via-[#d8d8d8] to-[#efefef] opacity-0" />

        {/* Hero typography & UI */}
        <div className="absolute inset-0 mx-auto flex max-w-[1440px] flex-col justify-between px-6 pb-10 pt-24 sm:px-12 sm:pb-12">
          <div className="js-hero-left lc-gpu relative z-10 flex flex-col items-start pt-[4vh]">
            <div className="relative inline-block">
              <h1 className="js-hero-name font-ui text-[17vw] font-extrabold leading-[0.83] tracking-[-0.055em] text-[#171717] sm:text-[120px] xl:text-[150px]">
                Lawrence
              </h1>
              <span className="js-hero-script font-script pointer-events-none absolute -bottom-8 left-[42%] inline-block -rotate-3 text-[12vw] font-bold text-[#8fd900] drop-shadow-[0_4px_16px_rgba(184,255,1,0.5)] sm:-bottom-12 sm:text-[80px] xl:text-[96px]">
                builds
              </span>
            </div>
            <div className="mt-14 flex flex-wrap items-center gap-3 sm:mt-16">
              <button
                type="button"
                onClick={onHire}
                className="rounded-full border border-black bg-black px-7 py-3 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-lime hover:text-black"
              >
                Hire me
              </button>
              <button
                type="button"
                onClick={onSeeWork}
                className="rounded-full border border-neutral-400 bg-white/85 px-7 py-3 text-xs font-semibold text-neutral-900 shadow-sm transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
              >
                See the work
              </button>
            </div>
          </div>

          <div className="js-hero-right lc-gpu relative z-10 flex flex-col items-end self-end">
            <div className="relative inline-block">
              <h2 className="js-hero-surname font-ui text-[17vw] font-extrabold leading-[0.83] tracking-[-0.055em] text-[#171717] sm:text-[120px] xl:text-[150px]">
                Cortes
              </h2>
              <span className="font-script pointer-events-none absolute -bottom-8 right-2 -rotate-3 text-[12vw] font-bold text-[#8fd900] drop-shadow-[0_4px_16px_rgba(184,255,1,0.5)] sm:-bottom-12 sm:right-8 sm:text-[80px] xl:text-[96px]">
                designs
              </span>
            </div>
          </div>

          <div className="js-hero-bottom lc-gpu relative z-10 flex items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold leading-tight text-neutral-700">
                Internship-ready
                <br />
                <span className="font-bold text-black">2026 · Ormoc City, PH</span>
              </p>
              <div className="flex items-center -space-x-2">
                {techAvatars.map((t) => (
                  <span
                    key={t.label}
                    title={t.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-studio text-[9px] font-black"
                    style={{ background: t.bg, color: t.fg }}
                  >
                    {t.short}
                  </span>
                ))}
              </div>
            </div>
            <p className="hidden max-w-[220px] text-right text-[11px] font-medium leading-snug text-neutral-500 md:block">
              IT student, full-stack developer &amp; brand designer. Scroll to watch the signature come to life.
            </p>
          </div>
        </div>

        {/* Centerpiece inside the shrinking frame */}
        <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
          <div className="js-hero-marker lc-gpu absolute flex h-[330px] w-[200px] items-center justify-center sm:h-[550px] sm:w-[340px]">
            <div className="absolute bottom-10 h-52 w-52 rounded-full bg-lime/35 blur-[60px]" />
            <HeroBuildMarker />
          </div>

          <div className="js-buddy lc-gpu absolute flex h-[230px] w-[300px] items-center justify-center opacity-0">
            <CursorBuddy />
          </div>

          <div className="js-ribbon-stage lc-gpu absolute flex h-[240px] w-[340px] items-center justify-center opacity-0">
            <LCRibbon />
          </div>
        </div>
      </div>
    </div>
  );
}
