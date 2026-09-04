# Searchable Card Explorer Design

**Date:** 2026-09-04
**Status:** Approved

## Problem

The deck holds twenty-eight cards and keeps growing. The carousel is the only
way in, so reaching a named card means stepping past every card between it and
the one in hand, or shuffling until it turns up. There is no way to ask for
"the security cards" or "the one about caching", and a wide desktop screen
spends its width on shrunken, tilted neighbours rather than on showing more of
the deck.

Three things follow:

1. A desktop browser needs a layout that shows the whole deck at once.
2. Every viewport needs a search that reaches a card by name, by category, or
   by keyword, filtering as each character is typed.
3. That search has to fit a 320x700 phone, where the layout is a locked
   `100dvh` column and card height is the scarce resource.

## Goals

- A grid layout for viewports at or above 1024px, showing every card at once
  and scrolling within the locked shell.
- A single search control whose text matches title, type, keywords and
  definition at once, ANDed with a row of category chips.
- Results recomputed on every keystroke, with a live count.
- The search reachable on a phone without taking height from the card.
- The existing carousel — slot travel, reel, gestures, flip — preserved and
  reachable at every width.

## Non-Goals

- No backend, API, or network request. Filtering is a pure function over the
  hardcoded array.
- No new runtime dependency. No search library, no fuzzy matcher, no modal or
  focus-trap library, no state library.
- No URL state, no query-string persistence, no routing. The export is static
  and single-page.
- No change to `ConceptCardData`, to any card's content, or to any image asset.
- No reordering or sorting controls. Card-number order is the grid's order.
- No search over `components` or `howItWorks` prose.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Desktop layout | Scrolling grid of every card | Shows the whole deck at once, which is the thing the carousel cannot do. |
| Opening a card on desktop | Modal dialog holding the real `ConceptCard` | The back face needs a full card's room; a grid tile has none. Reuses the flip wholesale. |
| Search matching | Case-insensitive substring, all tokens must match | Predictable over 28 cards, needs no dependency, and `tls` must not surface "Terraform State". |
| Category filter | Chips derived from the data, ANDed with the text | Type is the one filter with a fixed known set, so it deserves to be visible rather than guessed at. |
| Mobile search | Magnifier in the header opening a sheet | The locked column has no height to spare; a permanent bar would cost the card roughly 5rem. |
| Carousel on desktop | Kept, behind a grid/deck view toggle | `RANK_BREAKPOINTS` only widens the spread above 1110px. Retiring the carousel on desktop would make ranks 2-4 dead code. |
| Grid boundary | 1024px | The conventional desktop boundary, and above the point where a grid has room for three columns. |
| View preference | `localStorage`, no pre-paint script | The layout already waits a mount-time measurement, so there is no wrong-layout flash for a script to prevent. |

## Architecture

### Component tree

```
app/page.tsx
└─ ConceptExplorer               NEW  owns query, type, view mode, layout mode
   ├─ AppHeader                  NEW  <h1>, ThemeToggle, ViewToggle, search affordance
   ├─ SearchBar                  NEW  input + clear + chips + count (presentational)
   │                                  rendered in the header when wide,
   │                                  inside SearchSheet when narrow
   ├─ CardGrid                   NEW  grid view
   │  └─ CardTile                NEW  one tile per filtered card
   ├─ CardDialog                 NEW  Dialog + ConceptCard (reused)
   ├─ SearchSheet                NEW  Dialog + SearchBar (narrow viewports)
   ├─ Dialog                     NEW  focus trap, Esc, backdrop, focus restore
   ├─ EmptyResults               NEW  both views
   └─ ConceptDeck                MOD  deck view; header shrinks to the counter
```

Supporting pure modules:

```
lib/filterCards.ts   NEW  matching and category derivation
lib/focusTrap.ts     NEW  focusable-element discovery and tab cycling
lib/viewMode.ts      NEW  the "grid" | "deck" union and its storage
```

### Data flow

Data still flows one way. `conceptCards` reaches `ConceptExplorer`, which holds
the only new state in the application:

```
conceptCards ─┐
              ├─► filterCards(cards, { query, type })  ──► visibleCards
{query, type}─┘                                              │
                                                             ├─► CardGrid  (grid view)
                                                             │     └─► CardDialog
                                                             └─► ConceptDeck (deck view)
```

`visibleCards` is memoised on `(cards, query, type)`, which matters: `ConceptDeck`
re-deals its order whenever the `cards` prop identity changes, so an unmemoised
array would reshuffle the deck on every render, not merely on every change of
result.

`ConceptExplorer` also holds two mode values, neither of which the server can
know:

- **layout mode** (`"grid" | "deck"` availability) — measured from
  `matchMedia("(min-width: 1024px)")` after mount, with a `change` listener.
