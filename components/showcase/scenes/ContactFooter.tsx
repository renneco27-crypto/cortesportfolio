// components/showcase/scenes/ContactFooter.tsx
// Layer 4 – 3D Standing-to-Lying Perspective Showcase ("Developer by code. Designer by eye.")
// inspired by opus_5_5_3d_scrolling_showcase (1).html + elastic pill morphing from
// motion_study_02_ui_morphing_showcase.html, unified in Lawrence Cortes's Signature Studio palette
// (#f4f2ed warm studio slab, #141414 ink black, #b8ff01 / #8fd900 neon lime), followed by the
// original full-width #121212 LAWRENCE Cortes Contact Footer as the 3D rig tilts 0° -> 56° -> 0°.
"use client";

import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Turnstile } from "@marsidev/react-turnstile";
import { soundEngine } from "../engine/sound";
import {
  Send,
  Download,
  ArrowUpRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  Compass,
  Sparkles,
  Box,
  Code2,
  Eye,
  ShieldCheck,
} from "lucide-react";
import Github from "../svg/GithubMark";
import { chapters } from "@/data/showcase";
import { certificationsData } from "@/data/certifications";
import type { Certification, PortfolioCredential } from "@/types";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_CONTACT = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT;
const EMAILJS_TEMPLATE_AUTOREPLY = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_AUTOREPLY;

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContactFooterProps {
  message: string;
  onMessageChange: (v: string) => void;
  onJump: (p: number) => void;
}

const TECH_STACK = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS",
  "PostgreSQL",
  "Vercel AI SDK",
  "Node.js",
  "Python",
  "React Native",
  "Three.js / WebGL",
  "Docker",
  "Redis",
  "Figma",
];

