/**
 * Every video listed here appears in the Studio sidebar and can be rendered
 * with `npx remotion render src/index.ts <id> out/<id>.mp4`.
 * To add a video: create src/videos/myVideo.ts and add it to this list.
 */
import type { VideoConfig } from "../config/types";
import { demoVideo } from "./demoVideo";
import { starterVideo } from "./starterVideo";

export const VIDEOS: VideoConfig[] = [demoVideo, starterVideo];
