"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Smaller square stairs, tallest block on the right deleted (4 blocks remaining)
export const PLATFORM_BLOCKS = [
  { x: -2.4, z: 1.2, w: 1.3, d: 1.3, topY: 0.5 },
  { x: -1.0, z: 0.3, w: 1.3, d: 1.3, topY: 1.0 },
  { x: 0.4, z: -0.6, w: 1.3, d: 1.3, topY: 1.5 },
  { x: 1.8, z: -1.5, w: 1.3, d: 1.3, topY: 2.0 },
];

interface DioramaRoomProps {
  target: [number, number, number];
}

export default function DioramaRoom({ target }: DioramaRoomProps) {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const lightPoolRef = useRef<THREE.Mesh>(null);
  const targetObject = useMemo(() => new THREE.Object3D(), []);

  // 1. Wallpaper Texture for the back wall
  const bgTexture = useTexture("/images/diorama-bg.webp");

  // 2. Procedural Pixelated Minecraft Gold Block Texture (16x16 NearestFilter)
  const goldTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Base Minecraft gold pixel variations
    const goldPalette = ["#fad338", "#ebd034", "#f2ce2b", "#fadc42", "#e8c31f"];
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        const n = Math.floor(Math.abs(seed) % goldPalette.length);
        ctx.fillStyle = goldPalette[n];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Outer beveled frame (top/left highlight, bottom/right shadow)
    ctx.fillStyle = "#fff59d";
    ctx.fillRect(0, 0, 16, 1);
    ctx.fillRect(0, 0, 1, 16);

    ctx.fillStyle = "#8d6400";
    ctx.fillRect(0, 15, 16, 1);
    ctx.fillRect(15, 0, 1, 16);

    // Inner quadrant cross-seam
    ctx.fillStyle = "#ca8a04";
    ctx.fillRect(7, 1, 2, 14);
    ctx.fillRect(1, 7, 14, 2);

    // Corner rivet accents
    ctx.fillStyle = "#fff9c4";
    ctx.fillRect(2, 2, 2, 2);
    ctx.fillRect(12, 2, 2, 2);
    ctx.fillRect(2, 12, 2, 2);
    ctx.fillRect(12, 12, 2, 2);

    ctx.fillStyle = "#713f12";
    ctx.fillRect(3, 4, 1, 1);
    ctx.fillRect(13, 4, 1, 1);
    ctx.fillRect(3, 14, 1, 1);
    ctx.fillRect(13, 14, 1, 1);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    const tx = target[0];
    const tz = target[2];

    // Smoothly ease spotlight toward mouse
    if (spotLightRef.current) {
      spotLightRef.current.position.x += (tx - spotLightRef.current.position.x) * clampedDelta * 9;
      spotLightRef.current.position.z += (tz + 1.2 - spotLightRef.current.position.z) * clampedDelta * 9;
    }

    targetObject.position.set(tx, 0, tz);

    // Update glowing pool mesh on floor
    if (lightPoolRef.current) {
      lightPoolRef.current.position.x += (tx - lightPoolRef.current.position.x) * clampedDelta * 9;
      lightPoolRef.current.position.z += (tz - lightPoolRef.current.position.z) * clampedDelta * 9;
    }
  });

  return (
    <>
      {/* Target object for the spotlight */}
      <primitive object={targetObject} />

      {/* Mouse Follow Spotlight shining down through the pathway */}
      <spotLight
        ref={spotLightRef}
        target={targetObject}
        position={[0, 9.5, 2.2]}
        color="#fff4e0"
        intensity={6.5}
        angle={Math.PI / 4.8}
        penumbra={0.75}
        distance={28}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Moonlit Beam Light over the blocks path */}
      <spotLight
        position={[0.5, 11, -0.6]}
        target={targetObject}
        color="#e0f2fe"
        intensity={4.2}
        angle={Math.PI / 4.2}
        penumbra={0.8}
        distance={26}
      />

      {/* Glowing floor pool under cursor spotlight */}
      <mesh
        ref={lightPoolRef}
        position={[0, 0.02, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial
          color="#ffb86c"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ambient & Key Illumination */}
      <ambientLight intensity={1.5} color="#cbd5e1" />
      <directionalLight
        position={[6, 12, 8]}
        intensity={2.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight
        position={[-6, 8, 6]}
        intensity={1.4}
        color="#93c5fd"
      />
      <pointLight position={[0, 5, -2]} intensity={2.0} color="#fed7aa" distance={22} />

      {/* ── Background & Room Structure ── */}
      <group position={[0, 0, 0]}>
        {/* Back Wall with Wallpaper fitted to exact 16:9 aspect ratio (22.28 x 12.5) */}
        <mesh position={[0, 6.25, -8.0]} receiveShadow>
          <planeGeometry args={[22.28, 12.5]} />
          <meshBasicMaterial map={bgTexture} toneMapped={false} />
        </mesh>

        {/* Clean Matte Diorama Floor (NO image) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[26, 20]} />
          <meshStandardMaterial
            color="#0e1017"
            roughness={0.82}
            metalness={0.12}
          />
        </mesh>

        {/* ── Minecraft Gold Block Stairs (Smaller, Square, 4 Blocks) ── */}
        {PLATFORM_BLOCKS.map((b, idx) => (
          <group key={idx} position={[b.x, b.topY / 2, b.z]}>
            {/* Minecraft Gold Block Box */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[b.w, b.topY, b.d]} />
              <meshStandardMaterial
                map={goldTexture ?? undefined}
                color="#ffe043"
                roughness={0.28}
                metalness={0.72}
              />
            </mesh>

            {/* Subtle Golden Glow illuminating the steps */}
            <pointLight
              position={[0, b.topY / 2 + 0.35, 0]}
              intensity={0.45}
              color="#fef08a"
              distance={2.5}
            />
          </group>
        ))}
      </group>
    </>
  );
}

useTexture.preload("/images/diorama-bg.webp");
