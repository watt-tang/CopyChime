import { globalShortcut } from "electron";

type ShortcutCallbacks = {
  toggleWindow: () => void;
  togglePause: () => void;
  showHistory: () => void;
  togglePrivacy: () => void;
  openQuickPaste: () => void;
};

const SHORTCUTS = {
  "CommandOrControl+Alt+C": "toggleWindow",
  "CommandOrControl+Alt+P": "togglePause",
  "CommandOrControl+Alt+H": "showHistory",
  "CommandOrControl+Alt+M": "togglePrivacy",
  "CommandOrControl+Alt+V": "openQuickPaste",
} as const;

export function registerShortcuts(cb: ShortcutCallbacks): void {
  for (const [accelerator, action] of Object.entries(SHORTCUTS)) {
    try {
      globalShortcut.register(accelerator, () => {
        cb[action]();
      });
    } catch (err) {
      console.warn(`Failed to register shortcut ${accelerator}:`, err);
    }
  }
}

export function unregisterShortcuts(): void {
  globalShortcut.unregisterAll();
}
