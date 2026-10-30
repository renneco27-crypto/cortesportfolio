// components/showcase/svg/Markers.tsx
// Hand-built SVG highlighter markers (ported from the Urban Markers reference and
// re-branded for Lawrence Cortes). Animatable parts carry js-* class hooks:
//   .js-cap  – outer cap (lifts during the toolkit scene)
//   .js-plug – bottom end plug (drops slightly)
//   .js-axis – dashed technical axis (fades in)
import React from "react";

interface ProjectMarkerProps {
  uid: string;
  bodyStops: [string, string, string, string];
  capStops: [string, string, string];
  label: string;
  sublabel: string;
  footLabel?: string;
}

export function ProjectMarker({ uid, bodyStops, capStops, label, sublabel, footLabel = "CORTES" }: ProjectMarkerProps) {
  return (
    <svg viewBox="0 0 240 560" className="h-full w-full overflow-visible lc-marker-shadow" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`body-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={bodyStops[0]} />
          <stop offset="28%" stopColor={bodyStops[1]} />
          <stop offset="76%" stopColor={bodyStops[2]} />
          <stop offset="100%" stopColor={bodyStops[3]} />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={capStops[0]} stopOpacity="0.9" />
          <stop offset="45%" stopColor={capStops[1]} stopOpacity="0.94" />
          <stop offset="100%" stopColor={capStops[2]} stopOpacity="0.97" />
        </linearGradient>
        <linearGradient id={`base-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#383838" />
          <stop offset="25%" stopColor="#525252" />
          <stop offset="65%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#080808" />
        </linearGradient>
      </defs>

      <line className="js-axis" x1="120" y1="-20" x2="120" y2="560" stroke="#111" strokeWidth="1" strokeDasharray="4 4" opacity="0" />

      {/* Inner chisel nib + collar (revealed when the cap lifts) */}
      <g>
        <path d="M100 105 L142 86 L146 150 L96 150 Z" fill={bodyStops[1]} />
        <path d="M100 105 L142 86 L145 92 L102 111 Z" fill={bodyStops[0]} />
        <rect x="86" y="146" width="68" height="26" rx="3" fill={`url(#base-${uid})`} />
        <rect x="78" y="168" width="84" height="10" rx="2" fill="#161616" />
      </g>

      {/* Outer cap */}
      <g className="js-cap">
        <path d="M76 68 C76 56, 164 56, 164 68 L168 176 L72 176 Z" fill={`url(#cap-${uid})`} />
        <ellipse cx="120" cy="62" rx="44" ry="5.5" fill="white" opacity="0.32" />
        <path d="M75 78 L58 86 C53 89, 52 95, 52 104 L54 186 C54 191, 61 191, 62 185 L62 102 C62 96, 66 93, 74 90 Z" fill={`url(#cap-${uid})`} />
        <rect x="86" y="66" width="12" height="106" fill="white" opacity="0.24" style={{ filter: "blur(2px)" }} />
      </g>

      {/* Barrel with vertical print */}
      <g>
        <rect x="72" y="176" width="96" height="4" fill="#111111" opacity="0.45" />
        <path d="M72 180 L168 180 L164 402 L76 402 Z" fill={`url(#body-${uid})`} />
        <rect x="86" y="182" width="14" height="216" fill="white" opacity="0.28" style={{ filter: "blur(2.5px)" }} />
        <g transform="translate(128, 292) rotate(-90)">
          <text x="0" y="0" textAnchor="middle" fill="#141414" fontFamily="var(--font-inter-lc), Inter, sans-serif" fontWeight="900" fontSize="14.5" letterSpacing="1.4">
            {label.toUpperCase()}
          </text>
          <text x="0" y="14" textAnchor="middle" fill="#141414" opacity="0.75" fontFamily="var(--font-inter-lc), Inter, sans-serif" fontWeight="700" fontSize="7" letterSpacing="2.2">
            {sublabel.toUpperCase()}
          </text>
        </g>
      </g>

      {/* Bottom plug */}
      <g className="js-plug">
        <rect x="94" y="382" width="52" height="34" rx="3" fill={bodyStops[0]} opacity="0.85" />
        <rect x="75" y="402" width="90" height="14" fill="#111111" />
        <path d="M78 416 L162 416 L158 492 C158 502, 82 502, 82 492 Z" fill={`url(#base-${uid})`} />
        <text x="120" y="458" textAnchor="middle" fill="#ffffff" opacity="0.55" fontFamily="var(--font-inter-lc), Inter, sans-serif" fontWeight="800" fontSize="8" letterSpacing="2">
          {footLabel}
        </text>
        <rect x="105" y="464" width="30" height="1.5" fill="#b8ff01" opacity="0.75" />
      </g>
    </svg>
  );
}

