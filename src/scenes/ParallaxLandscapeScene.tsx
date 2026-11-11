/**
 * PARALLAX scene — flat cut-out layers at different depths slide past each
 * other as the camera tracks sideways, creating a "2.5D" diorama.
 */
import React from "react";
import { Img, staticFile } from "remotion";
import type { ParallaxLandscapeScene as Cfg } from "../config/types";
import { ParallaxLayer, ParallaxScene, TextAnimation } from "../engine/components";

export const ParallaxLandscapeScene: React.FC<{ scene: Cfg }> = ({ scene }) => {
  const sorted = [...scene.layers].sort((a, b) => a.depth - b.depth);
  return (
    <>
      <ParallaxScene travelX={scene.travel ?? 500} zoomFrom={1.05} zoomTo={1.15}>
        {sorted.map((layer, i) => (
          <ParallaxLayer key={i} depth={layer.depth}>
            <Img
              src={staticFile(layer.src)}
              style={{
                position: "absolute",
                left: "-25%",
                width: "150%",
                bottom: layer.y ?? 0,
                transform: `scale(${layer.scale ?? 1})`,
                transformOrigin: "50% 100%",
                filter: `drop-shadow(0 -6px 10px rgba(0,0,0,${0.15 + layer.depth * 0.2}))`,
              }}
            />
          </ParallaxLayer>
        ))}
      </ParallaxScene>
      {scene.headline ? (
        <div style={{ position: "absolute", top: 240, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <TextAnimation text={scene.headline} mode="letterStagger" delay={0.3} size={110} stroke={14} />
        </div>
      ) : null}
    </>
  );
};
