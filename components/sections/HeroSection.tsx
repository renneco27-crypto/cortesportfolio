"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GitFork, Shield, Video } from "lucide-react";
import dynamic from "next/dynamic";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), { ssr: false });

interface HeroSectionProps {
  headline: string;
  subheadline: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HeroSection({
  headline,
  subheadline,
  ctaPrimaryLabel,
  ctaPrimaryHref,
  ctaSecondaryLabel,
  ctaSecondaryHref,
}: HeroSectionProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const el = canvasRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * 16;
    const ry = (x - 0.5) * 20;
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    el.style.transition = "transform .08s ease";
  };

  const handleCanvasMouseLeave = () => {
    const el = canvasRef.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)";
    el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
  };

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "none";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "opacity .9s ease, transform 1s cubic-bezier(.22,1,.36,1)";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  }, []);

  return (
    <section id="hero" ref={heroRef} className="min-h-screen flex items-center pt-20 pb-16 px-6 bg-zinc-950">
      <div className="mx-auto max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <motion.span
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-mono text-violet-300 w-fit"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for internship 2025
          </motion.span>

          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight"
          >
            {headline}
          </motion.h1>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            className="text-lg text-zinc-400 leading-relaxed"
          >
            {subheadline}
          </motion.p>

          <motion.p
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="text-sm text-zinc-500 max-w-md"
          >
            Building full-stack experiences from Cebu, PH — Next.js, AI systems, and brand design.
          </motion.p>

          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="flex gap-3 flex-wrap">
            <a
              href={ctaPrimaryHref}
              className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
            >
              {ctaPrimaryLabel}
            </a>
            <a
              href={ctaSecondaryHref}
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 hover:border-violet-500 hover:text-white transition-colors"
            >
              {ctaSecondaryLabel}
            </a>
          </motion.div>

          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-3">
            <a
              href="https://github.com/corteslawrence027-art/CORTES-Engineering-Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 hover:text-violet-400 hover:border-violet-400 transition-colors"
            >
              <GitFork size={12} /> CORTES Engineering Portfolio
            </a>
            <span className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400">
              <Shield size={12} /> CS fundamentals
            </span>
            <span className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400">
              <Video size={12} /> Content creator
            </span>
          </motion.div>
        </div>

        <div
          ref={canvasRef}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <HeroCanvas />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
