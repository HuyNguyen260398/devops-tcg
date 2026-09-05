export type ViewMode = "grid" | "deck";

export const VIEW_MODES: readonly ViewMode[] = ["grid", "deck"];

// A wide screen opens on the grid: the whole deck at once is the thing the
// carousel cannot do, and the toggle is right there for the reader who wants
// the carousel back.
export const DEFAULT_VIEW_MODE: ViewMode = "grid";

export const VIEW_MODE_STORAGE_KEY = "devops-tcg-view";

export const resolveViewMode = (value: unknown): ViewMode =>
  typeof value === "string" && (VIEW_MODES as readonly string[]).includes(value)
    ? (value as ViewMode)
    : DEFAULT_VIEW_MODE;

// As with the theme: a privacy mode can make the property access itself throw,
// so the whole read is guarded rather than only the missing-key case.
export const readStoredViewMode = (): ViewMode => {
  try {
    return resolveViewMode(window.localStorage.getItem(VIEW_MODE_STORAGE_KEY));
  } catch {
    return DEFAULT_VIEW_MODE;
  }
};

// A blocked write must not stop the view changing for this session.
export const storeViewMode = (mode: ViewMode): void => {
  try {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  } catch {
    return;
  }
};
