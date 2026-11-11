# Cutout Explainer Kit

A config-driven **Remotion + React + TypeScript** toolkit for vertical **(1080×1920, 9:16)**
explainer shorts in a layered cut-out / collage style. It includes parallax, camera
moves, kinetic labels, punch captions, isometric cutaway diagrams, grain, glow and
frame-accurate sound effects.

You make a video by editing **one config file**. You don't have to touch the animation engine.

```
text · images · characters · icons · B-roll · backgrounds · colours
audio · scene durations · camera moves · animation speed   → all in config
```

The included demo ("Where does sand come from?") uses only **original placeholder
content**. See [docs/STYLE_ANALYSIS.md](docs/STYLE_ANALYSIS.md) for the reference
breakdown and for what was and wasn't reproduced.

---

## Contents

1. [Quick start](#1-quick-start)
2. [Project structure](#2-project-structure)
3. [Development preview](#3-development-preview)
4. [Rendering the final MP4](#4-rendering-the-final-mp4)
5. [How a video config works](#5-how-a-video-config-works)
6. [Replacing assets (images, text, audio, characters)](#6-replacing-assets)
7. [Scene types reference](#7-scene-types-reference)
8. [Camera, transitions, speed & timing](#8-camera-transitions-speed--timing)
9. [Creating a new scene type](#9-creating-a-new-scene-type)
10. [Creating a completely new video](#10-creating-a-completely-new-video)
11. [Using components directly](#11-using-components-directly)
12. [Troubleshooting](#12-troubleshooting)
13. [License](#13-license)

---

## 1. Quick start

**Requirements:** [Node.js](https://nodejs.org) 18 or newer, plus Git.

```bash
git clone https://github.com/<you>/cutout-explainer-kit.git
```

```bash
cd cutout-explainer-kit
```

```bash
npm install
```

```bash
npm run dev
```

The Remotion Studio opens in your browser. Pick **DemoVideo** in the sidebar and press
space to play it.

Then:

1. Open `src/videos/demoVideo.ts` and change some text. The preview updates instantly.
2. Drop your own images or sounds into `public/` and point the config at them.
3. Render:

```bash
npm run render
```

Your video is written to `out/demo.mp4`.

---

## 2. Project structure

```
cutout-explainer-kit/
├─ package.json             scripts & dependencies
├─ tsconfig.json            TypeScript settings
├─ remotion.config.ts       render quality / codec settings
├─ public/                  ← YOUR ASSETS LIVE HERE
│  ├─ images/               cut-outs, B-roll stills, props (svg/png/jpg/webp, mp4 for video)
│  ├─ icons/                small icons (cursor, spark, lock, key…)
│  ├─ backgrounds/          parallax layers & full-frame backgrounds
│  ├─ characters/           body-part images for your own puppet
│  └─ audio/
│     ├─ sfx/               whoosh.wav, pop.wav, click.wav, …
│     └─ music/             bed.wav (music bed)
├─ scripts/
│  └─ generate-placeholders.mjs   re-creates all placeholder art & sounds
├─ docs/
│  └─ STYLE_ANALYSIS.md     technique breakdown of the reference
└─ src/
   ├─ index.ts              Remotion entry (don't edit)
   ├─ Root.tsx              registers one composition per video (don't edit)
   ├─ videos/               ← YOUR VIDEOS: one config file per video
   │  ├─ demoVideo.ts       the full demo (every scene type)
   │  ├─ starterVideo.ts    the smallest template to copy
   │  └─ index.ts           list of videos shown in the Studio
   ├─ config/
   │  ├─ types.ts           every config option, documented
   │  ├─ theme.ts           colour/font themes (nightScience, craftPaper, popCollage)
   │  └─ sfx.ts             sound-effect library (name → file)
   ├─ scenes/               scene templates built from engine components
   │  ├─ TitleScene.tsx  CutawayScene.tsx  CollageTimelineScene.tsx
   │  ├─ ComparisonScene.tsx  BrollScene.tsx  PresenterScene.tsx
   │  ├─ ParallaxLandscapeScene.tsx  CtaScene.tsx
   │  └─ registry.tsx       scene type → component map
   └─ engine/               THE ANIMATION ENGINE (reusable, content-free)
      ├─ VideoComposition.tsx   builds a whole video from a config
      ├─ SceneContext.tsx       theme / speed / timing for every component
      ├─ timeline/              easing presets, keyframes, stagger, springs, scheduling
      └─ components/
         ├─ PaperCutLayer.tsx       PaperCutCharacter.tsx   PaperBackground.tsx
         ├─ ParallaxScene.tsx       CameraMove.tsx (CameraMove, ZoomAnimation, PanAnimation)
         ├─ TextAnimation.tsx (TextAnimation, LabelCallout)  CaptionAnimation.tsx
         ├─ ImageAnimation.tsx (ImageAnimation, BrollAnimation)
         ├─ ObjectEntrance.tsx      ObjectExit.tsx          SceneTransition.tsx
         ├─ Effects.tsx (ShadowEffect, GrainEffect, Vignette, LightEffect, MotionBlur)
         ├─ SoundEffect.tsx (SoundEffect, MusicTrack)
         └─ motion.ts               entrance/exit style maths
```

**Rule of thumb:** beginners edit `src/videos/` and `public/`. Designers who want new
looks edit `src/scenes/`. The `src/engine/` folder rarely needs changing.

---

## 3. Development preview

```bash
npm run dev
```

- The sidebar lists every video in `src/videos/index.ts`.
- The timeline shows each scene as a named sequence, so you can scrub to any scene.
- Saving a file hot-reloads the preview.
- Check types (catches config typos before rendering):

```bash
npm run typecheck
```

---

## 4. Rendering the final MP4

```bash
npm run render
```

This renders `DemoVideo` to `out/demo.mp4` (H.264, CRF 18, yuv420p, ready for
Shorts, Reels and TikTok).

Render any video by its `id`:

```bash
npx remotion render src/index.ts StarterVideo out/starter.mp4
```

Useful extras:

```bash
npm run still
```
Saves a thumbnail PNG of frame 45.

```bash
npx remotion render src/index.ts DemoVideo out/draft.mp4 --scale=0.5
```
A half-resolution draft that renders about 4× faster.

```bash
npx remotion render src/index.ts DemoVideo out/clip.mp4 --frames=0-120
```
Renders only part of the video.

Quality and codec defaults live in `remotion.config.ts`. The first render downloads
a headless Chrome automatically.

---

## 5. How a video config works

A video is a plain TypeScript object (`VideoConfig`). Every option has autocomplete
and documentation. Hover over it in VS Code, or read `src/config/types.ts`.

```ts
export const myVideo: VideoConfig = {
  id: "MyVideo",                 // name in the Studio & render command
  fps: 30, width: 1080, height: 1920,
  theme: themes.nightScience,    // colours + fonts + global speed
  grain: 0.12,                   // film grain over everything (0–1)
  vignette: 0.5,                 // dark corners (0–1)
  music: { src: "audio/music/bed.wav", volume: 0.25 },
  defaultTransition: { type: "whipPan", durationInSeconds: 0.35 },
  captionStyle: { mode: "punch", position: "bottom" },

  scenes: [
    {
      type: "title",                         // which scene template
      durationInSeconds: 3,
      background: { type: "starfield" },
      camera: { preset: "slowPushIn" },
      headline: "Your *big* idea",           // *word* = accent colour
      sfx: [{ sound: "riser", at: 0 }],
      captions: [{ text: "Your big idea", start: 0.2, end: 2.8 }],
    },
    // …more scenes
  ],
};
```

- **All times are in seconds.** Inside a scene they count from the start of that scene.
- **All paths are relative to `public/`.** `"images/rock.png"` means `public/images/rock.png`.
- Total length is calculated automatically: the sum of the scene durations minus the transition overlaps.

---

## 6. Replacing assets

### Text
Edit the strings in your video config. Wrap words in `*asterisks*` to highlight them in
the theme's accent colour, for example `headline: "The *ocean* is salty"`.

### Images, icons and B-roll
1. Copy your file into `public/images/`, `public/icons/` or `public/backgrounds/`.
2. Change the path in the config, for example `src: "images/my-photo.jpg"`.

- **Cut-outs:** transparent PNG or SVG look best. The kit adds the paper border and shadow.
- **B-roll:** any image, or **video** (`.mp4` / `.webm`). Videos play muted under the Ken Burns move.
- **Keeping the file name** (for example, replacing `public/images/orb-blue.svg`) swaps the asset everywhere it's used.

### Backgrounds
```ts
background: { type: "paper", color: "#efe3c8" }
background: { type: "gradient", from: "#ffb36b", to: "#ff6f91" }
background: { type: "image", src: "backgrounds/my-bg.jpg", dim: 0.3, blur: 4 }
background: { type: "starfield", density: 1.2 }
background: { type: "grid", isometric: true }
```

### Colours and fonts
Switch theme with `theme: themes.craftPaper`, or override single colours:

```ts
theme: { ...themes.nightScience, colors: { ...themes.nightScience.colors, accent: "#ff3df2" } }
```

To change fonts, edit `src/config/theme.ts`. Replace `Anton` or `Inter` with any
[Google Font](https://www.remotion.dev/docs/google-fonts), for example
`import { loadFont } from "@remotion/google-fonts/BebasNeue"`.

### Audio
- **Sound effects:** replace files in `public/audio/sfx/`. Keep the names, or add new names in `src/config/sfx.ts`.
  Use them in any scene with `sfx: [{ sound: "pop", at: 1.2, volume: 0.8 }]`.
  Many components also play their own SFX automatically (labels tick, layers thud, transitions whoosh).
- **Music:** put your track in `public/audio/music/` and set `music: { src: "audio/music/my-song.mp3", volume: 0.3 }`.
- **Voice-over:** add it as music with `loop: false` and `volume: 1`, or add an
  `sfx` cue at `at: 0` in the first scene. Then time your `captions` to it.
- Only use audio you have the rights to.

### Characters
The `presenter` scene uses `PaperCutCharacter`. With no `parts` it draws the built-in
placeholder puppet (colours set by `palette`). To use your own character, export each
body part as a separate transparent PNG or SVG:

| Part | Canvas | Pivot (rotation point) |
|------|--------|------------------------|
| `body` | 400×420 | — |
| `head` | 240×260 | bottom-centre (neck) |
| `armLeft`, `armRight` | 90×260 | top-centre (shoulder) |
| `mouthOpen`, `mouthClosed` | 80 wide | drawn over the head at the mouth |

```ts
character: {
  parts: { body: "characters/me/body.png", head: "characters/me/head.png",
           armLeft: "characters/me/arm-l.png", armRight: "characters/me/arm-r.png",
           mouthOpen: "characters/me/mouth-o.png", mouthClosed: "characters/me/mouth-c.png" },
  talking: [[0.2, 3.0]],   // mouth flaps during these seconds
  gesture: [[1.0, 1.8]],   // right arm raises/waves
  stepFrames: 2,           // 2 = "on twos" stop-motion feel, 1 = smooth
}
```

### Regenerating the placeholders
```bash
npm run assets
```
This overwrites only the generated placeholder files.

---

## 7. Scene types reference

| `type` | What it shows | Key options |
|--------|---------------|-------------|
| `title` | Hook: kicker, headline words popping, floating orbs, stamped icon | `kicker`, `headline`, `subline`, `orbs[]`, `icon` |
| `presenter` | Cut-out puppet host, lower third, pop-in cut-outs | `character`, `lowerThird`, `floaters[]` |
| `cutaway` | Isometric block with stacked layers, labels on faces, flow arrow, props | `title`, `layers[]`, `props[]`, `flowArrow` |
| `broll` | Full-frame still or video, Ken Burns, tint, source credit, overlay text | `src`, `kenBurns`, `credit`, `tint`, `overlayText` |
| `collageTimeline` | Self-drawing arrow with cut-out cards dealt along it | `topLabel`, `bottomLabel`, `spanLabel`, `items[]`, `topIcon`, `bottomIcon` |
| `parallax` | Multi-plane landscape with depth-based travel | `layers[]` (`src`, `depth`, `y`), `travel`, `headline` |
| `comparison` | Top vs bottom with labels and a "VS" stamp | `top`, `bottom`, `vsText` |
| `cta` | Button, cursor glides in and clicks, light sweep | `buttonText`, `subtext`, `icon` |

Every scene also accepts: `durationInSeconds`, `background`, `camera`, `transitionIn`,
`sfx`, `captions`, `speed`, `grain` and `name`.

---

## 8. Camera, transitions, speed & timing

### Camera
```ts
camera: { preset: "slowPushIn" }                // static | slowPushIn | slowPullOut | punchIn
camera: { preset: "panDown", intensity: 0.5 }   // panLeft | panRight | panUp | panDown | drift | handheld
camera: { preset: "drift", shake: 0.5 }         // add hand-held shake to anything
camera: { keyframes: [                          // full control
  { at: 0,   zoom: 1 },
  { at: 0.3, zoom: 1.3, easing: "punch" },      // punch-in on a word
  { at: 3,   zoom: 1.4, x: 120, y: -60, rotate: 1, easing: "smooth" },
]}
```

### Transitions
Set on the incoming scene (`transitionIn`) or for the whole video (`defaultTransition`):
`cut`, `fade`, `slideUp`, `slideLeft`, `whipPan`, `zoomPunch`, `paperTear`, `iris`, `flash`.

```ts
transitionIn: { type: "paperTear", durationInSeconds: 0.5, sfx: "paper" }
```

### Speed
- `theme.speed` speeds up every animation in the video (1.2 = 20% faster).
- A scene's `speed` multiplies that for one scene.
- Scene **durations stay the same**. Only the animations inside get faster or slower, and SFX stay in sync.

### Easing names
`linear`, `smooth`, `snappy` (default), `punch` (overshoot), `whip`, `anticipate`, `easeIn`, `easeOut`.
They're defined in `src/engine/timeline/easing.ts`.

### Timeline utilities (`src/engine/timeline`)
| Helper | Use |
|--------|-----|
| `sec(1.5, fps)` | seconds → frames |
| `progress(frame, start, duration, easing)` | eased 0→1 value |
| `keyframes(frame, [{at, value, easing}])` | multi-step animation |
| `stagger(i, each, start)` | delay for item *i* in a group |
| `springIn(frame, fps, delay)` | physical spring 0→1 |
| `wobble(frame, speed, amount, seed)` | organic idle motion |
| `stepped(frame, 2)` | stop-motion "on twos" time |
| `seeded(n)` | deterministic random (never use `Math.random()` in Remotion) |

---

## 9. Creating a new scene type

Say you want a **"stat"** scene that shows a big number counting up.

**1. Add its config type** in `src/config/types.ts`:

```ts
export type StatScene = SceneBase & {
  type: "stat";
  value: number;
  label: string;
};
// …and add `| StatScene` to the SceneConfig union.
```

**2. Build it from engine components** in `src/scenes/StatScene.tsx`:

```tsx
import React from "react";
import type { StatScene as Cfg } from "../config/types";
import { ObjectEntrance, SoundEffect, TextAnimation } from "../engine/components";
import { useScene } from "../engine/SceneContext";
import { progress } from "../engine/timeline";

export const StatScene: React.FC<{ scene: Cfg }> = ({ scene }) => {
  const { frame, t, theme } = useScene();
  const n = Math.round(scene.value * progress(frame, t(0.2), t(1.2), "snappy"));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center" }}>
      <ObjectEntrance type="stamp" delay={0.1}>
        <div style={{ fontFamily: theme.fonts.display, fontSize: 300, color: theme.colors.accent }}>
          {n.toLocaleString()}
        </div>
      </ObjectEntrance>
      <TextAnimation text={scene.label} mode="wordStagger" delay={0.8} size={80} />
      <SoundEffect sound="ding" at={1.4} />
    </div>
  );
};
```

**3. Register it** in `src/scenes/registry.tsx`:

```ts
import { StatScene } from "./StatScene";
// …
export const SCENES = { /* … */, stat: StatScene };
```

**4. Use it** in any video:

```ts
{ type: "stat", durationInSeconds: 2.5, value: 4600000, label: "years old" }
```

Background, camera, transitions, captions, SFX and grain work automatically, because
the engine wraps every scene the same way.

---

## 10. Creating a completely new video

1. **Copy the starter:** duplicate `src/videos/starterVideo.ts` as `src/videos/myVideo.ts`.
   Rename the export to `myVideo` and set `id: "MyVideo"`.
2. **Register it** in `src/videos/index.ts`:
   ```ts
   import { myVideo } from "./myVideo";
   export const VIDEOS = [demoVideo, starterVideo, myVideo];
   ```
3. **Write your script as scenes.** Aim for one idea per scene, usually 2–4 seconds each.
   Copy scene blocks from `demoVideo.ts` for any type you need.
4. **Add assets** to `public/` and reference them by path.
5. **Record your voice-over**, add it (see [Audio](#audio)) and set the `captions` timings.
6. **Preview** with `npm run dev`, pick *MyVideo*, then tweak durations, camera and transitions.
7. **Render** your video:

```bash
npx remotion render src/index.ts MyVideo out/my-video.mp4
```

Pacing tips for this style:
- Change *something* every 1–2 seconds: a label, a zoom or a new cut-out.
- Always give the camera a slow move. Save `punchIn` for the key word.
- Put a sound on every visual event, quiet under the voice.
- Keep text inside the middle ~80% of the frame. Platform UI covers the top and bottom.

---

## 11. Using components directly

Every engine component works on its own inside any scene:

```tsx
<CameraMove preset="slowPushIn">
  <PaperBackground config={{ type: "paper" }} />
  <ParallaxScene travelX={400}>
    <ParallaxLayer depth={0.2}><Img src={staticFile("backgrounds/hills-far.svg")} /></ParallaxLayer>
    <ParallaxLayer depth={1}><Img src={staticFile("backgrounds/beach.svg")} /></ParallaxLayer>
  </ParallaxScene>
  <ImageAnimation src="images/grain.svg" x={540} y={900} width={300}
                  entrance={{ type: "drop", delay: 0.4 }} paper="cutout" float />
  <LabelCallout text="One grain" x={600} y={900} dx={160} dy={-120} delay={0.9} />
  <ObjectExit type="flyAway" at={2.4}>
    <TextAnimation text="*Tiny* but ancient" mode="letterStagger" />
  </ObjectExit>
  <ShadowEffect lift={0.6}>…</ShadowEffect>
  <LightEffect type="sweep" start={1} />
  <MotionBlur vx={30}>…</MotionBlur>
  <GrainEffect opacity={0.15} />
  <SoundEffect sound="whoosh" at={0.3} />
</CameraMove>
```

Inside a scene, `useScene()` gives you `{ frame, t, fps, theme, speed, width, height }`.

---

## 12. Troubleshooting

| Problem | Fix |
|---------|-----|
| Image doesn't show | The path is relative to `public/`. Don't start it with `/` or `public/`. |
| `Unknown scene type` | Register the scene in `src/scenes/registry.tsx`. |
| Type error in config | Run `npm run typecheck`. The message names the wrong field. |
| Render fails with `spawn … chrome-headless-shell.exe ENOENT` (Windows) | The project path is too long (Windows' 260-character limit). Move the project to a short path like `C:\dev\cutout-explainer-kit`, or pass `--browser-executable=<path to a Chrome/Chromium>`. |
| Render is slow | Use `--scale=0.5` for drafts, or lower the grain. SVG filters are the most expensive part. |
| Audio out of sync after changing `speed` | SFX placed with `SoundEffect`/`sfx` follow speed automatically. Music doesn't change speed (that's intended). |

---

## 13. License

The code is released under the MIT license (see `LICENSE`). The placeholder art and
sounds are generated by `scripts/generate-placeholders.mjs` and are also MIT. Any assets
you add are your responsibility. Only use images, footage, fonts and audio you have
the rights to.
