import { app, BrowserWindow } from "electron";
import { createMainWindow, showBubble, toggleWindow, hideWindow, showPanel, getMainWindow, destroyWindow, isWindowVisible } from "./window";
import { registerIPC, broadcastCopied, broadcastHistory } from "./ipc";
import * as clipboardWatcher from "./clipboardWatcher";
import * as historyManager from "./historyManager";
import * as settingsManager from "./settingsManager";
import * as trayManager from "./tray";
import * as shortcutsManager from "./shortcuts";
import { CopyEventView } from "../shared/types";

let isQuitting = false;

function handleCopyText(text: string): void {
  const settings = settingsManager.getClampedSettings();
  if (settings.paused) return;

  const result = historyManager.addText(text, settings);
  if (!result) return;

  const { record, savedToHistory } = result;

  const copyEvent: CopyEventView = {
    id: record.id,
    createdAt: record.createdAt,
    charCount: record.charCount,
    lineCount: record.lineCount,
    truncated: record.truncated,
    sensitive: record.sensitive,
    preview: settings.privacyMode
      ? ""
      : settings.maskSensitiveContent && record.sensitive
        ? ""
        : record.text.slice(0, 200),
    hiddenReason: settings.privacyMode
      ? "privacy"
      : settings.maskSensitiveContent && record.sensitive
        ? "sensitive"
        : undefined,
    savedToHistory,
  };

  broadcastCopied(copyEvent);
  if (savedToHistory) broadcastHistory();
  showBubble();
}

app.whenReady().then(() => {
  registerIPC();
  createMainWindow();

  // Tray
  trayManager.createTray({
    showWindow: () => showPanel(),
    hideWindow: () => hideWindow(),
    togglePause: () => {
      const s = settingsManager.getClampedSettings();
      settingsManager.updateSettings({ paused: !s.paused });
      clipboardWatcher.setPaused(!s.paused);
      trayManager.updateTrayMenu(settingsManager.getClampedSettings());
    },
    togglePrivacy: () => {
      const s = settingsManager.getClampedSettings();
      settingsManager.updateSettings({ privacyMode: !s.privacyMode });
      trayManager.updateTrayMenu(settingsManager.getClampedSettings());
    },
    clearHistory: () => {
      historyManager.clearUnpinned();
      broadcastHistory();
    },
    openSettings: () => {
      showPanel();
      const win = getMainWindow();
      if (win) win.webContents.send("view:changed", "settings");
    },
    quit: () => {
      isQuitting = true;
      app.quit();
    },
    isWindowVisible: () => isWindowVisible(),
  });

  // Global shortcuts
  shortcutsManager.registerShortcuts({
    toggleWindow: () => toggleWindow(),
    togglePause: () => {
      const s = settingsManager.getClampedSettings();
      settingsManager.updateSettings({ paused: !s.paused });
      clipboardWatcher.setPaused(!s.paused);
      trayManager.updateTrayMenu(settingsManager.getClampedSettings());
    },
    showHistory: () => {
      showPanel();
      const win = getMainWindow();
      if (win) win.webContents.send("view:changed", "history");
    },
    togglePrivacy: () => {
      const s = settingsManager.getClampedSettings();
      settingsManager.updateSettings({ privacyMode: !s.privacyMode });
      trayManager.updateTrayMenu(settingsManager.getClampedSettings());
    },
  });

  // Start clipboard watching
  const settings = settingsManager.getClampedSettings();
  clipboardWatcher.setPaused(settings.paused);
  clipboardWatcher.start(handleCopyText);

  // Apply launch at startup
  settingsManager.applyLaunchAtStartup(settings.launchAtStartup);
});

app.on("before-quit", () => {
  isQuitting = true;
  clipboardWatcher.dispose();
  shortcutsManager.unregisterShortcuts();
  trayManager.disposeTray();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin" && isQuitting) {
    app.quit();
  }
});

app.on("activate", () => {
  const win = getMainWindow();
  if (win) win.show();
});
