"use client";

import React, { useState, useEffect, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Sparkles, Send, X, Layers, Briefcase, Award, Code2 } from "lucide-react";

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
  const [hasMounted, setHasMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

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

      const replyContent = data.reply || localPreset || "I'm trained on Lawrence's full-stack architecture, 8+ shipped builds, and 2026 internship availability. Ask me about his tech stack, projects, or availability!";

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
          content: localPreset || "I'm Lawrence's Studio AI Concierge. I can give you full details on his Next.js builds, Python projects, Civil Service credentials, and 2026 internship availability!",
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
    <div className="fixed bottom-4 right-4 z-[85] flex flex-col items-end sm:bottom-6 sm:right-6">
      {/* Expanded Chat Dialog Modal (Floats Above the Persistent Trigger Pill) */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Ask Lawrence AI Concierge"
          className="mb-3 flex max-h-[min(620px,82vh)] w-[min(440px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#0d0d10]/95 text-white shadow-[0_32px_90px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.1)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4"
        >
          {/* Header Bar */}
          <div className="border-b border-white/10 bg-[#141418] px-5 py-4">
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
                onClick={() => setIsOpen(false)}
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

          {/* Messages Feed */}
          <div className="flex-1 space-y-3.5 overflow-y-auto bg-[#0a0a0c] p-4 text-xs leading-relaxed text-neutral-200">
            {/* Initial Rich Informative Greeting */}
            <div className="rounded-2xl border border-white/15 bg-[#141418] p-4 text-neutral-100 shadow-md">
              <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-wider text-lime">
                <Sparkles className="h-3.5 w-3.5" />
                <span>LAWRENCE CORTES · AI CONCIERGE</span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">
                Welcome to Lawrence&apos;s Portfolio &amp; Technical Dossier
              </h4>
              <p className="text-neutral-300 text-xs leading-relaxed mb-3">
                I&apos;m trained directly on Lawrence&apos;s full-stack architecture, 8+ shipped software projects, civil service credentials, and 2026 internship availability.
              </p>
              
              <div className="space-y-1.5 rounded-xl border border-white/10 bg-black/40 p-2.5 font-mono text-[11px] text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="text-lime font-bold">• Status:</span>
                  <span className="text-white font-semibold">Available for 2026 Internships</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lime font-bold">• Core:</span>
                  <span className="text-neutral-200">Next.js 15 · TypeScript · Python · GSAP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lime font-bold">• College:</span>
                  <span className="text-neutral-200">ACLC College Ormoc (BSIT)</span>
                </div>
              </div>
            </div>

            {/* Conversation Messages */}
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
          <div className="border-t border-white/10 bg-[#121216] p-3.5">
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
      )}

      {/* Persistent Floating Trigger Pill ("Ask Lawrence AI" NEVER disappears) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Ask Lawrence AI" : "Open Ask Lawrence AI Concierge"}
        className={`lc-elastic-pill group flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2.5 text-xs font-extrabold shadow-[0_16px_36px_rgba(0,0,0,0.55)] transition-all ${
          isOpen
            ? "border-lime bg-black text-white hover:bg-neutral-900"
            : "border-white/20 bg-[#121214] text-white hover:border-lime hover:bg-black"
        }`}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime shadow-[0_0_10px_#b8ff01]" />
        </span>
        <span className="font-ui tracking-tight text-white group-hover:text-lime transition-colors">
          Ask Lawrence AI
        </span>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full font-mono text-[10px] font-black transition-all ${
            isOpen ? "bg-red-500/20 text-red-400 rotate-90" : "bg-lime/20 text-lime"
          }`}
        >
          {isOpen ? "✕" : "✦"}
        </span>
      </button>
    </div>
  );
}