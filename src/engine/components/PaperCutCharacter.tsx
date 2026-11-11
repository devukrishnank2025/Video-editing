/**
 * <PaperCutCharacter> — a cut-out puppet built from separate parts that rotate
 * around pivot points (like a paper doll held together with split pins).
 *
 *  • idle breathing / body bob
 *  • head tilts
 *  • blinking
 *  • mouth flaps during `talking` time ranges
 *  • right-arm wave / point during `gesture` time ranges
 *  • animated "on twos" by default for a stop-motion feel
 *
 * With no `parts` it draws a built-in original placeholder puppet. To use your
 * own character, export each part as a transparent PNG/SVG and set:
 *
 *   character: {
 *     parts: { body: "characters/me/body.png", head: "characters/me/head.png",
 *              armLeft: "...", armRight: "...", mouthOpen: "...", mouthClosed: "..." },
 *     talking: [[0.2, 2.4]], gesture: [[1.0, 1.8]],
 *   }
 *
 * Part images are drawn in a 400×700 box; see README → "Using your own character".
 */
import React from "react";
import { Img, staticFile } from "remotion";
import type { CharacterConfig } from "../../config/types";
import { progress, seeded, stepped, wobble } from "../timeline/timing";
import { useScene } from "../SceneContext";
import { ShadowEffect } from "./Effects";

const inRanges = (sec: number, ranges?: [number, number][]) =>
  !!ranges?.some(([a, b]) => sec >= a && sec < b);

/** 0→1→0 ramp inside a range, so gestures ease in and out. */
const rangeAmount = (sec: number, ranges: [number, number][] | undefined, fps: number, frame: number) => {
  if (!ranges) return 0;
  for (const [a, b] of ranges) {
    if (sec >= a - 0.3 && sec < b + 0.3) {
      const up = progress(frame, a * fps - 0.25 * fps, 0.25 * fps, "snappy");
      const down = 1 - progress(frame, b * fps, 0.25 * fps, "smooth");
      return Math.min(up, down);
    }
  }
  return 0;
};

/** Placeholder parts drawn as flat paper shapes (original design, swap freely). */
const DefaultPart: React.FC<{ part: string; palette: Required<NonNullable<CharacterConfig["palette"]>>; mouthOpen?: number; blink?: boolean }> = ({
  part,
  palette,
  mouthOpen = 0,
  blink = false,
}) => {
  const edge = "#1a1410";
  switch (part) {
    case "body":
      return (
        <svg width={400} height={420} viewBox="0 0 400 420">
          <path d="M70 420 L95 120 Q200 60 305 120 L330 420 Z" fill={palette.shirt} stroke={edge} strokeWidth={6} />
          <path d="M160 92 L200 150 L240 92" fill="none" stroke={edge} strokeWidth={6} />
          <rect x={185} y={60} width={30} height={40} fill={palette.skin} stroke={edge} strokeWidth={6} />
        </svg>
      );
    case "head":
      return (
        <svg width={240} height={260} viewBox="0 0 240 260">
          <ellipse cx={120} cy={140} rx={92} ry={108} fill={palette.skin} stroke={edge} strokeWidth={6} />
          <path d="M28 120 Q30 20 120 22 Q215 20 214 118 Q190 70 120 66 Q60 66 28 120 Z" fill={palette.hair} stroke={edge} strokeWidth={6} />
          {blink ? (
            <>
              <path d="M70 140 h28" stroke={edge} strokeWidth={6} strokeLinecap="round" />
              <path d="M142 140 h28" stroke={edge} strokeWidth={6} strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx={84} cy={140} r={11} fill={edge} />
              <circle cx={156} cy={140} r={11} fill={edge} />
              <circle cx={88} cy={136} r={3.5} fill="#fff" />
              <circle cx={160} cy={136} r={3.5} fill="#fff" />
            </>
          )}
          <ellipse cx={120} cy={200} rx={24} ry={4 + mouthOpen * 16} fill="#5a1f1f" stroke={edge} strokeWidth={5} />
          <circle cx={58} cy={178} r={12} fill="#ff8a8a" opacity={0.5} />
          <circle cx={182} cy={178} r={12} fill="#ff8a8a" opacity={0.5} />
        </svg>
      );
    case "arm":
      return (
        <svg width={90} height={260} viewBox="0 0 90 260">
          <rect x={18} y={6} width={54} height={200} rx={27} fill={palette.shirt} stroke={edge} strokeWidth={6} />
          <circle cx={45} cy={222} r={30} fill={palette.skin} stroke={edge} strokeWidth={6} />
        </svg>
      );
    default:
      return null;
  }
};

