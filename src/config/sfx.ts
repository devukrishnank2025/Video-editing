/**
 * SFX LIBRARY
 * Short names → files in /public. Use the names anywhere a sound is expected:
 *   sfx: [{ sound: "pop", at: 0.4 }]
 * Replace the files in public/audio/sfx with your own (keep the names), or add
 * new entries here. You can also pass a path directly: { sound: "audio/sfx/my.wav" }.
 *
 * The included sounds are synthesised placeholders (see scripts/generate-placeholders.mjs).
 */
export const SFX_LIBRARY: Record<string, string> = {
  whoosh: "audio/sfx/whoosh.wav",
  swoosh: "audio/sfx/swoosh.wav",
  pop: "audio/sfx/pop.wav",
  click: "audio/sfx/click.wav",
  paper: "audio/sfx/paper.wav",
  thud: "audio/sfx/thud.wav",
  riser: "audio/sfx/riser.wav",
  ding: "audio/sfx/ding.wav",
  tick: "audio/sfx/tick.wav",
};

export const resolveSound = (nameOrPath: string) => SFX_LIBRARY[nameOrPath] ?? nameOrPath;
