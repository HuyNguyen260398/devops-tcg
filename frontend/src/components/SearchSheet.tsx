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
}

export function SearchSheet({
  filter,
  types,
  resultCount,
  totalCount,
  onFilterChange,
  onClose,
}: SearchSheetProps) {
  return (
    // Anchored to the top rather than centred: the field must stay clear of the
    // on-screen keyboard, and the deck it is filtering stays visible below it.
    <Dialog
      label="Search the deck"
      className="card-search-sheet max-w-[420px] self-start rounded-card border border-rule bg-panel p-4"
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
    </Dialog>
  );
}
