// components/showcase/scenes/HeroShrink.tsx
// Layer 2 – full-viewport light hero that clip-shrinks into a framed window.
// "Lawrence" sits BEHIND the cutout portrait (`z-[2]` behind `z-[12]`),
// the green script tag is removed from .js-hero-left, and the dynamic changing
// effect is transferred to the green script / surname on "Cortes".
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Sparkles, ArrowDownRight, Check } from "lucide-react";
import { LCRibbon } from "../svg/Markers";
import { techAvatars } from "@/data/showcase";

interface HeroShrinkProps {
  onHire: () => void;
  onSeeWork: () => void;
}

export default function HeroShrink({ onHire, onSeeWork }: HeroShrinkProps) {
  const [hireMorph, setHireMorph] = useState(false);
  const [workMorph, setWorkMorph] = useState(false);

  const handleHireClick = () => {
    setHireMorph(true);
    onHire();
    setTimeout(() => setHireMorph(false), 600);
  };

  const handleWorkClick = () => {
    setWorkMorph(true);
    onSeeWork();
    setTimeout(() => setWorkMorph(false), 600);
  };

  return (
    <div className="js-hero-layer absolute inset-0 z-20 flex items-center justify-center">
      {/* Frame ring – matches the clip target size (see .lc-frame-size in showcase.css) */}
      <div className="js-frame-ring lc-frame-size pointer-events-none absolute z-30 rounded-[14px] opacity-0" />

      <div className="js-morph-box lc-gpu lc-noise relative h-screen w-screen overflow-hidden bg-studio">
        <div className="js-vignette pointer-events-none absolute inset-0 bg-gradient-to-b from-[#b8b8b8] via-[#d8d8d8] to-[#efefef] opacity-0" />

        {/* LAYER 1 (z-[2]): "Lawrence" giant wordmark positioned BEHIND the center cutout */}
        <div className="pointer-events-none absolute inset-0 z-[2] mx-auto flex max-w-[1440px] flex-col justify-between px-6 pb-10 pt-24 sm:px-12 sm:pb-12">
          <div className="js-hero-left lc-gpu relative flex flex-col items-start pt-[4vh]">
            <div className="relative inline-block">
              <h1 className="js-hero-name select-none font-ui text-[19vw] font-extrabold leading-[0.83] tracking-[-0.055em] text-[#171717] sm:text-[138px] xl:text-[178px]">
                Lawrence
              </h1>
            </div>
          </div>
          <div />
          <div />
        </div>

        {/* LAYER 2 (z-[12]): Centerpiece Cutout in FRONT of "Lawrence" */}
        <div className="pointer-events-none absolute inset-0 z-[12] flex items-center justify-center">
          <div className="js-hero-marker lc-gpu absolute flex h-[390px] w-[300px] sm:h-[600px] sm:w-[460px] items-end justify-center">
            {/* Ambient Backlight Aura */}
            <div className="absolute bottom-16 h-64 w-64 rounded-full bg-lime/35 blur-[75px] pointer-events-none" />

            {/* Lawrence Cortes Cutout Portrait (overlaps in front of "Lawrence" typography) */}
            <div className="relative w-full h-full flex items-end justify-center filter drop-shadow-[0_28px_42px_rgba(0,0,0,0.42)]">
              <Image
                src="/assets/person_new.png"
                alt="Lawrence Cortes"
                width={720}
                height={953}
                priority
                className="w-auto h-[96%] object-contain select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Lawrence's Portrait Avatar inside shrunk frame (eagerly loaded native img so it never disappears when parent starts at opacity 0) */}
          <div className="js-buddy lc-gpu absolute flex h-[240px] w-[240px] items-center justify-center opacity-0">
            <div className="relative w-44 h-44 rounded-full overflow-hidden border-[3px] border-lime shadow-[0_0_36px_rgba(184,255,1,0.5)] bg-neutral-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/lawrence-face.jpg"
                alt="Lawrence Cortes"
                loading="eager"
                decoding="sync"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="js-ribbon-stage lc-gpu absolute flex h-[240px] w-[340px] items-center justify-center opacity-0">
            <LCRibbon />
          </div>
        </div>

        {/* LAYER 3 (z-[20]): Interactive Elastic Morphing Buttons, "Cortes" with dynamic changing effect & Bottom Bar */}
        <div className="pointer-events-none absolute inset-0 z-[20] mx-auto flex max-w-[1440px] flex-col justify-between px-6 pb-10 pt-24 sm:px-12 sm:pb-12">
          {/* Top-left CTA buttons aligned under "Lawrence" */}
          <div className="js-hero-left-btns lc-gpu relative flex flex-col items-start pt-[4vh]">
            <div
              className="invisible select-none font-ui text-[19vw] font-extrabold leading-[0.83] tracking-[-0.055em] sm:text-[138px] xl:text-[178px]"
              aria-hidden="true"
            >
              Lawrence
            </div>
            <div className="pointer-events-auto mt-10 flex flex-wrap items-center gap-3 sm:mt-12">
              <button
                type="button"
                onClick={handleHireClick}
                className={`lc-elastic-pill cursor-pointer rounded-full border border-black font-semibold shadow-[0_14px_28px_rgba(0,0,0,0.18)] flex items-center gap-2 text-xs ${
                  hireMorph
                    ? "bg-lime text-black px-9 py-3.5 scale-105 shadow-[0_16px_36px_rgba(184,255,1,0.45)]"
                    : "bg-black text-white px-7 py-3 hover:bg-lime hover:text-black hover:px-8"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{hireMorph ? "Opening Contact…" : "Hire me"}</span>
              </button>
              <button
                type="button"
                onClick={handleWorkClick}
                className={`lc-elastic-pill cursor-pointer rounded-full border font-semibold shadow-sm flex items-center gap-2 text-xs ${
                  workMorph
                    ? "border-black bg-black text-lime px-9 py-3.5 scale-105"
                    : "border-neutral-400 bg-white/90 text-neutral-900 px-7 py-3 hover:border-black hover:bg-black hover:text-white hover:px-8"
                }`}
              >
                <span>{workMorph ? "Loading Builds…" : "See the work"}</span>
                {workMorph ? <Check className="h-3.5 w-3.5 text-lime" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Right side: "Cortes" with the transferred dynamic changing green script effect */}
          <div className="js-hero-right lc-gpu relative flex flex-col items-end self-end">
            <div className="relative inline-block">
              <h2 className="js-hero-surname font-ui text-[17vw] font-extrabold leading-[0.83] tracking-[-0.055em] text-[#171717] transition-all duration-300 sm:text-[120px] xl:text-[150px]">
                Cortes
              </h2>
              <span className="js-hero-script font-script pointer-events-none absolute -bottom-8 right-2 inline-block -rotate-3 text-[12vw] font-bold text-[#8fd900] drop-shadow-[0_4px_16px_rgba(184,255,1,0.55)] transition-all duration-300 sm:-bottom-12 sm:right-8 sm:text-[80px] xl:text-[96px]">
                designs
              </span>
            </div>
          </div>

          <div className="js-hero-bottom lc-gpu pointer-events-auto relative flex items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold leading-tight text-neutral-700">
                Internship-ready
                <br />
                <span className="font-bold text-black">2026 · Ormoc City, PH</span>
              </p>
              <div className="flex items-center -space-x-2">
                {techAvatars.map((t) => (
                  <motion.span
                    key={t.label}
                    title={t.label}
                    whileHover={{ y: -4, scale: 1.15, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-studio text-[9px] font-black shadow-sm"
                    style={{ background: t.bg, color: t.fg }}
                  >
                    {t.short}
                  </motion.span>
                ))}
              </div>
            </div>
            <p className="hidden max-w-[220px] text-right text-[11px] font-medium leading-snug text-neutral-500 md:block">
              IT student, full-stack developer &amp; brand designer. Scroll to watch the signature come to life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
