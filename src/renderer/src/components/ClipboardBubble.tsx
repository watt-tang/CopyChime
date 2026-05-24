import { CopyEventView, AppSettings } from "../../../shared/types";
import { formatCharLine } from "../utils/format";
import { mascotAssets, MascotState } from "../assets/mascot/mascotAssets";

interface Props {
  copyEvent: CopyEventView | null;
  settings: AppSettings;
  onExpand: () => void;
}

function getMascotState(copyEvent: CopyEventView | null, settings: AppSettings): { state: MascotState; title: string; subtitle: string } {
  if (settings.paused) {
    return { state: "sleep", title: "Paused", subtitle: "Taking a nap" };
  }
  if (!copyEvent) {
    return { state: "idle", title: "CopyChime", subtitle: "Copy text to see it here" };
  }
  if (copyEvent.hiddenReason === "privacy") {
    return { state: "privacy", title: "Copied privately", subtitle: "Preview hidden" };
  }
  if (copyEvent.hiddenReason === "sensitive") {
    return { state: "privacy", title: "Sensitive text copied", subtitle: "Preview hidden" };
  }
  return { state: "success", title: "Copied!", subtitle: "Snippet saved" };
}

export function ClipboardBubble({ copyEvent, settings, onExpand }: Props) {
  const { state, title, subtitle } = getMascotState(copyEvent, settings);

  const preview = copyEvent?.hiddenReason
    ? copyEvent.hiddenReason === "privacy"
      ? "Hidden in privacy mode"
      : "Copied sensitive text"
    : copyEvent?.preview;

  const handleClick = () => {
    onExpand();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onExpand();
    }
  };

  return (
    <div
      className="bubble"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="bubble-row">
        {settings.showMascot && (
          <img
            className={`mascot-img mascot-bubble ${copyEvent ? "mascot-pop" : ""}`}
            src={mascotAssets[state]}
            alt={state}
            draggable={false}
          />
        )}
        <div className="bubble-body">
          <div className="bubble-header">
            <span className="bubble-title">{title}</span>
            {copyEvent && (
              <span className="bubble-meta">
                {formatCharLine(copyEvent.charCount, copyEvent.lineCount)}
              </span>
            )}
          </div>
          {preview && <div className="bubble-preview">{preview}</div>}
          <div className="bubble-subtitle">{subtitle}</div>
          <div className="bubble-hint">Click anywhere to view history</div>
        </div>
      </div>
    </div>
  );
}
