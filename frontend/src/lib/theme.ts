export type Theme = "neon" | "sketch";

export const THEMES: readonly Theme[] = ["neon", "sketch"];

export const DEFAULT_THEME: Theme = "neon";

export const THEME_STORAGE_KEY = "devops-tcg-theme";

export const resolveTheme = (value: unknown): Theme =>
  typeof value === "string" && (THEMES as readonly string[]).includes(value)
    ? (value as Theme)
    : DEFAULT_THEME;

// Reading storage is not merely absent under SSR — a privacy mode can make the
// property access itself throw, so the whole read is guarded.
export const readStoredTheme = (): Theme => {
  try {
    return resolveTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
};

// A blocked write must not stop the theme changing for this session.
export const storeTheme = (theme: Theme): void => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    return;
  }
};

export const applyTheme = (root: HTMLElement, theme: Theme): void => {
  root.setAttribute("data-theme", theme);
};
