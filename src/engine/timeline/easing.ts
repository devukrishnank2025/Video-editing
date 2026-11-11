/**
 * Easing presets.
 *
 * Every animation in the kit picks its curve by NAME (a string), so you can change
 * the feel of a whole video from the config file without touching code.
 *
 *   "snappy"   – fast start, soft landing. The default for most entrances.
 *   "smooth"   – gentle in-and-out. Good for slow camera drifts.
 *   "punch"    – overshoots a little, then settles. Good for labels and icons.
 *   "whip"     – very fast middle, used for whip-pans and swipe transitions.
 *   "linear"   – constant speed. Good for parallax drift and progress bars.
 *   "anticipate" – pulls back slightly before moving forward (cartoon wind-up).
 */
import { Easing } from "remotion";

export type EasingName =
  | "linear"
  | "smooth"
  | "snappy"
  | "punch"
  | "whip"
  | "anticipate"
  | "easeIn"
  | "easeOut";

export const EASINGS: Record<EasingName, (t: number) => number> = {
  linear: Easing.linear,
  smooth: Easing.bezier(0.45, 0, 0.55, 1),
  snappy: Easing.bezier(0.16, 1, 0.3, 1),
  punch: Easing.bezier(0.34, 1.56, 0.64, 1),
  whip: Easing.bezier(0.7, 0, 0.3, 1),
  anticipate: Easing.bezier(0.36, -0.4, 0.4, 1),
  easeIn: Easing.bezier(0.5, 0, 0.75, 0),
  easeOut: Easing.bezier(0.25, 1, 0.5, 1),
};

export const getEasing = (name: EasingName = "snappy") => EASINGS[name] ?? EASINGS.snappy;
