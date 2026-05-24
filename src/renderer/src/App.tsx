import { useCopyChime } from "./hooks/useCopyChime";
import { ClipboardBubble } from "./components/ClipboardBubble";
import { HistoryPanel } from "./components/HistoryPanel";
import { SettingsPanel } from "./components/SettingsPanel";
import { QuickPastePanel } from "./components/QuickPastePanel";
import { FavoritesPanel } from "./components/FavoritesPanel";
import { applyTheme } from "./utils/theme";
import { useEffect } from "react";

export default function App() {
  const {
    settings,
    history,
    currentView,
    latestCopy,
    expandToHistory,
    expandToSettings,
    expandToFavorites,
    expandToQuickPaste,
    backToBubble,
  } = useCopyChime();

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.theme]);

  const handleCopy = (id: string) => {
    window.copyChime.copyHistoryItem(id);
  };

  const handleTogglePin = (id: string) => {
    window.copyChime.togglePin(id);
  };

  const handleDelete = (id: string) => {
    window.copyChime.deleteHistoryItem(id);
  };

  const handleAddFavorite = (id: string) => {
    window.copyChime.addFavoriteFromHistory(id);
  };

  const handleClearUnpinned = () => {
    window.copyChime.clearUnpinnedHistory();
  };

  const handleUpdateSettings = (patch: Record<string, unknown>) => {
    window.copyChime.updateSettings(patch as never);
  };

  if (currentView === "quickPaste") {
    return <QuickPastePanel settings={settings} onClose={backToBubble} />;
  }

  if (currentView === "favorites") {
    return (
      <FavoritesPanel
        settings={settings}
        onBack={backToBubble}
        onOpenSettings={expandToSettings}
      />
    );
  }

  if (currentView === "settings") {
    return (
      <SettingsPanel
        settings={settings}
        onUpdate={handleUpdateSettings}
        onBack={backToBubble}
        onClearHistory={handleClearUnpinned}
      />
    );
  }

  if (currentView === "history") {
    return (
      <HistoryPanel
        history={history}
        settings={settings}
        onCopy={handleCopy}
        onTogglePin={handleTogglePin}
        onDelete={handleDelete}
        onAddFavorite={handleAddFavorite}
        onClearUnpinned={handleClearUnpinned}
        onOpenSettings={expandToSettings}
        onOpenFavorites={expandToFavorites}
        onBack={backToBubble}
      />
    );
  }

  return <ClipboardBubble copyEvent={latestCopy} settings={settings} onExpand={expandToHistory} />;
}
