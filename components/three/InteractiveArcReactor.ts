import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
// Calibration Extension HUD tool (commented out for now as requested)
// import { initArcReactorCalibrationExtension } from "./ArcReactorCalibrationExtension";

export const OPENED_REACTOR_ALIGNMENT = {
  rotation: {
    x: 6.0,   // degrees (pitch / latitude) matching 4.0s opened video frame
    y: -20.5, // degrees (yaw / longitude) matching 4.0s opened video frame
    z: 12.0,  // degrees (roll)
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
    ambient: 0.16,
    directional: 3.2,
    pointCore: 4.5,
  },
};

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
    ambient: 0.16,
    directional: 3.2,
    pointCore: 4.5,
  },
};

// Default export alias
export const ARC_REACTOR_ALIGNMENT = CLOSED_REACTOR_ALIGNMENT;

export type ReactorState = "opened" | "closed";

export interface ArcReactorController {
  isReady: (state?: ReactorState) => boolean;
  setOpacity: (alpha: number, state?: ReactorState) => void;
  setState: (state: ReactorState) => void;
  resetToDefaultPose: (instant?: boolean) => void;
  onScrollActivity: (isScrolling: boolean) => void;
  isAtBasePose: () => boolean;
  boomerangToBase: (onComplete?: () => void) => void;
  resize: () => void;
  destroy: () => void;
}

/**
 * Upgrades a Tripo-generated GLB model (single diffuse map, metalness=0, roughness=0.9)
 * into a high-contrast machined gunmetal / stainless steel chassis with crisp specular highlights,
 * deep dark shadows, and a blazing cyan/electric-blue HDR glowing core and coil segments.
 */
function upgradeTripoReactorMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const origMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    if (!(origMat instanceof THREE.MeshStandardMaterial)) return;

    // Ensure color texture uses sRGB encoding for accurate luma and color math
    if (origMat.map) {
      origMat.map.colorSpace = THREE.SRGBColorSpace;
      origMat.map.anisotropy = 16;
      origMat.map.needsUpdate = true;
    }

    origMat.metalness = 0.92;
    origMat.roughness = 0.32;
    origMat.envMapIntensity = 1.45;

    origMat.userData.reactorUniforms = {
      uMetalnessBase: { value: 0.92 },
      uRoughnessMin: { value: 0.15 },
      uRoughnessMax: { value: 0.52 },
      uGunmetalGamma: { value: 1.65 },
      uGunmetalBrightness: { value: 0.74 },
      uCyanThreshold: { value: 0.08 },
      uCyanSoftness: { value: 0.22 },
      uEmissiveBoost: { value: 4.5 },
      uCoreCyanColor: { value: new THREE.Color("#00f0ff") },
      uDeepBlueColor: { value: new THREE.Color("#0066ff") },
    };

    origMat.customProgramCacheKey = () => "tripo-arc-reactor-pbr-v3";

    origMat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, origMat.userData.reactorUniforms);

      shader.fragmentShader =
        `
        uniform float uMetalnessBase;
        uniform float uRoughnessMin;
        uniform float uRoughnessMax;
        uniform float uGunmetalGamma;
        uniform float uGunmetalBrightness;
        uniform float uCyanThreshold;
        uniform float uCyanSoftness;
        uniform float uEmissiveBoost;
        uniform vec3 uCoreCyanColor;
        uniform vec3 uDeepBlueColor;
        float vEmissiveMask;
        float vSurfaceLuma;
        ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        `
        #include <map_fragment>

        vSurfaceLuma = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));

        // Detect cyan / electric-blue glowing coil and core regions:
        float coolDelta = max(diffuseColor.g, diffuseColor.b) - (diffuseColor.r * 1.12);
        float cyanMask = smoothstep(uCyanThreshold, uCyanThreshold + uCyanSoftness, coolDelta);

        // Catch white-hot core centers
        float hotWhiteCore = smoothstep(0.72, 0.95, vSurfaceLuma) *
                             smoothstep(-0.03, 0.06, diffuseColor.b - diffuseColor.r);

        vEmissiveMask = clamp(max(cyanMask, hotWhiteCore), 0.0, 1.0);

        // Contrast-curve the non-emissive metallic chassis:
        // Crushes muddy grey into deep machined gunmetal while preserving bright steel highlights
        vec3 gunmetalAlbedo = pow(max(diffuseColor.rgb, vec3(0.001)), vec3(uGunmetalGamma)) * uGunmetalBrightness;
        gunmetalAlbedo *= vec3(0.92, 0.96, 1.04);

        diffuseColor.rgb = mix(gunmetalAlbedo, diffuseColor.rgb, vEmissiveMask);
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <roughnessmap_fragment>",
        `
        #include <roughnessmap_fragment>
        float machinedSpecMask = smoothstep(0.12, 0.72, vSurfaceLuma);
        float chassisRoughness = mix(uRoughnessMax, uRoughnessMin, machinedSpecMask);
        roughnessFactor = mix(chassisRoughness, 0.10, vEmissiveMask);
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <metalnessmap_fragment>",
        `
        #include <metalnessmap_fragment>
        metalnessFactor = mix(uMetalnessBase, 0.08, vEmissiveMask);
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        `
        #include <emissivemap_fragment>
        float coreHotness = smoothstep(0.35, 0.90, vSurfaceLuma);
        vec3 plasmaGradient = mix(uDeepBlueColor, uCoreCyanColor, coreHotness);
        vec3 whiteHotCenter = mix(plasmaGradient, vec3(0.90, 0.98, 1.0), smoothstep(0.75, 0.98, vSurfaceLuma));

        totalEmissiveRadiance += whiteHotCenter * vEmissiveMask * uEmissiveBoost;
        `
      );
    };

    origMat.needsUpdate = true;
  });
}

