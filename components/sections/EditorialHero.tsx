"use client";

import React, { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";

export default function EditorialHero() {
  const [terminalText, setTerminalText] = useState("");
  const fullText = "$ system.init() — architectural engineering systems active.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTerminalText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between pt-24 pb-12 px-6 md:px-16 z-10 select-none">
      {/* Top Editorial Metadata Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-xs font-mono tracking-widest text-[#777777] border-b border-[#1c1c1c] pb-4">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-[#e63946] animate-pulse"></span>
          <span>SYSTEM: DISTRIBUTED FULL-STACK &amp; EMBEDDED ARCHITECTURE</span>
        </div>
        <div className="mt-2 md:mt-0 uppercase text-[#555]">
          VOL. 04 / EDITION 2026 — PHILIPPINES / GLOBAL
        </div>
      </div>

      {/* Center Editorial Title & Monospace Blinker */}
      <div className="my-auto max-w-6xl">
        <div className="text-xs md:text-sm font-mono uppercase tracking-[3px] text-[#e63946] mb-3">
          [ 01 // PRINCIPAL ENGINEER &amp; ARCHITECT ]
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-[-0.04em] text-white leading-[0.92] uppercase">
          Lawrence <br />
          <span className="font-semibold text-[#ececec]">Manzo Cortes</span>
        </h1>

        <p className="mt-6 text-base md:text-xl font-light text-[#999999] max-w-2xl leading-relaxed">
          Crafting resilient distributed applications, real-time node architectures, and brutalist high-performance user interfaces.
        </p>

        {/* Inline Terminal Blinker (No popup div) */}
        <div className="mt-8 inline-flex items-center font-mono text-xs md:text-sm text-[#cccccc] bg-[#0c0c0c]/80 border-l-2 border-[#e63946] px-4 py-2.5 backdrop-blur-sm">
          <span>{terminalText}</span>
          <span className="inline-block w-2 h-4 bg-white ml-1.5 animate-[pulse_1s_infinite]"></span>
        </div>
      </div>

      {/* Bottom Editorial Grid Bar & Scroll Cue */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#1c1c1c] pt-6 text-xs font-mono text-[#666]">
        <div>
          <span className="text-white block font-bold">CORE DOMAIN</span>
          Distributed Systems &amp; Web
        </div>
        <div>
          <span className="text-white block font-bold">PARADIGM</span>
          Swiss Grid &amp; Kinetic Motion
        </div>
        <div>
          <span className="text-white block font-bold">STATUS</span>
          Available for High-Impact Roles
        </div>
        <div className="flex items-center justify-end">
          <a
            href="#stack"
            className="flex items-center gap-2 text-white hover:text-[#e63946] transition-colors"
          >
            <span>EXPLORE MANIFESTO</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
