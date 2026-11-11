/**
 * SceneContext gives every component access to the theme, the scene's
 * animation speed and the scene's length, without passing props everywhere.
 *
 *   const { theme, frame, t, fps } = useScene();
 *   // frame → current frame inside this scene, already multiplied by `speed`
 *   // t(1.2) → "1.2 seconds" expressed in frames (compare it with `frame`)
 */
import React, { createContext, useContext } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../config/types";
import { themes } from "../config/theme";

type SceneCtx = { theme: Theme; speed: number; durationInFrames?: number };

const Ctx = createContext<SceneCtx>({ theme: themes.nightScience, speed: 1 });

export const SceneProvider: React.FC<{
  theme: Theme;
  speed?: number;
  /** Length of the current scene (Sequence) in frames. */
  durationInFrames?: number;
  children: React.ReactNode;
}> = ({ theme, speed = 1, durationInFrames, children }) => (
  <Ctx.Provider value={{ theme, speed, durationInFrames }}>{children}</Ctx.Provider>
);

export const useScene = () => {
  const ctx = useContext(Ctx);
  const raw = useCurrentFrame();
  const video = useVideoConfig();
  return {
    theme: ctx.theme,
    speed: ctx.speed,
    fps: video.fps,
    width: video.width,
    height: video.height,
    /** Real (un-sped) length of the current scene in frames. */
    durationInFrames: ctx.durationInFrames ?? video.durationInFrames,
    /** Speed-adjusted frame. Animations use this so `speed` scales everything. */
    frame: raw * ctx.speed,
    rawFrame: raw,
    /** Seconds → frames (compare with `frame`). */
    t: (seconds: number) => seconds * video.fps,
  };
};
