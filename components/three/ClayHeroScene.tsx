"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import ClayCharacter from "./ClayCharacter";
import DioramaRoom, { PLATFORM_BLOCKS } from "./DioramaRoom";

// Inner 3D controller that coordinates character locomotion and apple teleportation
function SceneController({
  mouseNDC,
  isUserActive,
  attackTrigger,
}: {
  mouseNDC: React.MutableRefObject<THREE.Vector2>;
  isUserActive: React.MutableRefObject<boolean>;
  attackTrigger: number;
}) {
  const { camera } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const groundPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const intersectPoint = useRef(new THREE.Vector3());
  const currentTarget = useRef<[number, number, number]>([0, 0, 1]);
  const patrolTime = useRef(0);

  // ── Randomly Teleporting Apple State ──
  const applePos = useRef<[number, number, number]>([2.2, 0.28, 0.8]);
  const isAppleActive = useRef(true);
  const respawnTimer = useRef(0);
  const [, setTriggerUpdate] = useState(0);

  const handleAppleEaten = () => {
    isAppleActive.current = false;
    respawnTimer.current = 3.2; // 3.2 seconds until teleport respawn
    setTriggerUpdate((n) => n + 1);
  };

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    // 1. Handle Apple Teleport Respawn
    if (!isAppleActive.current) {
      respawnTimer.current -= clampedDelta;
      if (respawnTimer.current <= 0) {
        // Teleport apple: 28% chance on top of one of the 4 leaf blocks, 72% on ground
        const pickBlock = Math.random() < 0.28;
        let nx = 0, ny = 0.28, nz = 0;
        if (pickBlock && PLATFORM_BLOCKS.length > 0) {
          const b = PLATFORM_BLOCKS[Math.floor(Math.random() * PLATFORM_BLOCKS.length)];
          nx = b.x;
          ny = b.topY + 0.28;
          nz = b.z;
        } else {
          nx = (Math.random() - 0.5) * 8.0;
          if (Math.abs(nx) < 1.2) nx = nx < 0 ? -2.4 : 2.4;
          nz = Math.random() * 4.2 - 2.8;
          ny = 0.28;
        }
        applePos.current = [nx, ny, nz];
        isAppleActive.current = true;
        setTriggerUpdate((n) => n + 1);
      }
    }

    // 2. Character Target Navigation
    if (isUserActive.current) {
      // Raycast from camera using mouse NDC coords onto Y=0 ground plane
      raycaster.current.setFromCamera(mouseNDC.current, camera);
      const hit = raycaster.current.ray.intersectPlane(groundPlane.current, intersectPoint.current);

      if (hit) {
        // Clamp inside room boundaries
        const clampedX = THREE.MathUtils.clamp(hit.x, -9, 9);
        const clampedZ = THREE.MathUtils.clamp(hit.z, -6.8, 4.5);

        // Smoothly move target to cursor intersection
        currentTarget.current[0] += (clampedX - currentTarget.current[0]) * clampedDelta * 12;
        currentTarget.current[2] += (clampedZ - currentTarget.current[2]) * clampedDelta * 12;
      }
    } else {
      // Automated gentle patrol when idle
      patrolTime.current += clampedDelta * 0.75;
      let patrolX = Math.sin(patrolTime.current) * 4.2;
      let patrolZ = Math.sin(patrolTime.current * 2) * 2.0 - 1.0;

      // When apple is active, gently steer idle movement toward the apple
      if (isAppleActive.current && Math.sin(patrolTime.current * 0.5) > 0.05) {
        patrolX = THREE.MathUtils.lerp(patrolX, applePos.current[0], 0.65);
        patrolZ = THREE.MathUtils.lerp(patrolZ, applePos.current[2], 0.65);
      }

      currentTarget.current[0] += (patrolX - currentTarget.current[0]) * clampedDelta * 5;
      currentTarget.current[2] += (patrolZ - currentTarget.current[2]) * clampedDelta * 5;
    }
  });

  return (
    <>
      <DioramaRoom
        target={currentTarget.current}
        applePos={applePos.current}
        isAppleActive={isAppleActive.current}
      />
      <ClayCharacter
        target={currentTarget.current}
        attackTrigger={attackTrigger}
        applePos={applePos.current}
        isAppleActive={isAppleActive.current}
        onEatApple={handleAppleEaten}
      />
    </>
  );
}

export default function ClayHeroScene() {
  const mouseNDC = useRef(new THREE.Vector2(0, -0.2));
  const isUserActive = useRef(false);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);
  const [attackTrigger, setAttackTrigger] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [isOffscreen, setIsOffscreen] = useState(false);

  useEffect(() => {
    const markActive = () => {
      isUserActive.current = true;
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => {
        isUserActive.current = false;
      }, 3500);
    };

    const handleMouseMove = (e: MouseEvent) => {
      markActive();
      // Calculate normalized device coordinates (-1 to +1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseNDC.current.set(x, y);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        markActive();
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        mouseNDC.current.set(x, y);
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Check if click was on interactive UI element
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        if (tagName === "button" || tagName === "a" || tagName === "input" || tagName === "textarea") {
          return;
        }
      }
      setAttackTrigger((prev) => prev + 1);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const fadeThreshold = 380;
      const newOpacity = Math.max(0, 1 - scrollY / fadeThreshold);
      setOpacity(newOpacity);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("click", handleClick, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, []);

  return (
    <div
      id="clay-hero-diorama"
      className="fixed inset-0 pointer-events-none z-[5] transition-opacity duration-300"
      style={{
        opacity,
        visibility: opacity <= 0 ? "hidden" : "visible",
      }}
      aria-hidden="true"
    >
      <Canvas
        shadows="soft"
        camera={{
          position: [0, 4.2, 9.8],
          fov: 44,
          near: 0.1,
          far: 50,
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
        }}
        frameloop={opacity > 0 ? "always" : "never"}
      >
        <Suspense fallback={null}>
          <SceneController
            mouseNDC={mouseNDC}
            isUserActive={isUserActive}
            attackTrigger={attackTrigger}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
