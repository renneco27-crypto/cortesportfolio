"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 9}px, ${mouseY - 9}px)`;
    };

    const expand = () => dot.classList.add("expanded");
    const shrink = () => dot.classList.remove("expanded");

    document.addEventListener("mousemove", onMouseMove);
    document.querySelectorAll("a, button, input, textarea, [role='button'], label, select").forEach((el) => {
      el.addEventListener("mouseenter", expand);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.querySelectorAll("a, button, input, textarea, [role='button'], label, select").forEach((el) => {
        el.removeEventListener("mouseenter", expand);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return <div ref={dotRef} className="cursor-dot" />;
}
