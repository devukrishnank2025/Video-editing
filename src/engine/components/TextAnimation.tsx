/**
 * TEXT — <TextAnimation> and <LabelCallout>
 *
 *   <TextAnimation text="The *ocean* floor is young" mode="wordStagger" size={110} />
 *
 * Modes:
 *   pop          – whole line scales in with overshoot
 *   slideUp      – whole line rises in
 *   wordStagger  – words pop in one after another (most common in explainers)
 *   letterStagger– letters drop in one by one
 *   typewriter   – characters appear with a cursor
 *   stamp        – slams in big and settles (good for one-word punchlines)
 *
 * Wrap words in *asterisks* to colour them with the accent colour.
 */
import React from "react";
import type { EasingName } from "../timeline/easing";
import { progress, springIn } from "../timeline/timing";
import { useScene } from "../SceneContext";
import { entranceStyle } from "./motion";
import { SoundEffect } from "./SoundEffect";

export type Token = { word: string; highlight: boolean };

/** "Hello *big* world" → [{Hello,false},{big,true},{world,false}] */
export const parseHighlights = (text: string): Token[] =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const highlight = /^\*.*\*[.,!?:;]*$/.test(w);
      return { word: highlight ? w.replace(/\*/g, "") : w, highlight };
    });

export type TextAnimationProps = {
  text: string;
  mode?: "pop" | "slideUp" | "wordStagger" | "letterStagger" | "typewriter" | "stamp";
  delay?: number; // seconds
  /** Seconds between words/letters for stagger modes, or total time for the others. */
  pace?: number;
  size?: number;
  color?: string;
  highlightColor?: string;
  font?: "display" | "body";
  uppercase?: boolean;
  /** Thick outline around letters (px). */
  stroke?: number;
  strokeColor?: string;
  /** Neon-style glow. */
  glow?: boolean;
  align?: "left" | "center" | "right";
  maxWidth?: number;
  lineHeight?: number;
  easing?: EasingName;
  sfx?: string; // plays once at `delay`
  style?: React.CSSProperties;
};

