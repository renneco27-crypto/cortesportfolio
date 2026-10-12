"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export const PLATFORM_BLOCKS = [
  { x: -3.2, z: 1.6, w: 2.1, d: 2.1, topY: 0.8 },
  { x: -1.4, z: 0.5, w: 2.1, d: 2.1, topY: 1.4 },
  { x: 0.3, z: -0.6, w: 2.3, d: 2.3, topY: 2.0 },
  { x: 2.1, z: -1.8, w: 2.1, d: 2.1, topY: 2.6 },
  { x: 3.8, z: -2.9, w: 2.3, d: 2.3, topY: 3.3 },
];

interface DioramaRoomProps {
  target: [number, number, number];
}

export default function DioramaRoom({ target }: DioramaRoomProps) {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const lightTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const lightPoolRef = useRef<THREE.Mesh>(null);
  const targetObject = useMemo(() => new THREE.Object3D(), []);

  // 1. Load Background Image
  const bgTexture = useTexture("/images/diorama-bg.webp");

  // 2. Clone and configure floor texture using the bottom half (1/2 down) of the image
  const floorTexture = useMemo(() => {
    const t = bgTexture.clone();
    t.repeat.set(1, 0.5); // 1/2 vertical height
    t.offset.set(0, 0);   // bottom half (mountains & forest canopy)
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.needsUpdate = true;
    return t;
  }, [bgTexture]);

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
        {/* Full Image Back Wall Backdrop (Starry Sky, Moon, and Mountains) */}
        <mesh position={[0, 6.5, -8.6]}>
          <planeGeometry args={[28, 15]} />
          <meshBasicMaterial map={bgTexture} toneMapped={false} />
        </mesh>

        {/* Floor Plane using the 1/2 bottom half of the image */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[26, 20]} />
          <meshStandardMaterial
            map={floorTexture}
            roughness={0.7}
            metalness={0.08}
          />
        </mesh>

        {/* Soft atmospheric framing side panels */}
        <mesh position={[-13, 6.5, 0.5]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[20, 15]} />
          <meshStandardMaterial color="#080c10" roughness={0.9} />
        </mesh>
        <mesh position={[13, 6.5, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[20, 15]} />
          <meshStandardMaterial color="#080c10" roughness={0.9} />
        </mesh>

        {/* ── 3D Jumping Blocks Path Leading Through the Light ── */}
        {PLATFORM_BLOCKS.map((b, idx) => (
          <group key={idx} position={[b.x, b.topY / 2, b.z]}>
            {/* Main Block Box */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[b.w, b.topY, b.d]} />
              <meshStandardMaterial
                color="#1b3036"
                roughness={0.65}
                metalness={0.15}
              />
            </mesh>

            {/* Glowing Clay Cap / Top Stepping Surface */}
            <mesh position={[0, b.topY / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[b.w * 0.94, b.d * 0.94]} />
              <meshStandardMaterial
                color={idx === 2 ? "#e63946" : "#2dd4bf"}
                roughness={0.4}
                metalness={0.2}
                emissive={idx === 2 ? "#e63946" : "#0d9488"}
                emissiveIntensity={0.35}
              />
            </mesh>

            {/* Soft Ambient Light Ray Indicator on each block */}
            <pointLight
              position={[0, b.topY / 2 + 0.6, 0]}
              intensity={0.6}
              color={idx === 2 ? "#ffa8b0" : "#a7f3d0"}
              distance={3.5}
            />
          </group>
        ))}
      </group>
    </>
  );
}

useTexture.preload("/images/diorama-bg.webp");
