// components/showcase/scenes/WorkShowcase.tsx
// Layer 3 – light panel that slides over the dark stage.
// Uses the exact single-#morph-container + .lc-state-layer elastic morphing principle from
// C:\Users\yuze2\Downloads\motion_study_02_ui_morphing_showcase.html:
//   - Only ONE morphing card container exists on stage (zero overlapping cards!).
//   - Switching builds (or scrolling into the Toolkit stage) elastically morphs width, height,
//     border-radius, background-color, and box-shadow with cubic-bezier(0.22, 1, 0.36, 1)
//     and pulses directional SVG motion blur (#svg-motion-blur).
//   - Previous state layers completely disappear (.exit-blur -> opacity: 0) while the active
//     layer scales & unblurs in (.active -> opacity: 1).
//   - When falling into the Toolkit stage ("What makes Lawrence stand out"), this exact same
//     #morph-container is reused and morphs into the Lawrence Cortes card (State 5).
import React, { useState } from "react";
import { ArrowUpRight, Volume2, RotateCcw, BookOpen, MousePointer } from "lucide-react";
import { motion } from "motion/react";
import { markerSpecs, toolkitCallouts, type Callout } from "@/data/showcase";

interface WorkShowcaseProps {
  activeIndex: number;
  shortlist: string[];
  onSelect: (index: number) => void;
  onToggleShortlist?: (projectId: string) => void;
  onCapToggle: () => void;
}

// Curved arc horizontal offset (px) and subtle tangent rotation (deg) for the 6 selector items
// (5 projects + 6th item: Lawrence Cortes Portrait Card so it is already up there before falling!)
const ARC_OFFSETS_X = [0, 22, 38, 38, 22, 0];
const ARC_ROTATIONS = [-5, -3, -1, 1, 3, 5];

export const SHOWCASE_SELECTOR_ITEMS = [
  ...markerSpecs.map((m) => ({
    id: m.projectId,
    shortName: m.shortName,
    aura: m.aura,
    scriptWord: m.scriptWord,
  })),
  {
    id: "lawrence-cortes-card",
    shortName: "Lawrence Cortes · ID",
    aura: "#b8ff01",
    scriptWord: "identity",
  },
];

// Distinct morph target geometries for each project state + State 5 (Lawrence Cortes Portrait Card)
// Directly following STATE_CONFIGS from motion_study_02_ui_morphing_showcase.html
export const MORPH_STATE_CONFIGS: Record<
  number,
  {
    width: number;
    height: number;
    radius: number;
    bg: string;
    aura: string;
    shadow: string;
  }
> = {
  0: {
    // Lex Memoria — Wide Codal Active-Recall Studio
    width: 470,
    height: 360,
    radius: 26,
    bg: "#0e151b",
    aura: "#ff2a54",
    shadow:
      "0 38px 75px -12px rgba(0, 0, 0, 0.58), 0 18px 36px -8px rgba(255, 42, 84, 0.28), 0 0 0 2px rgba(255, 255, 255, 0.9)",
  },
  1: {
    // StylePeek — Tall DevTools CSS Inspector Popup
    width: 344,
    height: 436,
    radius: 28,
    bg: "#101218",
    aura: "#ff6b00",
    shadow:
      "0 38px 75px -12px rgba(0, 0, 0, 0.6), 0 18px 36px -8px rgba(255, 107, 0, 0.28), 0 0 0 2px rgba(255, 255, 255, 0.9)",
  },
  2: {
    // NaturalVoice — Compact Squircle Neural Reader Popup
    width: 368,
    height: 368,
    radius: 34,
    bg: "#141624",
    aura: "#00bbf9",
    shadow:
      "0 38px 75px -12px rgba(0, 0, 0, 0.6), 0 18px 36px -8px rgba(0, 187, 249, 0.28), 0 0 0 2px rgba(255, 255, 255, 0.9)",
  },
  3: {
    // AI Chatbot — Crisp Terminal Command Window
    width: 416,
    height: 396,
    radius: 18,
    bg: "#050505",
    aura: "#9d4edd",
    shadow:
      "0 38px 75px -12px rgba(0, 0, 0, 0.68), 0 18px 36px -8px rgba(157, 78, 221, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.85)",
  },
  4: {
    // Trash4Cash — Attendance Scanner Portrait Card
    width: 356,
    height: 452,
    radius: 28,
    bg: "#101815",
    aura: "#22c55e",
    shadow:
      "0 38px 75px -12px rgba(0, 0, 0, 0.62), 0 18px 36px -8px rgba(34, 197, 94, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.9)",
  },
  5: {
    // State 5: Reused Lawrence Cortes Portrait Card
    width: 330,
    height: 360,
    radius: 22,
    bg: "#141414",
    aura: "#b8ff01",
    shadow:
      "0 34px 68px -12px rgba(0, 0, 0, 0.62), 0 0 34px rgba(184, 255, 1, 0.26), 0 0 0 2px rgba(255, 255, 255, 0.18)",
  },
};

