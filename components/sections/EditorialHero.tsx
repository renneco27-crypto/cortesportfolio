"use client";

import React, { useState, useEffect } from "react";

export default function EditorialHero() {
  const [terminalText, setTerminalText] = useState("");
  const fullText = "$ system.init() — ready for full-stack deployment";

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
    <section className="relative w-full h-[80vh] flex flex-col justify-center items-center text-center px-6 md:px-16 z-10 select-none">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white uppercase mb-4 max-w-4xl">
          LAWRENCE MANZO CORTES
        </h1>

        <div className="text-xs md:text-sm text-[#888888] tracking-[2px] uppercase mb-8 max-w-2xl">
          FULL-STACK DEVELOPER &amp; BRAND DESIGNER / WEB SYSTEMS ENGINEERING
        </div>

        {/* Inline Terminal Blinker (No popup div) */}
        <div className="inline-flex items-center font-mono text-sm md:text-base text-[#cccccc] bg-transparent border-l-2 border-[#333] pl-4 py-2">
          <span>{terminalText}</span>
          <span className="inline-block w-2.5 h-[1.1em] bg-white ml-2 animate-[blink_1s_step-end_infinite]"></span>
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
