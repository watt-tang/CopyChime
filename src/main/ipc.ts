import { ipcMain, BrowserWindow } from "electron";
import { AppSettings, CopyEventView, FavoriteClipView, HistoryItemView, QuickPasteItem, ViewMode, WindowMode } from "../shared/types";
import * as historyManager from "./historyManager";
import * as favoritesManager from "./favoritesManager";
import * as settingsManager from "./settingsManager";
import * as windowManager from "./window";
import * as pasteController from "./pasteController";
import { toPlainText } from "../shared/textUtils";

let currentView: ViewMode = "bubble";

export function registerIPC(): void {
  ipcMain.handle("app:get-state", () => {
    const settings = settingsManager.getClampedSettings();
    const history = historyManager.getHistoryViews(settings);
    const favorites = favoritesManager.getFavoriteViews(settings);
    return {
      settings,
      history,
      favorites,
      paused: settings.paused,
      privacyMode: settings.privacyMode,
    };
  });

  ipcMain.handle("history:copy", (_e, id: string) => {
    return historyManager.copyHistoryItem(id);
  });

  ipcMain.handle("history:delete", (_e, id: string) => {
    const result = historyManager.deleteHistoryItem(id);
    if (result) broadcastHistory();
    return result;
  });

  ipcMain.handle("history:clear-unpinned", () => {
    const result = historyManager.clearUnpinned();
    if (result) broadcastHistory();
    return result;
  });

  ipcMain.handle("history:toggle-pin", (_e, id: string) => {
    const result = historyManager.togglePin(id);
    if (result) broadcastHistory();
    return result;
  });

  ipcMain.handle("settings:update", (_e, patch: Partial<AppSettings>) => {
    settingsManager.updateSettings(patch);
    const settings = settingsManager.getClampedSettings();
    broadcastSettings(settings);
    return settings;
  });

  ipcMain.handle("window:set-mode", (_e, mode: WindowMode) => {
    windowManager.setWindowMode(mode);
  });

  ipcMain.handle("window:show", () => {
    windowManager.showPanel();
  });

  ipcMain.handle("window:hide", () => {
    windowManager.hideWindow();
  });

  ipcMain.handle("window:toggle", () => {
    windowManager.toggleWindow();
  });

  ipcMain.handle("view:set", (_e, view: ViewMode) => {
    currentView = view;
    broadcastView(view);
  });

  // Quick Paste
  ipcMain.handle("quick-paste:get-items", (): QuickPasteItem[] => {
    const settings = settingsManager.getClampedSettings();
    const items: QuickPasteItem[] = [];
    const limit = settings.quickPasteLimit;

    // History items
    const historyViews = historyManager.getHistoryViews(settings);
    for (let i = 0; i < Math.min(historyViews.length, limit); i++) {
      const h = historyViews[i];
      items.push({
        source: "history",
        id: h.id,
        index: items.length + 1,
        title: h.hiddenReason ? (h.hiddenReason === "privacy" ? "Hidden in privacy mode" : "Copied sensitive text") : h.preview.split("\n")[0] || "(empty)",
        preview: h.hiddenReason ? "" : h.preview,
        charCount: h.charCount,
        lineCount: h.lineCount,
        pinned: h.pinned,
        hiddenReason: h.hiddenReason,
      });
    }

    // Favorites
    if (settings.quickPasteSearchFavorites) {
      const favViews = favoritesManager.getFavoriteViews(settings);
      for (let i = 0; i < Math.min(favViews.length, limit) && items.length < limit; i++) {
        const f = favViews[i];
        if (items.some((it) => it.source === "favorite" && it.id === f.id)) continue;
        items.push({
          source: "favorite",
          id: f.id,
          index: items.length + 1,
          title: f.title,
          preview: f.preview,
          charCount: f.charCount,
          lineCount: f.lineCount,
          pinned: false,
          hiddenReason: settings.privacyMode ? "privacy" : undefined,
        });
      }
    }

    return items;
  });

  ipcMain.handle("quick-paste:choose", async (_e, source: string, id: string, action: "copy" | "paste"): Promise<boolean> => {
    const settings = settingsManager.getClampedSettings();
    let text: string | null = null;

    if (source === "history") {
      text = historyManager.getTextById(id);
    } else if (source === "favorite") {
      const fav = favoritesManager.getById(id);
      text = fav?.text ?? null;
    }

    if (!text) return false;

    const plain = settings.pastePlainTextByDefault;

    if (action === "paste") {
      windowManager.hideWindow();
      return pasteController.pasteTextToActiveApp(text, plain);
    } else {
      if (plain) pasteController.writeClipboardPlainText(text);
      else pasteController.writeClipboardText(text);
      return true;
    }
  });

  // Favorites
  ipcMain.handle("favorites:get", (): FavoriteClipView[] => {
    const settings = settingsManager.getClampedSettings();
    return favoritesManager.getFavoriteViews(settings);
  });

  ipcMain.handle("favorites:add-from-history", (_e, historyId: string): boolean => {
    const result = favoritesManager.addFromHistory(historyId);
    if (result) broadcastFavorites();
    return result;
  });

  ipcMain.handle("favorites:add-text", (_e, text: string, title?: string): boolean => {
    const result = favoritesManager.addText(text, title);
    if (result) broadcastFavorites();
    return result;
  });

  ipcMain.handle("favorites:update-title", (_e, id: string, title: string): boolean => {
    const result = favoritesManager.updateTitle(id, title);
    if (result) broadcastFavorites();
    return result;
  });

  ipcMain.handle("favorites:delete", (_e, id: string): boolean => {
    const result = favoritesManager.remove(id);
    if (result) broadcastFavorites();
    return result;
  });

  ipcMain.handle("favorites:copy", (_e, id: string): boolean => {
    return favoritesManager.copyFavorite(id);
  });

  ipcMain.handle("favorites:paste", async (_e, id: string): Promise<boolean> => {
    const fav = favoritesManager.getById(id);
    if (!fav) return false;
    const settings = settingsManager.getClampedSettings();
    const plain = settings.pastePlainTextByDefault;
    windowManager.hideWindow();
    return pasteController.pasteTextToActiveApp(fav.text, plain);
  });

  ipcMain.handle("favorites:is-favorite", (_e, text: string): boolean => {
    return favoritesManager.isFavorite(text);
  });
}

export function broadcastCopied(event: CopyEventView): void {
  const win = windowManager.getMainWindow();
  if (win) win.webContents.send("clipboard:copied", event);
}

export function broadcastHistory(): void {
  const win = windowManager.getMainWindow();
  if (!win) return;
  const settings = settingsManager.getClampedSettings();
  const history = historyManager.getHistoryViews(settings);
  win.webContents.send("history:updated", history);
}

export function broadcastFavorites(): void {
  const win = windowManager.getMainWindow();
  if (!win) return;
  const settings = settingsManager.getClampedSettings();
  const favorites = favoritesManager.getFavoriteViews(settings);
  win.webContents.send("favorites:updated", favorites);
}

export function broadcastSettings(settings: AppSettings): void {
  const win = windowManager.getMainWindow();
  if (win) win.webContents.send("settings:updated", settings);
}

export function broadcastView(view: ViewMode): void {
  const win = windowManager.getMainWindow();
  if (win) win.webContents.send("view:changed", view);
}

export function getCurrentView(): ViewMode {
  return currentView;
}
