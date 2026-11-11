/**
 * COLLAGE TIMELINE scene — a glowing arrow draws itself between two labelled
 * end-points while photo-print cut-outs are "dealt" onto it like cards.
 *
 * Vertical layout (1080×1920):
 *   top label → top icon → arrow with cards on alternating sides →
 *   bottom icon → bottom label → span label stamp
 */
import React from "react";
import type { CollageTimelineScene as Cfg } from "../config/types";
import { ImageAnimation, ObjectEntrance, PaperCutLayer, SoundEffect, TextAnimation } from "../engine/components";
import { useScene } from "../engine/SceneContext";
import { progress, seeded } from "../engine/timeline";

const Centered: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>{children}</div>
);

export const CollageTimelineScene: React.FC<{ scene: Cfg }> = ({ scene }) => {
  const { frame, t, theme } = useScene();
  const x = 540;
  const y1 = 380;
  const y2 = 1320;
  const draw = progress(frame, t(0.5), t(1.6), "smooth");
  const headY = y1 + (y2 - y1) * draw;

  return (
    <>
      <Centered top={90}>
        <TextAnimation text={scene.topLabel} mode="slideUp" delay={0.15} size={76} color={theme.colors.cool} glow stroke={8} />
      </Centered>
      {scene.topIcon ? <ImageAnimation src={scene.topIcon} x={x} y={260} width={170} entrance={{ type: "pop", delay: 0.05 }} float seed={1} /> : null}

      {/* the arrow draws itself downwards */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={x} y1={y1} x2={x} y2={headY} stroke={theme.colors.accent} strokeWidth={16} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${theme.colors.accent})` }} />
        {draw > 0.02 ? <polygon points={`${x - 36},${headY - 8} ${x + 36},${headY - 8} ${x},${headY + 40}`} fill={theme.colors.accent} /> : null}
      </svg>
      <SoundEffect sound="riser" at={0.5} volume={0.35} />

      {/* cut-out cards dealt onto alternating sides of the arrow */}
      {scene.items.map((item, i) => {
        const n = scene.items.length;
        const yy = y1 + 110 + ((y2 - y1 - 260) * i) / Math.max(1, n - 1);
        const left = i % 2 === 0;
        const delay = 0.6 + i * (1.4 / n);
        const rot = (seeded(i + 4) - 0.5) * 16;
        return (
          <div key={i} style={{ position: "absolute", left: left ? x - 300 : x + 60, top: yy - 100 }}>
            <ObjectEntrance type={left ? "slideRight" : "slideLeft"} delay={delay} duration={0.4} distance={260} sfx="paper" sfxVolume={0.5}>
              <PaperCutLayer src={item.src} width={230} rotate={rot} seed={i} lift={0.5} />
              {item.caption ? (
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, color: theme.colors.text, fontSize: 32, textAlign: "center", marginTop: 10, textShadow: "0 2px 6px #000" }}>
                  {item.caption}
                </div>
              ) : null}
            </ObjectEntrance>
          </div>
        );
      })}

      {scene.bottomIcon ? <ImageAnimation src={scene.bottomIcon} x={x} y={1460} width={190} entrance={{ type: "pop", delay: 2.0 }} float seed={9} /> : null}
      <Centered top={1570}>
        <TextAnimation text={scene.bottomLabel} mode="pop" delay={2.2} size={76} color={theme.colors.warm} glow stroke={8} />
      </Centered>
      {scene.spanLabel ? (
        <Centered top={1690}>
          <TextAnimation text={scene.spanLabel} mode="stamp" delay={2.6} size={58} color={theme.colors.accent} stroke={8} sfx="thud" />
        </Centered>
      ) : null}
    </>
  );
};