function CalloutItem({ c, side }: { c: Callout; side: "left" | "right" }) {
  const line = (
    <div
      className={`js-callout-line relative h-px w-14 bg-neutral-300 sm:w-28 ${
        side === "left" ? "origin-right" : "origin-left"
      }`}
    >
      <span
        className={`absolute -top-1 h-2 w-2 rounded-full bg-neutral-400 ${
          side === "left" ? "right-0" : "left-0"
        }`}
      />
    </div>
  );
  return (
    <div
      className={`js-callout flex items-center gap-4 ${
        side === "left" ? "justify-start lg:justify-end" : "justify-start"
      }`}
    >
      {side === "right" && line}
      <div className={side === "left" ? "order-first text-left lg:text-right" : "text-left"}>
        <h3 className="text-sm font-bold leading-tight text-neutral-900 sm:text-base">
          {c.title[0]}
          <br />
          {c.title[1]}
        </h3>
        <p className="mt-1 hidden text-[11px] text-neutral-500 sm:block">{c.detail}</p>
      </div>
      {side === "left" && line}
    </div>
  );
}

/**
 * Masks out redundant baked-in buttons inside the underlying project screenshots
 * so buttons ONLY appear once — as the 3D floating cutout popups!
 */
function ProjectBaseImageMask({ projectId }: { projectId: string }) {
  switch (projectId) {
    case "lex-memoria":
      return (
        <>
          {/* Mask redundant top-right owl badge & middle toolbar in base screenshot */}
          <div
            className="pointer-events-none absolute right-2 top-2 h-16 w-36 rounded-xl bg-[#0b1218]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-4 top-[42%] h-8 w-56 rounded-full bg-[#0e161d]"
            aria-hidden="true"
          />
        </>
      );
    case "stylepeek-by-rence":
      return (
        <>
          {/* Mask redundant "Start inspecting" CTA button in base screenshot */}
          <div
            className="pointer-events-none absolute inset-x-4 top-[22%] h-12 rounded-xl bg-[#13151f]"
            aria-hidden="true"
          />
          {/* Mask redundant bottom purple callout in base screenshot */}
          <div
            className="pointer-events-none absolute inset-x-3 bottom-12 h-16 rounded-xl bg-[#101218]"
            aria-hidden="true"
          />
        </>
      );
    case "naturalvoice-edgescreenreader":
      return (
        <>
          {/* Mask redundant "Get Started Free / Watch Demo" buttons in base screenshot */}
          <div
            className="pointer-events-none absolute left-3 bottom-12 h-16 w-[68%] rounded-xl bg-gradient-to-r from-[#131524] via-[#151829] to-transparent"
            aria-hidden="true"
          />
        </>
      );
    case "ai-chatbot":
      return (
        <>
          {/* Mask redundant bottom-right [ INTERACT ] pill in base screenshot */}
          <div
            className="pointer-events-none absolute bottom-2 right-2 h-12 w-36 rounded-lg bg-[#050505]"
            aria-hidden="true"
          />
        </>
      );
    default:
      return null;
  }
}

/**
 * Renders the ACTUAL UI buttons and elements from inside each project's screenshot
 * as crisp, high-resolution floating 3D cutouts that:
 *   1. Start in the exact CENTER of the card (`translate3d(-50%, -50%, 10px) scale(0.42)`),
 *   2. Fly out LEFT and RIGHT (`--fly-x`, `--fly-y`, `--fly-z`) when active,
 *   3. Continuously float & bob (`lc-cutout-bob-left` / `lc-cutout-bob-right`),
 *   4. Stretch like an elastic bubble when hovered (`lc-cutout-surface`)!
 */