- **view mode** (`"grid" | "deck"` preference) — read from `localStorage` after
  mount, written on every toggle. Only consulted while the layout mode is wide.

Until the layout measurement lands, the explorer renders a layout-stable
skeleton. This is the pattern `ConceptDeck` already uses for the shuffle and for
`RANK_BREAKPOINTS`: the server render stays deterministic, and the reader never
sees one layout replaced by another.

## Filtering

### Interface

```ts
export interface CardFilter {
  readonly query: string;
  readonly type: string | null;   // null means every category
}

export function cardTypes(
  cards: readonly ConceptCardData[],
): readonly string[];

export function filterCards(
  cards: readonly ConceptCardData[],
  filter: CardFilter,
): readonly ConceptCardData[];
```

### Matching rules

- The query is lowercased, trimmed, and split on whitespace into tokens. An
  empty or whitespace-only query matches every card.
- A card matches when **every** token appears as a substring of its haystack.
  Tokens AND rather than OR, so a second word always narrows.
- The haystack is `title`, `type`, every entry of `keywords`, and `definition`,
  lowercased and joined by spaces. `components` and `howItWorks` are excluded:
  their prose is long enough to match almost anything, which makes the filter
  feel arbitrary.
- `type` ANDs with the text, compared exactly against `card.type`.
- Input order is preserved. Nothing is ranked or re-sorted, so the grid is
  always in card-number order and a filter only ever removes tiles.

`cardTypes` returns each distinct `type` once, in the order it first appears in
the data. The chip row is built from it, so adding a twenty-ninth card in a
fifth category stays a data change — consistent with the rule that adding a card
never requires a component redesign.

### Worked examples

| Query | Chip | Result |
| --- | --- | --- |
| `tls` | All | TLS (title), plus any card listing a `tls` keyword |
| `security` | All | Every SECURITY card, by type match |
| `caching` | All | Proxy, CDN, Redis, by keyword match |
| `aws` | SECURITY | AWS IAM Role, AWS IAM Policy |
| `reverse proxy` | All | Cards whose haystack holds both words |
| `zzz` | All | Nothing; the empty state renders |

## Desktop grid

A `<ul>` of `<li>`, each holding a `<button>` whose accessible name is the card
title. A tile shows both artworks — the WebP and the sketch SVG, swapped by the
active `data-theme` exactly as `CardFront` does — plus the card number, the type
chip, and the title. It deliberately omits the definition: a tile is for
recognising a card, not for reading it.

Columns come from `repeat(auto-fill, minmax(13rem, 1fr))`. The grid scrolls
**inside** the locked `100dvh` shell rather than scrolling the page, so
`body { overflow: hidden }` and the no-page-scroll invariant are untouched and
the header stays put.

Shuffle is not offered in grid view. A grid has nothing to reel, and the deck
view keeps the control.

## Card dialog

Selecting a tile opens `CardDialog`: `role="dialog"`, `aria-modal="true"`,
labelled by the card title, holding the real `ConceptCard` with `isActive`. Every
existing flip affordance therefore keeps working unchanged — click, Enter,
Space, and the coin-toss flip direction.

- Previous and Next walk the **filtered** list and wrap at both ends.
- The position counter reads against the filtered length, so it agrees with the
  result count.
- Esc, the close button, and a backdrop click all close it and return focus to
  the tile that opened it.
- While it is open the content behind it is `aria-hidden` and outside the tab
  cycle.

`Dialog` owns focus entry, tab cycling, Esc, backdrop dismissal, focus restore,
and hiding the background. `SearchSheet` renders through the same component, so
there is exactly one modal implementation to get right and one to test.

`lib/focusTrap.ts` holds the DOM-level halves that can be tested without a
render: discovering the focusable elements inside a container, and choosing the
next element for a given Tab or Shift+Tab.

## Mobile search

The header gains a magnifier button beside the theme toggle, so the card gives
up no height. It opens `SearchSheet` — the same `Dialog` — containing the text
input (autofocused), the category chips on a horizontally scrolling strip, a
live "12 of 28 cards" count, and a control that clears both filters at once.

Filtering applies live to the deck behind the sheet, so the count and the deck
agree before the sheet is dismissed. Dismissing leaves the filter in force, and
the magnifier carries a dot while either filter is active — without it, a deck
holding three cards after a forgotten filter is a mystery with no visible cause.

## `ConceptDeck` changes

`DeckHeader` gives up the `<h1>` and `ThemeToggle` to `AppHeader` and keeps only
the polite position counter. The result is visually identical, because the
counter sits directly beneath the header either way, but `ConceptDeck` stops
being the application shell and becomes only the carousel.

