"use client";
import { useEffect, useRef } from "react";

const SVG_ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>`;

interface Link { label: string; href: string; }
interface Panel {
  side: "L" | "R";
  num: string;
  title: string;
  body: string;
  links: Link[];
  cta?: boolean;
}

const PANELS: Panel[] = [
  { side: "L", num: "01", title: "CORTES Engineering Portfolio",
    body: "This site. A dark, component-driven portfolio built to present projects, skills, and certifications in one place — and to keep getting rebuilt as the stack improves.",
    links: [{ label: "View live site", href: "https://cortes-engineering-portfolio.onrender.com" }] },
  { side: "R", num: "02", title: "StudyUp",
    body: "StitchAI is a study tool designed to turn structured CSV data into comprehensive, interactive study notes and quizzes. By importing formatted CSV files, the app instantly populates a customized dashboard with diverse learning modules including flashcards, 4-option multiple-choice quizzes, fill-in-the-blank identification, true/false questions, and list enumeration allowing users to seamlessly track their progress and review streaks.",
    links: [{ label: "Try the app", href: "https://median.co/share/nmpwama#androidphone" }, { label: "Telegram Bot", href: "https://t.me/+iBqel2uwqGA0NzRl" }] },
  { side: "L", num: "03", title: "AutoCertification AI",
    body: "An AI-powered certificate generation platform that automatically inserts recipient names into custom certificate templates, eliminating repetitive manual editing. Designed to help schools, organizations, and event coordinators generate large batches of personalized certificates quickly, accurately, and efficiently.",
    links: [{ label: "View live site", href: "https://autocertificationai.onrender.com/" }] },
  { side: "R", num: "04", title: "Telegram Reminder Bot",
    body: "A Telegram bot that helps users stay organized by automating reminders and follow-ups. Ideal for students, professionals, and busy individuals who want a simple way to manage tasks, deadlines, and daily responsibilities directly from Telegram.",
    links: [{ label: "View Telegram link", href: "https://web.telegram.org/a/#8905888956" }] },
  { side: "L", num: "05", title: "Trash4Cash Barcode System",
    body: "A barcode-based recycling rewards platform where students earn canteen credits by returning recyclable waste. The system promotes proper waste management, encourages environmental responsibility, and provides schools with an engaging way to incentivize sustainable behavior.",
    links: [{ label: "View repository", href: "https://github.com/crisantohcortes1-commits/-Trash4CashBarcode" }] },
  { side: "R", num: "06", title: "For the Blind — Keyboard Touches",
    body: "A browser extension designed for blind and visually impaired users that provides fast speech feedback, keyboard navigation, and screen exploration tools. Features include speech feedback while navigating web pages, text/link/button/heading reading, caret tracking, selected text reading, element labels announced before their role, Navigator Mode with Alt + C shortcut, and Escape key support for exiting navigation states.",
    links: [{ label: "View repository", href: "https://github.com/renneco27-crypto/FortheBlind_BIngExtensionBlind" }] },
  { side: "L", num: "07", title: "School Attendance Maker",
    body: "A secure, specialized web application built for academic institutions and colleges of computer studies that streamlines classroom attendance tracking through a synchronized portal for instructors and students, utilizing anti-cheating protocols and automated reporting. Features include dual-interface portal (Teacher Panel + Student Portal), Anti-Cheat &ldquo;Double QR&rdquo; Technology, Biometric Verification (Google Face Recognition &amp; Nodding System), Device Integrity Protection (Anti-Developer Options), and Seamless Reporting &amp; Excel Export.",
    links: [{ label: "Download APK", href: "https://www.mediafire.com/file/e5mltyozkd9goji/ACLC_QR.apk/file" }, { label: "Main Gateway", href: "https://attendancemaker-tsjz.onrender.com" }, { label: "Teacher Interface", href: "https://teachesinterfaceattendanceaclc.onrender.com/" }] },
  { side: "R", num: "08", title: "More on GitHub",
    body: "New builds land here first. Browse everything currently in progress.",
    links: [{ label: "github.com/renneco27-crypto", href: "https://github.com/renneco27-crypto" }], cta: true },
];

const N = PANELS.length;
const CARD_W = 400, CARD_H = 280;
const ARRIVE = 0.25, DEPART = 0.75;
const T_PAUSE = 0.18;
const EASE_EXP = 1.2;
const TITLE_HOLD = 0.06;
const TITLE_FADE = 0.05;
const VH_PER_CARD_DESKTOP = 0.65;
const VH_PER_CARD_MOBILE = 0.85;

function easeOut(t: number) { return 1 - Math.pow(1 - t, EASE_EXP); }
function easeIn(t: number) { return Math.pow(t, EASE_EXP); }
function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }

export default function ProjectCorridor() {
  const trackRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const layer = layerRef.current;
    const bar = barRef.current;
    const hint = hintRef.current;
    const titleEl = titleRef.current;
    if (!track || !layer || !bar || !hint || !titleEl) return;

    const cardEls = PANELS.map((p) => {
      const d = document.createElement("div");
      d.className = "cc-card" + (p.cta ? " cc-cta" : "");
      let html = `<span class="cc-num">${p.num}</span><h3>${p.title}</h3><p>${p.body}</p>`;
      if (p.links.length === 1) {
        html += `<a class="cc-link" href="${p.links[0].href}" target="_blank" rel="noopener">${p.links[0].label}${SVG_ARROW}</a>`;
      } else {
        html += `<div class="cc-links">${p.links.map((l) => `<a class="cc-link" href="${l.href}" target="_blank" rel="noopener">${l.label}${SVG_ARROW}</a>`).join("")}</div>`;
      }
      d.innerHTML = html;
      d.style.opacity = "0";
      layer.appendChild(d);
      return d;
    });

    let isMobile: boolean, cw: number, ch: number;
    let W: number, H: number, VPX: number, VPY: number, EDGE_Y: number, TOTAL: number;
    let LINE_L: { x1: number; y1: number; x2: number; y2: number };
    let LINE_R: { x1: number; y1: number; x2: number; y2: number };

    function computeGeometry() {
      if (!track) return;
      W = window.innerWidth;
      H = window.innerHeight;
      isMobile = W <= 768;
      cw = isMobile ? Math.min(400, W - 32) : CARD_W;
      ch = isMobile ? Math.min(280, H * 0.4) : CARD_H;
      VPX = W / 2;
      VPY = H * 0.30;
      EDGE_Y = H * 0.78;
      LINE_L = { x1: VPX, y1: VPY, x2: 0, y2: EDGE_Y };
      LINE_R = { x1: VPX, y1: VPY, x2: W, y2: EDGE_Y };
      TOTAL = Math.round(N * H * (isMobile ? VH_PER_CARD_MOBILE : VH_PER_CARD_DESKTOP));
      track.style.height = TOTAL + "px";
    }

    function lp(line: typeof LINE_L, t: number) {
      return { x: line.x1 + (line.x2 - line.x1) * t, y: line.y1 + (line.y2 - line.y1) * t };
    }

    function render() {
      if (!bar || !hint || !titleEl) return;
      const prog = progRef.current;

      const titleAlpha = prog < TITLE_HOLD ? 1 : clamp(1 - (prog - TITLE_HOLD) / TITLE_FADE, 0, 1);
      titleEl.style.opacity = String(titleAlpha);

      const cardsStart = TITLE_HOLD;
      const cardsProg = clamp((prog - cardsStart) / (1 - cardsStart), 0, 1);
      const scaled = cardsProg * N;

      cardEls.forEach((el, i) => {
        const p = PANELS[i];
        const local = scaled - i;
        if (local < -0.02 || local > 1.02) { el.style.opacity = "0"; el.style.pointerEvents = "none"; return; }
        const lc = clamp(local, 0, 1);
        const isL = p.side === "L";
        const line = isL ? LINE_L : LINE_R;
        let t: number, scale: number, alpha: number;
        if (lc < ARRIVE) {
          const pp = lc / ARRIVE, ep = easeOut(pp);
          scale = 0.25 + ep * 0.75; t = ep * T_PAUSE; alpha = pp < 0.1 ? pp / 0.1 : 1;
        } else if (lc <= DEPART) {
          scale = 1; t = T_PAUSE; alpha = 1;
        } else {
          const pp = (lc - DEPART) / (1 - DEPART), ep = easeIn(pp);
          scale = 1; t = T_PAUSE + (1 - T_PAUSE + 0.38) * ep; alpha = pp > 0.55 ? 1 - (pp - 0.55) / 0.45 : 1;
        }
        const pt = lp(line, t);
        const tx = pt.x - cw / 2, ty = pt.y - ch / 2;
        el.style.width = cw + "px";
        el.style.opacity = String(Math.max(0, alpha));
        el.style.pointerEvents = alpha > 0.5 ? "auto" : "none";
        el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      });

      bar.style.width = (prog * 100) + "%";
      hint.style.opacity = (prog > 0.015 && prog < 0.98) ? "0" : (prog <= 0.015 ? "1" : "0");
    }

    function onScroll() {
      if (!track || !bar || !hint || !titleEl) return;
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const range = Math.max(1, TOTAL - H);
      progRef.current = clamp((window.scrollY - trackTop) / range, 0, 1);
      render();
    }

    function onResize() {
      computeGeometry();
      onScroll();
    }

    computeGeometry();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cardEls.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div id="corridor-root" style={{ width: "100%", position: "relative", fontFamily: "system-ui,-apple-system,sans-serif" }}>
      <style>{`
        #corridor-root .cc-card{
          position:absolute;width:400px;background:rgba(255,255,255,.025);
          border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:32px;
          display:flex;flex-direction:column;pointer-events:auto;will-change:transform,opacity;
          backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
          font-family:system-ui,-apple-system,sans-serif;
        }
        @media(max-width:768px){#corridor-root .cc-card{width:auto;max-width:calc(100vw - 32px);}}
        #corridor-root .cc-card:hover{border-color:rgba(139,92,246,.35)}
        #corridor-root .cc-num{font-family:ui-monospace,monospace;font-size:.8rem;color:#a78bfa;line-height:1}
        #corridor-root .cc-card h3{font-size:1.25rem;font-weight:600;margin-top:1rem;color:#fff;line-height:1.3}
        #corridor-root .cc-card p{color:rgba(161,161,170,1);font-size:.95rem;margin-top:.7rem;line-height:1.55;flex:1}
        #corridor-root .cc-link{margin-top:1.4rem;display:inline-flex;align-items:center;gap:.4rem;font-size:.88rem;font-weight:600;color:#c4b5fd;text-decoration:none}
        #corridor-root .cc-link svg{width:.9rem;height:.9rem;flex-shrink:0;transition:transform .2s}
        #corridor-root .cc-card:hover .cc-link svg{transform:translate(2px,-2px)}
        #corridor-root .cc-links{display:flex;gap:.75rem;flex-wrap:wrap;margin-top:1.4rem}
        #corridor-root .cc-card.cc-cta{background:rgba(139,92,246,.06);border:1px dashed rgba(139,92,246,.35)}
        #corridor-root #corridor-track{width:100%;position:relative}
        #corridor-root #corridor-sticky{position:sticky;top:0;width:100%;height:100vh;overflow:hidden}
        #corridor-root #corridor-cards-layer{position:absolute;inset:0;pointer-events:none}
        #corridor-root #corridor-bar{position:absolute;bottom:0;left:0;height:2px;background:rgba(139,92,246,.7);z-index:20}
        #corridor-root #corridor-hint{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);font-size:11px;color:rgba(255,255,255,.22);letter-spacing:.08em;pointer-events:none;white-space:nowrap;transition:opacity .3s}
        #corridor-root #corridor-title{
          position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
          text-align:center;pointer-events:none;transition:opacity .25s;z-index:10;
        }
        #corridor-root #corridor-title .eyebrow{display:inline-block;font-size:.78rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#a78bfa;margin-bottom:.9rem}
        #corridor-root #corridor-title h2{font-size:clamp(1.75rem,4vw,2.6rem);font-weight:700;color:#fff;line-height:1.15}
        #corridor-root #corridor-title p{color:#a1a1aa;margin-top:.8rem;font-size:1rem;max-width:480px}
      `}</style>
      <div ref={trackRef} id="corridor-track">
        <div id="corridor-sticky">
          <div ref={titleRef} id="corridor-title">
            <span className="eyebrow">Projects</span>
            <h2>What I've shipped</h2>
            <p>A living list — more goes up on GitHub as each build ships.</p>
          </div>
          <div ref={layerRef} id="corridor-cards-layer" />
          <div ref={barRef} id="corridor-bar" />
          <div ref={hintRef} id="corridor-hint">scroll to walk through</div>
        </div>
      </div>
    </div>
  );
}
