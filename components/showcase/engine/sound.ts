// components/showcase/engine/sound.ts
// Zero-asset procedural Web Audio API sound engine built with ui-sound-design skill recipes.
// Rules followed: context-singleton, gain-no-zero-target (0.001 floor), gain-set-before-ramp,
// scheduling-capture-once, stop-after-envelope, exponential-over-linear, volume-max-0.8.

"use client";

class StudioSoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private unlocked: boolean = false;
  private lastHoverTime: number = 0;
  private lastPopTime: number = 0;
  private lastSwipeTime: number = 0;
  private listeners: Set<(enabled: boolean) => void> = new Set();

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): void {
    this.unlocked = true;
    this.getContext();
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(next: boolean): void {
    this.enabled = next;
    this.listeners.forEach((fn) => fn(this.enabled));
    if (next) {
      this.unlock();
      this.playToggle(true);
    }
  }

  public toggleEnabled(): boolean {
    const next = !this.enabled;
    if (!next) {
      // Play falling toggle before muting
      this.unlock();
      this.playToggle(false, true);
    }
    this.setEnabled(next);
    return next;
  }

  public subscribe(fn: (enabled: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private canPlay(force = false): boolean {
    if (!force && (!this.enabled || !this.unlocked)) return false;
    const ctx = this.getContext();
    return Boolean(ctx && ctx.state === "running");
  }

  /**
   * Liquid Bubble Hover:
   * Subtle upward droplet chirp on elastic pills, bubble chips, and cutout surfaces.
   */
  public playBubbleHover(): void {
    if (!this.canPlay()) return;
    const perfNow = performance.now();
    if (perfNow - this.lastHoverTime < 65) return;
    this.lastHoverTime = perfNow;

    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.055;
    const volume = 0.055;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  /**
   * Tactile Bubble Pop:
   * Classic water-droplet / elastic bubble pop (rapid upward pitch inflection + resonant drop).
   */
  public playBubblePop(options: { pitchMultiplier?: number; volume?: number } = {}): void {
    if (!this.canPlay()) return;
    const perfNow = performance.now();
    if (perfNow - this.lastPopTime < 35) return;
    this.lastPopTime = perfNow;

    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const mult = options.pitchMultiplier ?? 1;
    const volume = Math.min(options.volume ?? 0.18, 0.8);
    const duration = 0.078;

    // Primary bubble oscillator (water droplet inflection: 460Hz -> 1320Hz -> 380Hz)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(460 * mult, now);
    osc.frequency.exponentialRampToValueAtTime(1320 * mult, now + 0.028);
    osc.frequency.exponentialRampToValueAtTime(380 * mult, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);

    // Subtle glassy harmonic overtone
    const harm = ctx.createOscillator();
    const harmGain = ctx.createGain();
    harm.type = "triangle";
    harm.frequency.setValueAtTime(920 * mult, now);
    harm.frequency.exponentialRampToValueAtTime(1760 * mult, now + 0.035);

    harmGain.gain.setValueAtTime(volume * 0.28, now);
    harmGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    harm.connect(harmGain);
    harmGain.connect(ctx.destination);
    harm.start(now);
    harm.stop(now + 0.05);
  }

  /**
   * Soft Mechanical / Tactile Click:
   * Bandpass-filtered noise burst for subtle selector clicks.
   */
  public playSoftClick(): void {
    if (!this.canPlay()) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.045;
    const volume = 0.14;

    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1800;
    filter.Q.value = 2.2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
  }

  /**
   * Card Swipe / Morph Whoosh + Bubble Pop:
   * Played when Selected Work project cards sweep right-to-left & shrink to bottom-left,
   * or when certification bento cards expand.
   */
  public playCardSwipe(): void {
    if (!this.canPlay()) return;
    const perfNow = performance.now();
    if (perfNow - this.lastSwipeTime < 140) return;
    this.lastSwipeTime = perfNow;

    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.19;
    const volume = 0.14;

    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Sweep high-to-low to mirror the right-to-bottom-left shrinking motion
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.8;
    filter.frequency.setValueAtTime(2800, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + duration * 0.28);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);

    // Subtle companion bubble pop as the new card springs in
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = "sine";
    popOsc.frequency.setValueAtTime(340, now + 0.03);
    popOsc.frequency.exponentialRampToValueAtTime(860, now + 0.085);
    popOsc.frequency.exponentialRampToValueAtTime(440, now + 0.14);

    popGain.gain.setValueAtTime(0.001, now + 0.03);
    popGain.gain.exponentialRampToValueAtTime(0.11, now + 0.05);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(now + 0.03);
    popOsc.stop(now + 0.15);
  }

  /**
   * Binary State Toggle (Rising for ON/Open, Falling for OFF/Close):
   */
  public playToggle(isOn: boolean, force = false): void {
    if (!this.canPlay(force)) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.12;
    const volume = 0.18;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(isOn ? 480 : 740, now);
    osc.frequency.exponentialRampToValueAtTime(isOn ? 780 : 440, now + duration);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  /**
   * Ascending Major Triad Chime for Success / AI Reply / CV Download:
   */
  public playSuccessChime(): void {
    if (!this.canPlay()) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const baseFreq = 523.25; // C5
    const ratios = [1, 1.25, 1.5]; // Major triad
    const noteDuration = 0.13;
    const gap = 0.055;
    const volume = 0.16;

    ratios.forEach((ratio, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + i * (noteDuration * 0.65 + gap);

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq * ratio, startTime);

      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + noteDuration + 0.01);
    });
  }
}

export const soundEngine = new StudioSoundEngine();

/**
 * Attaches global delegated hover & click bubble sounds to interactive UI elements.
 * Call once from ShowcaseRoot on mount.
 */
export function attachGlobalUISoundListeners(): () => void {
  if (typeof window === "undefined") return () => {};

  const HOVER_SELECTOR =
    ".lc-elastic-pill, .lc-bubble-chip, .lc-bubble-card, .lc-cutout-surface, .js-swatch";
  const CLICK_SELECTOR =
    "button, a, [role='button'], .lc-elastic-pill, .lc-bubble-chip, .lc-bubble-card, .lc-cutout-surface";

  let lastHoveredEl: Element | null = null;

  const handleUnlock = () => {
    soundEngine.unlock();
  };

  const handlePointerOver = (e: PointerEvent) => {
    const target = e.target as Element | null;
    if (!target || typeof target.closest !== "function") return;
    const interactive = target.closest(HOVER_SELECTOR);
    if (interactive && interactive !== lastHoveredEl) {
      lastHoveredEl = interactive;
      soundEngine.playBubbleHover();
    } else if (!interactive) {
      lastHoveredEl = null;
    }
  };

  const handlePointerDown = (e: PointerEvent) => {
    soundEngine.unlock();
    const target = e.target as Element | null;
    if (!target || typeof target.closest !== "function") return;
    const interactive = target.closest(CLICK_SELECTOR);
    if (!interactive) return;

    // Pitch variation based on element class for richer tactile feel
    if (interactive.classList.contains("lc-bubble-card")) {
      soundEngine.playCardSwipe();
    } else if (interactive.classList.contains("lc-cutout-surface")) {
      soundEngine.playBubblePop({ pitchMultiplier: 0.88, volume: 0.18 });
    } else if (interactive.classList.contains("lc-elastic-pill")) {
      soundEngine.playBubblePop({ pitchMultiplier: 1.08, volume: 0.2 });
    } else {
      soundEngine.playBubblePop({ pitchMultiplier: 1.0, volume: 0.16 });
    }
  };

  window.addEventListener("pointerdown", handlePointerDown, { passive: true });
  window.addEventListener("pointerover", handlePointerOver, { passive: true });
  window.addEventListener("keydown", handleUnlock, { passive: true, once: true });
  window.addEventListener("wheel", handleUnlock, { passive: true, once: true });

  return () => {
    window.removeEventListener("pointerdown", handlePointerDown);
    window.removeEventListener("pointerover", handlePointerOver);
    window.removeEventListener("keydown", handleUnlock);
    window.removeEventListener("wheel", handleUnlock);
  };
}