Nothing else in it changes. Slot travel, the reel, the gesture handling, the
flip, `RANK_BREAKPOINTS` and the placeholder all stay exactly as they are, and
the component keeps its `cards` and `random` props. `RANK_BREAKPOINTS` in
particular stays whole: the deck view is reachable at every width, so ranks two
through four remain live.

## View toggle

`lib/viewMode.ts` mirrors `lib/theme.ts` in shape:

```ts
export type ViewMode = "grid" | "deck";
export const DEFAULT_VIEW_MODE: ViewMode;         // "grid"
export const VIEW_MODE_STORAGE_KEY = "devops-tcg-view";
export function resolveViewMode(value: unknown): ViewMode;
export function readStoredViewMode(): ViewMode;
export function storeViewMode(mode: ViewMode): void;
```

Reads and writes tolerate a throwing or absent `localStorage`, as the theme
module does.

The toggle renders only while the layout measurement says the viewport is at
least 1024px wide. Below that the carousel is the only layout and the control is
absent rather than disabled. A first visit on a wide screen opens on the grid.

Unlike the theme, the view preference gets **no** pre-paint inline script. The
theme needs one because a stored sketch choice would otherwise flash neon before
hydration; the layout needs none, because nothing renders until the mount-time
measurement lands, so there is no wrong layout to flash. Adding a second script
would be a second thing to keep in sync for no gain.

## Empty results

When the filter matches nothing, both views render `EmptyResults`: the query
that matched nothing, and a button that clears the text and the chip together.
Focus then goes to whichever search control is on screen — the header input on a
wide viewport, and the header's magnifier button on a narrow one, since the
sheet that holds the input may well be closed. `ConceptDeck` is never handed an empty
array — the explorer renders the empty state instead — so its own "No concept
cards available." message stays what it is today, a data-integrity fallback.

A filter matching exactly one card is not an error: the deck already disables
shuffle and the arrows when it holds fewer than two cards.

## Error handling

- `localStorage` unavailable or throwing: `readStoredViewMode` returns the
  default and `storeViewMode` is a no-op. The application works, the preference
  simply does not survive a reload.
- `matchMedia` absent: the layout mode stays narrow, so the deck renders. The
  application degrades to today's behaviour rather than to nothing.
- An image failing to load in a tile leaves the title and type readable, as the
  card faces already do.
- Anything other than `"grid"` or `"deck"` in storage resolves to the default.

## Testing

### Unit (Vitest, jsdom)

| File | Covers |
| --- | --- |
| `lib/filterCards.test.ts` | Token AND, case-insensitivity, each haystack field, type AND text, empty query, no match, order preservation, `cardTypes` uniqueness and order |
| `lib/focusTrap.test.ts` | Focusable discovery, forward and backward cycling, wrap at both ends, empty container |
| `lib/viewMode.test.ts` | Resolve, read, write, throwing storage, unknown value |
| `SearchBar.test.tsx` | Keystroke reporting, clear button, chip selection and deselection, count text |
| `CardGrid.test.tsx` | One tile per card, accessible names, selection callback, both artworks present |
| `CardDialog.test.tsx` | Flip, wrap-around navigation, counter against the filtered length, Esc, focus restore |
| `ConceptExplorer.test.tsx` | Keystroke narrows the visible list, chip ANDs with text, empty state and its clear button, mode switch through mocked `matchMedia`, view toggle persistence |

Coverage thresholds hold unchanged: lines 85, functions 85, branches 80,
statements 85.

### End-to-end (Playwright)

- `chromium` (1280x720) exercises the grid: tiles present, typing narrows them,
  a chip narrows them further, a tile opens the dialog, the dialog flips and
  navigates, Esc restores focus, and the view toggle reaches the carousel.
- `mobile` (320x700) exercises the sheet: the magnifier opens it, typing filters
  the deck behind, dismissal keeps the filter, the active-filter dot shows, and
  the document has no horizontal overflow at 320px.
- The existing carousel assertions in `e2e/concept-deck.spec.ts` gain a step that
  switches to deck view first when running wide, so both projects keep covering
  the carousel rather than leaving it tested on phones alone.

## Constraints

- Runtime dependencies stay exactly `next`, `react`, `react-dom`.
- Every new colour, radius and font comes from a theme token declared twice in
  `globals.css` — once on `:root` and once on `[data-theme="sketch"]`. No
  palette utility, no hex literal, and no Tailwind opacity modifier on a token.
- Every new transition is zeroed under `prefers-reduced-motion: reduce`.
- No horizontal document overflow at 320px.
- The shell stays a locked `100dvh` with `body { overflow: hidden }`. New
  scrolling happens inside a container, never on the page.
- Icons are inline SVG. No icon package.
- `docs/architecture.md` -> "Intentionally Absent" is amended for the second
  `localStorage` key, as it was for the theme.
- `CLAUDE.md` is amended to describe the explorer, the filter contract, and the
  two layouts.
