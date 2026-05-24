import { useState } from "react";
import { AppSettings, SoundFeedback, ThemeName, AppExclusionRule } from "../../../shared/types";
import { LIMITS } from "../../../shared/constants";

interface Props {
  settings: AppSettings;
  onUpdate: (patch: Partial<AppSettings>) => void;
  onBack: () => void;
  onClearHistory: () => void;
}

export function SettingsPanel({ settings, onUpdate, onBack, onClearHistory }: Props) {
  const [newProc, setNewProc] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");

  const addRule = () => {
    if (!newProc.trim()) return;
    const rule: AppExclusionRule = {
      id: "excl-" + Date.now(),
      enabled: true,
      processName: newProc.trim(),
      windowTitlePattern: newTitle.trim() || undefined,
      note: newNote.trim() || undefined,
    };
    onUpdate({ appExclusionRules: [...settings.appExclusionRules, rule] });
    setNewProc("");
    setNewTitle("");
    setNewNote("");
  };

  const addCommonPW = () => {
    const COMMON = [
      { processName: "1Password.exe", note: "1Password" },
      { processName: "Bitwarden.exe", note: "Bitwarden" },
      { processName: "KeePass.exe", note: "KeePass" },
      { processName: "KeePassXC.exe", note: "KeePassXC" },
      { processName: "Dashlane.exe", note: "Dashlane" },
      { processName: "LastPass.exe", note: "LastPass" },
      { processName: "Enpass.exe", note: "Enpass" },
      { processName: "NordPass.exe", note: "NordPass" },
    ];
    const existing = new Set(settings.appExclusionRules.map((r) => r.processName.toLowerCase()));
    const toAdd = COMMON.filter((c) => !existing.has(c.processName.toLowerCase()));
    if (toAdd.length === 0) return;
    const newRules = toAdd.map((c) => ({
      id: "pw-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      enabled: true,
      ...c,
    }));
    onUpdate({ appExclusionRules: [...settings.appExclusionRules, ...newRules] });
  };

  const toggleRule = (id: string) => {
    onUpdate({
      appExclusionRules: settings.appExclusionRules.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      ),
    });
  };

  const deleteRule = (id: string) => {
    onUpdate({ appExclusionRules: settings.appExclusionRules.filter((r) => r.id !== id) });
  };

  return (
    <div className="panel pixel-panel">
      <div className="panel-header">
        <button className="icon-btn" title="Back" onClick={onBack}>←</button>
        <span className="panel-title">Settings</span>
      </div>
      <div className="panel-body settings-body">
        <div className="setting-group">
          <div className="setting-group-title">General</div>
          <label className="setting-item">
            <span>Pause clipboard watching</span>
            <input type="checkbox" checked={settings.paused} onChange={(e) => onUpdate({ paused: e.target.checked })} />
          </label>
          <label className="setting-item">
            <span>Privacy Mode</span>
            <input type="checkbox" checked={settings.privacyMode} onChange={(e) => onUpdate({ privacyMode: e.target.checked })} />
          </label>
          <label className="setting-item">
            <span>Save history in privacy mode</span>
            <input type="checkbox" checked={settings.saveHistoryInPrivacyMode} onChange={(e) => onUpdate({ saveHistoryInPrivacyMode: e.target.checked })} />
          </label>
          <label className="setting-item">
            <span>Launch at startup</span>
            <input type="checkbox" checked={settings.launchAtStartup} onChange={(e) => onUpdate({ launchAtStartup: e.target.checked })} />
          </label>
        </div>

        <div className="setting-group">
          <div className="setting-group-title">Appearance</div>
          <label className="setting-item">
            <span>Theme</span>
            <select value={settings.theme} onChange={(e) => onUpdate({ theme: e.target.value as ThemeName })}>
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
            <input type="checkbox" checked={settings.showMascot} onChange={(e) => onUpdate({ showMascot: e.target.checked })} />
          </label>
          <label className="setting-item">
            <span>Sound feedback</span>
            <select value={settings.soundFeedback} onChange={(e) => onUpdate({ soundFeedback: e.target.value as SoundFeedback })}>
              <option value="off">Off</option>
              <option value="chime">Chime</option>
              <option value="meow">Meow</option>
            </select>
          </label>
          <label className="setting-item">
            <span>Sound volume</span>
            <input type="range" min={0} max={1} step={0.05} value={settings.soundVolume} onChange={(e) => onUpdate({ soundVolume: Number(e.target.value) })} />
            <span className="setting-value">{Math.round(settings.soundVolume * 100)}%</span>
          </label>
        </div>

        <div className="setting-group">
          <div className="setting-group-title">Quick Paste</div>
          <label className="setting-item">
            <span>Auto paste after selection</span>
            <input type="checkbox" checked={settings.quickPasteAutoPaste} onChange={(e) => onUpdate({ quickPasteAutoPaste: e.target.checked })} />
          </label>
          <label className="setting-item">
            <span>Search favorites in Quick Paste</span>
            <input type="checkbox" checked={settings.quickPasteSearchFavorites} onChange={(e) => onUpdate({ quickPasteSearchFavorites: e.target.checked })} />
          </label>
          <label className="setting-item">
            <span>Quick Paste limit</span>
            <input type="range" min={LIMITS.quickPasteLimit.min} max={LIMITS.quickPasteLimit.max} value={settings.quickPasteLimit} onChange={(e) => onUpdate({ quickPasteLimit: Number(e.target.value) })} />
            <span className="setting-value">{settings.quickPasteLimit}</span>
          </label>
          <div className="shortcuts-info" style={{ marginTop: 8 }}>
            <div><strong>Ctrl+Alt+V</strong> — Quick Paste Palette</div>
          </div>
        </div>

        <div className="setting-group">
          <div className="setting-group-title">Plain Text</div>
          <label className="setting-item">
            <span>Use plain text for Quick Paste</span>
            <input type="checkbox" checked={settings.pastePlainTextByDefault} onChange={(e) => onUpdate({ pastePlainTextByDefault: e.target.checked })} />
          </label>
        </div>

        <div className="setting-group">
          <div className="setting-group-title">App Exclusions</div>
          <p className="setting-description">Skip clipboard capture when the foreground app matches these rules.</p>

          {settings.appExclusionRules.length > 0 && (
            <div className="exclusion-list">
              {settings.appExclusionRules.map((rule) => (
                <div key={rule.id} className={`exclusion-rule ${!rule.enabled ? "disabled" : ""}`}>
                  <label className="exclusion-toggle">
                    <input type="checkbox" checked={rule.enabled} onChange={() => toggleRule(rule.id)} />
                  </label>
                  <div className="exclusion-info">
                    <span className="exclusion-proc">{rule.processName}</span>
                    {rule.windowTitlePattern && <span className="exclusion-title">title: {rule.windowTitlePattern}</span>}
                    {rule.note && <span className="exclusion-note">{rule.note}</span>}
                  </div>
                  <button className="icon-btn danger" onClick={() => deleteRule(rule.id)}>✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="exclusion-add">
            <input className="exclusion-input" placeholder="processName.exe" value={newProc} onChange={(e) => setNewProc(e.target.value)} />
            <input className="exclusion-input" placeholder="window title (optional)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <input className="exclusion-input" placeholder="note (optional)" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
            <button className="btn" onClick={addRule}>Add Rule</button>
          </div>

          <button className="btn" style={{ marginTop: 8 }} onClick={addCommonPW}>
            Add common password managers
          </button>
        </div>

        <div className="setting-group">
          <div className="setting-group-title">History</div>
          <label className="setting-item">
            <span>History limit</span>
            <input type="range" min={LIMITS.historyLimit.min} max={LIMITS.historyLimit.max} value={settings.historyLimit} onChange={(e) => onUpdate({ historyLimit: Number(e.target.value) })} />
            <span className="setting-value">{settings.historyLimit}</span>
          </label>
          <label className="setting-item">
            <span>Auto hide delay (ms)</span>
            <input type="range" min={LIMITS.autoHideDelayMs.min} max={LIMITS.autoHideDelayMs.max} step={100} value={settings.autoHideDelayMs} onChange={(e) => onUpdate({ autoHideDelayMs: Number(e.target.value) })} />
            <span className="setting-value">{settings.autoHideDelayMs}</span>
          </label>
          <label className="setting-item">
            <span>Max stored text length</span>
            <input type="range" min={LIMITS.maxStoredTextLength.min} max={LIMITS.maxStoredTextLength.max} step={100} value={settings.maxStoredTextLength} onChange={(e) => onUpdate({ maxStoredTextLength: Number(e.target.value) })} />
            <span className="setting-value">{settings.maxStoredTextLength}</span>
          </label>
          <label className="setting-item">
            <span>Enable history persistence</span>
            <input type="checkbox" checked={settings.enableHistoryPersistence} onChange={(e) => onUpdate({ enableHistoryPersistence: e.target.checked })} />
          </label>
          <label className="setting-item">
            <span>Mask sensitive content</span>
            <input type="checkbox" checked={settings.maskSensitiveContent} onChange={(e) => onUpdate({ maskSensitiveContent: e.target.checked })} />
          </label>
          <div className="setting-item column">
            <span>Ignore patterns (one per line)</span>
            <textarea value={settings.ignorePatterns} onChange={(e) => onUpdate({ ignorePatterns: e.target.value })} placeholder={"/password/i\nsecret-key\nprivate-token"} rows={4} />
          </div>
        </div>

        <button className="btn danger-btn" onClick={onClearHistory}>Clear unpinned history</button>

        <div className="shortcuts-info">
          <div className="shortcuts-title">Global Shortcuts</div>
          <div>Ctrl+Alt+C — Show/Hide</div>
          <div>Ctrl+Alt+P — Pause/Resume</div>
          <div>Ctrl+Alt+H — History</div>
          <div>Ctrl+Alt+M — Privacy Mode</div>
          <div>Ctrl+Alt+V — Quick Paste</div>
        </div>
      </div>
    </div>
  );
}
