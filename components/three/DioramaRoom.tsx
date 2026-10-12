"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DioramaRoomProps {
  target: [number, number, number];
}

export default function DioramaRoom({ target }: DioramaRoomProps) {
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const lightTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const lightPoolRef = useRef<THREE.Mesh>(null);
  const targetObject = useMemo(() => new THREE.Object3D(), []);

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

      {/* Mouse Follow Spotlight */}
      <spotLight
        ref={spotLightRef}
        target={targetObject}
        position={[0, 7.5, 2.2]}
        color="#fff1e0"
        intensity={4.8}
        angle={Math.PI / 5.2}
        penumbra={0.75}
        distance={22}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Glowing amber floor pool under spotlight */}
      <mesh
        ref={lightPoolRef}
        position={[0, 0.015, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[1.25, 32]} />
        <meshBasicMaterial
          color="#ffb86c"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Ambient & Key Room Lighting */}
      <ambientLight intensity={0.38} color="#8892a4" />
      <directionalLight
        position={[6, 9, 7]}
        intensity={0.55}
        color="#edf2f7"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <pointLight position={[0, 3.5, -4]} intensity={0.35} color="#ffa97a" distance={15} />

      {/* Diorama 3D Box Architecture */}
      <group position={[0, 0, 0]}>
        {/* Floor Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[24, 18]} />
          <meshStandardMaterial
            color="#131317"
            roughness={0.88}
            metalness={0.06}
          />
        </mesh>

        {/* Subtle Diorama Floor Grid / Tile Lines */}
        <gridHelper
          args={[22, 22, "#2a2d38", "#1c1e26"]}
          position={[0, 0.005, 0]}
        />

        {/* Back Wall */}
        <mesh position={[0, 6, -8.5]} receiveShadow>
          <planeGeometry args={[24, 14]} />
          <meshStandardMaterial
            color="#0b0b0e"
            roughness={0.92}
            metalness={0.04}
          />
        </mesh>

        {/* Left Wall */}
        <mesh
          position={[-12, 6, 0.5]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[18, 14]} />
          <meshStandardMaterial
            color="#09090c"
            roughness={0.94}
            metalness={0.03}
          />
        </mesh>

        {/* Right Wall */}
        <mesh
          position={[12, 6, 0.5]}
          rotation={[0, -Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[18, 14]} />
          <meshStandardMaterial
            color="#09090c"
            roughness={0.94}
            metalness={0.03}
          />
        </mesh>

        {/* Top Ceiling Trim Bar / Framing */}
        <mesh position={[0, 12, -8.4]}>
          <boxGeometry args={[24, 0.25, 0.35]} />
          <meshStandardMaterial color="#1a1c23" roughness={0.7} />
        </mesh>
      </group>
    </>
  );
}
