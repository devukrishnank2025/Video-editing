// Remotion CLI configuration — applies to `npm run dev` and `npm run render`.
// Docs: https://www.remotion.dev/docs/config
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
// Lower CRF = higher quality / bigger file. 18 is visually lossless for social uploads.
Config.setCrf(18);
Config.setPixelFormat("yuv420p"); // maximum compatibility (Instagram, TikTok, YouTube)
Config.setOverwriteOutput(true);
// Use more CPU cores while rendering. Set a number (e.g. 4) if your machine gets hot.
Config.setConcurrency(null);
