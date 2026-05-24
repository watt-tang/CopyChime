import { useState } from "react";
import { HistoryItemView, AppSettings } from "../../../shared/types";
import { relativeTime, formatCharLine } from "../utils/format";
import { mascotAssets } from "../assets/mascot/mascotAssets";

interface Props {
  item: HistoryItemView;
  settings: AppSettings;
  onCopy: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onAddFavorite: (id: string) => void;
}

export function HistoryItem({ item, settings, onCopy, onTogglePin, onDelete, onAddFavorite }: Props) {
  const [copied, setCopied] = useState(false);

  const preview = item.hiddenReason
    ? item.hiddenReason === "privacy"
      ? "Hidden in privacy mode"
      : "Copied sensitive text"
    : item.preview;

  const handleCopy = () => {
    onCopy(item.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className={`history-item pixel-card ${item.pinned ? "pinned" : ""}`}>
      {settings.showMascot && item.hiddenReason && (
        <img className="mascot-img mascot-item-badge" src={mascotAssets.privacy} alt="hidden" />
      )}
      <div className="history-item-content">
        <div className="history-item-preview">{preview || "(empty)"}</div>
        <div className="history-item-meta">
          <span>{formatCharLine(item.charCount, item.lineCount)}</span>
          <span>{relativeTime(item.createdAt)}</span>
          {item.truncated && <span className="tag">truncated</span>}
          {item.pinned && <span className="tag pin-tag">pinned</span>}
        </div>
      </div>
      <div className="history-item-actions">
        <button
          className={`icon-btn ${copied ? "copied-btn" : ""}`}
          title="Copy"
          onClick={handleCopy}
        >
          {copied ? "✓" : "📋"}
        </button>
        <button
          className={`icon-btn ${item.pinned ? "active" : ""}`}
          title={item.pinned ? "Unpin" : "Pin"}
          onClick={() => onTogglePin(item.id)}
        >
          📌
        </button>
        <button
          className="icon-btn"
          title="Add to favorites"
          onClick={() => onAddFavorite(item.id)}
        >
          ☆
        </button>
        <button className="icon-btn danger" title="Delete" onClick={() => onDelete(item.id)}>
          ✕
        </button>
      </div>
    </div>
  );
}
