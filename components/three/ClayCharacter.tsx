"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface ClayCharacterProps {
  target: [number, number, number];
  attackTrigger: number;
}

export default function ClayCharacter({ target, attackTrigger }: ClayCharacterProps) {
  const { scene } = useGLTF("/models/clay-character/character.glb");
  const groupRef = useRef<THREE.Group>(null);
  const characterInnerRef = useRef<THREE.Group>(null);

  // Position, rotation, animation states
  const currentPos = useRef(new THREE.Vector3(0, 0, 1));
  const currentRotY = useRef(0);
  const runCycle = useRef(0);
  const idleCycle = useRef(0);
  const attackTimer = useRef(0);
  const lastAttackTrigger = useRef(attackTrigger);

  // Clone scene and setup bounds & shadows
  const { clonedScene, baseScale, yOffset } = useMemo(() => {
    const cloned = scene.clone(true);

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Target height around 2.8 units for clear visibility
    const scale = size.y > 0 ? 2.8 / size.y : 0.22;
    const offsetY = -box.min.y * scale;

    // Center X & Z
    cloned.position.x = -center.x;
    cloned.position.z = -center.z;

    // Enable shadows and enhance material responsiveness on child meshes
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat.isMeshStandardMaterial) {
            mat.roughness = Math.min(mat.roughness, 0.6);
            mat.needsUpdate = true;
          }
        }
      }
    });

    return { clonedScene: cloned, baseScale: scale, yOffset: offsetY };
  }, [scene]);

  // Handle attack trigger from props
  useEffect(() => {
    if (attackTrigger > 0 && attackTrigger !== lastAttackTrigger.current) {
      lastAttackTrigger.current = attackTrigger;
      attackTimer.current = 0.55; // start attack anim
    }
  }, [attackTrigger]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const clampedDelta = Math.min(delta, 0.1);

    // Calculate distance and direction to target
    const tx = target[0];
    const tz = target[2];
    const dx = tx - currentPos.current.x;
    const dz = tz - currentPos.current.z;
    const dist = Math.hypot(dx, dz);

    let hopY = 0;
    let tiltX = 0;
    let tiltZ = 0;
    let scaleSquashY = 1;
    let scaleSquashXZ = 1;
    let attackSpin = 0;
    let attackHop = 0;

    // 1. Attack / Click Action Animation
    if (attackTimer.current > 0) {
      attackTimer.current -= clampedDelta;
      const progress = 1 - Math.max(0, attackTimer.current) / 0.55;
      // High jump arc
      attackHop = Math.sin(progress * Math.PI) * 1.35;
      // 360 degree spin slash
      attackSpin = progress * Math.PI * 2;
      // Squash on takeoff and landing
      if (progress < 0.2 || progress > 0.8) {
        scaleSquashY = 0.85;
        scaleSquashXZ = 1.1;
      } else {
        scaleSquashY = 1.2;
        scaleSquashXZ = 0.92;
      }
    }

    // 2. Locomotion vs Idle
    if (dist > 0.22) {
      // Running state
      const runSpeed = 4.6;
      const moveStep = Math.min(dist, runSpeed * clampedDelta);
      currentPos.current.x += (dx / dist) * moveStep;
      currentPos.current.z += (dz / dist) * moveStep;

      // Calculate desired heading towards target
      // Character default faces +Z, so atan2(dx, dz) gives rotation around Y
      const targetAngle = Math.atan2(dx, dz);

      // Shortest angle interpolation
      let angleDiff = targetAngle - currentRotY.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      currentRotY.current += angleDiff * Math.min(1, clampedDelta * 11);

      // Hop & Squash-and-Stretch physics
      runCycle.current += clampedDelta * 14;
      const stepPhase = runCycle.current;
      hopY = Math.abs(Math.sin(stepPhase)) * 0.42;

      // Dynamic clay deformation
      const stretch = Math.sin(stepPhase * 2) * 0.12;
      if (attackTimer.current <= 0) {
        scaleSquashY = 1 + stretch;
        scaleSquashXZ = 1 - stretch * 0.5;
        // Lean into movement direction & bank into turns
        tiltX = 0.12;
        tiltZ = -THREE.MathUtils.clamp(angleDiff * 0.35, -0.25, 0.25);
      }
    } else {
      // Idle state inside spotlight
      idleCycle.current += clampedDelta * 2.6;
      const breathe = Math.sin(idleCycle.current);
      if (attackTimer.current <= 0) {
        hopY = breathe * 0.04;
        scaleSquashY = 1 + breathe * 0.03;
        scaleSquashXZ = 1 - breathe * 0.015;
        tiltZ = Math.sin(idleCycle.current * 0.8) * 0.04;
      }

      // Gently ease rotation toward camera if resting
      let cameraAngleDiff = 0 - currentRotY.current;
      while (cameraAngleDiff > Math.PI) cameraAngleDiff -= Math.PI * 2;
      while (cameraAngleDiff < -Math.PI) cameraAngleDiff += Math.PI * 2;
      currentRotY.current += cameraAngleDiff * Math.min(1, clampedDelta * 2);
    }

    // Apply position
    groupRef.current.position.set(
      currentPos.current.x,
      hopY + attackHop,
      currentPos.current.z
    );

    // Apply rotation (heading + tilt + attack spin)
    groupRef.current.rotation.set(
      tiltX,
      currentRotY.current + attackSpin,
      tiltZ
    );

    // Apply procedural squash scale
    if (characterInnerRef.current) {
      characterInnerRef.current.scale.set(
        baseScale * scaleSquashXZ,
        baseScale * scaleSquashY,
        baseScale * scaleSquashXZ
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 1]}>
      <group
        ref={characterInnerRef}
        position={[0, yOffset, 0]}
        scale={[baseScale, baseScale, baseScale]}
      >
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/clay-character/character.glb");
