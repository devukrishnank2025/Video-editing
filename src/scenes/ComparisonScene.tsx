/**
 * COMPARISON scene — two cut-outs stacked vertically (perfect for 9:16),
 * each with a big outlined label, and a "VS" stamp slammed between them.
 */
import React from "react";
import type { ComparisonScene as Cfg, ComparisonSide } from "../config/types";
import { ImageAnimation, LightEffect, TextAnimation } from "../engine/components";
import { useScene } from "../engine/SceneContext";

const Side: React.FC<{ side: ComparisonSide; y: number; from: "left" | "right"; delay: number; labelColor: string }> = ({ side, y, from, delay, labelColor }) => {
  const { theme } = useScene();
  return (
    <>
      <ImageAnimation
        src={side.src}
        x={from === "left" ? 420 : 660}
        y={y}
        width={600}
        entrance={{ type: from === "left" ? "slideRight" : "slideLeft", delay, duration: 0.55, distance: 700 }}
        float
        seed={from === "left" ? 1 : 2}
        shadow={0.7}
      />
      <div style={{ position: "absolute", top: y + 120, left: from === "left" ? 520 : 110 }}>
        <TextAnimation text={side.label} mode="stamp" delay={delay + 0.45} size={112} color={side.color ?? labelColor} stroke={14} strokeColor={theme.colors.ink} align="left" sfx="thud" />
        {side.caption ? (
          <TextAnimation text={side.caption} mode="slideUp" delay={delay + 0.7} font="body" size={36} uppercase={false} align="left" maxWidth={480} />
        ) : null}
      </div>
    </>
  );
};

export const ComparisonScene: React.FC<{ scene: Cfg }> = ({ scene }) => {
  const { theme } = useScene();
  return (
    <>
      <LightEffect type="glow" color="80,170,255" x="35%" y="25%" size={520} intensity={0.25} />
      <LightEffect type="glow" color="255,170,60" x="65%" y="72%" size={520} intensity={0.25} />
      <Side side={scene.top} y={520} from="left" delay={0.1} labelColor={theme.colors.cool} />
      <Side side={scene.bottom} y={1360} from="right" delay={0.5} labelColor={theme.colors.warm} />
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <TextAnimation text={scene.vsText ?? "VS"} mode="stamp" delay={1.1} size={150} color={theme.colors.accent} stroke={16} glow sfx="pop" />
      </div>
    </>
  );
};
