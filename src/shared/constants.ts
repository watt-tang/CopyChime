import { AppSettings } from "./types";

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  privacyMode: false,
  saveHistoryInPrivacyMode: false,
  paused: false,
  launchAtStartup: false,
  historyLimit: 10,
  autoHideDelayMs: 4000,
  maxStoredTextLength: 5000,
  enableHistoryPersistence: true,
  ignorePatterns: "",
  maskSensitiveContent: true,
  showMascot: true,
  soundFeedback: "chime",
  soundVolume: 0.35,
  quickPasteLimit: 9,
  quickPasteAutoPaste: true,
  quickPasteSearchFavorites: true,
  pastePlainTextByDefault: false,
  appExclusionRules: [],
};

export const LIMITS = {
  historyLimit: { min: 5, max: 50 },
  autoHideDelayMs: { min: 500, max: 10000 },
  maxStoredTextLength: { min: 500, max: 50000 },
  soundVolume: { min: 0, max: 1 },
  quickPasteLimit: { min: 5, max: 20 },
};

export const BUBBLE_WIDTH = 380;
export const BUBBLE_HEIGHT = 150;
export const PANEL_WIDTH = 380;
export const PANEL_HEIGHT = 520;
export const QUICK_PASTE_WIDTH = 420;
export const QUICK_PASTE_HEIGHT = 480;
export const MARGIN = 16;
export const POLL_INTERVAL_MS = 300;
export const PREVIEW_MAX_LENGTH = 200;
export const STORE_FILE_NAME = "copychime-store.json";
export const MAX_FAVORITES = 100;
