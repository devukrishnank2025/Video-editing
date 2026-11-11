/**
 * <SoundEffect> — plays a sound at an exact time (seconds, scene-relative).
 *
 *   <SoundEffect sound="whoosh" at={0.2} volume={0.8} />
 *
 * `sound` is a name from src/config/sfx.ts or a path inside /public.
 * Sound is frame-accurate: if you move an animation, move its SFX with the same number.
 */
import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { resolveSound } from "../../config/sfx";
import { useScene } from "../SceneContext";

export type SoundEffectProps = {
  sound: string;
  at?: number;
  volume?: number;
  playbackRate?: number;
};

export const SoundEffect: React.FC<SoundEffectProps> = ({ sound, at = 0, volume = 0.7, playbackRate = 1 }) => {
  const { fps, speed } = useScene();
  // Divide by speed so the sound stays in sync when a scene is sped up / slowed down.
  return (
    <Sequence from={Math.max(0, Math.round((at * fps) / speed))} layout="none" name={`sfx:${sound}`}>
      <Audio src={staticFile(resolveSound(sound))} volume={volume} playbackRate={playbackRate} />
    </Sequence>
  );
};

/** Background music with fade in / out. Used by the video composition. */
export const MusicTrack: React.FC<{
  src: string;
  volume?: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
  loop?: boolean;
  totalFrames: number;
}> = ({ src, volume = 0.35, fadeInSeconds = 1, fadeOutSeconds = 1.5, loop = true, totalFrames }) => {
  const { fps } = useVideoConfig();
  const fin = Math.max(1, fadeInSeconds * fps);
  const fout = Math.max(1, fadeOutSeconds * fps);
  return (
    <Audio
      src={staticFile(src)}
      loop={loop}
      volume={(f) => {
        const a = Math.min(1, f / fin);
        const b = Math.min(1, (totalFrames - f) / fout);
        return Math.max(0, Math.min(a, b)) * volume;
      }}
    />
  );
};
