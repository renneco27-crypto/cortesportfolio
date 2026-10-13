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

    if (masterTrigger) {
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
        const left = itemRect.left - stageRect.left - 46;

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

      function autoScrollLoop() {
        if (autoScrollSpeed !== 0 && scroller) {
          scroller.scrollTop += autoScrollSpeed;
          if (isMouseOverMenu && lastClientY !== null) {
            updateItemUnderCursor();
          } else {
            updateArrowPosition();
          }
        }
        requestAnimationFrame(autoScrollLoop);
      }
      requestAnimationFrame(autoScrollLoop);

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
        comicAudio.playSelect();
        window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
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

          if (ratio < 0.22) {
            const intensity = (0.22 - ratio) / 0.22;
            autoScrollSpeed = -intensity * 5.5;
          } else if (ratio > 0.78) {
            const intensity = (ratio - 0.78) / 0.22;
            autoScrollSpeed = intensity * 5.5;
          } else {
            autoScrollSpeed = 0;
          }
        });

        menuZone.addEventListener("mouseleave", () => {
          isMouseOverMenu = false;
          autoScrollSpeed = 0;
          lastClientY = null;
        });

        // Two-stage responsive wheel scrolling on menuZone
        menuZone.addEventListener(
          "wheel",
          (e) => {
            if (!scroller) return;
            comicAudio.init();
            autoScrollSpeed = 0;

            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;
            const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 6;
            const atTop = scroller.scrollTop <= 4;

            if (isScrollingDown) {
              if (!atBottom) {
                e.stopPropagation();
                e.preventDefault();
                scroller.scrollBy({ top: e.deltaY * 1.1, behavior: "auto" });
                updateItemUnderCursor();
              } else {
                // Forward seamlessly to PowerPoint timeline wipe to Selected Engineering Works
                window.scrollBy({ top: e.deltaY, behavior: "auto" });
              }
            } else if (isScrollingUp) {
              if (!atTop) {
                e.stopPropagation();
                e.preventDefault();
                scroller.scrollBy({ top: e.deltaY * 1.1, behavior: "auto" });
                updateItemUnderCursor();
              } else {
                window.scrollBy({ top: e.deltaY, behavior: "auto" });
              }
            }
          },
          { passive: false }
        );
      }

      certOv.addEventListener(
        "wheel",
        (e) => {
          if (!menuZone || !menuZone.contains(e.target as Node)) {
            window.scrollBy({ top: e.deltaY, behavior: "auto" });
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
        "pointer-events:none;opacity:0;clip-path:inset(0 0 0 100%);" +
        "background:rgba(5, 5, 5, 0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);" +
        "overflow:hidden;";

      ov1.innerHTML = `
        <div style="
          position:absolute;inset:0;display:flex;align-items:center;
          padding:0 8vw;box-sizing:border-box;">

          <!-- Left: Editorial text block -->
          <div style="flex:1;max-width:520px;padding-right:4rem;">
            <div style="
              font-family:'Courier New',monospace;font-size:0.7rem;letter-spacing:4px;
              text-transform:uppercase;color:#e63946;margin-bottom:3rem;
              display:flex;align-items:center;gap:12px;">
              <span style="display:inline-block;width:32px;height:1px;background:#e63946;"></span>
              03 — ARCHITECTURAL WORKS
            </div>

            <h2 style="
              font-size:clamp(2.8rem,6vw,5rem);font-weight:200;
              letter-spacing:-0.04em;line-height:0.9;
              color:#fff;margin:0 0 2.5rem;
              text-transform:uppercase;">
              Selected<br/>
              <span style="color:#e63946;">Engineering</span><br/>
              Works.
            </h2>

            <p style="
              color:#aaa;font-size:0.85rem;line-height:1.7;
              font-weight:300;margin-bottom:3rem;max-width:380px;
              border-left:2px solid rgba(230,57,70,0.5);padding-left:1.25rem;">
              AI systems · EdTech · automation · web security.<br/>
              Live demos, source repos, and full technical telemetry.
            </p>

            <a href="/projects"
              onclick="window.__handleProjectCardZoom(event, '/projects')"
              style="
              display:inline-flex;align-items:center;gap:14px;
              font-family:'Courier New',monospace;font-size:0.72rem;
              letter-spacing:3px;text-transform:uppercase;
              color:#050505;background:#fff;
              padding:14px 32px;text-decoration:none;font-weight:700;
              cursor:pointer;
              transition:background 0.2s,color 0.2s,transform 0.2s;"
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
          <div style="flex:1;display:flex;flex-direction:column;gap:1px;max-width:480px;opacity:0.95;">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;">

              <!-- Card 001: Lex Memoria -->
              <div onclick="window.__handleProjectCardZoom(event, '/projects')"
                style="height:180px;background:rgba(14,14,14,0.85);border:1px solid rgba(255,255,255,0.12);
                display:flex;flex-direction:column;justify-content:flex-end;
                padding:1.25rem;box-sizing:border-box;cursor:pointer;
                transition:transform 0.3s ease, border-color 0.3s, background 0.3s;"
                onmouseover="this.style.transform='scale(1.05)';this.style.borderColor='#e63946';this.style.background='rgba(230,57,70,0.15)';"
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
                style="height:180px;background:rgba(10,10,10,0.85);border:1px solid rgba(255,255,255,0.12);
                display:flex;flex-direction:column;justify-content:flex-end;
                padding:1.25rem;box-sizing:border-box;grid-column:span 2;cursor:pointer;
                transition:transform 0.3s ease, border-color 0.3s, background 0.3s;"
                onmouseover="this.style.transform='scale(1.05)';this.style.borderColor='#f4a261';this.style.background='rgba(244,162,97,0.15)';"
                onmouseout="this.style.transform='scale(1)';this.style.borderColor='rgba(255,255,255,0.12)';this.style.background='rgba(10,10,10,0.85)';">
                <div style="font-family:'Courier New',monospace;font-size:0.6rem;
                  color:#f4a261;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">
                  002
                </div>
                <div style="font-size:0.85rem;color:#fff;font-weight:400;">StylePeek by Rence</div>
                <div style="font-mono text-[0.65rem] color:#888;margin-top:2px;">CSS & Design Telemetry ↗</div>
              </div>

            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:1px;">

              <!-- Card 003: NaturalVoice -->
              <div onclick="window.__handleProjectCardZoom(event, '/projects')"
                style="height:120px;background:rgba(12,12,12,0.85);border:1px solid rgba(255,255,255,0.12);
                display:flex;flex-direction:column;justify-content:flex-end;
                padding:1.25rem;box-sizing:border-box;cursor:pointer;
                transition:transform 0.3s ease, border-color 0.3s, background 0.3s;"
                onmouseover="this.style.transform='scale(1.05)';this.style.borderColor='#e63946';this.style.background='rgba(230,57,70,0.15)';"
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
                style="height:120px;background:rgba(17,17,17,0.85);border:1px solid rgba(255,255,255,0.12);
                display:flex;align-items:center;justify-content:center;cursor:pointer;
                transition:transform 0.3s ease, border-color 0.3s, background 0.3s;"
                onmouseover="this.style.transform='scale(1.05)';this.style.borderColor='#e63946';this.style.background='rgba(230,57,70,0.15)';"
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

      /* ── 2. Create Overlay 2: Initiate Contact (50/50 Split) ── */
      const CONTACT_FORM_ID = "wipe-cf-" + Math.random().toString(36).slice(2);

      const contactHTML = `
        <div style="
          position:absolute;top:0;left:0;
          width:100vw;height:100vh;
          display:flex;align-items:center;
          justify-content:center;
          padding:0 8vw;
          box-sizing:border-box;
          background:rgba(13, 13, 13, 0.85);
          backdrop-filter:blur(12px);
          -webkit-backdrop-filter:blur(12px);">

          <div style="width:100%;max-width:960px;">

            <!-- Header -->
            <div style="margin-bottom:3rem;">
              <div style="
                font-family:'Courier New',monospace;font-size:0.7rem;
                letter-spacing:4px;text-transform:uppercase;
                color:#e63946;margin-bottom:1rem;
                display:flex;align-items:center;gap:12px;">
                <span style="display:inline-block;width:32px;height:1px;background:#e63946;"></span>
                04 — COMMUNICATION PROTOCOL
              </div>
              <h2 style="
                font-size:clamp(2rem,5vw,4rem);font-weight:200;
                letter-spacing:-0.04em;text-transform:uppercase;
                color:#fff;margin:0 0 0.5rem;line-height:0.92;">
                Initiate Contact
              </h2>
              <p style="color:#777;font-size:0.75rem;font-family:'Courier New',monospace;
                letter-spacing:2.5px;text-transform:uppercase;">
                DIRECT LINE · HIGH-IMPACT INQUIRIES ONLY
              </p>
            </div>

            <!-- Form -->
            <form id="${CONTACT_FORM_ID}"
              style="display:grid;grid-template-columns:1fr 1fr;gap:1rem 2rem;"
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
              <div style="display:flex;flex-direction:column;gap:6px;">
                <label style="font-family:'Courier New',monospace;font-size:0.65rem;
                  letter-spacing:2px;text-transform:uppercase;color:#888;">
                  Sender Name *
                </label>
                <input name="senderName" type="text" required placeholder="e.g. Alex Morgan"
                  style="background:rgba(20,20,20,0.6);border:none;border-bottom:1px solid #333;
                    color:#fff;padding:10px 0;font-size:0.9rem;outline:none;
                    font-family:inherit;width:100%;box-sizing:border-box;
                    transition:border-color 0.2s;"
                  onfocus="this.style.borderBottomColor='#fff';"
                  onblur="this.style.borderBottomColor='#333';"/>
              </div>

              <!-- Email -->
              <div style="display:flex;flex-direction:column;gap:6px;">
                <label style="font-family:'Courier New',monospace;font-size:0.65rem;
                  letter-spacing:2px;text-transform:uppercase;color:#888;">
                  Email Address *
                </label>
                <input name="senderEmail" type="email" required placeholder="e.g. alex@company.com"
                  style="background:rgba(20,20,20,0.6);border:none;border-bottom:1px solid #333;
                    color:#fff;padding:10px 0;font-size:0.9rem;outline:none;
                    font-family:inherit;width:100%;box-sizing:border-box;
                    transition:border-color 0.2s;"
                  onfocus="this.style.borderBottomColor='#fff';"
                  onblur="this.style.borderBottomColor='#333';"/>
              </div>

              <!-- Message -->
              <div style="display:flex;flex-direction:column;gap:6px;grid-column:1/-1;">
                <label style="font-family:'Courier New',monospace;font-size:0.65rem;
                  letter-spacing:2px;text-transform:uppercase;color:#888;">
                  Message *
                </label>
                <textarea name="messageBody" required rows="4"
                  placeholder="Describe your requirements, project timeline, or questions..."
                  style="background:rgba(20,20,20,0.6);border:none;border-bottom:1px solid #333;
                    color:#fff;padding:10px 0;font-size:0.9rem;outline:none;resize:none;
                    font-family:inherit;width:100%;box-sizing:border-box;
                    transition:border-color 0.2s;"
                  onfocus="this.style.borderBottomColor='#fff';"
                  onblur="this.style.borderBottomColor='#333';"></textarea>
              </div>

              <!-- Submit row -->
              <div style="grid-column:1/-1;display:flex;align-items:center;
                justify-content:space-between;padding-top:1.5rem;
                border-top:1px solid rgba(255,255,255,0.08);gap:1rem;flex-wrap:wrap;">
                <button id="${CONTACT_FORM_ID}-btn" type="submit"
                  style="background:#fff;color:#050505;font-family:'Courier New',monospace;
                    font-size:0.72rem;letter-spacing:2.5px;text-transform:uppercase;
                    padding:13px 32px;border:none;cursor:pointer;font-weight:700;
                    transition:background 0.2s,color 0.2s;"
                  onmouseover="if(!this.disabled){this.style.background='#e63946';this.style.color='#fff';}"
                  onmouseout="if(!this.disabled){this.style.background='#fff';this.style.color='#050505';}">
                  SEND TRANSMISSION ↵
                </button>
                <span id="${CONTACT_FORM_ID}-fb"
                  style="font-family:'Courier New',monospace;font-size:0.68rem;
                    color:#777;letter-spacing:1.5px;text-transform:uppercase;flex:1;text-align:right;">
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
        "position:fixed;top:0;left:0;width:50vw;height:100vh;z-index:60;" +
        "pointer-events:none;opacity:0;clip-path:inset(100% 0 0 0);" +
        "overflow:hidden;";
      leftOv.innerHTML = `<div style="position:relative;width:100vw;height:100vh;">${contactHTML}</div>`;
      document.body.appendChild(leftOv);
      overlays.push(leftOv);

      // RIGHT panel
      const rightOv = document.createElement("div");
      rightOv.style.cssText =
        "position:fixed;top:0;left:50vw;width:50vw;height:100vh;z-index:60;" +
        "pointer-events:none;opacity:0;clip-path:inset(0 0 100% 0);" +
        "overflow:hidden;";
      rightOv.innerHTML = `<div style="position:relative;width:100vw;height:100vh;left:-50vw;">${contactHTML}</div>`;
      document.body.appendChild(rightOv);
      overlays.push(rightOv);

      /* ── 3. Single Master Timeline — Chains Certs -> Selected Works -> Contact with Zero Gap ── */
      const masterTl = gsap.timeline({
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
            gsap.set([certOv, ov1, leftOv, rightOv], { opacity: 0, pointerEvents: "none" });
          },
        },
      });

      // Phase 1: Wipe 0 (Achievements) enters down to up (bottom edge wipes upward)
      masterTl.fromTo(
        certOv,
        { clipPath: "inset(100% 0 0 0)", opacity: 1 },
        { clipPath: "inset(0% 0 0 0)", opacity: 1, ease: "power3.inOut", duration: 0.5 },
        0
      );

      // Phase 2 (AT 0.8): Wipe 0 exits up to down (top edge wipes downward) WHILE Wipe 1 enters
      masterTl.to(
        certOv,
        {
          clipPath: "inset(100% 0 0 0)",
          ease: "power3.inOut",
          duration: 0.5,
          onComplete: () => {
            gsap.set(certOv, { pointerEvents: "none" });
          },
        },
        0.8
      );

      masterTl.fromTo(
        ov1,
        { clipPath: "inset(0 0 0 100%)", opacity: 1 },
        {
          clipPath: "inset(0 0 0 0%)",
          opacity: 1,
          ease: "power3.inOut",
          duration: 0.5,
          onStart: () => {
            gsap.set(ov1, { opacity: 1, pointerEvents: "auto" });
          },
        },
        0.8
      );

      // Phase 3 (AT 1.6): Wipe 1 holds in place, then exits clipping upward WHILE Wipe 2 (Contact) enters!
      masterTl.to(
        ov1,
        {
          clipPath: "inset(0% 0 100% 0)",
          ease: "power3.inOut",
          duration: 0.5,
          onComplete: () => {
            gsap.set(ov1, { pointerEvents: "none" });
          },
        },
        1.6
      );

      masterTl.fromTo(
        leftOv,
        { clipPath: "inset(100% 0 0 0)", opacity: 1 },
        {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          ease: "power3.inOut",
          duration: 0.5,
          onStart: () => {
            gsap.set([leftOv, rightOv], { opacity: 1, pointerEvents: "auto" });
          },
        },
        1.6
      );

      masterTl.fromTo(
        rightOv,
        { clipPath: "inset(0 0 100% 0)", opacity: 1 },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, ease: "power3.inOut", duration: 0.5 },
        1.6
      );

      // Phase 4: Initiate Contact stays locked in place until the end of the page (no upward clip exit)
      masterTl.to(
        [leftOv, rightOv],
        { clipPath: "inset(0% 0 0% 0)", opacity: 1, duration: 0.4 },
        2.3
      );

      triggers.push(masterTl.scrollTrigger!);
    }

    return () => {
      triggers.forEach((t) => t?.kill());
      overlays.forEach((el) => el.remove());
      delete (window as unknown as Record<string, unknown>).__handleProjectCardZoom;
    };
  }, []);

  return null;
}