export const PaperCutCharacter: React.FC<CharacterConfig & { style?: React.CSSProperties }> = ({
  parts,
  palette,
  talking,
  gesture,
  stepFrames = 2,
  scale = 1,
  x = 0,
  y = 0,
  style,
}) => {
  const { frame: smoothFrame, fps } = useScene();
  const frame = stepped(smoothFrame, stepFrames);
  const sec = frame / fps;
  const pal = { skin: "#f2c6a0", shirt: "#3d7bff", hair: "#2b1d16", ...palette };

  // Idle motion
  const breathe = Math.sin(frame * 0.09) * 0.012;
  const bob = wobble(frame, 1, 4, 1);
  const headTilt = wobble(frame, 0.7, 4, 2) + (inRanges(sec, talking) ? Math.sin(frame * 0.35) * 2.5 : 0);
  // Blink for 3 frames every ~2.5–4s (deterministic)
  const blinkCycle = Math.floor(sec / 3.2);
  const blinkAt = blinkCycle * 3.2 + seeded(blinkCycle) * 0.8;
  const blink = sec >= blinkAt && sec < blinkAt + 0.1;
  // Mouth: pseudo-random flap while talking
  const mouth = inRanges(sec, talking) ? 0.25 + seeded(Math.floor(frame / 3)) * 0.75 : 0;
  // Arms
  const g = rangeAmount(sec, gesture, fps, frame);
  const armR = 8 + g * (-150 + Math.sin(frame * 0.5) * 14); // raise & wave
  const armL = -8 + wobble(frame, 0.8, 3, 4);

  const partImg = (src: string, w: number) => <Img src={staticFile(src)} style={{ width: w, display: "block" }} />;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: 0,
        width: 400,
        height: 700,
        transform: `translateX(-50%) translate(${x}px, ${y + bob}px) scale(${scale}) scaleY(${1 + breathe})`,
        transformOrigin: "50% 100%",
        ...style,
      }}
    >
      <ShadowEffect lift={0.45}>
        <div style={{ position: "relative", width: 400, height: 700 }}>
          {/* left arm (behind body) */}
          <div style={{ position: "absolute", left: 50, top: 340, transformOrigin: "45px 20px", transform: `rotate(${armL}deg)` }}>
            {parts?.armLeft ? partImg(parts.armLeft, 90) : <DefaultPart part="arm" palette={pal} />}
          </div>
          {/* body */}
          <div style={{ position: "absolute", left: 0, top: 280 }}>
            {parts?.body ? partImg(parts.body, 400) : <DefaultPart part="body" palette={pal} />}
          </div>
          {/* right arm (in front) */}
          <div style={{ position: "absolute", left: 262, top: 340, transformOrigin: "45px 20px", transform: `rotate(${-armR}deg)` }}>
            {parts?.armRight ? partImg(parts.armRight, 90) : <DefaultPart part="arm" palette={pal} />}
          </div>
          {/* head – pivots at the neck */}
          <div style={{ position: "absolute", left: 80, top: 90, transformOrigin: "120px 240px", transform: `rotate(${headTilt}deg)` }}>
            {parts?.head ? (
              <div style={{ position: "relative" }}>
                {partImg(parts.head, 240)}
                {parts.mouthOpen && parts.mouthClosed ? (
                  <div style={{ position: "absolute", left: 80, top: 170 }}>{partImg(mouth > 0.4 ? parts.mouthOpen : parts.mouthClosed, 80)}</div>
                ) : null}
              </div>
            ) : (
              <DefaultPart part="head" palette={pal} mouthOpen={mouth} blink={blink} />
            )}
          </div>
        </div>
      </ShadowEffect>
    </div>
  );
};
