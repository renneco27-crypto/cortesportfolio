"use client";

import React, { useState, useEffect } from "react";

export default function EditorialHero() {
  const [terminalText, setTerminalText] = useState("");
  const fullText = "$ system.init() — ready for full-stack & cloud deployment";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTerminalText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[85vh] flex flex-col justify-center items-center text-center px-6 md:px-16 z-10 select-none">
      <div className="flex flex-col items-center max-w-4xl">
        <div className="font-mono text-xs md:text-sm tracking-[3px] uppercase text-[#e63946] mb-3 md:mb-4">
          ENGINEERING PORTFOLIO // 2026
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-tight text-white mb-3">
          Lawrence Cortes
        </h1>

        <div className="text-xs sm:text-sm md:text-base text-[#666666] tracking-[2px] uppercase mb-8">
          Full-Stack Web Systems &bull; Cloud Infrastructure &bull; UI/UX Architecture
        </div>

        {/* Terminal Line with Left Border & Blinker */}
        <div className="inline-flex items-center font-mono text-xs sm:text-sm md:text-base text-[#cccccc] bg-transparent border-l-2 border-[#333333] pl-4 py-2">
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
