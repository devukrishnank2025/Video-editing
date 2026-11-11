/**
 * Pure functions that turn a 0→1 progress value into CSS for every
 * entrance / exit type. Shared by ObjectEntrance, ObjectExit, TextAnimation…
 */
import type React from "react";
import type { EntranceType, ExitType } from "../../config/types";

export const entranceStyle = (type: EntranceType, p: number, distance = 160): React.CSSProperties => {
  const inv = 1 - p;
  switch (type) {
    case "none":
      return {};
    case "fade":
      return { opacity: p };
    case "pop":
      // `p` already overshoots when the "punch" easing is used.
      return { opacity: Math.min(1, p * 3), transform: `scale(${Math.max(0, p)})` };
    case "slideUp":
      return { opacity: Math.min(1, p * 2), transform: `translateY(${inv * distance}px)` };
    case "slideDown":
      return { opacity: Math.min(1, p * 2), transform: `translateY(${-inv * distance}px)` };
    case "slideLeft":
      return { opacity: Math.min(1, p * 2), transform: `translateX(${inv * distance}px)` };
    case "slideRight":
      return { opacity: Math.min(1, p * 2), transform: `translateX(${-inv * distance}px)` };
    case "drop": {
      // Falls from above and squashes slightly on landing.
      const squash = p > 0.85 ? 1 - Math.sin(((p - 0.85) / 0.15) * Math.PI) * 0.08 : 1;
      return {
        opacity: Math.min(1, p * 4),
        transform: `translateY(${-inv * distance * 3}px) scale(${1 / squash}, ${squash})`,
        transformOrigin: "50% 100%",
      };
    }
    case "unfold":
      // Like a paper flap folding open from the bottom edge.
      return {
        transform: `perspective(1200px) rotateX(${inv * -88}deg)`,
        transformOrigin: "50% 100%",
        opacity: p > 0.02 ? 1 : 0,
      };
    case "stamp":
      return {
        opacity: Math.min(1, p * 5),
        transform: `scale(${1 + inv * 0.8}) rotate(${inv * -8}deg)`,
      };
    case "spin":
      return { opacity: p, transform: `rotate(${inv * -180}deg) scale(${0.3 + p * 0.7})` };
    case "wipe":
      return { clipPath: `inset(0 ${inv * 100}% 0 0)` };
    default:
      return {};
  }
};

export const exitStyle = (type: ExitType, p: number, distance = 160): React.CSSProperties => {
  // p: 0 = fully visible, 1 = fully gone
  switch (type) {
    case "none":
      return {};
    case "fade":
      return { opacity: 1 - p };
    case "shrink":
      return { opacity: 1 - p, transform: `scale(${1 - p})` };
    case "slideUp":
      return { opacity: 1 - p, transform: `translateY(${-p * distance}px)` };
    case "slideDown":
      return { opacity: 1 - p, transform: `translateY(${p * distance}px)` };
    case "slideLeft":
      return { opacity: 1 - p, transform: `translateX(${-p * distance}px)` };
    case "slideRight":
      return { opacity: 1 - p, transform: `translateX(${p * distance}px)` };
    case "flyAway":
      return { opacity: 1 - p, transform: `translate(${p * distance}px, ${-p * distance * 1.5}px) rotate(${p * 25}deg) scale(${1 - p * 0.4})` };
    case "wipe":
      return { clipPath: `inset(0 0 0 ${p * 100}%)` };
    default:
      return {};
  }
};

/** Merge two style objects, combining `transform`s instead of overwriting. */
export const mergeStyles = (...styles: React.CSSProperties[]): React.CSSProperties => {
  const out: React.CSSProperties = {};
  const transforms: string[] = [];
  let opacity = 1;
  for (const s of styles) {
    const { transform, opacity: o, ...rest } = s;
    Object.assign(out, rest);
    if (transform) transforms.push(String(transform));
    if (o !== undefined) opacity *= Number(o);
  }
  if (transforms.length) out.transform = transforms.join(" ");
  out.opacity = opacity;
  return out;
};
