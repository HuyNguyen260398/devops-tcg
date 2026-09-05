"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EMPTY_FILTER,
  cardTypes,
  filterCards,
  type CardFilter,
} from "@/lib/filterCards";
import { focusableWithin } from "@/lib/focusTrap";
import type { RandomSource } from "@/lib/shuffle";
import {
  DEFAULT_VIEW_MODE,
  readStoredViewMode,
  storeViewMode,
  type ViewMode,
} from "@/lib/viewMode";
import type { ConceptCardData } from "@/types/concept";
import { AppHeader } from "./AppHeader";
import { CardDialog } from "./CardDialog";
import { CardGrid } from "./CardGrid";
import { ConceptDeck } from "./ConceptDeck";
import { DeckToolbar } from "./DeckToolbar";
import { EmptyResults } from "./EmptyResults";
import { SearchBar } from "./SearchBar";
import { SearchSheet } from "./SearchSheet";
import { SearchTrigger } from "./SearchTrigger";

// Where the grid becomes worth offering: three columns of 13rem tiles fit, and
// it is the conventional desktop boundary. Below it the carousel is the only
// layout, which is why the deck keeps every rank in RANK_BREAKPOINTS — the deck
// view stays reachable at every width.
export const GRID_MEDIA_QUERY = "(min-width: 1024px)";

interface ConceptExplorerProps {
  readonly cards: readonly ConceptCardData[];
  readonly random?: RandomSource;
}

export function ConceptExplorer({ cards, random }: ConceptExplorerProps) {
  const [filter, setFilter] = useState<CardFilter>(EMPTY_FILTER);
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);
  // null until the viewport has been measured. The server cannot know it, so
  // nothing that depends on it renders before the first effect flush — the same
  // way the deck holds a placeholder until its shuffle has run.
  const [isWide, setIsWide] = useState<boolean | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchSlotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      setIsWide(false);
      return;
    }

    const media = window.matchMedia(GRID_MEDIA_QUERY);
    const apply = () => setIsWide(media.matches);

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => setViewMode(readStoredViewMode()), []);

  // Identity matters: the deck re-deals whenever its `cards` prop changes
  // identity, so this must not produce a fresh array on every render.
  const visibleCards = useMemo(
    () => filterCards(cards, filter),
    [cards, filter],
  );
  const types = useMemo(() => cardTypes(cards), [cards]);

  const isFilterActive = filter.query !== "" || filter.type !== null;
  const showGrid = isWide === true && viewMode === "grid";

  const chooseView = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    storeViewMode(mode);
    // A card selected in the grid has no dialog to live in once the carousel
    // takes over.
    setSelectedId(null);
  }, []);

  // The spec asks for focus to land on whichever search control is on screen —
  // the header input when wide, the magnifier when narrow — because the sheet
  // that holds the input may well be closed by the time this runs.
  const clearFilter = useCallback(() => {
    setFilter(EMPTY_FILTER);
    const slot = searchSlotRef.current;

    if (slot !== null) focusableWithin(slot)[0]?.focus();
  }, []);

  // A filter can remove the card the dialog is showing; -1 simply closes it.
  const selectedIndex =
    selectedId === null
      ? -1
      : visibleCards.findIndex((card) => card.id === selectedId);

  // On a narrow viewport the search button is not in the header at all: it is
  // handed to the deck's control bar, which is where every control now lives.
  const searchSlot =
    isWide === true ? (
      <SearchBar
        filter={filter}
        types={types}
        resultCount={visibleCards.length}
        totalCount={cards.length}
        onFilterChange={setFilter}
      />
    ) : undefined;

  const searchControl =
    isWide === false ? (
      <SearchTrigger
        compact
        isFilterActive={isFilterActive}
        onOpen={() => setIsSearchOpen(true)}
      />
    ) : undefined;

  const isModalOpen =
    (showGrid && selectedIndex >= 0) || (isWide === false && isSearchOpen);

  return (
    <div className="app-stage relative z-10 flex min-h-0 w-full flex-col">
      {/* Everything behind an open modal leaves the accessibility tree. The
          dialog's own trap already keeps Tab inside it; this is what stops a
          screen reader wandering the grid underneath. */}
      <div
        aria-hidden={isModalOpen || undefined}
        className={`mx-auto flex min-h-0 w-full flex-1 flex-col ${
          showGrid ? "max-w-7xl" : "max-w-5xl items-center"
        }`}
      >
        <AppHeader
          viewMode={viewMode}
          canChooseView={isWide === true}
          showThemeToggle={isWide !== false}
          onViewModeChange={chooseView}
        >
          {searchSlot === undefined ? undefined : (
            <div ref={searchSlotRef} className="w-full">
              {searchSlot}
            </div>
          )}
        </AppHeader>

        {isWide === null ? (
          <div
            role="status"
            aria-busy="true"
            aria-label="Preparing the deck"
            className="min-h-0 w-full flex-1"
          />
        ) : visibleCards.length === 0 ? (
          <>
            <EmptyResults query={filter.query} onClear={clearFilter} />
            {/* There is no deck to carry the bar here, and this is the one
                moment the reader most needs the search button back. */}
            {isWide === false && <DeckToolbar searchControl={searchControl} />}
          </>
        ) : showGrid ? (
          <CardGrid
            cards={visibleCards}
            onSelect={(card) => setSelectedId(card.id)}
          />
        ) : (
          <ConceptDeck
            cards={visibleCards}
            random={random}
            compactControls={isWide === false}
            searchControl={searchControl}
          />
        )}
      </div>

      {showGrid && selectedIndex >= 0 && (
        <CardDialog
          cards={visibleCards}
          index={selectedIndex}
          random={random}
          onIndexChange={(index) => setSelectedId(visibleCards[index].id)}
          onClose={() => setSelectedId(null)}
        />
      )}

      {isWide === false && isSearchOpen && (
        <SearchSheet
          filter={filter}
          types={types}
          resultCount={visibleCards.length}
          totalCount={cards.length}
          onFilterChange={setFilter}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </div>
  );
}
