/**
 * VideoComposition — the animation ENGINE entry point.
 *
 * Takes a VideoConfig and builds the whole video:
 *   music  →  scenes (each: background → camera(world) → captions → grain)
 *          →  transitions between scenes  →  global captions, vignette, grain
 *
 * You should not need to edit this file to make a new video.
 */
import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import type { SceneConfig, VideoConfig } from "../config/types";
import { renderSceneBody } from "../scenes/registry";
import { SceneProvider } from "./SceneContext";
import { CameraMove, CaptionAnimation, GrainEffect, MusicTrack, PaperBackground, SceneTransition, SoundEffect, Vignette } from "./components";
import { scheduleScenes } from "./timeline";

const SceneShell: React.FC<{ scene: SceneConfig; video: VideoConfig }> = ({ scene, video }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <PaperBackground config={scene.background} />
    <CameraMove {...(scene.camera ?? {})} sceneSeconds={scene.durationInSeconds}>
      {renderSceneBody(scene)}
    </CameraMove>
    {(scene.sfx ?? []).map((cue, i) => (
      <SoundEffect key={i} sound={cue.sound} at={cue.at} volume={cue.volume} playbackRate={cue.playbackRate} />
    ))}
    {scene.captions?.length ? <CaptionAnimation cues={scene.captions} captionStyle={video.captionStyle} /> : null}
    {scene.grain !== undefined ? <GrainEffect opacity={scene.grain} /> : null}
  </AbsoluteFill>
);

export const VideoComposition: React.FC<{ video: VideoConfig }> = ({ video }) => {
  const { durationInFrames } = useVideoConfig();
  const scheduled = scheduleScenes(video);
  const themeSpeed = video.theme.speed ?? 1;

  return (
    <SceneProvider theme={video.theme} speed={1}>
      <AbsoluteFill style={{ background: video.theme.colors.background, fontFamily: video.theme.fonts.body }}>
        {video.music ? <MusicTrack {...video.music} totalFrames={durationInFrames} /> : null}

        {scheduled.map((s) => (
          <Sequence key={s.index} from={s.from} durationInFrames={s.durationInFrames} name={`${s.index + 1}. ${s.scene.name ?? s.scene.type}`}>
            <SceneTransition
              enter={s.enter}
              exit={s.exit}
              enterFrames={s.enterFrames}
              exitFrames={s.exitFrames}
              durationInFrames={s.durationInFrames}
              animateIn={s.index > 0}
            >
              <SceneProvider theme={video.theme} speed={themeSpeed * (s.scene.speed ?? 1)} durationInFrames={s.durationInFrames}>
                <SceneShell scene={s.scene} video={video} />
              </SceneProvider>
            </SceneTransition>
          </Sequence>
        ))}

        {video.captions?.length ? <CaptionAnimation cues={video.captions} captionStyle={video.captionStyle} /> : null}
        <Vignette strength={video.vignette ?? 0.45} />
        <GrainEffect opacity={video.grain ?? 0.1} />
      </AbsoluteFill>
    </SceneProvider>
  );
};
