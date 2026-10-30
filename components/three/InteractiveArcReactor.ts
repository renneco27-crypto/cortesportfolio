import { initArcReactorCalibrationExtension } from "./ArcReactorCalibrationExtension";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const OPENED_REACTOR_ALIGNMENT = {
  rotation: {
    x: 6.0, // degrees (pitch / latitude) matching 4.0s opened video frame
    y: -20.5, // degrees (yaw / longitude) matching 4.0s opened video frame
    z: 12.0, // degrees (roll)
  },
  position: {
    x: -0.05, // Calibrated X center matching video optical core
    y: 0.072, // Calibrated Y center
    z: 0,
  },
  scale: 0.86,
  camera: {
    fov: 42,
    distanceZ: 2.1,
  },
  lighting: {
    ambient: 0.95,
    directional: 3.2,
    pointCore: 4.5,
  },
};

export const CLOSED_REACTOR_ALIGNMENT = {
  rotation: {
    x: 2.0, // degrees (pitch) matching 0.0s closed video frame
    y: -106.5, // degrees (yaw) matching 0.0s closed video frame
    z: 0.0, // degrees (roll)
  },
  position: {
    x: 0.0,
    y: 0.0736,
    z: 0,
  },
  scale: 0.84,
  camera: {
    fov: 45,
    distanceZ: 2.0,
  },
  lighting: {
    ambient: 0.85,
    directional: 2.8,
    pointCore: 3.8,
  },
};

// Default export alias
export const ARC_REACTOR_ALIGNMENT = OPENED_REACTOR_ALIGNMENT;

export type ReactorState = "opened" | "closed";

export interface ArcReactorController {
  isReady: (state?: ReactorState) => boolean;
  setOpacity: (alpha: number, state?: ReactorState) => void;
  setState: (state: ReactorState) => void;
  resetToDefaultPose: (instant?: boolean) => void;
  onScrollActivity: (isScrolling: boolean) => void;
  resize: () => void;
  destroy: () => void;
}

/**
 * Initializes the interactive Three.js 3D Arc Reactor inside the provided container.
 * - Perfectly calibrated to video frame 0
 * - Interactive pointer drag & spin with smooth inertia and spring-back
 * - Cinematic lighting: top-right key shadow light, pulsing core reactor glow, floating particles
 */
