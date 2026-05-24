import { AppExclusionRule, ActiveWindowInfo } from "../shared/types";

export function normalizeProcessName(name: string): string {
  const lower = name.toLowerCase().trim();
  return lower.endsWith(".exe") ? lower : lower + ".exe";
}

export function matchTitlePattern(title: string, pattern: string): boolean {
  if (!pattern) return true;
  const trimmed = pattern.trim();
  if (!trimmed) return true;

  // Try regex: /pattern/flags
  const regexMatch = trimmed.match(/^\/(.+)\/([gimsuy]*)$/);
  if (regexMatch) {
    try {
      const re = new RegExp(regexMatch[1], regexMatch[2]);
      return re.test(title);
    } catch {
      // Fall through to substring
    }
  }

  // Substring match, case-insensitive
  return title.toLowerCase().includes(trimmed.toLowerCase());
}

export function matchAppExclusion(
  info: ActiveWindowInfo,
  rules: AppExclusionRule[]
): boolean {
  const procLower = normalizeProcessName(info.processName);

  for (const rule of rules) {
    if (!rule.enabled) continue;
    const ruleProc = normalizeProcessName(rule.processName);
    if (procLower !== ruleProc) continue;
    if (rule.windowTitlePattern && !matchTitlePattern(info.title, rule.windowTitlePattern)) continue;
    return true;
  }
  return false;
}

export const COMMON_PASSWORD_MANAGERS: AppExclusionRule[] = [
  { id: "pw-1password", enabled: true, processName: "1Password.exe", note: "1Password" },
  { id: "pw-bitwarden", enabled: true, processName: "Bitwarden.exe", note: "Bitwarden" },
  { id: "pw-keepass", enabled: true, processName: "KeePass.exe", note: "KeePass" },
  { id: "pw-keepassxc", enabled: true, processName: "KeePassXC.exe", note: "KeePassXC" },
  { id: "pw-dashlane", enabled: true, processName: "Dashlane.exe", note: "Dashlane" },
  { id: "pw-lastpass", enabled: true, processName: "LastPass.exe", note: "LastPass" },
  { id: "pw-enpass", enabled: true, processName: "Enpass.exe", note: "Enpass" },
  { id: "pw-nordpass", enabled: true, processName: "NordPass.exe", note: "NordPass" },
];
