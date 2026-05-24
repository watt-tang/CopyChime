import { useState, useEffect, useCallback } from "react";
import { AppSettings, FavoriteClipView } from "../../../shared/types";
import { SearchBox } from "./SearchBox";
import { mascotAssets } from "../assets/mascot/mascotAssets";
import { relativeTime, formatCharLine } from "../utils/format";

interface Props {
  settings: AppSettings;
  onBack: () => void;
  onOpenSettings: () => void;
}

export function FavoritesPanel({ settings, onBack, onOpenSettings }: Props) {
  const [favorites, setFavorites] = useState<FavoriteClipView[]>([]);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    window.copyChime.getFavorites().then(setFavorites);
    const unsub = window.copyChime.onFavoritesUpdated(setFavorites);
    return unsub;
  }, []);

  const filtered = query
    ? favorites.filter((f) =>
        f.title.toLowerCase().includes(query.toLowerCase()) ||
        f.preview.toLowerCase().includes(query.toLowerCase())
      )
    : favorites;

  const handleCopy = useCallback((id: string) => {
    window.copyChime.copyFavorite(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1000);
  }, []);

  const handlePaste = useCallback((id: string) => {
    window.copyChime.pasteFavorite(id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    window.copyChime.deleteFavorite(id);
  }, []);

  const startEdit = useCallback((fav: FavoriteClipView) => {
    setEditingId(fav.id);
    setEditTitle(fav.title);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingId && editTitle.trim()) {
      window.copyChime.updateFavoriteTitle(editingId, editTitle);
    }
    setEditingId(null);
  }, [editingId, editTitle]);

  return (
    <div className="panel pixel-panel">
      <div className="panel-header">
        <button className="icon-btn" title="Back" onClick={onBack}>←</button>
        <div className="panel-header-center">
          {settings.showMascot && (
            <img className="mascot-img mascot-header" src={mascotAssets.wave} alt="mascot" />
          )}
          <div className="panel-header-text">
            <span className="panel-title">Favorites</span>
            <span className="panel-subtitle">Saved snippets</span>
          </div>
        </div>
        <div className="panel-header-actions">
          <button className="icon-btn" title="Settings" onClick={onOpenSettings}>⚙</button>
        </div>
      </div>

      <div className="search-box-wrapper">
        <SearchBox value={query} onChange={setQuery} placeholder="Search favorites..." />
      </div>

      <div className="panel-body">
        {filtered.length === 0 ? (
          <div className="empty-state">
            {settings.showMascot && (
              <img className="mascot-img mascot-empty" src={mascotAssets.clipboard} alt="empty" />
            )}
            <div className="empty-text">{query ? "No matching favorites" : "No favorites yet"}</div>
            <div className="empty-sub">
              {query ? "Try a different search" : "Star a history item to add it here."}
            </div>
          </div>
        ) : (
          filtered.map((fav) => (
            <div key={fav.id} className="history-item pixel-card fav-item">
              <div className="history-item-content">
                {editingId === fav.id ? (
                  <div className="fav-edit-row">
                    <input
                      className="fav-edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                      autoFocus
                    />
                    <button className="icon-btn" onClick={saveEdit}>✓</button>
                    <button className="icon-btn" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <div className="fav-title" onDoubleClick={() => startEdit(fav)}>
                    <span className="fav-star">★</span> {fav.title}
                  </div>
                )}
                {!settings.privacyMode && fav.preview && (
                  <div className="history-item-preview">{fav.preview}</div>
                )}
                <div className="history-item-meta">
                  <span>{formatCharLine(fav.charCount, fav.lineCount)}</span>
                  <span>{relativeTime(fav.updatedAt)}</span>
                </div>
              </div>
              <div className="history-item-actions">
                <button
                  className={`icon-btn ${copiedId === fav.id ? "copied-btn" : ""}`}
                  title="Copy"
                  onClick={() => handleCopy(fav.id)}
                >{copiedId === fav.id ? "✓" : "📋"}</button>
                <button className="icon-btn" title="Paste" onClick={() => handlePaste(fav.id)}>📌</button>
                <button className="icon-btn" title="Edit title" onClick={() => startEdit(fav)}>✎</button>
                <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(fav.id)}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>

      {favorites.length > 0 && (
        <div className="panel-footer">
          <span className="tiny-stats">{favorites.length} favorite{favorites.length !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
}
