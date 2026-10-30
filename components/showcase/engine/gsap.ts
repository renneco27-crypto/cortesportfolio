// components/showcase/engine/gsap.ts
// Register every GSAP plugin used by the showcase exactly once (client only).
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Flip } from "gsap/Flip";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollToPlugin,
    Flip,
    DrawSVGPlugin,
    MotionPathPlugin,
    SplitText,
    ScrambleTextPlugin
  );
}

export {
  gsap,
  ScrollTrigger,
  ScrollToPlugin,
  Flip,
  DrawSVGPlugin,
  MotionPathPlugin,
  SplitText,
  useGSAP,
};
