"use client";

import React, { useState, useEffect, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Send, X } from "lucide-react";

type Message = { id: string; role: "user" | "assistant"; content: string };

const QUICK_PROMPTS = [
  { label: "⚡ Core Tech Stack", query: "Summarize Lawrence's core tech stack and architecture" },
  { label: "💼 2026 Internship Status", query: "What is Lawrence's 2026 internship availability and preferred roles?" },
  { label: "🚀 Top Shipped Projects", query: "What are Lawrence's top 3 shipped software projects?" },
  { label: "🎓 Certifications & Honors", query: "Tell me about Lawrence's credentials, education, and civil service eligibility" },
];

const PRESET_ANSWERS: Record<string, string> = {
  stack: `**Lawrence's Core Stack & Architecture:**\n\n• **Frontend & UI**: Next.js 15 (App Router, Server Components), TypeScript, Tailwind CSS, GSAP 3 (ScrollTrigger, Flip, Timeline choreography), Framer Motion.\n• **Backend & Systems**: Python (FastAPI, OpenCV), Node.js, REST APIs, Redis (Upstash caching & rate-limiting), Cloudflare Turnstile bot protection.\n• **Data & Tools**: Git/GitHub, Excel automation (openpyxl), Linux CLI, Figma to production code.\n\nFocused on high-performance interactive interfaces, clean architecture, and responsive UX.`,
  internship: `**2026 Internship Availability:**\n\n• **Status**: Actively available immediately for 2026 internships.\n• **Target Roles**: Full-Stack / Frontend Web Developer, QA & Software Testing Engineer, IT Support & Infrastructure.\n• **Arrangement**: Prefers Remote, open to Onsite opportunities with prior academic clearance.\n• **Location**: Ormoc City, Leyte, Philippines.\n• **Academic Standing**: 1st Year BS in Information Technology (BSIT) at ACLC College Ormoc Campus (Class of 2029). Flexible schedule for industry work.`,
  projects: `**Lawrence's Top Shipped Software Projects:**\n\n1. **Automated Attendance Scanner**: High-speed camera QR-code scanner with real-time student verification, automated Excel logging via Python, and sound feedback.\n2. **NaturalVoice Screen Reader**: Accessible web assistant featuring instant text-to-speech synthesis, speed/pitch modulation, and clean responsive UI.\n3. **Lex Memoria**: Studio portfolio system with physical panel wipes, morphing card choreography, and real-time interactive terminal concierge.`,
  credentials: `**Credentials, Education & Honors:**\n\n• **Degree Program**: Bachelor of Science in Information Technology (BSIT) — ACLC College Ormoc Campus.\n• **Civil Service**: Career Service Subprofessional Eligibility (Passed with official certificate).\n• **Prior Experience**: Government Accounting Office internship covering technical records, automated workflows, and administrative compliance.\n• **Verified Certifications**: Multiple verified credentials across Web Development, Python, and Software Quality Assurance.`
};