export function initInteractiveArcReactor(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  onModelLoaded?: (state: ReactorState) => void
): ArcReactorController {
  const width = canvas.width || 960;
  const height = canvas.height || 540;

  // 1. Renderer Setup with Soft Shadows & ACES Tone Mapping
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 2. Scene & Camera
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    ARC_REACTOR_ALIGNMENT.camera.fov,
    width / height,
    0.1,
    50
  );
  camera.position.set(0, 0, ARC_REACTOR_ALIGNMENT.camera.distanceZ);

  // 3. Cinematic Lighting Setup
  // (a) Ambient Light
  const ambientLight = new THREE.AmbientLight(0xffffff, ARC_REACTOR_ALIGNMENT.lighting.ambient);
  scene.add(ambientLight);

  // (b) Top-Right Key Directional Light (Casting crisp shadows onto reactor coils & chassis)
  const keyLight = new THREE.DirectionalLight(0xe0f2fe, ARC_REACTOR_ALIGNMENT.lighting.directional);
  keyLight.position.set(2.8, 3.8, 2.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 10;
  keyLight.shadow.camera.left = -1.2;
  keyLight.shadow.camera.right = 1.2;
  keyLight.shadow.camera.top = 1.2;
  keyLight.shadow.camera.bottom = -1.2;
  keyLight.shadow.bias = -0.00015;
  keyLight.shadow.radius = 2.5;
  scene.add(keyLight);

  // (c) Bottom-Left Rim / Accent Light (Cold Cyber-Cyan Rim Highlight)
  const rimLight = new THREE.DirectionalLight(0x0284c7, 1.2);
  rimLight.position.set(-2.4, -1.8, 0.8);
  scene.add(rimLight);

  // (d) Core Palladium Reactor Light (Vivid cyan pulsing point light right at core)
  const coreLight = new THREE.PointLight(
    0x00f0ff,
    ARC_REACTOR_ALIGNMENT.lighting.pointCore,
    6,
    1.6
  );
  coreLight.position.set(
    ARC_REACTOR_ALIGNMENT.position.x,
    ARC_REACTOR_ALIGNMENT.position.y,
    ARC_REACTOR_ALIGNMENT.position.z
  );
  scene.add(coreLight);

  // (e) Inner High-Intensity Core Flare
  const innerFlare = new THREE.PointLight(0x67e8f9, 2.2, 2.5, 2.0);
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
    particlePositions[i * 3 + 1] = ARC_REACTOR_ALIGNMENT.position.y + (Math.random() - 0.5) * 0.6;
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
  let currentState: ReactorState = "opened";
  let baseRotX = THREE.MathUtils.degToRad(OPENED_REACTOR_ALIGNMENT.rotation.x);
  let baseRotY = THREE.MathUtils.degToRad(OPENED_REACTOR_ALIGNMENT.rotation.y);
  let baseRotZ = THREE.MathUtils.degToRad(OPENED_REACTOR_ALIGNMENT.rotation.z);

  const wrapper = new THREE.Group();
  scene.add(wrapper);

  const openedWrapper = new THREE.Group();
  const closedWrapper = new THREE.Group();
  wrapper.add(openedWrapper);
  wrapper.add(closedWrapper);
  closedWrapper.visible = false;

  // Material and emissive reactor core helper
  const setupMaterials = (root: THREE.Object3D) => {
    root.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.envMapIntensity = 1.4;
              const name = (mesh.name + " " + mat.name).toLowerCase();
              if (
                name.includes("core") ||
                name.includes("light") ||
                name.includes("glow") ||
                name.includes("energy") ||
                name.includes("blue") ||
                name.includes("cyan") ||
                mat.emissive.r > 0.05 ||
                mat.emissive.g > 0.05 ||
                mat.emissive.b > 0.05
              ) {
                mat.emissive.set(0x00f0ff);
                mat.emissiveIntensity = 2.6;
              }
            }
          });
        }
      }
    });
  };

  let isOpenedLoaded = false;
  let isClosedLoaded = false;

  // 6. Load Both GLB Models (Opened and Closed)
  const loader = new GLTFLoader();

  // Load opened reactor (4.0s state)
  loader.load(
    "/models/opened-reactor.glb",
    (gltf) => {
      const modelRoot = gltf.scene;
      const box = new THREE.Box3().setFromObject(modelRoot);
      const center = box.getCenter(new THREE.Vector3());
      modelRoot.position.sub(center);
      setupMaterials(modelRoot);
      openedWrapper.add(modelRoot);
      isOpenedLoaded = true;
      onModelLoaded?.("opened");
    },
    undefined,
    (err) => {
      console.error("[ArcReactor] Failed to load opened-reactor.glb:", err);
    }
  );

  // Load closed reactor (0.0s state)
  loader.load(
    "/models/closed-reactor.glb",
    (gltf) => {
      const modelRoot = gltf.scene;
      const box = new THREE.Box3().setFromObject(modelRoot);
      const center = box.getCenter(new THREE.Vector3());
      modelRoot.position.sub(center);
      setupMaterials(modelRoot);
      closedWrapper.add(modelRoot);
      isClosedLoaded = true;
      onModelLoaded?.("closed");
    },
    undefined,
    () => {
      // Fallback to /models/arc-reactor.glb if closed-reactor.glb fails
      loader.load(
        "/models/arc-reactor.glb",
        (gltf2) => {
          const modelRoot = gltf2.scene;
          const box = new THREE.Box3().setFromObject(modelRoot);
          const center = box.getCenter(new THREE.Vector3());
          modelRoot.position.sub(center);
          setupMaterials(modelRoot);
          closedWrapper.add(modelRoot);
        },
        undefined,
        (err2) => {
          console.error("[ArcReactor] Failed to load fallback closed reactor:", err2);
        }
      );
    }
  );

  const applyStateAlignment = (state: ReactorState) => {
    currentState = state;
    const cfg = state === "opened" ? OPENED_REACTOR_ALIGNMENT : CLOSED_REACTOR_ALIGNMENT;

    baseRotX = THREE.MathUtils.degToRad(cfg.rotation.x);
    baseRotY = THREE.MathUtils.degToRad(cfg.rotation.y);
    baseRotZ = THREE.MathUtils.degToRad(cfg.rotation.z);

    openedWrapper.visible = state === "opened";
    closedWrapper.visible = state === "closed";

    wrapper.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
    wrapper.scale.setScalar(cfg.scale);

    camera.fov = cfg.camera.fov;
    camera.position.z = cfg.camera.distanceZ;
    camera.updateProjectionMatrix();

    ambientLight.intensity = cfg.lighting.ambient;
    keyLight.intensity = cfg.lighting.directional;
    coreLight.intensity = cfg.lighting.pointCore;
    coreLight.position.set(cfg.position.x, cfg.position.y, cfg.position.z);
    innerFlare.position.copy(coreLight.position);

    if (!isUserInteracting) {
      currentRotX = baseRotX;
      currentRotY = baseRotY;
      targetRotX = baseRotX;
      targetRotY = baseRotY;
    }
  };

  // 7. Interactive Drag & Spin Mechanics
  let isPointerDown = false;
  let isUserInteracting = false;
  let isScrollingNow = false;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let rotVelocityX = 0;
  let rotVelocityY = 0;
  let currentRotX = baseRotX;
  let currentRotY = baseRotY;
  let targetRotX = baseRotX;
  let targetRotY = baseRotY;
  let hoverSurge = 0;

  // Initialize initial state pose (matches 4.0s opened video frame)
  applyStateAlignment("opened");

  // In-page 3D Calibration Extension HUD & Direct On-Canvas Drag Controls
  const calibrationTool = initArcReactorCalibrationExtension({
    canvas,
    container,
    wrapper,
    camera,
    openedWrapper,
    closedWrapper,
    onUpdate: (cfg) => {
      baseRotX = THREE.MathUtils.degToRad(cfg.pitch);
      baseRotY = THREE.MathUtils.degToRad(cfg.yaw);
      baseRotZ = THREE.MathUtils.degToRad(cfg.roll);
      if (!isPointerDown) {
        currentRotX = baseRotX;
        currentRotY = baseRotY;
        targetRotX = baseRotX;
        targetRotY = baseRotY;
      }
    },
  });

  const onPointerDown = (e: PointerEvent) => {
    isPointerDown = true;
    isUserInteracting = true;
    pointerStartX = e.clientX;
    pointerStartY = e.clientY;
    rotVelocityX = 0;
    rotVelocityY = 0;
    container.style.cursor = "grabbing";
    e.stopPropagation();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isPointerDown) return;
    const dx = e.clientX - pointerStartX;
    const dy = e.clientY - pointerStartY;
    pointerStartX = e.clientX;
    pointerStartY = e.clientY;

    // Direct yaw & pitch rotation
    const sensitivity = 0.007;
    targetRotY += dx * sensitivity;
    targetRotX += dy * sensitivity;

    // Pitch clamp to prevent unnatural flip
    targetRotX = Math.max(baseRotX - Math.PI * 0.35, Math.min(baseRotX + Math.PI * 0.35, targetRotX));

    rotVelocityY = dx * sensitivity * 0.6;
    rotVelocityX = dy * sensitivity * 0.6;
    e.stopPropagation();
  };

  const onPointerUp = () => {
    isPointerDown = false;
    container.style.cursor = "grab";
  };

  const onPointerEnter = () => {
    container.style.cursor = "grab";
    hoverSurge = 1.0;
  };

  const onPointerLeave = () => {
    isPointerDown = false;
    container.style.cursor = "default";
    hoverSurge = 0.0;
  };

  container.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointerenter", onPointerEnter);
  container.addEventListener("pointerleave", onPointerLeave);

  // 8. Render & Animation Loop
  let animId: number | null = null;
  let clock = new THREE.Clock();

  const animate = () => {
    animId = requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);
    const elapsedTime = clock.getElapsedTime();

    // Breathing pulse for reactor core
    const pulse = Math.sin(elapsedTime * 2.8) * 0.4;
    coreLight.intensity = ARC_REACTOR_ALIGNMENT.lighting.pointCore + pulse + hoverSurge * 0.8;
    innerFlare.intensity = 2.0 + pulse * 0.6 + hoverSurge * 0.5;

    // Animate energy particles drifting around core
    if (particles) {
      particles.rotation.y = elapsedTime * 0.12;
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsedTime * particleSpeeds[i] + i) * 0.0006;
      }
      particleGeometry.attributes.position.needsUpdate = true;
    }

    // --- BOOMERANG ICE SLIDING PHYSICS ENGINE ---
    const shortestAngleDiff = (from: number, to: number) => {
      let diff = (to - from) % (Math.PI * 2);
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;
      return diff;
    };

    let slideVelX = 0;
    let slideVelY = 0;

    // Interactive momentum & boomerang ice-sliding spring physics
    if (!isPointerDown) {
      if (isScrollingNow) {
        // "Boomerang ice sliding" magnetic snap when scrolling:
        // High stiffness spring (38.0) + slick ice damping (7.2) creates that slick slide and damped magnetic slot-in!
        const springK = 38.0;
        const dampingC = 7.2;

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
        // Free spin momentum on slick ice
        targetRotX += rotVelocityX;
        targetRotY += rotVelocityY;
        rotVelocityX *= 0.92;
        rotVelocityY *= 0.92;
        slideVelX = 0;
        slideVelY = 0;

        // When resting, gentle magnetic return towards baseline
        if (Math.abs(rotVelocityX) + Math.abs(rotVelocityY) < 0.0006) {
          const diffX = baseRotX - currentRotX;
          const diffY = shortestAngleDiff(currentRotY, baseRotY);
          targetRotX = currentRotX + diffX * 0.045;
          targetRotY = currentRotY + diffY * 0.045;
        }

        currentRotX = THREE.MathUtils.lerp(currentRotX, targetRotX, 0.22);
        currentRotY = THREE.MathUtils.lerp(currentRotY, targetRotY, 0.22);
      }
    } else {
      slideVelX = 0;
      slideVelY = 0;
      currentRotX = THREE.MathUtils.lerp(currentRotX, targetRotX, 0.25);
      currentRotY = THREE.MathUtils.lerp(currentRotY, targetRotY, 0.25);
    }

    if (wrapper) {
      wrapper.rotation.set(currentRotX, currentRotY, baseRotZ);
    }

    renderer.render(scene, camera);
  };

  animate();

  // 9. Controller API
  return {
    isReady(state?: ReactorState) {
      const target = state || currentState;
      return target === "opened" ? isOpenedLoaded : isClosedLoaded;
    },
    setOpacity(alpha: number, state?: ReactorState) {
      if (state && state !== currentState) {
        applyStateAlignment(state);
      }
      const clampedAlpha = Math.max(0, Math.min(1, alpha));
      canvas.style.opacity = clampedAlpha.toString();
      if (clampedAlpha <= 0.01) {
        canvas.style.pointerEvents = "none";
      } else {
        canvas.style.pointerEvents = "auto";
      }
    },
    setState(state: ReactorState) {
      applyStateAlignment(state);
    },
    resetToDefaultPose(instant = false) {
      if (instant) {
        targetRotX = baseRotX;
        targetRotY = baseRotY;
        currentRotX = baseRotX;
        currentRotY = baseRotY;
        rotVelocityX = 0;
        rotVelocityY = 0;
        if (wrapper) wrapper.rotation.set(baseRotX, baseRotY, baseRotZ);
      } else {
        targetRotX = baseRotX;
        targetRotY = baseRotY;
      }
    },
    onScrollActivity(isScrolling: boolean) {
      isScrollingNow = isScrolling;
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
      calibrationTool.destroy();
      container.removeEventListener("pointerdown", onPointerDown);
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
