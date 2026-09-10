"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export default function EditorialAbout() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const items = el.querySelectorAll(".reveal-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#050505]/75 backdrop-blur-sm text-white py-20 px-6 md:px-16 border-t border-[#1a1a1a] select-none"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="reveal-item flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-[#1c1c1c]">
          <div>
            <span className="font-mono text-xs tracking-widest text-[#e63946] uppercase block mb-2">
              [ 01 // ABOUT LAWRENCE CORTES ]
            </span>
            <h2 className="text-3xl md:text-5xl font-light uppercase tracking-tight">
              Developer by code. Designer by eye.
            </h2>
          </div>
          <div className="font-mono text-xs text-[#777] mt-4 md:mt-0 uppercase">
            FULL-STACK &amp; DESIGN DISCIPLINE
          </div>
        </div>

        {/* Biography & Portrait Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Portrait Column */}
          <div className="lg:col-span-4 reveal-item">
            <div className="relative w-full aspect-square max-w-[340px] mx-auto lg:mx-0 overflow-hidden rounded-[2px] border border-[#262626] bg-[#0d0d0d] shadow-2xl">
              <Image
                src="/images/lawrence-face.jpg"
                alt="Lawrence Cortes"
                fill
                sizes="(max-width: 768px) 100vw, 340px"
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Biography Narrative Column */}
          <div className="lg:col-span-8 space-y-6 text-[#b0b0b0] font-light text-base md:text-lg leading-relaxed reveal-item">
            <p>
              I&apos;m <strong className="text-white font-medium">Lawrence Cortes</strong>, a BS Information
              Technology student based in Ormoc City, Leyte, Philippines. I pair full-stack development — React,
              Next.js, Node.js, REST APIs — with the documentation discipline I built supporting a government accounting
              office: precise, organized, and built to hold up under process.
            </p>
            <p>
              Currently pursuing internship opportunities where I can apply full-stack development, cloud
              fundamentals, and steady, detail-first execution to a real product team.
            </p>
            <p className="text-sm text-[#888] font-mono border-l-2 border-[#e63946] pl-4 pt-1">
              &ldquo;Obsessed with secure, maintainable, and thoughtful solutions. Engineering business outcomes with speed and precision.&rdquo;
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .reveal-item {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .reveal-item.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-item {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
