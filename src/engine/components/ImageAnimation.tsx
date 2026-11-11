/**
 * MEDIA — <ImageAnimation> and <BrollAnimation>
 *
 * ImageAnimation: a positioned image/cut-out that enters, idles, optionally exits.
 *   <ImageAnimation src="icons/key.svg" x={540} y={900} width={220}
 *                   entrance={{ type: "pop", delay: 0.4 }} float />
 *
 * BrollAnimation: full-frame footage or a still with a Ken Burns move,
 * colour tint and a "SOURCE:" credit line.
 *   <BrollAnimation src="images/broll-canyon.svg" fromZoom={1.25} toZoom={1} credit="Placeholder art" />
 */
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile } from "remotion";
import type { ExitConfig, MotionConfig } from "../../config/types";
import { keyframes, wobble } from "../timeline/timing";
import { useScene } from "../SceneContext";
import { ObjectEntrance } from "./ObjectEntrance";
import { ObjectExit } from "./ObjectExit";
import { PaperCutLayer } from "./PaperCutLayer";
import { ShadowEffect } from "./Effects";

const isVideo = (src: string) => /\.(mp4|webm|mov|m4v)$/i.test(src);

export const ImageAnimation: React.FC<{
  src: string;
  x: number; // centre position (px)
  y: number;
  width?: number;
  rotate?: number;
  entrance?: MotionConfig;
  exit?: ExitConfig;
  /** Gentle floating idle motion. */
  float?: boolean;
  /** Render as a paper cut-out (border + rough edge + shadow). */
  paper?: boolean | "print" | "cutout";
  shadow?: number; // lift 0–1 when not paper
  seed?: number;
  style?: React.CSSProperties;
}> = ({ src, x, y, width = 300, rotate = 0, entrance, exit, float = false, paper = false, shadow = 0.3, seed = 0, style }) => {
  const { frame } = useScene();
  const fy = float ? wobble(frame, 0.6, 12, seed) : 0;
  const fr = float ? wobble(frame, 0.4, 1.5, seed + 3) : 0;
  const body = paper ? (
    <PaperCutLayer src={src} width={width} rotate={rotate} seed={seed} shape={paper === "cutout" ? "cutout" : "print"} />
  ) : (
    <ShadowEffect lift={shadow}>
      <Img src={staticFile(src)} style={{ width, display: "block", transform: `rotate(${rotate}deg)` }} />
    </ShadowEffect>
  );
  let node = (
    <ObjectEntrance
      type={entrance?.type ?? "pop"}
      delay={entrance?.delay ?? 0}
      duration={entrance?.duration ?? 0.5}
      easing={entrance?.easing}
      distance={entrance?.distance}
    >
      {body}
    </ObjectEntrance>
  );
  if (exit) node = <ObjectExit {...exit}>{node}</ObjectExit>;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translateY(${fy}px) rotate(${fr}deg)`,
        ...style,
      }}
    >
      {node}
    </div>
  );
};

export const BrollAnimation: React.FC<{
  src: string;
  fromZoom?: number;
  toZoom?: number;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  credit?: string;
  tint?: string;
  muted?: boolean;
}> = ({ src, fromZoom = 1.15, toZoom = 1, fromX = 0, toX = 0, fromY = 0, toY = 0, credit, tint, muted = true }) => {
  const { frame, durationInFrames, speed, theme } = useScene();
  const end = durationInFrames * speed;
  const zoom = keyframes(frame, [
    { at: 0, value: fromZoom },
    { at: end, value: toZoom, easing: "smooth" },
  ]);
  const x = keyframes(frame, [
    { at: 0, value: fromX },
    { at: end, value: toX, easing: "smooth" },
  ]);
  const y = keyframes(frame, [
    { at: 0, value: fromY },
    { at: end, value: toY, easing: "smooth" },
  ]);
  const media: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${zoom}) translate(${x}px, ${y}px)`,
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {isVideo(src) ? <OffthreadVideo src={staticFile(src)} muted={muted} style={media} /> : <Img src={staticFile(src)} style={media} />}
      {tint ? <AbsoluteFill style={{ background: tint, mixBlendMode: "soft-light" }} /> : null}
      {credit ? (
        <div
          style={{
            position: "absolute",
            left: 48,
            top: 70,
            fontFamily: theme.fonts.body,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.75)",
            textTransform: "uppercase",
            textShadow: "0 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          Source: {credit}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
