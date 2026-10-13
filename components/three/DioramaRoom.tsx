"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// 4 Blocks scattered in background and flanks (center is 100% open for clean hero text readability)
export const PLATFORM_BLOCKS = [
  // 1. Far Left Background
  { x: -5.8, z: -3.6, w: 1.4, d: 1.4, topY: 1.1 },
  // 2. Mid Left Flank
  { x: -4.4, z: -1.6, w: 1.4, d: 1.4, topY: 0.65 },
  // 3. Far Right Background
  { x: 5.5, z: -3.4, w: 1.4, d: 1.4, topY: 1.25 },
  // 4. Mid Right Flank
  { x: 4.2, z: -1.4, w: 1.4, d: 1.4, topY: 0.75 },
];

interface DioramaRoomProps {
  target: [number, number, number];
  applePos?: [number, number, number];
  isAppleActive?: boolean;
}

export default function DioramaRoom({
  target,
  applePos = [2.2, 0.28, 0.8],
  isAppleActive = true,
}: DioramaRoomProps) {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const lightPoolRef = useRef<THREE.Mesh>(null);
  const appleGroupRef = useRef<THREE.Group>(null);
  const targetObject = useMemo(() => new THREE.Object3D(), []);

  // 1. Wallpaper Texture for the back wall
  const bgTexture = useTexture("/images/diorama-bg.webp");

  // 2. Procedural Minecraft Lush Cave / Flowering Azalea Leaf Texture (16x16 NearestFilter)
  const lushLeafTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Official Minecraft Azalea Leaves foliage palette
    const greens = [
      "#315423", // deep shadow
      "#4a7832", // mid green
      "#4a7832", // mid green base
      "#679c3e", // bright leaf highlight
      "#679c3e", // bright foliage
      "#89ba59", // pale mint accent
    ];

    // Dappled leaf cluster pattern
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const seed = Math.sin(x * 37.11 + y * 91.73) * 43758.5453;
        const idx = Math.floor(Math.abs(seed) % greens.length);
        ctx.fillStyle = greens[idx];
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Flowering Azalea blossoms (2 blossom clusters)
    // Blossom 1
    ctx.fillStyle = "#a83e72"; // blossom shadow
    ctx.fillRect(4, 5, 2, 2);
    ctx.fillStyle = "#e87ab4"; // vibrant petal
    ctx.fillRect(3, 4, 3, 2);
    ctx.fillRect(4, 3, 2, 3);
    ctx.fillStyle = "#f7b2d6"; // center highlight
    ctx.fillRect(4, 4, 1, 1);

    // Blossom 2
    ctx.fillStyle = "#a83e72";
    ctx.fillRect(11, 11, 2, 2);
    ctx.fillStyle = "#e87ab4";
    ctx.fillRect(10, 10, 3, 2);
    ctx.fillRect(11, 9, 2, 3);
    ctx.fillStyle = "#f7b2d6";
    ctx.fillRect(11, 10, 1, 1);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    const tx = target[0];
    const tz = target[2];
    const time = state.clock.elapsedTime;

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

    // Apple bobbing and gentle floating spin
    if (appleGroupRef.current && isAppleActive) {
      appleGroupRef.current.position.y = applePos[1] + Math.sin(time * 3.5) * 0.08;
      appleGroupRef.current.rotation.y += clampedDelta * 1.6;
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
        shadow-mapSize={[512, 512]}
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
        shadow-mapSize={[512, 512]}
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

        {/* Clean Matte Diorama Floor (NO image, clean shadow reception) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[26, 20]} />
          <meshStandardMaterial
            color="#0e1017"
            roughness={0.82}
            metalness={0.12}
          />
        </mesh>

        {/* ── 4 Minecraft Lush Cave Leaf Blocks Scattered in Background ── */}
        {PLATFORM_BLOCKS.map((b, idx) => (
          <group key={idx} position={[b.x, b.topY / 2, b.z]}>
            {/* Lush Cave Azalea Leaf Block */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[b.w, b.topY, b.d]} />
              <meshStandardMaterial
                map={lushLeafTexture ?? undefined}
                color="#86efac"
                roughness={0.85}
                metalness={0.06}
              />
            </mesh>

            {/* Subtle Azalea Blossom Spore Glow */}
            <pointLight
              position={[0, b.topY / 2 + 0.35, 0]}
              intensity={0.35}
              color="#f472b6"
              distance={2.4}
            />
          </group>
        ))}

        {/* ── 3D Interactive Teleporting Apple ── */}
        {isAppleActive && (
          <group
            ref={appleGroupRef}
            position={[applePos[0], applePos[1], applePos[2]]}
          >
            {/* Apple Body */}
            <mesh castShadow position={[0, 0, 0]}>
              <sphereGeometry args={[0.26, 16, 16]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#be123c"
                emissiveIntensity={0.32}
                roughness={0.22}
                metalness={0.12}
              />
            </mesh>

            {/* Apple Stem */}
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.02, 0.025, 0.14, 8]} />
              <meshStandardMaterial color="#5c2e0b" roughness={0.8} />
            </mesh>

            {/* Apple Leaf */}
            <mesh position={[0.06, 0.3, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <planeGeometry args={[0.1, 0.06]} />
              <meshStandardMaterial color="#4ade80" side={THREE.DoubleSide} />
            </mesh>

            {/* Pulsing Target Beacon Disc on Ground */}
            <mesh position={[0, -applePos[1] + 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.22, 0.38, 32]} />
              <meshBasicMaterial
                color="#ff1a40"
                transparent
                opacity={0.45}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Apple Beacon Glow */}
            <pointLight color="#ff2d55" intensity={2.0} distance={3.0} />
          </group>
        )}
      </group>
    </>
  );
}

useTexture.preload("/images/diorama-bg.webp");
