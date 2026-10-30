// components/showcase/engine/useShowcaseChoreography.ts
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { markerSpecs, heroScriptWords, chapters } from "@/data/showcase";
import { chapterFor, isDarkNav } from "./timeline";

// Mathematical Utilities
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
const mapRange = (val: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
};
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export interface ChoreographyState {
  progress: number;
  activeCarouselIndex: number;
  autoplay: boolean;
  navTheme: "light" | "dark";
  currentChapter: string;
}

export function useShowcaseChoreography(
  containerRef: React.RefObject<HTMLDivElement | null>,
  scrollTrackRef: React.RefObject<HTMLDivElement | null>
) {
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [navTheme, setNavTheme] = useState<"light" | "dark">("light");
  const [currentChapter, setCurrentChapter] = useState<string>(chapters[0].label);

  const targetProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);
  const manualCarouselTargetRef = useRef<number | null>(null);
  const currentCarouselFloatRef = useRef(0);
  const manualCapOverrideRef = useRef<number | null>(null);
  const isAutoplayRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const heroScriptIdxRef = useRef(0);
  const lastScriptSwapRef = useRef(0);

  // Sync state refs
  isAutoplayRef.current = autoplay;

  const jumpToProgress = useCallback(
    (p: number, instant = false) => {
      if (!scrollTrackRef.current) return;
      targetProgressRef.current = clamp(p, 0, 1);
      const maxScroll = scrollTrackRef.current.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: targetProgressRef.current * maxScroll,
        behavior: instant ? "instant" : "smooth",
      });
    },
    [scrollTrackRef]
  );

  const selectCarouselColor = useCallback(
    (index: number) => {
      setAutoplay(false);
      const currentP = smoothProgressRef.current;
      if (currentP < 0.35 || currentP > 0.65) {
        const targetP = 0.38 + (index / Math.max(1, markerSpecs.length - 1)) * 0.22;
        jumpToProgress(targetP);
      }
      manualCarouselTargetRef.current = index;
    },
    [jumpToProgress]
  );

  const toggleManualCapOpen = useCallback(() => {
    if (manualCapOverrideRef.current === null) {
      const currentScrollCap = mapRange(smoothProgressRef.current, 0.71, 0.83, 0, 1);
      manualCapOverrideRef.current = currentScrollCap > 0.5 ? 0 : 1;
    } else {
      manualCapOverrideRef.current = manualCapOverrideRef.current > 0.5 ? 0 : 1;
    }
  }, []);

  const toggleAutoplay = useCallback(() => {
    setAutoplay((prev) => {
      const next = !prev;
      if (next && smoothProgressRef.current >= 0.98) {
        targetProgressRef.current = 0;
        smoothProgressRef.current = 0;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isAutoplayRef.current || !scrollTrackRef.current) return;
      const maxScroll = scrollTrackRef.current.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      targetProgressRef.current = clamp(window.scrollY / maxScroll, 0, 1);

      if (targetProgressRef.current < 0.35 || targetProgressRef.current > 0.65) {
        manualCarouselTargetRef.current = null;
      }
      if (targetProgressRef.current < 0.65) {
        manualCapOverrideRef.current = null;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollTrackRef]);

  // Main 60fps render loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Cache element references for zero-DOM-query 60fps loop
    const heroMorphBox = container.querySelector<HTMLElement>(".js-morph-box");
    const frameRing = container.querySelector<HTMLElement>(".js-frame-ring");
    const boxStudioVignette = container.querySelector<HTMLElement>(".js-vignette");
    const heroLeftWords = container.querySelector<HTMLElement>(".js-hero-left");
    const heroRightWords = container.querySelector<HTMLElement>(".js-hero-right");
    const heroBottomAvatars = container.querySelector<HTMLElement>(".js-hero-bottom");
    const heroScriptEl = container.querySelector<HTMLElement>(".js-hero-script");
    const heroChiselMarker = container.querySelector<HTMLElement>(".js-hero-marker");
    const buddyMascot = container.querySelector<HTMLElement>(".js-buddy");
    const ribbonStage = container.querySelector<HTMLElement>(".js-ribbon-stage");
    const ribbonPath = container.querySelector<SVGPathElement>(".js-ribbon");

    const buddyHeader = container.querySelector<HTMLElement>(".js-buddy-header");
    const marqueeContainer = container.querySelector<HTMLElement>(".js-marquee");
    const scrollRowTop = container.querySelector<HTMLElement>(".js-row-top");
    const scrollRowBottom = container.querySelector<HTMLElement>(".js-row-bottom");
    const buddyBio = container.querySelector<HTMLElement>(".js-buddy-bio");

    const showcaseSlidePanel = container.querySelector<HTMLElement>(".js-showcase");
    const workUI = container.querySelector<HTMLElement>(".js-work-ui");
    const anatomyUI = container.querySelector<HTMLElement>(".js-anatomy-ui");
    const footerSlidePanel = container.querySelector<HTMLElement>(".js-footer");

    const hudRange = container.querySelector<HTMLInputElement>(".js-hud-range");
    const hudLabel = container.querySelector<HTMLElement>(".js-hud-label");

    const projectMarkerEls = container.querySelectorAll<HTMLElement>(".js-pmarker");
    const lcMarkerEl = container.querySelector<HTMLElement>(".js-lc-marker");
    const lcOuterCapEl = lcMarkerEl?.querySelector<HTMLElement>(".js-cap");
    const lcBottomPlugEl = lcMarkerEl?.querySelector<HTMLElement>(".js-plug");
    const lcTechAxisEl = lcMarkerEl?.querySelector<SVGLineElement>(".js-axis");

    let lastTheme: "light" | "dark" = "light";
    let lastActiveIdx = 0;
    let lastChap = "";

    const ribbonLen = ribbonPath ? ribbonPath.getTotalLength() : 950;
    if (ribbonPath) {
      ribbonPath.style.strokeDasharray = ribbonLen.toString();
      ribbonPath.style.strokeDashoffset = ribbonLen.toString();
    }

    const render = (time: number) => {
      if (isAutoplayRef.current && scrollTrackRef.current) {
        targetProgressRef.current += 0.00115;
        if (targetProgressRef.current >= 1) {
          targetProgressRef.current = 1;
          setAutoplay(false);
        }
        const maxScroll = scrollTrackRef.current.offsetHeight - window.innerHeight;
        window.scrollTo({ top: targetProgressRef.current * maxScroll, behavior: "instant" });
      }

      // Smooth interpolation
      smoothProgressRef.current = lerp(smoothProgressRef.current, targetProgressRef.current, 0.11);
      const p = smoothProgressRef.current;

      // HUD Sync
      if (hudRange && document.activeElement !== hudRange) {
        hudRange.value = Math.round(p * 1000).toString();
      }
      const chap = chapterFor(p);
      if (chap !== lastChap) {
        lastChap = chap;
        setCurrentChapter(chap);
        if (hudLabel) hudLabel.textContent = chap;
      }

      // Navbar theme
      const currentDark = isDarkNav(p);
      const currentTheme = currentDark ? "dark" : "light";
      if (currentTheme !== lastTheme) {
        lastTheme = currentTheme;
        setNavTheme(currentTheme);
      }

      // Rotating Hero Script Word
      if (heroScriptEl && p < 0.15) {
        if (time - lastScriptSwapRef.current > 1800) {
          lastScriptSwapRef.current = time;
          heroScriptIdxRef.current = (heroScriptIdxRef.current + 1) % heroScriptWords.length;
          heroScriptEl.textContent = heroScriptWords[heroScriptIdxRef.current];
        }
      }

      /* ===============================================================
         PHASE 1 & 2: Hero Words Drop, Box Morph & Buddy Crossfade
      =============================================================== */
      const shrinkT = easeInOutCubic(mapRange(p, 0.01, 0.14, 0, 1));
      const wordsDropT = easeOutCubic(mapRange(p, 0.005, 0.1, 0, 1));

      // Words sliding downwards & disappearing
      const wordsY = lerp(0, 240, wordsDropT);
      const wordsOpacity = clamp(1 - wordsDropT * 1.35, 0, 1);
      if (heroLeftWords) {
        heroLeftWords.style.transform = `translate3d(0, ${wordsY}px, 0)`;
        heroLeftWords.style.opacity = wordsOpacity.toString();
      }
      if (heroRightWords) {
        heroRightWords.style.transform = `translate3d(0, ${wordsY * 1.15}px, 0)`;
        heroRightWords.style.opacity = wordsOpacity.toString();
      }
      if (heroBottomAvatars) {
        heroBottomAvatars.style.transform = `translate3d(0, ${wordsY * 0.8}px, 0)`;
        heroBottomAvatars.style.opacity = wordsOpacity.toString();
      }

      // Shrinking frame (100vw x 100vh -> 430px x 270px)
      const targetW = Math.min(window.innerWidth * 0.88, 430);
      const targetH = Math.min(window.innerHeight * 0.46, 270);
      const currentW = lerp(window.innerWidth, targetW, shrinkT);
      const currentH = lerp(window.innerHeight, targetH, shrinkT);
      const borderW = lerp(0, 5, shrinkT);
      const radius = lerp(0, 14, shrinkT);

      if (heroMorphBox) {
        heroMorphBox.style.width = `${currentW}px`;
        heroMorphBox.style.height = `${currentH}px`;
        heroMorphBox.style.borderRadius = `${radius}px`;
        heroMorphBox.style.border = `${borderW}px solid rgba(255,255,255,0.95)`;
      }
      if (frameRing) {
        frameRing.style.opacity = mapRange(p, 0.07, 0.14, 0, 1).toString();
      }
      if (boxStudioVignette) {
        boxStudioVignette.style.opacity = (shrinkT * 0.95).toString();
      }

      // Marquee Typography Scrub
      const marqueeVisibility = mapRange(p, 0.04, 0.12, 0, 1);
      if (marqueeContainer) marqueeContainer.style.opacity = marqueeVisibility.toString();
      if (buddyHeader) {
        buddyHeader.style.opacity = marqueeVisibility.toString();
        buddyHeader.style.transform = `translate3d(0, ${lerp(18, 0, marqueeVisibility)}px, 0)`;
      }
      if (buddyBio) {
        const bioVisibility = mapRange(p, 0.16, 0.28, 0, 1);
        buddyBio.style.opacity = bioVisibility.toString();
        buddyBio.style.transform = `translate3d(0, ${lerp(20, 0, bioVisibility)}px, 0)`;
      }

      const rowTopX = lerp(-620, 120, mapRange(p, 0.02, 0.36, 0, 1));
      const rowBottomX = lerp(80, -680, mapRange(p, 0.02, 0.36, 0, 1));
      if (scrollRowTop) scrollRowTop.style.transform = `translate3d(${rowTopX}px, 0, 0)`;
      if (scrollRowBottom) scrollRowBottom.style.transform = `translate3d(${rowBottomX}px, 0, 0)`;

      // Inside Shrinking Box: Marker -> Buddy Mascot -> Ribbon Loop
      const markerShrinkScale = lerp(1.0, 0.62, shrinkT);
      const markerShrinkY = lerp(0, 95, shrinkT);
      const markerFadeOut = mapRange(p, 0.145, 0.18, 1, 0);
      if (heroChiselMarker) {
        heroChiselMarker.style.transform = `translate3d(0, ${markerShrinkY}px, 0) scale(${markerShrinkScale})`;
        heroChiselMarker.style.opacity = markerFadeOut.toString();
      }

      // Mascot (0.15 -> 0.245)
      const mascotIn = mapRange(p, 0.15, 0.185, 0, 1);
      const mascotOut = mapRange(p, 0.22, 0.245, 1, 0);
      const mascotAlpha = Math.min(mascotIn, mascotOut);
      if (buddyMascot) {
        buddyMascot.style.opacity = mascotAlpha.toString();
        buddyMascot.style.transform = `scale(${lerp(0.82, 1.0, mascotAlpha)}) translate3d(0, ${lerp(20, 0, mascotAlpha)}px, 0)`;
      }

      // Ribbon (0.225 -> 0.30)
      const ribbonIn = mapRange(p, 0.225, 0.25, 0, 1);
      const ribbonDrawT = easeOutCubic(mapRange(p, 0.225, 0.3, 0, 1));
      if (ribbonStage) ribbonStage.style.opacity = ribbonIn.toString();
      if (ribbonPath) ribbonPath.style.strokeDashoffset = (ribbonLen * (1 - ribbonDrawT)).toString();

      /* ===============================================================
         PHASE 3: Light Showcase Panel Slides Up & Carousel
      =============================================================== */
      const slideUpShowcaseT = easeInOutCubic(mapRange(p, 0.29, 0.37, 0, 1));
      if (showcaseSlidePanel) {
        showcaseSlidePanel.style.transform = `translate3d(0, ${(1 - slideUpShowcaseT) * 100}%, 0)`;
      }

      const totalMarkers = markerSpecs.length;
      const scrollCarouselIndex = mapRange(p, 0.37, 0.62, 0, Math.max(0, totalMarkers - 1));
      const targetCarouselIdx =
        manualCarouselTargetRef.current !== null
          ? manualCarouselTargetRef.current
          : scrollCarouselIndex;
      currentCarouselFloatRef.current = lerp(currentCarouselFloatRef.current, targetCarouselIdx, 0.12);

      const activeRounded = Math.round(currentCarouselFloatRef.current);
      if (activeRounded !== lastActiveIdx) {
        lastActiveIdx = activeRounded;
        setActiveCarouselIndex(activeRounded);
      }

      /* ===============================================================
         PHASE 4: Toolkit Anatomy, LC Marker & Cap Opening
      =============================================================== */
      const anatomyTransitionT = easeInOutCubic(mapRange(p, 0.63, 0.7, 0, 1));

      if (workUI) {
        workUI.style.opacity = clamp(1 - anatomyTransitionT * 1.4, 0, 1).toString();
        workUI.style.transform = `translate3d(0, ${lerp(0, -60, anatomyTransitionT)}px, 0)`;
        workUI.style.pointerEvents = anatomyTransitionT > 0.5 ? "none" : "auto";
      }

      if (anatomyUI) {
        const anatomyAlpha = clamp((anatomyTransitionT - 0.25) * 1.4, 0, 1);
        anatomyUI.style.opacity = anatomyAlpha.toString();
        anatomyUI.style.transform = `translate3d(0, ${lerp(50, 0, anatomyTransitionT)}px, 0)`;
        anatomyUI.style.pointerEvents = anatomyTransitionT > 0.5 ? "auto" : "none";
      }

      // Cap Opening (0.71 -> 0.83)
      const scrollCapOpenT = easeInOutCubic(mapRange(p, 0.71, 0.83, 0, 1));
      const effectiveCapOpenT =
        manualCapOverrideRef.current !== null
          ? lerp(scrollCapOpenT, manualCapOverrideRef.current, 0.85)
          : scrollCapOpenT;

      // Animate the 5 project markers in the carousel
      projectMarkerEls.forEach((el, idx) => {
        const diff = idx - currentCarouselFloatRef.current;
        const xPos = 40 + diff * 210;
        const scale =
          diff < 0
            ? mapRange(diff, -1.3, 0, 0.46, 1.04)
            : mapRange(diff, 0, 1.3, 1.04, 0.52);
        const rot = 10;
        const opacity = clamp(1 - Math.abs(diff - -0.25) * 0.72, 0, 1) * (1 - anatomyTransitionT);

        el.style.transform = `translate3d(${xPos}px, 0, 0) scale(${scale}) rotate(${rot}deg)`;
        el.style.opacity = opacity.toString();
        el.style.pointerEvents = opacity > 0.3 ? "auto" : "none";
      });

      // Animate the central Lawrence Cortes Build Marker
      if (lcMarkerEl) {
        const lcScale = lerp(0.85, 1.08, anatomyTransitionT);
        lcMarkerEl.style.transform = `translate3d(0, 0, 0) scale(${lcScale}) rotate(0deg)`;
        lcMarkerEl.style.opacity = anatomyTransitionT.toString();

        if (lcOuterCapEl) {
          const capLiftY = lerp(0, -142, effectiveCapOpenT);
          lcOuterCapEl.style.transform = `translate3d(0, ${capLiftY}px, 0)`;
        }
        if (lcBottomPlugEl) {
          const plugDropY = lerp(0, 42, effectiveCapOpenT);
          lcBottomPlugEl.style.transform = `translate3d(0, ${plugDropY}px, 0)`;
        }
        if (lcTechAxisEl) {
          lcTechAxisEl.setAttribute("opacity", (effectiveCapOpenT * 0.35).toFixed(2));
        }
      }

      /* ===============================================================
         PHASE 5: Dark Contact Footer Slides Up
      =============================================================== */
      const footerT = easeInOutCubic(mapRange(p, 0.86, 0.98, 0, 1));
      if (footerSlidePanel) {
        footerSlidePanel.style.transform = `translate3d(0, ${(1 - footerT) * 100}%, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef, scrollTrackRef]);

  return {
    activeCarouselIndex,
    autoplay,
    navTheme,
    currentChapter,
    jumpToProgress,
    selectCarouselColor,
    toggleManualCapOpen,
    toggleAutoplay,
  };
}
