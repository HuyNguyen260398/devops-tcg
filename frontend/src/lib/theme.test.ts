import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  applyTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
} from "./theme";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("resolveTheme", () => {
  it("keeps a recognised theme", () => {
    expect(resolveTheme("sketch")).toBe("sketch");
    expect(resolveTheme("neon")).toBe("neon");
  });

  it("falls back to the default for anything else", () => {
    expect(resolveTheme("chartreuse")).toBe(DEFAULT_THEME);
    expect(resolveTheme(null)).toBe(DEFAULT_THEME);
    expect(resolveTheme(undefined)).toBe(DEFAULT_THEME);
    expect(resolveTheme(7)).toBe(DEFAULT_THEME);
  });
});

describe("readStoredTheme", () => {
  it("reads a stored theme", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "sketch");
    expect(readStoredTheme()).toBe("sketch");
  });

  it("defaults when nothing is stored", () => {
    expect(readStoredTheme()).toBe(DEFAULT_THEME);
  });

  // Privacy modes can block storage entirely; the deck must still render.
  it("defaults when storage throws", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readStoredTheme()).toBe(DEFAULT_THEME);
  });
});

describe("storeTheme", () => {
  it("writes the theme", () => {
    storeTheme("sketch");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("sketch");
  });

  it("swallows a storage failure", () => {
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => storeTheme("sketch")).not.toThrow();
  });
});

describe("applyTheme", () => {
  it("stamps the theme on the element", () => {
    const root = document.createElement("html");
    applyTheme(root, "sketch");
    expect(root.getAttribute("data-theme")).toBe("sketch");
    applyTheme(root, "neon");
    expect(root.getAttribute("data-theme")).toBe("neon");
  });
});