/**
 * Initializes the interactive Three.js 3D Arc Reactor inside the provided container.
 * - Perfectly calibrated to the resting frame
 * - Cinematic lighting matching the video color scheme & metallic contrast
 * - High-speed momentum spinning with magnetic auto-adjust boomerang return
 * - Subtle hover micro-spin & tilt responsiveness
 * - Boomerang return on scroll
 */
export function initInteractiveArcReactor(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  onModelLoaded?: (state: ReactorState) => void
): ArcReactorController {
  const width = canvas.width || 960;
  const height = canvas.height || 540;

  // 1. Renderer Setup with Soft Shadows, IBL & ACES Tone Mapping
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // 2. Scene & Camera
  const scene = new THREE.Scene();

  // Synthetic RoomEnvironment IBL for razor-sharp machined metal reflections
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;

  const camera = new THREE.PerspectiveCamera(
    CLOSED_REACTOR_ALIGNMENT.camera.fov,
    width / height,
    0.1,
    50
  );
  camera.position.set(0, 0, CLOSED_REACTOR_ALIGNMENT.camera.distanceZ);

  // 3. Cinematic Studio Lighting Setup (Matching high-contrast video reference)
  // (a) Low cold ambient so dark crevices stay deep anodized gunmetal (#0a1626)
  const ambientLight = new THREE.AmbientLight(0x0a1626, CLOSED_REACTOR_ALIGNMENT.lighting.ambient);
  scene.add(ambientLight);

  // (b) Primary Key Directional Light: Crisp specular highlight on upper-right steel bevels
  const keyLight = new THREE.DirectionalLight(0xeef6ff, CLOSED_REACTOR_ALIGNMENT.lighting.directional);
  keyLight.position.set(3.5, 4.0, 4.5);
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
  keyLight.shadow.radius = 2.0;
  scene.add(keyLight);

  // (c) Cool metallic fill light from bottom-right
  const fillLight = new THREE.DirectionalLight(0x64748b, 0.85);
  fillLight.position.set(2.5, -3.0, 2.0);
  scene.add(fillLight);

  // (d) High-contrast Cyan/Blue Rim Light for left/back silhouette separation
  const rimLight = new THREE.SpotLight(0x38bdf8, 3.8);
  rimLight.position.set(-4.0, 2.5, -2.5);
  rimLight.angle = 0.65;
  rimLight.penumbra = 0.8;
  scene.add(rimLight);

  // (e) Internal Core Palladium Reactor Light: Vivid cyan point light right at core
  const coreLight = new THREE.PointLight(
    0x00f0ff,
    CLOSED_REACTOR_ALIGNMENT.lighting.pointCore,
    4.0,
    1.8
  );
  coreLight.position.set(
    CLOSED_REACTOR_ALIGNMENT.position.x,
    CLOSED_REACTOR_ALIGNMENT.position.y,
    CLOSED_REACTOR_ALIGNMENT.position.z
  );
  scene.add(coreLight);

  // (f) Inner High-Intensity Core Flare
  const innerFlare = new THREE.PointLight(0x67e8f9, 3.0, 2.5, 2.0);
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
  let currentState: ReactorState = "closed";
  let baseRotX = THREE.MathUtils.degToRad(CLOSED_REACTOR_ALIGNMENT.rotation.x);
  let baseRotY = THREE.MathUtils.degToRad(CLOSED_REACTOR_ALIGNMENT.rotation.y);
  let baseRotZ = THREE.MathUtils.degToRad(CLOSED_REACTOR_ALIGNMENT.rotation.z);

  const wrapper = new THREE.Group();
  scene.add(wrapper);

  const openedWrapper = new THREE.Group();
  const closedWrapper = new THREE.Group();
  wrapper.add(openedWrapper);
  wrapper.add(closedWrapper);
  openedWrapper.visible = false;
  closedWrapper.visible = true;

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
      upgradeTripoReactorMaterials(modelRoot);
      openedWrapper.add(modelRoot);
      isOpenedLoaded = true;
      onModelLoaded?.("opened");
    },
    undefined,
    (err) => {
      console.error("[ArcReactor] Failed to load opened-reactor.glb:", err);
    }
  );

  // Load closed reactor (resting state)
  loader.load(
    "/models/closed-reactor.glb",
    (gltf) => {
      const modelRoot = gltf.scene;
      const box = new THREE.Box3().setFromObject(modelRoot);
      const center = box.getCenter(new THREE.Vector3());
      modelRoot.position.sub(center);
      upgradeTripoReactorMaterials(modelRoot);
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
          upgradeTripoReactorMaterials(modelRoot);
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

  // Initialize initial state pose (calibrated closed reactor)
  applyStateAlignment("closed");

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

    // Direct yaw & pitch rotation with enhanced responsiveness
    const sensitivity = 0.009;
    targetRotY += dx * sensitivity;
    targetRotX += dy * sensitivity;

    // Pitch clamp to prevent unnatural upside-down flipping
    targetRotX = Math.max(baseRotX - Math.PI * 0.38, Math.min(baseRotX + Math.PI * 0.38, targetRotX));

    // Calculate throw velocity based on pointer speed (gives enhanced flick/spin momentum)
    const speedX = (dx / dt) * 16.67;
    const speedY = (dy / dt) * 16.67;
    rotVelocityY = speedX * sensitivity * 1.35;
    rotVelocityX = speedY * sensitivity * 1.35;
    e.stopPropagation();
  };

  const onPointerUp = () => {
    isPointerDown = false;
    container.style.cursor = "grab";
    // Clamp max throw velocity so it spins beautifully without wild runaway
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

      // Responsive micro-spin & tilt on hover:
      // Yaw spin up to ±20 degrees (±0.35 rad) and pitch tilt up to ±9 degrees (±0.16 rad)
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
    innerFlare.intensity = 2.4 + pulse * 0.6 + hoverSurge * 0.5;

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
        // "Boomerang ice sliding" magnetic snap when scrolling:
        // Snaps model immediately and cleanly back to calibrated position
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
        // Free spin momentum with enhanced spinning capability (0.958 friction allows multiple revolutions)
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
          // Magnetic spring return towards calibrated base
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
      // Combine base + drag spin + subtle hover micro-spin/tilt
      wrapper.rotation.set(currentRotX + hoverOffsetY, currentRotY + hoverOffsetX, baseRotZ);
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
      pmremGenerator.dispose();
      roomEnv.dispose();
      renderer.dispose();
    },
  };
}
