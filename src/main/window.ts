import { BrowserWindow, Rectangle, screen } from "electron";
import * as path from "path";
import { BUBBLE_WIDTH, BUBBLE_HEIGHT, PANEL_WIDTH, PANEL_HEIGHT } from "../shared/constants";
import { defaultBubbleBounds, defaultPanelBounds, ensureBoundsVisible } from "./windowBounds";
import { getSettings, setSettings } from "./store";

let mainWindow: BrowserWindow | null = null;
let currentMode: "bubble" | "panel" = "bubble";
let boundsSaveTimeout: ReturnType<typeof setTimeout> | null = null;

export function createMainWindow(): BrowserWindow {
  const settings = getSettings();
  let bounds: Rectangle;

  if (settings.windowBounds) {
    bounds = ensureBoundsVisible(settings.windowBounds);
  } else {
    bounds = defaultBubbleBounds();
  }

  mainWindow = new BrowserWindow({
    ...bounds,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      preload: path.join(__dirname, "../../preload/preload/index.js"),
    },
  });

  mainWindow.on("move", debounceSaveBounds);
  mainWindow.on("resize", debounceSaveBounds);

  mainWindow.on("close", (e) => {
    e.preventDefault();
    mainWindow?.hide();
  });

  // Load renderer
  if (process.env.NODE_ENV === "development" || process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../../renderer/index.html"));
  }

  return mainWindow;
}

export function getMainWindow(): BrowserWindow | null {
  return mainWindow;
}

export function showBubble(): void {
  if (!mainWindow) return;
  currentMode = "bubble";
  const bounds = defaultBubbleBounds();
  mainWindow.setBounds(bounds);
  mainWindow.showInactive();
  mainWindow.setAlwaysOnTop(true);
}

export function showPanel(view?: string): void {
  if (!mainWindow) return;
  currentMode = "panel";
  const bounds = defaultPanelBounds();
  mainWindow.setBounds(bounds);
  mainWindow.show();
  mainWindow.setAlwaysOnTop(true);
  mainWindow.focus();
}

export function hideWindow(): void {
  mainWindow?.hide();
}

export function toggleWindow(): void {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showPanel();
  }
}

export function setWindowMode(mode: "bubble" | "panel"): void {
  if (mode === "bubble") showBubble();
  else showPanel();
}

export function isWindowVisible(): boolean {
  return mainWindow?.isVisible() ?? false;
}

function debounceSaveBounds(): void {
  if (boundsSaveTimeout) clearTimeout(boundsSaveTimeout);
  boundsSaveTimeout = setTimeout(() => {
    if (!mainWindow) return;
    const bounds = mainWindow.getBounds();
    setSettings({ windowBounds: bounds });
  }, 500);
}

export function destroyWindow(): void {
  if (boundsSaveTimeout) clearTimeout(boundsSaveTimeout);
  if (mainWindow) {
    mainWindow.removeAllListeners("close");
    mainWindow.destroy();
    mainWindow = null;
  }
}
