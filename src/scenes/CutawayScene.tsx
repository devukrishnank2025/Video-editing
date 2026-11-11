/**
 * CUTAWAY DIAGRAM scene — an isometric block sliced open to show layers.
 *
 * Technique: each layer is two flat parallelograms (left + right face) drawn
 * in SVG. Layers drop in from the bottom up and "land" with a thud; labels are
 * skewed to sit ON the faces (fake perspective); an animated dashed arrow
 * shows flow; small cut-out props sit on top.
 */
import React from "react";
import { Img, staticFile } from "remotion";
import type { CutawayScene as CutawaySceneConfig } from "../config/types";
import { ObjectEntrance, SoundEffect, TextAnimation } from "../engine/components";
import { useScene } from "../engine/SceneContext";
import { progress } from "../engine/timeline";

const COS30 = 0.866;
const SIN30 = 0.5;

/** Darken / lighten a hex colour. amt -1..1 */
const shade = (hex: string, amt: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const ch = (s: number) => {
    const v = (n >> s) & 255;
    return Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt);
  };
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};

export const CutawayScene: React.FC<{ scene: CutawaySceneConfig }> = ({ scene }) => {
  const { frame, t, theme } = useScene();
  const cx = 540;
  const half = 380; // half-diagonal of the top face
  const ax = half * COS30;
  const ay = half * SIN30;
  const top = 560;
  const baseThickness = scene.layers.length > 4 ? 120 : 160;

  // Layer geometry (top → bottom)
  let y = top;
  const geo = scene.layers.map((layer) => {
    const h = baseThickness * (layer.thickness ?? 1);
    const g = { layer, y, h };
    y += h;
    return g;
  });
  const bottom = y + ay * 2;

  // Build order: bottom layer first
  const order = [...geo].reverse();
  const each = 0.28;
  const labelStart = 0.3 + order.length * each;

  return (
    <>
      {scene.title ? (
        <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <TextAnimation text={scene.title} mode="wordStagger" size={92} stroke={12} />
        </div>
      ) : null}

      {/* one landing "thud" per layer (kept outside the <svg>) */}
      {order.map((g, i) => (
        <SoundEffect key={g.layer.label} sound="thud" at={0.3 + i * each + 0.4} volume={0.35} />
      ))}

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* floor shadow */}
        <ellipse cx={cx} cy={bottom + 20} rx={ax + 40} ry={60} fill="rgba(0,0,0,0.45)" opacity={progress(frame, t(0.2), t(0.6))} />
        {order.map((g, i) => {
          const delay = 0.3 + i * each;
          const p = progress(frame, t(delay), t(0.45), "easeOut");
          const land = progress(frame, t(delay + 0.4), t(0.25), "punch");
          const dy = (1 - p) * -900;
          const squash = 1 + Math.sin(land * Math.PI) * 0.03;
          const { layer, y: ly, h } = g;
          const isTop = g === geo[0];
          const L = `${cx - ax},${ly + ay} ${cx},${ly + ay * 2} ${cx},${ly + ay * 2 + h} ${cx - ax},${ly + ay + h}`;
          const R = `${cx},${ly + ay * 2} ${cx + ax},${ly + ay} ${cx + ax},${ly + ay + h} ${cx},${ly + ay * 2 + h}`;
          const T = `${cx},${ly} ${cx + ax},${ly + ay} ${cx},${ly + ay * 2} ${cx - ax},${ly + ay}`;
          return (
            <g key={layer.label} transform={`translate(0 ${dy}) scale(1 ${squash})`} style={{ transformOrigin: `${cx}px ${ly + h}px`, opacity: p > 0 ? 1 : 0 }}>
              <polygon points={L} fill={shade(layer.color, -0.28)} stroke={theme.colors.ink} strokeWidth={4} strokeLinejoin="round" />
              <polygon points={R} fill={layer.color} stroke={theme.colors.ink} strokeWidth={4} strokeLinejoin="round" />
              {/* strata lines = hand-made paper texture */}
              {[0.3, 0.55, 0.8].map((k) => (
                <path
                  key={k}
                  d={`M${cx - ax + 10},${ly + ay + h * k} Q${cx - ax / 2},${ly + ay * 1.5 + h * k + 10} ${cx},${ly + ay * 2 + h * k} T${cx + ax - 10},${ly + ay + h * k}`}
                  stroke={shade(layer.color, -0.45)}
                  strokeWidth={3}
                  fill="none"
                  opacity={0.35}
                />
              ))}
              {isTop ? <polygon points={T} fill={shade(layer.color, 0.25)} stroke={theme.colors.ink} strokeWidth={4} strokeLinejoin="round" /> : null}
            </g>
          );
        })}

        {scene.flowArrow ? (
          <path
            d={`M${cx - ax * 0.55},${top + ay * 0.6} C${cx - ax * 0.9},${top + 400} ${cx - ax * 0.2},${geo[geo.length - 1].y} ${cx - ax * 0.45},${bottom - 60}`}
            fill="none"
            stroke={theme.colors.accent}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray="28 22"
            strokeDashoffset={-frame * 3}
            opacity={progress(frame, t(labelStart + 0.6), t(0.4))}
            style={{ filter: `drop-shadow(0 0 10px ${theme.colors.accent})` }}
          />
        ) : null}
      </svg>

      {/* Labels sit ON the right faces: skewY(-30deg) matches the face angle. */}
      {geo.map((g, i) => {
        const delay = labelStart + i * 0.18;
        const p = progress(frame, t(delay), t(0.35), "snappy");
        return (
          <div
            key={g.layer.label}
            style={{
              position: "absolute",
              left: cx + 26,
              top: g.y + ay * 2 + g.h / 2 - 22,
              transform: `skewY(-30deg)`,
              transformOrigin: "0 50%",
              clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
              fontFamily: theme.fonts.display,
              fontSize: 40,
              color: "#fff",
              textTransform: "uppercase",
              WebkitTextStroke: `7px ${theme.colors.ink}`,
              paintOrder: "stroke fill",
              whiteSpace: "nowrap",
            }}
          >
            <SoundEffect sound="tick" at={delay} volume={0.4} />
            {g.layer.label}
          </div>
        );
      })}

      {(scene.props ?? []).map((prop, i) => (
        <div key={i} style={{ position: "absolute", left: prop.x, top: prop.y, transform: "translate(-50%, -100%)" }}>
          <ObjectEntrance type="drop" delay={labelStart + 0.2 + i * 0.15} duration={0.45} distance={120} sfx="pop" sfxVolume={0.4}>
            <Img src={staticFile(prop.src)} style={{ width: 150 * (prop.scale ?? 1), display: "block", filter: "drop-shadow(4px 8px 6px rgba(0,0,0,0.4))" }} />
          </ObjectEntrance>
        </div>
      ))}
    </>
  );
};
