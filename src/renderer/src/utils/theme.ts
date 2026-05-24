import { ThemeName } from "../../../shared/types";

export function applyTheme(theme: ThemeName): void {
  let resolved = theme;
  if (theme === "system") {
    resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", resolved);
}
