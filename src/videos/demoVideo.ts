/**
 * ════════════════════════════════════════════════════════════════════════════
 *  DEMO VIDEO — "Where does sand come from?"
 *  Original placeholder content that shows off every scene type and technique.
 *
 *  This is the file you edit. Change text, swap image paths, retime scenes,
 *  pick other transitions or camera presets — the engine does the rest.
 *  All times are in SECONDS. All paths are inside the /public folder.
 * ════════════════════════════════════════════════════════════════════════════
 */
import type { VideoConfig } from "../config/types";
import { themes } from "../config/theme";

export const demoVideo: VideoConfig = {
  id: "DemoVideo",
  fps: 30,
  width: 1080,
  height: 1920,
  theme: themes.nightScience,
  grain: 0.12,
  vignette: 0.5,
  music: { src: "audio/music/bed.wav", volume: 0.22, fadeInSeconds: 0.5, fadeOutSeconds: 1.5 },
  defaultTransition: { type: "whipPan", durationInSeconds: 0.35 },
  captionStyle: { mode: "punch", position: "bottom" },

  scenes: [
    // 1 ── HOOK ────────────────────────────────────────────────────────────
    {
      type: "title",
      name: "Hook",
      durationInSeconds: 3.2,
      background: { type: "starfield", color: "#0c1830", density: 1.2 },
      camera: { preset: "slowPushIn", intensity: 1.2 },
      kicker: "A tiny mystery",
      headline: "Every beach was once a *mountain*",
      orbs: [{ src: "images/orb-blue.svg" }, { src: "images/orb-amber.svg" }],
      icon: "icons/spark.svg",
      sfx: [{ sound: "riser", at: 0, volume: 0.4 }],
      captions: [
        { text: "Every beach", start: 0.2, end: 1.0 },
        { text: "was once a", start: 1.0, end: 1.6 },
        { text: "*mountain*", start: 1.6, end: 3.0 },
      ],
    },

    // 2 ── PRESENTER ───────────────────────────────────────────────────────
    {
      type: "presenter",
      name: "Host intro",
      durationInSeconds: 3.6,
      transitionIn: { type: "paperTear", durationInSeconds: 0.5 },
      background: { type: "paper", color: "#e9dcc3", textureOpacity: 0.45 },
      camera: { preset: "handheld", intensity: 1 },
      character: {
        palette: { shirt: "#2f6bff", hair: "#3a2516", skin: "#e8b48c" },
        talking: [[0.2, 3.2]],
        gesture: [[1.2, 2.4]],
        stepFrames: 2,
      },
      lowerThird: { name: "Your Host", role: "Placeholder presenter" },
      floaters: [
        { src: "images/specimen-1.svg", at: 1.3, x: 220, y: 520, size: 230, rotate: -8 },
        { src: "images/specimen-3.svg", at: 1.6, x: 860, y: 620, size: 210, rotate: 6 },
      ],
      captions: [
        { text: "Let's follow *one* grain", start: 0.2, end: 1.8 },
        { text: "all the way down", start: 1.8, end: 3.3 },
      ],
    },

    // 3 ── CUTAWAY DIAGRAM ─────────────────────────────────────────────────
    {
      type: "cutaway",
      name: "Layers",
      durationInSeconds: 5,
      transitionIn: { type: "zoomPunch", durationInSeconds: 0.4 },
      background: { type: "grid", color: "#16232c", isometric: true },
      camera: {
        keyframes: [
          { at: 0, zoom: 0.92, y: 40 },
          { at: 2.2, zoom: 1.0, y: 0, easing: "smooth" },
          { at: 4.2, zoom: 1.08, y: 40, easing: "smooth" },
        ],
      },
      title: "Inside a *hillside*",
      layers: [
        { label: "Topsoil", color: "#5e9e4a", thickness: 0.6 },
        { label: "Cracked rock", color: "#8a8d93" },
        { label: "Gravel", color: "#b39a7a" },
        { label: "Sand bed", color: "#e7c97c" },
        { label: "Bedrock", color: "#5d4b6b", thickness: 1.2 },
      ],
      props: [
        { src: "images/tree.svg", x: 470, y: 600, scale: 1 },
        { src: "images/tree.svg", x: 610, y: 640, scale: 0.8 },
      ],
      flowArrow: true,
      captions: [{ text: "Water sneaks into *cracks*", start: 2.4, end: 4.6 }],
    },

    // 4 ── B-ROLL ─────────────────────────────────────────────────────────
    {
      type: "broll",
      name: "River B-roll",
      durationInSeconds: 3,
      src: "images/broll-river.svg",
      kenBurns: { fromZoom: 1.3, toZoom: 1.05, fromY: 40, toY: -40 },
      credit: "Placeholder illustration",
      overlayText: "Rivers grind it *smaller*",
      tint: "rgba(80,140,255,0.15)",
    },

    // 5 ── COLLAGE TIMELINE ────────────────────────────────────────────────
    {
      type: "collageTimeline",
      name: "Timeline",
      durationInSeconds: 4.4,
      transitionIn: { type: "slideUp", durationInSeconds: 0.4 },
      background: { type: "starfield", color: "#101826", density: 0.8 },
      camera: { preset: "slowPushIn", intensity: 0.6 },
      topLabel: "Boulder",
      bottomLabel: "Grain of sand",
      spanLabel: "Thousands of years",
      topIcon: "images/rock-big.svg",
      bottomIcon: "images/grain.svg",
      items: [
        { src: "images/specimen-1.svg", caption: "Chunk" },
        { src: "images/specimen-2.svg", caption: "Cobble" },
        { src: "images/specimen-3.svg", caption: "Pebble" },
        { src: "images/specimen-4.svg", caption: "Gravel" },
      ],
    },

    // 6 ── PARALLAX ────────────────────────────────────────────────────────
    {
      type: "parallax",
      name: "Coast parallax",
      durationInSeconds: 3.4,
      transitionIn: { type: "iris", durationInSeconds: 0.5 },
      background: { type: "gradient", from: "#ffb36b", to: "#ff6f91", angle: 180 },
      headline: "Finally… the coast",
      travel: 520,
      layers: [
        { src: "backgrounds/sun.svg", depth: 0.05, y: 900 },
        { src: "backgrounds/hills-far.svg", depth: 0.25, y: 520 },
        { src: "backgrounds/hills-near.svg", depth: 0.55, y: 260 },
        { src: "backgrounds/beach.svg", depth: 1, y: 0 },
        { src: "backgrounds/foreground-grass.svg", depth: 1.6, y: -40 },
      ],
      sfx: [{ sound: "swoosh", at: 0.1, volume: 0.4 }],
    },

    // 7 ── COMPARISON ──────────────────────────────────────────────────────
    {
      type: "comparison",
      name: "Compare",
      durationInSeconds: 3.6,
      background: { type: "starfield", color: "#141020", density: 0.6 },
      camera: { preset: "drift" },
      top: { src: "images/sand-pile-light.svg", label: "Beach", caption: "Rounded by waves", color: "#3db8ff" },
      bottom: { src: "images/sand-pile-dark.svg", label: "Desert", caption: "Frosted by wind", color: "#ff9a3d" },
      vsText: "vs",
    },

    // 8 ── CALL TO ACTION ──────────────────────────────────────────────────
    {
      type: "cta",
      name: "CTA",
      durationInSeconds: 3,
      transitionIn: { type: "flash", durationInSeconds: 0.3 },
      background: { type: "starfield", color: "#0c1830" },
      camera: { preset: "punchIn", intensity: 0.5 },
      icon: "images/grain.svg",
      buttonText: "Follow",
      subtext: "for more tiny mysteries",
    },
  ],
};
