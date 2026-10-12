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
  const isMoving = useRef(false);
  const moveBlend = useRef(0); // 0 (pure idle) to 1 (pure run)

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

    // 1. Attack / Click Action Animation
    let attackHop = 0;
    let attackSpin = 0;
    let attackSquashY = 1;
    let attackSquashXZ = 1;

    if (attackTimer.current > 0) {
      attackTimer.current -= clampedDelta;
      const progress = 1 - Math.max(0, attackTimer.current) / 0.55;
      attackHop = Math.sin(progress * Math.PI) * 1.35;
      attackSpin = progress * Math.PI * 2;
      if (progress < 0.2 || progress > 0.8) {
        attackSquashY = 0.85;
        attackSquashXZ = 1.1;
      } else {
        attackSquashY = 1.2;
        attackSquashXZ = 0.92;
      }
    }

    // 2. Dual-Threshold Hysteresis for Locomotion (prevents jitter / double-thinking inside circle)
    const START_MOVE_THRESHOLD = 0.45; // circle edge threshold to begin pursuit
    const STOP_MOVE_THRESHOLD = 0.16;  // center threshold to come to rest

    if (isMoving.current) {
      if (dist < STOP_MOVE_THRESHOLD) {
        isMoving.current = false;
      }
    } else {
      if (dist > START_MOVE_THRESHOLD) {
        isMoving.current = true;
      }
    }

    // Smoothly blend movement weight (0 = idle, 1 = running) to eliminate abrupt switches
    const targetBlend = isMoving.current ? 1 : 0;
    moveBlend.current += (targetBlend - moveBlend.current) * Math.min(1, clampedDelta * 9);

    // Smooth physics locomotion
    if (isMoving.current && dist > 0.05) {
      // Ease speed smoothly as character nears the stop zone
      const speedFactor = THREE.MathUtils.clamp((dist - STOP_MOVE_THRESHOLD) / 0.8, 0.2, 1);
      const runSpeed = 4.6 * speedFactor;
      const moveStep = Math.min(dist, runSpeed * clampedDelta);

      currentPos.current.x += (dx / dist) * moveStep;
      currentPos.current.z += (dz / dist) * moveStep;

      // Only recalculate heading when far enough away to avoid 180° twitching near center
      if (dist > 0.28) {
        const targetAngle = Math.atan2(dx, dz);
        let angleDiff = targetAngle - currentRotY.current;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        currentRotY.current += angleDiff * Math.min(1, clampedDelta * 10);
      }
    } else {
      // Resting inside circle: smoothly turn back towards camera
      let cameraAngleDiff = 0 - currentRotY.current;
      while (cameraAngleDiff > Math.PI) cameraAngleDiff -= Math.PI * 2;
      while (cameraAngleDiff < -Math.PI) cameraAngleDiff += Math.PI * 2;
      currentRotY.current += cameraAngleDiff * Math.min(1, clampedDelta * (2.5 * (1 - moveBlend.current)));
    }

    // Cycles for both run hop and idle breathing
    runCycle.current += clampedDelta * (14 * Math.max(0.2, moveBlend.current));
    idleCycle.current += clampedDelta * 2.6;

    const runHop = Math.abs(Math.sin(runCycle.current)) * 0.42;
    const idleHop = Math.sin(idleCycle.current) * 0.04;
    const hopY = THREE.MathUtils.lerp(idleHop, runHop, moveBlend.current);

    const runStretch = Math.sin(runCycle.current * 2) * 0.12;
    const idleBreathe = Math.sin(idleCycle.current) * 0.03;

    const scaleSquashY = THREE.MathUtils.lerp(1 + idleBreathe, 1 + runStretch, moveBlend.current) * attackSquashY;
    const scaleSquashXZ = THREE.MathUtils.lerp(1 - idleBreathe * 0.5, 1 - runStretch * 0.5, moveBlend.current) * attackSquashXZ;

    const tiltX = THREE.MathUtils.lerp(0, 0.12, moveBlend.current);
    const tiltZ = THREE.MathUtils.lerp(
      Math.sin(idleCycle.current * 0.8) * 0.03,
      0,
      moveBlend.current
    );

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
