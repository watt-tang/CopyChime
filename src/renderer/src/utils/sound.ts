import { AppSettings } from "../../../shared/types";

let audioCtx: AudioContext | null = null;
let unlocked = false;

function getCtx(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new AudioContext();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

export function unlockAudio(): void {
  if (unlocked) return;
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  unlocked = true;
}

function playChime(volume: number): void {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume * 0.5, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.setValueAtTime(1108, now + 0.08);
  osc.frequency.setValueAtTime(1320, now + 0.16);
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + 0.35);

  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1320, now + 0.16);
  const gain2 = ctx.createGain();
  gain2.connect(ctx.destination);
  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(volume * 0.3, now + 0.16);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc2.connect(gain2);
  osc2.start(now + 0.16);
  osc2.stop(now + 0.4);
}

function playMeow(volume: number): void {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.2;
  const gain = ctx.createGain();
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.02);
  gain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.linearRampToValueAtTime(900, now + 0.04);
  osc.frequency.linearRampToValueAtTime(700, now + 0.1);
  osc.frequency.linearRampToValueAtTime(500, now + duration);
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + duration);
}

export function playCopySound(settings: AppSettings): void {
  if (settings.soundFeedback === "off") return;
  const volume = Math.max(0, Math.min(1, settings.soundVolume));
  if (volume <= 0) return;

  try {
    if (settings.soundFeedback === "chime") {
      playChime(volume);
    } else if (settings.soundFeedback === "meow") {
      playMeow(volume);
    }
  } catch {
    // Silently ignore audio errors
  }
}
