import { Tray, Menu, app } from "electron";
import { createTrayIcon } from "./trayIcon";
import { AppSettings } from "../shared/types";
import { DEFAULT_SETTINGS } from "../shared/constants";

let tray: Tray | null = null;

type TrayMenuCallbacks = {
  showWindow: () => void;
  hideWindow: () => void;
  togglePause: () => void;
  togglePrivacy: () => void;
  clearHistory: () => void;
  openSettings: () => void;
  quit: () => void;
  isWindowVisible: () => boolean;
};

let callbacks: TrayMenuCallbacks | null = null;

export function createTray(cb: TrayMenuCallbacks): void {
  try {
    const icon = createTrayIcon();
    tray = new Tray(icon);
    tray.setToolTip("CopyChime");
    callbacks = cb;
    updateTrayMenu(getDefaultSettings());
  } catch (err) {
    console.warn("Failed to create tray:", err);
  }
}

function getDefaultSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS };
}

export function updateTrayMenu(settings: AppSettings): void {
  if (!tray || !callbacks) return;
  const visible = callbacks.isWindowVisible();
  const menu = Menu.buildFromTemplate([
    { label: visible ? "Hide" : "Show", click: () => visible ? callbacks!.hideWindow() : callbacks!.showWindow() },
    { label: settings.paused ? "Resume" : "Pause", click: () => callbacks!.togglePause() },
    { label: "Privacy Mode", type: "checkbox", checked: settings.privacyMode, click: () => callbacks!.togglePrivacy() },
    { type: "separator" },
    { label: "Clear History", click: () => callbacks!.clearHistory() },
    { label: "Settings", click: () => callbacks!.openSettings() },
    { type: "separator" },
    { label: "Quit", click: () => callbacks!.quit() },
  ]);
  tray.setContextMenu(menu);
}

export function disposeTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
  callbacks = null;
}
