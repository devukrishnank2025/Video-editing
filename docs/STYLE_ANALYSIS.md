# Style analysis: what the kit learned from the reference

This kit was designed by studying the **animation language** of a short-form
science explainer (vertical, about 60 seconds). It used that video only as a reference for
*technique*. The repository contains **none** of its script, presenter, artwork,
footage, branding, music or wording.

> Method: frames were sampled every few seconds while the video played. Audio
> and exact frame timings were not measured, so the sound-design and timing
> notes below describe common practice for this genre and are not a measurement of that video.

---

## 1. Breakdown of the reference's techniques

| # | Aspect | What the reference does (in general terms) |
|---|--------|--------------------------------------------------|
| 1 | **Overall visual style** | Fast "host + visuals" science explainer. It cuts between a presenter on camera and dense explanatory visuals: 3D-style diagrams, planet renders, maps and archival clips. The look is dark and high-contrast with one neon accent colour. |
| 2 | **Paper-cut / collage / 2D / 3D / mixed media** | Mixed media. Isometric "cutaway" 3D diagrams, rendered planets, real footage, and **flat photo cut-outs** (white-bordered prints with drop shadows) laid over a starfield like a collage. |
| 3 | **Character animation** | The "character" is a real presenter, filmed and cut on emphasis. There is no puppet rig, so the kit gives you an original cut-out puppet as the reusable equivalent. |
| 4 | **Layering & depth** | Strong foreground/background separation. Objects float over dark or blurred plates, glows sit behind hero objects, and drop shadows lift cut-outs off the background. |
| 5 | **Parallax** | Implied depth from layered elements and 3D renders moving at different rates. |
| 6 | **Camera movement** | Constant subtle motion: slow push-ins on diagrams, drifting over terrain, punch-ins on key moments. The camera is almost never fully still. |
| 7 | **Zoom in / out** | Slow continuous push-in during explanation, and quick punch-in zooms for emphasis. |
| 8 | **Pan / tracking** | Lateral and vertical tracking across landscapes and maps. Vertical pans suit the 9:16 frame. |
| 9 | **Text & typography** | Heavy condensed **uppercase** labels with thick outlines or glows, in colours keyed to meaning (cool blue vs. warm orange vs. neon accent). Labels sit **on** diagram faces in perspective. Bold punch-word captions sit low in the frame. A small "SOURCE:" credit appears in a corner on footage. |
| 10 | **Image & B-roll** | Full-bleed B-roll with slow Ken Burns moves. Stills become cut-outs placed along a timeline arrow. |
| 11 | **Entrances / exits** | Icons stamp or pop in with overshoot. Arrows draw themselves. Labels wipe or pop. Cut-outs slide in like dealt cards. |
| 12 | **Scene transitions** | Mostly hard cuts on the beat, plus fast whip/slide moves. A new visual arrives roughly every 1–3 seconds. |
| 13 | **Motion blur & VFX** | Directional blur on fast moves, glow and bloom on accent elements, and glowing arrows. |
| 14 | **Lighting & shadow** | Rim light and glow around planets and spheres, soft contact shadows under diagrams, and a neon glow on accent graphics. |
| 15 | **Texture & grain** | Light film grain and noise, plus texture inside the diagram layers (strata lines). |
| 16 | **Timing & easing** | Snappy ease-out entrances, overshoot on icons, and slow linear drifts underneath. Fast, beat-driven pacing. |
| 17 | **SFX sync** | Typical for the genre: whooshes on moves, pops and ticks on labels, thuds on impacts, a click on the CTA and a music bed underneath. |
| 18 | **Background treatment** | Starfields, dark gradients, an isometric grid "floor" under diagrams, and full-frame footage. |
| 19 | **Composition & aspect ratio** | 1080×1920 (9:16). Subjects are centred and stacked vertically (top vs. bottom comparisons), with clear safe zones for platform UI at the top and bottom. |
| 20 | **Scene construction** | Each beat stacks background → hero visual → labels and arrows → captions → grain, with a camera move over the whole stack and SFX on every visual event. |

---

## 2. How each technique maps to the kit

| Technique | Where it lives |
|-----------|----------------|
| Layered stack (bg → world → captions → grain) | `engine/VideoComposition.tsx` (`SceneShell`) |
| Cut-out prints with border, rough edge and shadow | `PaperCutLayer` |
| Puppet character (original design) | `PaperCutCharacter` |
| Starfield, grid floor, paper and gradient backgrounds | `PaperBackground` |
| Multi-plane parallax | `ParallaxScene`, `ParallaxLayer`, scene type `parallax` |
| Camera presets, keyframes and handheld shake | `CameraMove`, `ZoomAnimation`, `PanAnimation` |
| Outlined uppercase labels, word stagger, glow | `TextAnimation` |
| Labels drawn on isometric faces | scene type `cutaway` (skewY trick) |
| Self-drawing leader-line labels | `LabelCallout` |
| Punch-word captions | `CaptionAnimation` |
| Ken Burns B-roll, tint, "SOURCE:" credit | `BrollAnimation`, scene type `broll` |
| Pop, stamp, drop, unfold and wipe entrances | `ObjectEntrance`, `engine/components/motion.ts` |
| Fly-away, shrink and wipe exits | `ObjectExit` |
| Whip-pan, zoom-punch, slide, paper-tear, iris and flash transitions | `SceneTransition` |
| Directional motion blur | `MotionBlur`, plus built into `whipPan` |
| Glow, light sweep and rim light | `LightEffect` |
| Contact and floating shadows | `ShadowEffect` |
| Film grain and vignette | `GrainEffect`, `Vignette` |
| Easing presets, keyframes, stagger, springs, stepped time | `engine/timeline/*` |
| Frame-accurate SFX and music bed | `SoundEffect`, `MusicTrack`, `config/sfx.ts` |
| Timeline arrow with dealt cut-outs | scene type `collageTimeline` |
| Top-vs-bottom comparison | scene type `comparison` |
| Button and cursor CTA | scene type `cta` |

---

## 3. What was reproduced, and what was deliberately not copied

### Reproduced as general, reusable techniques
- The **layer stack** of a short explainer scene, and the habit of keeping the camera always moving.
- **Isometric cutaway diagrams** with labels on the faces, as a generic parametric component (any layers, any colours).
- **Cut-out print collage** (white border, shadow, slight rotation and wobble).
- **Outlined, condensed uppercase labels** and colour-coding by meaning.
- **Self-drawing glowing arrows** and timeline layouts.
- **Punch-in zooms, slow push-ins, vertical pans and whip transitions.**
- **Stacked top/bottom comparison** composition for 9:16.
- **Burned-in punch captions**, a **source credit** line, a **CTA button with a cursor click**, and **grain, vignette and glow** finishing.
- **SFX-on-every-event** sound design, as a reusable library with placeholder sounds.

### Intentionally NOT copied
- **Script and wording**, including the topic, narration, on-screen sentences and labels. The demo uses an original topic ("where sand comes from") with original text.
- **The presenter**, their likeness, voice and footage. The kit uses an original cartoon puppet instead.
- **All artwork and footage**: the specific diagrams, planet renders, maps, archival clips, icons and fossil photos. Every placeholder is a newly drawn flat SVG.
- **Branding**: channel name, logo, colours as a brand identity, subscribe-button design and any watermark. The kit's lime accent is one of several selectable themes and can be changed in one line.
- **Music and sound effects**. All audio is synthesised from code (`scripts/generate-placeholders.mjs`).
- **The exact edit**: shot order, timing and beat structure.
