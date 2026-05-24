import * as fs from "fs";
import * as path from "path";
import { app } from "electron";
import { AppSettings, HistoryRecord, FavoriteClip } from "../shared/types";
import { DEFAULT_SETTINGS, STORE_FILE_NAME } from "../shared/constants";

interface PersistedStore {
  version: number;
  settings: AppSettings;
  history: HistoryRecord[];
  favorites: FavoriteClip[];
}

let storePath: string | null = null;
let cached: PersistedStore | null = null;

function getStorePath(): string {
  if (!storePath) {
    storePath = path.join(app.getPath("userData"), STORE_FILE_NAME);
  }
  return storePath;
}

function defaults(): PersistedStore {
  return { version: 3, settings: { ...DEFAULT_SETTINGS }, history: [], favorites: [] };
}

function migrateStore(store: PersistedStore): PersistedStore {
  if (store.version < 2) {
    if (store.settings.autoHideDelayMs === 2000) {
      store.settings.autoHideDelayMs = 4000;
    }
    store.version = 2;
  }
  if (store.version < 3) {
    // v3: added favorites, quickPaste, appExclusions, pastePlainText
    if (!store.favorites) (store as PersistedStore).favorites = [];
    if (!store.settings.appExclusionRules) store.settings.appExclusionRules = [];
    store.version = 3;
  }
  return store;
}

export function loadStore(): PersistedStore {
  if (cached) return cached;
  const p = getStorePath();
  try {
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version >= 1 && parsed.version <= 3) {
        let store: PersistedStore = { ...defaults(), ...parsed, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } };
        if (!Array.isArray(store.favorites)) store.favorites = [];
        store = migrateStore(store);
        cached = store;
        return store;
      }
    }
  } catch {
    try {
      const backup = p + ".bak." + Date.now();
      fs.copyFileSync(p, backup);
    } catch {}
  }
  const store = defaults();
  cached = store;
  return store;
}

export function saveStore(): void {
  const p = getStorePath();
  try {
    const tmp = p + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(cached, null, 2), "utf-8");
    fs.renameSync(tmp, p);
  } catch {}
}

export function getSettings(): AppSettings {
  return loadStore().settings;
}

export function setSettings(patch: Partial<AppSettings>): AppSettings {
  const store = loadStore();
  store.settings = { ...store.settings, ...patch };
  saveStore();
  return store.settings;
}

export function getHistory(): HistoryRecord[] {
  return loadStore().history;
}

export function setHistory(history: HistoryRecord[]): void {
  loadStore().history = history;
  saveStore();
}

export function getFavorites(): FavoriteClip[] {
  return loadStore().favorites;
}

export function setFavorites(favorites: FavoriteClip[]): void {
  loadStore().favorites = favorites;
  saveStore();
}
