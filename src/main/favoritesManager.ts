import { randomUUID } from "crypto";
import { FavoriteClip, FavoriteClipView, AppSettings } from "../shared/types";
import { MAX_FAVORITES, PREVIEW_MAX_LENGTH } from "../shared/constants";
import { getFavorites, setFavorites, getHistory } from "./store";

function countLines(text: string): number {
  return text.split(/\r\n|\r|\n/).length;
}

function makePreview(text: string, privacyMode: boolean): string {
  if (privacyMode) return "";
  if (text.length <= PREVIEW_MAX_LENGTH) return text;
  return text.slice(0, PREVIEW_MAX_LENGTH) + "…";
}

function defaultTitle(text: string): string {
  const firstLine = text.split(/\r\n|\r|\n/)[0].trim();
  if (firstLine.length <= 40) return firstLine || "(untitled)";
  return firstLine.slice(0, 40) + "…";
}

export function getFavoriteViews(settings: AppSettings): FavoriteClipView[] {
  const favs = getFavorites();
  return favs.map((f) => ({
    id: f.id,
    title: f.title,
    preview: makePreview(f.text, settings.privacyMode),
    createdAt: f.createdAt,
    updatedAt: f.updatedAt,
    charCount: f.charCount,
    lineCount: f.lineCount,
  }));
}

export function addFromHistory(historyId: string): boolean {
  const history = getHistory();
  const item = history.find((h) => h.id === historyId);
  if (!item || !item.text.trim()) return false;

  const favs = getFavorites();
  const existing = favs.find((f) => f.text === item.text);
  if (existing) {
    existing.updatedAt = Date.now();
    setFavorites(favs);
    return true;
  }

  if (favs.length >= MAX_FAVORITES) return false;

  const now = Date.now();
  favs.unshift({
    id: randomUUID(),
    text: item.text,
    title: defaultTitle(item.text),
    createdAt: now,
    updatedAt: now,
    charCount: item.charCount,
    lineCount: item.lineCount,
  });
  setFavorites(favs);
  return true;
}

export function addText(text: string, title?: string): boolean {
  if (!text.trim()) return false;

  const favs = getFavorites();
  const existing = favs.find((f) => f.text === text);
  if (existing) {
    existing.updatedAt = Date.now();
    setFavorites(favs);
    return true;
  }

  if (favs.length >= MAX_FAVORITES) return false;

  const now = Date.now();
  favs.unshift({
    id: randomUUID(),
    text,
    title: title || defaultTitle(text),
    createdAt: now,
    updatedAt: now,
    charCount: text.length,
    lineCount: countLines(text),
  });
  setFavorites(favs);
  return true;
}

export function updateTitle(id: string, title: string): boolean {
  const favs = getFavorites();
  const item = favs.find((f) => f.id === id);
  if (!item) return false;
  item.title = title.trim() || item.title;
  item.updatedAt = Date.now();
  setFavorites(favs);
  return true;
}

export function remove(id: string): boolean {
  const favs = getFavorites();
  const idx = favs.findIndex((f) => f.id === id);
  if (idx === -1) return false;
  favs.splice(idx, 1);
  setFavorites(favs);
  return true;
}

export function copyFavorite(id: string): boolean {
  const favs = getFavorites();
  const item = favs.find((f) => f.id === id);
  if (!item) return false;
  const { clipboard } = require("electron");
  clipboard.writeText(item.text);
  return true;
}

export function isFavorite(text: string): boolean {
  return getFavorites().some((f) => f.text === text);
}

export function getById(id: string): FavoriteClip | undefined {
  return getFavorites().find((f) => f.id === id);
}
