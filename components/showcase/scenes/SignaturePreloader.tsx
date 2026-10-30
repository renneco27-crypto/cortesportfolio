// components/showcase/scenes/SignaturePreloader.tsx
// Stage 0 – handwritten "Lawrence" signature. Text glyphs are revealed through an
// SVG mask whose zig-zag strokes are drawn with DrawSVG (see engine/useIntro.ts).
import React from "react";

function zigzag(x0: number, x1: number, step = 12, top = 34, bottom = 196) {
  let d = `M${x0} ${bottom}`;
  let up = true;
  for (let x = x0 + step; x <= x1; x += step) {
    d += ` L${x} ${up ? top : bottom}`;
    up = !up;
  }
  return d;
}

const MASK_SEGMENTS = [zigzag(24, 132), zigzag(132, 312), zigzag(312, 500)];

export default function SignaturePreloader() {
  return (
    <div
      className="js-preloader fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-ink"
      aria-hidden="true"
    >
      <div className="absolute -top-28 h-[260px] w-[520px] rounded-full bg-[#4dff00]/15 blur-[110px]" />

      <div className="relative h-[200px] w-[340px] sm:h-[240px] sm:w-[520px]">
        <svg viewBox="0 0 520 230" className="h-full w-full overflow-visible" fill="none">
          <defs>
            <filter id="sig-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <mask id="sig-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="520" height="230">
              {MASK_SEGMENTS.map((d, i) => (
                <path key={i} className="js-sig-mask" d={d} stroke="white" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </mask>
          </defs>

          <text
            x="40"
            y="160"
            textLength="440"
            lengthAdjust="spacingAndGlyphs"
            mask="url(#sig-mask)"
            filter="url(#sig-glow)"
            fill="#ffffff"
            style={{ fontFamily: "var(--font-caveat), cursive", fontWeight: 700, fontSize: 158 }}
          >
            Lawrence
          </text>

          <path className="js-sig-swish" d="M150 196 C230 182, 330 176, 476 182" stroke="#b8ff01" strokeWidth="4" strokeLinecap="round" />
          <path className="js-sig-guide" d="M44 150 C60 40, 96 40, 110 150 C150 90, 190 92, 220 140 C260 80, 300 96, 330 140 C370 80, 420 100, 480 120" stroke="none" />
          <circle className="js-sig-tip" cx="0" cy="0" r="6" fill="#b8ff01" filter="url(#sig-glow)" opacity="0" />
        </svg>

        <div className="js-sig-stack absolute -bottom-2 right-4 flex flex-col items-start opacity-0 sm:right-6">
          <span className="font-ui text-sm font-black uppercase leading-none tracking-[0.22em] text-lime drop-shadow-[0_0_12px_rgba(184,255,1,0.75)] sm:text-base">
            CORTES
          </span>
          <span className="font-mono mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            ENGINEERING PORTFOLIO
          </span>
        </div>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-2">
        <span className="js-sig-status font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">Compiling signature…</span>
        <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
          <div className="js-sig-bar h-full w-full origin-left scale-x-0 bg-lime" />
        </div>
      </div>
    </div>
  );
}
