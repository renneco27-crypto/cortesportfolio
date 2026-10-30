// components/showcase/engine/timeline.ts
// Single source of truth for the scroll choreography.
// The master scroll progress p runs 0 → 1 across the virtual scroll track.

export const TRACK_HEIGHT_VH = 820;

/** [start, end] in scroll progress */
export const T = {
  heroWordsDrop: [0.005, 0.09],
  heroShrink: [0.01, 0.13],
  frameRing: [0.06, 0.13],
  marqueeIn: [0.04, 0.11],
  marqueeScrub: [0.02, 0.33],
  markerOut: [0.135, 0.17],
  buddyIn: [0.14, 0.175],
  buddyOut: [0.205, 0.23],
  ribbonIn: [0.21, 0.235],
  ribbonDraw: [0.21, 0.285],
  showcaseIn: [0.275, 0.34],
  carousel: [0.34, 0.56],
  handoff: [0.57, 0.635],
  capOpen: [0.635, 0.695],
  pixelEat: [0.69, 0.755],
  footerIn: [0.72, 1.0],
} as const;

export const dur = (range: readonly [number, number]) => range[1] - range[0];

/** Progress → active carousel index helper (5 markers, 0..4) */
export const carouselP = (index: number, count: number) =>
  T.carousel[0] + (index / Math.max(1, count - 1)) * dur(T.carousel);

/** Navbar is light-on-dark while the dark marquee / footer is dominant */
export const isDarkNav = (p: number) => (p > 0.08 && p < 0.31) || p > 0.715;

export const CHAPTER_LABELS: { from: number; label: string }[] = [
  { from: 0, label: "01 Sign" },
  { from: 0.06, label: "02 Frame" },
  { from: 0.14, label: "03 Buddy" },
  { from: 0.28, label: "04 Work" },
  { from: 0.57, label: "05 Toolkit" },
  { from: 0.73, label: "06 Lawrence 3D" },
];

export const chapterFor = (p: number) =>
  [...CHAPTER_LABELS].reverse().find((c) => p >= c.from)?.label ?? CHAPTER_LABELS[0].label;
