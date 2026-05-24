import { contextBridge, ipcRenderer } from "electron";
import { CopyChimeAPI, CopyEventView, HistoryItemView, FavoriteClipView, QuickPasteItem, AppSettings, ViewMode, WindowMode, AppState } from "../shared/types";

const copyChime: CopyChimeAPI = {
  getState: () => ipcRenderer.invoke("app:get-state") as Promise<AppState>,
  copyHistoryItem: (id: string) => ipcRenderer.invoke("history:copy", id) as Promise<boolean>,
  deleteHistoryItem: (id: string) => ipcRenderer.invoke("history:delete", id) as Promise<boolean>,
  clearUnpinnedHistory: () => ipcRenderer.invoke("history:clear-unpinned") as Promise<boolean>,
  togglePin: (id: string) => ipcRenderer.invoke("history:toggle-pin", id) as Promise<boolean>,
  updateSettings: (patch: Partial<AppSettings>) => ipcRenderer.invoke("settings:update", patch) as Promise<void>,
  setWindowMode: (mode: WindowMode) => ipcRenderer.invoke("window:set-mode", mode) as Promise<void>,
  showWindow: () => ipcRenderer.invoke("window:show") as Promise<void>,
  hideWindow: () => ipcRenderer.invoke("window:hide") as Promise<void>,
  toggleWindow: () => ipcRenderer.invoke("window:toggle") as Promise<void>,
  setView: (view: ViewMode) => ipcRenderer.invoke("view:set", view) as Promise<void>,
  onCopied: (callback: (event: CopyEventView) => void) => {
    const handler = (_e: unknown, event: CopyEventView) => callback(event);
    ipcRenderer.on("clipboard:copied", handler);
    return () => ipcRenderer.removeListener("clipboard:copied", handler);
  },
  onHistoryUpdated: (callback: (history: HistoryItemView[]) => void) => {
    const handler = (_e: unknown, history: HistoryItemView[]) => callback(history);
    ipcRenderer.on("history:updated", handler);
    return () => ipcRenderer.removeListener("history:updated", handler);
  },
  onSettingsUpdated: (callback: (settings: AppSettings) => void) => {
    const handler = (_e: unknown, settings: AppSettings) => callback(settings);
    ipcRenderer.on("settings:updated", handler);
    return () => ipcRenderer.removeListener("settings:updated", handler);
  },
  onViewChanged: (callback: (view: ViewMode) => void) => {
    const handler = (_e: unknown, view: ViewMode) => callback(view);
    ipcRenderer.on("view:changed", handler);
    return () => ipcRenderer.removeListener("view:changed", handler);
  },
  // Quick Paste
  quickPasteGetItems: () => ipcRenderer.invoke("quick-paste:get-items") as Promise<QuickPasteItem[]>,
  quickPasteChoose: (source: string, id: string, action: "copy" | "paste") =>
    ipcRenderer.invoke("quick-paste:choose", source, id, action) as Promise<boolean>,
  // Favorites
  getFavorites: () => ipcRenderer.invoke("favorites:get") as Promise<FavoriteClipView[]>,
  addFavoriteFromHistory: (historyId: string) =>
    ipcRenderer.invoke("favorites:add-from-history", historyId) as Promise<boolean>,
  addFavoriteText: (text: string, title?: string) =>
    ipcRenderer.invoke("favorites:add-text", text, title) as Promise<boolean>,
  updateFavoriteTitle: (id: string, title: string) =>
    ipcRenderer.invoke("favorites:update-title", id, title) as Promise<boolean>,
  deleteFavorite: (id: string) =>
    ipcRenderer.invoke("favorites:delete", id) as Promise<boolean>,
  copyFavorite: (id: string) =>
    ipcRenderer.invoke("favorites:copy", id) as Promise<boolean>,
  pasteFavorite: (id: string) =>
    ipcRenderer.invoke("favorites:paste", id) as Promise<boolean>,
  isFavorite: (text: string) =>
    ipcRenderer.invoke("favorites:is-favorite", text) as Promise<boolean>,
  // Events
  onFavoritesUpdated: (callback: (favorites: FavoriteClipView[]) => void) => {
    const handler = (_e: unknown, favorites: FavoriteClipView[]) => callback(favorites);
    ipcRenderer.on("favorites:updated", handler);
    return () => ipcRenderer.removeListener("favorites:updated", handler);
  },
};

contextBridge.exposeInMainWorld("copyChime", copyChime);
