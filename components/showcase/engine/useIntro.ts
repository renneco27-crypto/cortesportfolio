// components/showcase/engine/useIntro.ts
import { gsap } from "./gsap";

export function playSignatureIntro(
  container: HTMLElement,
  onComplete?: () => void
): gsap.core.Timeline {
  const preloader = container.querySelector<HTMLElement>(".js-preloader");
  const maskPaths = container.querySelectorAll<SVGPathElement>(".js-sig-mask");
  const swish = container.querySelector<SVGPathElement>(".js-sig-swish");
  const tip = container.querySelector<SVGCircleElement>(".js-sig-tip");
  const guide = container.querySelector<SVGPathElement>(".js-sig-guide");
  const stack = container.querySelector<HTMLElement>(".js-sig-stack");
  const status = container.querySelector<HTMLElement>(".js-sig-status");
  const bar = container.querySelector<HTMLElement>(".js-sig-bar");
  const heroLayer = container.querySelector<HTMLElement>(".js-hero-layer");

  if (!preloader || !heroLayer) {
    const dummy = gsap.timeline();
    onComplete?.();
    return dummy;
  }

  // Reset initial states — vertical swipe-up transition (no fade out)
  gsap.set(preloader, { opacity: 1, yPercent: 0, pointerEvents: "auto", display: "flex" });
  gsap.set(heroLayer, { yPercent: 22, scale: 0.985 });
  if (stack) gsap.set(stack, { opacity: 0, y: 12 });
  if (status) status.textContent = "Compiling signature…";
  if (bar) gsap.set(bar, { scaleX: 0 });
  if (tip) gsap.set(tip, { opacity: 0 });

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    onComplete: () => {
      onComplete?.();
    },
  });

  // Animate progress bar
  if (bar) {
    tl.to(bar, { scaleX: 1, duration: 1.8, ease: "power1.inOut" }, 0);
  }

  // Draw signature mask paths in overlapping sequence
  maskPaths.forEach((path, i) => {
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    const startTime = i * 0.45;
    tl.to(
      path,
      {
        strokeDashoffset: 0,
        duration: 0.65,
        ease: "power2.inOut",
      },
      startTime
    );
  });

  // Draw swish
  if (swish) {
    const swishLen = swish.getTotalLength();
    gsap.set(swish, { strokeDasharray: swishLen, strokeDashoffset: swishLen });
    tl.to(
      swish,
      {
        strokeDashoffset: 0,
        duration: 0.45,
        ease: "power2.out",
      },
      1.1
    );
  }

  // Guide tip dot movement
  if (guide && tip) {
    const guideLen = guide.getTotalLength();
    const tracker = { progress: 0 };
    tl.to(
      tip,
      { opacity: 1, duration: 0.1 },
      0
    );
    tl.to(
      tracker,
      {
        progress: 1,
        duration: 1.5,
        ease: "power1.inOut",
        onUpdate: () => {
          const pt = guide.getPointAtLength(tracker.progress * guideLen);
          tip.setAttribute("cx", pt.x.toString());
          tip.setAttribute("cy", pt.y.toString());
        },
      },
      0
    );
    tl.to(tip, { opacity: 0, duration: 0.15 }, 1.5);
  }

  // Stack text entrance
  if (stack) {
    tl.to(
      stack,
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      },
      1.35
    );
  }

  if (status) {
    tl.add(() => {
      status.textContent = "Lawrence Cortes · Ready to build";
    }, 1.4);
  }

  // Swipe UP transition from Signature Preloader into Hero Section (no fade-out!)
  tl.to(
    preloader,
    {
      yPercent: -100,
      duration: 0.92,
      ease: "power3.inOut",
      delay: 0.28,
      onComplete: () => {
        gsap.set(preloader, { display: "none", pointerEvents: "none" });
      },
    }
  );

  tl.to(
    heroLayer,
    {
      yPercent: 0,
      scale: 1,
      duration: 0.92,
      ease: "power3.out",
    },
    "<"
  );

  return tl;
}
