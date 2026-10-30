// data/showcase.ts
// Content + palette for the "Signature Studio" scroll showcase (homepage).
// Project copy is pulled from projectsData so there is a single source of truth.

import { projectsData } from "@/data/projects";
import type { Project } from "@/types";

export interface CutoutElementSpec {
  topRightLabel: string;
  topRightSub: string;
  bottomLeftTitle: string;
  bottomLeftMetric: string;
  floatingTag: string;
}

export interface MarkerSpec {
  projectId: string;
  /** Short label printed vertically on the barrel + used on swatches */
  shortName: string;
  /** Caveat script word that completes "Built for real ___" */
  scriptWord: string;
  aura: string;
  bodyStops: [string, string, string, string];
  capStops: [string, string, string];
  cutout: CutoutElementSpec;
  project: Project;
}

type RawSpec = Omit<MarkerSpec, "project">;

const RAW_SPECS: RawSpec[] = [
  {
    projectId: "lex-memoria",
    shortName: "Lex Memoria",
    scriptWord: "students",
    aura: "#ff2a54",
    bodyStops: ["#ff8fa3", "#ff1e42", "#b80d2a", "#660414"],
    capStops: ["#ff758f", "#d90429", "#590310"],
    cutout: {
      topRightLabel: "Art. 1156 · Civil Code",
      topRightSub: "Active Recall Drill",
      bottomLeftTitle: "98.4% Retention",
      bottomLeftMetric: "Sub-second Codal Lookup",
      floatingTag: "BAR EXAM READY",
    },
  },
  {
    projectId: "stylepeek-by-rence",
    shortName: "StylePeek",
    scriptWord: "designers",
    aura: "#ff6b00",
    bodyStops: ["#ffbe73", "#ff6b00", "#c74300", "#702400"],
    capStops: ["#ffbe73", "#ea5800", "#6e2200"],
    cutout: {
      topRightLabel: "AST Token Inspector",
      topRightSub: "1-Click Tailwind Export",
      bottomLeftTitle: "0ms Layout Shift",
      bottomLeftMetric: "Live Computed CSS3",
      floatingTag: "CHROME DEVTOOLS",
    },
  },
  {
    projectId: "naturalvoice-edgescreenreader",
    shortName: "NaturalVoice",
    scriptWord: "everyone",
    aura: "#00bbf9",
    bodyStops: ["#90e0ef", "#00bbf9", "#0077b6", "#022b47"],
    capStops: ["#72ddf7", "#0096c7", "#022b47"],
    cutout: {
      topRightLabel: "Edge Neural TTS",
      topRightSub: "24kHz Natural Prosody",
      bottomLeftTitle: "< 50ms Latency",
      bottomLeftMetric: "Zero Robotic Artifacting",
      floatingTag: "A11Y ENGINE",
    },
  },
  {
    projectId: "ai-chatbot",
    shortName: "AI Chatbot",
    scriptWord: "conversations",
    aura: "#9d4edd",
    bodyStops: ["#e0aaff", "#9d4edd", "#5a189a", "#310857"],
    capStops: ["#d896ff", "#7b2cbf", "#2d064f"],
    cutout: {
      topRightLabel: "Vercel AI SDK",
      topRightSub: "Multi-Turn Streaming",
      bottomLeftTitle: "64 tok/s Stream",
      bottomLeftMetric: "Neon Postgres Telemetry",
      floatingTag: "LLM AGENT",
    },
  },
  {
    projectId: "trash4cash",
    shortName: "Trash4Cash",
    scriptWord: "campuses",
    aura: "#22c55e",
    bodyStops: ["#bbf7d0", "#22c55e", "#15803d", "#0b3d1f"],
    capStops: ["#86efac", "#16a34a", "#0b3d1f"],
    cutout: {
      topRightLabel: "QR Verified · +250 pts",
      topRightSub: "Canteen Ledger Sync",
      bottomLeftTitle: "Sub-1s Scan",
      bottomLeftMetric: "IoT Bottle Deposit",
      floatingTag: "ECO REWARDS",
    },
  },
];

export const markerSpecs: MarkerSpec[] = RAW_SPECS.flatMap((spec) => {
  const project = projectsData.find((p) => p.id === spec.projectId);
  return project ? [{ ...spec, project }] : [];
});

/** Lawrence's own "Build Marker" used in the hero + toolkit anatomy scene */
export const lcMarkerSpec = {
  aura: "#a8f000",
  bodyStops: ["#ecff99", "#b8ff01", "#7cb800", "#446600"] as [string, string, string, string],
  capStops: ["#4f4f4f", "#292929", "#121212"] as [string, string, string],
};

export interface Callout {
  title: [string, string];
  detail: string;
}

export const toolkitCallouts: { left: Callout[]; right: Callout[] } = {
  left: [
    { title: ["Full-Stack", "Next.js"], detail: "App Router, TypeScript, Postgres" },
    { title: ["Brand", "Systems"], detail: "Identity, type & motion language" },
    { title: ["AI", "Integration"], detail: "LLM chat, vision & automation" },
  ],
  right: [
    { title: ["Security", "Mindset"], detail: "pwn.college, sanitised inputs" },
    { title: ["DSA", "Foundations"], detail: "Clean, measurable algorithms" },
    { title: ["Growth", "Funnels"], detail: "TikTok funnels & analytics" },
  ],
};

export const heroScriptWords = ["designs", "builds", "ships", "secures", "automates"];

export const techAvatars = [
  { label: "Next.js", short: "N", bg: "#111111", fg: "#b8ff01" },
  { label: "React", short: "R", bg: "#00bbf9", fg: "#111111" },
  { label: "TypeScript", short: "TS", bg: "#3178c6", fg: "#ffffff" },
  { label: "Tailwind", short: "TW", bg: "#9d4edd", fg: "#ffffff" },
];

/** Scroll progress positions for chapter jumps (must match engine/timeline.ts) */
export const chapters = [
  { id: "home", label: "Home", p: 0 },
  { id: "work", label: "Work", p: 0.35 },
  { id: "toolkit", label: "Toolkit", p: 0.64 },
  { id: "about", label: "About", p: 0.78 },
  { id: "github", label: "GitHub", p: 0.85 },
  { id: "contact", label: "Contact", p: 0.985 },
] as const;
