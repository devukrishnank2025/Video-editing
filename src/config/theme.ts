/**
 * Ready-made themes. Copy one into your video config (`theme: themes.nightScience`)
 * or spread & override: `theme: { ...themes.nightScience, colors: { ...themes.nightScience.colors, accent: "#ff00aa" } }`.
 */
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import type { Theme } from "./types";

// Fonts are loaded once here. Swap Anton/Inter for any font from
// https://www.remotion.dev/docs/google-fonts — or a local font (see README).
const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
const inter = loadInter("normal", { weights: ["500", "700", "800"], subsets: ["latin"] });

export const FONTS = {
  display: anton.fontFamily,
  body: inter.fontFamily,
};

export const themes = {
  /** Dark space / science look with a neon-lime accent. */
  nightScience: {
    colors: {
      background: "#07090f",
      paper: "#f4efe4",
      ink: "#0b0d12",
      text: "#ffffff",
      accent: "#c6ff3d",
      accent2: "#3db8ff",
      warm: "#ff5a1f",
      cool: "#2fa8ff",
    },
    fonts: FONTS,
    speed: 1,
  },
  /** Warm craft-paper look. */
  craftPaper: {
    colors: {
      background: "#e9dcc3",
      paper: "#fffaf0",
      ink: "#2b211a",
      text: "#2b211a",
      accent: "#ff4d2e",
      accent2: "#2e7dff",
      warm: "#ff8a1f",
      cool: "#2bb3a3",
    },
    fonts: FONTS,
    speed: 1,
  },
  /** Bright pop-collage look. */
  popCollage: {
    colors: {
      background: "#1d1b4b",
      paper: "#ffffff",
      ink: "#111111",
      text: "#ffffff",
      accent: "#ffe03d",
      accent2: "#ff4fa3",
      warm: "#ff6b3d",
      cool: "#3dd9ff",
    },
    fonts: FONTS,
    speed: 1.1,
  },
} satisfies Record<string, Theme>;
