// components/showcase/scenes/WorkShowcase.tsx
// Layer 3 – light panel that slides over the dark stage.
//   A) Project carousel: 5 project markers (previous shrinks left, active grows centre)
//   B) Toolkit anatomy: Lawrence's lime Build Marker uncaps, 6 skill callouts expand
import React from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Check, ArrowUpFromLine } from "lucide-react";
import { ProjectMarker } from "../svg/Markers";
import Github from "../svg/GithubMark";
import { markerSpecs, lcMarkerSpec, toolkitCallouts, type Callout } from "@/data/showcase";

interface WorkShowcaseProps {
  activeIndex: number;
  shortlist: string[];
  onSelect: (index: number) => void;
  onToggleShortlist: (projectId: string) => void;
  onCapToggle: () => void;
}

function CalloutItem({ c, side }: { c: Callout; side: "left" | "right" }) {
  const line = (
    <div className={`js-callout-line relative h-px w-14 bg-neutral-300 sm:w-28 ${side === "left" ? "origin-right" : "origin-left"}`}>
      <span className={`absolute -top-1 h-2 w-2 rounded-full bg-neutral-400 ${side === "left" ? "right-0" : "left-0"}`} />
    </div>
  );
  return (
    <div className={`js-callout flex items-center gap-4 ${side === "left" ? "justify-start lg:justify-end" : "justify-start"}`}>
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

export default function WorkShowcase({ activeIndex, shortlist, onSelect, onToggleShortlist, onCapToggle }: WorkShowcaseProps) {
  const active = markerSpecs[activeIndex] ?? markerSpecs[0];
  const isShortlisted = shortlist.includes(active.projectId);

  return (
    <section
      id="work"
      aria-label="Selected work and toolkit"
      className="js-showcase lc-gpu lc-noise absolute inset-0 z-30 overflow-hidden bg-[#f5f5f5]"
      style={{ transform: "translateY(100%)" }}
    >
      <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-center px-6 sm:px-12">
        {/* ── A) Project selector column ─────────────────────────── */}
        <div className="js-work-ui lc-gpu absolute inset-x-6 bottom-8 top-20 z-30 flex flex-col justify-between sm:inset-x-12 sm:top-24 md:right-auto md:w-full md:max-w-md">
          <h2 className="font-ui text-3xl font-bold leading-[1.08] tracking-tight text-neutral-900 sm:text-[44px]">
            Selected work,
            <br />
            built for real{" "}
            <span className="font-script ml-1 inline-block -rotate-2 text-5xl font-bold transition-colors duration-300 sm:text-[64px]" style={{ color: active.aura }}>
              {active.scriptWord}
            </span>
          </h2>

          <div className="flex flex-row flex-wrap gap-2 md:my-auto md:flex-col md:gap-3">
            <span className="mb-1 hidden text-[10px] font-bold uppercase tracking-widest text-neutral-400 md:block">Pick a build (click or scroll)</span>
            {markerSpecs.map((m, i) => {
              const on = i === activeIndex;
              return (
                <button
                  key={m.projectId}
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-pressed={on}
                  className="group flex w-fit items-center gap-3 rounded-full px-2 py-1.5 text-left transition-all"
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110 ${on ? "scale-110" : ""}`}
                    style={{ background: m.aura, boxShadow: on ? `0 0 0 2px #f5f5f5, 0 0 0 4px ${m.aura}` : undefined }}
                  >
                    <span className={`h-2 w-2 rounded-full bg-white transition-opacity ${on ? "opacity-100" : "opacity-0"}`} />
                  </span>
                  <span className={`hidden text-xs md:inline ${on ? "font-bold text-neutral-900" : "font-semibold text-neutral-500"}`}>{m.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* Active project card */}
          <div className="hidden max-w-sm rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm backdrop-blur md:block">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: active.aura }}>
              {active.project.badge}
            </span>
            <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-neutral-600">{active.project.shortDescription ?? active.project.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleShortlist(active.projectId)}
                className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-lime hover:text-black"
              >
                {isShortlisted ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {isShortlisted ? "Shortlisted" : "Shortlist"}
              </button>
              <Link
                href={`/projects#${active.project.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-3 py-1.5 text-[11px] font-semibold text-neutral-800 transition-colors hover:border-black"
              >
                Case study <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              {active.project.githubUrl && (
                <a
                  href={active.project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${active.shortName} on GitHub`}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-800 transition-colors hover:border-black"
                >
                  <Github className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── B) Toolkit anatomy UI ──────────────────────────────── */}
        <div id="toolkit" className="js-anatomy-ui lc-gpu pointer-events-none absolute inset-x-6 bottom-12 top-20 z-30 flex flex-col justify-between opacity-0 sm:inset-x-12 sm:top-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-ui text-3xl font-bold leading-[1.08] tracking-tight text-neutral-900 sm:text-[42px]">
                What makes
                <br />
                Lawrence stand out
              </h2>
              <p className="mt-1.5 text-xs text-neutral-400">One builder&apos;s toolkit, uncapped.</p>
            </div>
            <button
              type="button"
              onClick={onCapToggle}
              className="js-anatomy-btn pointer-events-auto flex items-center gap-2 self-start rounded-full bg-black px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-lime hover:text-black sm:self-auto"
            >
              <ArrowUpFromLine className="h-3.5 w-3.5" />
              Open / close cap
            </button>
          </div>

          <div className="my-auto grid w-full grid-cols-2 items-center gap-6 lg:grid-cols-12">
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

        {/* ── Marker stage (positions driven by the master timeline) ── */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          {markerSpecs.map((m, i) => (
            <button
              key={m.projectId}
              type="button"
              onClick={() => (i === activeIndex ? onToggleShortlist(m.projectId) : onSelect(i))}
              aria-label={i === activeIndex ? `Shortlist ${m.shortName}` : `Show ${m.shortName}`}
              className="js-pmarker lc-gpu pointer-events-auto absolute flex h-[380px] w-[190px] cursor-pointer items-center justify-center sm:h-[580px] sm:w-[310px]"
            >
              <span
                className="pointer-events-none absolute h-[300px] w-[300px] rounded-full opacity-75 blur-[75px] sm:h-[460px] sm:w-[460px]"
                style={{ background: `radial-gradient(circle, ${m.aura} 0%, rgba(255,255,255,0) 70%)` }}
              />
              <ProjectMarker uid={`p${i}`} bodyStops={m.bodyStops} capStops={m.capStops} label={m.shortName} sublabel={`LC · Build 0${i + 1}`} />
            </button>
          ))}

          <div className="js-lc-marker lc-gpu absolute flex h-[380px] w-[190px] items-center justify-center opacity-0 sm:h-[580px] sm:w-[310px]">
            <span
              className="pointer-events-none absolute h-[300px] w-[300px] rounded-full opacity-60 blur-[75px] sm:h-[460px] sm:w-[460px]"
              style={{ background: `radial-gradient(circle, ${lcMarkerSpec.aura} 0%, rgba(255,255,255,0) 70%)` }}
            />
            <ProjectMarker uid="lc" bodyStops={lcMarkerSpec.bodyStops} capStops={lcMarkerSpec.capStops} label="Lawrence Cortes" sublabel="Build tool · uncapped" footLabel="LC" />
          </div>
        </div>
      </div>
    </section>
  );
}
