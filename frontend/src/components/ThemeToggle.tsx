"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_THEME,
  applyTheme,
  readStoredTheme,
  storeTheme,
  type Theme,
} from "@/lib/theme";

const other = (theme: Theme): Theme => (theme === "neon" ? "sketch" : "neon");

const names: Record<Theme, string> = { neon: "neon", sketch: "sketch" };

export function ThemeToggle() {
  // The server cannot know the stored theme, so the first client render must
  // match the markup it produced. The pre-paint script has already applied the
  // real theme to the document; this only catches the label up after mount.
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  const target = other(theme);

  return (
    <button
      type="button"
      aria-label={`Switch to the ${names[target]} theme`}
      onClick={() => {
        setTheme(target);
        applyTheme(document.documentElement, target);
        storeTheme(target);
      }}
      className="theme-toggle mt-2 flex h-7 items-center gap-1.5 rounded-full border border-control-border bg-control px-3 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--paper)]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" />
      </svg>
      {names[target]}
    </button>
  );
}
