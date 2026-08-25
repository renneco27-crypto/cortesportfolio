"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mail, Send, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

interface EditorialContactProps {
  contactTurnstileToken: string | null;
  setContactTurnstileToken: (token: string | null) => void;
  contactSubmissionsLeft: number | null;
}

export default function EditorialContact({
  contactTurnstileToken,
  setContactTurnstileToken,
  contactSubmissionsLeft,
}: EditorialContactProps) {
  const [form, setForm] = useState({ senderName: "", senderEmail: "", messageBody: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string }>({
    type: "success",
    text: "",
  });

  const turnstileContainerRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!contactTurnstileToken) {
      setFeedback({ type: "error", text: "Please wait for human verification to complete." });
      return;
    }
    setStatus("sending");
    setFeedback({ type: "success", text: "" });

    const tokenToSend = contactTurnstileToken;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (w.turnstile) w.turnstile.reset();
    } catch {
      /* ignore */
    }
    setContactTurnstileToken(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: form.senderName,
          senderEmail: form.senderEmail,
          messageBody: form.messageBody,
          turnstileToken: tokenToSend,
        }),
      });

      const data = await res.json();

      if (data.limitReached) {
        setStatus("error");
        setFeedback({ type: "error", text: data.message ?? "Daily limit reached." });
        return;
      }

      if (!res.ok || !data.success) {
        setStatus("error");
        setFeedback({ type: "error", text: data.message ?? "Failed to send message." });
        return;
      }

      setStatus("success");
      setFeedback({ type: "success", text: data.message ?? "Message dispatched successfully." });
      setForm({ senderName: "", senderEmail: "", messageBody: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setFeedback({ type: "error", text: "Failed to dispatch message. Please retry shortly." });
    }
  }

  return (
    <section id="contact" className="relative w-full bg-[#050505] text-white py-24 px-6 md:px-16 border-t border-[#1a1a1a] select-none">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 pb-6 border-b border-[#1c1c1c]">
        <div>
          <span className="font-mono text-xs tracking-widest text-[#e63946] uppercase block mb-2">
            [ 04 // COMMUNICATION PROTOCOL ]
          </span>
          <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tight">
            Initiate Contact
          </h2>
        </div>
        <div className="font-mono text-xs text-[#777] mt-4 md:mt-0 uppercase">
          DIRECT LINE FOR HIGH-IMPACT INQUIRIES
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Direct Info & Editorial Sheet */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 bg-[#090909] border border-[#222] rounded-[2px] space-y-6">
            <div className="font-mono text-xs tracking-widest text-[#e63946] uppercase">
              // TELEMETRY &amp; LOCATION
            </div>

            <div>
              <div className="font-mono text-xs text-[#777] uppercase">NAME</div>
              <div className="text-xl font-medium text-white">Lawrence Manzo Cortes</div>
            </div>

            <div>
              <div className="font-mono text-xs text-[#777] uppercase">COORDINATES</div>
              <div className="text-base text-[#ccc]">Cebu / Ormoc City, Leyte, Philippines 🇵🇭</div>
            </div>

            <div>
              <div className="font-mono text-xs text-[#777] uppercase">EMAIL</div>
              <a
                href="mailto:renneco27@gmail.com"
                className="text-base text-white hover:text-[#e63946] transition-colors"
              >
                renneco27@gmail.com
              </a>
            </div>

            <div className="pt-4 border-t border-[#1c1c1c] flex items-center gap-4">
              <a
                href="https://github.com/renneco27-crypto"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#888] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/lawrence-cortes-946467332/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#888] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {contactSubmissionsLeft !== null && (
            <div className="font-mono text-xs text-[#666] border-l-2 border-[#333] pl-4">
              SUBMISSIONS REMAINING TODAY: <span className="text-white font-bold">{contactSubmissionsLeft}</span>
            </div>
          )}
        </div>

        {/* Right Column: High-Contrast Monochromatic Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="p-8 bg-[#0a0a0a] border border-[#222] space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-[#888] block">
                  Sender Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.senderName}
                  onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-[#141414] border border-[#2c2c2c] focus:border-white text-white px-4 py-3 text-sm font-light outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-[#888] block">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.senderEmail}
                  onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
                  placeholder="e.g. alex@company.com"
                  className="w-full bg-[#141414] border border-[#2c2c2c] focus:border-white text-white px-4 py-3 text-sm font-light outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-wider text-[#888] block">
                Transmission / Message *
              </label>
              <textarea
                required
                rows={5}
                value={form.messageBody}
                onChange={(e) => setForm({ ...form, messageBody: e.target.value })}
                placeholder="Describe your engineering requirements, project timeline, or questions..."
                className="w-full bg-[#141414] border border-[#2c2c2c] focus:border-white text-white px-4 py-3 text-sm font-light outline-none transition-colors resize-none"
              />
            </div>

            {/* Cloudflare Turnstile human verification container */}
            <div className="pt-2">
              <div
                ref={turnstileContainerRef}
                className="cf-turnstile"
                data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA"}
                data-callback="onContactTurnstileSuccess"
                data-expired-callback="onContactTurnstileExpired"
                data-theme="dark"
              />
            </div>

            {/* Feedback Message */}
            {feedback.text && (
              <div
                className={`p-4 font-mono text-xs flex items-center gap-2.5 ${
                  feedback.type === "success"
                    ? "bg-[#0d2818] border border-[#1b4332] text-[#74c69d]"
                    : "bg-[#2d0004] border border-[#590d22] text-[#ff8fa3]"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#1c1c1c] flex justify-between items-center">
              <button
                type="submit"
                disabled={status === "sending"}
                className="font-mono text-xs uppercase tracking-widest bg-white hover:bg-[#ccc] text-black font-bold px-8 py-3.5 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                {status === "sending" ? (
                  <span>TRANSMITTING...</span>
                ) : (
                  <>
                    <span>SEND TRANSMISSION</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <span className="font-mono text-[0.7rem] text-[#555] hidden sm:inline-block">
                END-TO-END VERIFIED
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
