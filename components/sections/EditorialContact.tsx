"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

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

export default function EditorialContact() {
  const [form, setForm] = useState({ senderName: "", senderEmail: "", messageBody: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string }>({
    type: "success",
    text: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setFeedback({ type: "success", text: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: form.senderName,
          senderEmail: form.senderEmail,
          messageBody: form.messageBody,
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
    <section id="contact" className="relative w-full bg-[#050505] text-white py-20 px-6 md:px-16 border-t border-[#1a1a1a] select-none">
      {/* Editorial Header */}
      <div className="max-w-6xl mx-auto mb-14 pb-6 border-b border-[#1c1c1c] flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <span className="font-mono text-xs tracking-widest text-[#e63946] uppercase block mb-2">
            [ 03 // COMMUNICATION PROTOCOL ]
          </span>
          <h2 className="text-3xl md:text-5xl font-light uppercase tracking-tight">
            Initiate Contact
          </h2>
        </div>
        <div className="font-mono text-xs text-[#777] mt-4 md:mt-0 uppercase">
          DIRECT LINE FOR HIGH-IMPACT INQUIRIES
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Direct Info Sheet */}
        <div className="lg:col-span-5 flex flex-col justify-between p-8 bg-[#090909] border border-[#222] rounded-[2px] space-y-6">
          <div className="space-y-6">
            <div className="font-mono text-xs tracking-widest text-[#e63946] uppercase">
              // TELEMETRY &amp; LOCATION
            </div>

            <div>
              <div className="font-mono text-xs text-[#777] uppercase mb-1">NAME</div>
              <div className="text-lg font-medium text-white">Lawrence Manzo Cortes</div>
            </div>

            <div>
              <div className="font-mono text-xs text-[#777] uppercase mb-1">COORDINATES</div>
              <div className="text-sm text-[#ccc]">Cebu / Ormoc City, Leyte, Philippines 🇵🇭</div>
            </div>

            <div>
              <div className="font-mono text-xs text-[#777] uppercase mb-1">EMAIL</div>
              <a
                href="mailto:renneco27@gmail.com"
                className="text-sm text-white hover:text-[#e63946] transition-colors"
              >
                renneco27@gmail.com
              </a>
            </div>
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

        {/* Right Column: High-Contrast Monochromatic Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="p-8 bg-[#090909] border border-[#222] rounded-[2px] flex flex-col gap-6">
            {/* Top Row: Sender Name & Email Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-mono text-xs uppercase tracking-wider text-[#888] mb-2">
                  Sender Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.senderName}
                  onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-[#141414] border border-[#2c2c2c] focus:border-white text-white px-4 py-3 text-sm font-light outline-none transition-colors rounded-[2px]"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-mono text-xs uppercase tracking-wider text-[#888] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={form.senderEmail}
                  onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
                  placeholder="e.g. alex@company.com"
                  className="w-full bg-[#141414] border border-[#2c2c2c] focus:border-white text-white px-4 py-3 text-sm font-light outline-none transition-colors rounded-[2px]"
                />
              </div>
            </div>

            {/* Bottom Row: Transmission Message */}
            <div className="flex flex-col">
              <label className="font-mono text-xs uppercase tracking-wider text-[#888] mb-2">
                Transmission / Message *
              </label>
              <textarea
                required
                rows={5}
                value={form.messageBody}
                onChange={(e) => setForm({ ...form, messageBody: e.target.value })}
                placeholder="Describe your engineering requirements, project timeline, or questions..."
                className="w-full bg-[#141414] border border-[#2c2c2c] focus:border-white text-white px-4 py-3 text-sm font-light outline-none transition-colors resize-none rounded-[2px]"
              />
            </div>

            {/* Feedback Message */}
            {feedback.text && (
              <div
                className={`p-4 font-mono text-xs flex items-center gap-2.5 rounded-[2px] ${
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
                className="btn-cta bg-white text-black hover:bg-[#d4d4d8] font-bold px-8 py-3 text-xs tracking-widest cursor-pointer disabled:opacity-50"
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
