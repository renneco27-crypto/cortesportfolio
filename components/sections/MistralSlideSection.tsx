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
      /* ── 0. Create Overlay 0: Verified Credentials (Defier of Limits / Gojo Design) ── */
      const certOv = document.createElement("div");
      certOv.style.cssText =
        "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:60;" +
        "pointer-events:none;opacity:0;clip-path:inset(0 0 0 100%);" +
        "background:rgba(8, 11, 20, 0.72);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);" +
        "overflow:hidden;";

      certOv.innerHTML = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,800;0,900;1,900&display=swap');

          .slide-floating-arrow {
            position: absolute;
            width: 40px;
            height: 40px;
            z-index: 60;
            pointer-events: none;
            filter: drop-shadow(3px 3px 0 #000) drop-shadow(0 0 12px rgba(0, 229, 255, 0.95));
            transform: translateY(-50%) skewX(-17deg);
            transition: top 0.07s ease-out, left 0.08s ease-out, opacity 0.15s ease;
            opacity: 0;
          }

          .slide-floating-arrow.visible {
            opacity: 1;
            animation: pulseArrow 0.65s infinite alternate ease-in-out;
          }

          @keyframes pulseArrow {
            0% { transform: translateY(-50%) skewX(-17deg) scale(1) translateX(0); }
            100% { transform: translateY(-50%) skewX(-17deg) scale(1.18) translateX(6px); }
          }

          .slide-floating-arrow svg {
            width: 100%;
            height: 100%;
            display: block;
          }

          .slide-menu-zone {
            position: relative;
            width: 520px;
            max-width: 48vw;
            height: 72vh;
            perspective: 1400px;
            perspective-origin: 85% 50%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-end;
            z-index: 40;
            pointer-events: auto;
          }

          .slide-carousel-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
            overflow: visible;
          }

          .slide-scroller {
            width: 100%;
            height: 100%;
            overflow-y: scroll;
            overflow-x: visible;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            padding: 90px 0;
            gap: 14px;
            scrollbar-width: none;
            -ms-overflow-style: none;
            mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
          }

          .slide-scroller::-webkit-scrollbar {
            display: none;
          }

          .slide-menu-slot {
            position: relative;
            width: 88%;
            min-height: 54px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            cursor: pointer;
            transform-origin: center right;
            transform: rotateY(-16deg) rotateX(4deg) rotateZ(-2.8deg) skewX(-17deg) scale(0.93);
            transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.18s ease;
            opacity: 0.82;
          }

          .slide-menu-slot.active {
            opacity: 1;
            transform: rotateY(-16deg) rotateX(4deg) rotateZ(-2.8deg) skewX(-17deg) scale(1.08) translateX(-16px);
            z-index: 50;
          }

          .slide-menu-slot:hover {
            opacity: 1;
            transform: rotateY(-16deg) rotateX(4deg) rotateZ(-2.8deg) skewX(-17deg) scale(1.04) translateX(-8px);
          }

          .slide-menu-slot.active:hover {
            transform: rotateY(-16deg) rotateX(4deg) rotateZ(-2.8deg) skewX(-17deg) scale(1.10) translateX(-18px);
          }

          .slide-comic-btn-face {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 52px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            border: 3.5px solid #000;
            box-shadow: 6px 6px 0px #000, 10px 10px 0px rgba(0, 0, 0, 0.4);
            border-radius: 4px;
            overflow: hidden;
            box-sizing: border-box;
            transition: box-shadow 0.2s, border-color 0.2s;
          }

          .slide-menu-slot.active .slide-comic-btn-face {
            box-shadow: 8px 8px 0px #000, 0 0 26px rgba(0, 229, 255, 0.85);
            border-color: #ffffff;
            outline: 2px solid #00e5ff;
          }

          .sbtn-0 { background: linear-gradient(100deg, #00d2ff 0%, #0077ff 100%); }
          .sbtn-1 { background: linear-gradient(100deg, #00f2fe 0%, #4facfe 100%); }
          .sbtn-2 { background: linear-gradient(100deg, #ffffff 0%, #e6edf5 100%); }
          .sbtn-2 .slide-menu-text { color: #0b071a !important; text-shadow: 2px 2px 0px #9da9b8 !important; }
          .sbtn-3 { background: linear-gradient(100deg, #ffc837 0%, #ff8008 100%); }
          .sbtn-4 { background: linear-gradient(100deg, #ffe259 0%, #ffa751 100%); }
          .sbtn-5 { background: linear-gradient(100deg, #8a2387 0%, #e94057 100%); }
          .sbtn-6 { background: linear-gradient(100deg, #ff007f 0%, #a40606 100%); }
          .sbtn-7 { background: linear-gradient(100deg, #eb3349 0%, #f45c43 100%); }

          .slide-menu-text {
            position: relative;
            font-family: 'Montserrat', sans-serif;
            font-size: 1.18rem;
            font-weight: 900;
            font-style: italic;
            letter-spacing: 1.5px;
            color: #ffffff;
            text-transform: uppercase;
            text-shadow: 
              3px 3px 0px #000,
              -1.5px -1.5px 0px #000,
              1.5px -1.5px 0px #000,
              -1.5px 1.5px 0px #000,
              2px 2px 4px rgba(0,0,0,0.85);
            z-index: 2;
            transition: transform 0.2s, letter-spacing 0.2s;
            white-space: nowrap;
          }

          .slide-menu-slot.active .slide-menu-text {
            transform: scale(1.04);
            letter-spacing: 2px;
          }

          .slide-action-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(8, 3, 18, 0.8);
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

          .slide-action-modal-overlay.open {
            opacity: 1;
            pointer-events: auto;
          }

          .slide-action-modal-box {
            background: #000;
            border: 4px solid #00e5ff;
            box-shadow: 12px 12px 0 #ff2a85;
            padding: 34px 44px;
            transform: skewX(-10deg) scale(0.9);
            transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            text-align: center;
            max-width: 500px;
          }

          .slide-action-modal-overlay.open .slide-action-modal-box {
            transform: skewX(-10deg) scale(1);
          }

          .slide-modal-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 1.9rem;
            font-weight: 900;
            color: #ffdf00;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 3px 3px 0 #000;
            margin-bottom: 10px;
          }

          .slide-modal-desc {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.95rem;
            color: #e0e5eb;
            margin-bottom: 22px;
            letter-spacing: 0.5px;
            line-height: 1.5;
          }

          .slide-modal-btn {
            font-family: 'Montserrat', sans-serif;
            background: #00e5ff;
            color: #000;
            font-size: 0.95rem;
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

          .slide-modal-btn:hover {
            background: #ffdf00;
            transform: skewX(-6deg) scale(1.05);
          }
        </style>

        <div id="certOv-stage" style="
          position:absolute;inset:0;display:flex;align-items:center;
          padding:0 8vw;box-sizing:border-box;gap:4rem;">

          <!-- Left: Editorial Comic Header Block -->
          <div style="flex:1;max-width:440px;padding-right:1rem;z-index:20;">
            <div style="margin-bottom:1.4rem;">
              <div style="
                display:inline-block;
                background:#ff2a85;
                border:2.5px solid #000;
                box-shadow:4px 4px 0 #000;
                color:#fff;
                font-family:'Montserrat',sans-serif;
                font-size:0.75rem;
                font-weight:900;
                font-style:italic;
                letter-spacing:2px;
                text-transform:uppercase;
                padding:6px 16px;
                transform:skewX(-15deg);">
                ★ ACHIEVEMENTS &amp; CREDENTIALS
              </div>
            </div>

            <h2 style="
              font-family:'Montserrat',sans-serif;
              font-size:clamp(2.4rem,4.8vw,4.2rem);
              font-weight:900;
              font-style:italic;
              letter-spacing:-0.03em;
              line-height:0.95;
              margin:0 0 1.25rem;
              text-transform:uppercase;">
              <span style="color:#ffffff;text-shadow:3px 3px 0 #000;">TECHNICAL</span><br/>
              <span style="color:#00e5ff;text-shadow:3px 3px 0 #000;">ACHIEVEMENTS</span><br/>
              <span style="color:#ffdf00;text-shadow:3px 3px 0 #000;">&amp; BADGES.</span>
            </h2>

            <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.5rem;">
              <div style="height:3px;width:52px;background:#00e5ff;box-shadow:0 0 10px #00e5ff;"></div>
              <div style="flex:1;height:2px;background:linear-gradient(90deg,rgba(0,229,255,0.8) 0%,rgba(255,223,0,0.6) 65%,transparent 100%);"></div>
            </div>

            <p style="
              color:#94a3b8;font-size:0.88rem;line-height:1.65;
              font-weight:400;margin:0 0 1.5rem;max-width:370px;
              border-left:3px solid #00e5ff;padding-left:1.25rem;">
              Verified civil service eligibility, systems servicing, cloud engineering, and cybersecurity telemetry.
            </p>

            <a href="/achievements" style="
              display:inline-flex;align-items:center;gap:10px;
              background:#ffdf00;color:#000;
              border:3px solid #000;box-shadow:5px 5px 0 #00e5ff;
              font-family:'Montserrat',sans-serif;font-size:0.75rem;
              font-weight:900;font-style:italic;letter-spacing:1.5px;
              text-transform:uppercase;padding:12px 22px;
              text-decoration:none;cursor:pointer;
              transform:skewX(-12deg);
              transition:transform 0.15s, background 0.15s, box-shadow 0.15s;"
              onmouseover="this.style.background='#00e5ff';this.style.boxShadow='5px 5px 0 #ff2a85';this.style.transform='skewX(-12deg) scale(1.05)';"
              onmouseout="this.style.background='#ffdf00';this.style.boxShadow='5px 5px 0 #00e5ff';this.style.transform='skewX(-12deg) scale(1)';">
              <span>LAUNCH ARCADE CONSOLE ↗</span>
            </a>
          </div>

          <!-- Right: 3D Slanted Action Menu Bay -->
          <section class="slide-menu-zone" id="slideMenuZone">
            <!-- Floating Animated Comic Arrow -->
            <div class="slide-floating-arrow" id="slideFloatingArrow">
              <svg viewBox="0 0 24 24">
                <polygon points="3,2 22,12 3,22" fill="#00e5ff" stroke="#000" stroke-width="2.5"/>
              </svg>
            </div>

            <div class="slide-carousel-wrapper">
              <div class="slide-scroller" id="cert-panel-grid">
              </div>
            </div>
          </section>
        </div>

        <!-- Interactive Modal Dialog -->
        <div class="slide-action-modal-overlay" id="certActionModal">
          <div class="slide-action-modal-box">
            <h2 class="slide-modal-title" id="certModalTitle">ACHIEVEMENT</h2>
            <p class="slide-modal-desc" id="certModalDesc">Telemetry loading...</p>
            <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;align-items:center;">
              <a id="certModalVerifyBtn" href="#" target="_blank" rel="noopener noreferrer" class="slide-modal-btn" style="background:#00e5ff;text-decoration:none;display:none;">OFFICIAL VERIFICATION ↗</a>
              <button class="slide-modal-btn" id="certModalCloseBtn" style="background:#ffdf00;">CONFIRM</button>
            </div>
          </div>
        </div>

        <!-- Subtle ambient grid -->
        <div style="
          position:absolute;inset:0;pointer-events:none;
          background-image:linear-gradient(rgba(0,229,255,0.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,42,133,0.03) 1px,transparent 1px);
          background-size:48px 48px;">
        </div>
      `;

      document.body.appendChild(certOv);
      overlays.push(certOv);

      /* Web Audio Synthesizer for slide panel */
      class SlideAudioEngine {
        ctx: AudioContext | null = null;
        init() {
          if (!this.ctx) {
            const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (AC) this.ctx = new AC();
          }
          if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
        }
        playTick() {
          this.init();
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(460, now);
          osc.frequency.exponentialRampToValueAtTime(920, now + 0.035);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.042);
        }
        playSelect() {
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
            gain.gain.setValueAtTime(0.09, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + 0.18);
          });
        }
      }

      const slideAudio = new SlideAudioEngine();

      const scroller = certOv.querySelector("#cert-panel-grid") as HTMLElement | null;
      const menuZone = certOv.querySelector("#slideMenuZone") as HTMLElement | null;
      const floatingArrow = certOv.querySelector("#slideFloatingArrow") as HTMLElement | null;
      const modal = certOv.querySelector("#certActionModal") as HTMLElement | null;
      const modalTitle = certOv.querySelector("#certModalTitle") as HTMLElement | null;
      const modalDesc = certOv.querySelector("#certModalDesc") as HTMLElement | null;
      const modalCloseBtn = certOv.querySelector("#certModalCloseBtn") as HTMLElement | null;
      const modalVerifyBtn = certOv.querySelector("#certModalVerifyBtn") as HTMLAnchorElement | null;

      let activeIndex = 0;
      let slotElements: HTMLElement[] = [];

      function updateArrowPosition() {
        if (!floatingArrow || !menuZone) return;
        const activeItem = slotElements[activeIndex];
        if (!activeItem) return;

        const itemRect = activeItem.getBoundingClientRect();
        const zoneRect = menuZone.getBoundingClientRect();

        const top = itemRect.top + itemRect.height / 2 - zoneRect.top;
        const left = itemRect.left - zoneRect.left - 42;

        floatingArrow.style.top = top + "px";
        floatingArrow.style.left = left + "px";
        floatingArrow.classList.add("visible");
      }

      function setActiveIndex(newIndex: number, playSound = true) {
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= slotElements.length) newIndex = slotElements.length - 1;

        if (newIndex !== activeIndex) {
          if (playSound) slideAudio.playTick();
          activeIndex = newIndex;

          slotElements.forEach((el, idx) => {
            if (idx === activeIndex) {
              el.classList.add("active");
            } else {
              el.classList.remove("active");
            }
          });
        }
        updateArrowPosition();
      }

      // Render 3D slanted arcade comic items
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

        const allItems = [
          ...items,
          {
            id: "full-arcade-console",
            label: "FULL ARCADE CONSOLE ↗",
            issuing_body: "Interactive 16:9 Showcase",
            status: "LAUNCH",
            badge_icon: "award",
            notes: "Launch the full 16:9 comic arcade achievements console with character diorama, sound effects, squad profiles, and currency systems.",
            verify_url: "/achievements",
          },
        ];

        scroller.innerHTML = allItems
          .map((c, idx) => {
            const isEarned = c.status === "earned";
            const isInProgress = c.status === "in-progress" || c.status === "pending";
            const isLaunch = c.id === "full-arcade-console";

            const statusColor = isLaunch ? "#00e5ff" : isEarned ? "#00e676" : isInProgress ? "#ff2a55" : "#facc15";
            const statusText = isLaunch ? "ENTER ↵" : isEarned ? "EARNED" : isInProgress ? "IN PROGRESS" : "PLANNED";
            const themeClass = `sbtn-${idx % 8}`;

            let shortLabel = c.label;
            if (c.id === "csc-professional") shortLabel = "CSC PROFESSIONAL";
            else if (c.id === "tesda-css-nc2") shortLabel = "TESDA CSS NC II";
            else if (c.id === "cisco-cybersecurity") shortLabel = "CISCO CYBERSECURITY";
            else if (c.id === "pwncollege-badge") shortLabel = "PWN.COLLEGE";
            else if (c.id === "nextwork-cloud") shortLabel = "NEXTWORK AI CLOUD";
            else if (c.id === "aws-cloud-practitioner") shortLabel = "AWS CERTIFIED";
            else if (c.id === "full-arcade-console") shortLabel = "FULL ARCADE ↗";

            return `
              <div class="slide-menu-slot ${idx === 0 ? "active" : ""}"
                data-idx="${idx}"
                data-title="${c.label}"
                data-desc="${c.notes || (c.label + ' — ' + c.issuing_body)}"
                data-url="${c.verify_url || ""}">
                <div class="slide-comic-btn-face ${themeClass}">
                  <span class="slide-menu-text">${shortLabel}</span>
                  <span style="font-family:'Montserrat',sans-serif;font-size:0.62rem;font-weight:900;letter-spacing:1px;background:#000;color:${statusColor};padding:3px 7px;border:2px solid ${statusColor};border-radius:3px;box-shadow:2px 2px 0 #000;white-space:nowrap;margin-left:8px;">
                    ${statusText}
                  </span>
                </div>
              </div>
            `;
          })
          .join("");

        slotElements = Array.from(scroller.querySelectorAll(".slide-menu-slot")) as HTMLElement[];

        slotElements.forEach((el, idx) => {
          el.addEventListener("click", () => {
            slideAudio.playSelect();
            if (idx !== activeIndex) {
              setActiveIndex(idx, false);
            }
            const url = el.dataset.url;
            if (el.dataset.title === "FULL ARCADE CONSOLE ↗" && url) {
              window.location.href = url;
              return;
            }
            if (modalTitle) modalTitle.textContent = el.dataset.title || "ACHIEVEMENT";
            if (modalDesc) modalDesc.textContent = el.dataset.desc || "";
            if (modalVerifyBtn) {
              if (url && url.startsWith("http")) {
                modalVerifyBtn.href = url;
                modalVerifyBtn.style.display = "inline-block";
              } else {
                modalVerifyBtn.style.display = "none";
              }
            }
            if (modal) modal.classList.add("open");
          });

          el.addEventListener("mouseenter", () => {
            setActiveIndex(idx, true);
          });
        });

        setTimeout(updateArrowPosition, 80);
      };

      modalCloseBtn?.addEventListener("click", () => {
        if (modal) modal.classList.remove("open");
        updateArrowPosition();
      });

      modal?.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("open");
          updateArrowPosition();
        }
      });

      // Two-stage responsive wheel scrolling on #cert-panel-grid
      if (scroller) {
        scroller.addEventListener(
          "wheel",
          (e) => {
            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;
            const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4;
            const atTop = scroller.scrollTop <= 4;

            if (isScrollingDown) {
              if (!atBottom) {
                e.stopPropagation();
                e.preventDefault();
                scroller.scrollTop += e.deltaY * 0.95;
                updateArrowPosition();
              } else {
                window.scrollBy({ top: e.deltaY, behavior: "auto" });
              }
            } else if (isScrollingUp) {
              if (!atTop) {
                e.stopPropagation();
                e.preventDefault();
                scroller.scrollTop += e.deltaY * 0.95;
                updateArrowPosition();
              } else {
                window.scrollBy({ top: e.deltaY, behavior: "auto" });
              }
            }
          },
          { passive: false }
        );

        scroller.addEventListener("scroll", updateArrowPosition, { passive: true });
      }

      certOv.addEventListener(
        "wheel",
        (e) => {
          if (!scroller || !scroller.contains(e.target as Node)) {
            window.scrollBy({ top: e.deltaY, behavior: "auto" });
          }
        },
        { passive: true }
      );

      // Initial render with clean in-progress and planned items (no fake earned items)
      renderCertCards([
        {
          id: "csc-professional",
          label: "Civil Service Exam — Professional Level",
          issuing_body: "Civil Service Commission",
          status: "in-progress",
          badge_icon: "award",
          verify_url: "https://www.csc.gov.ph",
        },
        {
          id: "tesda-css-nc2",
          label: "Computer Systems Servicing NC II",
          issuing_body: "TESDA",
          status: "in-progress",
          badge_icon: "check",
          verify_url: "https://www.tesda.gov.ph",
        },
        {
          id: "cisco-cybersecurity",
          label: "Intro to Cybersecurity & Networking",
          issuing_body: "Cisco Networking Academy",
          status: "in-progress",
          badge_icon: "shield",
          verify_url: "https://www.netacad.com",
        },
        {
          id: "pwncollege-badge",
          label: "pwn.college — Program Security Path",
          issuing_body: "pwn.college & ASU",
          status: "in-progress",
          badge_icon: "shield",
          verify_url: "https://pwn.college",
        },
        {
          id: "nextwork-cloud",
          label: "NextWork — Cloud-Native AI Engineering",
          issuing_body: "NextWork",
          status: "in-progress",
          badge_icon: "graduation",
          verify_url: "https://nextwork.org",
        },
        {
          id: "aws-cloud-practitioner",
          label: "AWS Certified Cloud Practitioner",
          issuing_body: "Amazon Web Services",
          status: "planned",
          badge_icon: "award",
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

      // Phase 1: Wipe 0 (Credentials) enters from right edge
      masterTl.fromTo(
        certOv,
        { clipPath: "inset(0 0 0 100%)", opacity: 1 },
        { clipPath: "inset(0 0 0 0%)", opacity: 1, ease: "power3.inOut", duration: 0.5 },
        0
      );

      // Phase 2 (AT 0.8): Wipe 0 exits clipping upward WHILE Wipe 1 enters from right!
      masterTl.to(
        certOv,
        {
          clipPath: "inset(0% 0 100% 0)",
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
