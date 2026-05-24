import { randomUUID } from "crypto";
import { HistoryRecord, HistoryItemView, AppSettings } from "../shared/types";
import { PREVIEW_MAX_LENGTH } from "../shared/constants";
import { getHistory, setHistory } from "./store";
import { isSensitiveText } from "./sensitive";
import { matchesIgnoreRules } from "./ignoreRules";

function countLines(text: string): number {
  return text.split(/\r\n|\r|\n/).length;
}

function makePreview(text: string): string {
  if (text.length <= PREVIEW_MAX_LENGTH) return text;
  return text.slice(0, PREVIEW_MAX_LENGTH) + "…";
}

export function addText(
  text: string,
  settings: AppSettings
): { record: HistoryRecord; savedToHistory: boolean } | null {
  if (!text || !text.trim()) return null;
  if (matchesIgnoreRules(text, settings.ignorePatterns)) return null;

  const sensitive = isSensitiveText(text);
  const truncated = text.length > settings.maxStoredTextLength;
  const storedText = truncated ? text.slice(0, settings.maxStoredTextLength) : text;

  const record: HistoryRecord = {
    id: randomUUID(),
    text: storedText,
    createdAt: Date.now(),
    charCount: text.length,
    lineCount: countLines(text),
    pinned: false,
    truncated,
    sensitive,
  };

  const history = getHistory();

  // Dedupe: if text already in history, move to top
  const existingIdx = history.findIndex((h) => h.text === storedText);
  if (existingIdx !== -1) {
    const existing = history.splice(existingIdx, 1)[0];
    existing.createdAt = Date.now();
    history.unshift(existing);
    saveHistory(history, settings);
    return { record: existing, savedToHistory: true };
  }

  // Privacy mode: optionally skip saving
  if (settings.privacyMode && !settings.saveHistoryInPrivacyMode) {
    return { record, savedToHistory: false };
  }

  history.unshift(record);
  saveHistory(history, settings);
  return { record, savedToHistory: true };
}

function saveHistory(history: HistoryRecord[], settings: AppSettings): void {
  // Trim to limit: keep pinned + most recent unpinned
  const pinned = history.filter((h) => h.pinned);
  const unpinned = history.filter((h) => !h.pinned);
  const maxUnpinned = Math.max(0, settings.historyLimit - pinned.length);
  const trimmed = [...pinned, ...unpinned.slice(0, maxUnpinned)];
  trimmed.sort((a, b) => b.createdAt - a.createdAt);
  setHistory(trimmed);
}

export function getHistoryViews(settings: AppSettings): HistoryItemView[] {
  const history = getHistory();
  return history.map((r) => recordToView(r, settings));
}

function recordToView(r: HistoryRecord, settings: AppSettings): HistoryItemView {
  let hiddenReason: HistoryItemView["hiddenReason"];
  let preview = makePreview(r.text);

  if (settings.privacyMode) {
    hiddenReason = "privacy";
    preview = "";
  } else if (settings.maskSensitiveContent && r.sensitive) {
    hiddenReason = "sensitive";
    preview = "";
  }

  return {
    id: r.id,
    createdAt: r.createdAt,
    charCount: r.charCount,
    lineCount: r.lineCount,
    pinned: r.pinned,
    truncated: r.truncated,
    sensitive: r.sensitive,
    preview,
    hiddenReason,
  };
}

export function copyHistoryItem(id: string): boolean {
  const history = getHistory();
  const item = history.find((h) => h.id === id);
  if (!item) return false;
  const { clipboard } = require("electron");
  clipboard.writeText(item.text);
  return true;
}

export function deleteHistoryItem(id: string): boolean {
  const history = getHistory();
  const idx = history.findIndex((h) => h.id === id);
  if (idx === -1) return false;
  history.splice(idx, 1);
  setHistory(history);
  return true;
}

export function clearUnpinned(): boolean {
  const history = getHistory();
  const pinned = history.filter((h) => h.pinned);
  setHistory(pinned);
  return true;
}

export function togglePin(id: string): boolean {
  const history = getHistory();
  const item = history.find((h) => h.id === id);
  if (!item) return false;
  item.pinned = !item.pinned;
  setHistory(history);
  return true;
}
