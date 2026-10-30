import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const CLOSED_REACTOR_ALIGNMENT = {
  rotation: {
    x: 7.5,   // degrees (pitch) calibrated by user
    y: -67.5, // degrees (yaw) calibrated by user
    z: -9.5,  // degrees (roll) calibrated by user
  },
  position: {
    x: -0.8083, // Calibrated X position
    y: 0.3921,  // Calibrated Y position
    z: -0.96,   // Calibrated Z position (depth)
  },
  scale: 0.85,
  camera: {
    fov: 42,
    distanceZ: 2.1,
  },
  lighting: {
    ambient: 0.95,
    directional: 2.2,
    pointCore: 3.5,
  },
};

// Default export alias
export const ARC_REACTOR_ALIGNMENT = CLOSED_REACTOR_ALIGNMENT;

export interface ArcReactorController {
  isReady: () => boolean;
  setOpacity: (alpha: number) => void;
  resetToDefaultPose: (instant?: boolean) => void;
  onScrollActivity: (isScrolling: boolean) => void;
  isAtBasePose: () => boolean;
  boomerangToBase: (onComplete?: () => void) => void;
  resize: () => void;
  destroy: () => void;
}

/**
 * Initializes the interactive Three.js 3D Arc Reactor (closed model only).
 * - Exact lighting & authentic PBR materials matching the calibration tool and reference picture
 * - High-speed momentum spinning with magnetic auto-adjust boomerang return
 * - Subtle hover micro-spin & tilt responsiveness
 * - Boomerang return on scroll before transposing to video
 */
