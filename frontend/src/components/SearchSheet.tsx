"use client";

import { EMPTY_FILTER, type CardFilter } from "@/lib/filterCards";
import { Dialog } from "./Dialog";
import { SearchBar } from "./SearchBar";

interface SearchSheetProps {
  readonly filter: CardFilter;
  readonly types: readonly string[];
  readonly resultCount: number;
  readonly totalCount: number;
  readonly onFilterChange: (filter: CardFilter) => void;
  readonly onClose: () => void;
}

export function SearchSheet({
  filter,
  types,
  resultCount,
  totalCount,
  onFilterChange,
  onClose,
}: SearchSheetProps) {
  const isFilterActive = filter.query !== "" || filter.type !== null;

  return (
    // Anchored to the top rather than centred: the field must stay clear of the
    // on-screen keyboard, and the deck it is filtering stays visible below it.
    <Dialog
      label="Search the deck"
      className="card-search-sheet max-w-[420px] gap-4 self-start rounded-card border border-rule bg-panel p-4"
      onClose={onClose}
    >
      <SearchBar
        filter={filter}
        types={types}
        resultCount={resultCount}
        totalCount={totalCount}
        autoFocus
        onFilterChange={onFilterChange}
      />

      <div className="flex items-center justify-between gap-3">
        {isFilterActive ? (
          <button
            type="button"
            onClick={() => onFilterChange(EMPTY_FILTER)}
            className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-ink-faint underline underline-offset-4 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
          >
            Clear all filters
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 items-center rounded-full border border-control-border bg-control px-4 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
        >
          Done
        </button>
      </div>
    </Dialog>
  );
}