export const TextAnimation: React.FC<TextAnimationProps> = ({
  text,
  mode = "wordStagger",
  delay = 0,
  pace,
  size = 96,
  color,
  highlightColor,
  font = "display",
  uppercase = true,
  stroke = 0,
  strokeColor,
  glow = false,
  align = "center",
  maxWidth = 940,
  lineHeight = 1.02,
  easing,
  sfx,
  style,
}) => {
  const { theme, frame, fps, t } = useScene();
  const tokens = parseHighlights(text);
  const base: React.CSSProperties = {
    fontFamily: theme.fonts[font],
    fontSize: size,
    lineHeight,
    color: color ?? theme.colors.text,
    textTransform: uppercase ? "uppercase" : "none",
    textAlign: align,
    maxWidth,
    WebkitTextStroke: stroke ? `${stroke}px ${strokeColor ?? theme.colors.ink}` : undefined,
    paintOrder: "stroke fill",
    letterSpacing: font === "display" ? "0.01em" : undefined,
    fontWeight: font === "body" ? 800 : 400,
    ...style,
  };
  const hl = highlightColor ?? theme.colors.accent;
  // Glow only on coloured words — glowing white text just looks blurry.
  // Plain words get a hard offset shadow instead (cut-out paper look).
  const glowFor = (c: string) =>
    glow && c !== (color ?? theme.colors.text) ? `0 0 18px ${c}, 0 0 42px ${c}` : glow ? "0 6px 0 rgba(0,0,0,0.35)" : undefined;

  const sound = sfx ? <SoundEffect sound={sfx} at={delay} /> : null;

  if (mode === "pop" || mode === "slideUp" || mode === "stamp") {
    const p = progress(frame, t(delay), t(pace ?? 0.45), easing ?? (mode === "slideUp" ? "snappy" : "punch"));
    return (
      <div style={{ ...base, ...entranceStyle(mode, p, 80) }}>
        {sound}
        {tokens.map((tk, i) => (
          <span key={i} style={{ color: tk.highlight ? hl : undefined, textShadow: glowFor(tk.highlight ? hl : (color ?? theme.colors.text)) }}>
            {tk.word}
            {i < tokens.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    );
  }

  if (mode === "typewriter") {
    const chars = tokens.map((tk) => tk.word).join(" ");
    const perChar = pace ?? 0.035;
    const shown = Math.max(0, Math.floor((frame - t(delay)) / t(perChar)));
    const cursorOn = Math.floor(frame / (fps / 2)) % 2 === 0;
    let count = 0;
    return (
      <div style={base}>
        {sound}
        {tokens.map((tk, i) => {
          const visible = tk.word.slice(0, Math.max(0, shown - count));
          count += tk.word.length + 1;
          return (
            <span key={i} style={{ color: tk.highlight ? hl : undefined }}>
              {visible}
              {i < tokens.length - 1 && visible.length === tk.word.length ? " " : ""}
            </span>
          );
        })}
        {shown < chars.length + 6 && cursorOn ? <span style={{ color: hl }}>|</span> : null}
      </div>
    );
  }

  if (mode === "letterStagger") {
    const each = pace ?? 0.03;
    let li = 0;
    return (
      <div style={base}>
        {sound}
        {tokens.map((tk, wi) => (
          <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap", color: tk.highlight ? hl : undefined }}>
            {tk.word.split("").map((ch, ci) => {
              const s = springIn(frame, fps, t(delay) + li++ * t(each), { damping: 11 });
              return (
                <span
                  key={ci}
                  style={{ display: "inline-block", transform: `translateY(${(1 - s) * -60}px) rotate(${(1 - s) * 20}deg)`, opacity: Math.min(1, s * 2) }}
                >
                  {ch}
                </span>
              );
            })}
            {wi < tokens.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    );
  }

  // wordStagger
  const each = pace ?? 0.12;
  return (
    <div style={base}>
      {sound}
      {tokens.map((tk, i) => {
        const s = springIn(frame, fps, t(delay) + i * t(each));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `translateY(${(1 - s) * 40}px) scale(${0.6 + s * 0.4})`,
              opacity: Math.min(1, s * 1.6),
              color: tk.highlight ? hl : undefined,
              textShadow: glowFor(tk.highlight ? hl : (color ?? theme.colors.text)),
              marginRight: "0.25em",
            }}
          >
            {tk.word}
          </span>
        );
      })}
    </div>
  );
};

/**
 * <LabelCallout> — a bold diagram label with a leader line that draws itself
 * from a point (the thing being labelled) to the text.
 *
 *   <LabelCallout text="Hot core" x={540} y={1200} dx={180} dy={-80} delay={0.6} />
 */
export const LabelCallout: React.FC<{
  text: string;
  x: number; // anchor point (px, absolute in frame)
  y: number;
  dx?: number; // label offset from anchor
  dy?: number;
  delay?: number;
  color?: string;
  size?: number;
  dot?: boolean;
  sfx?: string;
}> = ({ text, x, y, dx = 160, dy = -60, delay = 0, color, size = 46, dot = true, sfx = "tick" }) => {
  const { theme, frame, t } = useScene();
  const c = color ?? theme.colors.text;
  const lineP = progress(frame, t(delay), t(0.3), "snappy");
  const textP = progress(frame, t(delay + 0.18), t(0.35), "punch");
  const len = Math.hypot(dx, dy);
  return (
    <>
      <SoundEffect sound={sfx} at={delay} volume={0.5} />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }} width={1} height={1}>
        {dot ? <circle cx={x} cy={y} r={9 * Math.min(1, lineP * 3)} fill={c} /> : null}
        <line
          x1={x}
          y1={y}
          x2={x + dx}
          y2={y + dy}
          stroke={c}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - lineP)}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          left: x + dx + (dx >= 0 ? 12 : -12),
          top: y + dy,
          transform: `translate(${dx >= 0 ? "0" : "-100%"}, -50%) scale(${Math.max(0, textP)})`,
          transformOrigin: dx >= 0 ? "0% 50%" : "100% 50%",
          fontFamily: theme.fonts.display,
          fontSize: size,
          color: c,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          WebkitTextStroke: `8px ${theme.colors.ink}`,
          paintOrder: "stroke fill",
          letterSpacing: "0.02em",
        }}
      >
        {text}
      </div>
    </>
  );
};
