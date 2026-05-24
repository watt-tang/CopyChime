import { app } from "electron";
import { AppSettings } from "../shared/types";
import { DEFAULT_SETTINGS, LIMITS } from "../shared/constants";
import { getSettings, setSettings } from "./store";

export function getClampedSettings(): AppSettings {
  const s = getSettings();
  s.historyLimit = clamp(s.historyLimit, LIMITS.historyLimit.min, LIMITS.historyLimit.max);
  s.autoHideDelayMs = clamp(s.autoHideDelayMs, LIMITS.autoHideDelayMs.min, LIMITS.autoHideDelayMs.max);
  s.maxStoredTextLength = clamp(s.maxStoredTextLength, LIMITS.maxStoredTextLength.min, LIMITS.maxStoredTextLength.max);
  s.soundVolume = clamp(s.soundVolume, LIMITS.soundVolume.min, LIMITS.soundVolume.max);
  s.quickPasteLimit = clamp(s.quickPasteLimit, LIMITS.quickPasteLimit.min, LIMITS.quickPasteLimit.max);
  return s;
}

export function updateSettings(patch: Partial<AppSettings>): AppSettings {
  const current = getClampedSettings();
  const merged: AppSettings = { ...current, ...patch };
  merged.historyLimit = clamp(merged.historyLimit, LIMITS.historyLimit.min, LIMITS.historyLimit.max);
  merged.autoHideDelayMs = clamp(merged.autoHideDelayMs, LIMITS.autoHideDelayMs.min, LIMITS.autoHideDelayMs.max);
  merged.maxStoredTextLength = clamp(merged.maxStoredTextLength, LIMITS.maxStoredTextLength.min, LIMITS.maxStoredTextLength.max);
  merged.soundVolume = clamp(merged.soundVolume, LIMITS.soundVolume.min, LIMITS.soundVolume.max);
  merged.quickPasteLimit = clamp(merged.quickPasteLimit, LIMITS.quickPasteLimit.min, LIMITS.quickPasteLimit.max);
  return setSettings(merged);
}

export function applyLaunchAtStartup(enabled: boolean): void {
  try {
    app.setLoginItemSettings({ openAtLogin: enabled });
  } catch (err) {
    console.warn("Failed to set login item:", err);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
