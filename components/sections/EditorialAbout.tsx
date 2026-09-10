"use client";

import React, { useEffect, useRef } from "react";
import { CheckCircle2, Clock, Award, ShieldCheck, Cpu } from "lucide-react";

const credentials = [
  { label: "Microsoft Applied Skills / Azure Fundamentals", body: "Microsoft", status: "completed" },
  { label: "Cloud Skill Badges & Career Certificate", body: "Google Cloud", status: "completed" },
  { label: "Intro to Cybersecurity · Python Essentials", body: "Cisco Networking Academy", status: "completed" },
  { label: "Civil Service Exam Passer", body: "Civil Service Commission", status: "completed" },
  { label: "CSS NC II Training Certificate", body: "TESDA", status: "completed" },
  { label: "Program Security Path", body: "pwn.college", status: "in-progress" },
  { label: "AWS Certified Cloud Practitioner", body: "Amazon Web Services", status: "planned" },
];

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
      className="relative w-full bg-[#050505] text-white py-24 px-6 md:px-16 border-t border-[#1a1a1a] select-none"
    >
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="reveal-item flex flex-col md:flex-row justify-between items-start md:items-end pb-8 border-b border-[#1c1c1c]">
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

        {/* Bio Grid & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Narrative */}
          <div className="lg:col-span-7 space-y-6 text-[#b0b0b0] font-light text-base md:text-lg leading-relaxed reveal-item">
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

          {/* Precision Metric Cards (from lawrence.html) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 reveal-item">
            <div className="bg-[#090909] border border-[#222] p-5 rounded-[2px] hover:border-[#444] transition-colors">
              <div className="font-mono text-3xl font-bold text-white tracking-tight">98%</div>
              <div className="text-xs uppercase font-mono text-[#888] mt-1">Task Accuracy &amp; Quality</div>
            </div>
            <div className="bg-[#090909] border border-[#222] p-5 rounded-[2px] hover:border-[#444] transition-colors">
              <div className="font-mono text-3xl font-bold text-white tracking-tight">100%</div>
              <div className="text-xs uppercase font-mono text-[#888] mt-1">On-time Delivery Record</div>
            </div>
            <div className="bg-[#090909] border border-[#222] p-5 rounded-[2px] hover:border-[#444] transition-colors">
              <div className="font-mono text-3xl font-bold text-white tracking-tight">20+</div>
              <div className="text-xs uppercase font-mono text-[#888] mt-1">Production Tools &amp; Languages</div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Engineering Execution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Proposition 1 */}
          <div className="reveal-item bg-[#090909] border border-[#222] p-8 flex flex-col justify-between hover:border-[#555] transition-colors">
            <div>
              <div className="font-mono text-3xl text-white mb-4">01.</div>
              <h3 className="text-xl font-medium tracking-tight mb-3 uppercase">Speed to Market</h3>
              <p className="text-[#a0a0a0] text-sm font-light leading-relaxed">
                Rapidly prototyping and deploying production-ready systems using Next.js, Vercel, and modern CI/CD pipelines to validate concepts faster.
              </p>
            </div>
            <div className="mt-8 font-mono text-[0.7rem] text-[#e63946] uppercase tracking-widest border-t border-[#1c1c1c] pt-4">
              [ ACCELERATED DEPLOYMENT ]
            </div>
          </div>

          {/* Proposition 2 */}
          <div className="reveal-item bg-[#090909] border border-[#222] p-8 flex flex-col justify-between hover:border-[#555] transition-colors">
            <div>
              <div className="font-mono text-3xl text-white mb-4">02.</div>
              <h3 className="text-xl font-medium tracking-tight mb-3 uppercase">Scalable Architecture</h3>
              <p className="text-[#a0a0a0] text-sm font-light leading-relaxed">
                Building resilient backend systems with PostgreSQL, Redis, and type-safe APIs that handle high-throughput traffic without degradation.
              </p>
            </div>
            <div className="mt-8 font-mono text-[0.7rem] text-[#f4a261] uppercase tracking-widest border-t border-[#1c1c1c] pt-4">
              [ ZERO-DOWNTIME INFRASTRUCTURE ]
            </div>
          </div>

          {/* Proposition 3 */}
          <div className="reveal-item bg-[#090909] border border-[#222] p-8 flex flex-col justify-between hover:border-[#555] transition-colors">
            <div>
              <div className="font-mono text-3xl text-white mb-4">03.</div>
              <h3 className="text-xl font-medium tracking-tight mb-3 uppercase">Lead Capture &amp; ROI</h3>
              <p className="text-[#a0a0a0] text-sm font-light leading-relaxed">
                Designing conversion-optimized landing pages and intelligent AI chatbots that reduce CPA by 30% and significantly increase user engagement.
              </p>
            </div>
            <div className="mt-8 font-mono text-[0.7rem] text-[#9b2226] uppercase tracking-widest border-t border-[#1c1c1c] pt-4">
              [ REVENUE OPTIMIZATION ]
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="reveal-item w-full">
          <h3 className="font-mono text-xs text-[#888] tracking-widest uppercase mb-6 border-b border-[#1c1c1c] pb-2 flex items-center justify-between">
            <span>// RECORD CREDENTIALS &amp; CERTIFICATIONS</span>
            <span className="text-[#555]">VERIFIED TRACK RECORD</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {credentials.map((cert, i) => (
              <div key={i} className="flex flex-col justify-between p-5 bg-[#0a0a0a] border border-[#222] hover:border-[#444] transition-colors">
                <div className="mb-4">
                  <div className="text-sm font-medium text-white leading-tight mb-1">{cert.label}</div>
                  <div className="font-mono text-[0.65rem] text-[#777] uppercase">{cert.body}</div>
                </div>
                <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase">
                  {cert.status === "completed" ? (
                    <div className="flex items-center gap-1.5 text-[#34d399]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed / Verified</span>
                    </div>
                  ) : cert.status === "in-progress" ? (
                    <div className="flex items-center gap-1.5 text-[#f4a261]">
                      <div className="w-1.5 h-1.5 bg-[#f4a261] rounded-full animate-pulse"></div>
                      <span>In Progress</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#666]">
                      <Clock className="w-3 h-3 text-[#555]" />
                      <span>Planned / Roadmap</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
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
