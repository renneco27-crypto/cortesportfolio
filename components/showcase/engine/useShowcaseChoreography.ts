// components/showcase/engine/useShowcaseChoreography.ts
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { heroScriptWords, chapters } from "@/data/showcase";
import { chapterFor, isDarkNav } from "./timeline";
import { MORPH_STATE_CONFIGS, SHOWCASE_SELECTOR_ITEMS } from "../scenes/WorkShowcase";

// Mathematical Utilities
const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;
const mapRange = (val: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
};
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Transition corridors where a gentle scroll nudge smoothly autoplays ("ice-glides")
// to the next major panel stop without stopping midway on intermediate frames!
const ICE_GLIDE_CORRIDORS: {
  min: number;
  max: number;
  downTarget: number;
  upTarget: number;
  speed: number;
}[] = [
  // 1. Hero -> Selected Work Panel (smooth continuous glide directly into the work panel!)
  { min: 0.02, max: 0.338, downTarget: 0.345, upTarget: 0.0, speed: 0.22 },
  // 2. Selected Work (6th card: Lawrence Cortes ID) -> Toolkit ("What makes Lawrence stand out")
  { min: 0.552, max: 0.638, downTarget: 0.645, upTarget: 0.54, speed: 0.16 },
  // 3. Toolkit -> 3D Floor ("01 — About Lawrence Cortes: Developer by code. Designer by eye.")
  { min: 0.662, max: 0.782, downTarget: 0.788, upTarget: 0.645, speed: 0.16 },
];

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
  const lastFrameTimeRef = useRef<number>(0);
  const lastUserScrollTimeRef = useRef<number>(0);
  const scrollDirectionRef = useRef<1 | -1>(1);
  const isProgrammaticScrollRef = useRef<boolean>(false);

  // Sync state refs
  isAutoplayRef.current = autoplay;

  const jumpToProgress = useCallback(
    (p: number, instant = false) => {
      if (!scrollTrackRef.current) return;
      const clampedP = clamp(p, 0, 1);
      targetProgressRef.current = clampedP;
      if (instant) {
        smoothProgressRef.current = clampedP;
      }
      isProgrammaticScrollRef.current = true;
      const maxScroll = scrollTrackRef.current.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: clampedP * maxScroll,
        behavior: instant ? "instant" : "smooth",
      });
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 120);
    },
    [scrollTrackRef]
  );

  const selectCarouselColor = useCallback(
    (index: number) => {
      setAutoplay(false);
      const currentP = smoothProgressRef.current;
      const totalItems = SHOWCASE_SELECTOR_ITEMS.length;
      if (currentP < 0.32 || currentP > 0.58) {
        const targetP = 0.34 + (index / Math.max(1, totalItems - 1)) * 0.21;
        jumpToProgress(targetP);
      }
      manualCarouselTargetRef.current = index;
    },
    [jumpToProgress]
  );

  const toggleManualCapOpen = useCallback(() => {
    if (manualCapOverrideRef.current === null) {
      const currentScrollCap = mapRange(smoothProgressRef.current, 0.635, 0.695, 0, 1);
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
      if (isAutoplayRef.current || isProgrammaticScrollRef.current || !scrollTrackRef.current)
        return;
      const maxScroll = scrollTrackRef.current.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const nextTarget = clamp(window.scrollY / maxScroll, 0, 1);
      const delta = nextTarget - targetProgressRef.current;

      if (Math.abs(delta) > 0.0004) {
        scrollDirectionRef.current = delta >= 0 ? 1 : -1;
        lastUserScrollTimeRef.current = performance.now();
      }

      // If window.scrollY jumped instantaneously by > 8%, snap smoothProgressRef close to target
      if (Math.abs(delta) > 0.08) {
        smoothProgressRef.current = nextTarget;
      }
      targetProgressRef.current = nextTarget;

      if (targetProgressRef.current < 0.32 || targetProgressRef.current > 0.56) {
        manualCarouselTargetRef.current = null;
      }
      if (targetProgressRef.current < 0.56) {
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
    const heroLeftBtns = container.querySelector<HTMLElement>(".js-hero-left-btns");
    const heroRightWords = container.querySelector<HTMLElement>(".js-hero-right");
    const heroSurnameEl = container.querySelector<HTMLElement>(".js-hero-surname");
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
    const morphOverlayPanel = container.querySelector<HTMLElement>(".js-morph-overlay");
    const workUI = container.querySelector<HTMLElement>(".js-work-ui");
    const anatomyUI = container.querySelector<HTMLElement>(".js-anatomy-ui");

    // Single #morph-container & state layers (motion_study_02_ui_morphing_showcase.html)
    const morphStageEl = container.querySelector<HTMLElement>(".js-morph-stage");
    const morphAuraEl = container.querySelector<HTMLElement>(".js-morph-aura");
    const morphAuraCoreEl = container.querySelector<HTMLElement>(".js-morph-aura-core");
    const morphShadowEl = container.querySelector<HTMLElement>(".js-morph-shadow");
    const singleMorphCardEl = container.querySelector<HTMLElement>(".js-single-morph-card");
    const projectLayerEls = container.querySelectorAll<HTMLElement>(".js-project-layer");
    const lcLayerEl = container.querySelector<HTMLElement>(".js-lc-layer");
    const lcOuterCapEl = lcLayerEl?.querySelector<HTMLElement>(".js-cap");
    const lcBottomPlugEl = lcLayerEl?.querySelector<HTMLElement>(".js-plug");
    const lcTechAxisEl = lcLayerEl?.querySelector<SVGLineElement>(".js-axis");

    // Pixel-Eating overlay
    const pixelOverlay = container.querySelector<HTMLElement>(".js-pixel-overlay");
    const pixelCells = container.querySelectorAll<HTMLElement>(".js-pixel-cell");

    // 3D Standing-to-Lying Panel ("Developer by code. Designer by eye." + GitHub + Certs + Contact)
    const footerSlidePanel = container.querySelector<HTMLElement>(".js-footer");
    const rig3DEl = container.querySelector<HTMLElement>(".js-3d-rig");
    const slab3DEl = container.querySelector<HTMLElement>(".js-3d-slab");
    const aboutPortraitCardEl = container.querySelector<HTMLElement>(".js-about-portrait-card");
    const dofTopEl = container.querySelector<HTMLElement>(".js-dof-top");
    const dofBottomEl = container.querySelector<HTMLElement>(".js-dof-bottom");
    const hud3DEl = container.querySelector<HTMLElement>(".js-3d-hud");
    const tiltReadoutEl = container.querySelector<HTMLElement>(".js-tilt-readout");

    const hudRange = container.querySelector<HTMLInputElement>(".js-hud-range");
    const hudLabel = container.querySelector<HTMLElement>(".js-hud-label");

    let lastTheme: "light" | "dark" = "light";
    let lastActiveIdx = 0;
    let lastMorphStateIdx = -1;
    let lastChap = "";
    let blurTimeout: ReturnType<typeof setTimeout> | null = null;

    const ribbonLen = ribbonPath ? ribbonPath.getTotalLength() : 950;
    if (ribbonPath) {
      ribbonPath.style.strokeDasharray = ribbonLen.toString();
      ribbonPath.style.strokeDashoffset = ribbonLen.toString();
    }

    const render = (time: number) => {
      const dt = lastFrameTimeRef.current
        ? Math.min(0.1, (time - lastFrameTimeRef.current) / 1000)
        : 0.016;
      lastFrameTimeRef.current = time;

      if (isAutoplayRef.current && scrollTrackRef.current) {
        targetProgressRef.current += 0.0014;
        if (targetProgressRef.current >= 1) {
          targetProgressRef.current = 1;
          setAutoplay(false);
        }
        isProgrammaticScrollRef.current = true;
        const maxScroll = scrollTrackRef.current.offsetHeight - window.innerHeight;
        window.scrollTo({ top: targetProgressRef.current * maxScroll, behavior: "instant" });
        isProgrammaticScrollRef.current = false;
      } else if (
        scrollTrackRef.current &&
        manualCarouselTargetRef.current === null &&
        time - lastUserScrollTimeRef.current > 65
      ) {
        // Magnetic "Ice-Glide" Auto-Completion:
        // When the user gives a small scroll into a transition corridor, it smoothly autoplays
        // into the next panel stop at a natural cinematic speed without waiting for more scroll input!
        const curTarget = targetProgressRef.current;
        for (const corridor of ICE_GLIDE_CORRIDORS) {
          if (curTarget > corridor.min && curTarget < corridor.max) {
            const dest =
              scrollDirectionRef.current >= 0 ? corridor.downTarget : corridor.upTarget;
            const step = corridor.speed * dt;
            if (Math.abs(dest - curTarget) <= step) {
              targetProgressRef.current = dest;
            } else {
              targetProgressRef.current = curTarget + Math.sign(dest - curTarget) * step;
            }
            const maxScroll = scrollTrackRef.current.offsetHeight - window.innerHeight;
            if (maxScroll > 0) {
              isProgrammaticScrollRef.current = true;
              window.scrollTo({
                top: targetProgressRef.current * maxScroll,
                behavior: "instant",
              });
              isProgrammaticScrollRef.current = false;
            }
            break;
          }
        }
      }

      // Frame-rate independent exponential smoothing
      const smoothAlpha = 1 - Math.exp(-15 * dt);
      smoothProgressRef.current = lerp(
        smoothProgressRef.current,
        targetProgressRef.current,
        smoothAlpha
      );
      if (Math.abs(targetProgressRef.current - smoothProgressRef.current) < 0.0005) {
        smoothProgressRef.current = targetProgressRef.current;
      }
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

      // Rotating Hero Script Word on "Cortes" (.js-hero-script & .js-hero-surname)
      if (heroScriptEl && p < 0.14) {
        if (time - lastScriptSwapRef.current > 1750) {
          lastScriptSwapRef.current = time;
          heroScriptIdxRef.current = (heroScriptIdxRef.current + 1) % heroScriptWords.length;

          heroScriptEl.style.filter = "blur(5px)";
          heroScriptEl.style.transform = "rotate(-3deg) scale(0.92)";
          if (heroSurnameEl) {
            heroSurnameEl.style.transform = "scale(0.985)";
          }

          setTimeout(() => {
            if (heroScriptEl) {
              heroScriptEl.textContent = heroScriptWords[heroScriptIdxRef.current];
              heroScriptEl.style.filter = "blur(0px)";
              heroScriptEl.style.transform = "rotate(-3deg) scale(1)";
            }
            if (heroSurnameEl) {
              heroSurnameEl.style.transform = "scale(1)";
            }
          }, 140);
        }
      }

      /* ===============================================================
         PHASE 1 & 2: Hero Words Drop, Box Morph & Buddy Crossfade
      =============================================================== */
      const shrinkT = easeInOutCubic(mapRange(p, 0.01, 0.13, 0, 1));
      const wordsDropT = easeOutCubic(mapRange(p, 0.005, 0.09, 0, 1));

      // Words sliding downwards & disappearing
      const wordsY = lerp(0, 240, wordsDropT);
      const wordsOpacity = clamp(1 - wordsDropT * 1.35, 0, 1);
      if (heroLeftWords) {
        heroLeftWords.style.transform = `translate3d(0, ${wordsY}px, 0)`;
        heroLeftWords.style.opacity = wordsOpacity.toString();
      }
      if (heroLeftBtns) {
        heroLeftBtns.style.transform = `translate3d(0, ${wordsY}px, 0)`;
        heroLeftBtns.style.opacity = wordsOpacity.toString();
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
        frameRing.style.opacity = mapRange(p, 0.06, 0.13, 0, 1).toString();
      }
      if (boxStudioVignette) {
        boxStudioVignette.style.opacity = (shrinkT * 0.95).toString();
      }

      // Marquee Typography Scrub
      const marqueeVisibility = mapRange(p, 0.04, 0.11, 0, 1);
      if (marqueeContainer) marqueeContainer.style.opacity = marqueeVisibility.toString();
      if (buddyHeader) {
        buddyHeader.style.opacity = marqueeVisibility.toString();
        buddyHeader.style.transform = `translate3d(0, ${lerp(18, 0, marqueeVisibility)}px, 0)`;
      }
      if (buddyBio) {
        const bioVisibility = mapRange(p, 0.15, 0.26, 0, 1);
        buddyBio.style.opacity = bioVisibility.toString();
        buddyBio.style.transform = `translate3d(0, ${lerp(20, 0, bioVisibility)}px, 0)`;
      }

      const rowTopX = lerp(-620, 120, mapRange(p, 0.02, 0.33, 0, 1));
      const rowBottomX = lerp(80, -680, mapRange(p, 0.02, 0.33, 0, 1));
      if (scrollRowTop) scrollRowTop.style.transform = `translate3d(${rowTopX}px, 0, 0)`;
      if (scrollRowBottom) scrollRowBottom.style.transform = `translate3d(${rowBottomX}px, 0, 0)`;

      // Inside Shrinking Box: Cutout -> Buddy Mascot -> Ribbon Loop
      const markerShrinkScale = lerp(1.0, 0.62, shrinkT);
      const markerShrinkY = lerp(0, 95, shrinkT);
      const markerFadeOut = mapRange(p, 0.135, 0.17, 1, 0);
      if (heroChiselMarker) {
        heroChiselMarker.style.transform = `translate3d(0, ${markerShrinkY}px, 0) scale(${markerShrinkScale})`;
        heroChiselMarker.style.opacity = markerFadeOut.toString();
      }

      // Mascot (0.14 -> 0.23)
      const mascotIn = mapRange(p, 0.14, 0.175, 0, 1);
      const mascotOut = mapRange(p, 0.205, 0.23, 1, 0);
      const mascotAlpha = Math.min(mascotIn, mascotOut);
      if (buddyMascot) {
        buddyMascot.style.opacity = mascotAlpha.toString();
        buddyMascot.style.transform = `scale(${lerp(0.82, 1.0, mascotAlpha)}) translate3d(0, ${lerp(
          20,
          0,
          mascotAlpha
        )}px, 0)`;
      }

      // Ribbon (0.21 -> 0.285)
      const ribbonIn = mapRange(p, 0.21, 0.235, 0, 1);
      const ribbonDrawT = easeOutCubic(mapRange(p, 0.21, 0.285, 0, 1));
      if (ribbonStage) ribbonStage.style.opacity = ribbonIn.toString();
      if (ribbonPath)
        ribbonPath.style.strokeDashoffset = (ribbonLen * (1 - ribbonDrawT)).toString();

      /* ===============================================================
         PHASE 3 & 4: Light Showcase Panel & 3-Stage Reused #morph-container
         (motion_study_02_ui_morphing_showcase.html mechanic)
         - Stage 1 (Selected work, p: 0.34 -> 0.55):
             States 0..4 are the 5 projects; State 5 (item #6) is ALREADY the
             Lawrence Cortes Portrait Card!
         - Stage 2 (Toolkit / Standout, p: 0.555 -> 0.68):
             Zero morphing needed because it is ALREADY State 5 — drops into center!
         - Stage 3 (01 About Lawrence Cortes, p: 0.68 -> 0.79):
             Stays above the Pixel-Eating dissolve (z-[45]) and glides directly into
             the left column (lg:col-span-4) of "01 — About Lawrence Cortes"!
      =============================================================== */
      const slideUpShowcaseT = easeInOutCubic(mapRange(p, 0.275, 0.34, 0, 1));
      if (showcaseSlidePanel) {
        showcaseSlidePanel.style.transform = `translate3d(0, ${(1 - slideUpShowcaseT) * 100}%, 0)`;
        showcaseSlidePanel.style.pointerEvents = p >= 0.28 && p < 0.72 ? "auto" : "none";
      }

      const totalSelectorItems = SHOWCASE_SELECTOR_ITEMS.length; // 6 items (0..5)
      const scrollCarouselIndex = mapRange(
        p,
        0.34,
        0.55,
        0,
        Math.max(0, totalSelectorItems - 1)
      );
      const targetCarouselIdx =
        manualCarouselTargetRef.current !== null
          ? manualCarouselTargetRef.current
          : scrollCarouselIndex;
      currentCarouselFloatRef.current = lerp(
        currentCarouselFloatRef.current,
        targetCarouselIdx,
        smoothAlpha
      );

      const activeRounded = clamp(
        Math.round(currentCarouselFloatRef.current),
        0,
        totalSelectorItems - 1
      );
      if (activeRounded !== lastActiveIdx) {
        lastActiveIdx = activeRounded;
        setActiveCarouselIndex(activeRounded);
      }

      // Toolkit Handoff (0.555 -> 0.635):
      // Reuses the EXACT SAME #morph-container (`singleMorphCardEl`)!
      // And because item #6 (index 5) in Selected work is already State 5,
      // scrolling from Selected work into Toolkit requires ZERO morphing!
      const anatomyTransitionT = easeInOutCubic(mapRange(p, 0.555, 0.635, 0, 1));
      const isToolkitOrAboutState = anatomyTransitionT > 0.25 || activeRounded === 5;
      const effectiveMorphStateIdx = isToolkitOrAboutState ? 5 : activeRounded;

      if (workUI) {
        workUI.style.opacity = clamp(1 - anatomyTransitionT * 1.45, 0, 1).toString();
        workUI.style.transform = `translate3d(0, ${lerp(0, -56, anatomyTransitionT)}px, 0)`;
        workUI.style.pointerEvents = anatomyTransitionT > 0.45 ? "none" : "auto";
      }

      if (anatomyUI) {
        const anatomyAlpha = clamp((anatomyTransitionT - 0.25) * 1.4, 0, 1);
        anatomyUI.style.opacity = anatomyAlpha.toString();
        anatomyUI.style.transform = `translate3d(0, ${lerp(48, 0, anatomyTransitionT)}px, 0)`;
        anatomyUI.style.pointerEvents =
          anatomyTransitionT > 0.45 && p < 0.7 ? "auto" : "none";
      }

      // Trigger motion_study_02 container geometry morph on active state change
      if (effectiveMorphStateIdx !== lastMorphStateIdx && singleMorphCardEl) {
        const prevStateIdx = lastMorphStateIdx;
        lastMorphStateIdx = effectiveMorphStateIdx;

        const cfg = MORPH_STATE_CONFIGS[effectiveMorphStateIdx] ?? MORPH_STATE_CONFIGS[0];
        singleMorphCardEl.style.width = `${cfg.width}px`;
        singleMorphCardEl.style.height = `${cfg.height}px`;
        singleMorphCardEl.style.borderRadius = `${cfg.radius}px`;
        singleMorphCardEl.style.backgroundColor = "transparent";
        singleMorphCardEl.style.boxShadow = "none";

        // Update ambient aura & floor shadow to match the active state
        if (morphAuraEl) {
          morphAuraEl.style.background = `radial-gradient(circle, ${cfg.aura} 0%, ${cfg.aura}88 40%, rgba(255,255,255,0) 74%)`;
        }
        if (morphAuraCoreEl) {
          morphAuraCoreEl.style.background = `radial-gradient(circle, ${cfg.aura} 0%, rgba(255,255,255,0) 70%)`;
        }
        if (morphShadowEl) {
          morphShadowEl.style.background = `radial-gradient(ellipse at center, rgba(0,0,0,0.72) 0%, ${cfg.aura}44 55%, transparent 80%)`;
        }

        // Brief directional SVG motion blur pulse during morph (180ms)
        if (prevStateIdx !== -1) {
          singleMorphCardEl.classList.add("motion-blur", "pressed");
          if (blurTimeout) clearTimeout(blurTimeout);
          blurTimeout = setTimeout(() => {
            singleMorphCardEl.classList.remove("motion-blur", "pressed");
          }, 180);
        }
      }

      // ===============================================================
      // HORIZONTAL PHYSICAL SWIPE: RIGHT (BIG) -> LEFT (SHRINKS SMALL)
      // When scrolling forward, cards swipe from right to left:
      //   - Coming from right: BIG (scale ~1.15)
      //   - Active center: scale 1.0
      //   - Exiting to left: SHRINKS SMALL (scale ~0.70)
      // ===============================================================
      const allLayers = [
        ...Array.from(projectLayerEls),
        lcLayerEl,
      ].filter(Boolean) as HTMLElement[];

      if (p >= 0.28 && p < 0.565) {
        const curFloat = currentCarouselFloatRef.current;
        allLayers.forEach((layerEl, i) => {
          const offset = i - curFloat;
          const absOffset = Math.abs(offset);

          // ONLY ONE CARD VISIBLE AT A TIME: any inactive adjacent card is completely GONE!
          if (absOffset >= 0.5) {
            layerEl.style.opacity = "0";
            layerEl.style.pointerEvents = "none";
            layerEl.style.display = "none";
            layerEl.classList.remove("active");
            return;
          }

          layerEl.style.display = "flex";
          if (absOffset < 0.25) {
            layerEl.classList.add("active");
          } else {
            layerEl.classList.remove("active");
          }

          const xPercent = offset * 100;
          // Uniform stable card scale: eliminates zoom in/out camera shaking!
          const scale = 1.0;
          const opacity = clamp(1 - absOffset * 2.0, 0, 1);
          const zIndex = Math.round(30 - offset * 8);

          layerEl.style.transform = `translate3d(${xPercent.toFixed(1)}%, 0px, 0px) scale3d(${scale.toFixed(3)}, ${scale.toFixed(3)}, 1)`;
          layerEl.style.opacity = opacity.toFixed(3);
          layerEl.style.zIndex = zIndex.toString();
          layerEl.style.pointerEvents = absOffset < 0.35 ? "auto" : "none";
        });
      } else if (p >= 0.565) {
        // Toolkit & About: Hide layers 0..4, keep State 5 (Lawrence Cortes Portrait Card) active in center
        projectLayerEls.forEach((layerEl) => {
          layerEl.style.opacity = "0";
          layerEl.style.pointerEvents = "none";
          layerEl.style.display = "none";
          layerEl.classList.remove("active");
        });
        if (lcLayerEl) {
          lcLayerEl.style.display = "flex";
          lcLayerEl.style.opacity = "1";
          lcLayerEl.style.transform = "translate3d(0px, 0px, 0px) scale3d(1, 1, 1)";
          lcLayerEl.style.zIndex = "30";
          lcLayerEl.style.pointerEvents = "auto";
          lcLayerEl.classList.add("active");
        }
      }

      // ===============================================================
      // 3-STAGE POSITION & DIMENSIONAL SHRINK MORPH:
      // Stage 1 (Selected work, p <= 0.555): sits on the right (x = +115px)
      // Stage 2 (Toolkit, p: 0.555 -> 0.67): glides to center & grows large (scale = 1.26)
      // Stage 3 (Toolkit -> About Lawrence Cortes, p: 0.67 -> 0.77):
      //   "shouldnt fade to size but shrink to size both left and right
      //    shrinks then the top and bottom of the div to give it its animation"
      //   - NO opacity crossfade! Remains 100% solid.
      //   - Left & right shrinks first (scaleX: 1.26 -> 0.84)!
      //   - Top & bottom shrinks second (scaleY: 1.26 -> 0.84)!
      //   - Docks into .js-about-portrait-card at p = 0.768 with zero double exposure!
      // ===============================================================
      const isDesktop = window.innerWidth >= 1024;
      const workX = window.innerWidth >= 768 ? 115 : 0;
      const workY = window.innerWidth >= 768 ? 0 : 28;

      // Stage 1 -> Stage 2 (Toolkit center)
      const stage2X = lerp(workX, 0, anatomyTransitionT);
      const gravityDipY = Math.sin(anatomyTransitionT * Math.PI) * 54;
      const stage2Y = lerp(workY, 12, anatomyTransitionT) + gravityDipY;
      const stage2RotZ = Math.sin(anatomyTransitionT * Math.PI) * -3.5;

      const toolkitScaleTarget = isDesktop ? 1.26 : 1.14;
      const targetDockScale = isDesktop ? 0.84 : 0.90;

      // Stage 2 -> Stage 3 (About Lawrence Cortes left-column slot)
      const glideProgress = clamp((p - 0.67) / (0.768 - 0.67), 0, 1);
      const easeGlide = easeInOutCubic(glideProgress);

      // Robotic 4-Step Sequential Panel Shrink:
      // "like a robot one animation at a time the left shrinks the right shrinks the top shrinks and the bottom shrinks like panels"
      // 1. Left shrinks (0.00 -> 0.25)
      const stepLeftT = easeInOutCubic(clamp(glideProgress / 0.25, 0, 1));
      // 2. Right shrinks (0.25 -> 0.50)
      const stepRightT = easeInOutCubic(clamp((glideProgress - 0.25) / 0.25, 0, 1));
      // 3. Top shrinks (0.50 -> 0.75)
      const stepTopT = easeInOutCubic(clamp((glideProgress - 0.50) / 0.25, 0, 1));
      // 4. Bottom shrinks (0.75 -> 1.00)
      const stepBottomT = easeInOutCubic(clamp((glideProgress - 0.75) / 0.25, 0, 1));

      const initialScale = lerp(1.0, toolkitScaleTarget, anatomyTransitionT);
      const halfDeltaX = (initialScale - targetDockScale) * 0.5;
      const currentScaleX = initialScale - (stepLeftT * halfDeltaX + stepRightT * halfDeltaX);

      const halfDeltaY = (initialScale - targetDockScale) * 0.5;
      const currentScaleY = initialScale - (stepTopT * halfDeltaY + stepBottomT * halfDeltaY);

      // Subtle mechanical robotic shutter panel inset
      if (singleMorphCardEl) {
        if (glideProgress > 0 && glideProgress < 1) {
          const maxInsetX = isDesktop ? 14 : 8;
          const maxInsetY = isDesktop ? 16 : 10;
          const insetL = stepLeftT * maxInsetX;
          const insetR = stepRightT * maxInsetX;
          const insetT = stepTopT * maxInsetY;
          const insetB = stepBottomT * maxInsetY;
          singleMorphCardEl.style.clipPath = `inset(${insetT.toFixed(1)}px ${insetR.toFixed(1)}px ${insetB.toFixed(1)}px ${insetL.toFixed(1)}px round 16px)`;
        } else {
          singleMorphCardEl.style.clipPath = "none";
        }
      }

      // Target left-column slot coordinates
      const aboutSlotX = isDesktop ? -276 : 0;
      const aboutSlotY = isDesktop ? 58 : 48;
      const finalX = lerp(stage2X, aboutSlotX, easeGlide);
      const finalY = lerp(stage2Y, aboutSlotY, easeGlide);
      const finalRotZ = lerp(stage2RotZ, 0, easeGlide);
      const finalRotX = lerp(0, isDesktop ? 10 : 6, easeGlide);

      // Dock handoff: floating overlay stays 100% visible until docked at p = 0.768,
      // and docked card (.js-about-portrait-card) stays hidden (0) until p = 0.768!
      // NO double cards, NO fading to size!
      const isDocked = p >= 0.768;

      if (morphOverlayPanel) {
        const isOverlayActive = p >= 0.275 && !isDocked;
        morphOverlayPanel.style.transform =
          p < 0.34
            ? `translate3d(0, ${(1 - slideUpShowcaseT) * 100}%, 0)`
            : "translate3d(0, 0%, 0)";
        morphOverlayPanel.style.opacity = isOverlayActive ? "1" : "0";
      }

      if (aboutPortraitCardEl) {
        aboutPortraitCardEl.style.opacity = isDocked ? "1" : "0";
      }

      if (morphStageEl) {
        morphStageEl.style.transform = `translate3d(${finalX.toFixed(1)}px, ${finalY.toFixed(
          1
        )}px, 0) scale3d(${currentScaleX.toFixed(3)}, ${currentScaleY.toFixed(
          3
        )}, 1) rotateX(${finalRotX.toFixed(1)}deg) rotateZ(${finalRotZ.toFixed(2)}deg)`;
      }

      // Fade out ambient glow around floating card as it reaches docked section
      if (morphAuraEl && morphAuraCoreEl) {
        const auraAlpha = clamp(1 - glideProgress * 1.3, 0, 0.95);
        morphAuraEl.style.opacity = auraAlpha.toFixed(2);
        morphAuraCoreEl.style.opacity = (auraAlpha * 0.9).toFixed(2);
      }

      // Subtle internal parallax on the Lawrence Cortes card (0.635 -> 0.695)
      const scrollCapOpenT = easeInOutCubic(mapRange(p, 0.635, 0.695, 0, 1));
      const effectiveCapOpenT =
        manualCapOverrideRef.current !== null
          ? lerp(scrollCapOpenT, manualCapOverrideRef.current, 0.85)
          : scrollCapOpenT;

      if (lcOuterCapEl) {
        const capLiftY = lerp(0, -4, effectiveCapOpenT * (1 - easeGlide));
        lcOuterCapEl.style.transform = `translate3d(0, ${capLiftY.toFixed(1)}px, 0)`;
      }
      if (lcBottomPlugEl) {
        const plugDropY = lerp(0, 4, effectiveCapOpenT * (1 - easeGlide));
        lcBottomPlugEl.style.transform = `translate3d(0, ${plugDropY.toFixed(1)}px, 0)`;
      }
      if (lcTechAxisEl) {
        lcTechAxisEl.setAttribute("opacity", (effectiveCapOpenT * 0.35).toFixed(2));
      }

      /* ===============================================================
         PHASE 4.5: Pixel-Eating Dissolve Transition (0.69 -> 0.755)
         Covers 100% of the screen at p = 0.722, allowing .js-footer to
         snap cleanly to translateY(0%) with ZERO top cutoff while the
         reused Lawrence Cortes card glides ABOVE the pixels at z-[45]!
      =============================================================== */
      if (pixelOverlay) {
        const pixelEatIn = mapRange(p, 0.69, 0.722, 0, 1);
        const pixelClearOut = mapRange(p, 0.726, 0.758, 1, 0);
        const isPixelActive = p > 0.688 && p < 0.76;

        pixelOverlay.style.opacity = isPixelActive ? "1" : "0";
        pixelOverlay.style.display = isPixelActive ? "grid" : "none";

        if (isPixelActive) {
          const effectiveProgress = p <= 0.724 ? pixelEatIn : pixelClearOut;
          pixelCells.forEach((cell) => {
            const thresh = parseFloat(cell.getAttribute("data-threshold") || "0.5");
            const isLime = cell.getAttribute("data-lime") === "1";
            const on = effectiveProgress >= thresh;
            const edgeBand = Math.abs(effectiveProgress - thresh) < 0.07;

            cell.style.opacity = on ? "1" : "0";
            if (on) {
              cell.style.backgroundColor = edgeBand && isLime ? "#b8ff01" : "#141414";
            }
          });
        }
      }

      /* ===============================================================
         PHASE 5: Seamless 3D Standing-to-Lying Panel + Original Footer
         (p: 0.722 -> 1.00)
         - Left-and-Right Growing Wing-Expansion Animation (`data-grow-wings="1"`)
           as sections stand up so HR reviewers can read them effortlessly!
      =============================================================== */
      if (footerSlidePanel) {
        const isFooterVisible = p >= 0.72;
        footerSlidePanel.style.transform = isFooterVisible
          ? "translate3d(0, 0%, 0)"
          : "translate3d(0, 100%, 0)";
        footerSlidePanel.style.pointerEvents = isFooterVisible ? "auto" : "none";

        if (isFooterVisible && rig3DEl && slab3DEl) {
          const is3DOn = footerSlidePanel.getAttribute("data-3d-enabled") !== "0";
          const maxTilt = parseFloat(footerSlidePanel.getAttribute("data-max-tilt") || "18");

          // Hold slab at top (scrollY = 0) until p = 0.790 so "01 — ABOUT LAWRENCE CORTES: Developer by code. Designer by eye."
          // is 100% visible when the pixels clear and the 3D floor tilts up!
          const slabScrollProgress = clamp((p - 0.79) / (0.985 - 0.79), 0, 1);
          const maxSlabScroll = Math.max(0, slab3DEl.scrollHeight - window.innerHeight);
          const currentSlabY = slabScrollProgress * maxSlabScroll;

          // Seamless 0° -> 56° -> 0° tilt curve with HR-friendly camera scale
          const tiltInT = easeInOutCubic(mapRange(p, 0.725, 0.775, 0, 1));
          const tiltOutT = easeInOutCubic(mapRange(p, 0.895, 0.955, 0, 1));
          const tiltEnvelope = tiltInT * (1 - tiltOutT);
          const effectiveTilt = is3DOn ? maxTilt * tiltEnvelope : 0;
          const viewportFitFactor = clamp(
            Math.min(window.innerWidth / 1280, window.innerHeight / 780),
            0.78,
            1
          );
          const targetTiltedScale = 0.94 * viewportFitFactor;
          const rigScale = is3DOn ? lerp(1.0, targetTiltedScale, tiltEnvelope) : 1.0;
          const rigY = is3DOn ? lerp(0, 18, tiltEnvelope) : 0;
          const rigZ = is3DOn ? lerp(0, -110, tiltEnvelope) : 0;
          const floorTiltRatio = maxTilt > 0 ? clamp(effectiveTilt / maxTilt, 0, 1.2) : 0;

          if (tiltReadoutEl) {
            tiltReadoutEl.textContent = `${Math.round(effectiveTilt)}°`;
          }
          if (hud3DEl) {
            const hudAlpha = clamp(1 - tiltOutT * 1.4, 0, 1);
            hud3DEl.style.opacity = hudAlpha.toFixed(2);
            hud3DEl.style.pointerEvents = hudAlpha > 0.2 ? "auto" : "none";
          }

          rig3DEl.style.transform = `translate3d(0px, ${rigY.toFixed(1)}px, ${rigZ.toFixed(
            1
          )}px) scale(${rigScale.toFixed(3)}) rotateX(${effectiveTilt.toFixed(2)}deg)`;
          slab3DEl.style.transform = `translate3d(0px, ${(-currentSlabY).toFixed(1)}px, 0px)`;

          if (dofTopEl && dofBottomEl) {
            const dofAlpha = is3DOn ? clamp(floorTiltRatio * 0.65, 0, 0.72) : 0;
            dofTopEl.style.opacity = dofAlpha.toFixed(2);
            dofBottomEl.style.opacity = dofAlpha.toFixed(2);
          }

          // Update standing 3D cards inside the warm #f4f2ed slab
          const cards = slab3DEl.querySelectorAll<HTMLElement>(".lc-card-3d");
          const viewportCenter = currentSlabY + window.innerHeight * 0.52;
          const focalRadius = window.innerHeight * 0.92;

          cards.forEach((card) => {
            let shadowEl = card.previousElementSibling as HTMLElement | null;
            if (!shadowEl || !shadowEl.classList.contains("lc-floor-cast-shadow")) {
              shadowEl = document.createElement("div");
              shadowEl.className = "lc-floor-cast-shadow";
              card.parentElement?.insertBefore(shadowEl, card);
            }

            if (!is3DOn || floorTiltRatio <= 0.01) {
              card.style.transform = "translate3d(0px, 0px, 0px) rotateX(0deg) scale3d(1, 1, 1)";
              if (shadowEl) shadowEl.style.opacity = "0";
              return;
            }

            let top = 0;
            let curr: HTMLElement | null = card;
            while (curr && curr !== slab3DEl) {
              top += curr.offsetTop;
              curr = curr.offsetParent as HTMLElement | null;
            }
            const cardCenter = top + card.offsetHeight * 0.5;
            const dist = Math.abs(cardCenter - viewportCenter);
            const proximity = clamp(1 - dist / focalRadius, 0, 1);
            const focusCurve = Math.sin(proximity * Math.PI * 0.5);
            const popFactor = 0.52 + 0.48 * focusCurve;

            const targetZ = parseFloat(card.getAttribute("data-z") || "44");
            const targetStandDeg = parseFloat(card.getAttribute("data-stand") || "-48");
            const tiltZ = parseFloat(card.getAttribute("data-tilt") || "0");
            const growWings = card.getAttribute("data-grow-wings") === "1";

            const cardRotateX = targetStandDeg * popFactor * floorTiltRatio;
            const zVal = targetZ * popFactor * floorTiltRatio;

            // Left-and-Right Growing Animation (scaleX wing-expansion) when standing up for HR readability!
            const wingOvershoot = Math.sin(focusCurve * Math.PI) * 0.04;
            const scaleX = growWings
              ? lerp(1, 0.82 + 0.21 * focusCurve + wingOvershoot, floorTiltRatio)
              : 1 + 0.025 * focusCurve * floorTiltRatio;
            const scaleY = growWings
              ? lerp(1, 0.90 + 0.13 * focusCurve, floorTiltRatio)
              : 1 + 0.025 * focusCurve * floorTiltRatio;

            card.style.transform = `translate3d(0px, 0px, ${zVal.toFixed(
              1
            )}px) rotateX(${cardRotateX.toFixed(1)}deg) rotateZ(${tiltZ}deg) scale3d(${scaleX.toFixed(
              3
            )}, ${scaleY.toFixed(3)}, 1)`;

            if (shadowEl) {
              const shadowIntensity = clamp(Math.abs(cardRotateX) / 52, 0, 1);
              shadowEl.style.left = `${card.offsetLeft}px`;
              shadowEl.style.top = `${card.offsetTop}px`;
              shadowEl.style.width = `${card.offsetWidth}px`;
              shadowEl.style.height = `${card.offsetHeight}px`;
              shadowEl.style.opacity = (0.72 * shadowIntensity).toFixed(2);
              shadowEl.style.transform = `translate3d(0px, ${(16 * shadowIntensity).toFixed(
                1
              )}px, 1px) scale3d(${(scaleX * 0.98).toFixed(3)}, ${(
                0.95 +
                0.08 * shadowIntensity
              ).toFixed(3)}, 1)`;
            }
          });
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (blurTimeout) clearTimeout(blurTimeout);
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
