import { clipboard } from "electron";
import { AppSettings } from "../shared/types";
import { POLL_INTERVAL_MS } from "../shared/constants";
import { matchesIgnoreRules } from "./ignoreRules";
import { isSensitiveText } from "./sensitive";

export type CopyCallback = (text: string) => void;

let intervalId: ReturnType<typeof setInterval> | null = null;
let lastSeenClipboardText = "";
let paused = false;
let onCopy: CopyCallback | null = null;

export function start(cb: CopyCallback): void {
  stop();
  onCopy = cb;
  lastSeenClipboardText = clipboard.readText() || "";
  intervalId = setInterval(poll, POLL_INTERVAL_MS);
}

export function stop(): void {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  onCopy = null;
}

export function pause(): void {
  paused = true;
}

export function resume(): void {
  paused = false;
  // Re-read to avoid triggering on content copied while paused
  lastSeenClipboardText = clipboard.readText() || "";
}

export function setPaused(value: boolean): void {
  if (value) pause();
  else resume();
}

export function updateLastSeen(text: string): void {
  lastSeenClipboardText = text;
}

function poll(): void {
  if (paused) return;
  const text = clipboard.readText();
  if (!text || !text.trim()) return;
  if (text === lastSeenClipboardText) return;
  lastSeenClipboardText = text;
  if (onCopy) onCopy(text);
}

export function dispose(): void {
  stop();
  paused = false;
  lastSeenClipboardText = "";
}
