#!/usr/bin/env node
/**
 * Generates ORIGINAL placeholder assets so the demo works out of the box:
 *   • flat "paper" SVG illustrations in public/images, icons, backgrounds
 *   • synthesised sound effects + a music loop as WAV in public/audio
 *
 * Run: npm run assets   (safe to re-run; it overwrites only these files)
 * Replace any file with your own — keep the same name, or change the path in
 * your video config.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const out = (rel, data) => {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, data);
  console.log("  wrote", rel);
};
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;
const INK = "#15110d";

/* ─────────────────────────────── IMAGES ─────────────────────────────── */

const orb = (c1, c2, c3) =>
  svg(600, 600, `
  <defs>
    <radialGradient id="g" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="${c1}"/><stop offset=".6" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></radialGradient>
    <clipPath id="c"><circle cx="300" cy="300" r="270"/></clipPath>
  </defs>
  <circle cx="300" cy="300" r="270" fill="url(#g)"/>
  <g clip-path="url(#c)" opacity=".35" fill="${c3}">
    <path d="M40 220 Q160 160 260 230 T520 200 L560 260 Q420 300 300 270 T40 290Z"/>
    <path d="M60 380 Q200 330 320 390 T560 360 L560 420 Q400 460 280 420 T60 450Z"/>
  </g>
  <ellipse cx="210" cy="190" rx="80" ry="40" fill="#fff" opacity=".25" transform="rotate(-30 210 190)"/>
  <circle cx="300" cy="300" r="270" fill="none" stroke="${INK}" stroke-width="10"/>`);

out("images/orb-blue.svg", orb("#9fe0ff", "#2f7fd6", "#123a73"));
out("images/orb-amber.svg", orb("#ffe29a", "#e99a3a", "#7a3b12"));

const specimenShapes = [
  // irregular chunk
  `<path d="M60 250 L90 110 L190 60 L300 90 L340 200 L290 300 L150 320 Z" fill="#9a8f86" stroke="${INK}" stroke-width="8"/><path d="M120 150 L200 120 L260 170" stroke="${INK}" stroke-width="5" fill="none" opacity=".5"/>`,
  // cobble
  `<ellipse cx="200" cy="200" rx="150" ry="115" fill="#b0a08e" stroke="${INK}" stroke-width="8"/><path d="M90 180 Q200 140 300 190" stroke="${INK}" stroke-width="5" fill="none" opacity=".4"/>`,
  // pebble
  `<ellipse cx="200" cy="200" rx="110" ry="80" fill="#c9b49a" stroke="${INK}" stroke-width="8"/><ellipse cx="170" cy="175" rx="35" ry="16" fill="#fff" opacity=".35"/>`,
  // gravel cluster
  `<circle cx="140" cy="200" r="55" fill="#b9a58c" stroke="${INK}" stroke-width="7"/><circle cx="250" cy="170" r="45" fill="#a6927b" stroke="${INK}" stroke-width="7"/><circle cx="240" cy="270" r="40" fill="#cbb699" stroke="${INK}" stroke-width="7"/>`,
];
specimenShapes.forEach((shape, i) =>
  out(`images/specimen-${i + 1}.svg`, svg(400, 400, `<rect width="400" height="400" fill="${["#e9f1f7", "#f7efe2", "#eef7e9", "#f6e9ef"][i]}"/>${shape}`)),
);

out("images/rock-big.svg", svg(400, 360, `<path d="M30 320 L70 140 L170 50 L300 80 L370 210 L340 320 Z" fill="#8c8f97" stroke="${INK}" stroke-width="10"/><path d="M170 50 L190 180 L300 80 M190 180 L70 140 M190 180 L230 320" stroke="${INK}" stroke-width="6" fill="none" opacity=".45"/>`));
out("images/grain.svg", svg(400, 400, `<path d="M200 50 Q330 70 345 200 Q350 330 210 350 Q70 360 55 220 Q50 70 200 50Z" fill="#f1cf79" stroke="${INK}" stroke-width="12"/><ellipse cx="160" cy="140" rx="55" ry="25" fill="#fff" opacity=".5" transform="rotate(-25 160 140)"/><circle cx="240" cy="250" r="10" fill="#c99a3a"/><circle cx="150" cy="260" r="7" fill="#c99a3a"/>`));
out("images/tree.svg", svg(200, 300, `<rect x="88" y="170" width="24" height="120" fill="#6b4a2b" stroke="${INK}" stroke-width="6"/><path d="M100 20 L175 190 L25 190 Z" fill="#3f9a4a" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M100 70 L150 170 L50 170Z" fill="#57b55f" opacity=".6"/>`));
const pile = (top, mid, bottom) =>
  svg(600, 420, `<path d="M20 400 Q150 120 300 90 Q450 120 580 400 Z" fill="${mid}" stroke="${INK}" stroke-width="10"/><path d="M120 300 Q300 150 480 300" stroke="${bottom}" stroke-width="18" fill="none" opacity=".5"/><path d="M200 200 Q300 120 400 200" stroke="${top}" stroke-width="14" fill="none" opacity=".7"/>${Array.from({ length: 40 }, (_, i) => `<circle cx="${80 + ((i * 97) % 440)}" cy="${200 + ((i * 53) % 190)}" r="${3 + (i % 3)}" fill="${bottom}" opacity=".6"/>`).join("")}`);
