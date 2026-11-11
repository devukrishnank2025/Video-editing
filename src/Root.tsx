import React from "react";
import { Composition } from "remotion";
import { VideoComposition } from "./engine/VideoComposition";
import { totalDurationInFrames } from "./engine/timeline";
import { VIDEOS } from "./videos";

/** Registers one Remotion <Composition> per video config. */
export const RemotionRoot: React.FC = () => (
  <>
    {VIDEOS.map((video) => (
      <Composition
        key={video.id}
        id={video.id}
        component={VideoComposition}
        durationInFrames={totalDurationInFrames(video)}
        fps={video.fps}
        width={video.width}
        height={video.height}
        defaultProps={{ video }}
      />
    ))}
  </>
);
