"use client";

import React, { useState, useEffect } from "react";

export default function EditorialHero() {
  const [terminalText, setTerminalText] = useState("");
  const fullText = "$ status: seeking internship — ready to learn, build & contribute";
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [isShiftedUp, setIsShiftedUp] = useState<boolean>(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTerminalText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[85vh] flex flex-col justify-center items-center text-center px-6 md:px-16 z-10 select-none">
      {/* High-Contrast Backdrop Container - Click to toggle slide up / down */}
      <div
        onClick={() => setIsShiftedUp((prev) => !prev)}
        className={`relative flex flex-col items-center max-w-4xl px-8 md:px-12 py-10 rounded-2xl bg-black/55 backdrop-blur-[8px] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.85)] cursor-pointer transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-white/20 active:scale-[0.99] ${
          isShiftedUp ? "-translate-y-28 md:-translate-y-40" : "translate-y-0"
        }`}
        title="Click to toggle position"
      >
        <div className="font-mono text-xs md:text-sm tracking-[3px] uppercase text-[#ff4d5a] font-semibold mb-3 md:mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          ENGINEERING PORTFOLIO — {currentYear}
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-normal tracking-tight text-white mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
          Lawrence Cortes
        </h1>

        <div className="text-xs sm:text-sm md:text-base text-zinc-200 font-medium tracking-[2px] uppercase mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          IT Student &bull; Full-Stack Developer &bull; Seeking Software Internship
        </div>

        {/* High-Legibility Terminal Pill */}
        <div className="inline-flex items-center font-mono text-xs sm:text-sm md:text-base text-zinc-100 bg-black/70 border border-zinc-700/70 px-5 py-2.5 rounded-lg shadow-xl backdrop-blur-md">
          <span>{terminalText}</span>
          <span className="inline-block w-[9px] h-[1em] bg-white ml-2 align-middle animate-[blink_1s_step-end_infinite]"></span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}
