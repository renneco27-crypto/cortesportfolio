"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SectionWipeTransitions
 * Renders null — pure GSAP side effect.
 *
 * Single Master ScrollTrigger timeline attached to #slide-trigger-master.
 * Seamlessly chains Wipe 1 ("Selected Engineering Works") directly into
 * Wipe 2 ("Initiate Contact") with ZERO gaps or delays.
 */
export default function SectionWipeTransitions() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const overlays: HTMLElement[] = [];
    const triggers: ScrollTrigger[] = [];
    let stopVideoPlayback: (() => void) | null = null;
    let removeVideoListeners: (() => void) | null = null;

    /* Global click handler for project card zoom & fade transition */
    (window as unknown as Record<string, unknown>).__handleProjectCardZoom = function (
      e: MouseEvent,
      targetUrl: string
    ) {
      e.preventDefault();
      e.stopPropagation();
      const card = e.currentTarget as HTMLElement;
      if (!card) return;

      // 1. Create full-screen black fade overlay
      const fadeOverlay = document.createElement("div");
      fadeOverlay.style.cssText =
        "position:fixed;inset:0;z-index:99999;background:#000;opacity:0;" +
        "transition:opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1);pointer-events:none;";
      document.body.appendChild(fadeOverlay);

      // 2. Animate card scale/zoom
      card.style.transition = "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s";
      card.style.transform = "scale(1.28)";
      card.style.zIndex = "10000";
      card.style.borderColor = "#e63946";

      // 3. Trigger fade to black
      requestAnimationFrame(() => {
        fadeOverlay.style.opacity = "1";
      });

      // 4. Navigate after transition
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 450);
    };

    const masterTrigger = document.querySelector("#slide-trigger-master") as HTMLElement | null;

    let isInitialized = false;
    const initMasterTransitions = () => {
      if (isInitialized || !masterTrigger) return;
      isInitialized = true;

      /* ── 0. Create Overlay 0: Comic Arcade Achievements Console (sharp-curie) ── */
      const certOv = document.createElement("div");
      certOv.style.cssText =
        "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:60;" +
        "pointer-events:none;opacity:0;clip-path:inset(100% 0 0 0);" +
        "background:#070210;" +
        "display:flex;align-items:center;justify-content:center;" +
        "overflow:hidden;";

      certOv.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,800;0,900;1,900&display=swap');

          :root {
            --bg-purple: #1f083d;
            --comic-cyan: #00e5ff;
            --comic-yellow: #ffdf00;
            --comic-gold: #f59e0b;
            --comic-pink: #ff2a85;
            --comic-dark: #0f071e;
            --comic-white: #ffffff;
            --font-comic: 'Montserrat', sans-serif;
          }

          /* 16:9 Arcade Game Container */
          #game-stage {
            position: relative;
            width: 100vw;
            height: 56.25vw;
            max-height: 100vh;
            max-width: 177.78vh;
            background: #000;
            overflow: hidden;
            box-shadow: 0 0 60px rgba(0, 0, 0, 0.95), 0 0 100px rgba(120, 20, 200, 0.35);
            aspect-ratio: 16 / 9;
            pointer-events: auto;
          }

          /* Background image layer */
          .bg-layer {
            position: absolute;
            inset: 0;
            background: url('/assets/background.jpg') no-repeat center center;
            background-size: cover;
            transform: scale(1.002);
            transition: transform 0.4s ease-out;
            z-index: 1;
          }

          /* Ambient Comic Halftone */
          .halftone-ambient {
            position: absolute;
            inset: 0;
            pointer-events: none;
            background-image: radial-gradient(rgba(0, 0, 0, 0.15) 18%, transparent 18%);
            background-size: 8px 8px;
            opacity: 0.35;
            z-index: 2;
          }

          /* Center Character Layer */
          .character-center-layer {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            height: 94%;
            z-index: 10;
            pointer-events: none;
            display: flex;
            align-items: flex-end;
            justify-content: center;
            transition: transform 0.35s ease-out;
          }

          .character-img {
            height: 100%;
            width: auto;
            object-fit: contain;
            filter: drop-shadow(0 0 25px rgba(0, 0, 0, 0.7));
            transform-origin: bottom center;
            display: block;
          }

          /* Floating Comic Arrow */
          .floating-menu-arrow {
            position: absolute;
            width: 44px;
            height: 44px;
            z-index: 50;
            pointer-events: none;
            filter: drop-shadow(3px 3px 0 #000) drop-shadow(0 0 12px rgba(0, 229, 255, 0.95));
            transform: translateY(-50%) skewX(-17deg);
            transition: top 0.06s ease-out, left 0.08s ease-out, opacity 0.15s ease;
            opacity: 0;
          }

          .floating-menu-arrow.visible {
            opacity: 1;
            animation: pulseArrow 0.65s infinite alternate ease-in-out;
          }

          @keyframes pulseArrow {
            0% { transform: translateY(-50%) skewX(-17deg) scale(1) translateX(0); }
            100% { transform: translateY(-50%) skewX(-17deg) scale(1.18) translateX(6px); }
          }

          .floating-menu-arrow svg {
            width: 100%;
            height: 100%;
            display: block;
          }

          /* Top Bar: Profile & Currencies */
          .top-bar {
            position: absolute;
            top: 20px;
            left: 28px;
            right: 28px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            z-index: 30;
            pointer-events: none;
          }

          .profile-badge {
            display: flex;
            align-items: center;
            gap: 14px;
            background: rgba(14, 6, 27, 0.92);
            padding: 8px 18px 8px 12px;
            border: 3px solid #000;
            border-left: 5px solid var(--comic-cyan);
            box-shadow: 5px 5px 0 #000;
            transform: rotate(-2deg) skewX(-15deg);
            pointer-events: auto;
            cursor: pointer;
            transition: transform 0.15s, box-shadow 0.15s;
          }

          .profile-badge:hover {
            transform: rotate(-2deg) skewX(-15deg) scale(1.05);
            box-shadow: 7px 7px 0 var(--comic-cyan);
          }

          .avatar-frame {
            width: 50px;
            height: 50px;
            background: #ffb703;
            border: 2.5px solid #000;
            overflow: hidden;
          }

          .avatar-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .profile-info {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
          }

          .profile-name {
            font-family: var(--font-comic);
            font-size: 1.55rem;
            font-weight: 900;
            font-style: italic;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            text-shadow: 2.5px 2.5px 0 #000;
          }

          .profile-lvl {
            font-family: var(--font-comic);
            font-size: 1.05rem;
            font-weight: 900;
            font-style: italic;
            color: var(--comic-yellow);
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 2px 2px 0 #000;
          }

          .currencies-group {
            display: flex;
            align-items: center;
            gap: 14px;
            pointer-events: auto;
            transform: rotate(-2deg) skewX(-15deg);
          }

          .currency-pill {
            display: flex;
            align-items: center;
            background: #ffffff;
            color: #0b071a;
            border: 3px solid #000;
            box-shadow: 4px 4px 0 #000;
            padding: 2px 14px 2px 8px;
            font-family: var(--font-comic);
            font-weight: 900;
            font-size: 1.25rem;
            cursor: default;
            transition: transform 0.15s;
          }

          .currency-pill:hover {
            transform: scale(1.05);
          }

          .currency-icon {
            margin-right: 6px;
            font-size: 1.15rem;
          }

          .sound-btn {
            background: #ffffff;
            border: 3px solid #000;
            box-shadow: 4px 4px 0 #000;
            width: 42px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.15s, background 0.15s;
          }

          .sound-btn:hover {
            background: var(--comic-yellow);
            transform: scale(1.06);
          }

          .sound-btn svg {
            width: 22px;
            height: 22px;
            fill: #000;
          }

          /* Bottom Left Squad Cards */
          .bottom-squad {
            position: absolute;
            bottom: 22px;
            left: 32px;
            display: flex;
            gap: 16px;
            z-index: 30;
            pointer-events: auto;
            transform: rotate(-3deg);
          }

          .squad-slot {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transform: skewX(-15deg);
            transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.2s;
          }

          .squad-slot:hover {
            transform: skewX(-15deg) translateY(-8px) scale(1.08);
            filter: drop-shadow(0 0 10px var(--comic-cyan));
          }

          .squad-frame {
            width: 54px;
            height: 52px;
            background: #ffffff;
            border: 3px solid #000;
            box-shadow: 4px 4px 0 #000;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 2px;
          }

          .squad-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .squad-name-tag {
            margin-top: 4px;
            background: #ffffff;
            color: #000000;
            font-family: var(--font-comic);
            font-size: 0.72rem;
            font-weight: 900;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            padding: 2px 8px;
            border: 2.5px solid #000;
            box-shadow: 3px 3px 0 #000;
            white-space: nowrap;
            border-radius: 2px;
          }

          /* Advance / Exit Button (Scrolls to Selected Engineering Works) */
          .exit-btn {
            position: absolute;
            bottom: 24px;
            right: 28px;
            display: flex;
            align-items: center;
            gap: 8px;
            background: #ffffff;
            color: #0b071a;
            border: 3px solid #000;
            box-shadow: 4px 4px 0 #000;
            padding: 8px 18px;
            font-family: var(--font-comic);
            font-size: 1.12rem;
            font-weight: 900;
            font-style: italic;
            cursor: pointer;
            z-index: 30;
            transform: skewX(-15deg);
            transition: transform 0.15s, background 0.15s, box-shadow 0.15s;
            pointer-events: auto;
          }

          .exit-btn:hover {
            background: var(--comic-pink);
            color: #fff;
            transform: skewX(-15deg) scale(1.06);
            box-shadow: 6px 6px 0 #000;
          }

          .exit-btn svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
          }

          /* Right-Side 3D Slanted Action Menu Bay */
          .menu-right-zone {
            position: absolute;
            top: 0;
            right: 0;
            width: 44%;
            height: 100%;
            perspective: 1400px;
            perspective-origin: 85% 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;
            padding-right: 3.5%;
            z-index: 40;
            pointer-events: auto;
          }

          .menu-carousel-wrapper {
            position: relative;
            width: 100%;
            height: 74%;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
            overflow: visible;
          }

          .menu-scroller {
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            overflow-x: visible;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            padding: 130px 0;
            gap: 16px;
            scrollbar-width: none;
            -ms-overflow-style: none;
            mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
          }

          .menu-scroller::-webkit-scrollbar {
            display: none;
          }

          .menu-item-slot {
            position: relative;
            width: 88%;
            min-height: 58px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            cursor: pointer;
            transform-origin: center right;
            transform: rotateY(-16deg) rotateX(4deg) rotateZ(-2.8deg) skewX(-17deg) scale(0.93);
            transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.18s ease;
            opacity: 0.82;
          }

          .menu-item-slot.active {
            opacity: 1;
            transform: rotateY(-16deg) rotateX(4deg) rotateZ(-2.8deg) skewX(-17deg) scale(1.08) translateX(-18px);
            z-index: 50;
          }

          .menu-item-slot:hover {
            opacity: 1;
            transform: rotateY(-16deg) rotateX(4deg) rotateZ(-2.8deg) skewX(-17deg) scale(1.05) translateX(-10px);
          }

          .menu-item-slot.active:hover {
            transform: rotateY(-16deg) rotateX(4deg) rotateZ(-2.8deg) skewX(-17deg) scale(1.10) translateX(-20px);
          }

          .comic-btn-face {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 56px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px 0 20px;
            border: 3.5px solid #000;
            box-shadow: 8px 8px 0px #000, 14px 14px 0px rgba(0, 0, 0, 0.4);
            border-radius: 4px;
            overflow: hidden;
            transition: box-shadow 0.2s, border-color 0.2s;
          }

          .menu-item-slot.active .comic-btn-face {
            box-shadow: 10px 10px 0px #000, 0 0 30px rgba(0, 229, 255, 0.85);
            border-color: #ffffff;
            outline: 2px solid var(--comic-cyan);
          }

          .btn-start { background: linear-gradient(100deg, #00d2ff 0%, #0077ff 100%); }
          .btn-continue { background: linear-gradient(100deg, #00f2fe 0%, #4facfe 100%); }
          .btn-options { background: linear-gradient(100deg, #ffffff 0%, #e6edf5 100%); }
          .btn-options .menu-text { color: #0b071a !important; text-shadow: 2px 2px 0px #9da9b8 !important; }
          .btn-achievements { background: linear-gradient(100deg, #ffc837 0%, #ff8008 100%); }
          .btn-credits { background: linear-gradient(100deg, #ffe259 0%, #ffa751 100%); }
          .btn-load { background: linear-gradient(100deg, #8a2387 0%, #e94057 100%); }
          .btn-gallery { background: linear-gradient(100deg, #ff007f 0%, #a40606 100%); }
          .btn-quit { background: linear-gradient(100deg, #eb3349 0%, #f45c43 100%); }

          .menu-text {
            position: relative;
            font-family: var(--font-comic);
            font-size: 1.25rem;
            font-weight: 900;
            font-style: italic;
            letter-spacing: 1.5px;
            color: #ffffff;
            text-transform: uppercase;
            text-shadow: 
              3.5px 3.5px 0px #000,
              -1.5px -1.5px 0px #000,
              1.5px -1.5px 0px #000,
              -1.5px 1.5px 0px #000,
              2px 2px 5px rgba(0,0,0,0.85);
            z-index: 2;
            transition: transform 0.2s, letter-spacing 0.2s;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .menu-item-slot.active .menu-text {
            transform: scale(1.03);
            letter-spacing: 2px;
          }

          .slot-status-pill {
            font-family: var(--font-comic);
            font-size: 0.65rem;
            font-weight: 900;
            letter-spacing: 1px;
            padding: 3px 8px;
            border: 2px solid #000;
            box-shadow: 2px 2px 0 #000;
            border-radius: 3px;
            white-space: nowrap;
            text-transform: uppercase;
            z-index: 2;
          }

          .slot-status-pill.pending {
            background: #ffb703;
            color: #000;
          }

          .slot-status-pill.achieved {
            background: #00e676;
            color: #000;
          }

          .slot-status-pill.planned {
            background: #00e5ff;
            color: #000;
          }

          /* Modal Dialog for Credential / Actions */
          .action-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(8, 3, 18, 0.82);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 500;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
          }

          .action-modal-overlay.open {
            opacity: 1;
            pointer-events: auto;
          }

          .action-modal-box {
            background: #000;
            border: 4px solid var(--comic-cyan);
            box-shadow: 12px 12px 0 var(--comic-pink);
            padding: 34px 44px;
            transform: skewX(-10deg) scale(0.9);
            transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: center;
            max-width: 520px;
            width: 90%;
          }

          .action-modal-overlay.open .action-modal-box {
            transform: skewX(-10deg) scale(1);
          }

          .modal-status-badge {
            display: inline-block;
            font-family: var(--font-comic);
            font-size: 0.82rem;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 4px 14px;
            border: 2.5px solid #000;
            box-shadow: 3px 3px 0 #000;
            margin-bottom: 14px;
            transform: skewX(-8deg);
          }

          .modal-status-badge.pending {
            background: #ffb703;
            color: #000;
          }

          .modal-status-badge.achieved {
            background: #00e676;
            color: #000;
          }

          .modal-status-badge.planned {
            background: #00e5ff;
            color: #000;
          }

          .modal-title {
            font-family: var(--font-comic);
            font-size: 1.85rem;
            font-weight: 900;
            color: var(--comic-yellow);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            text-shadow: 3px 3px 0 #000;
            margin-bottom: 6px;
            line-height: 1.15;
          }

          .modal-issuer {
            font-family: var(--font-comic);
            font-size: 0.88rem;
            font-weight: 800;
            color: var(--comic-cyan);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
          }

          .modal-desc {
            font-family: var(--font-comic);
            font-size: 0.98rem;
            color: #e0e5eb;
            margin-bottom: 24px;
            letter-spacing: 0.5px;
            line-height: 1.55;
          }

          .modal-btn {
            font-family: var(--font-comic);
            background: var(--comic-cyan);
            color: #000;
            font-size: 1rem;
            font-weight: 900;
            text-transform: uppercase;
            padding: 10px 24px;
            border: 3px solid #000;
            box-shadow: 4px 4px 0 #fff;
            cursor: pointer;
            transform: skewX(-6deg);
            transition: transform 0.15s, background 0.15s;
            text-decoration: none;
            display: inline-block;
          }

          .modal-btn:hover {
            background: var(--comic-yellow);
            transform: skewX(-6deg) scale(1.05);
          }

          /* ── Responsive & Fluid Mobile Adaptation ── */
          @media (max-width: 868px) {
            #game-stage {
              width: 100vw;
              height: 100vh;
              height: 100dvh;
              max-height: 100vh;
              max-height: 100dvh;
              max-width: 100vw;
              aspect-ratio: auto;
              box-shadow: none;
            }

            .top-bar {
              top: 10px;
              left: 10px;
              right: 10px;
              width: calc(100% - 20px);
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              gap: 8px;
              box-sizing: border-box;
            }

            .profile-badge {
              flex: 1 1 auto;
              min-width: 0;
              max-width: calc(100% - 110px);
              padding: 5px 10px 5px 8px;
              gap: 8px;
              border: 2px solid #000;
              border-left: 4px solid var(--comic-cyan);
              box-shadow: 3px 3px 0 #000;
              transform: rotate(-1.5deg) skewX(-10deg);
            }

            .avatar-frame {
              width: 32px;
              height: 32px;
              flex-shrink: 0;
              border: 2px solid #000;
            }

            .profile-info {
              min-width: 0;
              overflow: hidden;
              display: flex;
              flex-direction: column;
            }

            .profile-name {
              font-size: clamp(0.75rem, 2.8vw, 0.95rem);
              letter-spacing: 0.5px;
              text-shadow: 1.5px 1.5px 0 #000;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .profile-lvl {
              font-size: clamp(0.55rem, 2vw, 0.72rem);
              letter-spacing: 0.8px;
              text-shadow: 1px 1px 0 #000;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .currencies-group {
              flex: 0 0 auto;
              display: flex;
              align-items: center;
              gap: 6px;
              transform: rotate(-1deg) skewX(-10deg);
              margin: 0;
            }

            .currency-pill {
              padding: 2px 7px;
              font-size: 0.85rem;
              border: 2px solid #000;
              box-shadow: 2.5px 2.5px 0 #000;
              white-space: nowrap;
            }

            .currency-icon {
              font-size: 0.85rem;
              margin-right: 3px;
            }

            .sound-btn {
              width: 32px;
              height: 30px;
              border: 2px solid #000;
              box-shadow: 2.5px 2.5px 0 #000;
              flex-shrink: 0;
            }

            .sound-btn svg {
              width: 16px;
              height: 16px;
            }

            .character-center-layer {
              left: 50%;
              transform: translateX(-50%);
              height: 56%;
              max-height: 520px;
              opacity: 1 !important;
              filter: drop-shadow(0 0 24px rgba(0, 0, 0, 0.95)) !important;
              z-index: 15;
              pointer-events: none;
            }

            .character-img {
              opacity: 1 !important;
              filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.85)) !important;
            }

            .menu-right-zone {
              top: 56px;
              bottom: 56px;
              right: 0;
              left: 0;
              width: 100%;
              height: auto;
              perspective: none;
              transform: none;
              padding: 0 8px;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .menu-carousel-wrapper {
              width: 100%;
              max-width: 480px;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .menu-scroller {
              width: 100%;
              height: 100%;
              padding: 8px 4px 16px;
              gap: 8px;
              align-items: stretch;
              box-sizing: border-box;
              -webkit-overflow-scrolling: touch;
              mask-image: linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%);
              -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 4%, black 96%, transparent 100%);
            }

            .menu-item-slot {
              width: 100%;
              max-width: 100%;
              box-sizing: border-box;
              min-height: 48px;
              transform: skewX(-4deg);
              opacity: 0.92;
              display: flex;
            }

            .menu-item-slot.active {
              transform: skewX(-4deg) scale(1.02);
              opacity: 1;
            }

            .comic-btn-face {
              width: 100%;
              min-height: 48px;
              padding: 0 10px 0 12px;
              box-sizing: border-box;
              border: 2px solid #000;
              box-shadow: 4px 4px 0px #000;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .menu-text {
              font-size: clamp(0.72rem, 2.8vw, 0.92rem);
              letter-spacing: 0.5px;
              text-shadow: 1.5px 1.5px 0 #000;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: calc(100% - 70px);
            }

            .slot-status-pill {
              font-size: 0.55rem;
              padding: 2px 5px;
              margin-left: 6px;
              border: 1.5px solid #000;
              box-shadow: 1.5px 1.5px 0 #000;
              flex-shrink: 0;
            }

            .floating-menu-arrow {
              display: none !important;
            }

            .bottom-squad {
              bottom: 10px;
              left: 10px;
              gap: 6px;
              transform: rotate(-1deg);
            }

            .squad-slot {
              transform: skewX(-8deg);
            }

            .squad-frame {
              width: 32px;
              height: 32px;
              border: 2px solid #000;
              box-shadow: 2px 2px 0 #000;
            }

            .squad-name-tag {
              font-size: 0.52rem;
              padding: 1px 3px;
              border: 1.5px solid #000;
              box-shadow: 1.5px 1.5px 0 #000;
              margin-top: 2px;
            }

            .exit-btn {
              bottom: 10px;
              right: 10px;
              padding: 6px 12px;
              font-size: 0.88rem;
              border: 2px solid #000;
              box-shadow: 2.5px 2.5px 0 #000;
              transform: skewX(-10deg);
              gap: 5px;
            }

            .exit-btn svg {
              width: 14px;
              height: 14px;
            }

            .action-modal-box {
              padding: 20px 16px;
              width: 90%;
              max-width: 340px;
              border: 3px solid var(--comic-cyan);
              box-shadow: 6px 6px 0 var(--comic-pink);
            }

            .modal-title {
              font-size: 1.35rem;
              margin-bottom: 4px;
            }

            .modal-issuer {
              font-size: 0.78rem;
              margin-bottom: 10px;
            }

            .modal-desc {
              font-size: 0.84rem;
              margin-bottom: 16px;
              line-height: 1.4;
            }

            .modal-btn {
              font-size: 0.85rem;
              padding: 8px 16px;
              border: 2px solid #000;
            }
          }

          @media (max-width: 480px) {
            .currency-pill:first-child {
              display: none;
            }

            .bottom-squad .squad-slot:nth-child(n+3) {
              display: none;
            }
          }

          @media (max-width: 360px) {
            .bottom-squad .squad-slot:nth-child(n+2) {
              display: none;
            }

            .exit-btn {
              padding: 5px 8px;
              font-size: 0.78rem;
            }

            .profile-badge {
              max-width: calc(100% - 90px);
              padding: 3px 6px;
            }
          }
        </style>

        <div id="game-stage">
          <!-- Art Backdrop Layer -->
          <div class="bg-layer" id="bgLayer"></div>
          <div class="halftone-ambient"></div>

          <!-- Center Character Layer -->
          <div class="character-center-layer" id="characterLayer">
            <img src="/assets/person_new.png" alt="Character" class="character-img">
          </div>

          <!-- Floating Comic Arrow: Positioned OUTSIDE buttons, tracks mouse & scroll -->
          <div class="floating-menu-arrow" id="floatingArrow">
            <svg viewBox="0 0 24 24">
              <polygon points="3,2 22,12 3,22" fill="#00e5ff" stroke="#000" stroke-width="2.5"/>
            </svg>
          </div>

          <!-- Top Navigation Bar -->
          <header class="top-bar">
            <!-- Achievements & Certifications Header Badge -->
            <div class="profile-badge" id="profileBadge" title="Achievements & Certifications">
              <div class="avatar-frame">
                <img src="/assets/avatar.png" alt="Achievements">
              </div>
              <div class="profile-info">
                <span class="profile-name">ACHIEVEMENTS</span>
                <span class="profile-lvl">&amp; CERTIFICATIONS</span>
              </div>
            </div>

            <!-- Currencies & Audio Controls -->
            <div class="currencies-group">
              <div class="currency-pill" title="Volcano Embers">
                <span class="currency-icon">🔥</span>
                <span>564</span>
              </div>
              <div class="currency-pill" title="Starlight Shards">
                <span class="currency-icon">💎</span>
                <span>12,987</span>
              </div>
              <button class="sound-btn" id="soundToggleBtn" title="Toggle Sound FX">
                <svg id="soundIcon" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>
            </div>
          </header>

          <!-- Bottom Left Squad Cards -->
          <div class="bottom-squad">
            <div class="squad-slot" data-squad="MEI OM">
              <div class="squad-frame">
                <img src="/assets/squad_mei.png" alt="MEI OM">
              </div>
              <div class="squad-name-tag">MEI OM</div>
            </div>
            <div class="squad-slot" data-squad="ZEK TIM">
              <div class="squad-frame">
                <img src="/assets/squad_zek.png" alt="ZEK TIM">
              </div>
              <div class="squad-name-tag">ZEK TIM</div>
            </div>
            <div class="squad-slot" data-squad="SAD PI">
              <div class="squad-frame">
                <img src="/assets/squad_sad.png" alt="SAD PI">
              </div>
              <div class="squad-name-tag">SAD PI</div>
            </div>
          </div>

          <!-- Bottom Right Advance Button -->
          <button class="exit-btn" id="exitBtn" title="Advance to Selected Engineering Works">
            <span>NEXT</span>
            <svg viewBox="0 0 24 24">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>

          <!-- 3D Slanted Action Menu Bay -->
          <section class="menu-right-zone" id="menuZone">
            <div class="menu-carousel-wrapper">
              <div class="menu-scroller" id="cert-panel-grid">
              </div>
            </div>
          </section>

          <!-- Action Modal Dialog with Status Display -->
          <div class="action-modal-overlay" id="actionModal">
            <div class="action-modal-box">
              <div id="modalStatusBadge" class="modal-status-badge pending">[PENDING]</div>
              <h2 class="modal-title" id="modalTitle">CREDENTIAL</h2>
              <div class="modal-issuer" id="modalIssuer">Issuing Body</div>
              <p class="modal-desc" id="modalDesc">Details loading...</p>
              <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;align-items:center;">
                <a id="modalVerifyBtn" href="#" target="_blank" rel="noopener noreferrer" class="modal-btn" style="background:#00e5ff;display:none;">OFFICIAL LINK ↗</a>
                <button class="modal-btn" id="modalCloseBtn" style="background:#ffdf00;">CONFIRM</button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(certOv);
      overlays.push(certOv);

      /* Synthesized Web Audio API Engine */
      class ComicAudioEngine {
        ctx: AudioContext | null = null;
        muted: boolean = false;

        init() {
          if (!this.ctx) {
            const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AC) this.ctx = new AC();
          }
          if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
          }
        }

        playTick() {
          if (this.muted) return;
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(460, now);
          osc.frequency.exponentialRampToValueAtTime(920, now + 0.038);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.042);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.045);
        }

        playSelect() {
          if (this.muted) return;
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          [587.33, 880, 1174.66].forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.035;
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.12, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + 0.2);
          });
        }

        playCancel() {
          if (this.muted) return;
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
          gain.gain.setValueAtTime(0.1, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
        }

        toggleMute() {
          this.muted = !this.muted;
          return this.muted;
        }
      }

      const comicAudio = new ComicAudioEngine();

      /* DOM References */
      const scroller = certOv.querySelector("#cert-panel-grid") as HTMLElement | null;
      const menuZone = certOv.querySelector("#menuZone") as HTMLElement | null;
      const floatingArrow = certOv.querySelector("#floatingArrow") as HTMLElement | null;
      const stage = certOv.querySelector("#game-stage") as HTMLElement | null;
      const actionModal = certOv.querySelector("#actionModal") as HTMLElement | null;
      const modalStatusBadge = certOv.querySelector("#modalStatusBadge") as HTMLElement | null;
      const modalTitle = certOv.querySelector("#modalTitle") as HTMLElement | null;
      const modalIssuer = certOv.querySelector("#modalIssuer") as HTMLElement | null;
      const modalDesc = certOv.querySelector("#modalDesc") as HTMLElement | null;
      const modalCloseBtn = certOv.querySelector("#modalCloseBtn") as HTMLElement | null;
      const modalVerifyBtn = certOv.querySelector("#modalVerifyBtn") as HTMLAnchorElement | null;
      const soundToggleBtn = certOv.querySelector("#soundToggleBtn") as HTMLElement | null;
      const soundIcon = certOv.querySelector("#soundIcon") as HTMLElement | null;
      const exitBtn = certOv.querySelector("#exitBtn") as HTMLElement | null;
      const bgLayer = certOv.querySelector("#bgLayer") as HTMLElement | null;
      const characterLayer = certOv.querySelector("#characterLayer") as HTMLElement | null;
      const profileBadge = certOv.querySelector("#profileBadge") as HTMLElement | null;
      const squadSlots = Array.from(certOv.querySelectorAll(".squad-slot")) as HTMLElement[];

      let activeIndex = 0;
      let autoScrollSpeed = 0;
      let lastClientY: number | null = null;
      let isMouseOverMenu = false;
      let slotElements: HTMLElement[] = [];

      function updateArrowPosition() {
        if (!floatingArrow || !stage || slotElements.length === 0) return;
        const activeItem = slotElements[activeIndex];
        if (!activeItem) return;

        const itemRect = activeItem.getBoundingClientRect();
        const stageRect = stage.getBoundingClientRect();

        const top = itemRect.top + itemRect.height / 2 - stageRect.top;
        const isMobile = window.innerWidth <= 868;
        const left = isMobile
          ? itemRect.left - stageRect.left - 24
          : itemRect.left - stageRect.left - 46;

        floatingArrow.style.top = top + "px";
        floatingArrow.style.left = left + "px";
        floatingArrow.classList.add("visible");
      }

      function setActiveIndex(newIndex: number, playSound = true) {
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= slotElements.length) newIndex = slotElements.length - 1;

        if (newIndex !== activeIndex) {
          if (playSound) comicAudio.playTick();
          activeIndex = newIndex;

          slotElements.forEach((item, idx) => {
            if (idx === activeIndex) {
              item.classList.add("active");
            } else {
              item.classList.remove("active");
            }
          });

          // Subtle parallax shift on background and character
          if (bgLayer) {
            const shiftY = (activeIndex - (slotElements.length - 1) / 2) * -3;
            bgLayer.style.transform = `scale(1.02) translateY(${shiftY}px)`;
            if (characterLayer) {
              characterLayer.style.transform = `translateX(-50%) translateY(${shiftY * 1.5}px)`;
            }
          }
        }

        updateArrowPosition();
      }

      function updateItemUnderCursor() {
        if (lastClientY === null || slotElements.length === 0) return;

        let closestIdx = activeIndex;
        let minDistance = Infinity;

        slotElements.forEach((item, idx) => {
          const rect = item.getBoundingClientRect();
          if (lastClientY! >= rect.top && lastClientY! <= rect.bottom) {
            closestIdx = idx;
            minDistance = 0;
          } else {
            const center = rect.top + rect.height / 2;
            const dist = Math.abs(lastClientY! - center);
            if (dist < minDistance) {
              minDistance = dist;
              closestIdx = idx;
            }
          }
        });

        if (closestIdx !== activeIndex) {
          setActiveIndex(closestIdx, true);
        } else {
          updateArrowPosition();
        }
      }

      let masterTl: gsap.core.Timeline | null = null;
      let isAdvancingToNext = false;

      const goToNextPanel = () => {
        if (isAdvancingToNext) return;
        if (masterTl && masterTl.progress() > 0.42) return;
        isAdvancingToNext = true;
        comicAudio.playSelect();

        let targetY = 0;
        if (masterTl && masterTl.scrollTrigger) {
          const st = masterTl.scrollTrigger;
          const totalDist = st.end - st.start;
          targetY = st.start + totalDist * (2.1 / 3.8);
        } else {
          targetY = window.scrollY + window.innerHeight * 1.2;
        }

        window.scrollTo({
          top: targetY,
          behavior: "smooth",
        });

        setTimeout(() => {
          isAdvancingToNext = false;
        }, 1200);
      };

      let autoScrollRafId: number | null = null;
      let autoScrollBottomFrames = 0;

      function autoScrollStep() {
        if (autoScrollSpeed !== 0 && scroller) {
          scroller.scrollTop += autoScrollSpeed;
          if (isMouseOverMenu && lastClientY !== null) {
            updateItemUnderCursor();
          } else {
            updateArrowPosition();
          }

          if (autoScrollSpeed > 0 && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 6) {
            autoScrollBottomFrames++;
            if (autoScrollBottomFrames > 35) {
              autoScrollBottomFrames = 0;
              goToNextPanel();
            }
          } else {
            autoScrollBottomFrames = 0;
          }

          autoScrollRafId = requestAnimationFrame(autoScrollStep);
        } else {
          autoScrollRafId = null;
          autoScrollBottomFrames = 0;
        }
      }

      function startAutoScrollIfNeeded() {
        if (autoScrollSpeed !== 0 && autoScrollRafId === null) {
          autoScrollRafId = requestAnimationFrame(autoScrollStep);
        }
      }

      // Render items inside .menu-scroller
      const renderCertCards = (
        items: Array<{
          id: string;
          label: string;
          issuing_body: string;
          status: string;
          badge_icon: string;
          notes?: string;
          verify_url?: string;
        }>
      ) => {
        if (!scroller) return;

        scroller.innerHTML = items
          .map((c, idx) => {
            const isEarned = c.status === "earned";
            const isInProgress = c.status === "in-progress" || c.status === "pending";
            const isPlanned = c.status === "planned";

            const statusClass = isEarned ? "achieved" : isInProgress ? "pending" : "planned";
            const statusText = isEarned ? "[ACHIEVED]" : isInProgress ? "[PENDING]" : "[PLANNED]";

            const paletteClasses = [
              "btn-start",
              "btn-continue",
              "btn-options",
              "btn-achievements",
              "btn-credits",
              "btn-load",
              "btn-gallery",
              "btn-quit",
            ];
            const themeClass = paletteClasses[idx % paletteClasses.length];

            let shortLabel = c.label;
            if (c.id === "csc-professional") shortLabel = "CIVIL SERVICE EXAM";
            else if (c.id === "tesda-css-nc2") shortLabel = "TESDA CSS NC II";
            else if (c.id === "cisco-cybersecurity") shortLabel = "CISCO CYBERSECURITY";
            else if (c.id === "pwncollege-badge") shortLabel = "PWN.COLLEGE";
            else if (c.id === "nextwork-cloud") shortLabel = "NEXTWORK AI CLOUD";
            else if (c.id === "aws-cloud-practitioner") shortLabel = "AWS CERTIFIED";

            return `
              <div class="menu-item-slot ${idx === 0 ? "active" : ""}"
                data-idx="${idx}"
                data-title="${c.label}"
                data-issuer="${c.issuing_body}"
                data-status="${c.status}"
                data-desc="${c.notes || (c.label + ' — ' + c.issuing_body)}"
                data-url="${c.verify_url || ""}">
                <div class="comic-btn-face ${themeClass}">
                  <span class="menu-text">${shortLabel}</span>
                  <span class="slot-status-pill ${statusClass}">
                    ${statusText}
                  </span>
                </div>
              </div>
            `;
          })
          .join("");

        slotElements = Array.from(scroller.querySelectorAll(".menu-item-slot")) as HTMLElement[];

        slotElements.forEach((el, idx) => {
          el.addEventListener("click", () => {
            comicAudio.playSelect();
            if (floatingArrow) floatingArrow.classList.remove("visible");

            const title = el.dataset.title || "CREDENTIAL";
            const issuer = el.dataset.issuer || "";
            const desc = el.dataset.desc || "";
            const status = el.dataset.status || "pending";
            const url = el.dataset.url;

            const isEarned = status === "earned";
            const isInProgress = status === "in-progress" || status === "pending";

            if (modalStatusBadge) {
              modalStatusBadge.className = `modal-status-badge ${isEarned ? "achieved" : isInProgress ? "pending" : "planned"}`;
              modalStatusBadge.textContent = isEarned ? "[ACHIEVED]" : isInProgress ? "[PENDING]" : "[PLANNED]";
            }

            if (modalTitle) modalTitle.textContent = title;
            if (modalIssuer) modalIssuer.textContent = issuer;
            if (modalDesc) modalDesc.textContent = desc;

            if (modalVerifyBtn) {
              if (url && url.startsWith("http")) {
                modalVerifyBtn.href = url;
                modalVerifyBtn.style.display = "inline-block";
              } else {
                modalVerifyBtn.style.display = "none";
              }
            }

            if (actionModal) actionModal.classList.add("open");
          });

          el.addEventListener("mouseenter", () => {
            setActiveIndex(idx, true);
          });
        });

        setTimeout(updateArrowPosition, 80);
      };

      /* Modal Close Handlers */
      const closeModal = () => {
        comicAudio.playCancel();
        if (actionModal) actionModal.classList.remove("open");
        updateArrowPosition();
      };

      modalCloseBtn?.addEventListener("click", closeModal);
      actionModal?.addEventListener("click", (e) => {
        if (e.target === actionModal) closeModal();
      });

      /* Sound Toggle Handler */
      soundToggleBtn?.addEventListener("click", () => {
        const isMuted = comicAudio.toggleMute();
        if (soundIcon) {
          if (isMuted) {
            soundIcon.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>`;
          } else {
            comicAudio.playSelect();
            soundIcon.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
          }
        }
      });

      /* Profile & Squad Modal Inspection Handlers */
      profileBadge?.addEventListener("click", () => {
        comicAudio.playSelect();
        if (floatingArrow) floatingArrow.classList.remove("visible");
        if (modalStatusBadge) {
          modalStatusBadge.className = "modal-status-badge achieved";
          modalStatusBadge.textContent = "[CREDENTIALS]";
        }
        if (modalTitle) modalTitle.textContent = "ACHIEVEMENTS & CERTIFICATIONS";
        if (modalIssuer) modalIssuer.textContent = "Technical Credentials & Badges";
        if (modalDesc) {
          modalDesc.textContent =
            "Explore verified technical assessment pathways, cloud engineering progress, and low-level security foundations.";
        }
        if (modalVerifyBtn) modalVerifyBtn.style.display = "none";
        if (actionModal) actionModal.classList.add("open");
      });

      squadSlots.forEach((slot) => {
        slot.addEventListener("click", () => {
          comicAudio.playSelect();
          if (floatingArrow) floatingArrow.classList.remove("visible");
          const member = slot.dataset.squad || "SQUAD COMPANION";
          if (modalStatusBadge) {
            modalStatusBadge.className = "modal-status-badge achieved";
            modalStatusBadge.textContent = "[ACTIVE]";
          }
          if (modalTitle) modalTitle.textContent = member;
          if (modalIssuer) modalIssuer.textContent = "Volcano Kingdom Squad Companion";
          if (modalDesc) modalDesc.textContent = `Squad Companion status: Operational and synchronized with tactical mission queue.`;
          if (modalVerifyBtn) modalVerifyBtn.style.display = "none";
          if (actionModal) actionModal.classList.add("open");
        });
      });

      /* Exit / Advance Button to Selected Engineering Works */
      exitBtn?.addEventListener("click", () => {
        goToNextPanel();
      });

      /* Mouse & Menu Tracking */
      if (menuZone) {
        menuZone.addEventListener("mouseenter", (e) => {
          isMouseOverMenu = true;
          comicAudio.init();
          lastClientY = e.clientY;
          updateItemUnderCursor();
        });

        menuZone.addEventListener("mousemove", (e) => {
          lastClientY = e.clientY;
          updateItemUnderCursor();

          const rect = menuZone.getBoundingClientRect();
          const relativeY = e.clientY - rect.top;
          const ratio = relativeY / rect.height;

          if (ratio < 0.28) {
            const intensity = (0.28 - ratio) / 0.28;
            autoScrollSpeed = -Math.max(3.0, intensity * 14.0);
            startAutoScrollIfNeeded();
          } else if (ratio > 0.72) {
            const intensity = (ratio - 0.72) / 0.28;
            autoScrollSpeed = Math.max(3.0, intensity * 14.0);
            startAutoScrollIfNeeded();
          } else {
            autoScrollSpeed = 0;
          }
        });

        menuZone.addEventListener("mouseleave", () => {
          isMouseOverMenu = false;
          autoScrollSpeed = 0;
          lastClientY = null;
          if (autoScrollRafId !== null) {
            cancelAnimationFrame(autoScrollRafId);
            autoScrollRafId = null;
          }
        });
      }

      // Mouse wheel handling on certOv:
      // Scrolling down inside the certifications list scrolls the cards smoothly.
      // Upon reaching AWS Certified at the end, scrolling a little bit farther automatically advances to the next panel.
      let accumulatedWheelDelta = 0;
      let wheelResetTimer: ReturnType<typeof setTimeout> | null = null;

      certOv.addEventListener(
        "wheel",
        (e) => {
          comicAudio.init();
          const scroller = certOv.querySelector(".menu-scroller") as HTMLElement | null;
          const isOverScroller = (e.target as HTMLElement)?.closest(".menu-scroller");

          if (isOverScroller && scroller && scroller.scrollHeight > scroller.clientHeight + 4) {
            const isAtBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 10;
            const isAtTop = scroller.scrollTop <= 6;

            if (e.deltaY > 0) {
              if (isAtBottom) {
                // Reached the end of AWS Certified! Scrolling a little bit farther automatically advances to next panel
                accumulatedWheelDelta += e.deltaY;
                if (wheelResetTimer) clearTimeout(wheelResetTimer);
                wheelResetTimer = setTimeout(() => {
                  accumulatedWheelDelta = 0;
                }, 400);

                if (accumulatedWheelDelta > 20) {
                  accumulatedWheelDelta = 0;
                  goToNextPanel();
                }
              } else {
                accumulatedWheelDelta = 0;
                scroller.scrollTop += e.deltaY;
              }
            } else if (e.deltaY < 0) {
              accumulatedWheelDelta = 0;
              if (isAtTop) {
                window.scrollBy({ top: e.deltaY, behavior: "auto" });
              } else {
                scroller.scrollTop += e.deltaY;
              }
            }
          } else {
            // Anywhere on the background stage
            if (e.deltaY > 40) {
              goToNextPanel();
            } else {
              window.scrollBy({ top: e.deltaY, behavior: "auto" });
            }
          }
        },
        { passive: true }
      );

      // Touch gestures on certOv:
      // Allows fluid card scrolling and automatically advances to next panel when swiping past AWS Certified
      let ovTouchStartY = 0;
      let accumulatedTouchDiff = 0;
      let touchResetTimer: ReturnType<typeof setTimeout> | null = null;

      certOv.addEventListener(
        "touchstart",
        (e) => {
          if (e.touches && e.touches.length > 0) {
            ovTouchStartY = e.touches[0].clientY;
            accumulatedTouchDiff = 0;
          }
        },
        { passive: true }
      );

      certOv.addEventListener(
        "touchmove",
        (e) => {
          if (!e.touches || e.touches.length === 0) return;
          const currentY = e.touches[0].clientY;
          const diff = ovTouchStartY - currentY; // positive = swiping up = scrolling down
          ovTouchStartY = currentY;

          const scroller = certOv.querySelector(".menu-scroller") as HTMLElement | null;
          const isTouchingScroller = (e.target as HTMLElement)?.closest(".menu-scroller");

          if (isTouchingScroller && scroller && scroller.scrollHeight > scroller.clientHeight + 4) {
            const isAtBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 10;
            const isAtTop = scroller.scrollTop <= 6;

            if (diff > 0) {
              if (isAtBottom) {
                // At the bottom of AWS Certified and swiping a little bit farther!
                accumulatedTouchDiff += diff;
                if (touchResetTimer) clearTimeout(touchResetTimer);
                touchResetTimer = setTimeout(() => {
                  accumulatedTouchDiff = 0;
                }, 400);

                if (accumulatedTouchDiff > 16) {
                  accumulatedTouchDiff = 0;
                  goToNextPanel();
                }
              } else {
                accumulatedTouchDiff = 0;
              }
            } else if (diff < 0) {
              accumulatedTouchDiff = 0;
              if (isAtTop) {
                window.scrollBy({ top: diff * 1.15, behavior: "auto" });
              }
            }
          } else {
            // Swiping on background stage
            if (diff > 30) {
              goToNextPanel();
            } else {
              window.scrollBy({ top: diff * 1.15, behavior: "auto" });
            }
          }
        },
        { passive: true }
      );

      // Default in-progress and planned credentials (NO fake earned or verified claims)
      renderCertCards([
        {
          id: "csc-professional",
          label: "Civil Service Exam — Professional Level",
          issuing_body: "Civil Service Commission (CSC), Philippines",
          status: "in-progress",
          badge_icon: "award",
          notes: "Professional Level Eligibility (In Progress) — Civil Service Commission (CSC), Philippines. Preparing for technical government roles examination.",
          verify_url: "https://www.csc.gov.ph",
        },
        {
          id: "tesda-css-nc2",
          label: "Computer Systems Servicing NC II",
          issuing_body: "TESDA",
          status: "in-progress",
          badge_icon: "check",
          notes: "Hands-on hardware assembly, networking diagnostics, and operating system configuration assessment.",
          verify_url: "https://www.tesda.gov.ph",
        },
        {
          id: "cisco-cybersecurity",
          label: "Intro to Cybersecurity & Networking",
          issuing_body: "Cisco Networking Academy",
          status: "in-progress",
          badge_icon: "shield",
          notes: "Enterprise network defense fundamentals, security architectures, and vulnerability countermeasures.",
          verify_url: "https://www.netacad.com",
        },
        {
          id: "pwncollege-badge",
          label: "pwn.college — Program Security Path",
          issuing_body: "pwn.college & ASU",
          status: "in-progress",
          badge_icon: "shield",
          notes: "Binary exploitation, memory corruption triage, reverse engineering, and low-level Linux systems security.",
          verify_url: "https://pwn.college",
        },
        {
          id: "nextwork-cloud",
          label: "NextWork — Cloud-Native AI Engineering",
          issuing_body: "NextWork",
          status: "in-progress",
          badge_icon: "graduation",
          notes: "Cloud-native generative AI architectures, model integrations, vector retrieval, and serverless engineering.",
          verify_url: "https://nextwork.org",
        },
        {
          id: "aws-cloud-practitioner",
          label: "AWS Certified Cloud Practitioner",
          issuing_body: "Amazon Web Services (AWS)",
          status: "planned",
          badge_icon: "award",
          notes: "Cloud infrastructure foundations, IAM security compliance, billing, and core global services.",
          verify_url: "https://aws.amazon.com/certification",
        },
      ]);

      // Connect to Supabase via /api/credentials
      fetch("/api/credentials")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            renderCertCards(data);
          }
        })
        .catch(() => {});


      /* ── 1. Create Overlay 1: Selected Engineering Works ── */
      const ov1 = document.createElement("div");
      ov1.style.cssText =
        "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:60;" +
        "pointer-events:none;opacity:0;clip-path:inset(100% 0 0 0);" +
        "background:rgba(5, 5, 5, 0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);" +
        "overflow:hidden;";

      ov1.innerHTML = `
        <style>
          .ov1-stage {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 8vw;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 2;
          }
          .ov1-left {
            position: relative;
            z-index: 2;
            flex: 1;
            max-width: 520px;
            padding-right: 4rem;
            box-sizing: border-box;
          }
          .ov1-tag {
            font-family: 'Courier New', monospace;
            font-size: 0.7rem;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #e63946;
            margin-bottom: 2.5rem;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .ov1-tag-line {
            display: inline-block;
            width: 32px;
            height: 1px;
            background: #e63946;
          }
          .ov1-title {
            font-size: clamp(2.8rem, 5.5vw, 4.8rem);
            font-weight: 200;
            letter-spacing: -0.04em;
            line-height: 0.92;
            color: #fff;
            margin: 0 0 2rem;
            text-transform: uppercase;
          }
          .ov1-desc {
            color: #aaa;
            font-size: 0.85rem;
            line-height: 1.7;
            font-weight: 300;
            margin-bottom: 2.5rem;
            max-width: 380px;
            border-left: 2px solid rgba(230,57,70,0.5);
            padding-left: 1.25rem;
          }
          .ov1-btn {
            display: inline-flex;
            align-items: center;
            gap: 14px;
            font-family: 'Courier New', monospace;
            font-size: 0.72rem;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #050505;
            background: #fff;
            padding: 14px 32px;
            text-decoration: none;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s, color 0.2s, transform 0.2s;
          }
          .ov1-right {
            position: relative;
            z-index: 2;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1px;
            max-width: 480px;
            opacity: 0.95;
            box-sizing: border-box;
          }
          .ov1-row1 {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 1px;
          }
          .ov1-row2 {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1px;
          }
          .ov1-card {
            height: 180px;
            background: rgba(14,14,14,0.85);
            border: 1px solid rgba(255,255,255,0.12);
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 1.25rem;
            box-sizing: border-box;
            cursor: pointer;
            transition: transform 0.3s ease, border-color 0.3s, background 0.3s;
          }
          .ov1-card-center {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* Ambient Center Arc Reactor Spritesheet Canvas (100% Client-Side GPU, Zero Lag) */
          .ov1-bg-video-wrap {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 580px;
            max-width: 90vw;
            aspect-ratio: 16 / 9;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 1;
            mix-blend-mode: screen;
            filter: contrast(110%) brightness(105%);
          }
          #ov1-bg-canvas {
            width: 100%;
            height: auto;
            aspect-ratio: 16 / 9;
            display: block;
          }

          @media (max-width: 868px) {
            .ov1-stage {
              flex-direction: column;
              justify-content: flex-start;
              align-items: stretch;
              padding: 56px 6vw 48px;
              overflow-y: auto;
              -webkit-overflow-scrolling: touch;
              gap: 1.5rem;
            }
            .ov1-left {
              max-width: 100%;
              padding-right: 0;
              flex: none;
            }
            .ov1-tag {
              margin-bottom: 0.75rem;
              font-size: 0.65rem;
            }
            .ov1-title {
              font-size: clamp(2rem, 7vw, 3rem);
              margin-bottom: 1rem;
              line-height: 0.95;
            }
            .ov1-desc {
              margin-bottom: 1.25rem;
              font-size: 0.8rem;
              padding-left: 0.75rem;
            }
            .ov1-btn {
              padding: 10px 20px;
              font-size: 0.68rem;
              width: fit-content;
            }
            .ov1-right {
              max-width: 100%;
              flex: none;
              gap: 8px;
              padding-bottom: 8px;
            }
            .ov1-row1, .ov1-row2 {
              grid-template-columns: 1fr !important;
              gap: 8px !important;
            }
            .ov1-card {
              height: auto !important;
              min-height: 85px !important;
              padding: 1rem !important;
            }
            .ov1-bg-video-wrap {
              width: 360px;
              max-width: 95vw;
              top: 45%;
              opacity: 0.85;
            }
          }
        </style>

        <!-- Centered Background Canvas Layer (Black background removed via screen blend) -->
        <div class="ov1-bg-video-wrap">
          <canvas
            id="ov1-bg-canvas"
            width="480"
            height="270"
          ></canvas>
        </div>

        <div class="ov1-stage">
          <!-- Left: Editorial text block -->
          <div class="ov1-left">
            <div class="ov1-tag">
              <span class="ov1-tag-line"></span>
              03 — ARCHITECTURAL WORKS
            </div>

            <h2 class="ov1-title">
              Selected<br/>
              <span style="color:#e63946;">Engineering</span><br/>
              Works.
            </h2>

            <p class="ov1-desc">
              AI systems · EdTech · automation · web security.<br/>
              Live demos, source repos, and full technical telemetry.
            </p>

            <a href="/projects"
              onclick="window.__handleProjectCardZoom(event, '/projects')"
              class="ov1-btn"
              onmouseover="this.style.background='#e63946';this.style.color='#fff';this.style.transform='translateY(-2px)';"
              onmouseout="this.style.background='#fff';this.style.color='#050505';this.style.transform='translateY(0)';">
              View All Projects
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
              </svg>
            </a>
          </div>

          <!-- Right: Clickable project grid cards with Zoom + Fade transition -->
          <div class="ov1-right">
            <div class="ov1-row1">
              <!-- Card 001: Lex Memoria -->
              <div onclick="window.__handleProjectCardZoom(event, '/projects')"
                class="ov1-card"
                onmouseover="this.style.transform='scale(1.03)';this.style.borderColor='#e63946';this.style.background='rgba(230,57,70,0.15)';"
                onmouseout="this.style.transform='scale(1)';this.style.borderColor='rgba(255,255,255,0.12)';this.style.background='rgba(14,14,14,0.85)';">
                <div style="font-family:'Courier New',monospace;font-size:0.6rem;
                  color:#e63946;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">
                  001
                </div>
                <div style="font-size:0.85rem;color:#fff;font-weight:400;">Lex Memoria</div>
                <div style="font-mono text-[0.65rem] color:#888;margin-top:2px;">Digital Codal App ↗</div>
              </div>

              <!-- Card 002: StylePeek -->
              <div onclick="window.__handleProjectCardZoom(event, '/projects')"
                class="ov1-card"
                style="background:rgba(10,10,10,0.85);"
                onmouseover="this.style.transform='scale(1.03)';this.style.borderColor='#f4a261';this.style.background='rgba(244,162,97,0.15)';"
                onmouseout="this.style.transform='scale(1)';this.style.borderColor='rgba(255,255,255,0.12)';this.style.background='rgba(10,10,10,0.85)';">
                <div style="font-family:'Courier New',monospace;font-size:0.6rem;
                  color:#f4a261;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">
                  002
                </div>
                <div style="font-size:0.85rem;color:#fff;font-weight:400;">StylePeek by Rence</div>
                <div style="font-mono text-[0.65rem] color:#888;margin-top:2px;">CSS & Design Telemetry ↗</div>
              </div>
            </div>

            <div class="ov1-row2">
              <!-- Card 003: NaturalVoice -->
              <div onclick="window.__handleProjectCardZoom(event, '/projects')"
                class="ov1-card"
                style="height:120px;background:rgba(12,12,12,0.85);"
                onmouseover="this.style.transform='scale(1.03)';this.style.borderColor='#e63946';this.style.background='rgba(230,57,70,0.15)';"
                onmouseout="this.style.transform='scale(1)';this.style.borderColor='rgba(255,255,255,0.12)';this.style.background='rgba(12,12,12,0.85)';">
                <div style="font-family:'Courier New',monospace;font-size:0.6rem;
                  color:#e63946;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">
                  003
                </div>
                <div style="font-size:0.85rem;color:#fff;font-weight:400;">NaturalVoice Reader</div>
                <div style="font-mono text-[0.65rem] color:#888;margin-top:2px;">Edge Screen Reader ↗</div>
              </div>

              <!-- Card + more: NaturalVoice Edge Screen Reader GitHub -->
              <div onclick="window.__handleProjectCardZoom(event, 'https://github.com/renneco27-crypto/NaturalVoice_EdgeScreenReader_Renne')"
                class="ov1-card ov1-card-center"
                style="height:120px;background:rgba(17,17,17,0.85);"
                onmouseover="this.style.transform='scale(1.03)';this.style.borderColor='#e63946';this.style.background='rgba(230,57,70,0.15)';"
                onmouseout="this.style.transform='scale(1)';this.style.borderColor='rgba(255,255,255,0.12)';this.style.background='rgba(17,17,17,0.85)';">
                <span style="font-family:'Courier New',monospace;font-size:0.7rem;
                  color:#fff;letter-spacing:2px;text-transform:uppercase;font-weight:700;">
                  NaturalVoice ↗
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Subtle grid overlay -->
        <div style="
          position:absolute;inset:0;pointer-events:none;
          background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);
          background-size:60px 60px;">
        </div>
      `;

      document.body.appendChild(ov1);
      overlays.push(ov1);

      /* ── 100% Client-Side GPU Spritesheet Arc Reactor Engine (Zero Lag, Bidirectional Scrub) ── */
      const TOTAL_FRAMES = 240;
      const FRAMES_PER_SHEET = 120;
      const COLS = 10;
      const FRAME_WIDTH = 480;
      const FRAME_HEIGHT = 270;

      const canvasEl = ov1.querySelector("#ov1-bg-canvas") as HTMLCanvasElement | null;
      const stageEl = ov1.querySelector(".ov1-stage") as HTMLElement | null;
      const ctx = canvasEl?.getContext("2d");

      // Preload the two optimized WebP spritesheets directly into client memory
      let sheet1Loaded = false;
      let sheet2Loaded = false;
      const sheet1 = new Image();
      const sheet2 = new Image();

      let currentFrameFloat = 0;
      let lastDrawnFrame = -1;
      let targetVelocity = 0;
      let animRafId: number | null = null;

      const renderFrame = (frameIdx: number, force = false) => {
        if (!ctx) return;
        const normalized = ((Math.floor(frameIdx) % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
        if (!force && normalized === lastDrawnFrame) return;

        const isFirst = normalized < FRAMES_PER_SHEET;
        const sheetImg = isFirst ? sheet1 : sheet2;
        const isLoaded = isFirst ? sheet1Loaded : sheet2Loaded;

        if (!isLoaded) {
          if (sheet1Loaded && sheet1.naturalWidth > 0) {
            const fallbackIdx = normalized % FRAMES_PER_SHEET;
            const c = fallbackIdx % COLS;
            const r = Math.floor(fallbackIdx / COLS);
            ctx.clearRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
            ctx.drawImage(sheet1, c * FRAME_WIDTH, r * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
            lastDrawnFrame = normalized;
          }
          return;
        }

        if (sheetImg.naturalWidth > 0) {
          const localIdx = normalized % FRAMES_PER_SHEET;
          const col = localIdx % COLS;
          const row = Math.floor(localIdx / COLS);

          ctx.clearRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);
          ctx.drawImage(sheetImg, col * FRAME_WIDTH, row * FRAME_HEIGHT, FRAME_WIDTH, FRAME_HEIGHT, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
          lastDrawnFrame = normalized;
        }
      };

      const onSheet1Load = () => {
        sheet1Loaded = true;
        renderFrame(0, true);
      };
      const onSheet2Load = () => {
        sheet2Loaded = true;
      };

      sheet1.onload = onSheet1Load;
      sheet2.onload = onSheet2Load;
      sheet1.src = "/assets/arc_reactor_sheet1.webp";
      sheet2.src = "/assets/arc_reactor_sheet2.webp";

      if (sheet1.complete && sheet1.naturalWidth > 0) {
        onSheet1Load();
      }
      if (sheet2.complete && sheet2.naturalWidth > 0) {
        onSheet2Load();
      }

      const isOv1InView = () => {
        if (!masterTl) return false;
        const t = masterTl.time();
        return t >= 0.95 && t <= 3.45;
      };

      const tickAnimation = () => {
        if (!isOv1InView()) {
          targetVelocity = 0;
          animRafId = null;
          return;
        }

        if (Math.abs(targetVelocity) > 0.05) {
          currentFrameFloat = (currentFrameFloat + targetVelocity) % TOTAL_FRAMES;
          if (currentFrameFloat < 0) currentFrameFloat += TOTAL_FRAMES;

          renderFrame(currentFrameFloat);
          targetVelocity *= 0.88; // Smooth momentum decay

          animRafId = requestAnimationFrame(tickAnimation);
        } else {
          targetVelocity = 0;
          animRafId = null;
        }
      };

      const startAnimIfNeeded = () => {
        if (animRafId === null && isOv1InView()) {
          animRafId = requestAnimationFrame(tickAnimation);
        }
      };

      const stopOv1Playback = () => {
        targetVelocity = 0;
        if (animRafId !== null) {
          cancelAnimationFrame(animRafId);
          animRafId = null;
        }
      };

      const addScrollImpulse = (impulse: number) => {
        if (!isOv1InView()) {
          stopOv1Playback();
          return;
        }
        // Clamped impulse: smooth acceleration, instant reverse when negative
        targetVelocity = Math.max(-7.0, Math.min(7.0, targetVelocity * 0.4 + impulse));
        startAnimIfNeeded();
      };

      const handleScrollActivity = (rawVelocity: number) => {
        if (!isOv1InView()) {
          stopOv1Playback();
          return;
        }
        const absVel = Math.abs(rawVelocity);
        if (absVel < 5) return;
        const sign = rawVelocity > 0 ? 1 : -1;
        // Dynamically scale frame velocity based on scroll speed
        const impulse = sign * Math.min(5.5, Math.max(0.8, Math.pow(absVel * 0.002, 0.85)));
        addScrollImpulse(impulse);
      };

      // Listen to scroll events on ov1-stage for mobile internal scrolling
      let lastStageScrollTop = 0;
      let lastStageScrollTime = performance.now();
      const onStageScroll = () => {
        if (!isOv1InView() || !stageEl) return;
        const now = performance.now();
        const dt = Math.max(16, now - lastStageScrollTime);
        const dy = stageEl.scrollTop - lastStageScrollTop;
        const vel = (dy / dt) * 1000;
        handleScrollActivity(vel);
        lastStageScrollTop = stageEl.scrollTop;
        lastStageScrollTime = now;
      };
      stageEl?.addEventListener("scroll", onStageScroll, { passive: true });

      // Window wheel for instantaneous bidirectional scrub response
      const onWindowWheel = (e: WheelEvent) => {
        if (isOv1InView()) {
          // e.deltaY > 0 is scroll down (forward), e.deltaY < 0 is scroll up (reverse)
          const sign = e.deltaY > 0 ? 1 : -1;
          const mag = Math.min(5.0, Math.max(1.0, Math.abs(e.deltaY) * 0.03));
          addScrollImpulse(sign * mag);
        }
      };
      window.addEventListener("wheel", onWindowWheel, { passive: true });

      // Touch events with mobile upward scroll-chaining
      let lastTouchY = 0;
      let lastTouchTime = performance.now();
      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          lastTouchY = e.touches[0].clientY;
          lastTouchTime = performance.now();
        }
      };
      const onTouchMove = (e: TouchEvent) => {
        if (!isOv1InView() || e.touches.length === 0) return;
        const now = performance.now();
        const dt = Math.max(16, now - lastTouchTime);
        const dy = lastTouchY - e.touches[0].clientY; // positive = scroll down, negative = scroll up
        const vel = (dy / dt) * 1000;

        // When at top of ov1 and swiping down (scrolling up): chain to window scroll
        if (stageEl && stageEl.scrollTop <= 4 && dy < 0) {
          window.scrollBy({ top: dy * 1.2, behavior: "auto" });
        }

        handleScrollActivity(vel);
        lastTouchY = e.touches[0].clientY;
        lastTouchTime = now;
      };
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });

      stopVideoPlayback = stopOv1Playback;
      removeVideoListeners = () => {
        stopOv1Playback();
        stageEl?.removeEventListener("scroll", onStageScroll);
        window.removeEventListener("wheel", onWindowWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
      };

      /* ── 2. Create Overlay 2: Initiate Contact (PowerPoint Curtain / Responsive) ── */
      const CONTACT_FORM_ID = "wipe-cf-" + Math.random().toString(36).slice(2);
      const isMobileViewport = typeof window !== "undefined" && window.innerWidth <= 868;

      const contactHTML = `
        <style>
          .contact-stage {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 8vw;
            box-sizing: border-box;
            background: rgba(13, 13, 13, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            overflow: hidden;
          }
          .contact-wrapper {
            width: 100%;
            max-width: 960px;
            box-sizing: border-box;
          }
          .contact-header {
            margin-bottom: 2.5rem;
          }
          .contact-tag {
            font-family: 'Courier New', monospace;
            font-size: 0.7rem;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: #e63946;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .contact-tag-line {
            display: inline-block;
            width: 32px;
            height: 1px;
            background: #e63946;
          }
          .contact-title {
            font-size: clamp(2rem, 5vw, 4rem);
            font-weight: 200;
            letter-spacing: -0.04em;
            text-transform: uppercase;
            color: #fff;
            margin: 0 0 0.5rem;
            line-height: 0.92;
          }
          .contact-sub {
            color: #777;
            font-size: 0.75rem;
            font-family: 'Courier New', monospace;
            letter-spacing: 2.5px;
            text-transform: uppercase;
          }
          .contact-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem 2rem;
            box-sizing: border-box;
          }
          .contact-field {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .contact-label {
            font-family: 'Courier New', monospace;
            font-size: 0.65rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #888;
          }
          .contact-input {
            background: rgba(20,20,20,0.6);
            border: none;
            border-bottom: 1px solid #333;
            color: #fff;
            padding: 10px 0;
            font-size: 1rem;
            outline: none;
            font-family: inherit;
            width: 100%;
            box-sizing: border-box;
            transition: border-color 0.2s;
          }
          .contact-input:focus {
            border-bottom-color: #fff;
          }
          .contact-textarea {
            background: rgba(20,20,20,0.6);
            border: none;
            border-bottom: 1px solid #333;
            color: #fff;
            padding: 10px 0;
            font-size: 1rem;
            outline: none;
            resize: none;
            font-family: inherit;
            width: 100%;
            box-sizing: border-box;
            transition: border-color 0.2s;
          }
          .contact-textarea:focus {
            border-bottom-color: #fff;
          }
          .contact-submit-row {
            grid-column: 1 / -1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(255,255,255,0.08);
            gap: 1rem;
            flex-wrap: wrap;
          }
          .contact-btn {
            background: #fff;
            color: #050505;
            font-family: 'Courier New', monospace;
            font-size: 0.72rem;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            padding: 13px 32px;
            border: none;
            cursor: pointer;
            font-weight: 700;
            transition: background 0.2s, color 0.2s;
          }
          .contact-feedback {
            font-family: 'Courier New', monospace;
            font-size: 0.68rem;
            color: #777;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            flex: 1;
            text-align: right;
          }

          @media (max-width: 868px) {
            .contact-stage {
              padding: 56px 6vw 48px;
              align-items: flex-start;
              justify-content: flex-start;
              overflow-y: auto;
              -webkit-overflow-scrolling: touch;
              height: 100%;
              height: 100dvh;
            }
            .contact-wrapper {
              margin: 0 auto;
            }
            .contact-header {
              margin-bottom: 1.5rem;
            }
            .contact-tag {
              font-size: 0.65rem;
              margin-bottom: 0.5rem;
            }
            .contact-title {
              font-size: clamp(1.8rem, 6.5vw, 2.8rem);
            }
            .contact-sub {
              font-size: 0.65rem;
              letter-spacing: 1.5px;
            }
            .contact-form {
              grid-template-columns: 1fr !important;
              gap: 1rem !important;
              padding-bottom: 32px;
            }
            .contact-submit-row {
              flex-direction: column;
              align-items: stretch;
              gap: 12px;
              padding-top: 1rem;
            }
            .contact-btn {
              width: 100%;
              text-align: center;
              padding: 12px 20px;
            }
            .contact-feedback {
              text-align: center !important;
            }
          }
        </style>

        <div class="contact-stage">
          <div class="contact-wrapper">
            <!-- Header -->
            <div class="contact-header">
              <div class="contact-tag">
                <span class="contact-tag-line"></span>
                04 — COMMUNICATION PROTOCOL
              </div>
              <h2 class="contact-title">
                Initiate Contact
              </h2>
              <p class="contact-sub">
                DIRECT LINE · HIGH-IMPACT INQUIRIES ONLY
              </p>
            </div>

            <!-- Form -->
            <form id="${CONTACT_FORM_ID}"
              class="contact-form"
              onsubmit="(function(e){
                e.preventDefault();
                var f=e.target;
                var btn=document.getElementById('${CONTACT_FORM_ID}-btn');
                var fb=document.getElementById('${CONTACT_FORM_ID}-fb');
                btn.disabled=true;btn.textContent='TRANSMITTING...';
                fetch('/api/contact',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({
                    senderName:f.senderName.value,
                    senderEmail:f.senderEmail.value,
                    messageBody:f.messageBody.value
                  })
                }).then(function(r){return r.json();}).then(function(d){
                  btn.disabled=false;
                  if(d.success){
                    btn.textContent='MESSAGE SENT ✓';
                    fb.style.color='#74c69d';
                    fb.textContent=d.message||'Message dispatched successfully.';
                    f.reset();
                  } else {
                    btn.textContent='SEND TRANSMISSION ↵';
                    fb.style.color='#ff8fa3';
                    fb.textContent=d.message||'Failed to send. Please retry.';
                  }
                }).catch(function(){
                  btn.disabled=false;
                  btn.textContent='SEND TRANSMISSION ↵';
                  fb.style.color='#ff8fa3';
                  fb.textContent='Network error — please retry.';
                });
              })(event);">

              <!-- Sender Name -->
              <div class="contact-field">
                <label class="contact-label">
                  Sender Name *
                </label>
                <input name="senderName" type="text" required placeholder="e.g. Alex Morgan"
                  class="contact-input"/>
              </div>

              <!-- Email -->
              <div class="contact-field">
                <label class="contact-label">
                  Email Address *
                </label>
                <input name="senderEmail" type="email" required placeholder="e.g. alex@company.com"
                  class="contact-input"/>
              </div>

              <!-- Message -->
              <div class="contact-field" style="grid-column:1/-1;">
                <label class="contact-label">
                  Message *
                </label>
                <textarea name="messageBody" required rows="4"
                  placeholder="Describe your requirements, project timeline, or questions..."
                  class="contact-textarea"></textarea>
              </div>

              <!-- Submit row -->
              <div class="contact-submit-row">
                <button id="${CONTACT_FORM_ID}-btn" type="submit"
                  class="contact-btn"
                  onmouseover="if(!this.disabled){this.style.background='#e63946';this.style.color='#fff';}"
                  onmouseout="if(!this.disabled){this.style.background='#fff';this.style.color='#050505';}">
                  SEND TRANSMISSION ↵
                </button>
                <span id="${CONTACT_FORM_ID}-fb"
                  class="contact-feedback">
                  END-TO-END VERIFIED
                </span>
              </div>
            </form>
          </div>
        </div>
      `;

      // LEFT panel
      const leftOv = document.createElement("div");
      leftOv.style.cssText =
        (isMobileViewport
          ? "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:60;"
          : "position:fixed;top:0;left:0;width:50vw;height:100vh;z-index:60;") +
        "pointer-events:none;opacity:0;clip-path:inset(100% 0 0 0);" +
        "overflow:hidden;";
      leftOv.innerHTML = isMobileViewport
        ? contactHTML
        : `<div style="position:relative;width:100vw;height:100vh;">${contactHTML}</div>`;
      document.body.appendChild(leftOv);
      overlays.push(leftOv);

      // RIGHT panel (desktop split PowerPoint wipe; hidden on mobile)
      const rightOv = document.createElement("div");
      rightOv.style.cssText =
        (isMobileViewport
          ? "display:none;"
          : "position:fixed;top:0;left:50vw;width:50vw;height:100vh;z-index:60;") +
        "pointer-events:none;opacity:0;clip-path:inset(0 0 100% 0);" +
        "overflow:hidden;";
      if (!isMobileViewport) {
        rightOv.innerHTML = `<div style="position:relative;width:100vw;height:100vh;left:-50vw;">${contactHTML}</div>`;
      }
      document.body.appendChild(rightOv);
      overlays.push(rightOv);

      /* ── 3. Single Master Timeline — Chains Certs -> Selected Works -> Contact with Zero Gap ── */
      masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: masterTrigger,
          start: "top 70%",
          end: "bottom bottom",
          scrub: 1.0,
          onEnter: () => {
            gsap.set(certOv, { opacity: 1, pointerEvents: "auto" });
            gsap.set([ov1, leftOv, rightOv], { pointerEvents: "none" });
          },
          onLeaveBack: () => {
            stopOv1Playback();
            gsap.set([certOv, ov1, leftOv, rightOv], { opacity: 0, pointerEvents: "none" });
          },
          onLeave: () => {
            stopOv1Playback();
          },
          onUpdate: (self) => {
            if (isOv1InView()) {
              handleScrollActivity(self.getVelocity());
            } else {
              stopOv1Playback();
            }
          },
        },
      });

      // Phase 1: Wipe 0 (Achievements) enters down to up (bottom edge wipes upward)
      masterTl.fromTo(
        certOv,
        { clipPath: "inset(100% 0 0 0)", opacity: 1 },
        { clipPath: "inset(0% 0 0 0)", opacity: 1, ease: "power3.inOut", duration: 0.6 },
        0
      );

      // Phase 2 (AT 1.0): Wipe 0 scrolls/wipes upward WHILE Wipe 1 (Selected Works) enters from bottom
      masterTl.to(
        certOv,
        {
          clipPath: "inset(0% 0 100% 0)",
          ease: "power3.inOut",
          duration: 0.6,
          onComplete: () => {
            gsap.set(certOv, { pointerEvents: "none" });
          },
        },
        1.0
      );

      masterTl.fromTo(
        ov1,
        { clipPath: "inset(100% 0 0 0)", opacity: 1 },
        {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          ease: "power3.inOut",
          duration: 0.6,
          onStart: () => {
            gsap.set(ov1, { opacity: 1, pointerEvents: "auto" });
            renderFrame(currentFrameFloat, true);
          },
        },
        1.0
      );

      // Phase 3 (AT 2.8): Wipe 1 holds in place comfortably from 1.6 to 2.8 (generous time to view Selected Works),
      // then exits clipping upward WHILE Wipe 2 (Contact) enters!
      masterTl.to(
        ov1,
        {
          clipPath: "inset(0% 0 100% 0)",
          ease: "power3.inOut",
          duration: 0.6,
          onComplete: () => {
            stopOv1Playback();
            gsap.set(ov1, { pointerEvents: "none" });
          },
        },
        2.8
      );

      masterTl.fromTo(
        leftOv,
        { clipPath: "inset(100% 0 0 0)", opacity: 1 },
        {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          ease: "power3.inOut",
          duration: 0.6,
          onStart: () => {
            gsap.set([leftOv, rightOv], { opacity: 1, pointerEvents: "auto" });
          },
        },
        2.8
      );

      if (!isMobileViewport) {
        masterTl.fromTo(
          rightOv,
          { clipPath: "inset(0 0 100% 0)", opacity: 1 },
          { clipPath: "inset(0 0 0% 0)", opacity: 1, ease: "power3.inOut", duration: 0.6 },
          2.8
        );
      }

      // Phase 4: Initiate Contact stays locked in place until the end of the page (no upward clip exit)
      masterTl.to(
        isMobileViewport ? leftOv : [leftOv, rightOv],
        {
          clipPath: "inset(0% 0 0% 0)",
          opacity: 1,
          duration: 0.5,
          onComplete: () => {
            if (!isMobileViewport) {
              leftOv.style.width = "100vw";
              rightOv.style.display = "none";
            }
          },
          onReverseComplete: () => {
            if (!isMobileViewport) {
              leftOv.style.width = "50vw";
              rightOv.style.display = "block";
            }
          },
        },
        3.5
      );

      triggers.push(masterTl.scrollTrigger!);
    };

    let observer: IntersectionObserver | null = null;
    if (masterTrigger && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            initMasterTransitions();
            observer?.disconnect();
          }
        },
        { rootMargin: "800px 0px 800px 0px" }
      );
      observer.observe(masterTrigger);
    }

    // Idle & Scroll fallbacks: ensure smooth transition even if user rapidly scrubs
    const idleTimer = setTimeout(initMasterTransitions, 3500);

    const handleScrollFallback = () => {
      if (window.scrollY > 300) {
        initMasterTransitions();
        window.removeEventListener("scroll", handleScrollFallback);
      }
    };
    window.addEventListener("scroll", handleScrollFallback, { passive: true });

    return () => {
      observer?.disconnect();
      clearTimeout(idleTimer);
      window.removeEventListener("scroll", handleScrollFallback);
      removeVideoListeners?.();
      stopVideoPlayback?.();
      triggers.forEach((t) => t?.kill());
      overlays.forEach((el) => el.remove());
      delete (window as unknown as Record<string, unknown>).__handleProjectCardZoom;
    };
  }, []);

  return null;
}
