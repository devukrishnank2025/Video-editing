/**
 * <ParallaxScene> + <ParallaxLayer>
 *
 * Fake 3D depth from flat layers: as the "camera" travels, far layers (small
 * depth) move a little and near layers (depth ≈ 1) move a lot. Foreground
 * layers (depth > 1) whoosh past even faster.
 *
 *   <ParallaxScene travelX={600} zoomTo={1.1}>
 *     <ParallaxLayer depth={0.1}><Img src={sky} /></ParallaxLayer>
 *     <ParallaxLayer depth={0.5}><Img src={hills} /></ParallaxLayer>
 *     <ParallaxLayer depth={1.3}><Img src={grass} /></ParallaxLayer>
 *   </ParallaxScene>
 */
import React, { createContext, useContext } from "react";
import type { EasingName } from "../timeline/easing";
import { progress } from "../timeline/timing";
import { useScene } from "../SceneContext";

type ParallaxState = { x: number; y: number; zoom: number };
const ParallaxCtx = createContext<ParallaxState>({ x: 0, y: 0, zoom: 1 });

export const ParallaxScene: React.FC<{
  travelX?: number; // total camera travel in px
  travelY?: number;
  zoomFrom?: number;
  zoomTo?: number;
  start?: number; // seconds
  duration?: number; // seconds (default: whole scene)
  easing?: EasingName;
  children: React.ReactNode;
}> = ({ travelX = 400, travelY = 0, zoomFrom = 1, zoomTo = 1.08, start = 0, duration, easing = "smooth", children }) => {
  const { frame, t, durationInFrames, speed } = useScene();
  const dur = duration !== undefined ? t(duration) : durationInFrames * speed;
  const p = progress(frame, t(start), dur, easing);
  const state = {
    x: -travelX / 2 + travelX * p,
    y: -travelY / 2 + travelY * p,
    zoom: zoomFrom + (zoomTo - zoomFrom) * p,
  };
  return (
    <ParallaxCtx.Provider value={state}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>{children}</div>
    </ParallaxCtx.Provider>
  );
};

export const ParallaxLayer: React.FC<{
  depth: number; // 0 = infinitely far (static), 1 = moves with camera, >1 = foreground
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ depth, style, children }) => {
  const cam = useContext(ParallaxCtx);
  const scale = 1 + (cam.zoom - 1) * depth;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${-cam.x * depth}px, ${-cam.y * depth}px) scale(${scale})`,
        transformOrigin: "50% 50%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const useParallax = () => useContext(ParallaxCtx);