out("images/sand-pile-light.svg", pile("#fff6d6", "#f0d58e", "#b8964a"));
out("images/sand-pile-dark.svg", pile("#ffd2a1", "#d98b4a", "#8a4a1f"));

out("images/broll-river.svg", svg(1080, 1920, `
  <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd3ff"/><stop offset="1" stop-color="#e6f6ff"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="url(#s)"/>
  <path d="M0 700 L260 420 L470 640 L700 360 L1080 720 L1080 1920 L0 1920Z" fill="#6f7e8c"/>
  <path d="M0 900 Q300 760 540 880 T1080 860 L1080 1920 L0 1920Z" fill="#5d8f4e"/>
  <path d="M420 880 Q520 1100 380 1300 T520 1920 L860 1920 Q700 1600 820 1300 T560 880Z" fill="#3b8fd9"/>
  <path d="M470 1000 Q540 1150 450 1300 M640 1450 Q560 1650 650 1850" stroke="#bfe6ff" stroke-width="14" fill="none" stroke-linecap="round" opacity=".7"/>
  ${Array.from({ length: 26 }, (_, i) => `<ellipse cx="${380 + ((i * 131) % 420)}" cy="${1000 + ((i * 211) % 900)}" rx="${10 + (i % 4) * 5}" ry="${7 + (i % 3) * 3}" fill="#c9b49a" stroke="${INK}" stroke-width="3"/>`).join("")}`));

/* ─────────────────────────────── ICONS ─────────────────────────────── */

out("icons/spark.svg", svg(300, 300, `<path d="M150 10 L180 120 L290 150 L180 180 L150 290 L120 180 L10 150 L120 120Z" fill="#c6ff3d" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>`));
out("icons/cursor.svg", svg(120, 160, `<path d="M10 10 L10 130 L42 100 L66 150 L88 140 L64 92 L108 90 Z" fill="#fff" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`));
out("icons/lock.svg", svg(240, 300, `<path d="M60 130 V90 A60 60 0 0 1 180 90 V130" fill="none" stroke="#c6ff3d" stroke-width="26"/><rect x="30" y="125" width="180" height="150" rx="20" fill="#c6ff3d" stroke="${INK}" stroke-width="8"/><circle cx="120" cy="195" r="18" fill="${INK}"/>`));
out("icons/key.svg", svg(300, 160, `<circle cx="70" cy="80" r="55" fill="none" stroke="#c6ff3d" stroke-width="26"/><path d="M125 80 H280 M230 80 V125 M265 80 V115" stroke="#c6ff3d" stroke-width="26" stroke-linecap="round"/>`));

/* ──────────────────────── PARALLAX BACKGROUNDS ──────────────────────── */

const W = 1620;
out("backgrounds/sun.svg", svg(W, 500, `<circle cx="${W / 2}" cy="250" r="200" fill="#fff1b8" opacity=".95"/><circle cx="${W / 2}" cy="250" r="240" fill="#fff1b8" opacity=".25"/>`));
out("backgrounds/hills-far.svg", svg(W, 700, `<path d="M0 300 Q200 120 420 260 T860 200 T1300 240 T${W} 180 V700 H0Z" fill="#b5689a"/>`));
out("backgrounds/hills-near.svg", svg(W, 800, `<path d="M0 360 Q260 180 520 330 T1040 290 T${W} 330 V800 H0Z" fill="#7d4b8a" stroke="${INK}" stroke-width="6"/>`));
out("backgrounds/beach.svg", svg(W, 800, `<rect y="120" width="${W}" height="260" fill="#3aa7d8"/><path d="M0 200 Q200 170 400 200 T800 200 T1200 200 T${W} 200" stroke="#bfeaff" stroke-width="10" fill="none"/><path d="M0 380 Q400 300 810 360 T${W} 330 V800 H0Z" fill="#f1d38a" stroke="${INK}" stroke-width="6"/>`));
out("backgrounds/foreground-grass.svg", svg(W, 400, Array.from({ length: 70 }, (_, i) => { const x = i * 24; const h = 120 + ((i * 37) % 160); return `<path d="M${x} 400 Q${x + 8} ${400 - h / 2} ${x + 18} ${400 - h} Q${x + 14} ${400 - h / 2} ${x + 22} 400Z" fill="${i % 2 ? "#2f6b3a" : "#3d8a49"}"/>`; }).join("")));

