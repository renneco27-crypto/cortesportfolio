"use client";
import { useEffect, useRef, useState } from "react";
import { useAnimateOnViewHook } from "@/hooks/useAnimateOnView";

interface AnimatedCounterProps {
  targetValue: number;
  suffix?: string;
  durationMs?: number;
  startFrom?: number;
}

export default function AnimatedCounter({
  targetValue,
  suffix = "",
  durationMs = 2000,
  startFrom = 1,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(startFrom);
  const { ref, isInView } = useAnimateOnViewHook<HTMLSpanElement>();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;
    const steps = 60;
    const range = targetValue - startFrom;
    const increment = range / steps;
    const interval = durationMs / steps;
    let current = startFrom;
    const timer = window.setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    return () => window.clearInterval(timer);
  }, [isInView, targetValue, durationMs]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}
