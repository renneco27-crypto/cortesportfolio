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
          #cert-panel-grid {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 30, 66, 0.6) rgba(255, 255, 255, 0.03);
          }
          #cert-panel-grid::-webkit-scrollbar {
            width: 6px;
          }
          #cert-panel-grid::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 9999px;
          }
          #cert-panel-grid::-webkit-scrollbar-thumb {
            background: rgba(255, 30, 66, 0.6);
            border-radius: 9999px;
            box-shadow: 0 0 8px rgba(255, 30, 66, 0.5);
          }
          #cert-panel-grid::-webkit-scrollbar-thumb:hover {
            background: #ff1e42;
          }
        </style>

        <div style="
          position:absolute;inset:0;display:flex;align-items:center;
          padding:0 8vw;box-sizing:border-box;gap:4rem;">

          <!-- Left: Editorial Header Block -->
          <div style="flex:1;max-width:440px;padding-right:1rem;">
            <!-- Angled Ribbon Pill Badge with Glassmorphism -->
            <div style="margin-bottom:1.4rem;">
              <div style="
                display:inline-block;
                background:rgba(255, 30, 66, 0.85);
                backdrop-filter:blur(10px);
                -webkit-backdrop-filter:blur(10px);
                border:1px solid rgba(255, 255, 255, 0.25);
                color:#fff;
                font-family:'Space Grotesk',-apple-system,sans-serif;
                font-size:0.68rem;
                font-weight:700;
                letter-spacing:2px;
                text-transform:uppercase;
                padding:6px 18px 6px 12px;
                clip-path:polygon(0 0, 92% 0, 100% 100%, 0 100%);
                box-shadow:0 0 24px rgba(255,30,66,0.45), inset 0 1px 1px rgba(255,255,255,0.35);">
                CREDENTIAL ARCHIVE
              </div>
            </div>

            <!-- Main Title with Split White + Red + Cyan Color Theory -->
            <h2 style="
              font-family:'Space Grotesk',-apple-system,sans-serif;
              font-size:clamp(2.4rem,4.8vw,4.2rem);
              font-weight:800;
              letter-spacing:-0.03em;
              line-height:0.95;
              margin:0 0 1.25rem;
              text-transform:uppercase;">
              <span style="color:#ffffff;">TECHNICAL</span><br/>
              <span style="color:#ff2a55;">CERTIFICATIONS</span><br/>
              <span style="color:#00e5ff;">&amp; BADGES.</span>
            </h2>

            <!-- Clean Glowing Horizon Separator Bar -->
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:1.5rem;">
              <div style="height:2px;width:52px;background:#ff1e42;box-shadow:0 0 10px #ff1e42;"></div>
              <div style="flex:1;height:1px;background:linear-gradient(90deg,rgba(255,30,66,0.6) 0%,rgba(0,229,255,0.4) 65%,transparent 100%);"></div>
            </div>

            <p style="
              color:#94a3b8;font-size:0.88rem;line-height:1.65;
              font-weight:400;margin:0;max-width:370px;
              border-left:2.5px solid #ff1e42;padding-left:1.25rem;">
              Verified government civil service eligibility, systems administration, cloud engineering, and cybersecurity certifications.
            </p>
          </div>

          <!-- Right: Scrollable Clean Glassmorphic Cards Container (HCI Compliant) -->
          <div id="cert-panel-grid" style="
            flex:1.3;
            display:flex;
            flex-direction:column;
            gap:10px;
            max-width:620px;
            max-height:82vh;
            overflow-y:auto;
            overscroll-behavior:contain;
            padding-right:12px;
            pointer-events:auto !important;
            touch-action:pan-y;">
          </div>
        </div>

        <!-- Subtle ambient grid -->
        <div style="
          position:absolute;inset:0;pointer-events:none;
          background-image:linear-gradient(rgba(255,30,66,0.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,229,255,0.03) 1px,transparent 1px);
          background-size:48px 48px;">
        </div>
      `;

      document.body.appendChild(certOv);
      overlays.push(certOv);

      // Render HCI-compliant, glassmorphic credential cards
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
        const grid = certOv.querySelector("#cert-panel-grid");
        if (!grid) return;
        grid.innerHTML = items
          .map((c) => {
            const isEarned = c.status === "earned";
            const isInProgress = c.status === "in-progress" || c.status === "pending";

            // Color theory with Glassmorphic Translucency & Specular Highlights
            const statusColor = isEarned ? "#00e676" : isInProgress ? "#ff2a55" : "#facc15";
            const statusBg = isEarned
              ? "rgba(0,230,118,0.12)"
              : isInProgress
              ? "rgba(255,42,85,0.12)"
              : "rgba(250,204,21,0.12)";
            const statusGradient = isEarned
              ? "linear-gradient(135deg, rgba(0,230,118,0.22) 0%, rgba(0,230,118,0.04) 100%)"
              : isInProgress
              ? "linear-gradient(135deg, rgba(255,42,85,0.22) 0%, rgba(255,42,85,0.04) 100%)"
              : "linear-gradient(135deg, rgba(250,204,21,0.22) 0%, rgba(250,204,21,0.04) 100%)";
            const statusBorder = isEarned
              ? "rgba(0,230,118,0.45)"
              : isInProgress
              ? "rgba(255,42,85,0.45)"
              : "rgba(250,204,21,0.45)";
            const statusShadow = isEarned
              ? "0 4px 14px rgba(0,230,118,0.2), inset 0 1px 1px rgba(255,255,255,0.3)"
              : isInProgress
              ? "0 4px 14px rgba(255,42,85,0.2), inset 0 1px 1px rgba(255,255,255,0.3)"
              : "0 4px 14px rgba(250,204,21,0.18), inset 0 1px 1px rgba(255,255,255,0.3)";
            const statusText = isEarned
              ? "EARNED"
              : isInProgress
              ? "IN PROGRESS"
              : "PLANNED";

            const iconSvg =
              c.badge_icon === "shield"
                ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff1e42" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
                : c.badge_icon === "graduation"
                ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff1e42" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
                : c.badge_icon === "check"
                ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff1e42" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
                : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff1e42" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;

            return `
              <div style="
                background:rgba(18,22,34,0.55);
                background-image:linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 100%);
                backdrop-filter:blur(16px) saturate(180%);
                -webkit-backdrop-filter:blur(16px) saturate(180%);
                border:1px solid rgba(255,255,255,0.12);
                border-left:3.5px solid #ff1e42;
                border-radius:12px;
                padding:1.05rem 1.35rem;
                box-sizing:border-box;
                display:flex;
                flex-direction:column;
                gap:0.6rem;
                box-shadow:0 8px 32px 0 rgba(0,0,0,0.45), inset 0 1px 1px 0 rgba(255,255,255,0.12);
                transition:transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
                pointer-events:auto;"
                onmouseover="this.style.borderColor='rgba(0,229,255,0.45)';this.style.borderLeftColor='#ff1e42';this.style.transform='translateX(4px)';this.style.boxShadow='0 12px 36px rgba(0,0,0,0.55), 0 0 20px rgba(0,229,255,0.15), inset 0 1px 1px rgba(255,255,255,0.2)';"
                onmouseout="this.style.borderColor='rgba(255,255,255,0.12)';this.style.borderLeftColor='#ff1e42';this.style.transform='translateX(0)';this.style.boxShadow='0 8px 32px 0 rgba(0,0,0,0.45), inset 0 1px 1px 0 rgba(255,255,255,0.12)';">

                <!-- Row 1: Icon + Title + Glassmorphic Status Pill -->
                <div style="display:flex;align-items:center;justify-content:space-between;gap:14px;">
                  <div style="display:flex;align-items:center;gap:10px;min-width:0;">
                    <span style="
                      display:inline-flex;align-items:center;justify-content:center;
                      width:28px;height:28px;border-radius:7px;
                      background:rgba(255,30,66,0.14);
                      background-image:linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,30,66,0.05) 100%);
                      backdrop-filter:blur(6px);
                      -webkit-backdrop-filter:blur(6px);
                      border:1px solid rgba(255,30,66,0.4);
                      box-shadow:inset 0 1px 1px rgba(255,255,255,0.25);
                      flex-shrink:0;">
                      ${iconSvg}
                    </span>
                    <h3 style="margin:0;font-size:0.94rem;font-weight:700;color:#ffffff;letter-spacing:0.2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                      ${c.label}
                    </h3>
                  </div>
                  <span style="
                    font-family:'Space Grotesk',sans-serif;
                    font-size:0.75rem;font-weight:800;letter-spacing:1px;
                    color:${statusColor};
                    background:${statusBg};
                    background-image:${statusGradient};
                    border:1px solid ${statusBorder};
                    box-shadow:${statusShadow};
                    backdrop-filter:blur(8px);
                    -webkit-backdrop-filter:blur(8px);
                    padding:5px 13px;border-radius:6px;white-space:nowrap;flex-shrink:0;">
                    ${statusText}
                  </span>
                </div>

                <!-- Row 2: Issuing Body + Official Link Glass Pill -->
                <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding-left:38px;">
                  <span style="font-size:0.8rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${c.issuing_body}
                  </span>
                  ${
                    c.verify_url
                      ? `<a href="${c.verify_url}" target="_blank" rel="noopener noreferrer" style="font-size:0.75rem;font-weight:600;color:#00e5ff;text-decoration:none;display:inline-flex;align-items:center;gap:4px;flex-shrink:0;background:rgba(0,229,255,0.08);background-image:linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(0,229,255,0.03) 100%);border:1px solid rgba(0,229,255,0.3);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:3px 9px;border-radius:6px;box-shadow:inset 0 1px 1px rgba(255,255,255,0.15);transition:border-color 0.2s, background 0.2s;" onmouseover="this.style.borderColor='#00e5ff';this.style.background='rgba(0,229,255,0.18)';" onmouseout="this.style.borderColor='rgba(0,229,255,0.3)';this.style.background='rgba(0,229,255,0.08)';">Official Link ↗</a>`
                      : ""
                  }
                </div>
              </div>
            `;
          })
          .join("");
      };

      // Direct wheel capture on #cert-panel-grid: isolates card scrolling completely so it stops at the bottom and never leaks to the next slide!
      const panelGrid = certOv.querySelector("#cert-panel-grid") as HTMLElement | null;
      if (panelGrid) {
        panelGrid.addEventListener(
          "wheel",
          (e) => {
            e.stopPropagation();
            e.preventDefault();
            panelGrid.scrollTop += e.deltaY * 0.85;
          },
          { passive: false }
        );
      }

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
        { clipPath: "inset(0 0 0 0%)", opacity: 1, ease: "power3.inOut", duration: 0.6 },
        0
      );

      // Phase 2 (AT 1.2): Wipe 0 holds in place, then exits clipping upward WHILE Wipe 1 enters from right!
      masterTl.to(
        certOv,
        {
          clipPath: "inset(0% 0 100% 0)",
          ease: "power3.inOut",
          duration: 0.55,
          onComplete: () => {
            gsap.set(certOv, { pointerEvents: "none" });
          },
        },
        1.2
      );

      masterTl.fromTo(
        ov1,
        { clipPath: "inset(0 0 0 100%)", opacity: 1 },
        {
          clipPath: "inset(0 0 0 0%)",
          opacity: 1,
          ease: "power3.inOut",
          duration: 0.55,
          onStart: () => {
            gsap.set(ov1, { opacity: 1, pointerEvents: "auto" });
          },
        },
        1.2
      );

      // Phase 3 (AT 2.3): Wipe 1 holds in place, then exits clipping upward WHILE Wipe 2 (Contact) enters!
      masterTl.to(
        ov1,
        {
          clipPath: "inset(0% 0 100% 0)",
          ease: "power3.inOut",
          duration: 0.55,
          onComplete: () => {
            gsap.set(ov1, { pointerEvents: "none" });
          },
        },
        2.3
      );

      masterTl.fromTo(
        leftOv,
        { clipPath: "inset(100% 0 0 0)", opacity: 1 },
        {
          clipPath: "inset(0% 0 0 0)",
          opacity: 1,
          ease: "power3.inOut",
          duration: 0.55,
          onStart: () => {
            gsap.set([leftOv, rightOv], { opacity: 1, pointerEvents: "auto" });
          },
        },
        2.3
      );

      masterTl.fromTo(
        rightOv,
        { clipPath: "inset(0 0 100% 0)", opacity: 1 },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, ease: "power3.inOut", duration: 0.55 },
        2.3
      );

      // Phase 4: Initiate Contact stays locked in place until the end of the page (no upward clip exit)
      masterTl.to(
        [leftOv, rightOv],
        { clipPath: "inset(0% 0 0% 0)", opacity: 1, duration: 0.5 },
        3.2
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
