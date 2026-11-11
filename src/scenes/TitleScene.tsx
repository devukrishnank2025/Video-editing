/**
 * TITLE / HOOK scene — the first 2–3 seconds that stop the scroll.
 * Kicker text → headline words pop in → up to two floating cut-out "orbs"
 * with glow → optional icon stamps on top.
 */
import React from "react";
import type { TitleScene as TitleSceneConfig } from "../config/types";
import { ImageAnimation, LightEffect, TextAnimation } from "../engine/components";
import { useScene } from "../engine/SceneContext";

export const TitleScene: React.FC<{ scene: TitleSceneConfig }> = ({ scene }) => {
  const { theme } = useScene();
  const orbs = scene.orbs ?? [];
  const orbPositions = orbs.length === 2 ? [{ x: 540, y: 560 }, { x: 540, y: 1420 }] : [{ x: 540, y: 1080 }];
  return (
    <>
      {orbs.map((orb, i) => (
        <React.Fragment key={i}>
          <LightEffect type="glow" color={i === 0 ? "80,160,255" : "255,170,60"} x={`${(orbPositions[i].x / 1080) * 100}%`} y={`${(orbPositions[i].y / 1920) * 100}%`} size={420} intensity={0.35} pulse />
          <ImageAnimation
            src={orb.src}
            x={orbPositions[i].x}
            y={orbPositions[i].y}
            width={orbs.length === 2 ? 470 : 620}
            entrance={{ type: i === 0 ? "slideDown" : "slideUp", delay: 0.1 + i * 0.15, duration: 0.7, distance: 500 }}
            float
            seed={i * 7}
            shadow={0.6}
          />
          {orb.label ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: orbPositions[i].y + 250, display: "flex", justifyContent: "center" }}>
              <TextAnimation text={orb.label} mode="pop" delay={0.8 + i * 0.2} size={64} stroke={10} />
            </div>
          ) : null}
        </React.Fragment>
      ))}

      {scene.icon ? (
        <ImageAnimation
          src={scene.icon}
          x={540}
          y={orbPositions[0].y}
          width={170}
          entrance={{ type: "stamp", delay: 1.1, duration: 0.4 }}
          shadow={0.5}
        />
      ) : null}

      {scene.kicker ? (
        <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <TextAnimation text={scene.kicker} mode="slideUp" font="body" size={38} color={theme.colors.accent} style={{ letterSpacing: "0.2em" }} />
        </div>
      ) : null}

      <div style={{ position: "absolute", top: orbs.length === 2 ? 830 : 330, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <TextAnimation text={scene.headline} mode="wordStagger" delay={0.35} size={128} stroke={14} glow sfx="pop" />
      </div>

      {scene.subline ? (
        <div style={{ position: "absolute", bottom: 260, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <TextAnimation text={scene.subline} mode="typewriter" delay={1.2} font="body" size={44} uppercase={false} />
        </div>
      ) : null}
    </>
  );
};
