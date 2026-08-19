import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Node 26 gates its own `localStorage` global behind --localstorage-file, and
// that shadows the one jsdom would otherwise expose, so `window.localStorage`
// is undefined there while it exists under the Node 20 that .nvmrc and CI pin.
// A browser always has it, so the suite supplies an equivalent rather than
// letting the same test pass or fail by Node version.
if (typeof window !== "undefined" && !window.localStorage) {
  const entries = new Map<string, string>();

  const memoryStorage: Storage = {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    key: (index) => [...entries.keys()][index] ?? null,
    removeItem: (key) => {
      entries.delete(key);
    },
    setItem: (key, value) => {
      entries.set(key, String(value));
    },
  };

  Object.defineProperty(window, "localStorage", {
    configurable: true,
    value: memoryStorage,
  });
}

afterEach(cleanup);
