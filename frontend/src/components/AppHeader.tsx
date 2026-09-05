"use client";

import type { ReactNode } from "react";
import type { ViewMode } from "@/lib/viewMode";
import { ThemeToggle } from "./ThemeToggle";

interface AppHeaderProps {
  readonly viewMode: ViewMode;
  // Only a viewport wide enough for the grid has two layouts to choose between,
  // so on a phone the control is absent rather than disabled.
  readonly canChooseView: boolean;
  readonly onViewModeChange: (mode: ViewMode) => void;
  // Narrow viewports move the theme toggle into the deck's control bar, so the
  // header must be able to stand down rather than render it twice.
  readonly showThemeToggle?: boolean;
  // The search slot: a full SearchBar on a wide screen, a SearchTrigger on a
  // narrow one. The header does not care which.
  readonly children?: ReactNode;
}

export function AppHeader({
  viewMode,
  canChooseView,
  onViewModeChange,
  showThemeToggle = true,
  children,
}: AppHeaderProps) {
  const target: ViewMode = viewMode === "grid" ? "deck" : "grid";

  return (
    <header className="app-header flex w-full shrink-0 flex-col items-center gap-2 pb-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
      <h1 className="font-display text-2xl font-black uppercase tracking-[0.12em] text-ink sm:text-3xl">
        DevOps TCG
      </h1>

      {children !== undefined && (
        <div className="flex w-full justify-center lg:max-w-md">{children}</div>
      )}

      <div className="flex shrink-0 items-center gap-2">
        {canChooseView && (
          <button
            type="button"
            aria-label={`Show the ${target} view`}
            onClick={(event) => {
              onViewModeChange(target);

              // Same reason as the theme toggle and the shuffle button: the
              // deck hands Enter and Space to whichever button holds focus, so
              // a pointer click that kept focus here would swallow the next
              // Space. A keyboard activation reports detail 0 and keeps focus.
              if (event.detail > 0) event.currentTarget.blur();
            }}
            className="flex h-7 items-center gap-1.5 rounded-full border border-control-border bg-control px-3 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
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
              {target === "grid" ? (
                <>
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </>
              ) : (
                <>
                  <rect x="8" y="4" width="8" height="16" rx="1" />
                  <path d="M5 7v10M19 7v10" />
                </>
              )}
            </svg>
            {target}
          </button>
        )}
        {showThemeToggle && <ThemeToggle />}
      </div>
    </header>
  );
}
