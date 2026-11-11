/**
 * PRESENTER scene — a cut-out puppet host (talking + gesturing) with a
 * sliding lower-third and cut-out "thought" images popping in around them.
 */
import React from "react";
import type { PresenterScene as Cfg } from "../config/types";
import { ImageAnimation, ObjectEntrance, PaperCutCharacter } from "../engine/components";
import { useScene } from "../engine/SceneContext";

export const PresenterScene: React.FC<{ scene: Cfg }> = ({ scene }) => {
  const { theme } = useScene();
  return (
    <>
      <ObjectEntrance type="slideUp" delay={0} duration={0.5} distance={500}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 1920 }}>
          <PaperCutCharacter {...scene.character} y={(scene.character.y ?? 0) - 120} scale={scene.character.scale ?? 1.5} />
        </div>
      </ObjectEntrance>

      {(scene.floaters ?? []).map((f, i) => (
        <ImageAnimation
          key={i}
          src={f.src}
          x={f.x}
          y={f.y}
          width={f.size ?? 240}
          rotate={f.rotate ?? 0}
          entrance={{ type: "pop", delay: f.at }}
          paper="cutout"
          float
          seed={i + 3}
        />
      ))}

      {scene.lowerThird ? (
        <div style={{ position: "absolute", left: 60, bottom: 220 }}>
          <ObjectEntrance type="wipe" delay={0.5} duration={0.45}>
            <div style={{ background: theme.colors.accent, color: theme.colors.ink, padding: "14px 30px", fontFamily: theme.fonts.display, fontSize: 64, textTransform: "uppercase", transform: "rotate(-2deg)", boxShadow: "8px 8px 0 rgba(0,0,0,0.35)" }}>
              {scene.lowerThird.name}
            </div>
          </ObjectEntrance>
          {scene.lowerThird.role ? (
            <ObjectEntrance type="wipe" delay={0.75} duration={0.4}>
              <div style={{ display: "inline-block", marginTop: 10, background: theme.colors.paper, color: theme.colors.ink, padding: "8px 22px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 34, transform: "rotate(-2deg)" }}>
                {scene.lowerThird.role}
              </div>
            </ObjectEntrance>
          ) : null}
        </div>
      ) : null}
    </>
  );
};
