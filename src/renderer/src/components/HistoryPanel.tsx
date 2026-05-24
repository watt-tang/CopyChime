import { HistoryItemView, AppSettings } from "../../../shared/types";
import { HistoryItem } from "./HistoryItem";
import { EmptyState } from "./EmptyState";
import { mascotAssets } from "../assets/mascot/mascotAssets";

interface Props {
  history: HistoryItemView[];
  settings: AppSettings;
  onCopy: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onClearUnpinned: () => void;
  onOpenSettings: () => void;
  onBack: () => void;
}

export function HistoryPanel({
  history,
  settings,
  onCopy,
  onTogglePin,
  onDelete,
  onClearUnpinned,
  onOpenSettings,
  onBack,
}: Props) {
  const handleClear = () => {
    if (window.confirm("Clear all unpinned history?")) {
      onClearUnpinned();
    }
  };

  const pinnedCount = history.filter((h) => h.pinned).length;
  const totalCount = history.length;

  return (
    <div className="panel pixel-panel">
      <div className="panel-header">
        <button className="icon-btn" title="Back" onClick={onBack}>
          ←
        </button>
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
          <button className="icon-btn" title="Clear unpinned" onClick={handleClear}>
            🗑
          </button>
          <button className="icon-btn" title="Settings" onClick={onOpenSettings}>
            ⚙
          </button>
        </div>
      </div>

      <div className="panel-chips">
        {settings.paused && <span className="pixel-chip chip-pause">Paused</span>}
        {settings.privacyMode && <span className="pixel-chip chip-privacy">Privacy</span>}
        {settings.maskSensitiveContent && <span className="pixel-chip chip-mask">Mask sensitive</span>}
      </div>

      <div className="panel-body">
        {history.length === 0 ? (
          <EmptyState settings={settings} />
        ) : (
          history.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              settings={settings}
              onCopy={onCopy}
              onTogglePin={onTogglePin}
              onDelete={onDelete}
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
