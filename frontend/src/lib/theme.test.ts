import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  THEME_COLORS,
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

  it("repaints the browser chrome to the theme's paper", () => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = THEME_COLORS.neon;
    document.head.append(meta);

    applyTheme(document.documentElement, "sketch");
    expect(meta.content).toBe(THEME_COLORS.sketch);
    applyTheme(document.documentElement, "neon");
    expect(meta.content).toBe(THEME_COLORS.neon);

    meta.remove();
  });

  it("changes the theme even with no theme-color tag", () => {
    const root = document.createElement("html");
    expect(() => applyTheme(root, "sketch")).not.toThrow();
  });
});

describe("THEME_COLORS", () => {
  it("repeats each theme's --paper token", () => {
    const css = readFileSync(
      path.resolve(__dirname, "../app/globals.css"),
      "utf8",
    );
    const paper = (block: string) =>
      css.slice(css.indexOf(block)).match(/--paper:\s*(#[0-9a-f]+);/i)?.[1];

    expect(paper(":root {")).toBe(THEME_COLORS.neon);
    expect(paper('[data-theme="sketch"] {')).toBe(THEME_COLORS.sketch);
  });
});
