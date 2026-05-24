import { clipboard } from "electron";
import { toPlainText } from "../shared/textUtils";

export function writeClipboardText(text: string): void {
  clipboard.writeText(text);
}

export function writeClipboardPlainText(text: string): void {
  clipboard.writeText(toPlainText(text));
}

export async function pasteTextToActiveApp(text: string, plain = false): Promise<boolean> {
  try {
    if (plain) {
      writeClipboardPlainText(text);
    } else {
      writeClipboardText(text);
    }

    if (process.platform === "win32") {
      await delay(100);
      return await sendCtrlVWindows();
    }
    // macOS/Linux: clipboard is set, user can paste manually
    return true;
  } catch (err) {
    console.warn("Auto-paste failed:", err);
    return false;
  }
}

async function sendCtrlVWindows(): Promise<boolean> {
  try {
    const { execFile } = require("child_process") as typeof import("child_process");
    const ps = [
      "Add-Type -AssemblyName System.Windows.Forms;",
      "[System.Windows.Forms.SendKeys]::SendWait('^v')",
    ].join(" ");

    return new Promise((resolve) => {
      execFile("powershell", ["-NoProfile", "-Command", ps], { timeout: 2000 }, (err: Error | null) => {
        if (err) {
          console.warn("SendKeys failed:", err.message);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (err) {
    console.warn("sendCtrlVWindows failed:", err);
    return false;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
