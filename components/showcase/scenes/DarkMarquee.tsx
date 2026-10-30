// components/showcase/scenes/DarkMarquee.tsx
// Layer 1 – dark stage behind the shrinking hero, with scroll-scrubbed type rows.
import React from "react";

function Row({ className, startWithScript }: { className: string; startWithScript?: boolean }) {
  const words = Array.from({ length: 8 }, (_, i) => (i % 2 === 0) !== !!startWithScript);
  return (
    <div className={`${className} flex items-center gap-10 whitespace-nowrap will-change-transform`}>
      {words.map((solid, i) =>
        solid ? (
          <span key={i} className="font-ui text-[22vw] font-black leading-none tracking-tight text-white sm:text-[140px] lg:text-[170px]">
            Lawrence
          </span>
        ) : (
          <span key={i} className="font-script lc-script-outline text-[22vw] font-bold leading-none sm:text-[140px] lg:text-[170px]">
            Cortes
          </span>
        )
      )}
    </div>
  );
}

export default function DarkMarquee() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center" aria-hidden="true">
      <div className="js-buddy-header absolute top-20 text-center opacity-0 sm:top-24">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-neutral-400">The Build</span>
        <span className="mt-0.5 block text-sm font-black uppercase tracking-[0.22em] text-white sm:text-base">Buddy</span>
      </div>

      <div className="js-marquee flex w-full select-none flex-col gap-3 opacity-0">
        <Row className="js-row-top" />
        <Row className="js-row-bottom -mt-6" startWithScript />
      </div>

      <p className="js-buddy-bio absolute bottom-24 max-w-md px-6 text-center text-xs font-medium leading-relaxed text-neutral-400 opacity-0 sm:text-sm">
        I&apos;m Lawrence, an IT student from Ormoc City building{" "}
        <span className="text-white">full-stack products</span>, <span className="text-white">brand systems</span> and{" "}
        <span className="text-lime">AI tools</span> that people actually enjoy using.
      </p>
    </div>
  );
}
