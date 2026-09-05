"use client";

import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface DeckToolbarProps {
  // A handler is the switch: a control with nothing to call is disabled, so a
  // caller never passes a no-op next to a `canDoThis` flag.
  readonly onPrevious?: () => void;
  readonly onNext?: () => void;
  readonly onShuffle?: () => void;
  // The search button belongs to whoever owns the filter, so it arrives as a
  // slot. The theme toggle needs nothing, so the bar renders it itself.
  readonly searchControl?: ReactNode;
}

// The narrow layout's one row of controls, pinned under the card by the deck's
// own flex column rather than floated over it: the bar reserves its height, so
// nothing it holds can ever sit on top of a card face.
export function DeckToolbar({
  onPrevious,
  onNext,
  onShuffle,
  searchControl,
}: DeckToolbarProps) {
  return (
    <nav aria-label="Card controls" className="deck-toolbar w-full shrink-0">
      <span className="deck-toolbar-cell">
        <button
          type="button"
          aria-label="Previous card"
          disabled={onPrevious === undefined}
          onClick={onPrevious}
          className="deck-toolbar-button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </span>

      <span className="deck-toolbar-cell">
        <ThemeToggle compact />
      </span>

      <span className="deck-toolbar-cell">
        <button
          type="button"
          aria-label="Shuffle"
          disabled={onShuffle === undefined}
          onClick={(event) => {
            onShuffle?.();

            // Same reason as everywhere else: the deck hands Enter and Space to
            // whichever button holds focus, so a pointer click that kept focus
            // here would reshuffle instead of flipping the card.
            if (event.detail > 0) event.currentTarget.blur();
          }}
          className="deck-toolbar-button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.8-1.1 2-1.7 3.3-1.7H22" />
            <path d="m18 2 4 4-4 4" />
            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
            <path d="M22 18h-2.1c-1.3 0-2.5-.6-3.3-1.7l-.5-.7" />
            <path d="m18 14 4 4-4 4" />
          </svg>
        </button>
      </span>

      <span className="deck-toolbar-cell">{searchControl}</span>

      <span className="deck-toolbar-cell">
        <button
          type="button"
          aria-label="Next card"
          disabled={onNext === undefined}
          onClick={onNext}
          className="deck-toolbar-button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
            focusable="false"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </span>
    </nav>
  );
}
