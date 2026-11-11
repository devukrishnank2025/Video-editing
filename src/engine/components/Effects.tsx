/**
 * EFFECTS — <ShadowEffect>, <GrainEffect>, <Vignette>, <LightEffect>, <MotionBlur>
 *
 * All effects are pure CSS / inline SVG filters, so they render identically in
 * the Studio preview and in the final MP4.
 */
import React, { useId } from "react";
import { seeded, stepped } from "../timeline/timing";
import { useScene } from "../SceneContext";

/* ───────────────────────────── ShadowEffect ───────────────────────────── */

/**
 * Drop shadow for cut-outs. `lift` (0–1) makes the object look like it's raised
 * off the page: the shadow grows, softens and drifts down-right.
 *
 *   <ShadowEffect lift={0.6}><PaperCutLayer …/></ShadowEffect>
 */
export const ShadowEffect: React.FC<{
  lift?: number;
  color?: string;
  angle?: number; // light direction in degrees (0 = from top)
  hard?: boolean; // hard-edged "paper on paper" shadow vs soft floating shadow
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ lift = 0.4, color = "rgba(0,0,0,0.45)", angle = 35, hard = false, style, children }) => {
  const dist = 4 + lift * 26;
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad) * dist;
  const dy = Math.cos(rad) * dist;
  const blur = hard ? 0 : 2 + lift * 22;
  // Two shadows: a tight contact shadow + a soft ambient one = believable depth.
  const filter = hard
    ? `drop-shadow(${dx}px ${dy}px 0 ${color})`
    : `drop-shadow(${dx * 0.3}px ${dy * 0.3}px ${blur * 0.25}px ${color}) drop-shadow(${dx}px ${dy}px ${blur}px ${color})`;
  return <div style={{ filter, ...style }}>{children}</div>;
};

/* ───────────────────────────── GrainEffect ───────────────────────────── */

/**
 * Animated film / paper grain over everything below it.
 * `fps` controls how often the grain pattern changes (12 = filmic, 24 = busy).
 */
export const GrainEffect: React.FC<{
  opacity?: number;
  size?: number; // grain coarseness (0.5 fine – 1.5 coarse)
  grainFps?: number;
  blendMode?: React.CSSProperties["mixBlendMode"];
}> = ({ opacity = 0.12, size = 1, grainFps = 12, blendMode = "overlay" }) => {
  const id = useId().replace(/:/g, "");
  const { rawFrame, fps } = useScene();
  if (opacity <= 0) return null;
  const step = Math.max(1, Math.round(fps / grainFps));
  const seed = Math.floor(seeded(stepped(rawFrame, step)) * 1000);
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", mixBlendMode: blendMode, opacity }}
    >
      <filter id={`grain-${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency={0.9 / size} numOctaves={2} seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
    </svg>
  );
};

/** Darkened corners. Focuses the eye on the centre of a vertical frame. */
export const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.5, color = "0,0,0" }) =>
  strength <= 0 ? null : (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(ellipse 75% 60% at 50% 50%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`,
      }}
    />
  );

/* ───────────────────────────── LightEffect ───────────────────────────── */

/**
 * Lighting tricks for flat artwork:
 *  - "glow":  soft radial light behind an object (planets, icons, hero objects)
 *  - "sweep": a diagonal sheen that slides across (great on buttons & titles)
 *  - "rim":   coloured light from one edge of the frame
 */
export const LightEffect: React.FC<{
  type?: "glow" | "sweep" | "rim";
  color?: string;
  intensity?: number;
  x?: string; // glow centre, e.g. "50%"
  y?: string;
  size?: number; // glow radius in px
  start?: number; // sweep start (seconds)
  duration?: number; // sweep duration (seconds)
  pulse?: boolean;
}> = ({ type = "glow", color = "255,255,255", intensity = 0.6, x = "50%", y = "50%", size = 500, start = 0, duration = 0.9, pulse = false }) => {
  const { frame, t } = useScene();
  if (type === "glow") {
    const k = pulse ? 0.85 + Math.sin(frame / 10) * 0.15 : 1;
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle ${size * k}px at ${x} ${y}, rgba(${color},${intensity}) 0%, rgba(${color},0) 100%)`,
          mixBlendMode: "screen",
        }}
      />
    );
  }
  if (type === "rim") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(110deg, rgba(${color},${intensity}) 0%, rgba(${color},0) 35%)`,
          mixBlendMode: "screen",
        }}
      />
    );
  }
  // sweep
  const p = (frame - t(start)) / Math.max(1, t(duration));
  if (p < 0 || p > 1) return null;
  const pos = -40 + p * 180;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `linear-gradient(115deg, transparent ${pos - 12}%, rgba(${color},${intensity}) ${pos}%, transparent ${pos + 12}%)`,
        mixBlendMode: "overlay",
      }}
    />
  );
};

/* ───────────────────────────── MotionBlur ───────────────────────────── */

/**
 * Cheap directional motion blur. Pass the current velocity (px per frame) of the
 * thing you are moving; faster = more smear in that direction.
 * For true multi-sample blur, see @remotion/motion-blur (slower to render).
 */
export const MotionBlur: React.FC<{ vx?: number; vy?: number; strength?: number; children: React.ReactNode }> = ({
  vx = 0,
  vy = 0,
  strength = 0.5,
  children,
}) => {
  const id = useId().replace(/:/g, "");
  const bx = Math.min(40, Math.abs(vx) * strength);
  const by = Math.min(40, Math.abs(vy) * strength);
  if (bx < 0.3 && by < 0.3) return <>{children}</>;
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id={`mb-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={`${bx} ${by}`} />
        </filter>
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: `url(#mb-${id})` }}>{children}</div>
    </>
  );
};
