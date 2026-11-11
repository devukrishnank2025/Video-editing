/**
 * B-ROLL scene — full-frame footage or still with a Ken Burns move, optional
 * colour tint, "SOURCE:" credit and a text overlay.
 */
import React from "react";
import type { BrollScene as Cfg } from "../config/types";
import { BrollAnimation, TextAnimation } from "../engine/components";

export const BrollScene: React.FC<{ scene: Cfg }> = ({ scene }) => {
  const kb = scene.kenBurns ?? {};
  return (
    <>
      <BrollAnimation
        src={scene.src}
        fromZoom={kb.fromZoom ?? 1.2}
        toZoom={kb.toZoom ?? 1.02}
        fromX={kb.fromX}
        toX={kb.toX}
        fromY={kb.fromY}
        toY={kb.toY}
        credit={scene.credit}
        tint={scene.tint}
      />
      {scene.overlayText ? (
        <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <TextAnimation text={scene.overlayText} mode="wordStagger" delay={0.3} size={104} stroke={14} glow />
        </div>
      ) : null}
    </>
  );
};
