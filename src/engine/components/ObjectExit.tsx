/**
 * <ObjectExit> — animates ANY child out at a given time.
 *
 *   <ObjectExit type="flyAway" at={2.5}>
 *     <ObjectEntrance type="pop">…</ObjectEntrance>
 *   </ObjectExit>
 */
import React from "react";
import type { ExitType } from "../../config/types";
import type { EasingName } from "../timeline/easing";
import { progress } from "../timeline/timing";
import { useScene } from "../SceneContext";
import { exitStyle } from "./motion";
import { SoundEffect } from "./SoundEffect";

export type ObjectExitProps = {
  type?: ExitType;
  at: number; // seconds
  duration?: number;
  easing?: EasingName;
  distance?: number;
  sfx?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export const ObjectExit: React.FC<ObjectExitProps> = ({
  type = "fade",
  at,
  duration = 0.35,
  easing = "easeIn",
  distance,
  sfx,
  style,
  children,
}) => {
  const { frame, t } = useScene();
  const p = progress(frame, t(at), t(duration), easing);
  return (
    <div style={{ ...style, ...exitStyle(type, p, distance) }}>
      {sfx ? <SoundEffect sound={sfx} at={at} /> : null}
      {children}
    </div>
  );
};
