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

  const clearAutoHideTimer = useCallback(() => {
    if (autoHideTimer.current) {
      clearTimeout(autoHideTimer.current);
      autoHideTimer.current = null;
    }
  }, []);

  const scheduleAutoHide = useCallback(() => {
    clearAutoHideTimer();
    autoHideTimer.current = setTimeout(() => {
      window.copyChime.hideWindow();
    }, settingsRef.current.autoHideDelayMs);
  }, [clearAutoHideTimer]);

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
        clearAutoHideTimer();
        scheduleAutoHide();
      }),
      window.copyChime.onHistoryUpdated((h) => setHistory(h)),
      window.copyChime.onSettingsUpdated((s) => setSettings(s)),
      window.copyChime.onViewChanged((v) => setCurrentView(v)),
    ];

    return () => {
      unsubs.forEach((u) => u());
      document.removeEventListener("click", handleClick);
      clearAutoHideTimer();
    };
  }, [clearAutoHideTimer, scheduleAutoHide]);

  const expandToHistory = useCallback(() => {
    clearAutoHideTimer();
    setCurrentView("history");
    window.copyChime.setWindowMode("panel");
    window.copyChime.setView("history");
  }, [clearAutoHideTimer]);

  const expandToSettings = useCallback(() => {
    clearAutoHideTimer();
    setCurrentView("settings");
    window.copyChime.setWindowMode("panel");
    window.copyChime.setView("settings");
  }, [clearAutoHideTimer]);

  const backToBubble = useCallback(() => {
    setCurrentView("bubble");
    window.copyChime.setWindowMode("bubble");
    window.copyChime.setView("bubble");
    clearAutoHideTimer();
    scheduleAutoHide();
  }, [clearAutoHideTimer, scheduleAutoHide]);

  return {
    settings,
    history,
    currentView,
    latestCopy,
    expandToHistory,
    expandToSettings,
    backToBubble,
    resetAutoHide: scheduleAutoHide,
  };
}