/** Giant open chisel marker shown in the hero (tilted, uncapped) */
export function HeroBuildMarker() {
  return (
    <svg viewBox="0 0 340 520" className="h-full w-full overflow-visible lc-marker-shadow" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hb-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ecff99" />
          <stop offset="25%" stopColor="#c8ff00" />
          <stop offset="65%" stopColor="#9ee300" />
          <stop offset="100%" stopColor="#537a00" />
        </linearGradient>
        <linearGradient id="hb-tip" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dcff4d" />
          <stop offset="55%" stopColor="#b0f500" />
          <stop offset="100%" stopColor="#73ab00" />
        </linearGradient>
        <linearGradient id="hb-barrel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="20%" stopColor="#575757" />
          <stop offset="40%" stopColor="#222222" />
          <stop offset="85%" stopColor="#0d0d0d" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
      </defs>
      <g transform="rotate(-14 170 240) translate(0, 15)">
        <path d="M135 58 L198 30 L205 112 L130 112 Z" fill="url(#hb-tip)" />
        <path d="M135 58 L198 30 L203 38 L138 66 Z" fill="#f4ffbf" />
        <rect x="154" y="102" width="3.5" height="12" rx="1.5" fill="#1a1a1a" />
        <rect x="174" y="102" width="3.5" height="12" rx="1.5" fill="#1a1a1a" />
        <rect x="126" y="110" width="84" height="8" rx="3" fill="#1c1c1c" />
        <path d="M116 116 C116 110, 220 110, 220 116 L244 265 C246 285, 90 285, 92 265 Z" fill="url(#hb-body)" />
        <path d="M130 122 L148 122 L138 260 L114 260 Z" fill="white" opacity="0.34" style={{ filter: "blur(2px)" }} />
        <ellipse cx="172" cy="195" rx="36" ry="52" fill="#9cd900" stroke="#d9ff66" strokeWidth="1.5" opacity="0.75" />
        <text x="172" y="203" textAnchor="middle" fill="#141414" fontFamily="var(--font-syne), sans-serif" fontWeight="800" fontSize="26">
          LC
        </text>
        <path d="M95 245 L72 265 C65 272, 63 282, 66 295 L82 425 C84 432, 92 430, 93 422 L84 290 C83 280, 88 274, 98 268 Z" fill="#1e1e1e" />
        <path d="M91 264 C91 278, 245 278, 245 264 L268 495 C268 515, 70 515, 70 495 Z" fill="url(#hb-barrel)" />
        <g transform="translate(170, 390) rotate(-86)">
          <text x="0" y="0" textAnchor="middle" fill="#ffffff" opacity="0.7" fontFamily="var(--font-inter-lc), Inter, sans-serif" fontWeight="900" fontSize="13" letterSpacing="2">
            LAWRENCE CORTES
          </text>
          <text x="0" y="14" textAnchor="middle" fill="#b8ff01" opacity="0.8" fontFamily="var(--font-inter-lc), Inter, sans-serif" fontWeight="700" fontSize="7" letterSpacing="3">
            BUILD TOOL · EST. ORMOC
          </text>
        </g>
      </g>
    </svg>
  );
}

/** Glossy lime terminal-cursor mascot. Pupils carry .js-pupil for pointer tracking, lids .js-lid for blinking */
export function CursorBuddy() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full max-w-[320px]" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="buddy-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ecff99" />
          <stop offset="40%" stopColor="#b8ff01" />
          <stop offset="85%" stopColor="#7cb800" />
          <stop offset="100%" stopColor="#4d7300" />
        </linearGradient>
      </defs>
      <g style={{ filter: "drop-shadow(0 18px 20px rgba(0,0,0,0.28))" }}>
        {/* Prompt chevron */}
        <path d="M58 92 L92 120 L58 148" stroke="#141414" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
        {/* Cursor block body */}
        <rect x="118" y="52" width="120" height="150" rx="26" fill="url(#buddy-body)" />
        <rect x="132" y="62" width="22" height="120" rx="11" fill="white" opacity="0.35" />
        {/* Eyes */}
        <g>
          <circle cx="160" cy="112" r="16" fill="white" />
          <circle cx="204" cy="112" r="16" fill="white" />
          <g className="js-pupil">
            <circle cx="163" cy="113" r="7.5" fill="#111111" />
            <circle cx="207" cy="113" r="7.5" fill="#111111" />
            <circle cx="166" cy="109.5" r="2.4" fill="white" />
            <circle cx="210" cy="109.5" r="2.4" fill="white" />
          </g>
          <g className="js-lid" style={{ transformOrigin: "182px 96px", transform: "scaleY(0)" }}>
            <rect x="142" y="94" width="36" height="36" rx="18" fill="#a6e600" />
            <rect x="186" y="94" width="36" height="36" rx="18" fill="#a6e600" />
          </g>
        </g>
        {/* Smile */}
        <path d="M168 150 C176 160, 190 160, 198 150" stroke="#141414" strokeWidth="5" strokeLinecap="round" />
        {/* Underscore feet */}
        <rect x="128" y="210" width="44" height="10" rx="5" fill="#141414" opacity="0.8" />
        <rect x="186" y="210" width="44" height="10" rx="5" fill="#141414" opacity="0.8" />
      </g>
    </svg>
  );
}

/** Neon ribbon that draws an "LC" monogram loop */
export function LCRibbon() {
  return (
    <svg viewBox="0 0 360 250" className="h-full w-full max-w-[360px]" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f2ffbf" />
          <stop offset="35%" stopColor="#b8ff01" />
          <stop offset="80%" stopColor="#7cb800" />
          <stop offset="100%" stopColor="#4d7300" />
        </linearGradient>
      </defs>
      <path
        className="js-ribbon"
        d="M92 38 C86 90, 80 150, 86 202 C120 206, 160 200, 196 168 C232 136, 270 96, 302 74 C250 40, 186 72, 186 130 C186 188, 252 214, 312 184"
        stroke="url(#ribbon-grad)"
        strokeWidth="26"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 12px 14px rgba(80,125,0,0.45))" }}
      />
    </svg>
  );
}
