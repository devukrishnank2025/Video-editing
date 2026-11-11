/**
 * <CaptionAnimation> — burned-in subtitles timed to your voice-over.
 *
 *   cues = [{ text: "Rocks are *recycled*", start: 0.2, end: 1.6 }]
 *
 * mode "punch": one big word at a time, popping in (TikTok / Shorts style)
 * mode "line":  the whole line is shown, the word being spoken lights up
 *
 * Word timings are spread evenly across each cue. For exact word timing,
 * split your cue into smaller cues (or generate them from a transcript tool).
 */
import React from "react";
import type { CaptionCue, CaptionStyle } from "../../config/types";
import { springIn } from "../timeline/timing";
import { useScene } from "../SceneContext";
import { parseHighlights } from "./TextAnimation";

export const CaptionAnimation: React.FC<{ cues: CaptionCue[]; captionStyle?: CaptionStyle }> = ({ cues, captionStyle = {} }) => {
  const { theme, frame, fps, height } = useScene();
  const { mode = "punch", position = "bottom", fontSize, uppercase = true } = captionStyle;
  const now = frame / fps;
  const cue = cues.find((c) => now >= c.start && now < c.end);
  if (!cue) return null;

  const tokens = parseHighlights(cue.text);
  const per = (cue.end - cue.start) / tokens.length;
  const active = Math.min(tokens.length - 1, Math.floor((now - cue.start) / per));

  const top = position === "top" ? height * 0.12 : position === "center" ? height * 0.48 : height * 0.72;
  const common: React.CSSProperties = {
    position: "absolute",
    left: 60,
    right: 60,
    top,
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    textAlign: "center",
    fontFamily: theme.fonts.display,
    textTransform: uppercase ? "uppercase" : "none",
    WebkitTextStroke: `10px ${theme.colors.ink}`,
    paintOrder: "stroke fill",
    lineHeight: 1.05,
  };

  if (mode === "punch") {
    const tk = tokens[active];
    const wordStart = (cue.start + active * per) * fps;
    const s = springIn(frame, fps, wordStart, { damping: 10, stiffness: 260 });
    return (
      <div style={{ ...common, fontSize: fontSize ?? 130 }}>
        <span
          style={{
            display: "inline-block",
            color: tk.highlight ? theme.colors.accent : theme.colors.text,
            transform: `scale(${0.5 + s * 0.5}) rotate(${(1 - s) * -6}deg)`,
            textShadow: "0 8px 0 rgba(0,0,0,0.35)",
          }}
        >
          {tk.word}
        </span>
      </div>
    );
  }

  return (
    <div style={{ ...common, fontSize: fontSize ?? 76, gap: "0 0.28em" }}>
      {tokens.map((tk, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            color: i === active ? theme.colors.accent : tk.highlight ? theme.colors.accent2 : theme.colors.text,
            transform: i === active ? "scale(1.08)" : "scale(1)",
            opacity: i <= active ? 1 : 0.55,
          }}
        >
          {tk.word}
        </span>
      ))}
    </div>
  );
};
