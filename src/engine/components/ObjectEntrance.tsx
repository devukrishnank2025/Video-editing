/**
 * <ObjectEntrance> — animates ANY child in.
 *
 *   <ObjectEntrance type="pop" delay={0.3} duration={0.5}>
 *     <img src="…" />
 *   </ObjectEntrance>
 *
 * Types: fade, pop, slideUp/Down/Left/Right, drop, unfold, stamp, spin, wipe.
 * Optional `sfx` plays a sound exactly when the entrance starts.
 */
import React from "react";
import type { EntranceType } from "../../config/types";
import type { EasingName } from "../timeline/easing";
import { progress } from "../timeline/timing";
import { useScene } from "../SceneContext";
import { entranceStyle } from "./motion";
import { SoundEffect } from "./SoundEffect";

const DEFAULT_EASING: Partial<Record<EntranceType, EasingName>> = {
  pop: "punch",
  stamp: "punch",
  drop: "easeIn",
  unfold: "punch",
  spin: "snappy",
};

export type ObjectEntranceProps = {
  type?: EntranceType;
  delay?: number; // seconds
  duration?: number; // seconds
  easing?: EasingName;
  distance?: number;
  sfx?: string;
  sfxVolume?: number;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
};

export const ObjectEntrance: React.FC<ObjectEntranceProps> = ({
  type = "pop",
  delay = 0,
  duration = 0.5,
  easing,
  distance,
  sfx,
  sfxVolume,
  style,
  className,
  children,
}) => {
  const { frame, t } = useScene();
  const p = progress(frame, t(delay), t(duration), easing ?? DEFAULT_EASING[type] ?? "snappy");
  return (
    <div className={className} style={{ ...style, ...entranceStyle(type, p, distance) }}>
      {sfx ? <SoundEffect sound={sfx} at={delay} volume={sfxVolume} /> : null}
      {children}
    </div>
  );
};