function ProjectImageFloatingCutouts({ projectId }: { projectId: string }) {
  switch (projectId) {
    case "lex-memoria":
      return (
        <>
          {/* Cutout 1 (Flys RIGHT): Owl Coach panel */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "155px",
                "--fly-y": "-88px",
                "--fly-z": "52px",
                transitionDelay: "0ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-right">
              <div className="lc-cutout-surface flex items-center gap-2.5 rounded-2xl border border-emerald-400/40 bg-[#122620]/95 px-3 py-2 text-left text-white shadow-[0_24px_45px_rgba(0,0,0,0.65),0_8px_18px_rgba(0,0,0,0.4)]">
                <div className="rounded-xl border border-white/15 bg-[#0d181c] px-2.5 py-1.5 text-[9.5px] font-medium leading-tight text-neutral-100">
                  Start reciting
                  <br />
                  and I&apos;ll help you
                  <br />
                  along!
                </div>
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4ade80] text-sm shadow-[0_0_12px_#4ade80]">
                    🦉
                  </span>
                  <span className="mt-1 rounded-full bg-[#22c55e] px-2 py-0.5 text-[8px] font-black uppercase text-black">
                    ON
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cutout 2 (Flys LEFT): Preamble Toolbar Buttons */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "-128px",
                "--fly-y": "-24px",
                "--fly-z": "58px",
                transitionDelay: "80ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-left">
              <div className="lc-cutout-surface flex items-center gap-1.5 rounded-full border border-white/20 bg-[#111921]/95 px-2.5 py-1.5 shadow-[0_22px_40px_rgba(0,0,0,0.68)]">
                <span className="lc-bubble-chip inline-flex items-center gap-1 rounded-full border border-[#0ea5e9] bg-[#0ea5e9]/15 px-2.5 py-0.5 text-[9px] font-bold text-[#38bdf8]">
                  <Volume2 className="h-2.5 w-2.5" /> Read
                </span>
                <span className="lc-bubble-chip rounded-full bg-[#65a30d] px-2.5 py-0.5 text-[9px] font-extrabold text-white shadow-sm">
                  Full
                </span>
                <span className="lc-bubble-chip rounded-full bg-[#1e293b] px-2 py-0.5 text-[9px] font-semibold text-neutral-300">
                  A__
                </span>
                <span className="lc-bubble-chip rounded-full bg-[#1e293b] px-2 py-0.5 text-[9px] font-semibold text-neutral-300">
                  Blind
                </span>
                <span className="lc-bubble-chip inline-flex items-center gap-0.5 rounded-full border border-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 text-[9px] font-bold text-[#fbbf24]">
                  <RotateCcw className="h-2.5 w-2.5" /> Reset
                </span>
              </div>
            </div>
          </div>

          {/* Cutout 3 (Flys RIGHT-BOTTOM): Recitation Word Chips */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "135px",
                "--fly-y": "82px",
                "--fly-z": "46px",
                transitionDelay: "150ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-right" style={{ animationDelay: "0.4s" }}>
              <div className="lc-cutout-surface flex flex-wrap items-center gap-1.5 rounded-xl border border-white/20 bg-[#0e151b]/95 px-3 py-2 font-mono text-[10px] font-bold text-white shadow-[0_22px_42px_rgba(0,0,0,0.72)]">
                <span className="rounded bg-[#1e2b36] px-2 py-0.5">sovereign</span>
                <span className="rounded bg-[#1e2b36] px-2 py-0.5">Filipino</span>
                <span className="rounded bg-[#1e2b36] px-2 py-0.5">people,</span>
              </div>
            </div>
          </div>
        </>
      );

    case "stylepeek-by-rence":
      return (
        <>
          {/* Cutout 1 (Flys RIGHT): "Start inspecting" gradient button */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "98px",
                "--fly-y": "-68px",
                "--fly-z": "58px",
                transitionDelay: "0ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-right">
              <div className="lc-cutout-surface flex w-[215px] items-center justify-center gap-2 rounded-xl border border-white/25 bg-gradient-to-r from-[#5b3e90] via-[#3f6184] to-[#2b7a78] px-4 py-2.5 text-xs font-bold text-white shadow-[0_26px_48px_rgba(0,0,0,0.72),0_0_24px_rgba(43,122,120,0.45)]">
                <span className="h-2 w-2 rounded-full bg-lime" />
                <span>Start inspecting</span>
              </div>
            </div>
          </div>

          {/* Cutout 2 (Flys LEFT-TOP): Style Peek Header Icon + Title */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "-108px",
                "--fly-y": "-126px",
                "--fly-z": "46px",
                transitionDelay: "85ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-left">
              <div className="lc-cutout-surface flex items-center gap-2.5 rounded-2xl border border-white/20 bg-[#101218]/95 px-3.5 py-2 text-left text-white shadow-[0_22px_40px_rgba(0,0,0,0.68)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#38bdf8] text-sm font-black text-white shadow-md">
                  ⌖
                </span>
                <div>
                  <p className="text-xs font-extrabold leading-none text-white">Style Peek</p>
                  <p className="mt-0.5 text-[9px] text-neutral-400">CSS · HTML · JS inspector</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cutout 3 (Flys LEFT-BOTTOM): Purple Callout Box */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "-86px",
                "--fly-y": "92px",
                "--fly-z": "50px",
                transitionDelay: "160ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-left" style={{ animationDelay: "0.35s" }}>
              <div className="lc-cutout-surface max-w-[230px] rounded-xl border border-[#5b3e90]/80 bg-[#151221]/95 p-2.5 text-left text-[9.5px] leading-snug text-neutral-200 shadow-[0_22px_44px_rgba(0,0,0,0.75)]">
                <span className="text-[#a78bfa]">✦</span> Animations get their own tab — durations,
                easing, and the full{" "}
                <code className="rounded bg-white/10 px-1 font-mono text-[8.5px]">@keyframes</code>{" "}
                block, ready to copy.
              </div>
            </div>
          </div>
        </>
      );

    case "naturalvoice-edgescreenreader":
      return (
        <>
          {/* Cutout 1 (Flys RIGHT): "Open Reader" bright purple button */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "116px",
                "--fly-y": "-32px",
                "--fly-z": "60px",
                transitionDelay: "0ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-right">
              <div className="lc-cutout-surface flex w-[210px] items-center justify-center gap-2 rounded-xl border border-white/30 bg-[#8b5cf6] px-4 py-3 text-xs font-bold text-white shadow-[0_26px_50px_rgba(0,0,0,0.72),0_0_28px_rgba(139,92,246,0.55)]">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Open Reader</span>
              </div>
            </div>
          </div>

          {/* Cutout 2 (Flys LEFT-BOTTOM): "Read Selected Text" dark button */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "-112px",
                "--fly-y": "68px",
                "--fly-z": "50px",
                transitionDelay: "85ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-left">
              <div className="lc-cutout-surface flex w-[210px] items-center justify-center gap-2 rounded-xl border border-white/25 bg-[#18181b]/95 px-4 py-2.5 text-xs font-bold text-white shadow-[0_24px_46px_rgba(0,0,0,0.75)]">
                <MousePointer className="h-3.5 w-3.5 text-neutral-300" />
                <span>Read Selected Text</span>
              </div>
            </div>
          </div>

          {/* Cutout 3 (Flys LEFT-TOP): VoiceReader Header */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "-106px",
                "--fly-y": "-110px",
                "--fly-z": "46px",
                transitionDelay: "160ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-left" style={{ animationDelay: "0.4s" }}>
              <div className="lc-cutout-surface flex items-center gap-2.5 rounded-2xl border border-white/20 bg-[#141624]/95 px-3.5 py-2 text-left text-white shadow-[0_20px_38px_rgba(0,0,0,0.68)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8b5cf6] text-white shadow-md">
                  <Volume2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-extrabold leading-none text-white">VoiceReader</p>
                  <p className="mt-0.5 text-[9px] text-neutral-400">Text-to-Speech Screen Reader</p>
                </div>
              </div>
            </div>
          </div>
        </>
      );

    case "ai-chatbot":
      return (
        <>
          {/* Cutout 1 (Flys LEFT): AI Concierge Header Card */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "-116px",
                "--fly-y": "-92px",
                "--fly-z": "52px",
                transitionDelay: "0ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-left">
              <div className="lc-cutout-surface w-[235px] rounded-2xl border border-white/20 bg-[#141414]/95 p-3 text-left shadow-[0_26px_50px_rgba(0,0,0,0.8)]">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[9px] font-bold text-lime">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_8px_#b8ff01]" />
                    LAWRENCE.AI · CONCIERGE
                  </span>
                  <span className="rounded-full bg-lime/15 px-1.5 py-0.5 font-mono text-[8px] text-lime">
                    ONLINE
                  </span>
                </div>
                <p className="mt-2 font-mono text-[9.5px] leading-relaxed text-neutral-300">
                  &gt; Ask about Lawrence&apos;s Next.js architecture, projects, or 2026 internship
                  availability.
                </p>
              </div>
            </div>
          </div>

          {/* Cutout 2 (Flys RIGHT): Prompt Input Bar */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "118px",
                "--fly-y": "24px",
                "--fly-z": "48px",
                transitionDelay: "85ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-right">
              <div className="lc-cutout-surface flex w-[215px] items-center justify-between rounded-full border border-white/25 bg-[#141414]/95 px-3.5 py-2 font-mono text-[10px] text-neutral-300 shadow-[0_22px_44px_rgba(0,0,0,0.78)]">
                <span>Ask Lawrence AI…</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime text-black font-bold">
                  ↵
                </span>
              </div>
            </div>
          </div>

          {/* Cutout 3 (Flys RIGHT-BOTTOM): Studio Pill */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "112px",
                "--fly-y": "116px",
                "--fly-z": "58px",
                transitionDelay: "160ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-right" style={{ animationDelay: "0.35s" }}>
              <div className="lc-cutout-surface flex items-center gap-2.5 rounded-full border border-lime/40 bg-[#141414] px-4 py-2 font-mono text-[10px] font-bold tracking-wider text-white shadow-[0_24px_48px_rgba(0,0,0,0.85)]">
                <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_8px_#b8ff01]" />
                <span>STUDIO AI READY</span>
              </div>
            </div>
          </div>
        </>
      );

    case "trash4cash":
    default:
      return (
        <>
          {/* Cutout 1 (Flys RIGHT-TOP): "Location check disabled" pill */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "104px",
                "--fly-y": "-66px",
                "--fly-z": "48px",
                transitionDelay: "0ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-right">
              <div className="lc-cutout-surface flex items-center gap-1.5 rounded-full border border-white/25 bg-[#263530]/95 px-3.5 py-1.5 text-[10px] font-semibold text-neutral-100 shadow-[0_20px_38px_rgba(0,0,0,0.68)]">
                <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                <span>📍 Location check disabled</span>
              </div>
            </div>
          </div>

          {/* Cutout 2 (Flys LEFT): "I'm a Student" green button */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "-108px",
                "--fly-y": "42px",
                "--fly-z": "58px",
                transitionDelay: "85ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-left">
              <div className="lc-cutout-surface flex w-[210px] items-center justify-center gap-2 rounded-xl border border-white/25 bg-[#259c52] py-3 px-5 text-xs font-extrabold text-white shadow-[0_26px_48px_rgba(0,0,0,0.72),0_0_24px_rgba(37,156,82,0.45)]">
                <span>🧮</span>
                <span>I&apos;m a Student</span>
              </div>
            </div>
          </div>

          {/* Cutout 3 (Flys RIGHT-BOTTOM): "I'm a Teacher" & "Register Device" */}
          <div
            className="lc-cutout-origin"
            style={
              {
                "--fly-x": "98px",
                "--fly-y": "124px",
                "--fly-z": "52px",
                transitionDelay: "160ms",
              } as React.CSSProperties
            }
          >
            <div className="lc-cutout-bob-right" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-2">
                <div className="lc-cutout-surface flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-[#232f2b]/95 py-2.5 px-3 text-[11px] font-bold text-white shadow-[0_22px_40px_rgba(0,0,0,0.72)] whitespace-nowrap">
                  <span>🔐</span>
                  <span>I&apos;m a Teacher</span>
                </div>
                <div className="lc-cutout-surface flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-[#232f2b]/95 py-2.5 px-3 text-[11px] font-bold text-white shadow-[0_22px_40px_rgba(0,0,0,0.72)] whitespace-nowrap">
                  <span>📋</span>
                  <span>Register Device</span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
  }
}

export default function WorkShowcase({
  activeIndex,
  onSelect,
  onToggleShortlist,
}: WorkShowcaseProps) {
  const activeSelector = SHOWCASE_SELECTOR_ITEMS[activeIndex] ?? SHOWCASE_SELECTOR_ITEMS[0];
  const activeSpec = markerSpecs[Math.min(activeIndex, markerSpecs.length - 1)] ?? markerSpecs[0];
  const [pressedPillIdx, setPressedPillIdx] = useState<number | null>(null);

  const handleArcSelect = (idx: number) => {
    setPressedPillIdx(idx);
    setTimeout(() => setPressedPillIdx(null), 220);
    onSelect(idx);
  };

  const cfg = MORPH_STATE_CONFIGS[activeIndex] ?? MORPH_STATE_CONFIGS[0];

  return (
    <>
      <section
        id="work"
        aria-label="Selected work and toolkit"
        className="js-showcase lc-gpu lc-noise pointer-events-none absolute inset-0 z-30 overflow-hidden bg-[#f5f5f5]"
        style={{ transform: "translateY(100%)" }}
      >
        {/* Inline SVG Directional Motion Blur Filter (from motion_study_02_ui_morphing_showcase.html) */}
        <svg className="sr-only pointer-events-none absolute h-0 w-0" aria-hidden="true">
          <defs>
            <filter id="svg-motion-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5 0.6" />
            </filter>
          </defs>
        </svg>

        <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-center px-6 sm:px-12">
          {/* ── A) Project selector column (Curved Arc Buttons + 6th Lawrence Cortes Portrait Card Item) ── */}
          <div className="js-work-ui lc-gpu absolute inset-x-6 bottom-12 top-20 z-30 flex flex-col justify-between sm:inset-x-12 sm:top-24 md:right-auto md:w-full md:max-w-md">
            <h2 className="font-ui text-3xl font-bold leading-[1.08] tracking-tight text-neutral-900 sm:text-[44px]">
              Selected work,
              <br />
              built for real{" "}
              <span
                className="font-script ml-1 inline-block -rotate-2 text-5xl font-bold transition-colors duration-300 sm:text-[64px]"
                style={{
                  color: activeIndex === 5 ? "#7cb800" : activeSelector.aura,
                }}
              >
                {activeSelector.scriptWord}
              </span>
            </h2>

            {/* Curved Arc Shape Selector Buttons + Elastic Bubble-Stretch Morphing */}
            <div className="relative flex flex-row flex-wrap gap-2 md:my-auto md:flex-col md:gap-3.5">
              <span className="mb-1 hidden text-[10px] font-bold uppercase tracking-widest text-neutral-400 md:block">
                Pick a build (click or scroll)
              </span>

              {/* Subtle Orbital Curve Guide SVG behind the 6 buttons on desktop */}
              <svg
                className="pointer-events-none absolute -left-2 top-6 hidden h-[285px] w-[96px] md:block"
                viewBox="0 0 96 285"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M 18 14 Q 90 142 18 270"
                  stroke="rgba(23,23,23,0.14)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>

              {SHOWCASE_SELECTOR_ITEMS.map((item, i) => {
                const on = i === activeIndex;
                const isPressed = pressedPillIdx === i;
                const arcX = ARC_OFFSETS_X[i] ?? 0;
                const arcRot = ARC_ROTATIONS[i] ?? 0;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleArcSelect(i)}
                    aria-pressed={on}
                    style={{
                      transform: `translate3d(${arcX}px, 0px, 0px) rotate(${arcRot}deg) scale(${
                        isPressed ? 0.94 : on ? 1.08 : 1
                      })`,
                    }}
                    className={`lc-elastic-pill group relative flex w-fit cursor-pointer items-center gap-3 rounded-full text-left ${
                      on
                        ? "px-4 py-2 shadow-[0_14px_30px_-6px_rgba(0,0,0,0.16),0_0_0_1px_rgba(0,0,0,0.08)]"
                        : "px-3 py-1.5 hover:bg-black/[0.04]"
                    }`}
                  >
                    {on && (
                      <motion.div
                        layoutId="active-swatch-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/95 backdrop-blur-md"
                        transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.8 }}
                      />
                    )}
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110 ${
                        on ? "scale-110" : ""
                      }`}
                      style={{
                        background: item.aura,
                        boxShadow: on
                          ? `0 0 0 2px #f5f5f5, 0 0 0 4px ${item.aura}, 0 6px 16px ${item.aura}66`
                          : undefined,
                      }}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          i === 5 ? "bg-black" : "bg-white"
                        } transition-opacity ${on ? "opacity-100" : "opacity-0"}`}
                      />
                    </span>
                    <span
                      className={`hidden text-xs md:inline ${
                        on ? "font-bold text-neutral-900" : "font-semibold text-neutral-500"
                      }`}
                    >
                      {item.shortName}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="h-4" />
          </div>

          {/* ── B) Toolkit anatomy UI ──────────────────────────────── */}
          <div
            id="toolkit"
            className="js-anatomy-ui lc-gpu pointer-events-none absolute inset-x-6 bottom-12 top-20 z-10 flex flex-col justify-between opacity-0 sm:inset-x-12 sm:top-24"
          >
            {/* Giant "Lawrence" wordmark placed BEHIND the dark cutout card */}
            <div
              className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none overflow-hidden"
              aria-hidden="true"
            >
              <span className="font-ui text-[21vw] font-extrabold leading-none tracking-[-0.055em] text-[#171717]/[0.08] sm:text-[180px] lg:text-[230px]">
                Lawrence
              </span>
            </div>

            <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-ui text-3xl font-bold leading-[1.08] tracking-tight text-neutral-900 sm:text-[42px]">
                  What makes
                  <br />
                  Lawrence stand out
                </h2>
                <p className="mt-1.5 text-xs text-neutral-500">
                  One builder&apos;s toolkit, uncapped.
                </p>
              </div>
              {/* Replaced useless "Open / close cap" button with useful "View Full Project Archive" pill */}
              <a
                href="/projects"
                className="lc-elastic-pill pointer-events-auto inline-flex items-center gap-2 self-start rounded-full bg-[#141414] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-lime hover:text-black sm:self-auto"
              >
                <span>View Full Project Archive</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="relative z-10 my-auto grid w-full grid-cols-2 items-center gap-6 lg:grid-cols-12">
              <div className="flex flex-col justify-between space-y-10 sm:space-y-20 lg:col-span-4">
                {toolkitCallouts.left.map((c) => (
                  <CalloutItem key={c.title.join()} c={c} side="left" />
                ))}
              </div>
              <div className="hidden lg:col-span-4 lg:block" />
              <div className="flex flex-col justify-between space-y-10 sm:space-y-20 lg:col-span-4">
                {toolkitCallouts.right.map((c) => (
                  <CalloutItem key={c.title.join()} c={c} side="right" />
                ))}
              </div>
            </div>
            <div className="h-4" />
          </div>
        </div>
      </section>

      {/* ── SHARED 3-STAGE MORPHING CONTAINER OVERLAY (z-[45] — ABOVE Pixel Dissolve & ContactFooter!) ──
          1. Stage 1 (Selected work): Sits on the right; item #6 is ALREADY the Lawrence Cortes Portrait Card!
          2. Stage 2 (Toolkit): Drops into the center with ZERO morphing needed because it's already that card!
          3. Stage 3 (01 About Lawrence Cortes): Stays above the Pixel-Eating dissolve and glides directly
             into the left column (lg:col-span-4) alongside the Engineering & Design Narrative card! */}
      <div
        className="js-morph-overlay pointer-events-none absolute inset-0 z-[45] flex items-center justify-center overflow-hidden"
        style={{ perspective: "1200px", transform: "translateY(100%)" }}
      >
        <div className="js-morph-stage lc-preserve-3d relative flex items-center justify-center">
          {/* Dual-layer Strengthened Background Ambient Glow */}
          <span
            className="js-morph-aura pointer-events-none absolute -inset-16 rounded-full opacity-95 blur-[75px] transition-all duration-500"
            style={{
              background: `radial-gradient(circle, ${cfg.aura} 0%, ${cfg.aura}88 40%, rgba(255,255,255,0) 74%)`,
            }}
          />
          <span
            className="js-morph-aura-core pointer-events-none absolute h-[300px] w-[300px] rounded-full opacity-85 blur-[36px] transition-all duration-500 sm:h-[360px] sm:w-[360px]"
            style={{
              background: `radial-gradient(circle, ${cfg.aura} 0%, rgba(255,255,255,0) 70%)`,
            }}
          />

          {/* 3D Floor Cast Shadow underneath the single morphing container */}
          <div
            className="js-morph-shadow pointer-events-none absolute -bottom-8 inset-x-4 h-12 rounded-full blur-xl opacity-80 transition-all duration-500"
            style={{
              background: `radial-gradient(ellipse at center, rgba(0,0,0,0.72) 0%, ${cfg.aura}44 55%, transparent 80%)`,
              transform: "translateZ(-25px) rotateX(65deg)",
            }}
          />

          {/* THE SINGLE MORPHING CONTAINER STAGE (#morph-container from motion_study_02)
              Zero overlapping cards! Cards swipe from right (BIG) to left (SHRINKS SMALL) */}
          <div
            id="morph-container"
            aria-label={
              activeIndex === 5
                ? "Lawrence Cortes Portrait Card"
                : `Inspect ${activeSpec.shortName}`
            }
            className="js-single-morph-card lc-morph-container lc-preserve-3d pointer-events-none group relative"
            style={{
              width: `${cfg.width}px`,
              height: `${cfg.height}px`,
              borderRadius: `${cfg.radius}px`,
              backgroundColor: "transparent",
              boxShadow: "none",
              overflow: "visible",
            }}
          >
            {/* States 0..4: The 5 Project State Layers (.lc-state-layer) */}
            {markerSpecs.map((m, i) => {
              const isAttendanceScanner = m.projectId === "trash4cash";
              const isNaturalVoice = m.projectId === "naturalvoice-edgescreenreader";

              return (
                <div
                  key={m.projectId}
                  data-state-index={i}
                  className={`js-project-layer lc-state-layer lc-preserve-3d absolute inset-0 flex flex-col rounded-[inherit] overflow-hidden ${
                    i === 0 ? "active" : ""
                  }`}
                  style={{
                    backgroundColor: MORPH_STATE_CONFIGS[i]?.bg ?? "#101815",
                    boxShadow: MORPH_STATE_CONFIGS[i]?.shadow,
                  }}
                >
                  {/* Inner clipped browser/app window */}
                  <div
                    className="relative flex h-full w-full flex-col overflow-hidden"
                    style={{ borderRadius: "inherit" }}
                  >
                    {/* Browser-style Top Bar */}
                    <div className="flex items-center justify-between border-b border-black/10 bg-white px-3.5 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
                      </div>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-500">
                        {m.shortName}
                      </span>
                    </div>

                    {/* Crisp Project Visual with Redundant Underlying Buttons Masked Out */}
                    <div className="relative flex-1 w-full overflow-hidden bg-[#101815]">
                      {isAttendanceScanner ? (
                        /* 100% Crisp High-DPI Reconstruction of Campus-Connect / Attendance Scanner */
                        <div className="relative flex h-full w-full flex-col items-center bg-gradient-to-b from-[#152820] via-[#101c17] to-[#0a120f] px-6 pt-5 text-center">
                          <div
                            className="pointer-events-none absolute top-4 h-36 w-52 rounded-full opacity-35 blur-2xl"
                            style={{
                              background:
                                "radial-gradient(circle, #22c55e 0%, rgba(16,24,21,0) 70%)",
                            }}
                          />
                          <span className="relative z-10 font-ui text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f59e0b]">
                            COLLEGE OF COMPUTER STUDIES
                          </span>
                          <h3 className="relative z-10 mt-2 font-ui text-[32px] font-black leading-[1.02] tracking-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.65)]">
                            Attendance
                            <br />
                            Scanner
                          </h3>
                          <p className="relative z-10 mt-14 max-w-[260px] text-[11.5px] font-medium leading-relaxed text-neutral-300">
                            Scan your QR code to log attendance instantly. Built for students and
                            teachers in Ormoc.
                          </p>
                        </div>
                      ) : isNaturalVoice ? (
                        /* 100% Crisp High-DPI Neural Voice Canvas (Zero duplicate text under floating popups!) */
                        <div className="relative flex h-full w-full flex-col items-center bg-gradient-to-b from-[#1c1f38] via-[#141624] to-[#0b0c15] px-6 pt-6 text-center">
                          <div
                            className="pointer-events-none absolute top-6 h-40 w-56 rounded-full opacity-45 blur-2xl"
                            style={{
                              background:
                                "radial-gradient(circle, #8b5cf6 0%, rgba(20,22,36,0) 72%)",
                            }}
                          />
                          <span className="relative z-10 font-ui text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#38bdf8]">
                            NEURAL SCREEN READER · TTS
                          </span>
                          <h3 className="relative z-10 mt-2 font-ui text-[30px] font-black leading-[1.02] tracking-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.65)]">
                            Natural
                            <br />
                            Voice
                          </h3>
                          <p className="relative z-10 mt-12 max-w-[260px] text-[11.5px] font-medium leading-relaxed text-neutral-300">
                            Edge browser extension converting web articles and codals into natural
                            neural speech.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={m.project.thumbnailSrc}
                            alt={m.project.title}
                            loading="eager"
                            decoding="sync"
                            className="h-full w-full object-cover object-top"
                          />
                          {/* Clean surface mask over baked-in screenshot buttons */}
                          <ProjectBaseImageMask projectId={m.projectId} />
                        </>
                      )}

                      {/* 3D Sculpted Bottom Badge Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent flex flex-col justify-end p-4">
                        <div
                          className="w-fit rounded-xl border border-white/15 bg-black/75 px-3 py-2 shadow-[0_18px_34px_-6px_rgba(0,0,0,0.9),0_6px_14px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.28)]"
                          style={{ transform: "translateZ(18px)" }}
                        >
                          <span className="block text-[9px] font-black uppercase tracking-widest text-lime drop-shadow-[0_2px_8px_rgba(184,255,1,0.55)]">
                            {m.project.badge}
                          </span>
                          <h4 className="mt-0.5 text-sm font-extrabold leading-tight text-white">
                            {m.shortName}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating 3D Cutout Elements: Start in Center -> Fly Left & Right -> Continuous Bobbing */}
                  <ProjectImageFloatingCutouts projectId={m.projectId} />
                </div>
              );
            })}

            {/* State 5: Exact Lawrence Cortes Portrait Card (Already item #6 in Selected work, drops without morphing into Toolkit, and glides into 01 About Lawrence Cortes!) */}
            <div
              data-state-index={5}
              className="js-lc-layer lc-state-layer absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-[#141414] p-4 text-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)]"
              style={{ borderRadius: "inherit" }}
            >
              <div className="js-cap relative flex-1 min-h-0 w-full overflow-hidden rounded-xl bg-neutral-900 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/lawrence-face.jpg"
                  alt="Lawrence Cortes"
                  loading="eager"
                  decoding="sync"
                  className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between">
                  <div>
                    <span className="inline-block rounded-full bg-lime px-2.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-black">
                      ORMOC CITY · PH
                    </span>
                    <h3 className="mt-1 text-base font-extrabold leading-tight text-white sm:text-lg">
                      Lawrence Cortes
                    </h3>
                  </div>
                  <span className="font-script text-xl font-bold text-lime sm:text-2xl">
                    LC &apos;26
                  </span>
                </div>
              </div>

              <div className="js-plug mt-3.5 grid shrink-0 grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-3 text-center transition-transform">
                <div>
                  <p className="font-ui text-sm font-black text-lime sm:text-base">8+</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                    Builds
                  </p>
                </div>
                <div>
                  <p className="font-ui text-sm font-black text-white sm:text-base">1356</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                    Commits
                  </p>
                </div>
                <div>
                  <p className="font-ui text-sm font-black text-lime sm:text-base">2026</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                    Intern
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
