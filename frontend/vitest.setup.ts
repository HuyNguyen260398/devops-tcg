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

// jsdom ships no matchMedia, and the explorer measures the viewport with one.
// The stub answers `(min-width: Npx)` from `window.innerWidth`, so a test
// changes layout the same way it changes the deck's spread — by setting the
// width — and every other query (reduced motion included) stays unmatched.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList => {
      const minWidth = /\(min-width:\s*(\d+)px\)/.exec(query);

      return {
        media: query,
        get matches() {
          return minWidth !== null && window.innerWidth >= Number(minWidth[1]);
        },
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      } as MediaQueryList;
    },
  });
}

afterEach(cleanup);