export default function ContactFooter({
  message,
  onMessageChange,
  onJump,
}: ContactFooterProps) {
  // Contact form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  // 3D Standing-to-Lying perspective toggle & max tilt angle (42° standing perspective)
  const [is3DEnabled, setIs3DEnabled] = useState(true);
  const [maxTiltDeg, setMaxTiltDeg] = useState(42);

  // Elastic Pill Morphing interactive states (matching motion_study_02_ui_morphing_showcase.html)
  const [expandedCertId, setExpandedCertId] = useState<string | null>("csc-professional");
  const [liveCertifications, setLiveCertifications] = useState<Certification[]>(certificationsData);
  const [githubFilter, setGithubFilter] = useState<"all" | "fullstack" | "ai">("all");
  const [isGithubMorphing, setIsGithubMorphing] = useState(false);

  // Sync live credentials from Supabase (/api/credentials -> NEXT_PUBLIC_SUPABASE_URL)
  useEffect(() => {
    let cancelled = false;
    async function loadCredentials() {
      try {
        const res = await fetch("/api/credentials");
        if (!res.ok) return;
        const rows: PortfolioCredential[] = await res.json();
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return;
        const mapped: Certification[] = rows.map((r) => ({
          id: r.id,
          label: r.label,
          issuingBody: r.issuing_body,
          status:
            r.status === "earned"
              ? "earned"
              : r.status === "in-progress"
              ? "in-progress"
              : "planned",
          notes: r.notes,
          verifyUrl: r.verify_url,
        }));
        setLiveCertifications(mapped);
      } catch {
        // Fallback to static certificationsData
      }
    }
    loadCredentials();
    return () => {
      cancelled = true;
    };
  }, []);

  // Live GitHub contributions state
  const [weeks, setWeeks] = useState<ContributionDay[][]>([]);
  const [totalCommits, setTotalCommits] = useState<number>(1356);
  const [monthLabels, setMonthLabels] = useState<{ index: number; text: string }[]>([]);
  const [hoveredDay, setHoveredDay] = useState<{ text: string; count: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadGitHub() {
      try {
        let data: { totalContributions: number; contributions: ContributionDay[] } | null = null;
        try {
          const res = await fetch("/api/github/contributions?username=renneco27-crypto");
          if (res.ok) data = await res.json();
        } catch {
          // fallback below
        }
        if (!data || !data.contributions?.length) {
          const direct = await fetch(
            "https://github-contributions-api.jogruber.de/v4/renneco27-crypto?y=last"
          );
          if (direct.ok) {
            const json = await direct.json();
            const raw: ContributionDay[] = json.contributions || [];
            const total =
              typeof json.total === "object" && json.total !== null
                ? json.total.lastYear ?? raw.reduce((a, c) => a + c.count, 0)
                : typeof json.total === "number"
                ? json.total
                : raw.reduce((a, c) => a + c.count, 0);
            data = { totalContributions: total, contributions: raw };
          }
        }
        if (cancelled || !data?.contributions?.length) return;
        setTotalCommits(data.totalContributions || 1356);

        const byDate: Record<string, ContributionDay> = {};
        data.contributions.forEach((c) => {
          byDate[c.date] = c;
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const end = new Date(today);
        end.setDate(end.getDate() + (6 - end.getDay()));
        const start = new Date(end);
        start.setDate(start.getDate() - 7 * 52 - 6);
        start.setDate(start.getDate() - start.getDay());

        const builtWeeks: ContributionDay[][] = [];
        const cursor = new Date(start);
        let currentWeek: ContributionDay[] = [];

        while (cursor <= today || currentWeek.length > 0) {
          const iso = cursor.toISOString().slice(0, 10);
          const entry = byDate[iso];
          currentWeek.push({
            date: iso,
            count: entry ? entry.count : 0,
            level: entry ? entry.level : 0,
          });
          if (cursor.getDay() === 6 || cursor > today) {
            builtWeeks.push(currentWeek);
            currentWeek = [];
            if (cursor > today) break;
          }
          cursor.setDate(cursor.getDate() + 1);
        }
        setWeeks(builtWeeks);

        const labels: { index: number; text: string }[] = [];
        let lastMonth = -1;
        builtWeeks.forEach((w, i) => {
          if (w[0]) {
            const d = new Date(w[0].date + "T00:00:00");
            const m = d.getMonth();
            if (m !== lastMonth) {
              labels.push({
                index: i,
                text: d.toLocaleDateString("en-US", { month: "short" }),
              });
              lastMonth = m;
            }
          }
        });
        setMonthLabels(labels);
      } catch {
        // Keep clean fallback
      }
    }
    loadGitHub();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGithubTabChange = (tab: "all" | "fullstack" | "ai") => {
    setIsGithubMorphing(true);
    setGithubFilter(tab);
    setTimeout(() => setIsGithubMorphing(false), 290);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setFeedback("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: name,
          senderEmail: email,
          messageBody: message,
          turnstileToken: SITE_KEY ? token : "dev-no-turnstile",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        // If server-side EmailJS returned 500 (e.g. EmailJS browser-only key mode) and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY is set, send via @emailjs/browser
        if (
          res.status === 500 &&
          EMAILJS_PUBLIC_KEY &&
          EMAILJS_SERVICE_ID &&
          EMAILJS_TEMPLATE_CONTACT
        ) {
          const templateParams = {
            name,
            from_email: email,
            title: message.slice(0, 60),
            message,
          };
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_CONTACT,
            templateParams,
            EMAILJS_PUBLIC_KEY
          );
          if (EMAILJS_TEMPLATE_AUTOREPLY) {
            await emailjs.send(
              EMAILJS_SERVICE_ID,
              EMAILJS_TEMPLATE_AUTOREPLY,
              templateParams,
              EMAILJS_PUBLIC_KEY
            );
          }
          setStatus("success");
          setFeedback("Message sent! Lawrence will get back to you soon. 🙌");
          soundEngine.playSuccessChime();
          setName("");
          setEmail("");
          onMessageChange("");
          return;
        }
        setStatus("error");
        setFeedback(data.message ?? data.error ?? "Failed to send message.");
        return;
      }
      setStatus("success");
      setFeedback(data.message ?? "Message sent. Talk soon!");
      soundEngine.playSuccessChime();
      setName("");
      setEmail("");
      onMessageChange("");
    } catch {
      setStatus("error");
      setFeedback("Network error. Please retry shortly.");
    }
  }

  // Color theory helper for GitHub heatmap: Signature Studio Ink & Neon Lime
  const getStudioHeatmapColor = (level: number) => {
    switch (level) {
      case 0:
        return "#1f1f1f";
      case 1:
        return "#3b5200";
      case 2:
        return "#689400";
      case 3:
        return "#94d100";
      default:
        return "#b8ff01";
    }
  };

  // Group certifications into 3 architectural columns separated by vertical lines
  const certColumns: { title: string; subtitle: string; items: Certification[] }[] = [
    {
      title: "01 / Civil & National",
      subtitle: "Public Service & Systems",
      items: liveCertifications.filter((c) =>
        ["csc-professional", "tesda-css-nc2"].includes(c.id)
      ),
    },
    {
      title: "02 / Security & Network",
      subtitle: "Offensive & Defensive Systems",
      items: liveCertifications.filter((c) =>
        ["pwncollege-badge", "cisco-cybersecurity"].includes(c.id)
      ),
    },
    {
      title: "03 / Cloud & AI Track",
      subtitle: "Infrastructure Roadmap",
      items: liveCertifications.filter((c) =>
        ["nextwork-cloud", "aws-cloud-practitioner"].includes(c.id)
      ),
    },
  ];

  const input =
    "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-lime";

  return (
    <footer
      id="contact"
      data-3d-enabled={is3DEnabled ? "1" : "0"}
      data-max-tilt={maxTiltDeg}
      className="js-footer lc-gpu lc-perspective-stage pointer-events-none absolute inset-0 z-40 overflow-hidden bg-[#121212] text-white"
      style={{ transform: "translate3d(0, 100%, 0)" }}
    >
      {/* Top & Bottom Tilt-Shift Depth-of-Field Blur Overlays (from opus_5_5_3d_scrolling_showcase.html) */}
      <div className="js-dof-top lc-dof-top pointer-events-none absolute inset-x-0 top-0 z-40 opacity-0" />
      <div className="js-dof-bottom lc-dof-bottom pointer-events-none absolute inset-x-0 bottom-0 z-40 opacity-0" />

      {/* Floating 3D Perspective Mode Pill (Top-Right inside stage, hides automatically on final Contact Footer) */}
      <div className="js-3d-hud absolute right-6 top-20 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/85 px-3.5 py-1.5 text-[11px] shadow-lg backdrop-blur-xl transition-opacity duration-300 sm:right-12">
        <button
          type="button"
          onClick={() => setIs3DEnabled((v) => !v)}
          className={`lc-elastic-pill flex items-center gap-1.5 rounded-full px-3 py-1 font-bold transition-colors ${
            is3DEnabled ? "bg-lime text-black" : "bg-white/10 text-neutral-300"
          }`}
        >
          <Box className="h-3 w-3" />
          <span>{is3DEnabled ? "3D Standing View: ON" : "Flat Editorial View"}</span>
        </button>
      </div>

      {/* ===================================================================
          3D CAMERA RIG & MASTER-SCROLL-DRIVEN SLAB
          Tilts seamlessly 0° -> 56° -> 0° without any top cutoff!
          =================================================================== */}
      <div className="js-3d-rig lc-preserve-3d h-full w-full will-change-transform">
        <div className="js-3d-slab lc-preserve-3d w-full will-change-transform">
          {/* ===============================================================
              PART A: WARM EDITORIAL 3D STANDING-TO-LYING SLAB (#f4f2ed)
              Wider HR-readable 1060px layout with Left-and-Right Growing
              wing-expansion animation as each 3D section stands up!
              Clearance from fixed navbar with pt-28 sm:pt-36!
              =============================================================== */}
          <div className="lc-preserve-3d mx-auto w-full max-w-[1060px] px-4 pt-28 pb-16 sm:px-8 sm:pt-36">
            <div className="lc-preserve-3d lc-noise relative rounded-[32px] border border-white/20 bg-[#f4f2ed] p-6 text-[#171717] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.65),0_8px_0_#d8d3c8] sm:p-9">
              {/* ===========================================================
                  SECTION 01: "Developer by code. Designer by eye." (ABOUT LAWRENCE)
                  Bigger + Left-and-Right Growing Animation for HR Personnel!
                  =========================================================== */}
              <section id="about" className="lc-preserve-3d relative pb-14 pt-2">
                {/* Floating 3D Lime Squircle Badge (left side, counter-rotated in 3D) */}
                <div
                  className="lc-card-3d pointer-events-none absolute -left-6 top-2 z-30 hidden h-12 w-12 items-center justify-center rounded-2xl border border-black/10 bg-lime shadow-[0_20px_38px_rgba(0,0,0,0.32)] lg:flex"
                  data-z="44"
                  data-stand="-46"
                  data-tilt="-10"
                >
                  <Code2 className="h-6 w-6 text-black" />
                </div>

                {/* Floating 3D Ink Squircle Badge (right side) */}
                <div
                  className="lc-card-3d pointer-events-none absolute -right-6 top-6 z-30 hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-[#141414] text-lime shadow-[0_20px_38px_rgba(0,0,0,0.38)] lg:flex"
                  data-z="44"
                  data-stand="-46"
                  data-tilt="8"
                >
                  <Eye className="h-6 w-6" />
                </div>

                {/* Standing Header Card (Grows Left & Right when standing up) */}
                <div
                  className="lc-card-3d relative z-20 mx-auto max-w-3xl rounded-2xl border border-black/10 bg-[#141414] px-6 py-4 text-center text-white shadow-[0_22px_45px_-10px_rgba(0,0,0,0.35)]"
                  data-z="28"
                  data-stand="-40"
                  data-grow-wings="1"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/15 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-lime">
                    <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_8px_#b8ff01]" />
                    01 — ABOUT LAWRENCE CORTES
                  </div>
                  <h2 className="mt-2 font-ui text-3xl font-extrabold leading-[0.96] tracking-[-0.04em] text-white sm:text-5xl">
                    Developer by code.{" "}
                    <span className="font-script inline-block -rotate-2 text-4xl font-bold text-lime drop-shadow-[0_4px_16px_rgba(184,255,1,0.35)] sm:text-6xl">
                      Designer by eye.
                    </span>
                  </h2>
                  <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm font-medium leading-relaxed text-neutral-300">
                    BS Information Technology student in Ormoc City, Leyte — combining full-stack
                    engineering with government accounting precision and tactile motion.
                  </p>
                </div>

                {/* Standing Portrait & HR-Readable Narrative Bento Grid */}
                <div className="lc-preserve-3d mt-8 grid grid-cols-1 items-stretch gap-5 lg:grid-cols-12">
                  {/* Docked Target Slot for the 3-Stage Reused Lawrence Cortes Portrait Card (Left 4 cols) */}
                  <div
                    className="js-about-portrait-card lc-card-3d relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 bg-[#141414] p-3.5 text-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.45)] lg:col-span-4"
                    data-z="34"
                    data-stand="-42"
                    data-grow-wings="1"
                  >
                    <div className="relative h-44 w-full overflow-hidden rounded-xl bg-neutral-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/lawrence-face.jpg"
                        alt="Lawrence Cortes"
                        loading="eager"
                        decoding="sync"
                        className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                        <div>
                          <span className="inline-block rounded-full bg-lime px-2.5 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-black">
                            ORMOC CITY · PH
                          </span>
                          <h3 className="mt-1 text-base font-extrabold leading-tight text-white">
                            Lawrence Cortes
                          </h3>
                        </div>
                        <span className="font-script text-xl font-bold text-lime">
                          LC &apos;26
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-2.5 text-center">
                      <div>
                        <p className="font-ui text-sm font-black text-lime">8+</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-300">
                          Builds
                        </p>
                      </div>
                      <div>
                        <p className="font-ui text-sm font-black text-white">{totalCommits}</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-300">
                          Commits
                        </p>
                      </div>
                      <div>
                        <p className="font-ui text-sm font-black text-lime">2026</p>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-300">
                          Intern
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Standing HR-Readable Narrative & 3-Pillar Architecture Card (Right 8 cols) */}
                  <div
                    className="lc-card-3d flex flex-col justify-between rounded-2xl border border-black/15 bg-white p-5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.24)] sm:p-7 lg:col-span-8"
                    data-z="32"
                    data-stand="-40"
                    data-grow-wings="1"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-3">
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-neutral-600">
                          ENGINEERING &amp; DESIGN NARRATIVE · HR SUMMARY
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#141414] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-lime">
                          <Sparkles className="h-3 w-3 text-lime" /> Full-Stack · Brand · AI
                        </span>
                      </div>

                      <p className="text-sm sm:text-[15px] font-medium leading-relaxed text-neutral-800">
                        I&apos;m{" "}
                        <strong className="font-extrabold text-black">Lawrence Cortes</strong>
                        , a BS Information Technology student based in{" "}
                        <span className="rounded bg-lime/40 px-1.5 py-0.5 font-bold text-black">
                          Ormoc City, Leyte
                        </span>
                        . I pair modern full-stack product development —{" "}
                        <strong className="font-bold text-black">
                          Next.js, React, TypeScript, PostgreSQL, and AI SDKs
                        </strong>{" "}
                        — with the strict documentation and audit discipline I built supporting a
                        government accounting office.
                      </p>
                    </div>

                    {/* 3 Standing Sub-Pillars separated by Crisp Vertical Divider Lines */}
                    <div className="mt-4 grid grid-cols-1 divide-y divide-white/15 rounded-xl border border-black/15 bg-[#141414] text-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                      <div className="p-3.5">
                        <span className="font-mono text-[9px] font-black uppercase tracking-widest text-lime">
                          01 · SYSTEMS
                        </span>
                        <h4 className="mt-1 text-xs sm:text-sm font-extrabold text-white">
                          Full-Stack Next.js
                        </h4>
                        <p className="mt-1 text-[11px] leading-snug text-neutral-300">
                          App Router, TypeScript, Neon Postgres &amp; REST APIs.
                        </p>
                      </div>
                      <div className="p-3.5">
                        <span className="font-mono text-[9px] font-black uppercase tracking-widest text-lime">
                          02 · MOTION &amp; EYE
                        </span>
                        <h4 className="mt-1 text-xs sm:text-sm font-extrabold text-white">
                          Brand &amp; 3D Web
                        </h4>
                        <p className="mt-1 text-[11px] leading-snug text-neutral-300">
                          GSAP ScrollTrigger, elastic pill morphing &amp; UI craft.
                        </p>
                      </div>
                      <div className="p-3.5">
                        <span className="font-mono text-[9px] font-black uppercase tracking-widest text-lime">
                          03 · DISCIPLINE
                        </span>
                        <h4 className="mt-1 text-xs sm:text-sm font-extrabold text-white">
                          Audit-Grade Rigor
                        </h4>
                        <p className="mt-1 text-[11px] leading-snug text-neutral-300">
                          Accounting precision, sanitized inputs &amp; pwn.college.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ===========================================================
                  SECTION 02: PROOF OF WORK — LIVE GITHUB & TECH STACK (3D STANDING)
                  =========================================================== */}
              <section id="stack" className="lc-preserve-3d relative border-t border-black/10 py-10">
                <div className="lc-preserve-3d mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div className="lc-card-3d rounded-2xl bg-[#f4f2ed]/90 p-1.5" data-z="24" data-stand="-36">
                    <span className="font-mono text-[9px] font-extrabold uppercase tracking-[0.2em] text-neutral-400">
                      02 — PROOF OF WORK
                    </span>
                    <h2 className="mt-0.5 font-ui text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
                      GitHub Activity &amp;{" "}
                      <span className="font-serif-editorial italic font-normal text-neutral-500">
                        Engineering Stack
                      </span>
                    </h2>
                  </div>

                  {/* Elastic Pill Morphing Filter Bar (motion_study_02 principle) */}
                  <div
                    className="lc-card-3d inline-flex items-center gap-1 self-start rounded-full border border-black/10 bg-white p-1 shadow-md sm:self-auto"
                    data-z="28"
                    data-stand="-38"
                  >
                    {(
                      [
                        { id: "all", label: `${totalCommits} Commits` },
                        { id: "fullstack", label: "Full-Stack Core" },
                        { id: "ai", label: "AI & Security" },
                      ] as const
                    ).map((tab) => {
                      const active = githubFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => handleGithubTabChange(tab.id)}
                          className={`lc-elastic-pill rounded-full px-3 py-1 text-[10px] font-bold ${
                            active
                              ? "scale-105 bg-[#141414] text-lime shadow-sm"
                              : "text-neutral-600 hover:text-black"
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Standing 3D Dark Ink GitHub Bento Card */}
                <div
                  className={`lc-card-3d lc-morph-container rounded-2xl border border-black/15 bg-[#141414] p-4 text-white shadow-[0_26px_54px_-12px_rgba(0,0,0,0.48)] sm:p-6 ${
                    isGithubMorphing ? "motion-blur" : ""
                  }`}
                  data-z="34"
                  data-stand="-42"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime text-black shadow-sm">
                        <Github className="h-5 w-5" />
                      </span>
                      <div>
                        <a
                          href="https://github.com/renneco27-crypto"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-lime"
                        >
                          @renneco27-crypto <ArrowUpRight className="h-3.5 w-3.5 text-lime" />
                        </a>
                        <p className="font-mono text-[10px] text-neutral-400">
                          {hoveredDay
                            ? `${hoveredDay.count} contributions · ${hoveredDay.text}`
                            : githubFilter === "fullstack"
                            ? "Primary focus: Next.js 16 App Router, TypeScript & PostgreSQL"
                            : githubFilter === "ai"
                            ? "Primary focus: Vercel AI SDK, OpenCV batch pipelines & pwn.college"
                            : "Consistent daily shipping across 8+ production repositories"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400">
                      <span>Less</span>
                      {[0, 1, 2, 3, 4].map((lv) => (
                        <span
                          key={lv}
                          className="h-3 w-3 rounded-[3px] border border-white/10"
                          style={{ backgroundColor: getStudioHeatmapColor(lv) }}
                        />
                      ))}
                      <span>More</span>
                    </div>
                  </div>

                  {/* 52-Week Contribution Heatmap */}
                  <div className="overflow-x-auto pb-2">
                    <div className="min-w-[680px]">
                      <div className="mb-1.5 ml-7 flex font-mono text-[10px] text-neutral-500">
                        {monthLabels.map((m, idx) => {
                          const nextIdx =
                            idx < monthLabels.length - 1 ? monthLabels[idx + 1].index : weeks.length;
                          const spanWeeks = Math.max(1, nextIdx - m.index);
                          return (
                            <span
                              key={m.index}
                              style={{ width: `${spanWeeks * 13}px` }}
                              className="truncate"
                            >
                              {m.text}
                            </span>
                          );
                        })}
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="flex h-[84px] flex-col justify-between pr-1 pt-1 font-mono text-[9px] text-neutral-500">
                          <span>Mon</span>
                          <span>Wed</span>
                          <span>Fri</span>
                        </div>

                        <div className="flex gap-[3px]">
                          {(weeks.length > 0
                            ? weeks
                            : Array.from({ length: 52 }, (_, w) =>
                                Array.from({ length: 7 }, (__, d) => ({
                                  date: `2026-${w}-${d}`,
                                  count: (w + d) % 3 === 0 ? 4 : 1,
                                  level: ((w * d) % 4) + 1,
                                }))
                              )
                          ).map((week, wIdx) => (
                            <div key={wIdx} className="flex flex-col gap-[3px]">
                              {week.map((day) => (
                                <div
                                  key={day.date}
                                  onMouseEnter={() =>
                                    setHoveredDay({
                                      count: day.count,
                                      text: day.date,
                                    })
                                  }
                                  onMouseLeave={() => setHoveredDay(null)}
                                  className="h-[10px] w-[10px] rounded-[2.5px] transition-transform duration-150 hover:scale-150"
                                  style={{ backgroundColor: getStudioHeatmapColor(day.level) }}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack Elastic Pills inside the Standing Card */}
                  <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5">
                    <span className="mr-2 font-mono text-[10px] font-bold uppercase tracking-widest text-lime">
                      CORE TOOLKIT:
                    </span>
                    {TECH_STACK.map((tech) => (
                      <span
                        key={tech}
                        className="lc-elastic-pill cursor-default rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold text-neutral-200 hover:border-lime hover:bg-lime hover:text-black"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* ===========================================================
                  SECTION 03: CERTIFICATIONS & CREDENTIALS
                  High-Contrast Dark Ink (#141414) & Neon Lime (#b8ff01) Bento Grid
                  with Crisp Vertical Separator Lines & Bubble-Stretch Morphing!
                  =========================================================== */}
              <section
                id="certifications"
                className="lc-preserve-3d relative border-t border-black/10 pt-10 pb-4"
              >
                <div className="lc-preserve-3d mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div
                    className="lc-card-3d rounded-2xl border border-black/10 bg-[#141414] px-5 py-3.5 text-white shadow-lg"
                    data-z="26"
                    data-stand="-38"
                    data-grow-wings="1"
                  >
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-lime/40 bg-lime/15 px-3 py-0.5 text-[9.5px] font-black uppercase tracking-[0.2em] text-lime">
                      <ShieldCheck className="h-3.5 w-3.5 text-lime" />
                      03 — VERIFIED CREDENTIALS
                    </div>
                    <h2 className="mt-1.5 font-ui text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                      Certifications &amp;{" "}
                      <span className="font-script inline-block -rotate-2 text-3xl font-bold text-lime sm:text-5xl">
                        Standards
                      </span>
                    </h2>
                  </div>
                  <p className="max-w-xs rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-800 shadow-sm">
                    Click any credential card below to elastically stretch and inspect verification
                    links.
                  </p>
                </div>

                {/* High-Contrast White & Black Bento with Blurred Animated Pixel Scene GIF + StitchCSV Cutouts */}
                <div
                  className="lc-card-3d relative overflow-hidden rounded-2xl border-2 border-black/20 bg-white text-[#141414] shadow-[0_32px_68px_-12px_rgba(0,0,0,0.34)]"
                  data-z="34"
                  data-stand="-42"
                  data-grow-wings="1"
                >
                  {/* Blurred Animated Pixel Scene Background (pxct5rdf0uh51 (1).gif) */}
                  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/pixel-ui/bg-pixel-scene.gif"
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full scale-110 object-cover blur-[5px] saturate-150 opacity-55"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/68 to-white/78 backdrop-blur-[2px]" />
                  </div>

                  {/* Interactive Pixel Cutouts Header Strip (from StitchCSV-pixelated-ui/index.html) */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/15 bg-[#141414]/95 px-5 py-3 text-white backdrop-blur-md">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => soundEngine.playChainDangle()}
                        className="lc-elastic-pill group flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-black/60 px-3 py-1.5"
                        title="Tap for Pixel Chain Dangle SFX"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/pixel-ui/flame-burning.gif"
                          alt="Active Streak Flame"
                          className="h-6 w-6 object-contain transition-transform group-hover:scale-125"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <span className="font-mono text-[10px] font-black uppercase tracking-wider text-lime">
                          ACTIVE CREDENTIAL STREAK
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => soundEngine.playChainDangle()}
                        className="lc-elastic-pill group hidden cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-black/60 px-3 py-1.5 sm:flex"
                        title="StudyUp Pixel Book Cutout"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/pixel-ui/book-flipping.gif"
                          alt="Flipping Study Book"
                          className="h-6 w-7 object-contain transition-transform group-hover:scale-110"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <span className="font-mono text-[10px] font-bold text-neutral-200">
                          6 VERIFIED TRACKS
                        </span>
                      </button>
                    </div>

                    {/* Authentic Relay Active Wooden Cutout Badge + Pulsing Pixel LED from StitchCSV-pixelated-ui */}
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/pixel-ui/book-pencil.png"
                        alt="Pixel Book and Pencil"
                        className="hidden h-7 w-auto object-contain md:block"
                        style={{ imageRendering: "pixelated" }}
                      />
                      <button
                        type="button"
                        onClick={() => soundEngine.playChainDangle()}
                        className="lc-elastic-pill relative cursor-pointer transition-transform active:scale-95"
                        title="Relay Active Cutout Badge"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/pixel-ui/relay-badge.png"
                          alt="Relay Active"
                          className="h-7 w-auto object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                          style={{ imageRendering: "pixelated" }}
                        />
                        <span
                          className="pointer-events-none absolute left-[8.8%] top-[33%] h-[32%] w-[6.2%] animate-pulse rounded-[2px] bg-[#4ade80] shadow-[0_0_8px_2px_rgba(74,222,128,0.9)]"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  {/* 3 Columns Separated by Crisp Vertical Divider Lines (`lg:divide-x-2 lg:divide-black/15`) */}
                  <div className="relative z-10 grid grid-cols-1 divide-y-2 divide-black/15 lg:grid-cols-3 lg:divide-x-2 lg:divide-y-0">
                    {certColumns.map((col, colIdx) => {
                      const colCutoutSprite =
                        colIdx === 0
                          ? "/pixel-ui/side-trophy-icon.png"
                          : colIdx === 1
                          ? "/pixel-ui/icon-mode-code-lab.png"
                          : "/pixel-ui/book-flipping.gif";
                      return (
                        <div
                          key={col.title}
                          className="flex flex-col justify-between p-5 sm:p-6"
                        >
                          <div>
                            {/* Column Header on Blurred Pixel Scene + White Glass Background */}
                            <div className="flex items-center justify-between border-b-2 border-black/15 pb-4">
                              <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#141414] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-widest text-lime shadow-sm">
                                  {col.title}
                                </span>
                                <h3 className="mt-1.5 text-base font-extrabold text-[#141414] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                                  {col.subtitle}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* Pixel Cutout Badge per Column */}
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-black/15 bg-[#141414] p-1.5 shadow-md">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={colCutoutSprite}
                                    alt=""
                                    className="h-full w-full object-contain"
                                    style={{ imageRendering: "pixelated" }}
                                  />
                                </div>
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#141414] font-mono text-xs font-black text-lime shadow-sm">
                                  0{colIdx + 1}
                                </span>
                              </div>
                            </div>

                            {/* Black Credential Divs inside White/Pixel-Blurred Column */}
                            <div className="mt-5 space-y-3.5">
                              {col.items.map((cert, itemIdx) => {
                                const isExpanded = expandedCertId === cert.id;
                                const isPlanned = cert.status === "planned";
                                const certPixelIcon =
                                  cert.id === "csc-professional"
                                    ? "/pixel-ui/side-trophy-icon.png"
                                    : cert.id === "tesda-css-nc2"
                                    ? "/pixel-ui/icon-mode-stats.png"
                                    : cert.id === "cisco-cybersecurity"
                                    ? "/pixel-ui/icon-mode-code-lab.png"
                                    : cert.id === "pwncollege-badge"
                                    ? "/pixel-ui/flame-burning.gif"
                                    : cert.id === "nextwork-cloud"
                                    ? "/pixel-ui/book-pencil.png"
                                    : "/pixel-ui/side-green-gem.png";
                                const progressPct =
                                  cert.status === "earned"
                                    ? "100%"
                                    : cert.status === "in-progress"
                                    ? itemIdx === 0
                                      ? "78%"
                                      : "64%"
                                    : "38%";

                                return (
                                  <div
                                    key={cert.id}
                                    onClick={() => {
                                      soundEngine.playChainDangle();
                                      setExpandedCertId(isExpanded ? null : cert.id);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        soundEngine.playChainDangle();
                                        setExpandedCertId(isExpanded ? null : cert.id);
                                      }
                                    }}
                                    className={`lc-bubble-card lc-morph-container relative cursor-pointer overflow-hidden rounded-2xl border p-4 text-left ${
                                      isExpanded
                                        ? "border-2 border-[#141414] bg-[#0a0a0a] text-white shadow-[0_22px_44px_rgba(0,0,0,0.42)] ring-2 ring-lime"
                                        : "border-black/20 bg-[#141414] text-white shadow-[0_14px_30px_rgba(0,0,0,0.28)] hover:bg-[#1b1b1b]"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-start gap-3">
                                        <span
                                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-1.5 ${
                                            cert.status === "earned"
                                              ? "bg-lime text-black shadow-[0_0_12px_rgba(184,255,1,0.35)]"
                                              : isPlanned
                                              ? "border border-white/25 bg-white/10 text-white"
                                              : "border border-lime/50 bg-lime/15 text-lime"
                                          }`}
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            src={certPixelIcon}
                                            alt=""
                                            className="h-full w-full object-contain"
                                            style={{ imageRendering: "pixelated" }}
                                          />
                                        </span>
                                        <div>
                                          <h4 className="text-sm font-extrabold leading-snug text-white sm:text-[15px]">
                                            {cert.label}
                                          </h4>
                                          <p className="mt-1 text-xs font-semibold text-neutral-300">
                                            {cert.issuingBody}
                                          </p>
                                        </div>
                                      </div>

                                      <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[9.5px] font-black uppercase tracking-wider ${
                                          cert.status === "earned"
                                            ? "bg-lime text-black shadow-sm"
                                            : isPlanned
                                            ? "border border-white/30 bg-white/10 text-white"
                                            : "border border-lime bg-lime/15 text-lime"
                                        }`}
                                      >
                                        {cert.status === "in-progress"
                                          ? "IN PROGRESS"
                                          : cert.status.toUpperCase()}
                                      </span>
                                    </div>

                                    {/* Elastic Expanded Layer with StitchCSV Pixel Progress Bar */}
                                    {isExpanded && (
                                      <div className="mt-4 space-y-3 border-t border-white/15 pt-3">
                                        {/* Pixel Progress Track Cutout from StitchCSV-pixelated-ui */}
                                        <div className="flex items-center justify-between gap-3">
                                          <div className="relative h-3.5 w-32 overflow-hidden">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                              src="/pixel-ui/lib-progress-bar-empty.png"
                                              alt=""
                                              className="absolute inset-0 h-full w-full object-fill"
                                              style={{ imageRendering: "pixelated" }}
                                            />
                                            <div
                                              className="absolute bottom-[15%] left-[3%] top-[15%] overflow-hidden rounded-[2px]"
                                              style={{ width: progressPct }}
                                            >
                                              {/* eslint-disable-next-line @next/next/no-img-element */}
                                              <img
                                                src="/pixel-ui/lib-progress-bar-fill.png"
                                                alt=""
                                                className="h-full w-full object-fill"
                                                style={{ imageRendering: "pixelated" }}
                                              />
                                            </div>
                                          </div>
                                          <span className="font-mono text-[10px] font-black text-lime">
                                            MASTERY {progressPct}
                                          </span>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                          <span className="font-mono text-[11px] font-medium text-neutral-200">
                                            {cert.notes ??
                                              "Verified technical competency & structured coursework."}
                                          </span>
                                          {cert.verifyUrl && (
                                            <a
                                              href={cert.verifyUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              onClick={(e) => e.stopPropagation()}
                                              className="lc-elastic-pill inline-flex items-center gap-1.5 rounded-full bg-lime px-3.5 py-1.5 text-[10.5px] font-extrabold text-black hover:brightness-110"
                                            >
                                              Official Portal <ExternalLink className="h-3 w-3" />
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="mt-6 flex items-center justify-between border-t-2 border-black/15 pt-3 font-mono text-[10px] font-bold text-neutral-800">
                            <span className="inline-flex items-center gap-1.5">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/pixel-ui/green-orb.png"
                                alt=""
                                className="h-3.5 w-3.5 object-contain"
                                style={{ imageRendering: "pixelated" }}
                              />
                              LAWRENCE CORTES
                            </span>
                            <span className="rounded-full bg-[#141414] px-2.5 py-0.5 text-[9px] font-black text-lime shadow-sm">
                              VERIFIED TRACK
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* ===============================================================
              PART B: ORIGINAL FULL-WIDTH DARK #121212 "LAWRENCE Cortes" FOOTER
              (As the slab scrolls here, the 3D rig tilts smoothly back from 56° -> 0°!)
              =============================================================== */}
          <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col justify-between bg-[#121212] px-6 pb-10 pt-24 text-white sm:px-14">
            {/* Giant LAWRENCE + lime script Cortes (Original full-width design, zero shadow box!) */}
            <div className="relative flex items-center justify-center border-b border-white/10 py-6 sm:justify-start sm:py-10">
              <h2 className="select-none font-ui text-[19vw] font-extrabold uppercase leading-[0.82] tracking-[-0.045em] text-white sm:text-[150px] lg:text-[210px]">
                Lawrence
              </h2>
              <span className="js-footer-script font-script pointer-events-none absolute -bottom-4 right-2 -rotate-6 text-[15vw] font-bold text-lime drop-shadow-[0_6px_28px_rgba(184,255,1,0.45)] sm:-bottom-2 sm:right-12 sm:text-[112px] lg:right-24 lg:text-[168px]">
                Cortes
              </span>
            </div>

            {/* Middle Grid: Contact Form + 3-Column Links */}
            <div className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-12">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:col-span-6">
                <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-lime">
                  Start a project / internship chat
                </span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    className={input}
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                    aria-label="Your name"
                  />
                  <input
                    className={input}
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={150}
                    aria-label="Email"
                  />
                </div>
                <textarea
                  className={`${input} min-h-[110px] resize-none`}
                  placeholder="Tell me what you're building…"
                  value={message}
                  onChange={(e) => onMessageChange(e.target.value)}
                  required
                  maxLength={2000}
                  aria-label="Message"
                />
                {SITE_KEY && (
                  <Turnstile
                    siteKey={SITE_KEY}
                    onSuccess={setToken}
                    options={{ theme: "dark", size: "flexible" }}
                  />
                )}
                <div className="mt-1 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="lc-elastic-pill inline-flex cursor-pointer items-center gap-2 rounded-full bg-lime px-6 py-3 text-xs font-extrabold text-black shadow-lg hover:brightness-110 disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>
                  <p
                    aria-live="polite"
                    className={`text-xs ${
                      status === "error" ? "text-[#ff6b81]" : "text-lime"
                    }`}
                  >
                    {feedback}
                  </p>
                </div>
              </form>

              <div className="grid grid-cols-2 gap-6 text-xs sm:grid-cols-3 lg:col-span-6">
                <div className="flex flex-col gap-2">
                  <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    Explore
                  </span>
                  {chapters.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onJump(c.p)}
                      className="lc-bubble-chip w-fit rounded-full px-2.5 py-1 -ml-2.5 text-left text-neutral-300 hover:bg-white/10 hover:text-lime"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    Elsewhere
                  </span>
                  <a
                    href="https://github.com/renneco27-crypto"
                    target="_blank"
                    rel="noreferrer"
                    className="lc-bubble-chip inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 -ml-2.5 text-neutral-300 hover:bg-white/10 hover:text-lime"
                  >
                    <Github /> GitHub
                  </a>
                  <a
                    href="/api/resume/download"
                    className="lc-bubble-chip inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 -ml-2.5 text-neutral-300 hover:bg-white/10 hover:text-lime"
                  >
                    <Download className="h-3.5 w-3.5" /> Résumé (PDF)
                  </a>
                  <a
                    href="/projects"
                    className="lc-bubble-chip inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 -ml-2.5 text-neutral-300 hover:bg-white/10 hover:text-lime"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" /> All projects
                  </a>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    Based in
                  </span>
                  <span className="text-neutral-300">Ormoc City, Leyte</span>
                  <span className="text-neutral-400">Philippines · GMT+8</span>
                  <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-lime">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" /> Open to
                    internships
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 text-[11px] text-neutral-500 sm:flex-row">
              <p>
                © {new Date().getFullYear()} Lawrence Cortes. Designed &amp; built by hand, signed
                in lime.
              </p>
              <p className="text-neutral-400">
                Built with Next.js · Tailwind · GSAP ScrollTrigger
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
