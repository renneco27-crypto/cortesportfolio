// components/showcase/ui/Chrome.tsx
// Fixed UI chrome: theme-adaptive navbar, chapter HUD/scrubber, toast and shortlist drawer.
"use client";

import React, { forwardRef } from "react";
import { PenTool, Play, Pause, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { chapters, markerSpecs } from "@/data/showcase";

/* ── Navbar ─────────────────────────────────────────────────────── */
interface NavbarProps {
  autoplay: boolean;
  shortlistCount: number;
  onJump: (p: number) => void;
  onReplay: () => void;
  onToggleAutoplay: () => void;
  onOpenShortlist: () => void;
}

export const ShowcaseNavbar = forwardRef<HTMLElement, NavbarProps>(function ShowcaseNavbar(
  { autoplay, shortlistCount, onJump, onReplay, onToggleAutoplay, onOpenShortlist },
  ref
) {
  return (
    <header ref={ref} data-theme="light" className="lc-nav fixed inset-x-0 top-0 z-[80]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 text-xs font-medium sm:px-10">
        <div className="flex items-center gap-4 sm:gap-6">
          <button type="button" onClick={() => onJump(0)} className="flex items-center gap-2 text-base font-extrabold tracking-tighter" aria-label="Back to top">
            <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-current">
              <span className="h-1.5 w-1.5 bg-lime" />
            </span>
            <span>Lawrence</span>
          </button>
          <button
            type="button"
            onClick={onReplay}
            className="lc-nav-chip hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider transition-all hover:bg-lime hover:text-black sm:flex"
          >
            <PenTool className="h-3 w-3" />
            Replay signature
          </button>
        </div>

        <nav className="hidden items-center gap-7 text-[12px] font-medium lg:flex" aria-label="Chapters">
          {chapters.map((c) => (
            <button key={c.id} type="button" onClick={() => onJump(c.p)} className="opacity-70 transition-opacity hover:opacity-100">
              {c.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleAutoplay}
            className="flex items-center gap-1.5 rounded-full bg-lime px-3.5 py-1.5 text-[11px] font-bold text-black shadow-sm transition-all hover:brightness-105"
          >
            {autoplay ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            <span className="hidden sm:inline">{autoplay ? "Pause motion" : "Play full motion"}</span>
          </button>
          <button
            type="button"
            onClick={onOpenShortlist}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black px-3.5 py-1.5 text-[11px] font-semibold text-white transition-all hover:bg-neutral-800"
          >
            <span>SHORTLIST</span>
            <span className="rounded-full bg-lime px-1.5 text-[10px] font-black text-black">{shortlistCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
});

/* ── Chapter HUD ────────────────────────────────────────────────── */
interface HudProps {
  onScrub: (p: number) => void;
  onJump: (p: number) => void;
}

export const ChapterHUD = forwardRef<HTMLDivElement, HudProps>(function ChapterHUD({ onScrub, onJump }, ref) {
  return (
    <div
      ref={ref}
      className="fixed bottom-4 left-1/2 z-[85] flex max-w-[95vw] -translate-x-1/2 items-center gap-3 overflow-x-auto rounded-full border border-white/15 bg-black/85 px-4 py-2.5 text-white shadow-2xl backdrop-blur-md"
    >
      <span className="js-hud-label w-[74px] shrink-0 font-mono text-[11px] font-bold text-lime">01 Sign</span>
      <input
        className="js-hud-range w-28 shrink-0 cursor-pointer accent-[#b8ff01] sm:w-44"
        type="range"
        min={0}
        max={1000}
        defaultValue={0}
        aria-label="Scrub through the story"
        onInput={(e) => onScrub(Number((e.target as HTMLInputElement).value) / 1000)}
      />
      <div className="hidden shrink-0 items-center gap-1.5 text-[10px] font-semibold md:flex">
        {chapters.map((c) => (
          <button key={c.id} type="button" onClick={() => onJump(c.p)} className="rounded-full bg-white/10 px-2 py-1 transition-colors hover:bg-lime hover:text-black">
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
});

/* ── Toast ──────────────────────────────────────────────────────── */
export function Toast({ text, visible }: { text: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 450, damping: 30 }}
          className="pointer-events-none fixed right-6 top-20 z-[95] flex items-center gap-2.5 rounded-2xl border border-white/15 bg-black/90 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl"
        >
          <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_8px_#b8ff01]" />
          <span>{text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Shortlist drawer ───────────────────────────────────────────── */
interface DrawerProps {
  open: boolean;
  shortlist: string[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onSend: () => void;
}

export function ShortlistDrawer({ open, shortlist, onClose, onRemove, onSend }: DrawerProps) {
  const items = markerSpecs.filter((m) => shortlist.includes(m.projectId));
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[96] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            aria-label="Project shortlist"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-[97] flex h-full w-[min(380px,92vw)] flex-col border-l border-white/10 bg-[#121212]/95 p-6 text-white shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-lime shadow-[0_0_8px_#b8ff01]" />
                <h2 className="font-display text-xl font-extrabold tracking-tight">Your shortlist</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={onClose}
                aria-label="Close shortlist"
                className="cursor-pointer rounded-full p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Click any marker or card in the showcase to queue builds to discuss.</p>

            <ul className="mt-6 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
              {items.length === 0 && (
                <li className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-xs text-neutral-500">
                  No builds shortlisted yet. Click &ldquo;Shortlist&rdquo; on any project in the carousel!
                </li>
              )}
              <AnimatePresence mode="popLayout">
                {items.map((m) => (
                  <motion.li
                    key={m.projectId}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -10 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 shadow-sm transition-colors hover:border-white/20"
                  >
                    <span className="h-9 w-2 rounded-full shadow-sm" style={{ background: m.aura }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{m.shortName}</p>
                      <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{m.project.badge}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      type="button"
                      onClick={() => onRemove(m.projectId)}
                      aria-label={`Remove ${m.shortName}`}
                      className="cursor-pointer rounded-full p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </motion.button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <motion.button
              whileHover={{ scale: items.length === 0 ? 1 : 1.02 }}
              whileTap={{ scale: items.length === 0 ? 1 : 0.98 }}
              type="button"
              disabled={items.length === 0}
              onClick={onSend}
              className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-lime px-6 py-3.5 text-xs font-bold text-black shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" /> Message Lawrence about these ({items.length})
            </motion.button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
