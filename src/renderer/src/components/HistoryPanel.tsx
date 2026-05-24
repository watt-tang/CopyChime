import { useState, useMemo } from "react";
import { HistoryItemView, AppSettings } from "../../../shared/types";
import { HistoryItem } from "./HistoryItem";
import { EmptyState } from "./EmptyState";
import { SearchBox } from "./SearchBox";
import { mascotAssets } from "../assets/mascot/mascotAssets";

interface Props {
  history: HistoryItemView[];
  settings: AppSettings;
  onCopy: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onAddFavorite: (id: string) => void;
  onClearUnpinned: () => void;
  onOpenSettings: () => void;
  onOpenFavorites: () => void;
  onBack: () => void;
}

export function HistoryPanel({
  history,
  settings,
  onCopy,
  onTogglePin,
  onDelete,
  onAddFavorite,
  onClearUnpinned,
  onOpenSettings,
  onOpenFavorites,
  onBack,
}: Props) {
  const [query, setQuery] = useState("");

  const handleClear = () => {
    if (window.confirm("Clear all unpinned history?")) {
      onClearUnpinned();
    }
  };

  const filtered = useMemo(() => {
    if (!query) return history;
    const q = query.toLowerCase();
    return history.filter((item) => {
      const preview = item.hiddenReason ? "" : item.preview;
      return preview.toLowerCase().includes(q);
    });
  }, [history, query]);

  const pinnedCount = history.filter((h) => h.pinned).length;
  const totalCount = history.length;

  return (
    <div className="panel pixel-panel">
      <div className="panel-header">
        <button className="icon-btn" title="Back" onClick={onBack}>←</button>
        <div className="panel-header-center">
          {settings.showMascot && (
            <img
              className="mascot-img mascot-header"
              src={settings.paused ? mascotAssets.sleep : mascotAssets.wave}
              alt="mascot"
            />
          )}
          <div className="panel-header-text">
            <span className="panel-title">CopyChime</span>
            <span className="panel-subtitle">Recent snippets</span>
          </div>
        </div>
        <div className="panel-header-actions">
          <button className="icon-btn" title="Clear unpinned" onClick={handleClear}>🗑</button>
          <button className="icon-btn" title="Settings" onClick={onOpenSettings}>⚙</button>
        </div>
      </div>

      <div className="panel-tabs">
        <button className="panel-tab active">Recent</button>
        <button className="panel-tab" onClick={onOpenFavorites}>Favorites</button>
      </div>

      <div className="panel-chips">
        {settings.paused && <span className="pixel-chip chip-pause">Paused</span>}
        {settings.privacyMode && <span className="pixel-chip chip-privacy">Privacy</span>}
        {settings.maskSensitiveContent && <span className="pixel-chip chip-mask">Mask sensitive</span>}
      </div>

      <div className="search-box-wrapper">
        <SearchBox value={query} onChange={setQuery} />
      </div>

      <div className="panel-body">
        {filtered.length === 0 ? (
          query ? (
            <div className="empty-state">
              <div className="empty-text">No matching snippets</div>
            </div>
          ) : (
            <EmptyState settings={settings} />
          )
        ) : (
          filtered.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              settings={settings}
              onCopy={onCopy}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
              onAddFavorite={onAddFavorite}
            />
          ))
        )}
      </div>

      {totalCount > 0 && (
        <div className="panel-footer">
          <span className="tiny-stats">
            {totalCount} snippet{totalCount !== 1 ? "s" : ""} · {pinnedCount} pinned
          </span>
        </div>
      )}
    </div>
  );
}