export function initInteractiveArcReactor(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  onModelLoaded?: () => void
): ArcReactorController {
  const width = canvas.width || 960;
  const height = canvas.height || 540;

  // 1. Renderer Setup with ACES Tone Mapping matching the calibration tool
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 2. Scene & Camera
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    CLOSED_REACTOR_ALIGNMENT.camera.fov,
    width / height,
    0.1,
    50
  );
  camera.position.set(0, 0, CLOSED_REACTOR_ALIGNMENT.camera.distanceZ);

  // 3. Clean Studio Lighting Setup (Matching calibration suite & reference picture)
  // (a) Clean ambient light so all metallic parts, screws, and coils are clearly illuminated
  const ambientLight = new THREE.AmbientLight(0xffffff, CLOSED_REACTOR_ALIGNMENT.lighting.ambient);
  scene.add(ambientLight);

  // (b) Primary Key Directional Light: Crisp specular highlights from front-right
  const keyLight = new THREE.DirectionalLight(0xffffff, CLOSED_REACTOR_ALIGNMENT.lighting.directional);
  keyLight.position.set(2.0, 3.8, 3.0);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 10;
  keyLight.shadow.bias = -0.00015;
  scene.add(keyLight);

  // (c) Front-Left Fill Light: Softens shadows across the left half
  const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
  fillLight.position.set(-2.0, 1.0, 2.5);
  scene.add(fillLight);

  // (d) Cool Cyan/Blue Rim Light for metallic edge separation
  const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
  rimLight.position.set(-3.0, -1.0, 1.0);
  scene.add(rimLight);

  // (e) Core Palladium Reactor Light: Cyan point light right at core
  const coreLight = new THREE.PointLight(
    0x00f0ff,
    CLOSED_REACTOR_ALIGNMENT.lighting.pointCore,
    6.0,
    1.5
  );
  coreLight.position.set(
    CLOSED_REACTOR_ALIGNMENT.position.x,
    CLOSED_REACTOR_ALIGNMENT.position.y,
    CLOSED_REACTOR_ALIGNMENT.position.z
  );
  scene.add(coreLight);

  // (f) Inner High-Intensity Core Flare
  const innerFlare = new THREE.PointLight(0x67e8f9, 2.0, 3.0, 2.0);
  innerFlare.position.copy(coreLight.position);
  scene.add(innerFlare);

  // 4. Floating Holographic Energy Particles
  const particleCount = 45;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSpeeds = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.35 + Math.random() * 0.75;
    particlePositions[i * 3] = Math.cos(angle) * radius;
    particlePositions[i * 3 + 1] = CLOSED_REACTOR_ALIGNMENT.position.y + (Math.random() - 0.5) * 0.6;
    particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    particleSpeeds[i] = 0.2 + Math.random() * 0.5;
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.016,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // 5. Model Container & Baseline Rotation
  let baseRotX = THREE.MathUtils.degToRad(CLOSED_REACTOR_ALIGNMENT.rotation.x);
  let baseRotY = THREE.MathUtils.degToRad(CLOSED_REACTOR_ALIGNMENT.rotation.y);
  let baseRotZ = THREE.MathUtils.degToRad(CLOSED_REACTOR_ALIGNMENT.rotation.z);

  const wrapper = new THREE.Group();
  scene.add(wrapper);

  wrapper.position.set(
    CLOSED_REACTOR_ALIGNMENT.position.x,
    CLOSED_REACTOR_ALIGNMENT.position.y,
    CLOSED_REACTOR_ALIGNMENT.position.z
  );
  wrapper.scale.setScalar(CLOSED_REACTOR_ALIGNMENT.scale);

  let isClosedLoaded = false;

  // 6. Load ONLY the Closed Arc Reactor GLB Model
  const loader = new GLTFLoader();

  const applyMaterialSetup = (root: THREE.Object3D) => {
    root.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.map.anisotropy = 16;
          }
          // Machined metallic steel & copper reflectivity without crushing darks
          mat.metalness = 0.78;
          mat.roughness = 0.35;
          mat.needsUpdate = true;
        }
      }
    });
  };

  // Load closed reactor
  loader.load(
    "/models/closed-reactor.glb",
    (gltf) => {
      const modelRoot = gltf.scene;
      const box = new THREE.Box3().setFromObject(modelRoot);
      const center = box.getCenter(new THREE.Vector3());
      modelRoot.position.sub(center);
      applyMaterialSetup(modelRoot);
      wrapper.add(modelRoot);
      isClosedLoaded = true;
      onModelLoaded?.();
    },
    undefined,
    () => {
      // Fallback to /models/arc-reactor.glb
      loader.load(
        "/models/arc-reactor.glb",
        (gltf2) => {
          const modelRoot = gltf2.scene;
          const box = new THREE.Box3().setFromObject(modelRoot);
          const center = box.getCenter(new THREE.Vector3());
          modelRoot.position.sub(center);
          applyMaterialSetup(modelRoot);
          wrapper.add(modelRoot);
          isClosedLoaded = true;
          onModelLoaded?.();
        },
        undefined,
        (err2) => {
          console.error("[ArcReactor] Failed to load arc reactor model:", err2);
        }
      );
    }
  );

  // 7. Interactive Drag & Spin Mechanics with Enhanced Spinning & Hovering
  let isPointerDown = false;
  let isUserInteracting = false;
  let isScrollingNow = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let lastMoveX = 0;
  let lastMoveY = 0;
  let lastMoveTime = performance.now();

  let rotVelocityX = 0;
  let rotVelocityY = 0;
  let slideVelX = 0;
  let slideVelY = 0;

  let currentRotX = baseRotX;
  let currentRotY = baseRotY;
  let targetRotX = baseRotX;
  let targetRotY = baseRotY;

  // Hover micro-spin & tilt states
  let hoverSurge = 0;
  let hoverOffsetX = 0;
  let hoverOffsetY = 0;
  let targetHoverX = 0;
  let targetHoverY = 0;

  // Dedicated boomerang snap-to-base states
  let isReturningToBase = false;
  let onBaseReturnComplete: (() => void) | null = null;

  const onPointerDown = (e: PointerEvent) => {
    isPointerDown = true;
    isUserInteracting = true;
    pointerStartX = e.clientX;
    pointerStartY = e.clientY;
    lastMoveX = e.clientX;
    lastMoveY = e.clientY;
    lastMoveTime = performance.now();
    rotVelocityX = 0;
    rotVelocityY = 0;
    slideVelX = 0;
    slideVelY = 0;
    container.style.cursor = "grabbing";
    e.stopPropagation();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isPointerDown) return;
    const now = performance.now();
    const dt = Math.max(8, now - lastMoveTime);
    const dx = e.clientX - lastMoveX;
    const dy = e.clientY - lastMoveY;
    lastMoveX = e.clientX;
    lastMoveY = e.clientY;
    lastMoveTime = now;

    const sensitivity = 0.009;
    targetRotY += dx * sensitivity;
    targetRotX += dy * sensitivity;

    // Pitch clamp to prevent unnatural upside-down flipping
    targetRotX = Math.max(baseRotX - Math.PI * 0.38, Math.min(baseRotX + Math.PI * 0.38, targetRotX));

    // Throw velocity with smooth momentum
    const speedX = (dx / dt) * 16.67;
    const speedY = (dy / dt) * 16.67;
    rotVelocityY = speedX * sensitivity * 1.35;
    rotVelocityX = speedY * sensitivity * 1.35;
    e.stopPropagation();
  };

  const onPointerUp = () => {
    isPointerDown = false;
    container.style.cursor = "grab";
    const maxSpin = 0.25;
    rotVelocityY = Math.max(-maxSpin, Math.min(maxSpin, rotVelocityY));
    rotVelocityX = Math.max(-maxSpin * 0.5, Math.min(maxSpin * 0.5, rotVelocityX));
  };

  // Hover micro-spin & tilt handler
  const onContainerPointerMove = (e: PointerEvent) => {
    if (isPointerDown) return;
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to +1
      const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to +1

      targetHoverY = relX * 0.35;
      targetHoverX = -relY * 0.16;
    }
  };

  const onPointerEnter = () => {
    container.style.cursor = "grab";
    hoverSurge = 1.0;
  };

  const onPointerLeave = () => {
    isPointerDown = false;
    container.style.cursor = "default";
    hoverSurge = 0.0;
    targetHoverX = 0;
    targetHoverY = 0;
  };

  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onContainerPointerMove);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointerenter", onPointerEnter);
  container.addEventListener("pointerleave", onPointerLeave);

  // 8. Render & Animation Loop with Boomerang Ice-Sliding Physics
  let animId: number | null = null;
  const clock = new THREE.Clock();

  const shortestAngleDiff = (from: number, to: number) => {
    let diff = (to - from) % (Math.PI * 2);
    if (diff > Math.PI) diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;
    return diff;
  };

  const animate = () => {
    animId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);
    const elapsedTime = clock.getElapsedTime();

    // Breathing pulse for reactor core
    const pulse = Math.sin(elapsedTime * 2.8) * 0.4;
    coreLight.intensity = CLOSED_REACTOR_ALIGNMENT.lighting.pointCore + pulse + hoverSurge * 0.8;
    innerFlare.intensity = 2.0 + pulse * 0.4 + hoverSurge * 0.4;

    // Animate energy particles drifting around core
    if (particles) {
      particles.rotation.y = elapsedTime * 0.12;
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime * particleSpeeds[i] + i) * 0.0006;
      }
      particleGeometry.attributes.position.needsUpdate = true;
    }

    // Smooth hover micro-spin lerp
    hoverOffsetX = THREE.MathUtils.lerp(hoverOffsetX, targetHoverY, 0.12);
    hoverOffsetY = THREE.MathUtils.lerp(hoverOffsetY, targetHoverX, 0.12);

    // --- BOOMERANG PHYSICS & ENHANCED SPINNING ENGINE ---
    if (isReturningToBase) {
      // Rapid snappy boomerang return before transposing into video
      const springK = 64.0;
      const dampingC = 9.8;

      const diffX = baseRotX - currentRotX;
      const diffY = shortestAngleDiff(currentRotY, baseRotY);

      const accelX = diffX * springK - slideVelX * dampingC;
      const accelY = diffY * springK - slideVelY * dampingC;

      slideVelX += accelX * delta;
      slideVelY += accelY * delta;

      currentRotX += slideVelX * delta;
      currentRotY += slideVelY * delta;

      targetRotX = currentRotX;
      targetRotY = currentRotY;

      if (Math.abs(diffX) < 0.015 && Math.abs(diffY) < 0.015 && Math.abs(slideVelX) + Math.abs(slideVelY) < 0.06) {
        currentRotX = baseRotX;
        currentRotY = baseRotY;
        targetRotX = baseRotX;
        targetRotY = baseRotY;
        slideVelX = 0;
        slideVelY = 0;
        rotVelocityX = 0;
        rotVelocityY = 0;
        isReturningToBase = false;
        if (onBaseReturnComplete) {
          const cb = onBaseReturnComplete;
          onBaseReturnComplete = null;
          cb();
        }
      }
    } else if (!isPointerDown) {
      if (isScrollingNow) {
        const springK = 48.0;
        const dampingC = 8.5;

        const diffX = baseRotX - currentRotX;
        const diffY = shortestAngleDiff(currentRotY, baseRotY);

        const accelX = diffX * springK - slideVelX * dampingC;
        const accelY = diffY * springK - slideVelY * dampingC;

        slideVelX += accelX * delta;
        slideVelY += accelY * delta;

        currentRotX += slideVelX * delta;
        currentRotY += slideVelY * delta;

        targetRotX = currentRotX;
        targetRotY = currentRotY;
        rotVelocityX = 0;
        rotVelocityY = 0;
      } else {
        // Free spin momentum (0.958 friction allows multiple revolutions)
        targetRotX += rotVelocityX;
        targetRotY += rotVelocityY;
        rotVelocityX *= 0.958;
        rotVelocityY *= 0.958;
        slideVelX = 0;
        slideVelY = 0;

        // Auto-adjusts after spinning: once spin velocity winds down, smoothly boomerangs back to base
        const totalVel = Math.abs(rotVelocityX) + Math.abs(rotVelocityY);
        if (totalVel < 0.006) {
          rotVelocityX = 0;
          rotVelocityY = 0;
          const diffX = baseRotX - currentRotX;
          const diffY = shortestAngleDiff(currentRotY, baseRotY);
          targetRotX = currentRotX + diffX * 0.08;
          targetRotY = currentRotY + diffY * 0.08;
        }

        currentRotX = THREE.MathUtils.lerp(currentRotX, targetRotX, 0.25);
        currentRotY = THREE.MathUtils.lerp(currentRotY, targetRotY, 0.25);
      }
    } else {
      slideVelX = 0;
      slideVelY = 0;
      currentRotX = THREE.MathUtils.lerp(currentRotX, targetRotX, 0.3);
      currentRotY = THREE.MathUtils.lerp(currentRotY, targetRotY, 0.3);
    }

    if (wrapper) {
      wrapper.rotation.set(currentRotX + hoverOffsetY, currentRotY + hoverOffsetX, baseRotZ);
    }

    renderer.render(scene, camera);
  };

  animate();

  // 9. Controller API
  return {
    isReady() {
      return isClosedLoaded;
    },
    setOpacity(alpha: number) {
      const clampedAlpha = Math.max(0, Math.min(1, alpha));
      canvas.style.opacity = clampedAlpha.toString();
      if (clampedAlpha <= 0.01) {
        canvas.style.pointerEvents = "none";
      } else {
        canvas.style.pointerEvents = "auto";
      }
    },
    resetToDefaultPose(instant = false) {
      if (instant) {
        targetRotX = baseRotX;
        targetRotY = baseRotY;
        currentRotX = baseRotX;
        currentRotY = baseRotY;
        rotVelocityX = 0;
        rotVelocityY = 0;
        hoverOffsetX = 0;
        hoverOffsetY = 0;
        if (wrapper) wrapper.rotation.set(baseRotX, baseRotY, baseRotZ);
      } else {
        targetRotX = baseRotX;
        targetRotY = baseRotY;
        hoverOffsetX = 0;
        hoverOffsetY = 0;
      }
    },
    onScrollActivity(isScrolling: boolean) {
      isScrollingNow = isScrolling;
      if (isScrolling) {
        isPointerDown = false;
        container.style.cursor = "grab";
        targetHoverX = 0;
        targetHoverY = 0;
      }
    },
    isAtBasePose() {
      const diffX = Math.abs(baseRotX - currentRotX);
      const diffY = Math.abs(shortestAngleDiff(currentRotY, baseRotY));
      const hasMomentum = Math.abs(rotVelocityX) + Math.abs(rotVelocityY) > 0.005;
      const hasHover = Math.abs(hoverOffsetX) + Math.abs(hoverOffsetY) > 0.02;
      return diffX < 0.035 && diffY < 0.035 && !hasMomentum && !hasHover && !isPointerDown && !isReturningToBase;
    },
    boomerangToBase(onComplete?: () => void) {
      isPointerDown = false;
      container.style.cursor = "grab";
      targetHoverX = 0;
      targetHoverY = 0;
      hoverOffsetX = 0;
      hoverOffsetY = 0;

      const diffX = Math.abs(baseRotX - currentRotX);
      const diffY = Math.abs(shortestAngleDiff(currentRotY, baseRotY));

      if (diffX < 0.025 && diffY < 0.025 && Math.abs(rotVelocityX) + Math.abs(rotVelocityY) < 0.005) {
        currentRotX = baseRotX;
        currentRotY = baseRotY;
        targetRotX = baseRotX;
        targetRotY = baseRotY;
        slideVelX = 0;
        slideVelY = 0;
        rotVelocityX = 0;
        rotVelocityY = 0;
        isReturningToBase = false;
        onComplete?.();
        return;
      }

      isReturningToBase = true;
      onBaseReturnComplete = onComplete || null;
    },
    resize() {
      const w = canvas.clientWidth || 960;
      const h = canvas.clientHeight || 540;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    destroy() {
      if (animId !== null) cancelAnimationFrame(animId);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onContainerPointerMove);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    },
  };
}
