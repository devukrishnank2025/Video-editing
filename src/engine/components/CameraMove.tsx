/**
 * CAMERA — <CameraMove>, <ZoomAnimation>, <PanAnimation>
 *
 * There is no real camera in 2D: we move the whole "world" the opposite way.
 * Wrap a scene's content in <CameraMove> and give it a preset or keyframes.
 *
 *   <CameraMove preset="slowPushIn" intensity={1.2}> …world… </CameraMove>
 *
 *   <CameraMove keyframes={[
 *     { at: 0,   zoom: 1 },
 *     { at: 0.4, zoom: 1.35, easing: "punch" },   // punch-in on a key word
 *     { at: 3,   zoom: 1.45, x: 80, easing: "smooth" },
 *   ]} />
 */
import React from "react";
import type { CameraConfig, CameraKeyframe, CameraPreset } from "../../config/types";
import { keyframes as kf, seeded } from "../timeline/timing";
import { useScene } from "../SceneContext";

/** Turns a preset into keyframes for a scene that lasts `dur` seconds. */
export const presetKeyframes = (preset: CameraPreset, dur: number, k = 1): CameraKeyframe[] => {
  switch (preset) {
    case "slowPushIn":
      return [
        { at: 0, zoom: 1 },
        { at: dur, zoom: 1 + 0.12 * k, easing: "linear" },
      ];
    case "slowPullOut":
      return [
        { at: 0, zoom: 1 + 0.15 * k },
        { at: dur, zoom: 1, easing: "smooth" },
      ];
    case "punchIn":
      return [
        { at: 0, zoom: 1 },
        { at: 0.25, zoom: 1 + 0.22 * k, easing: "punch" },
        { at: dur, zoom: 1 + 0.28 * k, easing: "linear" },
      ];
    case "panLeft":
      return [
        { at: 0, x: 140 * k, zoom: 1.15 },
        { at: dur, x: -140 * k, zoom: 1.15, easing: "smooth" },
      ];
    case "panRight":
      return [
        { at: 0, x: -140 * k, zoom: 1.15 },
        { at: dur, x: 140 * k, zoom: 1.15, easing: "smooth" },
      ];
    case "panUp":
      return [
        { at: 0, y: 220 * k, zoom: 1.15 },
        { at: dur, y: -220 * k, zoom: 1.15, easing: "smooth" },
      ];
    case "panDown":
      return [
        { at: 0, y: -220 * k, zoom: 1.15 },
        { at: dur, y: 220 * k, zoom: 1.15, easing: "smooth" },
      ];
    case "drift":
      return [
        { at: 0, zoom: 1.04, x: -20 * k, rotate: -0.4 * k },
        { at: dur, zoom: 1.1, x: 20 * k, rotate: 0.4 * k, easing: "smooth" },
      ];
    case "handheld":
    case "static":
    default:
      return [{ at: 0, zoom: 1 }];
  }
};

export type CameraState = { zoom: number; x: number; y: number; rotate: number };

/** Evaluate the camera at the current frame. Handy if you need the values yourself. */
export const useCamera = (camera: CameraConfig | undefined, sceneSeconds: number): CameraState => {
  const { frame, t, fps } = useScene();
  const k = camera?.intensity ?? 1;
  const frames =
    camera?.keyframes ?? presetKeyframes(camera?.preset ?? "static", sceneSeconds, k);

  const track = (key: keyof Omit<CameraKeyframe, "at" | "easing">, fallback: number) => {
    const list = frames
      .filter((f) => f[key] !== undefined)
      .map((f) => ({ at: t(f.at), value: f[key] as number, easing: f.easing }));
    return list.length ? kf(frame, list) : fallback;
  };

  const shakeAmt = camera?.shake ?? (camera?.preset === "handheld" ? 1 : 0);
  // Low-frequency noise (changes every 2 frames) feels like a hand-held camera.
  const n = Math.floor(frame / 2);
  const shakeX = shakeAmt ? (seeded(n) - 0.5) * 6 * shakeAmt + Math.sin(frame / fps * 2) * 4 * shakeAmt : 0;
  const shakeY = shakeAmt ? (seeded(n + 999) - 0.5) * 6 * shakeAmt + Math.cos(frame / fps * 1.6) * 4 * shakeAmt : 0;

  return {
    zoom: track("zoom", 1),
    x: track("x", 0) + shakeX,
    y: track("y", 0) + shakeY,
    rotate: track("rotate", 0),
  };
};

export const CameraMove: React.FC<
  CameraConfig & { sceneSeconds?: number; children: React.ReactNode; style?: React.CSSProperties }
> = ({ children, sceneSeconds, style, ...camera }) => {
  const { durationInFrames, fps, speed } = useScene();
  const dur = sceneSeconds ?? (durationInFrames * speed) / fps;
  const cam = useCamera(camera, dur);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${cam.zoom}) translate(${-cam.x}px, ${-cam.y}px) rotate(${cam.rotate}deg)`,
        transformOrigin: "50% 50%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Zoom only. `from`/`to` are zoom levels; times in seconds. */
export const ZoomAnimation: React.FC<{
  from?: number;
  to?: number;
  start?: number;
  duration?: number;
  easing?: CameraKeyframe["easing"];
  origin?: string; // e.g. "50% 30%" to zoom towards the upper part
  children: React.ReactNode;
}> = ({ from = 1, to = 1.3, start = 0, duration = 1, easing = "snappy", origin = "50% 50%", children }) => {
  const { frame, t } = useScene();
  const zoom = kf(frame, [
    { at: t(start), value: from },
    { at: t(start + duration), value: to, easing },
  ]);
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: origin }}>
      {children}
    </div>
  );
};

/** Pan / track only (px). */
export const PanAnimation: React.FC<{
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  start?: number;
  duration?: number;
  easing?: CameraKeyframe["easing"];
  children: React.ReactNode;
}> = ({ fromX = 0, toX = 0, fromY = 0, toY = 0, start = 0, duration = 2, easing = "smooth", children }) => {
  const { frame, t } = useScene();
  const x = kf(frame, [
    { at: t(start), value: fromX },
    { at: t(start + duration), value: toX, easing },
  ]);
  const y = kf(frame, [
    { at: t(start), value: fromY },
    { at: t(start + duration), value: toY, easing },
  ]);
  return <div style={{ position: "absolute", inset: 0, transform: `translate(${x}px, ${y}px)` }}>{children}</div>;
};
