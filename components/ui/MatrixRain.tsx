"use client";
import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = () => document.documentElement.classList.contains("dark");

    const updateOpacity = () => {
      const aboutEl = document.getElementById("about");
      const devEl = document.getElementById("developer");
      if (!aboutEl || !devEl) return;

      const aboutBottom = aboutEl.getBoundingClientRect().bottom;
      const devTop = devEl.getBoundingClientRect().top;
      const sectionDistance = devTop - aboutBottom;

      let progress = 0;
      if (sectionDistance > 0) {
        progress = Math.max(0, Math.min(1, -aboutBottom / sectionDistance));
      }

      const dark = isDark();
      const minOpacity = dark ? 0.10 : 0.30;
      const maxOpacity = dark ? 0.25 : 0.72;

      canvas.style.opacity = String(maxOpacity - (maxOpacity - minOpacity) * progress);
    };

    updateOpacity();
    window.addEventListener("scroll", updateOpacity, { passive: true });

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new MutationObserver(() => updateOpacity());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const cols = Math.floor(canvas.width / 20);
    const drops: number[] = Array(cols).fill(1);

    const getMountainY = (x: number, w: number) => {
      const cx   = w / 2;
      const peak = canvas.height * 0.28;
      const base = canvas.height * 0.62;
      const dist = Math.abs(x - cx) / (w / 2);
      const ridge1 = peak + dist * (base - peak) * 1.1;
      const ridge2 = peak * 1.3 + Math.abs(x - cx * 0.5) / (w / 2) * (base - peak * 1.3) * 1.2;
      return Math.min(ridge1, ridge2);
    };

    const chars = "アイウエオカキクケコ01アBCDEFGHIJKLMNOPQRSTUVWXYZ∇∆∑∏∂";

    let raf: number;
    const draw = () => {
      const dark = isDark();

      ctx.fillStyle = dark
        ? "rgba(10,10,15,0.06)"
        : "rgba(237,233,254,0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const x         = i * 20;
        const mountainY = getMountainY(x, canvas.width);
        const pxY       = y * 20;

        if (pxY > mountainY && pxY < canvas.height * 0.65) {
          drops[i] = 0;
          return;
        }

        const headAlpha = Math.random() > 0.95 ? 1 : 0.9;
        ctx.fillStyle = dark
          ? `rgba(167,139,250,${headAlpha})`
          : `rgba(79,70,229,${headAlpha})`;

        ctx.font = `${Math.random() > 0.9 ? 15 : 13}px 'JetBrains Mono', monospace`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, pxY);

        const trailAlpha = 0.22 + Math.random() * 0.35;
        ctx.fillStyle = dark
          ? `rgba(124,58,237,${trailAlpha})`
          : `rgba(139,92,246,${trailAlpha + 0.2})`;

        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, pxY - 20);

        if (pxY > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateOpacity);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        0,
        pointerEvents: "none",
        opacity:       0,
      }}
    />
  );
}
