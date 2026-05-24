import { useState, useEffect, useRef, useCallback } from "react";
import { AppSettings, QuickPasteItem } from "../../../shared/types";
import { mascotAssets } from "../assets/mascot/mascotAssets";

interface Props {
  settings: AppSettings;
  onClose: () => void;
}

export function QuickPastePanel({ settings, onClose }: Props) {
  const [items, setItems] = useState<QuickPasteItem[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => {
    window.copyChime.quickPasteGetItems().then((all) => {
      if (!query) {
        setItems(all);
      } else {
        const q = query.toLowerCase();
        setItems(all.filter((it) => it.title.toLowerCase().includes(q) || it.preview.toLowerCase().includes(q)));
      }
    });
  }, [query]);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { setSelected(0); }, [query]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const choose = useCallback((item: QuickPasteItem, action: "copy" | "paste") => {
    window.copyChime.quickPasteChoose(item.source, item.id, action).then((ok) => {
      if (ok) onClose();
    });
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (query) { setQuery(""); e.preventDefault(); return; }
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, items.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (items[selected]) choose(items[selected], settings.quickPasteAutoPaste ? "paste" : "copy");
      return;
    }
    // 1-9 quick select
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9 && num <= items.length) {
      e.preventDefault();
      choose(items[num - 1], settings.quickPasteAutoPaste ? "paste" : "copy");
    }
  };

  return (
    <div className="panel pixel-panel quick-paste-panel" onKeyDown={handleKeyDown}>
      <div className="panel-header">
        {settings.showMascot && (
          <img className="mascot-img mascot-header" src={mascotAssets.idle} alt="mascot" />
        )}
        <span className="panel-title">Quick Paste</span>
        <button className="icon-btn" title="Close" onClick={onClose}>✕</button>
      </div>

      <div className="search-box-wrapper">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search snippets..."
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery("")}>✕</button>
          )}
        </div>
      </div>

      <div className="panel-body quick-paste-list">
        {items.length === 0 ? (
          <div className="empty-state">
            {settings.showMascot && (
              <img className="mascot-img mascot-empty" src={mascotAssets.clipboard} alt="empty" />
            )}
            <div className="empty-text">No matching snippets</div>
          </div>
        ) : (
          items.map((item, i) => (
            <div
              key={`${item.source}-${item.id}`}
              className={`quick-paste-item pixel-card ${i === selected ? "selected" : ""}`}
              onClick={() => choose(item, settings.quickPasteAutoPaste ? "paste" : "copy")}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="qp-index">{item.index}</span>
              <div className="qp-content">
                <div className="qp-title">{item.hiddenReason ? "•••" : item.title}</div>
                <div className="qp-meta">
                  {item.charCount} chars · {item.lineCount} lines
                  {item.source === "favorite" && <span className="tag fav-tag">★ Fav</span>}
                  {item.pinned && <span className="tag pin-tag">pinned</span>}
                </div>
              </div>
              <div className="qp-actions">
                <button
                  className="icon-btn"
                  title="Copy"
                  onClick={(e) => { e.stopPropagation(); choose(item, "copy"); }}
                >📋</button>
                <button
                  className="icon-btn"
                  title="Paste"
                  onClick={(e) => { e.stopPropagation(); choose(item, "paste"); }}
                >📌</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="quick-paste-footer">
        Enter {settings.quickPasteAutoPaste ? "paste" : "copy"} · 1-9 quick · Esc close
      </div>
    </div>
  );
}
