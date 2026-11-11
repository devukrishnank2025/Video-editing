/**
 * <SceneTransition> — wraps one scene and animates it IN (using its own
 * transition) and OUT (using the next scene's transition), so neighbouring
 * scenes overlap and blend.
 *
 * Types:
 *   cut        – instant
 *   fade       – cross-dissolve
 *   slideUp    – new scene pushes up from the bottom (vertical-video native)
 *   slideLeft  – new scene pushes in from the right
 *   whipPan    – very fast slide with heavy directional motion blur
 *   zoomPunch  – old scene zooms into the lens, new one zooms out of it
 *   paperTear  – new scene is revealed behind a ragged, torn-paper edge
 *   iris       – circular reveal from the centre
 *   flash      – white flash hides the cut
 *
 * The component is used automatically by VideoComposition; you rarely need it
 * directly. Choose transitions in the video config: `transitionIn: { type: "whipPan" }`.
 */
import React, { useId } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { TransitionConfig } from "../../config/types";
import { progress, seeded } from "../timeline/timing";
import { SoundEffect } from "./SoundEffect";

const DEFAULT_SFX: Partial<Record<TransitionConfig["type"], string>> = {
  whipPan: "whoosh",
  slideUp: "swoosh",
  slideLeft: "swoosh",
  zoomPunch: "whoosh",
  paperTear: "paper",
  flash: "thud",
};

/** Ragged torn-paper polygon. `p` 0→1 sweeps it from bottom to top. */
const tearPath = (p: number, seed: number) => {
  const pts: string[] = [];
  const edgeY = 115 - p * 130; // in %, travels from below the frame to above it
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * 100;
    const jag = (seeded(i + seed) - 0.5) * 7;
    pts.push(`${x}% ${edgeY + jag}%`);
  }
  return `polygon(0% 100%, ${pts.join(", ")}, 100% 100%)`;
};

export const SceneTransition: React.FC<{
  enter: TransitionConfig;
  exit: TransitionConfig | null;
  enterFrames: number;
  exitFrames: number;
  /** Length of this scene in frames. */
  durationInFrames: number;
  /** false for the very first scene (no entrance). */
  animateIn: boolean;
  children: React.ReactNode;
}> = ({ enter, exit, enterFrames, exitFrames, durationInFrames, animateIn, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const id = useId().replace(/:/g, "");

  // ── IN ──
  const pin = animateIn && enterFrames > 0 ? progress(frame, 0, enterFrames, enter.easing ?? (enter.type === "whipPan" ? "whip" : "snappy")) : 1;
  // ── OUT ── (driven by the next scene's transition)
  const exitStart = durationInFrames - exitFrames;
  const pout = exit && exitFrames > 0 ? progress(frame, exitStart, exitFrames, exit.easing ?? (exit.type === "whipPan" ? "whip" : "snappy")) : 0;

  let style: React.CSSProperties = {};
  let blurX = 0;
  let flash = 0;

  if (animateIn && pin < 1) {
    const q = 1 - pin;
    switch (enter.type) {
      case "fade":
        style.opacity = pin;
        break;
      case "slideUp":
        style.transform = `translateY(${q * height}px)`;
        break;
      case "slideLeft":
        style.transform = `translateX(${q * width}px)`;
        break;
      case "whipPan":
        style.transform = `translateX(${q * width}px)`;
        blurX = Math.sin(pin * Math.PI) * 40;
        break;
      case "zoomPunch":
        style.transform = `scale(${0.6 + pin * 0.4})`;
        style.opacity = Math.min(1, pin * 2.5);
        style.filter = `blur(${q * 14}px)`;
        break;
      case "paperTear":
        style.clipPath = tearPath(pin, 3);
        break;
      case "iris":
        style.clipPath = `circle(${pin * 120}% at 50% 50%)`;
        break;
      case "flash":
        style.opacity = pin > 0.5 ? 1 : 0;
        flash = Math.sin(pin * Math.PI);
        break;
    }
  }

  if (exit && pout > 0) {
    switch (exit.type) {
      case "slideUp":
        style.transform = `${style.transform ?? ""} translateY(${-pout * height * 0.35}px)`;
        style.filter = `brightness(${1 - pout * 0.4})`;
        break;
      case "slideLeft":
        style.transform = `${style.transform ?? ""} translateX(${-pout * width * 0.35}px)`;
        style.filter = `brightness(${1 - pout * 0.4})`;
        break;
      case "whipPan":
        style.transform = `${style.transform ?? ""} translateX(${-pout * width}px)`;
        blurX = Math.max(blurX, Math.sin(pout * Math.PI) * 40);
        break;
      case "zoomPunch":
        style.transform = `${style.transform ?? ""} scale(${1 + pout * 1.4})`;
        style.filter = `blur(${pout * 12}px)`;
        break;
      case "flash":
        flash = Math.max(flash, Math.sin(pout * Math.PI));
        break;
      // fade / paperTear / iris / cut: the incoming scene covers this one.
    }
  }

  const transitionSfx = enter.sfx ?? DEFAULT_SFX[enter.type];

  return (
    <AbsoluteFill>
      {animateIn && enterFrames > 0 && transitionSfx ? <SoundEffect sound={transitionSfx} at={0} volume={0.6} /> : null}
      {blurX > 0.5 ? (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={`whip-${id}`} x="-10%" y="0" width="120%" height="100%">
            <feGaussianBlur stdDeviation={`${blurX} 0`} />
          </filter>
        </svg>
      ) : null}
      {animateIn && enter.type === "paperTear" && pin < 1 ? (
        // A thin white paper edge peeking out above the tear line sells the effect.
        <AbsoluteFill style={{ background: "#f6f1e6", clipPath: tearPath(Math.min(1, pin + 0.035), 3), filter: "drop-shadow(0 -6px 8px rgba(0,0,0,0.4))" }} />
      ) : null}
      <AbsoluteFill style={{ ...style, filter: [style.filter, blurX > 0.5 ? `url(#whip-${id})` : ""].filter(Boolean).join(" ") || undefined, overflow: "hidden" }}>
        {children}
      </AbsoluteFill>
      {flash > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: flash }} /> : null}
    </AbsoluteFill>
  );
};
