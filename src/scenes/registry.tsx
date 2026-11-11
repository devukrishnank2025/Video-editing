/**
 * SCENE REGISTRY — maps a scene `type` (used in video configs) to the React
 * component that draws it.
 *
 * Adding a new scene type? (full walkthrough in README → "Creating a new scene")
 *   1. Add its config type to src/config/types.ts and to the SceneConfig union.
 *   2. Create src/scenes/MyScene.tsx.
 *   3. Register it below.
 */
import React from "react";
import type { SceneConfig, SceneType } from "../config/types";
import { BrollScene } from "./BrollScene";
import { CollageTimelineScene } from "./CollageTimelineScene";
import { ComparisonScene } from "./ComparisonScene";
import { CtaScene } from "./CtaScene";
import { CutawayScene } from "./CutawayScene";
import { ParallaxLandscapeScene } from "./ParallaxLandscapeScene";
import { PresenterScene } from "./PresenterScene";
import { TitleScene } from "./TitleScene";

type SceneComponent<T extends SceneType> = React.FC<{ scene: Extract<SceneConfig, { type: T }> }>;

export const SCENES: { [K in SceneType]: SceneComponent<K> } = {
  title: TitleScene,
  cutaway: CutawayScene,
  collageTimeline: CollageTimelineScene,
  comparison: ComparisonScene,
  broll: BrollScene,
  presenter: PresenterScene,
  parallax: ParallaxLandscapeScene,
  cta: CtaScene,
};

export const renderSceneBody = (scene: SceneConfig) => {
  const Component = SCENES[scene.type] as React.FC<{ scene: SceneConfig }>;
  if (!Component) throw new Error(`Unknown scene type "${scene.type}". Did you register it in src/scenes/registry.tsx?`);
  return <Component scene={scene} />;
};
