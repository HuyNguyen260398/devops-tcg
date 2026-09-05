"use client";

import { useId } from "react";
import type { CardFilter } from "@/lib/filterCards";

interface SearchBarProps {
  readonly filter: CardFilter;
  readonly types: readonly string[];
  readonly resultCount: number;
  readonly totalCount: number;
  readonly autoFocus?: boolean;
  readonly onFilterChange: (filter: CardFilter) => void;
}

const chipClassName = (selected: boolean) =>
  `search-chip shrink-0 rounded-full border px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.16em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--paper)] ${
    selected
      ? "border-type-chip-border bg-type-chip text-type-chip-ink"
      : "border-control-border bg-control text-control-ink hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)]"
  }`;

export function SearchBar({
  filter,
  types,
  resultCount,
  totalCount,
  autoFocus = false,
  onFilterChange,
}: SearchBarProps) {
  // The bar is mounted in the header on a wide screen and inside the sheet on a
  // narrow one, so its ids must not collide if both ever coexist.
  const fieldId = useId();

  return (
    <div className="search-bar flex w-full flex-col gap-2">
      <div className="relative flex w-full items-center">
        <label className="sr-only" htmlFor={fieldId}>
          Search cards
        </label>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-3 h-4 w-4 text-ink-faint"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={fieldId}
          type="search"
          value={filter.query}
          autoFocus={autoFocus}
          placeholder="Name, category or keyword"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) =>
            onFilterChange({ ...filter, query: event.target.value })
          }
          className="search-input h-10 w-full rounded-full border border-control-border bg-control pl-9 pr-10 text-sm text-control-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
        />
        {filter.query !== "" && (
          <button
            type="button"
            aria-label="Clear the search text"
            onClick={() => onFilterChange({ ...filter, query: "" })}
            className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-full text-ink-faint transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>

      {/* A strip rather than a wrap: at 320px four chips would otherwise take
          two rows out of a layout that has no rows to spare. */}
      <div className="search-chips flex w-full gap-2 overflow-x-auto">
        <button
          type="button"
          aria-label="All categories"
          aria-pressed={filter.type === null}
          onClick={() => onFilterChange({ ...filter, type: null })}
          className={chipClassName(filter.type === null)}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type}
            type="button"
            aria-pressed={filter.type === type}
            onClick={() =>
              onFilterChange({
                ...filter,
                type: filter.type === type ? null : type,
              })
            }
            className={chipClassName(filter.type === type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Shown as a score line, spoken as a sentence — the same pairing the
          deck counter uses, so "28 / 28" is never read out as a date. */}
      <p
        aria-label={`${resultCount} of ${totalCount} cards`}
        aria-live="polite"
        className="text-center font-mono text-xs font-semibold tracking-[0.14em] text-ink-muted"
      >
        {resultCount} / {totalCount}
      </p>
    </div>
  );
}
