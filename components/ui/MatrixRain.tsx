"use client";
import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = Math.floor(canvas.width / 20);
    const drops: number[] = Array(cols).fill(1);

    // Mountain silhouette — y threshold per column (lower = taller mountain)
    const getMountainY = (x: number, w: number) => {
      const cx = w / 2;
      const peak = canvas.height * 0.28;
      const base = canvas.height * 0.62;
      const dist = Math.abs(x - cx) / (w / 2);
      // Two ridges for a range feel
      const ridge1 = peak + dist * (base - peak) * 1.1;
      const ridge2 = peak * 1.3 + Math.abs(x - cx * 0.5) / (w / 2) * (base - peak * 1.3) * 1.2;
      return Math.min(ridge1, ridge2);
    };

    const chars = "アイウエオカキクケコ01アBCDEFGHIJKLMNOPQRSTUVWXYZ∇∆∑∏∂";

    let raf: number;
    const draw = () => {
      ctx.fillStyle = "rgba(10,10,15,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const x = i * 20;
        const mountainY = getMountainY(x, canvas.width);
        const pxY = y * 20;

        // Skip columns inside the mountain silhouette
        if (pxY > mountainY && pxY < canvas.height * 0.65) {
          drops[i] = 0;
          return;
        }

        // Head char — bright violet
        ctx.fillStyle = `rgba(167,139,250,${Math.random() > 0.95 ? 1 : 0.85})`;
        ctx.font = `${Math.random() > 0.9 ? 15 : 13}px 'JetBrains Mono', monospace`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, pxY);

        // Trail — dimmer violet
        ctx.fillStyle = `rgba(124,58,237,${0.15 + Math.random() * 0.25})`;
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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.55,
      }}
    />
  );
}
