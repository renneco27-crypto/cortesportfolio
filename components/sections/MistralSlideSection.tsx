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
      /* ── 0. Create Overlay 0: Verified Credentials (Panel before Selected Works) ── */
      const certOv = document.createElement("div");
      certOv.style.cssText =
        "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:60;" +
        "pointer-events:none;opacity:0;clip-path:inset(0 0 0 100%);" +
        "background:rgba(5, 5, 5, 0.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);" +
        "overflow:hidden;";

      certOv.innerHTML = `
        <div style="
          position:absolute;inset:0;display:flex;align-items:center;
          padding:0 8vw;box-sizing:border-box;gap:4rem;">

          <!-- Left: Editorial text block -->
          <div style="flex:1;max-width:500px;padding-right:2rem;">
            <div style="
              font-family:'Courier New',monospace;font-size:0.7rem;letter-spacing:4px;
              text-transform:uppercase;color:#e63946;margin-bottom:2.5rem;
              display:flex;align-items:center;gap:12px;">
              <span style="display:inline-block;width:32px;height:1px;background:#e63946;"></span>
              02 / VERIFIED CREDENTIALS
            </div>

            <h2 style="
              font-size:clamp(2.6rem,5.5vw,4.8rem);font-weight:200;
              letter-spacing:-0.04em;line-height:0.92;
              color:#fff;margin:0 0 2rem;
              text-transform:uppercase;">
              Technical<br/>
              <span style="color:#e63946;">Certifications</span><br/>
              &amp; Badges.
            </h2>

            <p style="
              color:#aaa;font-size:0.85rem;line-height:1.7;
              font-weight:300;margin-bottom:2.5rem;max-width:380px;
              border-left:2px solid rgba(230,57,70,0.5);padding-left:1.25rem;">
              Civil service eligibility, cloud engineering credentials, systems servicing, and cybersecurity paths. Synced live with Supabase telemetry.
            </p>

            <div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;">
              <div style="
                font-family:'Courier New',monospace;font-size:0.68rem;letter-spacing:2px;
                text-transform:uppercase;color:#4ade80;background:rgba(74,222,128,0.08);
                border:1px solid rgba(74,222,128,0.25);padding:8px 16px;border-radius:2px;
                display:inline-flex;align-items:center;gap:8px;">
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#4ade80;"></span>
                SUPABASE LIVE SYNC
              </div>
              <div style="
                font-family:'Courier New',monospace;font-size:0.68rem;letter-spacing:2px;
                text-transform:uppercase;color:#888;">
                PH &bull; GLOBAL CREDENTIALS
              </div>
            </div>
          </div>

          <!-- Right: Dynamic Credentials Cards Grid -->
          <div id="cert-panel-grid" style="
            flex:1.2;display:flex;flex-direction:column;gap:10px;
            max-width:580px;max-height:82vh;overflow-y:auto;padding-right:8px;">
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

      document.body.appendChild(certOv);
      overlays.push(certOv);

      // Render credential cards helper
      const renderCertCards = (
        items: Array<{
          id: string;
          label: string;
          issuing_body: string;
          status: string;
          badge_icon: string;
          verify_url?: string;
        }>
      ) => {
        const grid = certOv.querySelector("#cert-panel-grid");
        if (!grid) return;
        grid.innerHTML = items
          .map((c) => {
            const isEarned = c.status === "earned";
            const statusColor = isEarned ? "#4ade80" : "#facc15";
            const statusBg = isEarned ? "rgba(74,222,128,0.1)" : "rgba(250,204,21,0.1)";
            const statusBorder = isEarned ? "rgba(74,222,128,0.25)" : "rgba(250,204,21,0.25)";
            const statusLabel = isEarned ? "EARNED" : c.status === "in-progress" ? "IN PROGRESS" : "PLANNED";

            const iconSvg =
              c.badge_icon === "shield"
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
                : c.badge_icon === "graduation"
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
                : c.badge_icon === "check"
                ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
                : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`;

            return `
              <div style="
                background:rgba(15,15,18,0.85);border:1px solid rgba(255,255,255,0.09);
                padding:12px 18px;border-radius:2px;display:flex;align-items:center;
                justify-content:space-between;gap:14px;transition:all 0.2s;"
                onmouseover="this.style.borderColor='${statusColor}';this.style.background='rgba(255,255,255,0.03)';"
                onmouseout="this.style.borderColor='rgba(255,255,255,0.09)';this.style.background='rgba(15,15,18,0.85)';">
                <div style="display:flex;align-items:center;gap:14px;min-width:0;">
                  <div style="
                    width:36px;height:36px;border-radius:2px;background:${statusBg};
                    border:1px solid ${statusBorder};display:flex;align-items:center;
                    justify-content:center;flex-shrink:0;">
                    ${iconSvg}
                  </div>
                  <div style="min-width:0;">
                    <div style="font-size:0.85rem;color:#fff;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                      ${c.label}
                    </div>
                    <div style="font-family:'Courier New',monospace;font-size:0.65rem;color:#777;letter-spacing:1px;margin-top:2px;">
                      ${c.issuing_body}
                    </div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">
                  <span style="
                    font-family:'Courier New',monospace;font-size:0.6rem;letter-spacing:1.5px;
                    color:${statusColor};background:${statusBg};border:1px solid ${statusBorder};
                    padding:3px 8px;border-radius:2px;font-weight:600;">
                    ${statusLabel}
                  </span>
                  ${
                    c.verify_url
                      ? `<a href="${c.verify_url}" target="_blank" rel="noopener noreferrer" style="color:#666;display:inline-flex;align-items:center;transition:color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#666'"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>`
                      : ""
                  }
                </div>
              </div>
            `;
          })
          .join("");
      };

      // Initial render with defaults
      renderCertCards([
        { id: "csc-professional", label: "Civil Service Exam — Professional Level", issuing_body: "Civil Service Commission (CSC), Philippines", status: "earned", badge_icon: "award", verify_url: "https://www.csc.gov.ph" },
        { id: "tesda-css-nc2", label: "Computer Systems Servicing NC II", issuing_body: "TESDA", status: "earned", badge_icon: "check", verify_url: "https://www.tesda.gov.ph" },
        { id: "cisco-cybersecurity", label: "Intro to Cybersecurity & Networking Basics", issuing_body: "Cisco Networking Academy", status: "earned", badge_icon: "shield", verify_url: "https://www.netacad.com" },
        { id: "pwncollege-badge", label: "pwn.college — Program Security Path", issuing_body: "pwn.college", status: "in-progress", badge_icon: "shield", verify_url: "https://pwn.college" },
        { id: "nextwork-cloud", label: "NextWork — Cloud-Native AI Engineering", issuing_body: "NextWork", status: "in-progress", badge_icon: "graduation", verify_url: "https://nextwork.org" },
        { id: "aws-cloud-practitioner", label: "AWS Certified Cloud Practitioner", issuing_body: "Amazon Web Services", status: "planned", badge_icon: "award", verify_url: "https://aws.amazon.com/certification" },
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
              03 / ARCHITECTURAL WORKS
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
                04 / COMMUNICATION PROTOCOL
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
                  Transmission / Message *
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

      // Phase 2 (AT EXACT SAME INSTANT 0.8): Wipe 0 exits clipping upward WHILE Wipe 1 enters from right!
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
          duration: 0.55,
          onStart: () => {
            gsap.set(ov1, { opacity: 1, pointerEvents: "auto" });
          },
        },
        0.8
      );

      // Phase 3 (AT EXACT SAME INSTANT 1.6): Wipe 1 exits clipping upward WHILE Wipe 2 (Contact) enters!
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
          duration: 0.55,
          onStart: () => {
            gsap.set([leftOv, rightOv], { opacity: 1, pointerEvents: "auto" });
          },
        },
        1.6
      );

      masterTl.fromTo(
        rightOv,
        { clipPath: "inset(0 0 100% 0)", opacity: 1 },
        { clipPath: "inset(0 0 0% 0)", opacity: 1, ease: "power3.inOut", duration: 0.55 },
        1.6
      );

      // Phase 4: Initiate Contact stays locked in place until the end of the page (no upward clip exit)
      masterTl.to(
        [leftOv, rightOv],
        { clipPath: "inset(0% 0 0% 0)", opacity: 1, duration: 0.5 },
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
