// components/showcase/scenes/HeroShrink.tsx
// Layer 2 – full-viewport light hero that clip-shrinks into a framed window.
// Inside the frame the Build Marker morphs into the Cursor Buddy, then the LC ribbon.
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { LCRibbon } from "../svg/Markers";
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onHire}
                className="cursor-pointer rounded-full border border-black bg-black px-7 py-3 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-lime hover:text-black"
              >
                Hire me
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onSeeWork}
                className="cursor-pointer rounded-full border border-neutral-400 bg-white/85 px-7 py-3 text-xs font-semibold text-neutral-900 shadow-sm transition-colors hover:border-black hover:bg-black hover:text-white"
              >
                See the work
              </motion.button>
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

        {/* Centerpiece inside the shrinking frame: Lawrence Cortes */}
        <div className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center">
          <div className="js-hero-marker lc-gpu absolute flex h-[360px] w-[280px] sm:h-[560px] sm:w-[420px] items-end justify-center">
            {/* Ambient Backlight Aura */}
            <div className="absolute bottom-16 h-56 w-56 rounded-full bg-lime/25 blur-[70px] pointer-events-none" />

            {/* Lawrence Cortes Cutout Portrait */}
            <div className="relative w-full h-full flex items-end justify-center filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]">
              <Image
                src="/assets/person_new.png"
                alt="Lawrence Cortes"
                width={720}
                height={953}
                priority
                className="w-auto h-[95%] object-contain select-none pointer-events-none"
              />
            </div>
          </div>

          {/* Lawrence's Portrait Avatar inside shrunk frame */}
          <div className="js-buddy lc-gpu absolute flex h-[240px] w-[240px] items-center justify-center opacity-0">
            <div className="relative w-44 h-44 rounded-full overflow-hidden border-2 border-lime shadow-[0_0_30px_rgba(184,255,1,0.35)] bg-black">
              <Image
                src="/images/lawrence-face.jpg"
                alt="Lawrence Cortes"
                fill
                sizes="176px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="js-ribbon-stage lc-gpu absolute flex h-[240px] w-[340px] items-center justify-center opacity-0">
            <LCRibbon />
          </div>
        </div>
      </div>
    </div>
  );
}
