"use client";

interface SearchTriggerProps {
  readonly isFilterActive: boolean;
  // Square cell in the toolbar, small round chip in the header.
  readonly compact?: boolean;
  readonly onOpen: () => void;
}

// A dismissed sheet leaves its filter in force, so a deck holding three cards
// would otherwise be a mystery with no visible cause. The dot — and the name a
// screen reader hears — is that cause.
export function SearchTrigger({
  isFilterActive,
  compact = false,
  onOpen,
}: SearchTriggerProps) {
  return (
    <button
      type="button"
      aria-label={
        isFilterActive ? "Search the deck, filter active" : "Search the deck"
      }
      onClick={(event) => {
        onOpen();

        if (event.detail > 0) event.currentTarget.blur();
      }}
      className={
        compact
          ? "deck-toolbar-button relative"
          : "relative flex h-7 w-7 items-center justify-center rounded-full border border-control-border bg-control text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
      }
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={compact ? "h-5 w-5" : "h-3.5 w-3.5"}
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      {isFilterActive && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent"
        />
      )}
    </button>
  );
}
