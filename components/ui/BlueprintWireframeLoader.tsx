"use client";

import React, { useEffect, useState } from "react";

interface BlueprintWireframeLoaderProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
  showSkeletonDuration?: number;
  children?: React.ReactNode;
}

export default function BlueprintWireframeLoader({
  isLoading,
  onLoadingComplete,
  showSkeletonDuration = 1400,
  children,
}: BlueprintWireframeLoaderProps) {
  const [displayWireframe, setDisplayWireframe] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setDisplayWireframe(true);
      setFadeOut(false);

      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, showSkeletonDuration);

      const completeTimer = setTimeout(() => {
        setDisplayWireframe(false);
        onLoadingComplete?.();
      }, showSkeletonDuration + 300);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [isLoading, showSkeletonDuration, onLoadingComplete]);

  if (!displayWireframe) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.3s ease-out",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #0a0a0f 0%, #1a1a2e 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid background - blueprint style */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(to bottom, rgba(124, 58, 237, 0.08) 1px, transparent 1px), " +
              "linear-gradient(to right, rgba(124, 58, 237, 0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Animated corner glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "blueprintPulse 6s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Content container */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "4rem 1.5rem",
          }}
        >
          {/* ──── HEADER / HERO SECTION ──── */}
          <div style={{ marginBottom: "5rem" }}>
            <SkeletonLine width="35%" height="10px" style={{ marginBottom: "0.5rem" }} />
            <SkeletonLine width="60%" height="40px" style={{ marginBottom: "1.5rem" }} />
            <SkeletonLine width="65%" height="18px" />
            <SkeletonLine width="55%" height="18px" style={{ marginTop: "0.75rem" }} />

            {/* Hero action buttons */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <div
                style={{
                  width: "140px",
                  height: "44px",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(124, 58, 237, 0.08))",
                  border: "1px solid rgba(124, 58, 237, 0.2)",
                  animation: "shimmer 2.5s infinite",
                }}
              />
              <div
                style={{
                  width: "140px",
                  height: "44px",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))",
                  border: "1px solid rgba(124, 58, 237, 0.15)",
                  animation: "shimmer 2.5s infinite 0.1s",
                }}
              />
            </div>
          </div>

          {/* ──── PROJECTS SECTION ──── */}
          <div style={{ marginBottom: "5rem" }}>
            <SkeletonLine width="30%" height="32px" style={{ marginBottom: "2rem" }} />

            {/* 3-column project grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(124, 58, 237, 0.05)",
                    border: "1px solid rgba(124, 58, 237, 0.15)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Project image placeholder */}
                  <div
                    style={{
                      width: "100%",
                      height: "160px",
                      background:
                        "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                      animation: "shimmer 2.5s infinite",
                      border: "1px solid rgba(124, 58, 237, 0.1)",
                    }}
                  />
                  {/* Project title */}
                  <SkeletonLine width="75%" height="18px" style={{ marginBottom: "0.75rem" }} />
                  {/* Project description */}
                  <SkeletonLine width="100%" height="14px" />
                  <SkeletonLine width="90%" height="14px" style={{ marginTop: "0.5rem" }} />
                  {/* Tech stack tags */}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        style={{
                          height: "20px",
                          width: "60px",
                          background: "rgba(124, 58, 237, 0.12)",
                          borderRadius: "4px",
                          border: "1px solid rgba(124, 58, 237, 0.15)",
                          animation: "shimmer 2.5s infinite",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ──── SKILLS SECTION ──── */}
          <div style={{ marginBottom: "5rem" }}>
            <SkeletonLine width="25%" height="32px" style={{ marginBottom: "2rem" }} />

            {/* Skill categories grid */}
            {["Frontend", "Design", "AI/ML"].map((category) => (
              <div key={category} style={{ marginBottom: "2.5rem" }}>
                <SkeletonLine width="15%" height="16px" style={{ marginBottom: "1rem" }} />

                {/* Skill items in row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      style={{
                        background: "rgba(124, 58, 237, 0.08)",
                        border: "1px solid rgba(124, 58, 237, 0.15)",
                        borderRadius: "8px",
                        padding: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      {/* Skill icon placeholder */}
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                          background: "rgba(124, 58, 237, 0.15)",
                          animation: "shimmer 2.5s infinite",
                          flexShrink: 0,
                        }}
                      />
                      {/* Skill name */}
                      <div style={{ flex: 1 }}>
                        <SkeletonLine width="80%" height="12px" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ──── CONTACT SECTION ──── */}
          <div
            style={{
              background: "rgba(124, 58, 237, 0.06)",
              border: "1px solid rgba(124, 58, 237, 0.15)",
              borderRadius: "16px",
              padding: "3rem 2rem",
              textAlign: "center",
            }}
          >
            <SkeletonLine width="40%" height="32px" style={{ margin: "0 auto 1.5rem auto" }} />
            <SkeletonLine width="60%" height="16px" style={{ margin: "0 auto 2rem auto" }} />

            {/* Form inputs skeleton */}
            <div style={{ display: "grid", gap: "1rem", maxWidth: "500px", margin: "0 auto" }}>
              <SkeletonLine width="100%" height="40px" />
              <SkeletonLine width="100%" height="40px" />
              <SkeletonLine width="100%" height="100px" />
              <SkeletonLine width="100%" height="44px" />
            </div>
          </div>
        </div>

        {/* Styles */}
        <style>{`
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          @keyframes blueprintPulse {
            0%, 100% {
              opacity: 0.2;
              transform: scale(1);
            }
            50% {
              opacity: 0.35;
              transform: scale(1.05);
            }
          }
        `}</style>
      </div>
    </div>
  );
}

function SkeletonLine({
  width = "100%",
  height = "16px",
  style = {},
}: {
  width?: string;
  height?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        width,
        height,
        background:
          "linear-gradient(90deg, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.2) 50%, rgba(124, 58, 237, 0.08) 100%)",
        backgroundSize: "1000px 100%",
        borderRadius: "4px",
        animation: "shimmer 2.5s infinite",
        ...style,
      }}
    />
  );
}
