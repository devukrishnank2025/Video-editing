/**
 * <PaperCutLayer> — makes any image (or children) look like a piece of paper
 * cut out with scissors and laid on the scene:
 *
 *   • a white (or coloured) paper border around the shape
 *   • slightly rough, torn-looking edges (SVG displacement)
 *   • a drop shadow that sells the "physical" depth
 *   • a tiny idle wobble, optionally on twos (stop-motion feel)
 *
 *   <PaperCutLayer src="images/fossil-1.svg" width={300} border={10} rotate={-4} />
 */
import React, { useId } from "react";
import { Img, staticFile } from "remotion";
import { wobble, stepped } from "../timeline/timing";
import { useScene } from "../SceneContext";
import { ShadowEffect } from "./Effects";

export type PaperCutLayerProps = {
  src?: string;
  width?: number;
  height?: number;
  /** Paper border thickness in px (0 = none). */
  border?: number;
  borderColor?: string;
  /** Edge roughness (0 = clean, 1 = torn). */
  roughness?: number;
  rotate?: number;
  /** Idle wobble strength in degrees. */
  wobbleAmount?: number;
  /** Seed so neighbouring cut-outs don't wobble in sync. */
  seed?: number;
  /** Shadow lift 0–1. */
  lift?: number;
  /** 1 = smooth motion, 2 = "on twos" stop-motion. */
  stepFrames?: number;
  /** Rounded "photo print" corners vs. organic cut-out. */
  shape?: "print" | "cutout";
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

export const PaperCutLayer: React.FC<PaperCutLayerProps> = ({
  src,
  width = 300,
  height,
  border = 10,
  borderColor,
  roughness = 0.4,
  rotate = 0,
  wobbleAmount = 0.8,
  seed = 0,
  lift = 0.35,
  stepFrames = 2,
  shape = "print",
  style,
  children,
}) => {
  const { theme, frame } = useScene();
  const id = useId().replace(/:/g, "");
  const f = stepped(frame, stepFrames);
  const rot = rotate + wobble(f, 1, wobbleAmount, seed);
  const bob = wobble(f, 0.7, 3, seed + 5);
  const paper = borderColor ?? theme.colors.paper;

  const content = src ? (
    <Img
      src={staticFile(src)}
      style={{ width: "100%", height: height ? "100%" : "auto", display: "block", objectFit: "cover" }}
    />
  ) : (
    children
  );

  return (
    <div style={{ width, transform: `translateY(${bob}px) rotate(${rot}deg)`, ...style }}>
      {roughness > 0 ? (
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <filter id={`rough-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} seed={seed + 1} />
            <feDisplacementMap in="SourceGraphic" scale={roughness * 8} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      ) : null}
      <ShadowEffect lift={lift}>
        <div
          style={{
            background: shape === "print" ? paper : "transparent",
            padding: shape === "print" ? border : 0,
            borderRadius: shape === "print" ? 4 : 0,
            filter:
              (roughness > 0 ? `url(#rough-${id}) ` : "") +
              (shape === "cutout" && border > 0
                ? // Outline that follows the image's transparent edges = sticker / cut-out look
                  `drop-shadow(${border / 2}px 0 0 ${paper}) drop-shadow(-${border / 2}px 0 0 ${paper}) drop-shadow(0 ${border / 2}px 0 ${paper}) drop-shadow(0 -${border / 2}px 0 ${paper})`
                : ""),
            height: height,
            overflow: "hidden",
          }}
        >
          {content}
        </div>
      </ShadowEffect>
    </div>
  );
};
