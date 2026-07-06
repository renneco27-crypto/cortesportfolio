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
  const prevInView = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!prevInView.current && isInView) {
      setCount(startFrom);
      const steps = 60;
      const range = targetValue - startFrom;
      const increment = range / steps;
      const interval = durationMs / steps;
      let current = startFrom;
      timerRef.current = window.setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          setCount(targetValue);
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        } else {
          setCount(Math.floor(current));
        }
      }, interval);
    } else if (prevInView.current && !isInView) {
      setCount(startFrom);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    prevInView.current = isInView;
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isInView, targetValue, durationMs, startFrom]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}
