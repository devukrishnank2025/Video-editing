/**
 * STARTER VIDEO — the smallest useful config. Copy this file to start a
 * brand-new video (see README → "Creating a completely new video").
 */
import type { VideoConfig } from "../config/types";
import { themes } from "../config/theme";

export const starterVideo: VideoConfig = {
  id: "StarterVideo",
  fps: 30,
  width: 1080,
  height: 1920,
  theme: themes.craftPaper,
  defaultTransition: { type: "slideUp", durationInSeconds: 0.4 },
  scenes: [
    {
      type: "title",
      durationInSeconds: 3,
      background: { type: "paper" },
      camera: { preset: "slowPushIn" },
      kicker: "Your series name",
      headline: "Your *big* question here",
      subline: "A short line that sets up the answer.",
    },
    {
      type: "presenter",
      durationInSeconds: 3.5,
      background: { type: "paper", color: "#f3e7cf" },
      character: { talking: [[0.2, 3.2]], gesture: [[1, 2]] },
      lowerThird: { name: "Your Name" },
      captions: [{ text: "Replace these *captions*", start: 0.2, end: 3.2 }],
    },
    {
      type: "cta",
      durationInSeconds: 2.6,
      background: { type: "paper" },
      buttonText: "Subscribe",
      subtext: "Thanks for watching!",
    },
  ],
};
