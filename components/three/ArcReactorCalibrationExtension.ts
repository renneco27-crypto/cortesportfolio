import * as THREE from "three";

export interface ReactorCalibrationConfig {
  posX: number;
  posY: number;
  posZ: number;
  pitch: number; // Rot X (degrees)
  yaw: number; // Rot Y (degrees)
  roll: number; // Rot Z (degrees)
  scale: number;
  fov: number;
  camDist: number;
  model: "opened" | "closed";
  overlayMode: "off" | "alpha50" | "difference" | "screen";
  overlayOpacity: number;
}

export const STORAGE_KEY = "ARC_REACTOR_CALIBRATION_V1";

export const DEFAULT_OPENED_CALIBRATION: ReactorCalibrationConfig = {
  posX: -0.05,
  posY: 0.072,
  posZ: 0.0,
  pitch: 6.0,
  yaw: -110.5,
  roll: 0.0,
  scale: 0.86,
  fov: 42,
  camDist: 2.1,
  model: "opened",
  overlayMode: "off",
  overlayOpacity: 0.6,
};

export const DEFAULT_CLOSED_CALIBRATION: ReactorCalibrationConfig = {
  posX: 0.0,
  posY: 0.0736,
  posZ: 0.0,
  pitch: 2.0,
  yaw: -106.5,
  roll: 0.0,
  scale: 0.84,
  fov: 45,
  camDist: 2.0,
  model: "closed",
  overlayMode: "off",
  overlayOpacity: 0.6,
};

/**
 * In-Page 3D Arc Reactor Calibration Extension.
 * Injects a floating HUD + direct on-canvas drag controls onto the webpage.
 * Automatically persists to localStorage and binds to window.__ARC_REACTOR_CALIBRATION__.
 */
