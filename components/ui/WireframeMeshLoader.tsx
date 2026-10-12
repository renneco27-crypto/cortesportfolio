"use client";

import React, { useEffect, useState } from "react";

export default function WireframeMeshLoader() {
  const [progress, setProgress] = useState(0);
  const [networkStatus, setNetworkStatus] = useState("CALIBRATING");
  const [isDone, setIsDone] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Lock body scroll while wireframe loader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 1. Detect Network Connection Speed (slow connection detection)
    interface NetworkInfo {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
      saveData?: boolean;
    }
    const nav = navigator as unknown as { connection?: NetworkInfo };
    const conn = nav.connection;
    let isSlow = false;
    if (conn) {
      if (
        conn.effectiveType === "slow-2g" ||
        conn.effectiveType === "2g" ||
        conn.effectiveType === "3g" ||
        (conn.rtt && conn.rtt > 500) ||
        (conn.downlink && conn.downlink < 1.5)
      ) {
        isSlow = true;
        setNetworkStatus(`SLOW NETWORK [${(conn.effectiveType || "LOW SPEED").toUpperCase()}] &bull; EXTENDING WIREFRAME`);
      } else {
        setNetworkStatus(`NETWORK ACTIVE [${(conn.effectiveType || "FAST").toUpperCase()}]`);
      }
    } else {
      setNetworkStatus("NETWORK ACTIVE // 2.0s WIREFRAME HOLD");
    }

    // 2. Minimum 2.0s (2000ms) Display Guarantee
    const MINIMUM_DURATION_MS = 2000;
    const startTime = performance.now();
    let pageLoaded = document.readyState === "complete";

    const handleWindowLoad = () => {
      pageLoaded = true;
    };

    if (!pageLoaded) {
      window.addEventListener("load", handleWindowLoad);
    }

    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const timeRatio = Math.min(elapsed / MINIMUM_DURATION_MS, 1);

      if (timeRatio < 1) {
        // First 2 seconds: progress up to 90%
        setProgress(Math.floor(timeRatio * 90));
      } else if (!pageLoaded) {
        // Slower connection: keep wireframe screen visible while assets load
        setNetworkStatus("SLOW INTERNET DETECTED &bull; STREAMING PAGE ASSETS");
        setProgress((prev) => Math.min(prev + 1, 98));
      } else {
        // Completed: at least 2.0s passed AND page is fully loaded
        setProgress(100);
        clearInterval(progressInterval);

        // Smooth transition reveal
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsDone(true);
            document.body.style.overflow = originalOverflow;
          }, 500); // 500ms fade transition
        }, 120);
      }
    }, 40);

    return () => {
      window.removeEventListener("load", handleWindowLoad);
      clearInterval(progressInterval);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#0c0c0d] flex flex-col justify-start items-center select-none overflow-hidden transition-opacity duration-500 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={isFading}
    >
      {/* ── Outer Browser Window Mockup Frame (YouTube Vector Wireframe aesthetic) ── */}
      <div className="w-full h-full flex flex-col bg-[#111113] border border-[#26262a] shadow-2xl overflow-y-auto">
        {/* Browser Top Window Bar */}
        <div className="w-full h-11 bg-[#18181c] border-b border-[#2a2a2f] px-4 md:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#3a3a42] border border-[#4a4a54]" />
            <div className="w-3 h-3 rounded-full bg-[#3a3a42] border border-[#4a4a54]" />
            <div className="w-3 h-3 rounded-full bg-[#3a3a42] border border-[#4a4a54]" />
          </div>

          {/* Browser Address Bar Wireframe */}
          <div className="wireframe-glint flex-1 max-w-md mx-4 h-6 rounded bg-[#222228] border border-[#35353e] flex items-center px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#555562] mr-2" />
            <div className="wireframe-stretch h-2 w-48 rounded bg-[#40404c]" />
          </div>

          {/* Window action controls */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded bg-[#2d2d36] border border-[#3d3d48]" />
            <div className="w-4 h-3 rounded bg-[#2d2d36] border border-[#3d3d48]" />
            <div className="w-4 h-3 rounded bg-[#2d2d36] border border-[#3d3d48]" />
          </div>
        </div>

        {/* ── Swiss Navbar Wireframe ── */}
        <div className="w-full h-14 bg-[#141418] border-b border-[#242429] px-6 md:px-12 flex items-center justify-between shrink-0">
          {/* Brand Logo Wireframe: Gray block with Red accent tag */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-6 rounded-sm bg-[#e63946] border border-[#ff4d5a] shadow-[0_0_12px_rgba(230,57,70,0.4)]" />
            <div className="wireframe-glint h-4 w-40 rounded bg-[#2b2b33] border border-[#3a3a44]" />
          </div>

          {/* Nav links wireframe */}
          <div className="hidden md:flex items-center gap-6">
            <div className="wireframe-glint h-3.5 w-16 rounded bg-[#282830] border border-[#363640]" />
            <div className="wireframe-glint h-3.5 w-24 rounded bg-[#282830] border border-[#363640]" />
            <div className="wireframe-glint h-3.5 w-20 rounded bg-[#282830] border border-[#363640]" />
            <div className="wireframe-glint h-3.5 w-18 rounded bg-[#282830] border border-[#363640]" />
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <div className="wireframe-glint h-7 w-20 rounded bg-[#24242c] border border-[#3b3b46]" />
            <div className="wireframe-glint h-7 w-24 rounded bg-[#2a2a34] border border-[#3f3f4c]" />
          </div>
        </div>

        {/* ── Main Wireframe Content Body (Vector Wireframe Layout) ── */}
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-8">
          {/* Top Hero Wireframe Block */}
          <div className="w-full flex flex-col items-center text-center pt-4 pb-2">
            {/* Tag / Category Eyebrow Wireframe */}
            <div className="wireframe-glint h-4 w-52 rounded bg-[#282832] border border-[#3d3d4a] mb-4" />

            {/* Giant Title Wireframe: Animated getting longer */}
            <div className="wireframe-stretch wireframe-glint h-10 md:h-14 w-3/4 max-w-2xl rounded bg-[#2e2e38] border border-[#444452] mb-3" />
            <div className="wireframe-stretch wireframe-glint h-8 md:h-10 w-1/2 max-w-md rounded bg-[#25252e] border border-[#3a3a46] mb-5" />

            {/* Subtitle Lines */}
            <div className="flex flex-col items-center gap-2 mb-6 w-full">
              <div className="wireframe-glint h-3 w-4/5 max-w-xl rounded bg-[#22222a] border border-[#33333e]" />
              <div className="wireframe-glint h-3 w-2/3 max-w-lg rounded bg-[#22222a] border border-[#33333e]" />
            </div>

            {/* Terminal Line Wireframe with Blinker */}
            <div className="wireframe-glint h-9 w-full max-w-md rounded bg-[#18181f] border border-[#2d2d38] flex items-center px-4 gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#e63946]" />
              <div className="wireframe-stretch h-3 w-64 rounded bg-[#363644]" />
              <div className="w-2 h-4 bg-white/70 animate-pulse ml-auto" />
            </div>
          </div>

          {/* ── Grid: Main Media / Feature Stage (Left) & Sidebar List (Right) ── */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Big Stage Frame (Like YouTube Main Video Frame in reference image) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="wireframe-glint relative w-full aspect-video md:h-96 rounded-md bg-[#18181e] border-2 border-[#2f2f3a] overflow-hidden flex flex-col justify-between p-4 md:p-6">
                {/* Top Corner Markers */}
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 rounded bg-[#2a2a34] border border-[#393946]" />
                  <div className="h-3 w-12 rounded bg-[#2a2a34] border border-[#393946]" />
                </div>

                {/* Central Play / Node Outline Accent */}
                <div className="self-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#24242d] border-2 border-[#454555] flex items-center justify-center shadow-lg">
                    <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[14px] border-l-[#e63946] ml-1" />
                  </div>
                  <div className="wireframe-stretch h-2.5 w-32 rounded bg-[#2f2f3c] mt-3" />
                </div>

                {/* Bottom Media Controls / Red Wireframe Scrub Bar */}
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full h-2 rounded-full bg-[#262630] overflow-hidden border border-[#343442]">
                    <div className="h-full bg-[#e63946] rounded-full transition-all duration-100" style={{ width: `${Math.max(progress, 25)}%` }} />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex gap-2">
                      <div className="w-3.5 h-3.5 rounded bg-[#33333f]" />
                      <div className="w-3.5 h-3.5 rounded bg-[#33333f]" />
                      <div className="w-3.5 h-3.5 rounded bg-[#33333f]" />
                    </div>
                    <div className="w-16 h-3 rounded bg-[#2f2f3b]" />
                  </div>
                </div>
              </div>

              {/* Lower Stage Info Card (Like Channel Bar in reference) */}
              <div className="w-full rounded-md bg-[#16161b] border border-[#2b2b35] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar / Icon box */}
                  <div className="w-12 h-12 rounded bg-[#282832] border border-[#3b3b48] shrink-0" />
                  <div className="flex flex-col gap-2">
                    <div className="wireframe-stretch wireframe-glint h-4 w-44 rounded bg-[#30303c] border border-[#40404f]" />
                    <div className="wireframe-glint h-3 w-60 rounded bg-[#22222a] border border-[#30303c]" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-24 rounded bg-[#e63946] border border-[#ff4d5a] flex items-center justify-center">
                    <div className="h-2.5 w-14 bg-white/70 rounded-sm" />
                  </div>
                  <div className="h-8 w-20 rounded bg-[#282832] border border-[#3c3c4a]" />
                </div>
              </div>
            </div>

            {/* Right Sidebar List (Like Related Videos in reference image) */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div
                  key={item}
                  className="w-full rounded-md bg-[#16161c] border border-[#2a2a34] p-2.5 flex gap-3 items-center"
                >
                  {/* Thumbnail box with gray fill & outline */}
                  <div className="wireframe-glint w-24 h-16 rounded bg-[#23232c] border border-[#383846] shrink-0 flex items-center justify-center">
                    <div className="w-4 h-4 rounded bg-[#333340] border border-[#444452]" />
                  </div>

                  {/* Multiline text bars (animated expanding width) */}
                  <div className="flex-1 flex flex-col gap-2">
                    <div
                      className="wireframe-stretch wireframe-glint h-3 rounded bg-[#2f2f3b] border border-[#3e3e4d]"
                      style={{
                        width: index % 2 === 0 ? "95%" : "82%",
                        animationDelay: `${index * 0.15}s`,
                      }}
                    />
                    <div
                      className="wireframe-glint h-2.5 rounded bg-[#23232b] border border-[#32323d]"
                      style={{ width: "65%" }}
                    />
                    <div
                      className="wireframe-glint h-2 rounded bg-[#1e1e25] border border-[#2c2c36]"
                      style={{ width: "45%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Telemetry / Progress Bar Bar ── */}
        <div className="w-full bg-[#141418] border-t border-[#26262c] px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#888894]">
            <span className="w-2 h-2 rounded-full bg-[#e63946] animate-ping" />
            <span className="text-white font-medium uppercase">VECTOR WIREFRAME SKELETON</span>
            <span className="text-[#555562]">&bull;</span>
            <span
              className="text-[#e63946] font-medium"
              dangerouslySetInnerHTML={{ __html: networkStatus }}
            />
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="font-mono text-xs text-white/90 font-semibold">{progress}%</span>
            <div className="w-44 h-2 bg-[#22222a] rounded-full overflow-hidden border border-[#32323d]">
              <div
                className="h-full bg-gradient-to-r from-[#e63946] to-white rounded-full transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-[#666672] uppercase hidden md:inline">
              [HOLD 2.0s]
            </span>
          </div>
        </div>
      </div>

      {/* Floating Chat Widget Wireframe (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-30 wireframe-glint flex items-center gap-3 bg-[#18181f] border-2 border-[#363644] rounded-full px-4 py-2.5 shadow-2xl">
        <div className="w-6 h-6 rounded-full bg-[#e63946] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
        <div className="wireframe-stretch h-3 w-24 rounded bg-[#33333f]" />
      </div>

      {/* Custom Wireframe Glint & Stretch Animations */}
      <style jsx>{`
        @keyframes glint {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .wireframe-glint {
          position: relative;
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.09) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: glint 2s infinite linear;
        }

        @keyframes expandLength {
          0%, 100% {
            transform: scaleX(0.92);
            transform-origin: left;
          }
          50% {
            transform: scaleX(1.04);
            transform-origin: left;
          }
        }

        .wireframe-stretch {
          animation: expandLength 2.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
