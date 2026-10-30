// components/showcase/engine/timeline.ts
// Single source of truth for the scroll choreography.
// The master GSAP timeline has a total duration of 1, so every position below
// is literally "scroll progress p" (0 → 1) across the virtual scroll track.

export const TRACK_HEIGHT_VH = 1150;

/** [start, end] in scroll progress */
export const T = {
  heroWordsDrop: [0.005, 0.1],
  heroShrink: [0.01, 0.14],
  frameRing: [0.07, 0.14],
  marqueeIn: [0.04, 0.12],
  marqueeScrub: [0.02, 0.36],
  markerOut: [0.145, 0.18],
  buddyIn: [0.15, 0.185],
  buddyOut: [0.22, 0.245],
  ribbonIn: [0.225, 0.25],
  ribbonDraw: [0.225, 0.3],
  showcaseIn: [0.29, 0.37],
  carousel: [0.37, 0.62],
  handoff: [0.63, 0.7],
  capOpen: [0.71, 0.83],
  footerIn: [0.86, 1.0],
} as const;

export const dur = (range: readonly [number, number]) => range[1] - range[0];

/** Progress → active carousel index helper (5 markers, 0..4) */
export const carouselP = (index: number, count: number) =>
  T.carousel[0] + (index / Math.max(1, count - 1)) * dur(T.carousel);

/** Navbar is light-on-dark while the dark marquee / footer is dominant */
export const isDarkNav = (p: number) => (p > 0.09 && p < 0.34) || p > 0.9;

export const CHAPTER_LABELS: { from: number; label: string }[] = [
  { from: 0, label: "01 Sign" },
  { from: 0.06, label: "02 Frame" },
  { from: 0.15, label: "03 Buddy" },
  { from: 0.3, label: "04 Work" },
  { from: 0.63, label: "05 Toolkit" },
  { from: 0.88, label: "06 Contact" },
];

export const chapterFor = (p: number) =>
  [...CHAPTER_LABELS].reverse().find((c) => p >= c.from)?.label ?? CHAPTER_LABELS[0].label;
