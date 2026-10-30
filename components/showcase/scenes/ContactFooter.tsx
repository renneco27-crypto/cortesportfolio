// components/showcase/scenes/ContactFooter.tsx
// Layer 4 – dark footer that slides up last: giant LAWRENCE + script "Cortes",
// a working contact form (POST /api/contact) and chapter links.
"use client";

import React, { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Send, Download, ArrowUpRight } from "lucide-react";
import Github from "../svg/GithubMark";
import { chapters } from "@/data/showcase";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface ContactFooterProps {
  message: string;
  onMessageChange: (v: string) => void;
  onJump: (p: number) => void;
}

export default function ContactFooter({ message, onMessageChange, onJump }: ContactFooterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

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
          // Without a site key (local dev) the API skips verification when TURNSTILE_SECRET is unset.
          turnstileToken: SITE_KEY ? token : "dev-no-turnstile",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setFeedback(data.message ?? data.error ?? "Failed to send message.");
        return;
      }
      setStatus("success");
      setFeedback(data.message ?? "Message sent. Talk soon!");
      setName("");
      setEmail("");
      onMessageChange("");
    } catch {
      setStatus("error");
      setFeedback("Network error. Please retry shortly.");
    }
  }

  const input =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-lime/70";

  return (
    <footer
      id="contact"
      className="js-footer lc-gpu absolute inset-0 z-40 flex flex-col overflow-y-auto bg-[#121212] px-6 pb-20 pt-20 text-white sm:px-12"
      style={{ transform: "translateY(100%)" }}
    >
      <div className="mx-auto my-auto w-full max-w-[1440px]">
        <div className="relative flex items-center justify-center border-b border-white/10 py-6 sm:justify-start sm:py-8">
          <h2 className="font-ui text-[19vw] font-extrabold uppercase leading-[0.82] tracking-[-0.045em] text-white sm:text-[150px] lg:text-[210px]">
            Lawrence
          </h2>
          <span className="js-footer-script font-script pointer-events-none absolute -bottom-4 right-2 -rotate-6 text-[15vw] font-bold text-lime drop-shadow-[0_6px_28px_rgba(184,255,1,0.5)] sm:-bottom-2 sm:right-10 sm:text-[110px] lg:right-16 lg:text-[160px]">
            Cortes
          </span>
        </div>

        <div className="grid grid-cols-1 gap-10 py-10 lg:grid-cols-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:col-span-6">
            <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Start a project / internship chat</span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input className={input} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} aria-label="Your name" />
              <input className={input} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={150} aria-label="Email" />
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
            {SITE_KEY && <Turnstile siteKey={SITE_KEY} onSuccess={setToken} options={{ theme: "dark", size: "flexible" }} />}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-xs font-bold text-black transition hover:brightness-110 disabled:opacity-60"
              >
                <Send className="h-3.5 w-3.5" />
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              <p aria-live="polite" className={`text-xs ${status === "error" ? "text-[#ff6b81]" : "text-lime"}`}>
                {feedback}
              </p>
            </div>
          </form>

          <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3 lg:col-span-6">
            <div className="flex flex-col gap-2.5">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Explore</span>
              {chapters.map((c) => (
                <button key={c.id} type="button" onClick={() => onJump(c.p)} className="text-left text-neutral-300 transition-colors hover:text-lime">
                  {c.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Elsewhere</span>
              <a href="https://github.com/renneco27-crypto" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-neutral-300 transition-colors hover:text-lime">
                <Github /> GitHub
              </a>
              <a href="/api/resume/download" className="inline-flex items-center gap-1.5 text-neutral-300 transition-colors hover:text-lime">
                <Download className="h-3.5 w-3.5" /> Résumé (PDF)
              </a>
              <a href="/projects" className="inline-flex items-center gap-1.5 text-neutral-300 transition-colors hover:text-lime">
                <ArrowUpRight className="h-3.5 w-3.5" /> All projects
              </a>
            </div>
            <div className="flex flex-col gap-2.5">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">Based in</span>
              <span className="text-neutral-300">Ormoc City, Leyte</span>
              <span className="text-neutral-300">Philippines · GMT+8</span>
              <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-lime/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-lime">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" /> Open to internships
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Lawrence Cortes. Designed &amp; built by hand, signed in lime.</p>
          <p>Next.js · GSAP ScrollTrigger · DrawSVG</p>
        </div>
      </div>
    </footer>
  );
}
