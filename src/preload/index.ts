import { contextBridge, ipcRenderer } from "electron";
import { CopyChimeAPI, CopyEventView, HistoryItemView, AppSettings, ViewMode, WindowMode, AppState } from "../shared/types";

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
};

contextBridge.exposeInMainWorld("copyChime", copyChime);
