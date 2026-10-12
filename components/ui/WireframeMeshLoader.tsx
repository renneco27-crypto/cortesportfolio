"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function WireframeMeshLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [networkStatus, setNetworkStatus] = useState("CALIBRATING");
  const [isDone, setIsDone] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Lock scroll while loader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 1. Detect Network Connection Speed if API is available
    interface NetworkInfo {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
      saveData?: boolean;
    }
    const nav = navigator as unknown as { connection?: NetworkInfo };
    const conn = nav.connection;
    if (conn) {
      if (
        conn.effectiveType === "slow-2g" ||
        conn.effectiveType === "2g" ||
        conn.effectiveType === "3g" ||
        (conn.rtt && conn.rtt > 500) ||
        (conn.downlink && conn.downlink < 1.5)
      ) {
        setNetworkStatus(`SLOW NET [${(conn.effectiveType || "LOW BW").toUpperCase()}] // EXTENDING BUFFER`);
      } else {
        setNetworkStatus(`UPLINK ACTIVE [${(conn.effectiveType || "HIGH SPEED").toUpperCase()}]`);
      }
    } else {
      setNetworkStatus("UPLINK ACTIVE // HIGH SPEED");
    }

    // 2. Load duration tracking: minimum 2000ms display guarantee
    const MINIMUM_DURATION_MS = 2000;
    const startTime = performance.now();
    let pageLoaded = document.readyState === "complete";

    const handleWindowLoad = () => {
      pageLoaded = true;
    };

    if (!pageLoaded) {
      window.addEventListener("load", handleWindowLoad);
    }

    // Progress bar simulation that coordinates with actual page readiness
    const progressInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const timeRatio = Math.min(elapsed / MINIMUM_DURATION_MS, 1);

      if (timeRatio < 1) {
        // Increment up to ~85% smoothly across first 2 seconds
        setProgress(Math.floor(timeRatio * 85));
      } else if (!pageLoaded) {
        // Exceeded 2s but page still loading (slow internet)
        setNetworkStatus("SLOW INTERNET DETECTED // STREAMING ASSETS");
        setProgress((prev) => Math.min(prev + 1, 98));
      } else {
        // Both >= 2 seconds AND page fully loaded!
        setProgress(100);
        clearInterval(progressInterval);

        // Smooth fade-out sequence
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsDone(true);
            document.body.style.overflow = originalOverflow;
          }, 600); // 600ms fade duration
        }, 150);
      }
    }, 40);

    // 3. Three.js 3D Wireframe Mesh Scene
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animationFrameId: number | null = null;
    let handleResize: (() => void) | null = null;

    try {
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x050505, 0.035);

      const width = window.innerWidth;
      const height = window.innerHeight;

      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 3, 10);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // ── MESH 1: Undulating 3D Wireframe Terrain Mesh ──
      const terrainGeo = new THREE.PlaneGeometry(36, 36, 32, 32);
      terrainGeo.rotateX(-Math.PI / 2);

      const terrainMat = new THREE.MeshBasicMaterial({
        color: 0x333333,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      });

      const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
      terrainMesh.position.y = -2.5;
      scene.add(terrainMesh);

      // Store initial Y positions for wave calculation
      const posAttr = terrainGeo.attributes.position;
      const initialPositions = posAttr.array.slice();

      // ── MESH 2: Central Floating Wireframe Icosahedron Core ──
      const icosaGeo = new THREE.IcosahedronGeometry(2.2, 1);
      const icosaMat = new THREE.MeshBasicMaterial({
        color: 0xe63946, // Accent red
        wireframe: true,
        transparent: true,
        opacity: 0.85,
      });
      const icosaMesh = new THREE.Mesh(icosaGeo, icosaMat);
      icosaMesh.position.set(0, 0.5, 0);
      scene.add(icosaMesh);

      // Inner Wireframe Sphere for depth
      const innerGeo = new THREE.IcosahedronGeometry(1.4, 0);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      icosaMesh.add(innerMesh);

      // ── MESH 3: Vertex points on Core for glowing aesthetic ──
      const pointGeo = new THREE.IcosahedronGeometry(2.2, 1);
      const pointMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.12,
        transparent: true,
        opacity: 0.9,
      });
      const pointMesh = new THREE.Points(pointGeo, pointMat);
      icosaMesh.add(pointMesh);

      // Resize handler
      handleResize = () => {
        if (!renderer) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);

      // Animation Loop
      let clock = 0;
      const animate = () => {
        clock += 0.02;

        // Animate central wireframe rotation
        icosaMesh.rotation.x = clock * 0.4;
        icosaMesh.rotation.y = clock * 0.6;
        icosaMesh.rotation.z = Math.sin(clock * 0.3) * 0.2;
        icosaMesh.position.y = 0.5 + Math.sin(clock * 1.2) * 0.25;

        // Undulate wireframe terrain mesh vertices
        const positions = terrainGeo.attributes.position;
        const arr = positions.array as Float32Array;
        for (let i = 0; i < positions.count; i++) {
          const idx = i * 3;
          const x = initialPositions[idx];
          const z = initialPositions[idx + 2];
          // Wave equation
          arr[idx + 1] =
            Math.sin(x * 0.35 + clock * 1.5) * 0.75 +
            Math.cos(z * 0.35 + clock * 1.2) * 0.75;
        }
        positions.needsUpdate = true;
        if (renderer) {
          renderer.render(scene, camera);
        }
        animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    } catch (err) {
      console.warn("WebGL wireframe mesh loader initialization:", err);
    }

    return () => {
      window.removeEventListener("load", handleWindowLoad);
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      clearInterval(progressInterval);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      document.body.style.overflow = originalOverflow;
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[99999] bg-[#050505] flex flex-col justify-between items-center select-none overflow-hidden transition-opacity duration-600 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        transitionDuration: "600ms",
      }}
      aria-hidden={isFading}
    >
      {/* 3D WebGL Wireframe Mesh Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Blueprint Grid & Screen Corner Marks */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Top Header Telemetry */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-8 flex justify-between items-start font-mono text-[10px] md:text-xs text-[#888888] tracking-[2px] uppercase">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#e63946] animate-pulse" />
            <span className="text-white font-medium">CORTES // SYSTEM INIT</span>
          </div>
          <span className="text-[#555555]">LAT 10.4017° N &bull; LON 124.6075° E</span>
        </div>

        <div className="text-right flex flex-col gap-1">
          <div className="text-[#e63946] tracking-[2px] font-semibold">{networkStatus}</div>
          <div className="text-[#555555]">TOPOLOGY: 3D_WIREFRAME_MESH</div>
        </div>
      </div>

      {/* Center Target & Reticle HUD */}
      <div className="relative z-20 pointer-events-none flex flex-col items-center justify-center my-auto">
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
          {/* Subtle Outer Rotating Ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#e63946]/30 animate-[spin_20s_linear_infinite]" />
          <div className="absolute -inset-4 rounded-full border border-[#222222]/60" />

          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#e63946]/40 to-transparent" />
          <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#e63946]/40 to-transparent" />

          {/* Corner tick marks */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#e63946]/70" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#e63946]/70" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#e63946]/70" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#e63946]/70" />
        </div>
      </div>

      {/* Bottom Progress Bar & Telemetry */}
      <div className="relative z-20 w-full max-w-xl mx-auto px-6 pb-12 flex flex-col items-center">
        <div className="w-full flex justify-between items-center font-mono text-[11px] md:text-xs text-[#888888] mb-2 tracking-[1.5px]">
          <span className="text-white/80">
            {progress < 100 ? "INITIALIZING MESH TOPOLOGY" : "CALIBRATION COMPLETE"}
          </span>
          <span className="text-[#e63946] font-semibold">{progress}%</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-[3px] bg-[#1a1a1a] rounded-full overflow-hidden border border-[#222222]">
          <div
            className="h-full bg-gradient-to-r from-[#e63946] via-[#ff6b6b] to-white transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 font-mono text-[9px] md:text-[10px] text-[#555555] tracking-[2px] uppercase">
          SECURE PROTOCOL // WIREFRAME CORE DISPLAY LOCK 2.0s
        </div>
      </div>
    </div>
  );
}