export function initArcReactorCalibrationExtension(params: {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  wrapper: THREE.Group;
  camera: THREE.PerspectiveCamera;
  openedWrapper: THREE.Group;
  closedWrapper: THREE.Group;
  onUpdate?: (config: ReactorCalibrationConfig) => void;
}) {
  const { canvas, container, wrapper, camera, openedWrapper, closedWrapper, onUpdate } = params;

  // 1. Load saved config or use defaults
  let config: ReactorCalibrationConfig = { ...DEFAULT_OPENED_CALIBRATION };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      config = { ...config, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("[Calibration] Failed to parse saved config:", e);
  }

  // Expose globally on window for instant retrieval
  (window as unknown as Record<string, unknown>).__ARC_REACTOR_CALIBRATION__ = config;
  (window as unknown as Record<string, unknown>).__getArcReactorPosition = () => config;

  let activeDragMode: "move" | "rotate" | "scale" = "move";
  let isCalibrating = false;

  // 2. Reference Image Overlay element inside container
  const refImg = document.createElement("img");
  refImg.id = "arc-calib-ref-overlay";
  refImg.src = config.model === "opened" ? "/assets/arc_reactor_frame_4s.png" : "/assets/arc_reactor_frame_0s.png";
  refImg.style.cssText =
    "position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;pointer-events:none;z-index:1;display:none;";
  container.appendChild(refImg);

  // 3. Floating Trigger Pill Button
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "arc-calib-toggle-btn";
  toggleBtn.innerHTML = `🛠️ 3D Alignment Tool`;
  toggleBtn.style.cssText =
    "position:fixed;bottom:24px;left:24px;z-index:999999;background:#090d16;border:1px solid #38bdf8;" +
    "color:#38bdf8;padding:8px 16px;border-radius:20px;font-family:monospace;font-size:12px;font-weight:700;" +
    "cursor:pointer;box-shadow:0 4px 20px rgba(0,229,255,0.3);transition:all 0.2s;user-select:none;display:flex;align-items:center;gap:6px;";
  document.body.appendChild(toggleBtn);

  // 4. Floating HUD Panel
  const hud = document.createElement("div");
  hud.id = "arc-calib-hud-panel";
  hud.style.cssText =
    "position:fixed;bottom:70px;left:24px;width:380px;max-width:92vw;background:rgba(9,13,22,0.96);" +
    "border:1px solid #0284c7;border-radius:10px;padding:16px;box-shadow:0 12px 40px rgba(0,0,0,0.85);" +
    "z-index:999999;font-family:-apple-system,BlinkMacSystemFont,monospace,sans-serif;color:#e2e8f0;font-size:12px;" +
    "display:none;backdrop-filter:blur(10px);max-height:85vh;overflow-y:auto;box-sizing:border-box;";

  hud.innerHTML = `
    <style>
      #arc-calib-hud-panel h4 { margin: 0 0 10px; font-size: 13px; color: #38bdf8; display: flex; justify-content: space-between; align-items: center; letter-spacing: 0.5px; }
      #arc-calib-hud-panel .mode-row { display: flex; gap: 6px; margin-bottom: 12px; }
      #arc-calib-hud-panel .mode-row button { flex: 1; padding: 6px 4px; font-size: 11px; font-weight: 700; border-radius: 4px; border: 1px solid #334155; background: #1e293b; color: #cbd5e1; cursor: pointer; transition: all 0.15s; }
      #arc-calib-hud-panel .mode-row button.active { background: #0284c7; color: #fff; border-color: #38bdf8; }
      #arc-calib-hud-panel .ctrl-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 11px; }
      #arc-calib-hud-panel .ctrl-item label { width: 85px; color: #94a3b8; }
      #arc-calib-hud-panel .ctrl-item input[type="range"] { flex: 1; margin: 0 8px; accent-color: #38bdf8; height: 4px; }
      #arc-calib-hud-panel .ctrl-item span.val { width: 50px; text-align: right; font-family: monospace; color: #38bdf8; }
      #arc-calib-hud-panel .btn-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 10px; }
      #arc-calib-hud-panel .btn-grid button { padding: 6px 8px; font-size: 11px; border-radius: 4px; border: 1px solid #334155; background: #111827; color: #e2e8f0; cursor: pointer; font-weight: 600; }
      #arc-calib-hud-panel .btn-grid button:hover { border-color: #38bdf8; background: #1e293b; }
      #arc-calib-code-box { margin-top: 10px; padding: 8px; background: #040711; border: 1px solid #1e293b; border-radius: 4px; font-family: monospace; font-size: 10px; color: #7dd3fc; max-height: 90px; overflow-y: auto; white-space: pre-wrap; word-break: break-all; }
    </style>

    <h4>
      <span>⚡ 3D ARC REACTOR GIZMO</span>
      <span id="arc-calib-close" style="cursor:pointer;font-size:16px;color:#94a3b8;">✕</span>
    </h4>

    <div style="font-size:10px;color:#94a3b8;margin-bottom:8px;">
      Direct Drag Mode on Canvas:
    </div>
    <div class="mode-row">
      <button id="btn-drag-move" class="active">✋ Move (X/Y)</button>
      <button id="btn-drag-rotate">🔄 Rotate (Yaw/Pitch)</button>
      <button id="btn-drag-scale">🔍 Scale</button>
    </div>

    <!-- Target Model Switcher -->
    <div class="mode-row" style="margin-bottom:8px;">
      <button id="btn-model-opened" class="${config.model === 'opened' ? 'active' : ''}">⚡ Opened (4s)</button>
      <button id="btn-model-closed" class="${config.model === 'closed' ? 'active' : ''}">🔒 Closed (0s)</button>
      <button id="btn-flip-face">🔄 Flip 180°</button>
    </div>

    <!-- Sliders -->
    <div class="ctrl-item">
      <label>Yaw (Rot Y)</label>
      <input type="range" id="sl-yaw" min="-180" max="180" step="0.5" value="${config.yaw}">
      <span class="val" id="val-yaw">${config.yaw}°</span>
    </div>
    <div class="ctrl-item">
      <label>Pitch (Rot X)</label>
      <input type="range" id="sl-pitch" min="-180" max="180" step="0.5" value="${config.pitch}">
      <span class="val" id="val-pitch">${config.pitch}°</span>
    </div>
    <div class="ctrl-item">
      <label>Roll (Rot Z)</label>
      <input type="range" id="sl-roll" min="-180" max="180" step="0.5" value="${config.roll}">
      <span class="val" id="val-roll">${config.roll}°</span>
    </div>
    <div class="ctrl-item">
      <label>Offset X</label>
      <input type="range" id="sl-posX" min="-1.5" max="1.5" step="0.005" value="${config.posX}">
      <span class="val" id="val-posX">${config.posX.toFixed(3)}</span>
    </div>
    <div class="ctrl-item">
      <label>Offset Y</label>
      <input type="range" id="sl-posY" min="-1.5" max="1.5" step="0.005" value="${config.posY}">
      <span class="val" id="val-posY">${config.posY.toFixed(3)}</span>
    </div>
    <div class="ctrl-item">
      <label>Offset Z (Depth)</label>
      <input type="range" id="sl-posZ" min="-2.0" max="2.0" step="0.01" value="${config.posZ}">
      <span class="val" id="val-posZ">${config.posZ.toFixed(2)}</span>
    </div>
    <div class="ctrl-item">
      <label>Scale</label>
      <input type="range" id="sl-scale" min="0.2" max="2.5" step="0.01" value="${config.scale}">
      <span class="val" id="val-scale">${config.scale.toFixed(2)}</span>
    </div>
    <div class="ctrl-item">
      <label>Camera FOV</label>
      <input type="range" id="sl-fov" min="20" max="80" step="1" value="${config.fov}">
      <span class="val" id="val-fov">${config.fov}°</span>
    </div>

    <!-- Reference Still Overlays -->
    <div style="font-size:10px;color:#94a3b8;margin:10px 0 4px;">Video Reference Overlay:</div>
    <div class="mode-row">
      <button id="btn-overlay-off" class="${config.overlayMode === 'off' ? 'active' : ''}">Off</button>
      <button id="btn-overlay-alpha" class="${config.overlayMode === 'alpha50' ? 'active' : ''}">50% Alpha</button>
      <button id="btn-overlay-diff" class="${config.overlayMode === 'difference' ? 'active' : ''}">Difference</button>
      <button id="btn-overlay-screen" class="${config.overlayMode === 'screen' ? 'active' : ''}">Screen</button>
    </div>

    <!-- Code box -->
    <div id="arc-calib-code-box"></div>

    <!-- Action Buttons -->
    <div class="btn-grid">
      <button id="btn-copy-json" style="background:#0284c7;color:#fff;border-color:#38bdf8;">📋 Copy JSON</button>
      <button id="btn-save-local" style="background:#059669;color:#fff;border-color:#10b981;">💾 Save Live</button>
      <button id="btn-reset-preset">🔄 Reset Defaults</button>
      <button id="btn-toggle-cards">👁️ Toggle Cards</button>
    </div>
  `;
  document.body.appendChild(hud);

  // Apply transforms to Three.js elements
  function applyTransforms() {
    // Model selection
    openedWrapper.visible = config.model === "opened";
    closedWrapper.visible = config.model === "closed";

    // Orientation & Position
    wrapper.rotation.order = "YXZ";
    wrapper.rotation.set(
      THREE.MathUtils.degToRad(config.pitch),
      THREE.MathUtils.degToRad(config.yaw),
      THREE.MathUtils.degToRad(config.roll)
    );
    wrapper.position.set(config.posX, config.posY, config.posZ);
    wrapper.scale.setScalar(config.scale);

    // Camera
    camera.fov = config.fov;
    camera.position.z = config.camDist;
    camera.updateProjectionMatrix();

    // Reference overlay image
    refImg.src = config.model === "opened" ? "/assets/arc_reactor_frame_4s.png" : "/assets/arc_reactor_frame_0s.png";
    if (config.overlayMode === "off") {
      refImg.style.display = "none";
    } else {
      refImg.style.display = "block";
      if (config.overlayMode === "alpha50") {
        refImg.style.opacity = "0.5";
        refImg.style.mixBlendMode = "normal";
      } else if (config.overlayMode === "difference") {
        refImg.style.opacity = "1.0";
        refImg.style.mixBlendMode = "difference";
      } else if (config.overlayMode === "screen") {
        refImg.style.opacity = "0.85";
        refImg.style.mixBlendMode = "screen";
      }
    }

    // Update Sliders in HUD
    const slYaw = hud.querySelector("#sl-yaw") as HTMLInputElement;
    const slPitch = hud.querySelector("#sl-pitch") as HTMLInputElement;
    const slRoll = hud.querySelector("#sl-roll") as HTMLInputElement;
    const slPosX = hud.querySelector("#sl-posX") as HTMLInputElement;
    const slPosY = hud.querySelector("#sl-posY") as HTMLInputElement;
    const slPosZ = hud.querySelector("#sl-posZ") as HTMLInputElement;
    const slScale = hud.querySelector("#sl-scale") as HTMLInputElement;
    const slFov = hud.querySelector("#sl-fov") as HTMLInputElement;

    if (slYaw) slYaw.value = config.yaw.toString();
    if (slPitch) slPitch.value = config.pitch.toString();
    if (slRoll) slRoll.value = config.roll.toString();
    if (slPosX) slPosX.value = config.posX.toString();
    if (slPosY) slPosY.value = config.posY.toString();
    if (slPosZ) slPosZ.value = config.posZ.toString();
    if (slScale) slScale.value = config.scale.toString();
    if (slFov) slFov.value = config.fov.toString();

    hud.querySelector("#val-yaw")!.textContent = config.yaw.toFixed(1) + "°";
    hud.querySelector("#val-pitch")!.textContent = config.pitch.toFixed(1) + "°";
    hud.querySelector("#val-roll")!.textContent = config.roll.toFixed(1) + "°";
    hud.querySelector("#val-posX")!.textContent = config.posX.toFixed(3);
    hud.querySelector("#val-posY")!.textContent = config.posY.toFixed(3);
    hud.querySelector("#val-posZ")!.textContent = config.posZ.toFixed(2);
    hud.querySelector("#val-scale")!.textContent = config.scale.toFixed(2);
    hud.querySelector("#val-fov")!.textContent = config.fov.toFixed(0) + "°";

    // Update live JSON display
    const codeBox = hud.querySelector("#arc-calib-code-box");
    if (codeBox) {
      codeBox.textContent = JSON.stringify(
        {
          model: config.model,
          position: { x: Number(config.posX.toFixed(4)), y: Number(config.posY.toFixed(4)), z: Number(config.posZ.toFixed(4)) },
          rotation: { x: Number(config.pitch.toFixed(1)), y: Number(config.yaw.toFixed(1)), z: Number(config.roll.toFixed(1)) },
          scale: Number(config.scale.toFixed(3)),
          camera: { fov: config.fov, distanceZ: config.camDist }
        },
        null,
        2
      );
    }

    // Sync window global
    (window as unknown as Record<string, unknown>).__ARC_REACTOR_CALIBRATION__ = config;
    onUpdate?.(config);
  }

  // Toggle HUD display
  function toggleHud(open?: boolean) {
    isCalibrating = open ?? (hud.style.display === "none");
    hud.style.display = isCalibrating ? "block" : "none";
    toggleBtn.style.background = isCalibrating ? "#0284c7" : "#090d16";
    toggleBtn.style.borderColor = isCalibrating ? "#fff" : "#38bdf8";
    toggleBtn.style.color = isCalibrating ? "#fff" : "#38bdf8";

    // When calibrating: ensure 3D canvas is visible and interactive
    if (isCalibrating) {
      canvas.style.opacity = "1";
      canvas.style.pointerEvents = "auto";
    }
  }

  toggleBtn.onclick = () => toggleHud();
  (hud.querySelector("#arc-calib-close") as HTMLElement).onclick = () => toggleHud(false);

  // Keyboard shortcut: Press 'C' or 'G' to toggle calibration HUD
  window.addEventListener("keydown", (e) => {
    if ((e.key === "c" || e.key === "C" || e.key === "g" || e.key === "G") && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
      toggleHud();
    }
  });

  // Mode buttons
  const btnMove = hud.querySelector("#btn-drag-move") as HTMLButtonElement;
  const btnRotate = hud.querySelector("#btn-drag-rotate") as HTMLButtonElement;
  const btnScale = hud.querySelector("#btn-drag-scale") as HTMLButtonElement;

  function setActiveDragMode(mode: "move" | "rotate" | "scale") {
    activeDragMode = mode;
    btnMove.classList.toggle("active", mode === "move");
    btnRotate.classList.toggle("active", mode === "rotate");
    btnScale.classList.toggle("active", mode === "scale");
  }

  btnMove.onclick = () => setActiveDragMode("move");
  btnRotate.onclick = () => setActiveDragMode("rotate");
  btnScale.onclick = () => setActiveDragMode("scale");

  // Model switcher buttons
  const btnOpened = hud.querySelector("#btn-model-opened") as HTMLButtonElement;
  const btnClosed = hud.querySelector("#btn-model-closed") as HTMLButtonElement;

  btnOpened.onclick = () => {
    config.model = "opened";
    btnOpened.classList.add("active");
    btnClosed.classList.remove("active");
    applyTransforms();
  };
  btnClosed.onclick = () => {
    config.model = "closed";
    btnClosed.classList.add("active");
    btnOpened.classList.remove("active");
    applyTransforms();
  };

  (hud.querySelector("#btn-flip-face") as HTMLButtonElement).onclick = () => {
    config.yaw = (config.yaw + 180) % 360;
    if (config.yaw > 180) config.yaw -= 360;
    applyTransforms();
  };

  // Overlay blend modes
  const overlayButtons = {
    off: hud.querySelector("#btn-overlay-off") as HTMLButtonElement,
    alpha50: hud.querySelector("#btn-overlay-alpha") as HTMLButtonElement,
    difference: hud.querySelector("#btn-overlay-diff") as HTMLButtonElement,
    screen: hud.querySelector("#btn-overlay-screen") as HTMLButtonElement,
  };

  Object.entries(overlayButtons).forEach(([mode, btn]) => {
    btn.onclick = () => {
      config.overlayMode = mode as ReactorCalibrationConfig["overlayMode"];
      Object.values(overlayButtons).forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyTransforms();
    };
  });

  // Sliders input events
  const bindSlider = (id: string, prop: keyof ReactorCalibrationConfig) => {
    const sl = hud.querySelector(`#sl-${id}`) as HTMLInputElement;
    sl.oninput = () => {
      (config as unknown as Record<string, number>)[prop] = parseFloat(sl.value);
      applyTransforms();
    };
  };

  bindSlider("yaw", "yaw");
  bindSlider("pitch", "pitch");
  bindSlider("roll", "roll");
  bindSlider("posX", "posX");
  bindSlider("posY", "posY");
  bindSlider("posZ", "posZ");
  bindSlider("scale", "scale");
  bindSlider("fov", "fov");

  // Copy JSON
  (hud.querySelector("#btn-copy-json") as HTMLButtonElement).onclick = () => {
    const out = {
      model: config.model,
      position: { x: Number(config.posX.toFixed(4)), y: Number(config.posY.toFixed(4)), z: Number(config.posZ.toFixed(4)) },
      rotation: { x: Number(config.pitch.toFixed(1)), y: Number(config.yaw.toFixed(1)), z: Number(config.roll.toFixed(1)) },
      scale: Number(config.scale.toFixed(3)),
      camera: { fov: config.fov, distanceZ: config.camDist }
    };
    navigator.clipboard.writeText(JSON.stringify(out, null, 2)).then(() => {
      alert("✓ Arc Reactor Calibration JSON copied to clipboard!");
    });
  };

  // Save to LocalStorage
  (hud.querySelector("#btn-save-local") as HTMLButtonElement).onclick = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    alert("✓ Saved alignment to browser localStorage! It will auto-load on refresh.");
  };

  // Reset preset
  (hud.querySelector("#btn-reset-preset") as HTMLButtonElement).onclick = () => {
    config = { ...(config.model === "opened" ? DEFAULT_OPENED_CALIBRATION : DEFAULT_CLOSED_CALIBRATION) };
    applyTransforms();
  };

  // Toggle foreground project cards visibility
  let cardsHidden = false;
  (hud.querySelector("#btn-toggle-cards") as HTMLButtonElement).onclick = () => {
    cardsHidden = !cardsHidden;
    const cards = document.querySelectorAll(".ov1-card, .ov1-left");
    cards.forEach((el) => {
      (el as HTMLElement).style.opacity = cardsHidden ? "0.1" : "1";
    });
  };

  // 5. Direct Canvas Pointer Drag Engine
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  const onPointerDown = (e: PointerEvent) => {
    if (!isCalibrating) return;
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    container.style.cursor = "grabbing";
    e.stopPropagation();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging || !isCalibrating) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    dragStartX = e.clientX;
    dragStartY = e.clientY;

    if (activeDragMode === "move") {
      // Screen space pixel to 3D world units conversion
      const vFOV = (config.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFOV / 2) * config.camDist;
      const unitsPerPixel = visibleHeight / (canvas.clientHeight || 540);

      config.posX += dx * unitsPerPixel;
      config.posY -= dy * unitsPerPixel;
    } else if (activeDragMode === "rotate") {
      // Rotation: Yaw (Y) and Pitch (X)
      config.yaw += dx * 0.35;
      config.pitch += dy * 0.35;
    } else if (activeDragMode === "scale") {
      // Scale
      config.scale = Math.max(0.1, config.scale - dy * 0.005);
    }

    applyTransforms();
    e.stopPropagation();
  };

  const onPointerUp = () => {
    isDragging = false;
    container.style.cursor = "grab";
  };

  const onWheel = (e: WheelEvent) => {
    if (!isCalibrating) return;
    if (activeDragMode === "move") {
      config.posZ += e.deltaY * 0.002;
    } else if (activeDragMode === "scale") {
      config.scale = Math.max(0.1, config.scale - e.deltaY * 0.001);
    }
    applyTransforms();
  };

  container.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  container.addEventListener("wheel", onWheel, { passive: true });

  // Initial transform application
  applyTransforms();

  return {
    getConfig: () => config,
    isCalibrating: () => isCalibrating,
    toggleHud,
    destroy: () => {
      toggleBtn.remove();
      hud.remove();
      refImg.remove();
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("wheel", onWheel);
    },
  };
}
