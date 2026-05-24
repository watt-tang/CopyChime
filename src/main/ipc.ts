import { ipcMain, BrowserWindow } from "electron";
import { AppSettings, CopyEventView, HistoryItemView, ViewMode, WindowMode } from "../shared/types";
import * as historyManager from "./historyManager";
import * as settingsManager from "./settingsManager";
import * as windowManager from "./window";

let currentView: ViewMode = "bubble";

export function registerIPC(): void {
  ipcMain.handle("app:get-state", () => {
    const settings = settingsManager.getClampedSettings();
    const history = historyManager.getHistoryViews(settings);
    return {
      settings,
      history,
      paused: settings.paused,
      privacyMode: settings.privacyMode,
    };
  });

  ipcMain.handle("history:copy", (_e, id: string) => {
    const result = historyManager.copyHistoryItem(id);
    return result;
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
