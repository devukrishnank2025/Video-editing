/**
 * <PaperBackground> — the bottom-most layer of every scene.
 *
 *   <PaperBackground config={{ type: "starfield", density: 1.2 }} />
 *   <PaperBackground config={{ type: "paper", color: "#efe3c8" }} />
 *   <PaperBackground config={{ type: "image", src: "backgrounds/sky.svg", dim: 0.3 }} />
 *   <PaperBackground config={{ type: "grid", isometric: true }} />
 */
import React, { useId } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import type { BackgroundConfig } from "../../config/types";
import { seeded } from "../timeline/timing";
import { useScene } from "../SceneContext";

/** Fibrous paper texture made with SVG noise — no image needed. */
export const PaperTexture: React.FC<{ opacity?: number; tint?: string }> = ({ opacity = 0.35, tint }) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, mixBlendMode: "multiply", pointerEvents: "none" }}>
      <filter id={`paper-${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.04 0.6" numOctaves={3} seed={7} />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.6" />
        </feComponentTransfer>
      </filter>
      <filter id={`speck-${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={1} seed={3} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#paper-${id})`} />
      <rect width="100%" height="100%" filter={`url(#speck-${id})`} opacity={0.4} />
      {tint ? <rect width="100%" height="100%" fill={tint} opacity={0.15} /> : null}
    </svg>
  );
};

const Starfield: React.FC<{ color: string; density: number; twinkle: boolean }> = ({ color, density, twinkle }) => {
  const { width, height, frame } = useScene();
  const count = Math.round(180 * density);
  const stars = Array.from({ length: count }, (_, i) => {
    const x = seeded(i * 3.1) * width;
    const y = seeded(i * 7.7 + 1) * height;
    const r = 0.6 + seeded(i * 1.3 + 2) ** 3 * 2.6;
    const base = 0.35 + seeded(i * 5.5) * 0.65;
    const tw = twinkle ? 0.65 + Math.sin(frame * 0.12 + i) * 0.35 : 1;
    return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={base * tw} />;
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${color} 0%, #000 80%)` }}>
      <svg width={width} height={height}>{stars}</svg>
    </AbsoluteFill>
  );
};

const Grid: React.FC<{ color: string; lineColor: string; isometric: boolean }> = ({ color, lineColor, isometric }) => {
  const size = 140;
  const lines = isometric
    ? `repeating-linear-gradient(30deg, ${lineColor} 0 2px, transparent 2px ${size}px), repeating-linear-gradient(150deg, ${lineColor} 0 2px, transparent 2px ${size}px)`
    : `repeating-linear-gradient(0deg, ${lineColor} 0 2px, transparent 2px ${size}px), repeating-linear-gradient(90deg, ${lineColor} 0 2px, transparent 2px ${size}px)`;
  return (
    <AbsoluteFill style={{ background: color }}>
      <AbsoluteFill style={{ backgroundImage: lines, opacity: 0.6 }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, transparent 30%, ${color} 85%)` }} />
    </AbsoluteFill>
  );
};

export const PaperBackground: React.FC<{ config?: BackgroundConfig }> = ({ config }) => {
  const { theme } = useScene();
  const c = config ?? { type: "paper" };
  switch (c.type) {
    case "gradient":
      return <AbsoluteFill style={{ background: `linear-gradient(${c.angle ?? 180}deg, ${c.from}, ${c.to})` }} />;
    case "image":
      return (
        <AbsoluteFill style={{ background: theme.colors.background }}>
          <Img
            src={staticFile(c.src)}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: c.blur ? `blur(${c.blur}px)` : undefined }}
          />
          {c.dim ? <AbsoluteFill style={{ background: `rgba(0,0,0,${c.dim})` }} /> : null}
        </AbsoluteFill>
      );
    case "starfield":
      return <Starfield color={c.color ?? "#0d1a33"} density={c.density ?? 1} twinkle={c.twinkle ?? true} />;
    case "grid":
      return (
        <Grid
          color={c.color ?? theme.colors.background}
          lineColor={c.lineColor ?? "rgba(255,255,255,0.12)"}
          isometric={c.isometric ?? true}
        />
      );
    case "paper":
    default:
      return (
        <AbsoluteFill style={{ background: (c as { color?: string }).color ?? theme.colors.background }}>
          <PaperTexture opacity={(c as { textureOpacity?: number }).textureOpacity ?? 0.35} />
        </AbsoluteFill>
      );
  }
};
