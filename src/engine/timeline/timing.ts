/**
 * Timeline utilities.
 *
 * Beginners think in SECONDS; Remotion thinks in FRAMES. These helpers convert
 * between the two and give you small building blocks (progress, keyframes,
 * stagger, spring) that every component in the kit uses.
 */
import { interpolate, spring } from "remotion";
import { EasingName, getEasing } from "./easing";

/** Seconds → frames (rounded). `sec(1.5, 30)` = 45. */
export const sec = (seconds: number, fps: number) => Math.round(seconds * fps);

/** Frames → seconds. */
export const toSeconds = (frames: number, fps: number) => frames / fps;

/**
 * 0 → 1 progress of an animation that starts at `start` and lasts `duration` frames.
 * Clamped, with an easing curve applied.
 */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: EasingName = "snappy",
) => {
  if (duration <= 0) return frame >= start ? 1 : 0;
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: getEasing(easing),
  });
};

/** Linear blend between two numbers. */
export const mix = (from: number, to: number, t: number) => from + (to - from) * t;

/** A keyframe: at `at` (frames, relative) the value is `value`. */
export type Keyframe = { at: number; value: number; easing?: EasingName };

/**
 * Multi-keyframe animation. Each segment can have its own easing (taken from the
 * keyframe that the segment ENDS on).
 *
 *   keyframes(frame, [
 *     { at: 0,  value: 1 },
 *     { at: 20, value: 1.3, easing: "punch" },
 *     { at: 60, value: 1.1, easing: "smooth" },
 *   ])
 */
export const keyframes = (frame: number, frames: Keyframe[]): number => {
  if (frames.length === 0) return 0;
  const sorted = [...frames].sort((a, b) => a.at - b.at);
  if (frame <= sorted[0].at) return sorted[0].value;
  for (let i = 1; i < sorted.length; i++) {
    const a = sorted[i - 1];
    const b = sorted[i];
    if (frame <= b.at) {
      const t = progress(frame, a.at, b.at - a.at, b.easing ?? "smooth");
      return mix(a.value, b.value, t);
    }
  }
  return sorted[sorted.length - 1].value;
};

/** Delay (in frames) for item `index` in a staggered group. */
export const stagger = (index: number, eachFrames: number, startFrame = 0) =>
  startFrame + index * eachFrames;

/** Physically-based 0 → 1 spring, starting at `delay` frames. */
export const springIn = (
  frame: number,
  fps: number,
  delay = 0,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
) =>
  spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8, ...config },
  });

/**
 * Deterministic pseudo-random number (0..1) from a seed.
 * NEVER use Math.random() in Remotion — every frame must render identically.
 */
export const seeded = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Soft, looping "hand-made" wobble used for paper cut-outs and idle motion. */
export const wobble = (frame: number, speed = 1, amount = 1, seed = 0) =>
  (Math.sin((frame + seed * 37) * 0.08 * speed) * 0.6 +
    Math.sin((frame + seed * 11) * 0.031 * speed) * 0.4) *
  amount;

/**
 * "Stepped" time: holds each pose for `step` frames. Gives the choppy, on-twos
 * stop-motion feel typical of paper animation. step=2 ≈ animating on twos.
 */
export const stepped = (frame: number, step = 2) => Math.floor(frame / step) * step;