/* ─────────────────────────────── AUDIO ─────────────────────────────── */

const SR = 44100;
/** Encode Float32 samples (-1..1) as 16-bit mono WAV. */
const wav = (samples) => {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), 44 + i * 2));
  return buf;
};
let rng = 12345;
const noise = () => { rng = (rng * 1103515245 + 12345) & 0x7fffffff; return (rng / 0x7fffffff) * 2 - 1; };
const make = (seconds, fn) => Array.from({ length: Math.floor(seconds * SR) }, (_, i) => fn(i / SR, i));
/** Simple one-pole low-pass with a time-varying cutoff (0..1). */
const filtered = (seconds, cutoff, amp) => { let y = 0; return make(seconds, (t) => { const a = cutoff(t); y += a * (noise() - y); return y * amp(t); }); };
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));

out("audio/sfx/whoosh.wav", wav(filtered(0.45, (t) => 0.02 + 0.25 * Math.sin((t / 0.45) * Math.PI), (t) => Math.sin((t / 0.45) * Math.PI) ** 2 * 2.2)));
out("audio/sfx/swoosh.wav", wav(filtered(0.3, (t) => 0.05 + 0.4 * (t / 0.3), (t) => Math.sin((t / 0.3) * Math.PI) * 1.8)));
out("audio/sfx/pop.wav", wav(make(0.15, (t) => Math.sin(2 * Math.PI * (900 - t * 3500) * t) * env(t, 0.003, 0.035) * 0.8)));
out("audio/sfx/click.wav", wav(make(0.06, (t) => (noise() * 0.6 + Math.sin(2 * Math.PI * 2400 * t) * 0.4) * env(t, 0.0005, 0.008))));
out("audio/sfx/tick.wav", wav(make(0.05, (t) => Math.sin(2 * Math.PI * 1800 * t) * env(t, 0.001, 0.01) * 0.6)));
out("audio/sfx/paper.wav", wav(filtered(0.25, () => 0.6, (t) => (0.5 + 0.5 * Math.sin(t * 180)) * env(t, 0.01, 0.07) * 1.2)));
out("audio/sfx/thud.wav", wav(make(0.35, (t) => (Math.sin(2 * Math.PI * (90 - t * 120) * t) * 0.9 + noise() * 0.15 * env(t, 0.001, 0.02)) * env(t, 0.002, 0.09))));
out("audio/sfx/riser.wav", wav(make(1.6, (t) => (Math.sin(2 * Math.PI * (200 + t * t * 300) * t) * 0.25 + noise() * 0.1) * (t / 1.6) ** 2 * (t > 1.5 ? (1.6 - t) * 10 : 1))));
out("audio/sfx/ding.wav", wav(make(1.0, (t) => (Math.sin(2 * Math.PI * 1320 * t) * 0.5 + Math.sin(2 * Math.PI * 1980 * t) * 0.25) * env(t, 0.002, 0.25) * 0.6)));

// Music bed: 8-second loop, 110 BPM, soft plucked arpeggio + sub bass + light hats.
const bpm = 110, beat = 60 / bpm, loopLen = 8 * (beat * 2) / 2 * 2; // = 8.727s (4 bars of 4/4)
const chords = [[220, 261.6, 329.6], [196, 246.9, 293.7], [174.6, 220, 261.6], [196, 246.9, 329.6]];
out("audio/music/bed.wav", wav(make(loopLen, (t) => {
  const bar = Math.floor(t / (beat * 4)) % 4;
  const step = Math.floor(t / (beat / 2));
  const tn = t % (beat / 2);
  const note = chords[bar][step % 3] * (step % 6 >= 3 ? 2 : 1);
  const pluck = Math.sin(2 * Math.PI * note * t) * Math.exp(-tn * 9) * 0.22;
  const tb = t % beat;
  const bass = Math.sin(2 * Math.PI * (chords[bar][0] / 2) * t) * Math.exp(-tb * 3) * 0.28;
  const hat = step % 2 === 1 ? noise() * Math.exp(-tn * 60) * 0.06 : 0;
  // fade the loop edges a few ms so it loops without clicks
  const edge = Math.min(1, t / 0.01, (loopLen - t) / 0.01);
  return (pluck + bass + hat) * edge;
})));

console.log("\nPlaceholder assets ready in /public");
