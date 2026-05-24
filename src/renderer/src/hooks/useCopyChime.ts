import { useState, useEffect, useCallback, useRef } from "react";
import { AppSettings, AppState, CopyEventView, HistoryItemView, ViewMode } from "../../../shared/types";
import { DEFAULT_SETTINGS } from "../../../shared/constants";
import { playCopySound, unlockAudio } from "../utils/sound";

export function useCopyChime() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<HistoryItemView[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>("bubble");
  const [latestCopy, setLatestCopy] = useState<CopyEventView | null>(null);
  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settingsRef = useRef(settings);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    window.copyChime.getState().then((state: AppState) => {
      setSettings(state.settings);
      setHistory(state.history);
    });

    const handleClick = () => unlockAudio();
    document.addEventListener("click", handleClick, { once: true });

    const unsubs = [
      window.copyChime.onCopied((event) => {
        setLatestCopy(event);
        setCurrentView("bubble");
        window.copyChime.setWindowMode("bubble");
        playCopySound(settingsRef.current);
        resetAutoHide();
      }),
      window.copyChime.onHistoryUpdated((h) => setHistory(h)),
      window.copyChime.onSettingsUpdated((s) => setSettings(s)),
      window.copyChime.onViewChanged((v) => setCurrentView(v)),
    ];

    return () => {
      unsubs.forEach((u) => u());
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const resetAutoHide = useCallback(() => {
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    autoHideTimer.current = setTimeout(() => {
      window.copyChime.hideWindow();
    }, settingsRef.current.autoHideDelayMs);
  }, []);

  const expandToHistory = useCallback(() => {
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    setCurrentView("history");
    window.copyChime.setWindowMode("panel");
    window.copyChime.setView("history");
  }, []);

  const expandToSettings = useCallback(() => {
    if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
    setCurrentView("settings");
    window.copyChime.setWindowMode("panel");
    window.copyChime.setView("settings");
  }, []);

  const backToBubble = useCallback(() => {
    setCurrentView("bubble");
    window.copyChime.setWindowMode("bubble");
    window.copyChime.setView("bubble");
  }, []);

  return {
    settings,
    history,
    currentView,
    latestCopy,
    expandToHistory,
    expandToSettings,
    backToBubble,
    resetAutoHide,
  };
}
