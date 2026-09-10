"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Check if pointer device supports hover (not touch)
    if (window.matchMedia("(pointer: coarse)").matches) {
      cursor.style.display = "none";
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isVisible = false;
    let isHovering = false;
    let isClicking = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursor.style.opacity = "1";
      }
    };

    const onMouseDown = () => {
      isClicking = true;
      cursor.classList.add("clicking");
    };

    const onMouseUp = () => {
      isClicking = false;
      cursor.classList.remove("clicking");
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest("a, button, input, textarea, select, [role='button'], label, [tabindex], .interactive, .proj-card, .btn")
      ) {
        if (!isHovering) {
          isHovering = true;
          cursor.classList.add("expanded");
        }
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest("a, button, input, textarea, select, [role='button'], label, [tabindex], .interactive, .proj-card, .btn")
      ) {
        isHovering = false;
        cursor.classList.remove("expanded");
      }
    };

    const onMouseLeaveDoc = () => {
      isVisible = false;
      cursor.style.opacity = "0";
    };

    const onMouseEnterDoc = () => {
      isVisible = true;
      cursor.style.opacity = "1";
    };

    const renderLoop = () => {
      // Smooth interpolation for fluid trailing feel
      cursorX += (mouseX - cursorX) * 0.35;
      cursorY += (mouseY - cursorY) * 0.35;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      rafId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeaveDoc);
    document.documentElement.addEventListener("mouseenter", onMouseEnterDoc);

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.documentElement.removeEventListener("mouseleave", onMouseLeaveDoc);
      document.documentElement.removeEventListener("mouseenter", onMouseEnterDoc);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-purple-cursor cursor-dot pointer-events-none fixed top-0 left-0 z-[999999] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        aria-hidden="true"
      />
      <style jsx global>{`
        .custom-purple-cursor,
        .cursor-dot {
          width: 18px;
          height: 18px;
          margin-top: -9px;
          margin-left: -9px;
          background-color: rgba(139, 92, 246, 0.45);
          border: 1.5px solid #a78bfa;
          box-shadow: 0 0 12px rgba(139, 92, 246, 0.5), inset 0 0 4px rgba(167, 139, 250, 0.4);
          transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1),
            height 0.22s cubic-bezier(0.4, 0, 0.2, 1),
            margin 0.22s cubic-bezier(0.4, 0, 0.2, 1),
            background-color 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease,
            opacity 0.2s ease;
          will-change: transform;
        }

        .custom-purple-cursor.expanded,
        .cursor-dot.expanded {
          width: 42px;
          height: 42px;
          margin-top: -21px;
          margin-left: -21px;
          background-color: rgba(167, 139, 250, 0.18);
          border: 1.5px solid #c4b5fd;
          box-shadow: 0 0 20px rgba(167, 139, 250, 0.65), inset 0 0 8px rgba(196, 181, 253, 0.3);
        }

        .custom-purple-cursor.clicking,
        .cursor-dot.clicking {
          transform: scale(0.85);
          background-color: rgba(124, 58, 237, 0.7);
          box-shadow: 0 0 25px rgba(124, 58, 237, 0.9);
        }

        @media (pointer: coarse) {
          .custom-purple-cursor,
          .cursor-dot {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
