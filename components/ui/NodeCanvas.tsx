"use client";

import React, { useEffect, useRef } from "react";

interface NodeCanvasProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  mouseDistance?: number;
}

export default function NodeCanvas({
  className = "",
  particleCount = 80,
  connectionDistance = 130,
  mouseDistance = 150,
}: NodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    let mx: number | null = null;
    let my: number | null = null;

    const resize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const handleMouseLeave = () => {
      mx = null;
      my = null;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    class P {
      x: number;
      y: number;
      vx: number;
      vy: number;

      constructor() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
      }

      step() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
      }
    }

    const particles: P[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new P());
    }

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particleCount; i++) {
        particles[i].step();
        particles[i].draw();

        // Node-to-node lines
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < connectionDistance) {
            ctx.beginPath();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - d / connectionDistance})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Cursor-to-node lines
        if (mx !== null && my !== null) {
          const dx = particles[i].x - mx;
          const dy = particles[i].y - my;
          const d = Math.hypot(dx, dy);
          if (d < mouseDistance) {
            ctx.beginPath();
            ctx.lineWidth = 0.8;
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - d / mouseDistance})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [particleCount, connectionDistance, mouseDistance]);

  return (
    <canvas
      id="node-canvas"
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-[1] ${className}`}
      aria-hidden="true"
    />
  );
}
