import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_VIEW_MODE,
  VIEW_MODE_STORAGE_KEY,
  readStoredViewMode,
  resolveViewMode,
  storeViewMode,
} from "./viewMode";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("resolveViewMode", () => {
  it("keeps a known mode", () => {
    expect(resolveViewMode("deck")).toBe("deck");
    expect(resolveViewMode("grid")).toBe("grid");
  });

  it("falls back to the default for anything else", () => {
    expect(resolveViewMode("carousel")).toBe(DEFAULT_VIEW_MODE);
    expect(resolveViewMode(null)).toBe(DEFAULT_VIEW_MODE);
    expect(resolveViewMode(7)).toBe(DEFAULT_VIEW_MODE);
  });

  it("opens on the grid by default", () => {
    expect(DEFAULT_VIEW_MODE).toBe("grid");
  });
});

describe("readStoredViewMode", () => {
  it("reads a stored mode", () => {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, "deck");

    expect(readStoredViewMode()).toBe("deck");
  });

  it("returns the default when nothing is stored", () => {
    expect(readStoredViewMode()).toBe(DEFAULT_VIEW_MODE);
  });

  it("returns the default when the read itself throws", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(readStoredViewMode()).toBe(DEFAULT_VIEW_MODE);
  });
});

describe("storeViewMode", () => {
  it("writes the mode", () => {
    storeViewMode("deck");

    expect(window.localStorage.getItem(VIEW_MODE_STORAGE_KEY)).toBe("deck");
  });

  it("swallows a blocked write", () => {
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(() => storeViewMode("grid")).not.toThrow();
  });
});
