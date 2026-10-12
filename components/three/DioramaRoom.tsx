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

      {/* Ambient & Key Room Lighting - High Visibility */}
      <ambientLight intensity={1.4} color="#ffffff" />
      <directionalLight
        position={[6, 12, 8]}
        intensity={2.4}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight
        position={[-6, 8, 6]}
        intensity={1.6}
        color="#dbeafe"
      />
      <pointLight position={[0, 4.5, -2]} intensity={2.0} color="#ffedd5" distance={20} />

      {/* Diorama 3D Architecture */}
      <group position={[0, 0, 0]}>
        {/* Floor Plane (clean without grid lines) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[26, 20]} />
          <meshStandardMaterial
            color="#141418"
            roughness={0.82}
            metalness={0.08}
          />
        </mesh>

        {/* Back Wall */}
        <mesh position={[0, 6, -8.5]} receiveShadow>
          <planeGeometry args={[26, 14]} />
          <meshStandardMaterial
            color="#0d0d11"
            roughness={0.9}
            metalness={0.04}
          />
        </mesh>

        {/* Left Wall */}
        <mesh
          position={[-13, 6, 0.5]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 14]} />
          <meshStandardMaterial
            color="#0b0b0f"
            roughness={0.92}
            metalness={0.03}
          />
        </mesh>

        {/* Right Wall */}
        <mesh
          position={[13, 6, 0.5]}
          rotation={[0, -Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 14]} />
          <meshStandardMaterial
            color="#0b0b0f"
            roughness={0.92}
            metalness={0.03}
          />
        </mesh>
      </group>
    </>
  );
}
