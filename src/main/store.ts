import * as fs from "fs";
import * as path from "path";
import { app } from "electron";
import { AppSettings, HistoryRecord } from "../shared/types";
import { DEFAULT_SETTINGS, STORE_FILE_NAME } from "../shared/constants";

interface PersistedStore {
  version: 1;
  settings: AppSettings;
  history: HistoryRecord[];
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
  return { version: 1, settings: { ...DEFAULT_SETTINGS }, history: [] };
}

export function loadStore(): PersistedStore {
  if (cached) return cached;
  const p = getStorePath();
  try {
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) {
        const store: PersistedStore = { ...defaults(), ...parsed, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } };
        cached = store;
        return store;
      }
    }
  } catch (err) {
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
