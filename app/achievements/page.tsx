"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AchievementsPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ==========================================================================
       SYNTHESIZED WEB AUDIO API SOUND SYSTEM
       ========================================================================== */
    class ComicAudioEngine {
      ctx: AudioContext | null = null;
      muted: boolean = false;

      init() {
        if (!this.ctx) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioContextClass) {
            this.ctx = new AudioContextClass();
          }
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

    const audio = new ComicAudioEngine();

    const root = containerRef.current;
    if (!root) return;

    const scroller = root.querySelector("#menuScroller") as HTMLElement | null;
    const menuZone = root.querySelector("#menuZone") as HTMLElement | null;
    const floatingArrow = root.querySelector("#floatingArrow") as HTMLElement | null;
    const stage = root.querySelector("#game-stage") as HTMLElement | null;
    const items = Array.from(root.querySelectorAll(".menu-item-slot")) as HTMLElement[];
    const actionModal = root.querySelector("#actionModal") as HTMLElement | null;
    const modalTitle = root.querySelector("#modalTitle") as HTMLElement | null;
    const modalDesc = root.querySelector("#modalDesc") as HTMLElement | null;
    const modalCloseBtn = root.querySelector("#modalCloseBtn") as HTMLElement | null;
    const soundToggleBtn = root.querySelector("#soundToggleBtn") as HTMLElement | null;
    const soundIcon = root.querySelector("#soundIcon") as HTMLElement | null;
    const exitBtn = root.querySelector("#exitBtn") as HTMLElement | null;
    const bgLayer = root.querySelector("#bgLayer") as HTMLElement | null;
    const characterLayer = root.querySelector("#characterLayer") as HTMLElement | null;
    const profileBadge = root.querySelector("#profileBadge") as HTMLElement | null;

    if (!scroller || !menuZone || !floatingArrow || !stage || !actionModal || !modalTitle || !modalDesc) {
      return;
    }

    let activeIndex = 0;
    let autoScrollSpeed = 0;
    let lastClientY: number | null = null;
    let isMouseOverMenu = false;
    let animFrameId: number;

    function updateArrowPosition() {
      const activeItem = items[activeIndex];
      if (!activeItem || !floatingArrow || !stage) return;

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
      if (newIndex >= items.length) newIndex = items.length - 1;

      if (newIndex !== activeIndex) {
        if (playSound) audio.playTick();
        activeIndex = newIndex;

        items.forEach((item, idx) => {
          if (idx === activeIndex) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });

        const shiftY = (activeIndex - (items.length - 1) / 2) * -3;
        if (bgLayer) {
          bgLayer.style.transform = `scale(1.02) translateY(${shiftY}px)`;
        }
        if (characterLayer) {
          characterLayer.style.transform = `translateX(-50%) translateY(${shiftY * 1.5}px)`;
        }
      }

      updateArrowPosition();
    }

    function updateItemUnderCursor() {
      if (lastClientY === null) return;

      let closestIdx = activeIndex;
      let minDistance = Infinity;

      items.forEach((item, idx) => {
        const rect = item.getBoundingClientRect();
        if (lastClientY !== null && lastClientY >= rect.top && lastClientY <= rect.bottom) {
          closestIdx = idx;
          minDistance = 0;
        } else {
          const center = rect.top + rect.height / 2;
          const dist = Math.abs((lastClientY || 0) - center);
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

    const onMouseEnter = (e: MouseEvent) => {
      isMouseOverMenu = true;
      audio.init();
      lastClientY = e.clientY;
      updateItemUnderCursor();
    };

    const onMouseMove = (e: MouseEvent) => {
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
    };

    const onMouseLeave = () => {
      isMouseOverMenu = false;
      autoScrollSpeed = 0;
      lastClientY = null;
    };

    menuZone.addEventListener("mouseenter", onMouseEnter);
    menuZone.addEventListener("mousemove", onMouseMove);
    menuZone.addEventListener("mouseleave", onMouseLeave);

    function autoScrollLoop() {
      if (autoScrollSpeed !== 0 && scroller) {
        scroller.scrollTop += autoScrollSpeed;
        if (isMouseOverMenu && lastClientY !== null) {
          updateItemUnderCursor();
        } else {
          updateArrowPosition();
        }
      }
      animFrameId = requestAnimationFrame(autoScrollLoop);
    }
    animFrameId = requestAnimationFrame(autoScrollLoop);

    const onScroll = () => {
      if (isMouseOverMenu && lastClientY !== null) {
        updateItemUnderCursor();
      } else {
        updateArrowPosition();
      }
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      audio.init();
      autoScrollSpeed = 0;

      scroller.scrollBy({
        top: e.deltaY * 1.1,
        behavior: "auto",
      });

      updateItemUnderCursor();
    };
    menuZone.addEventListener("wheel", onWheel, { passive: false });

    function triggerItemAction(item: HTMLElement) {
      audio.playSelect();
      if (floatingArrow) floatingArrow.classList.remove("visible");
      const actionName = item.dataset.action || "";
      const desc = item.dataset.desc || "";

      if (modalTitle) modalTitle.textContent = actionName;
      if (modalDesc) modalDesc.textContent = desc;
      if (actionModal) actionModal.classList.add("open");
    }

    const itemClickHandlers: (() => void)[] = [];
    items.forEach((item, idx) => {
      const handler = () => {
        audio.init();
        if (idx === activeIndex) {
          triggerItemAction(item);
        } else {
          setActiveIndex(idx, true);
        }
      };
      itemClickHandlers.push(handler);
      item.addEventListener("click", handler);
    });

    const onResize = () => {
      updateArrowPosition();
    };
    window.addEventListener("resize", onResize);

    function closeModal() {
      audio.playCancel();
      if (actionModal) actionModal.classList.remove("open");
      updateArrowPosition();
    }

    modalCloseBtn?.addEventListener("click", closeModal);
    const onModalClick = (e: MouseEvent) => {
      if (e.target === actionModal) closeModal();
    };
    actionModal.addEventListener("click", onModalClick);

    function triggerExit() {
      audio.playSelect();
      if (floatingArrow) floatingArrow.classList.remove("visible");
      if (modalTitle) modalTitle.textContent = "RETURN TO PORTFOLIO";
      if (modalDesc) modalDesc.textContent = "Exit achievements console and return to the main engineering showcase?";
      if (modalCloseBtn) {
        modalCloseBtn.textContent = "RETURN TO HOME";
        const returnHomeHandler = () => {
          router.push("/");
        };
        modalCloseBtn.onclick = returnHomeHandler;
      }
      if (actionModal) actionModal.classList.add("open");
    }

    exitBtn?.addEventListener("click", triggerExit);

    const onSoundToggle = () => {
      const isMuted = audio.toggleMute();
      if (!soundIcon) return;
      if (isMuted) {
        soundIcon.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>`;
      } else {
        audio.playSelect();
        soundIcon.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`;
      }
    };
    soundToggleBtn?.addEventListener("click", onSoundToggle);

    const onProfileClick = () => {
      audio.playSelect();
      if (floatingArrow) floatingArrow.classList.remove("visible");
      if (modalTitle) modalTitle.textContent = "ENGINEER DOSSIER";
      if (modalDesc) modalDesc.textContent = "LAWRENCE MANZO CORTES — Full-Stack Developer & IT Student. Next milestone: Technical Internship.";
      if (modalCloseBtn) {
        modalCloseBtn.textContent = "CONFIRM";
        modalCloseBtn.onclick = closeModal;
      }
      if (actionModal) actionModal.classList.add("open");
    };
    profileBadge?.addEventListener("click", onProfileClick);

    const squadSlots = root.querySelectorAll(".squad-slot");
    squadSlots.forEach((slot) => {
      slot.addEventListener("click", () => {
        audio.playSelect();
        if (floatingArrow) floatingArrow.classList.remove("visible");
        const member = (slot as HTMLElement).dataset.squad || "SQUAD";
        if (modalTitle) modalTitle.textContent = member;
        if (modalDesc) modalDesc.textContent = "Engineering Core Companion status: Active & Synchronized.";
        if (modalCloseBtn) {
          modalCloseBtn.textContent = "CONFIRM";
          modalCloseBtn.onclick = closeModal;
        }
        if (actionModal) actionModal.classList.add("open");
      });
    });

    setActiveIndex(0, false);
    scroller.scrollTop = 0;
    const timeoutId = setTimeout(updateArrowPosition, 120);

    return () => {
      cancelAnimationFrame(animFrameId);
      clearTimeout(timeoutId);
      menuZone.removeEventListener("mouseenter", onMouseEnter);
      menuZone.removeEventListener("mousemove", onMouseMove);
      menuZone.removeEventListener("mouseleave", onMouseLeave);
      menuZone.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      actionModal.removeEventListener("click", onModalClick);
      modalCloseBtn?.removeEventListener("click", closeModal);
      exitBtn?.removeEventListener("click", triggerExit);
      soundToggleBtn?.removeEventListener("click", onSoundToggle);
      profileBadge?.removeEventListener("click", onProfileClick);
      items.forEach((item, idx) => {
        item.removeEventListener("click", itemClickHandlers[idx]);
      });
    };
  }, [router]);

  return (
    <div ref={containerRef} className="achievements-page-container">
      {/* Navigation Return Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-[999] px-4 py-2 bg-black/80 hover:bg-[#ff2a85] text-white border-2 border-white/20 hover:border-white rounded-md font-mono text-xs uppercase tracking-widest backdrop-blur-md transition-all shadow-lg flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">←</span>
        <span>Portfolio Main</span>
      </Link>

      <div id="game-stage">
        {/* Art Backdrop Layer */}
        <div className="bg-layer" id="bgLayer"></div>
        <div className="halftone-ambient"></div>

        {/* Center Character Layer */}
        <div className="character-center-layer" id="characterLayer">
          <img src="/assets/person_new.png" alt="Character" className="character-img" />
        </div>

        {/* Floating Comic Arrow */}
        <div className="floating-menu-arrow" id="floatingArrow">
          <svg viewBox="0 0 24 24">
            <polygon points="3,2 22,12 3,22" fill="#00e5ff" stroke="#000" strokeWidth="2.5" />
          </svg>
        </div>

        {/* Top Navigation Bar */}
        <header className="top-bar">
          {/* Player Profile Badge */}
          <div className="profile-badge" id="profileBadge" title="Player Dossier">
            <div className="avatar-frame">
              <img src="/assets/avatar.png" alt="Avatar" />
            </div>
            <div className="profile-info">
              <span className="profile-name">LAWRENCE CORTES</span>
              <span className="profile-lvl">LVL 23 INTERN</span>
            </div>
          </div>

          {/* Currencies & Audio Controls */}
          <div className="currencies-group">
            <div className="currency-pill" title="Volcano Embers">
              <div className="currency-icon coin-fire">🔥</div>
              <span>564</span>
            </div>
            <div className="currency-pill" title="Starlight Shards">
              <div className="currency-icon token-diamond">💎</div>
              <span>12,987</span>
            </div>
            <button className="sound-btn" id="soundToggleBtn" title="Toggle Sound FX">
              <svg id="soundIcon" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Bottom Left Squad */}
        <div className="bottom-squad">
          <div className="squad-slot" data-squad="MEI OM">
            <div className="squad-frame">
              <img src="/assets/squad_mei.png" alt="MEI OM" />
            </div>
            <div className="squad-name-tag">MEI OM</div>
          </div>
          <div className="squad-slot" data-squad="ZEK TIM">
            <div className="squad-frame">
              <img src="/assets/squad_zek.png" alt="ZEK TIM" />
            </div>
            <div className="squad-name-tag">ZEK TIM</div>
          </div>
          <div className="squad-slot" data-squad="SAD PI">
            <div className="squad-frame">
              <img src="/assets/squad_sad.png" alt="SAD PI" />
            </div>
            <div className="squad-name-tag">SAD PI</div>
          </div>
        </div>

        {/* Bottom Right Exit Button */}
        <button className="exit-btn" id="exitBtn" title="Exit to Portfolio">
          <span>EXIT</span>
          <svg viewBox="0 0 24 24">
            <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          </svg>
        </button>

        {/* 3D Slanted Action Menu Bay */}
        <section className="menu-right-zone" id="menuZone">
          <div className="menu-carousel-wrapper">
            <div className="menu-scroller" id="menuScroller">
              {/* Item 1: Start */}
              <div className="menu-item-slot active" data-action="CIVIL SERVICE EXAM" data-desc="Professional Level Eligibility — Civil Service Commission (CSC), Philippines. Achieved civil service passing score for government IT and technical infrastructure.">
                <div className="comic-btn-face btn-start">
                  <span className="menu-text">CSC EXAM</span>
                </div>
              </div>

              {/* Item 2: Continue */}
              <div className="menu-item-slot" data-action="COMPUTER SYSTEMS NC II" data-desc="Computer Systems Servicing NC II — Technical Education and Skills Development Authority (TESDA). Hardware assembly, system servicing, LAN deployment, and client configuration.">
                <div className="comic-btn-face btn-continue">
                  <span className="menu-text">TESDA NC II</span>
                </div>
              </div>

              {/* Item 3: Options */}
              <div className="menu-item-slot" data-action="CYBERSECURITY BASICS" data-desc="Intro to Cybersecurity & Networking Basics — Cisco Networking Academy. Packet inspection, defense in depth, firewall routing, and protocol telemetry.">
                <div className="comic-btn-face btn-options">
                  <span className="menu-text">CISCO CYBER</span>
                </div>
              </div>

              {/* Item 4: Achievements */}
              <div className="menu-item-slot" data-action="PWN.COLLEGE PATH" data-desc="Program Security & Binary Exploitation Path — pwn.college & Arizona State University (ASU). Low-level memory safety, reverse engineering, and offensive defense foundations.">
                <div className="comic-btn-face btn-achievements">
                  <span className="menu-text">PWN.COLLEGE</span>
                </div>
              </div>

              {/* Item 5: Credits */}
              <div className="menu-item-slot" data-action="CLOUD-NATIVE AI" data-desc="Cloud-Native AI Engineering — NextWork. Scalable container deployment, serverless microservices, and AI inference pipelines.">
                <div className="comic-btn-face btn-credits">
                  <span className="menu-text">NEXTWORK AI</span>
                </div>
              </div>

              {/* Item 6: Load Game */}
              <div className="menu-item-slot" data-action="AWS CERTIFIED CLOUD" data-desc="AWS Certified Cloud Practitioner — Amazon Web Services roadmap. Cloud architectures, security shared model, VPC networking, and cost telemetry.">
                <div className="comic-btn-face btn-load">
                  <span className="menu-text">AWS CLOUD</span>
                </div>
              </div>

              {/* Item 7: Gallery */}
              <div className="menu-item-slot" data-action="SYSTEMS REPERTORY" data-desc="Full portfolio catalog: Next.js edge apps, AI systems, codal repositories, and screen readers.">
                <div className="comic-btn-face btn-gallery">
                  <span className="menu-text">PROJECTS</span>
                </div>
              </div>

              {/* Item 8: Quit */}
              <div className="menu-item-slot" data-action="RETURN TO PORTFOLIO" data-desc="Return to the main engineering portfolio showcase.">
                <div className="comic-btn-face btn-quit">
                  <span className="menu-text">MAIN SITE</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Dialog for Item Actions */}
        <div className="action-modal-overlay" id="actionModal">
          <div className="action-modal-box">
            <h2 className="modal-title" id="modalTitle">ACHIEVEMENT DETAILS</h2>
            <p className="modal-desc" id="modalDesc">Loading achievement telemetry...</p>
            <button className="modal-btn" id="modalCloseBtn">CONFIRM</button>
          </div>
        </div>
      </div>

      <style jsx global>{`
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

        .achievements-page-container {
          background: #070210;
          color: #fff;
          font-family: var(--font-comic);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
          user-select: none;
          -webkit-user-select: none;
        }

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
        }

        .bg-layer {
          position: absolute;
          inset: 0;
          background: url('/assets/background.jpg') no-repeat center center;
          background-size: cover;
          transform: scale(1.002);
          transition: transform 0.4s ease-out;
          z-index: 1;
        }

        .halftone-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(rgba(0, 0, 0, 0.1) 18%, transparent 18%);
          background-size: 8px 8px;
          opacity: 0.35;
          z-index: 2;
        }

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
          width: 86%;
          min-height: 60px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          cursor: pointer;
          transform-origin: center right;
          transform: rotateY(-16deg) rotateX(4deg) rotateZ(-2.8deg) skewX(-17deg) scale(0.93);
          transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.18s ease;
          opacity: 0.8;
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
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .btn-start {
          background: linear-gradient(100deg, #00d2ff 0%, #0077ff 100%);
        }
        .btn-continue {
          background: linear-gradient(100deg, #00f2fe 0%, #4facfe 100%);
        }
        .btn-options {
          background: linear-gradient(100deg, #ffffff 0%, #e6edf5 100%);
        }
        .btn-options .menu-text {
          color: #0b071a !important;
          text-shadow: 2px 2px 0px #9da9b8 !important;
        }
        .btn-achievements {
          background: linear-gradient(100deg, #ffc837 0%, #ff8008 100%);
        }
        .btn-credits {
          background: linear-gradient(100deg, #ffe259 0%, #ffa751 100%);
        }
        .btn-load {
          background: linear-gradient(100deg, #8a2387 0%, #e94057 100%);
        }
        .btn-gallery {
          background: linear-gradient(100deg, #ff007f 0%, #a40606 100%);
        }
        .btn-quit {
          background: linear-gradient(100deg, #eb3349 0%, #f45c43 100%);
        }

        .menu-text {
          position: relative;
          font-size: 1.95rem;
          font-weight: 900;
          font-style: italic;
          letter-spacing: 2px;
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
        }

        .menu-item-slot.active .menu-text {
          transform: scale(1.05);
          letter-spacing: 3px;
        }

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
          gap: 12px;
          background: rgba(14, 6, 27, 0.85);
          padding: 6px 14px 6px 8px;
          border: 2.5px solid #000;
          border-left: 4px solid var(--comic-cyan);
          box-shadow: 4px 4px 0 #000;
          transform: rotate(-2.5deg) skewX(-15deg);
          pointer-events: auto;
          cursor: pointer;
          transition: transform 0.15s;
        }

        .profile-badge:hover {
          transform: rotate(-2.5deg) skewX(-15deg) scale(1.04);
        }

        .avatar-frame {
          width: 44px;
          height: 44px;
          background: #ffb703;
          border: 2px solid #000;
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
        }

        .profile-name {
          font-size: 1.05rem;
          font-weight: 900;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-shadow: 2px 2px 0 #000;
        }

        .profile-lvl {
          font-size: 0.85rem;
          font-weight: 900;
          color: var(--comic-pink);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          text-shadow: 1px 1px 0 #000;
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
          font-weight: 900;
          font-size: 1.35rem;
          cursor: default;
          transition: transform 0.15s;
        }

        .currency-pill:hover {
          transform: scale(1.05);
        }

        .currency-icon {
          width: 32px;
          height: 32px;
          margin-right: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 2px 2px 0 #000;
          border: 2px solid #000;
        }

        .coin-fire {
          background: radial-gradient(circle, #ff9f1c 20%, #e71d36 90%);
        }

        .token-diamond {
          background: radial-gradient(circle, #2ec4b6 20%, #011627 90%);
        }

        .sound-btn {
          background: #000;
          border: 2px solid var(--comic-yellow);
          box-shadow: 3px 3px 0 var(--comic-cyan);
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
          transition: transform 0.15s, background-color 0.15s;
        }

        .sound-btn:hover {
          background: var(--comic-yellow);
          transform: scale(1.1);
        }

        .sound-btn svg {
          width: 22px;
          height: 22px;
          fill: var(--comic-yellow);
          transition: fill 0.15s;
        }

        .sound-btn:hover svg {
          fill: #000;
        }

        .exit-btn {
          position: absolute;
          bottom: 24px;
          right: 28px;
          z-index: 30;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
          padding: 8px 16px;
          transform: rotate(3deg) skewX(-15deg);
          cursor: pointer;
          font-weight: 900;
          font-size: 1.15rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transition: transform 0.15s, background-color 0.15s;
        }

        .exit-btn:hover {
          background: #ff2a85;
          color: #fff;
          transform: rotate(3deg) skewX(-15deg) scale(1.08);
          box-shadow: 6px 6px 0 #000;
        }

        .exit-btn svg {
          width: 22px;
          height: 22px;
          fill: currentColor;
        }

        .action-modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(8, 3, 18, 0.75);
          backdrop-filter: blur(5px);
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
          padding: 36px 48px;
          transform: skewX(-10deg) scale(0.9);
          transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-align: center;
          max-width: 500px;
        }

        .action-modal-overlay.open .action-modal-box {
          transform: skewX(-10deg) scale(1);
        }

        .modal-title {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--comic-yellow);
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 3px 3px 0 #000;
          margin-bottom: 12px;
        }

        .modal-desc {
          font-size: 1.1rem;
          color: #e0e5eb;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
          line-height: 1.5;
        }

        .modal-btn {
          background: var(--comic-cyan);
          color: #000;
          font-size: 1.1rem;
          font-weight: 900;
          text-transform: uppercase;
          padding: 10px 28px;
          border: 3px solid #000;
          box-shadow: 4px 4px 0 #fff;
          cursor: pointer;
          transform: skewX(-6deg);
          transition: transform 0.15s, background 0.15s;
        }

        .modal-btn:hover {
          background: var(--comic-yellow);
          transform: skewX(-6deg) scale(1.05);
        }
      `}</style>
    </div>
  );
}
