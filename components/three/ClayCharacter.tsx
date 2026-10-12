"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { PLATFORM_BLOCKS } from "./DioramaRoom";

interface ClayCharacterProps {
  target: [number, number, number];
  attackTrigger: number;
  applePos?: [number, number, number];
  isAppleActive?: boolean;
  onEatApple?: () => void;
}

export default function ClayCharacter({
  target,
  attackTrigger,
  applePos,
  isAppleActive = true,
  onEatApple,
}: ClayCharacterProps) {
  const { scene } = useGLTF("/models/clay-character/character.glb");
  const groupRef = useRef<THREE.Group>(null);
  const characterInnerRef = useRef<THREE.Group>(null);

  // Position, rotation, animation states
  const currentPos = useRef(new THREE.Vector3(0, 0, 1));
  const currentBaseY = useRef(0); // Platform height
  const currentRotY = useRef(0);
  const runCycle = useRef(0);
  const idleCycle = useRef(0);
  const attackTimer = useRef(0);
  const lastAttackTrigger = useRef(attackTrigger);
  const isMoving = useRef(false);
  const moveBlend = useRef(0); // 0 (pure idle) to 1 (pure run)

  // ── Zelda Red Aura States & Refs ──
  const auraTimer = useRef(0);
  const auraLevel = useRef(0);
  const auraShieldRef = useRef<THREE.Mesh>(null);
  const auraRing1Ref = useRef<THREE.Mesh>(null);
  const auraRing2Ref = useRef<THREE.Mesh>(null);
  const auraLightRef = useRef<THREE.PointLight>(null);

  // Zelda Red Aura Shader Material (Fresnel Pulsing Energy Forcefield - Toned down by 50%)
  const auraShaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uIntensity;
        void main() {
          float fresnel = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
          float wave = sin(vPosition.y * 14.0 - uTime * 7.5) * 0.18 + 0.82;
          vec3 flameCol = mix(uColor, vec3(1.0, 0.85, 0.2), fresnel * 0.4);
          float alpha = clamp(fresnel * wave * uIntensity * 0.5, 0.0, 0.45);
          gl_FragColor = vec4(flameCol * 1.2, alpha);
        }
      `,
      uniforms: {
        uColor: { value: new THREE.Color("#ff0044") },
        uTime: { value: 0 },
        uIntensity: { value: 0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, []);

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
          const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.roughness = Math.min(0.65, mat.roughness);
            mat.metalness = Math.max(0.1, mat.metalness);
            mat.needsUpdate = true;
          }
        }
      }
    });

    return { clonedScene: cloned, baseScale: scale, yOffset: offsetY };
  }, [scene]);

  // Click attack spin trigger
  useEffect(() => {
    if (attackTrigger > lastAttackTrigger.current) {
      attackTimer.current = 0.45; // 450ms attack spin
      lastAttackTrigger.current = attackTrigger;
    }
  }, [attackTrigger]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const clampedDelta = Math.min(delta, 0.1);
    const time = state.clock.elapsedTime;

    // ── 0. Apple Eating Collision Check ──
    if (isAppleActive && applePos) {
      const dx = currentPos.current.x - applePos[0];
      const dz = currentPos.current.z - applePos[2];
      const distXZ = Math.hypot(dx, dz);
      if (distXZ < 0.85) {
        onEatApple?.();
        auraTimer.current = 5.2; // 5.2s of roaring Zelda Red Aura!
      }
    }

    // ── 1. Zelda Red Aura Intensity Update ──
    if (auraTimer.current > 0) {
      auraTimer.current -= clampedDelta;
      const targetAura = Math.min(1, auraTimer.current / 0.5);
      auraLevel.current += (targetAura - auraLevel.current) * Math.min(1, clampedDelta * 10);
    } else {
      auraLevel.current += (0 - auraLevel.current) * Math.min(1, clampedDelta * 6);
    }

    const curAura = auraLevel.current;

    // Update Aura Meshes
    if (curAura > 0.01) {
      // Pulse Fresnel forcefield shield
      if (auraShieldRef.current) {
        const pulse = 1.0 + Math.sin(time * 8.0) * 0.08;
        auraShieldRef.current.scale.set(1.3 * pulse, 1.45 * pulse, 1.3 * pulse);
        const mat = auraShieldRef.current.material as THREE.ShaderMaterial;
        if (mat.uniforms) {
          mat.uniforms.uTime.value = time;
          mat.uniforms.uIntensity.value = curAura;
        }
      }

      // Rotate ground energy rings (toned down by 50%)
      if (auraRing1Ref.current) {
        auraRing1Ref.current.rotation.z += clampedDelta * 3.5;
        (auraRing1Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.3 * curAura;
      }
      if (auraRing2Ref.current) {
        auraRing2Ref.current.rotation.z -= clampedDelta * 2.2;
        (auraRing2Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.2 * curAura;
      }

      // Volumetric red ray-traced radiance light (toned down by 50%)
      if (auraLightRef.current) {
        auraLightRef.current.intensity = curAura * 3.4;
      }
    } else {
      if (auraLightRef.current) auraLightRef.current.intensity = 0;
      if (auraShieldRef.current) {
        const mat = auraShieldRef.current.material as THREE.ShaderMaterial;
        if (mat.uniforms) mat.uniforms.uIntensity.value = 0;
      }
    }

    // ── 2. Locomotion Movement & Dual-Threshold Hysteresis ──
    const targetVec = new THREE.Vector3(target[0], 0, target[2]);
    const toTarget = new THREE.Vector3().subVectors(targetVec, currentPos.current);
    const distToTarget = toTarget.length();

    const START_MOVE_THRESHOLD = 0.45;
    const STOP_MOVE_THRESHOLD = 0.16;

    if (distToTarget > START_MOVE_THRESHOLD) {
      isMoving.current = true;
    } else if (distToTarget < STOP_MOVE_THRESHOLD) {
      isMoving.current = false;
    }

    const targetBlend = isMoving.current ? 1 : 0;
    const blendSpeed = isMoving.current ? 9 : 6;
    moveBlend.current += (targetBlend - moveBlend.current) * Math.min(1, clampedDelta * blendSpeed);

    if (isMoving.current) {
      const moveSpeed = THREE.MathUtils.lerp(4.0, 7.5, Math.min(1, distToTarget / 3.0));
      const step = Math.min(distToTarget, moveSpeed * clampedDelta);
      currentPos.current.add(toTarget.normalize().multiplyScalar(step));

      const targetAngle = Math.atan2(toTarget.x, toTarget.z);
      let angleDiff = targetAngle - currentRotY.current;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      currentRotY.current += angleDiff * Math.min(1, clampedDelta * 14);
    } else {
      const cameraFacingAngle = 0;
      let cameraAngleDiff = cameraFacingAngle - currentRotY.current;
      while (cameraAngleDiff > Math.PI) cameraAngleDiff -= Math.PI * 2;
      while (cameraAngleDiff < -Math.PI) cameraAngleDiff += Math.PI * 2;
      currentRotY.current += cameraAngleDiff * Math.min(1, clampedDelta * (2.5 * (1 - moveBlend.current)));
    }

    // Cycles for run hop and idle breathing
    runCycle.current += clampedDelta * (14 * Math.max(0.2, moveBlend.current));
    idleCycle.current += clampedDelta * 2.6;

    const runHop = Math.abs(Math.sin(runCycle.current)) * 0.42;
    const idleHop = Math.sin(idleCycle.current) * 0.04;
    const hopY = THREE.MathUtils.lerp(idleHop, runHop, moveBlend.current);

    const runStretch = Math.sin(runCycle.current * 2) * 0.12;
    const idleBreathe = Math.sin(idleCycle.current) * 0.03;

    let attackHop = 0;
    let attackSpin = 0;
    let attackSquashY = 1;
    let attackSquashXZ = 1;

    if (attackTimer.current > 0) {
      attackTimer.current -= clampedDelta;
      const progress = 1 - Math.max(0, attackTimer.current / 0.45);
      attackSpin = progress * Math.PI * 4;
      attackHop = Math.sin(progress * Math.PI) * 0.9;
      attackSquashY = 1 + Math.sin(progress * Math.PI) * 0.35;
      attackSquashXZ = 1 - Math.sin(progress * Math.PI) * 0.2;
    }

    const scaleSquashY = THREE.MathUtils.lerp(1 + idleBreathe, 1 + runStretch, moveBlend.current) * attackSquashY;
    const scaleSquashXZ = THREE.MathUtils.lerp(1 - idleBreathe * 0.5, 1 - runStretch * 0.5, moveBlend.current) * attackSquashXZ;

    const tiltX = THREE.MathUtils.lerp(0, 0.12, moveBlend.current);
    const tiltZ = THREE.MathUtils.lerp(
      Math.sin(idleCycle.current * 0.8) * 0.03,
      0,
      moveBlend.current
    );

    // ── 3. Platform Height Calculation ──
    let targetBaseY = 0;
    for (const b of PLATFORM_BLOCKS) {
      const halfW = b.w * 0.52;
      const halfD = b.d * 0.52;
      if (
        Math.abs(currentPos.current.x - b.x) <= halfW &&
        Math.abs(currentPos.current.z - b.z) <= halfD
      ) {
        targetBaseY = b.topY;
        break;
      }
    }

    // Smoothly elevate character onto blocks
    currentBaseY.current += (targetBaseY - currentBaseY.current) * Math.min(1, clampedDelta * 11);

    // Apply position
    groupRef.current.position.set(
      currentPos.current.x,
      currentBaseY.current + hopY + attackHop,
      currentPos.current.z
    );

    // Apply rotation
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
      {/* ── Zelda Red Aura Effects Group ── */}
      <group position={[0, yOffset + 0.5, 0]}>
        {/* 1. Fresnel Energy Forcefield Shield */}
        <mesh ref={auraShieldRef}>
          <sphereGeometry args={[1.0, 32, 32]} />
          <primitive object={auraShaderMaterial} attach="material" />
        </mesh>

        {/* 2. Ray-Tracing Ground Energy Discs at character's base */}
        <mesh ref={auraRing1Ref} position={[0, -yOffset - 0.46, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.95, 32]} />
          <meshBasicMaterial
            color="#ff0055"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        <mesh ref={auraRing2Ref} position={[0, -yOffset - 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.0, 1.45, 32]} />
          <meshBasicMaterial
            color="#ff1744"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 3. Volumetric Crimson Radiance Point Light (toned down by 50%) */}
        <pointLight
          ref={auraLightRef}
          position={[0, 0.8, 0]}
          color="#ff1744"
          intensity={0}
          distance={4.5}
        />
      </group>

      {/* ── Character 3D Model ── */}
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
