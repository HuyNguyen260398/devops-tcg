"use client";

import type { CardFilter } from "@/lib/filterCards";
import { Dialog } from "./Dialog";
import { SearchBar } from "./SearchBar";

interface SearchSheetProps {
  readonly filter: CardFilter;
  readonly types: readonly string[];
  readonly resultCount: number;
  readonly totalCount: number;
  readonly onFilterChange: (filter: CardFilter) => void;
  readonly onClose: () => void;
  readonly fallbackFocus?: () => HTMLElement | null;
}

export function SearchSheet({
  filter,
  types,
  resultCount,
  totalCount,
  onFilterChange,
  onClose,
  fallbackFocus,
}: SearchSheetProps) {
  return (
    // Anchored to the top rather than centred: the field must stay clear of the
    // on-screen keyboard, and the deck it is filtering stays visible below it.
    <Dialog
      label="Search the deck"
      className="card-search-sheet max-w-[420px] self-start rounded-card border border-rule p-4"
      onClose={onClose}
      fallbackFocus={fallbackFocus}
    >
      {/* A touch screen has no Escape key, and a backdrop tap is a guess; the
          sheet says how to leave it. Done rather than Close: the filter stays
          in force, so the reader is finishing a search, not cancelling one. */}
      <div className="-mt-2 mb-1 flex items-center justify-between">
        <h2 className="font-display text-xs font-bold uppercase tracking-[0.22em] text-accent">
          Search
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="-mr-2 flex h-11 min-w-[44px] items-center justify-center rounded-full px-3 text-sm font-semibold text-control-ink transition-colors duration-200 hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
        >
          Done
        </button>
      </div>
      <SearchBar
        filter={filter}
        types={types}
        resultCount={resultCount}
        totalCount={totalCount}
        autoFocus
        onFilterChange={onFilterChange}
      />
    </Dialog>
  );
}
