/**
 * Scene scheduling: turns a list of scenes (with durations in seconds and
 * optional overlapping transitions) into absolute frame positions.
 *
 * Scene B's transition overlaps the END of scene A, so total length is
 *   sum(scene durations) − sum(transition overlaps)
 */
import type { SceneConfig, TransitionConfig, VideoConfig } from "../../config/types";
import { sec } from "./timing";

export type ScheduledScene = {
  scene: SceneConfig;
  index: number;
  from: number; // absolute start frame
  durationInFrames: number;
  enter: TransitionConfig; // transition used when this scene comes IN
  exit: TransitionConfig | null; // transition used by the NEXT scene (so we can animate out)
  enterFrames: number;
  exitFrames: number;
};

const CUT: TransitionConfig = { type: "cut", durationInSeconds: 0 };

export const resolveTransition = (
  video: VideoConfig,
  scene: SceneConfig,
  index: number,
): TransitionConfig => {
  if (index === 0) return scene.transitionIn ?? CUT;
  return scene.transitionIn ?? video.defaultTransition ?? CUT;
};

export const transitionFrames = (t: TransitionConfig | null, fps: number) =>
  !t || t.type === "cut" ? 0 : sec(t.durationInSeconds ?? 0.4, fps);

export const scheduleScenes = (video: VideoConfig): ScheduledScene[] => {
  const { fps } = video;
  const result: ScheduledScene[] = [];
  let cursor = 0;

  video.scenes.forEach((scene, index) => {
    const enter = resolveTransition(video, scene, index);
    const enterFrames = index === 0 ? 0 : transitionFrames(enter, fps);
    const durationInFrames = Math.max(1, sec(scene.durationInSeconds, fps));
    const from = Math.max(0, cursor - enterFrames);

    const next = video.scenes[index + 1];
    const exit = next ? resolveTransition(video, next, index + 1) : null;
    const exitFrames = transitionFrames(exit, fps);

    result.push({ scene, index, from, durationInFrames, enter, exit, enterFrames, exitFrames });
    cursor = from + durationInFrames;
  });

  return result;
};

export const totalDurationInFrames = (video: VideoConfig) => {
  const scheduled = scheduleScenes(video);
  const last = scheduled[scheduled.length - 1];
  return last ? last.from + last.durationInFrames : 1;
};
