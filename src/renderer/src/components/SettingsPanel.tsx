import { AppSettings, SoundFeedback, ThemeName } from "../../../shared/types";
import { LIMITS } from "../../../shared/constants";

interface Props {
  settings: AppSettings;
  onUpdate: (patch: Partial<AppSettings>) => void;
  onBack: () => void;
  onClearHistory: () => void;
}

export function SettingsPanel({ settings, onUpdate, onBack, onClearHistory }: Props) {
  return (
    <div className="panel pixel-panel">
      <div className="panel-header">
        <button className="icon-btn" title="Back" onClick={onBack}>
          ←
        </button>
        <span className="panel-title">Settings</span>
      </div>
      <div className="panel-body settings-body">
        <div className="setting-group">
          <div className="setting-group-title">General</div>

          <label className="setting-item">
            <span>Pause clipboard watching</span>
            <input
              type="checkbox"
              checked={settings.paused}
              onChange={(e) => onUpdate({ paused: e.target.checked })}
            />
          </label>

          <label className="setting-item">
            <span>Privacy Mode</span>
            <input
              type="checkbox"
              checked={settings.privacyMode}
              onChange={(e) => onUpdate({ privacyMode: e.target.checked })}
            />
          </label>

          <label className="setting-item">
            <span>Save history in privacy mode</span>
            <input
              type="checkbox"
              checked={settings.saveHistoryInPrivacyMode}
              onChange={(e) => onUpdate({ saveHistoryInPrivacyMode: e.target.checked })}
            />
          </label>

          <label className="setting-item">
            <span>Launch at startup</span>
            <input
              type="checkbox"
              checked={settings.launchAtStartup}
              onChange={(e) => onUpdate({ launchAtStartup: e.target.checked })}
            />
          </label>
        </div>

        <div className="setting-group">
          <div className="setting-group-title">Appearance</div>

          <label className="setting-item">
            <span>Theme</span>
            <select
              value={settings.theme}
              onChange={(e) => onUpdate({ theme: e.target.value as ThemeName })}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="catppuccin">Catppuccin</option>
              <option value="mint">Mint</option>
              <option value="mono">Mono</option>
              <option value="pixel">Pixel Lavender</option>
            </select>
          </label>
        </div>

        <div className="setting-group">
          <div className="setting-group-title">Mascot & Sound</div>

          <label className="setting-item">
            <span>Show mascot</span>
            <input
              type="checkbox"
              checked={settings.showMascot}
              onChange={(e) => onUpdate({ showMascot: e.target.checked })}
            />
          </label>

          <label className="setting-item">
            <span>Sound feedback</span>
            <select
              value={settings.soundFeedback}
              onChange={(e) => onUpdate({ soundFeedback: e.target.value as SoundFeedback })}
            >
              <option value="off">Off</option>
              <option value="chime">Chime</option>
              <option value="meow">Meow</option>
            </select>
          </label>

          <label className="setting-item">
            <span>Sound volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.soundVolume}
              onChange={(e) => onUpdate({ soundVolume: Number(e.target.value) })}
            />
            <span className="setting-value">{Math.round(settings.soundVolume * 100)}%</span>
          </label>
        </div>

        <div className="setting-group">
          <div className="setting-group-title">History</div>

          <label className="setting-item">
            <span>History limit</span>
            <input
              type="range"
              min={LIMITS.historyLimit.min}
              max={LIMITS.historyLimit.max}
              value={settings.historyLimit}
              onChange={(e) => onUpdate({ historyLimit: Number(e.target.value) })}
            />
            <span className="setting-value">{settings.historyLimit}</span>
          </label>

          <label className="setting-item">
            <span>Auto hide delay (ms)</span>
            <input
              type="range"
              min={LIMITS.autoHideDelayMs.min}
              max={LIMITS.autoHideDelayMs.max}
              step={100}
              value={settings.autoHideDelayMs}
              onChange={(e) => onUpdate({ autoHideDelayMs: Number(e.target.value) })}
            />
            <span className="setting-value">{settings.autoHideDelayMs}</span>
          </label>

          <label className="setting-item">
            <span>Max stored text length</span>
            <input
              type="range"
              min={LIMITS.maxStoredTextLength.min}
              max={LIMITS.maxStoredTextLength.max}
              step={100}
              value={settings.maxStoredTextLength}
              onChange={(e) => onUpdate({ maxStoredTextLength: Number(e.target.value) })}
            />
            <span className="setting-value">{settings.maxStoredTextLength}</span>
          </label>

          <label className="setting-item">
            <span>Enable history persistence</span>
            <input
              type="checkbox"
              checked={settings.enableHistoryPersistence}
              onChange={(e) => onUpdate({ enableHistoryPersistence: e.target.checked })}
            />
          </label>

          <label className="setting-item">
            <span>Mask sensitive content</span>
            <input
              type="checkbox"
              checked={settings.maskSensitiveContent}
              onChange={(e) => onUpdate({ maskSensitiveContent: e.target.checked })}
            />
          </label>

          <div className="setting-item column">
            <span>Ignore patterns (one per line)</span>
            <textarea
              value={settings.ignorePatterns}
              onChange={(e) => onUpdate({ ignorePatterns: e.target.value })}
              placeholder={"/password/i\nsecret-key\nprivate-token"}
              rows={4}
            />
          </div>
        </div>

        <button className="btn danger-btn" onClick={onClearHistory}>
          Clear unpinned history
        </button>

        <div className="shortcuts-info">
          <div className="shortcuts-title">Global Shortcuts</div>
          <div>Ctrl+Alt+C — Show/Hide</div>
          <div>Ctrl+Alt+P — Pause/Resume</div>
          <div>Ctrl+Alt+H — History</div>
          <div>Ctrl+Alt+M — Privacy Mode</div>
        </div>
      </div>
    </div>
  );
}
