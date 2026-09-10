"use client";

import React, { useEffect, useRef } from "react";

interface PixelTransitionProps {
  id?: string;
  columns?: number;
  rows?: number;
  reverse?: boolean;
  text?: string;
  imageSrc?: string;
  className?: string;
}

export default function PixelTransition({
  id = "pixel-transition",
  columns = 24,
  rows = 16,
  reverse = false,
  text,
  imageSrc = "/images/bg-image.jpg",
  className = "",
}: PixelTransitionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any previous blocks
    const existingBlocks = container.querySelectorAll(".pixel-block");
    existingBlocks.forEach((el) => el.remove());

    const blocks: { element: HTMLDivElement; threshold: number }[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const block = document.createElement("div");
        block.classList.add("pixel-block");
        block.style.position = "absolute";
        block.style.boxSizing = "border-box";
        block.style.width = `calc(${100 / columns}% + 1px)`;
        block.style.height = `calc(${100 / rows}% + 1px)`;
        block.style.left = `${col * (100 / columns)}%`;
        block.style.top = `${row * (100 / rows)}%`;
        block.style.opacity = "0";

        // Slice bg-image across grid blocks
        if (imageSrc) {
          block.style.backgroundImage = `url('${imageSrc}')`;
          block.style.backgroundSize = `${columns * 100}% ${rows * 100}%`;
          const posX = columns > 1 ? (col / (columns - 1)) * 100 : 0;
          const posY = rows > 1 ? (row / (rows - 1)) * 100 : 0;
          block.style.backgroundPosition = `${posX}% ${posY}%`;
          block.style.backgroundRepeat = "no-repeat";
        } else {
          block.style.backgroundColor = "#ffffff";
        }

        const distFromCenter = Math.abs(columns / 2 - col);
        const distFromBottom = reverse ? row : rows - 1 - row;

        let threshold = (distFromBottom / rows) * 0.5;
        threshold += (distFromCenter / (columns / 2)) * 0.25;
        threshold += Math.random() * 0.1 - 0.03;
        threshold = Math.min(threshold, 0.92);
        threshold = Math.max(threshold, 0);

        container.appendChild(block);
        blocks.push({ element: block, threshold });
      }
    }

    const handleScroll = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const startPoint = window.innerHeight;
      const endPoint = window.innerHeight * 0.05;
      let progress = (startPoint - rect.top) / (startPoint - endPoint);
      progress = Math.max(0, Math.min(1, progress));

      blocks.forEach((b) => {
        b.element.style.opacity = progress > b.threshold ? "1" : "0";
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [columns, rows, reverse, imageSrc]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={`pixel-transition relative w-full h-[360px] md:h-[420px] mb-[-1px] overflow-hidden pointer-events-none ${className}`}
    >
      {text && (
        <div className="pixel-text absolute top-10 left-0 w-full text-center text-3xl md:text-5xl font-light tracking-tight text-white z-20 select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {text}
        </div>
      )}
    </div>
  );
}
