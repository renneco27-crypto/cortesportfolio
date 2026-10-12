"use client";

import React, { useEffect, useState } from "react";

interface WireframeRect {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: string;
  isAccent?: boolean;
}

export default function WireframeMeshLoader() {
  const [isDone, setIsDone] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [rects, setRects] = useState<WireframeRect[]>([]);

  useEffect(() => {
    // Scan all visible DOM elements currently in the viewport
    const scanVisibleElements = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const collected: WireframeRect[] = [];

      const selectors = [
        "header",
        "header a",
        "header button",
        "h1",
        "h2",
        "h3",
        "h4",
        "p",
        "button",
        "a.btn-cta",
        "img",
        "[class*='aspect-square']",
        "canvas",
        "input",
        "textarea",
        "[class*='font-mono']",
        "[class*='badge']",
        "[class*='tag']",
      ];

      const elements = Array.from(
        document.querySelectorAll<HTMLElement>(selectors.join(", "))
      );

      elements.forEach((el, index) => {
        // Skip elements from the loader itself
        if (el.closest("[data-wireframe-loader]")) return;
        if (!el.offsetParent && el.tagName !== "BODY" && el.tagName !== "HEADER") return;

        // Avoid duplicate nested boxes
        const parentTag = el.parentElement?.tagName;
        if (
          parentTag === "H1" ||
          parentTag === "H2" ||
          parentTag === "H3" ||
          parentTag === "BUTTON" ||
          (el.tagName === "P" && el.parentElement?.tagName === "P")
        ) {
          return;
        }

        const bRect = el.getBoundingClientRect();
        // Check if inside or near viewport
        if (
          bRect.bottom < -20 ||
          bRect.top > vh + 20 ||
          bRect.right < -20 ||
          bRect.left > vw + 20
        ) {
          return;
        }

        if (bRect.width < 10 || bRect.height < 4) return;

        const computedStyle = window.getComputedStyle(el);
        const borderRadius = computedStyle.borderRadius || "2px";

        const isAccent =
          el.classList.contains("text-[#e63946]") ||
          el.classList.contains("border-[#e63946]") ||
          el.innerHTML.includes("#e63946");

        // Split multi-line paragraphs into individual skeleton line bars
        if (el.tagName === "P") {
          const clientRects = el.getClientRects();
          if (clientRects.length > 1) {
            for (let i = 0; i < clientRects.length; i++) {
              const cr = clientRects[i];
              if (
                cr.width > 20 &&
                cr.height > 6 &&
                cr.bottom >= 0 &&
                cr.top <= vh
              ) {
                collected.push({
                  id: `p-${index}-${i}`,
                  top: cr.top,
                  left: cr.left,
                  width: cr.width,
                  height: Math.max(cr.height - 4, 12),
                  borderRadius: "2px",
                  isAccent,
                });
              }
            }
            return;
          }
        }

        collected.push({
          id: `el-${index}`,
          top: bRect.top,
          left: bRect.left,
          width: bRect.width,
          height: bRect.height,
          borderRadius,
          isAccent,
        });
      });

      if (collected.length > 0) {
        setRects(collected);
      }
    };

    // Initial scan and frame update
    scanVisibleElements();
    const rafId = requestAnimationFrame(scanVisibleElements);

    // Update coordinates if user scrolls during wireframe display
    window.addEventListener("scroll", scanVisibleElements, { passive: true });
    window.addEventListener("resize", scanVisibleElements);

    // 1-second display timer
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsDone(true);
      }, 350); // 350ms fade transition
    }, 1000);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scanVisibleElements);
      window.removeEventListener("resize", scanVisibleElements);
      clearTimeout(timer);
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      data-wireframe-loader="true"
      className={`fixed inset-0 z-[99999] pointer-events-none select-none transition-opacity duration-350 ease-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden={isFading}
    >
      {/* Background mask covering the screen for 1 second */}
      <div className="absolute inset-0 bg-[#050505] z-0" />

      {/* Dynamic Wireframe Boxes exactly overlaying the visible page elements */}
      <div className="absolute inset-0 z-10">
        {rects.map((r) => (
          <div
            key={r.id}
            className="wireframe-glint"
            style={{
              position: "fixed",
              top: `${r.top}px`,
              left: `${r.left}px`,
              width: `${r.width}px`,
              height: `${r.height}px`,
              borderRadius: r.borderRadius,
              backgroundColor: "#1b1b20",
              border: r.isAccent
                ? "1px solid rgba(230, 57, 70, 0.7)"
                : "1px solid #353540",
              boxShadow: r.isAccent
                ? "0 0 10px rgba(230, 57, 70, 0.25)"
                : "none",
            }}
          />
        ))}
      </div>

      {/* Shimmer Glint Animation */}
      <style jsx>{`
        @keyframes glint {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .wireframe-glint {
          overflow: hidden;
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: glint 1.6s infinite linear;
        }
      `}</style>
    </div>
  );
}