export default function EditorialChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMorphBlur, setIsMorphBlur] = useState(false);
  const [ isPressed, setIsPressed ] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setHasMounted(true);
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const triggerMorphState = (nextOpen: boolean) => {
    if (nextOpen === isOpen) return;
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 140);

    setIsMorphBlur(true);
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = setTimeout(() => {
      setIsMorphBlur(false);
    }, 290);

    setIsOpen(nextOpen);
  };

  const sendMessageText = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const lower = textToSend.toLowerCase();
    let localPreset: string | null = null;
    if (lower.includes("stack") || lower.includes("technolog")) localPreset = PRESET_ANSWERS.stack;
    else if (lower.includes("intern") || lower.includes("availab") || lower.includes("hire")) localPreset = PRESET_ANSWERS.internship;
    else if (lower.includes("project") || lower.includes("build") || lower.includes("work")) localPreset = PRESET_ANSWERS.projects;
    else if (lower.includes("cert") || lower.includes("honor") || lower.includes("degree") || lower.includes("civil service")) localPreset = PRESET_ANSWERS.credentials;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, turnstileToken }),
      });
      const data = await res.json();

      const replyContent =
        data.reply ||
        localPreset ||
        "I'm trained on Lawrence's full-stack architecture, 8+ shipped builds, and 2026 internship availability. Ask me about his tech stack, projects, or availability!";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: replyContent,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            localPreset ||
            "I'm Lawrence's Studio AI Concierge. I can give you full details on his Next.js builds, Python projects, Civil Service credentials, and 2026 internship availability!",
        },
      ]);
    } finally {
      setIsLoading(false);
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessageText(input);
  };

  if (!hasMounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[85] sm:bottom-6 sm:right-6">
      {/* Directional SVG Motion Blur Filter (from motion_study_02_ui_morphing_showcase.html) */}
      <svg width="0" height="0" className="pointer-events-none absolute">
        <defs>
          <filter id="svg-motion-blur-chat" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5 0.6" />
          </filter>
        </defs>
      </svg>

      {/* Single Morphing Surface Container (motion_study_02_ui_morphing_showcase.html) */}
      <div
        role={isOpen ? "dialog" : "region"}
        aria-label="Ask Lawrence AI Concierge"
        className={`lc-morph-container relative overflow-hidden border ${
          isOpen ? "border-white/20" : "border-white/15 hover:border-lime"
        } ${isPressed ? "pressed" : ""}`}
        style={{
          width: isOpen ? "min(420px, calc(100vw - 32px))" : "212px",
          height: isOpen ? "min(540px, 80vh)" : "52px",
          borderRadius: isOpen ? "28px" : "26px",
          backgroundColor: "#070707",
          boxShadow: isOpen
            ? "0 26px 52px rgba(0, 0, 0, 0.45), 0 6px 16px rgba(0, 0, 0, 0.22)"
            : "0 22px 45px rgba(0, 0, 0, 0.32), 0 4px 12px rgba(0, 0, 0, 0.16)",
          filter: isMorphBlur ? "url(#svg-motion-blur-chat)" : "none",
        }}
      >
        {/* =========================================================
            STATE 1: Compact Pill Layer (Closed State)
            ========================================================= */}
        <button
          type="button"
          onClick={() => triggerMorphState(true)}
          aria-label="Open Ask Lawrence AI Concierge"
          className={` group absolute inset-0 flex w-full cursor-pointer items-center justify-center gap-2.5 px-4 text-xs font-extrabold text-white transition-all duration-240 ${
            !isOpen
              ? "opacity-100 pointer-events-auto scale-100 blur-0"
              : "opacity-0 pointer-events-none scale-95 blur-[6px]"
          }`}
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime shadow-[0_0_10px_#b8ff01]" />
          </span>
          <span className="font-ui text-[13.5px] font-semibold tracking-[-0.02em] text-white group-hover:text-lime transition-colors whitespace-nowrap">
            Ask Lawrence AI
          </span>
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/20 font-mono text-[10px] font-black text-lime">
            ✦
          </span>
        </button>

        {/* =========================================================
            STATE 2: Expanded Concierge Card Layer (Open State)
            ========================================================= */}
        <div
          className={`absolute inset-0 flex flex-col justify-between transition-all duration-300 ${
            isOpen
              ? "opacity-100 pointer-events-auto scale-100 blur-0"
              : "opacity-0 pointer-events-none scale-95 blur-[6px]"
          }`}
        >
          {/* Header Bar */}
          <div className="border-b border-white/10 bg-[#111115] px-5 py-4 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-lime shadow-[0_0_14px_rgba(184,255,1,0.5)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/lawrence-face.jpg"
                    alt="Lawrence Cortes"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-ui text-sm font-black tracking-tight text-white">
                      Ask Lawrence AI
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-black">
                      ONLINE
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[11px] font-medium text-neutral-300">
                    Studio Concierge · Instant HR &amp; Tech Q&amp;A
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => triggerMorphState(false)}
                aria-label="Close Ask Lawrence AI"
                className="lc-bubble-chip flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/10 text-neutral-300 hover:border-lime hover:bg-lime hover:text-black transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* High-Contrast 1-Click Fast Prompts */}
            <div className="mt-3.5 flex flex-wrap gap-2 border-t border-white/10 pt-3">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label}
                  type="button"
                  disabled={isLoading}
                  onClick={() => sendMessageText(prompt.query)}
                  className="lc-bubble-chip flex items-center gap-1.5 cursor-pointer rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:border-lime hover:bg-lime hover:text-black transition-all disabled:opacity-50"
                >
                  <span>{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Feed (Starts completely empty as requested) */}
          <div className="flex-1 space-y-3.5 overflow-y-auto bg-[#070707] p-4 text-xs leading-relaxed text-neutral-200">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <span className="mb-1 px-1 font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                  {m.role === "user" ? "You" : "Ask Lawrence AI"}
                </span>
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-line shadow-md ${
                    m.role === "user"
                      ? "bg-lime font-semibold text-black"
                      : "border border-white/15 bg-[#141418] text-white"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="mb-1 px-1 font-mono text-[9px] font-bold uppercase tracking-wider text-lime">
                  Ask Lawrence AI
                </span>
                <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#141418] px-4 py-3 shadow-md">
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-lime"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-lime"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-lime"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="font-mono text-[10px] font-bold text-neutral-400 ml-1">
                    Analyzing portfolio records…
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Area */}
          <div className="border-t border-white/10 bg-[#111115] p-3.5 shrink-0">
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <div className="hidden">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={(token) => setTurnstileToken(token)}
                />
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, stack, or internship…"
                className="flex-1 rounded-full border border-white/20 bg-black/60 px-4 py-2.5 text-xs font-medium text-white placeholder:text-neutral-400 focus:border-lime focus:bg-black focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !input.trim() ||
                  (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !turnstileToken)
                }
                aria-label="Send message"
                className="lc-bubble-chip flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-lime text-black font-bold shadow-[0_0_14px_rgba(184,255,1,0.4)] hover:bg-white hover:text-black transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
