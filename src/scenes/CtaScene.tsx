/**
 * CALL-TO-ACTION scene — a chunky button pops in, a cursor glides over and
 * clicks it (button squashes, sound plays, light sweeps across).
 */
import React from "react";
import { Img, staticFile } from "remotion";
import type { CtaScene as Cfg } from "../config/types";
import { LightEffect, ObjectEntrance, SoundEffect, TextAnimation } from "../engine/components";
import { useScene } from "../engine/SceneContext";
import { keyframes, progress } from "../engine/timeline";

export const CtaScene: React.FC<{ scene: Cfg }> = ({ scene }) => {
  const { frame, t, theme } = useScene();
  const clickAt = 1.3;
  // cursor path: from bottom-right to the button
  const cx = keyframes(frame, [
    { at: t(0.5), value: 980 },
    { at: t(1.2), value: 640, easing: "snappy" },
  ]);
  const cy = keyframes(frame, [
    { at: t(0.5), value: 1650 },
    { at: t(1.2), value: 1020, easing: "snappy" },
  ]);
  const press = keyframes(frame, [
    { at: t(clickAt), value: 1 },
    { at: t(clickAt + 0.06), value: 0.9, easing: "easeOut" },
    { at: t(clickAt + 0.3), value: 1, easing: "punch" },
  ]);
  const cursorIn = progress(frame, t(0.5), t(0.2));

  return (
    <>
      {scene.icon ? (
        <div style={{ position: "absolute", top: 420, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <ObjectEntrance type="spin" delay={0} duration={0.6}>
            <Img src={staticFile(scene.icon)} style={{ width: 260 }} />
          </ObjectEntrance>
        </div>
      ) : null}

      <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <ObjectEntrance type="pop" delay={0.15} duration={0.5} sfx="pop">
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              background: theme.colors.accent,
              color: theme.colors.ink,
              fontFamily: theme.fonts.display,
              fontSize: 110,
              padding: "26px 70px",
              borderRadius: 30,
              border: `8px solid ${theme.colors.ink}`,
              boxShadow: `0 ${14 * press}px 0 ${theme.colors.ink}, 0 0 60px ${theme.colors.accent}`,
              transform: `scale(${press}) translateY(${(1 - press) * 60}px)`,
              textTransform: "uppercase",
            }}
          >
            {scene.buttonText}
            <LightEffect type="sweep" start={clickAt + 0.05} duration={0.6} intensity={0.9} />
          </div>
        </ObjectEntrance>
      </div>

      {scene.subtext ? (
        <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <TextAnimation text={scene.subtext} mode="wordStagger" delay={clickAt + 0.3} font="body" size={50} uppercase={false} />
        </div>
      ) : null}

      <Img
        src={staticFile("icons/cursor.svg")}
        style={{ position: "absolute", left: cx, top: cy, width: 110, opacity: cursorIn, transform: `scale(${frame >= t(clickAt) && frame < t(clickAt + 0.12) ? 0.85 : 1})`, filter: "drop-shadow(4px 6px 4px rgba(0,0,0,0.5))" }}
      />
      <SoundEffect sound="click" at={clickAt} />
      <SoundEffect sound="ding" at={clickAt + 0.08} volume={0.5} />
    </>
  );
};
