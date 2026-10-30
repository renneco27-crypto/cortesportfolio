// components/showcase/ShowcaseRoot.tsx
"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useShowcaseChoreography } from "./engine/useShowcaseChoreography";
import { playSignatureIntro } from "./engine/useIntro";
import { TRACK_HEIGHT_VH } from "./engine/timeline";
import { markerSpecs } from "@/data/showcase";

import SignaturePreloader from "./scenes/SignaturePreloader";
import DarkMarquee from "./scenes/DarkMarquee";
import HeroShrink from "./scenes/HeroShrink";
import WorkShowcase from "./scenes/WorkShowcase";
import ContactFooter from "./scenes/ContactFooter";
import { ShowcaseNavbar, Toast, ShortlistDrawer } from "./ui/Chrome";

import "./showcase.css";

const PIXEL_COLS = 18;
const PIXEL_ROWS = 12;

export default function ShowcaseRoot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  const [shortlist, setShortlist] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Precompute deterministic pixel-eating thresholds (matching PixelTransition.tsx math)
  const pixelCells = useMemo(() => {
    const cells: {
      key: string;
      col: number;
      row: number;
      threshold: number;
      isLimeEdge: boolean;
    }[] = [];

    for (let row = 0; row < PIXEL_ROWS; row++) {
      for (let col = 0; col < PIXEL_COLS; col++) {
        const distFromCenter = Math.abs(PIXEL_COLS / 2 - col);
        const distFromBottom = PIXEL_ROWS - 1 - row;
        // Deterministic pseudo-random jitter from row/col
        const pseudoRand = (((row * 31 + col * 17) % 100) / 100) * 0.12 - 0.04;

        let threshold = (distFromBottom / PIXEL_ROWS) * 0.52;
        threshold += (distFromCenter / (PIXEL_COLS / 2)) * 0.28;
        threshold += pseudoRand;
        threshold = clamp(threshold, 0.02, 0.92);

        const isLimeEdge = (row + col) % 11 === 0;
        cells.push({
          key: `${row}-${col}`,
          col,
          row,
          threshold,
          isLimeEdge,
        });
      }
    }
    return cells;
  }, []);

  const showToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastText(msg);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 2400);
  }, []);

  const {
    activeCarouselIndex,
    autoplay,
    navTheme,
    jumpToProgress,
    selectCarouselColor,
    toggleManualCapOpen,
    toggleAutoplay,
  } = useShowcaseChoreography(containerRef, scrollTrackRef);

  // Sync nav theme to header attribute
  useEffect(() => {
    if (navbarRef.current) {
      navbarRef.current.setAttribute("data-theme", navTheme);
    }
  }, [navTheme]);

  // Run initial signature animation once on mount
  useEffect(() => {
    if (containerRef.current) {
      playSignatureIntro(containerRef.current);
    }
  }, []);

  // Replay handler
  const handleReplaySignature = useCallback(() => {
    if (containerRef.current) {
      jumpToProgress(0, true);
      playSignatureIntro(containerRef.current);
    }
  }, [jumpToProgress]);

  // Shortlist handling
  const toggleShortlist = useCallback(
    (projectId: string) => {
      const spec = markerSpecs.find((m) => m.projectId === projectId);
      const name = spec?.shortName ?? "Project";
      setShortlist((prev) => {
        if (prev.includes(projectId)) {
          showToast(`Removed ${name} from shortlist`);
          return prev.filter((id) => id !== projectId);
        } else {
          showToast(`Added ${name} to shortlist`);
          return [...prev, projectId];
        }
      });
    },
    [showToast]
  );

  const handleSendShortlist = useCallback(() => {
    const titles = markerSpecs
      .filter((m) => shortlist.includes(m.projectId))
      .map((m) => m.shortName)
      .join(", ");
    setContactMessage(
      `Hi Lawrence, I saw your showcase and I'm interested in discussing: ${titles}. Let's chat!`
    );
    setDrawerOpen(false);
    jumpToProgress(1); // Jump to contact footer
  }, [shortlist, jumpToProgress]);

  // Mascot pupil pointer tracking
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const pupils = containerRef.current.querySelectorAll<SVGElement>(".js-pupil");
      if (!pupils.length) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = clamp((e.clientX - cx) / (cx || 1), -1, 1) * 4.5;
      const dy = clamp((e.clientY - cy) / (cy || 1), -1, 1) * 3.5;
      pupils.forEach((el) => {
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen w-full bg-ink text-white font-sans">
      {/* 1150vh Virtual Scroll Track */}
      <div
        ref={scrollTrackRef}
        id="scroll-track"
        className="relative w-full pointer-events-none"
        style={{ height: `${TRACK_HEIGHT_VH}vh` }}
      />

      {/* Stage 0: Handwritten Signature Preloader */}
      <SignaturePreloader />

      {/* Top Navbar */}
      <ShowcaseNavbar
        ref={navbarRef}
        autoplay={autoplay}
        shortlistCount={shortlist.length}
        onJump={jumpToProgress}
        onReplay={handleReplaySignature}
        onToggleAutoplay={toggleAutoplay}
        onOpenShortlist={() => setDrawerOpen(true)}
      />

      {/* Fixed Main Viewport Stage (100vw x 100vh) */}
      <main id="viewport-stage" className="fixed inset-0 h-screen w-screen overflow-hidden bg-ink">
        {/* Layer 1: Dark Marquee Stage */}
        <DarkMarquee />

        {/* Layer 2: Shrinking Hero Container */}
        <HeroShrink
          onHire={() => jumpToProgress(0.99)}
          onSeeWork={() => jumpToProgress(0.38)}
        />

        {/* Layer 3: Light Showcase Panel (Carousel & Anatomy) */}
        <WorkShowcase
          activeIndex={activeCarouselIndex}
          shortlist={shortlist}
          onSelect={selectCarouselColor}
          onToggleShortlist={toggleShortlist}
          onCapToggle={toggleManualCapOpen}
        />

        {/* Layer 3.5: Pixel-Eating Dissolve Transition before "Developer by code. Designer by eye." */}
        <div
          className="js-pixel-overlay pointer-events-none absolute inset-0 z-[36] overflow-hidden opacity-0"
          aria-hidden="true"
        >
          {pixelCells.map((cell) => (
            <div
              key={cell.key}
              data-threshold={cell.threshold.toFixed(3)}
              data-lime={cell.isLimeEdge ? "1" : "0"}
              className="js-pixel-cell absolute box-border opacity-0"
              style={{
                width: `calc(${100 / PIXEL_COLS}% + 1.5px)`,
                height: `calc(${100 / PIXEL_ROWS}% + 1.5px)`,
                left: `${cell.col * (100 / PIXEL_COLS)}%`,
                top: `${cell.row * (100 / PIXEL_ROWS)}%`,
                backgroundColor: "#141414",
              }}
            />
          ))}
        </div>

        {/* Layer 4: 3D Standing-to-Lying Perspective Showcase & Contact Footer */}
        <ContactFooter
          message={contactMessage}
          onMessageChange={setContactMessage}
          onJump={jumpToProgress}
        />
      </main>

      {/* Shortlist Drawer */}
      <ShortlistDrawer
        open={drawerOpen}
        shortlist={shortlist}
        onClose={() => setDrawerOpen(false)}
        onRemove={(id) => toggleShortlist(id)}
        onSend={handleSendShortlist}
      />

      {/* Notification Toast */}
      <Toast text={toastText} visible={toastVisible} />
    </div>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
