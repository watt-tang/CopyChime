export type ThemeName =
  | "system"
  | "light"
  | "dark"
  | "catppuccin"
  | "mint"
  | "mono"
  | "pixel";

export type SoundFeedback = "off" | "chime" | "meow";

export type ViewMode = "bubble" | "history" | "settings" | "quickPaste" | "favorites";

export type WindowMode = "bubble" | "panel";

export type HiddenReason = "privacy" | "sensitive";

export interface HistoryRecord {
  id: string;
  text: string;
  createdAt: number;
  charCount: number;
  lineCount: number;
  pinned: boolean;
  truncated: boolean;
  sensitive: boolean;
}

export interface HistoryItemView {
  id: string;
  createdAt: number;
  charCount: number;
  lineCount: number;
  pinned: boolean;
  truncated: boolean;
  sensitive: boolean;
  preview: string;
  hiddenReason?: HiddenReason;
}

export interface CopyEventView {
  id?: string;
  createdAt: number;
  charCount: number;
  lineCount: number;
  truncated: boolean;
  sensitive: boolean;
  preview: string;
  hiddenReason?: HiddenReason;
  savedToHistory: boolean;
}

export interface FavoriteClip {
  id: string;
  text: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  charCount: number;
  lineCount: number;
}

export interface FavoriteClipView {
  id: string;
  title: string;
  preview: string;
  createdAt: number;
  updatedAt: number;
  charCount: number;
  lineCount: number;
}

export interface AppExclusionRule {
  id: string;
  enabled: boolean;
  processName: string;
  windowTitlePattern?: string;
  note?: string;
}

export interface ActiveWindowInfo {
  processName: string;
  title: string;
}

export interface QuickPasteItem {
  source: "history" | "favorite";
  id: string;
  index: number;
  title: string;
  preview: string;
  charCount: number;
  lineCount: number;
  pinned: boolean;
  hiddenReason?: HiddenReason;
}

export interface AppSettings {
  theme: ThemeName;
  privacyMode: boolean;
  saveHistoryInPrivacyMode: boolean;
  paused: boolean;
  launchAtStartup: boolean;
  historyLimit: number;
  autoHideDelayMs: number;
  maxStoredTextLength: number;
  enableHistoryPersistence: boolean;
  ignorePatterns: string;
  maskSensitiveContent: boolean;
  showMascot: boolean;
  soundFeedback: SoundFeedback;
  soundVolume: number;
  quickPasteLimit: number;
  quickPasteAutoPaste: boolean;
  quickPasteSearchFavorites: boolean;
  pastePlainTextByDefault: boolean;
  appExclusionRules: AppExclusionRule[];
  windowBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AppState {
  settings: AppSettings;
  history: HistoryItemView[];
  favorites: FavoriteClipView[];
  paused: boolean;
  privacyMode: boolean;
}

export interface CopyChimeAPI {
  getState(): Promise<AppState>;
  copyHistoryItem(id: string): Promise<boolean>;
  deleteHistoryItem(id: string): Promise<boolean>;
  clearUnpinnedHistory(): Promise<boolean>;
  togglePin(id: string): Promise<boolean>;
  updateSettings(patch: Partial<AppSettings>): Promise<void>;
  setWindowMode(mode: WindowMode): Promise<void>;
  showWindow(): Promise<void>;
  hideWindow(): Promise<void>;
  toggleWindow(): Promise<void>;
  setView(view: ViewMode): Promise<void>;
  onCopied(callback: (event: CopyEventView) => void): () => void;
  onHistoryUpdated(callback: (history: HistoryItemView[]) => void): () => void;
  onSettingsUpdated(callback: (settings: AppSettings) => void): () => void;
  onViewChanged(callback: (view: ViewMode) => void): () => void;
  // Quick Paste
  quickPasteGetItems(): Promise<QuickPasteItem[]>;
  quickPasteChoose(source: string, id: string, action: "copy" | "paste"): Promise<boolean>;
  // Favorites
  getFavorites(): Promise<FavoriteClipView[]>;
  addFavoriteFromHistory(historyId: string): Promise<boolean>;
  addFavoriteText(text: string, title?: string): Promise<boolean>;
  updateFavoriteTitle(id: string, title: string): Promise<boolean>;
  deleteFavorite(id: string): Promise<boolean>;
  copyFavorite(id: string): Promise<boolean>;
  pasteFavorite(id: string): Promise<boolean>;
  isFavorite(text: string): Promise<boolean>;
  // Events
  onFavoritesUpdated(callback: (favorites: FavoriteClipView[]) => void): () => void;
}
