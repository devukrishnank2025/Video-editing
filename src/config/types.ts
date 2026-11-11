/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONFIGURATION TYPES
 *  Everything a video is made of. You normally never edit this file — you write
 *  a video config (see src/videos/*.ts) and TypeScript checks it against these
 *  types, giving autocomplete and catching typos.
 *
 *  Times are always in SECONDS. Paths are relative to the /public folder,
 *  e.g. "images/rock.svg" → public/images/rock.svg.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type { EasingName } from "../engine/timeline/easing";

/* ────────────────────────────── Theme ────────────────────────────── */

export type Theme = {
  colors: {
    background: string; // page / canvas behind everything
    paper: string; // cut-out paper colour (borders of cut-outs)
    ink: string; // dark outlines, shadows
    text: string; // main text colour
    accent: string; // highlight colour (labels, arrows, buttons)
    accent2: string; // secondary highlight
    warm: string; // e.g. lava / danger / heat
    cool: string; // e.g. water / calm
  };
  fonts: {
    display: string; // big punchy headlines & labels
    body: string; // captions & small text
  };
  /** Global animation speed multiplier. 1 = normal, 1.5 = 50% faster everything. */
  speed?: number;
};

/* ─────────────────────────── Animation bits ─────────────────────────── */

export type EntranceType =
  | "none"
  | "fade"
  | "pop"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "drop"
  | "unfold"
  | "stamp"
  | "spin"
  | "wipe";

export type ExitType = "none" | "fade" | "shrink" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "flyAway" | "wipe";

export type MotionConfig = {
  type: EntranceType;
  /** When it starts, in seconds from the start of the scene. */
  delay?: number;
  /** How long it lasts, in seconds. */
  duration?: number;
  easing?: EasingName;
  /** Distance for slides, in px. */
  distance?: number;
};

export type ExitConfig = {
  type: ExitType;
  /** When it starts, in seconds from the start of the scene. */
  at: number;
  duration?: number;
  easing?: EasingName;
  distance?: number;
};

/* ─────────────────────────────── Camera ─────────────────────────────── */

export type CameraKeyframe = {
  /** Seconds from the start of the scene. */
  at: number;
  zoom?: number; // 1 = normal, 1.3 = 30% closer
  x?: number; // px, positive = camera looks to the right (content moves left)
  y?: number; // px, positive = camera looks down (content moves up)
  rotate?: number; // degrees
  easing?: EasingName; // curve used to arrive at this keyframe
};

export type CameraPreset =
  | "static"
  | "slowPushIn"
  | "slowPullOut"
  | "punchIn"
  | "panLeft"
  | "panRight"
  | "panUp"
  | "panDown"
  | "drift"
  | "handheld";

export type CameraConfig = {
  preset?: CameraPreset;
  /** Custom keyframes. If given, they override `preset`. */
  keyframes?: CameraKeyframe[];
  /** Multiplies how far presets move/zoom. 0.5 = subtle, 2 = dramatic. */
  intensity?: number;
  /** Adds a small hand-held shake on top. 0 = off. */
  shake?: number;
};

/* ───────────────────────────── Transitions ───────────────────────────── */

export type TransitionType =
  | "cut"
  | "fade"
  | "slideUp"
  | "slideLeft"
  | "whipPan"
  | "zoomPunch"
  | "paperTear"
  | "iris"
  | "flash";

export type TransitionConfig = {
  type: TransitionType;
  durationInSeconds?: number;
  easing?: EasingName;
  /** Optional sound for this transition (name from the SFX library or a path). */
  sfx?: string;
};

/* ──────────────────────────── Backgrounds ──────────────────────────── */

export type BackgroundConfig =
  | { type: "paper"; color?: string; textureOpacity?: number }
  | { type: "gradient"; from: string; to: string; angle?: number }
  | { type: "image"; src: string; dim?: number; blur?: number }
  | { type: "starfield"; color?: string; density?: number; twinkle?: boolean }
  | { type: "grid"; color?: string; lineColor?: string; isometric?: boolean };

/* ─────────────────────────────── Audio ─────────────────────────────── */

export type SfxCue = {
  /** Name from the SFX library (see src/config/sfx.ts) or a path like "audio/sfx/my.wav". */
  sound: string;
  /** Seconds from the start of the scene. */
  at: number;
  volume?: number;
  playbackRate?: number;
};

export type MusicConfig = {
  src: string;
  volume?: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
  loop?: boolean;
};

/* ───────────────────────────── Captions ───────────────────────────── */

export type CaptionCue = {
  /** Wrap words in *asterisks* to highlight them in the accent colour. */
  text: string;
  start: number; // seconds (scene-relative inside a scene, video-relative at video level)
  end: number;
};

export type CaptionStyle = {
  /** "punch" = one big word at a time; "line" = whole line with active word highlighted. */
  mode?: "punch" | "line";
  position?: "top" | "center" | "bottom";
  fontSize?: number;
  uppercase?: boolean;
};

/* ───────────────────────────── Characters ───────────────────────────── */

export type CharacterConfig = {
  /**
   * Images for each body part (transparent PNG/SVG). Leave out to use the
   * built-in placeholder puppet. Pivot points are in % of the part's box.
   */
  parts?: {
    body?: string;
    head?: string;
    armLeft?: string;
    armRight?: string;
    mouthOpen?: string;
    mouthClosed?: string;
  };
  /** Colours for the built-in placeholder puppet. */
  palette?: { skin?: string; shirt?: string; hair?: string };
  /** Time ranges (seconds) when the character is talking (mouth flaps). */
  talking?: [number, number][];
  /** Time ranges (seconds) when the character waves / gestures with the right arm. */
  gesture?: [number, number][];
  /** Animate on twos for a stop-motion paper feel (1 = smooth, 2 = on twos, 3 = on threes). */
  stepFrames?: number;
  scale?: number;
  x?: number; // px from centre
  y?: number;
};

/* ─────────────────────────────── Scenes ─────────────────────────────── */

type SceneBase = {
  /** Shown in the Studio sidebar & handy for your own notes. */
  name?: string;
  durationInSeconds: number;
  background?: BackgroundConfig;
  camera?: CameraConfig;
  /** How this scene comes in. Falls back to the video's defaultTransition. */
  transitionIn?: TransitionConfig;
  sfx?: SfxCue[];
  captions?: CaptionCue[];
  /** Per-scene animation speed (multiplies theme.speed). */
  speed?: number;
  /** EXTRA film grain for this scene only (0–1), added on top of video.grain. */
  grain?: number;
};

export type TitleScene = SceneBase & {
  type: "title";
  kicker?: string; // small text above the headline
  headline: string; // use *word* for accent colour
  subline?: string;
  icon?: string; // image path
  orbs?: { src: string; label?: string }[]; // up to 2 floating cut-out images
};

export type CutawayLayer = {
  label: string;
  color: string;
  /** Relative thickness of this layer (1 = normal). */
  thickness?: number;
  /** Optional image to use as the layer's texture. */
  texture?: string;
};

export type CutawayScene = SceneBase & {
  type: "cutaway";
  title?: string;
  /** Layers from TOP to BOTTOM. */
  layers: CutawayLayer[];
  /** Small icon / prop images sitting on top of the block. */
  props?: { src: string; x: number; y: number; scale?: number }[];
  /** Draw an animated arrow down through the layers. */
  flowArrow?: boolean;
};

export type CollageItem = { src: string; caption?: string };

export type CollageTimelineScene = SceneBase & {
  type: "collageTimeline";
  topLabel: string;
  bottomLabel: string;
  spanLabel?: string; // text next to the arrow, e.g. "3 MILLION YEARS"
  items: CollageItem[];
  topIcon?: string;
  bottomIcon?: string;
};

export type ComparisonSide = { src: string; label: string; color?: string; caption?: string };

export type ComparisonScene = SceneBase & {
  type: "comparison";
  top: ComparisonSide;
  bottom: ComparisonSide;
  vsText?: string;
};

export type BrollScene = SceneBase & {
  type: "broll";
  /** Image or video path (mp4/webm play as video). */
  src: string;
  kenBurns?: { fromZoom?: number; toZoom?: number; fromX?: number; toX?: number; fromY?: number; toY?: number };
  credit?: string; // small "SOURCE: …" text
  overlayText?: string;
  tint?: string; // colour wash over the footage, e.g. "rgba(255,120,0,0.2)"
};

export type PresenterScene = SceneBase & {
  type: "presenter";
  character: CharacterConfig;
  lowerThird?: { name: string; role?: string };
  /** Cut-out images that pop in around the presenter. */
  floaters?: { src: string; at: number; x: number; y: number; size?: number; rotate?: number }[];
};

export type ParallaxLandscapeScene = SceneBase & {
  type: "parallax";
  /** Layers from BACK (depth 0.1) to FRONT (depth 1). */
  layers: { src: string; depth: number; y?: number; scale?: number }[];
  /** Total horizontal travel of the camera, in px. */
  travel?: number;
  headline?: string;
};

export type CtaScene = SceneBase & {
  type: "cta";
  buttonText: string;
  subtext?: string;
  icon?: string;
};

export type SceneConfig =
  | TitleScene
  | CutawayScene
  | CollageTimelineScene
  | ComparisonScene
  | BrollScene
  | PresenterScene
  | ParallaxLandscapeScene
  | CtaScene;

export type SceneType = SceneConfig["type"];

/* ─────────────────────────────── Video ─────────────────────────────── */

export type VideoConfig = {
  /** Composition id – shows in the Studio and is used on the render command. */
  id: string;
  fps: number;
  width: number;
  height: number;
  theme: Theme;
  scenes: SceneConfig[];
  defaultTransition?: TransitionConfig;
  music?: MusicConfig;
  /** Whole-video captions (times relative to the start of the video). */
  captions?: CaptionCue[];
  captionStyle?: CaptionStyle;
  /** Film grain over everything (0–1). */
  grain?: number;
  /** Darkened corners (0–1). */
  vignette?: number;
};
