import idle from "./mascot-idle.png";
import success from "./mascot-success.png";
import wave from "./mascot-wave.png";
import clipboard from "./mascot-clipboard.png";
import privacy from "./mascot-privacy.png";
import sleep from "./mascot-sleep.png";

export const mascotAssets = {
  idle,
  success,
  wave,
  clipboard,
  privacy,
  sleep,
} as const;

export type MascotState = keyof typeof mascotAssets;
