# Searchable Card Explorer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the deck a desktop grid layout and a search control that filters
the twenty-eight cards by name, category or keyword on every keystroke, in both
the grid and the existing carousel, without taking height from the phone layout.

**Architecture:** A new `ConceptExplorer` becomes the application shell. It owns
the only new state — the filter, the stored view preference and a mount-time
viewport measurement — and feeds a memoised filtered array to either a new
`CardGrid` (wide viewports, grid view) or the existing `ConceptDeck` (everything
else). Matching is a pure function over the hardcoded array; every modal in the
feature renders through one shared `Dialog`.

**Tech Stack:** Next.js 14 (App Router, static export), React 18, TypeScript,
Tailwind CSS 3, Vitest + Testing Library (jsdom), Playwright.

**Spec:** `docs/superpowers/specs/2026-09-04-searchable-card-explorer-design.md`

## Global Constraints

- Runtime dependencies stay exactly `next`, `react`, `react-dom`. No search
  library, no fuzzy matcher, no modal or focus-trap library, no state library,
  no icon package. Icons are inline SVG.
- No backend, API, network request, cookie, or URL/query-string state. Filtering
  is a pure function over `src/data/conceptCards.ts`.
- No change to `ConceptCardData`, to any card's content, or to any image asset.
- Every new colour, radius and font comes from a CSS custom property declared
  twice in `globals.css` — once on `:root` (neon) and once on
  `[data-theme="sketch"]` — and reached through the semantic Tailwind names in
  `tailwind.config.ts`. Never `text-cyan-200`, never a hex literal in a
  component. Token values are opaque strings, so Tailwind opacity modifiers
  (`text-ink/60`) must not be applied to them.
- Every new transition is zeroed under `prefers-reduced-motion: reduce`.
- The shell stays a locked `100dvh` with `body { overflow: hidden }`. New
  scrolling happens inside a container, never on the document.
- No horizontal document overflow at 320px.
- No decorative `::after` on a card face, and a card face stays its own scroll
  container. Nothing may key off a card remount.
- Coverage thresholds hold: lines 85, functions 85, branches 80, statements 85.
- Node 20 (`.nvmrc`) + pnpm 9. All frontend commands run as
  `pnpm --dir frontend <script>` from the repo root.
- `pnpm --dir frontend build` must run before `test:e2e` — Playwright serves
  `frontend/out/`, not a dev server.
- Conventional commits, small and frequent. Work and commit directly on `main`.
  **Never push** — pushing `main` deploys to production.
- After every task, `pnpm --dir frontend format:check` must pass. Run
  `pnpm --dir frontend exec prettier --write <files>` if it does not.

## File Structure

| File | Responsibility |
| --- | --- |
| `frontend/src/lib/filterCards.ts` | **Create.** `CardFilter`, `EMPTY_FILTER`, `cardTypes`, `filterCards`. Pure, no React. |
| `frontend/src/lib/filterCards.test.ts` | **Create.** Unit tests for the above. |
| `frontend/src/lib/viewMode.ts` | **Create.** `ViewMode` union, storage key, tolerant read/write. Pure, no React. |
| `frontend/src/lib/viewMode.test.ts` | **Create.** Unit tests for the above. |
| `frontend/src/lib/focusTrap.ts` | **Create.** Focusable discovery and Tab cycling. Pure DOM, no React. |
| `frontend/src/lib/focusTrap.test.ts` | **Create.** Unit tests for the above. |
| `frontend/src/components/Dialog.tsx` | **Create.** The one modal: focus entry, tab trap, Esc, backdrop, focus restore. |
| `frontend/src/components/Dialog.test.tsx` | **Create.** Unit tests for the above. |
| `frontend/src/components/SearchBar.tsx` | **Create.** Input + clear + chips + live count. Presentational. |
| `frontend/src/components/SearchBar.test.tsx` | **Create.** Unit tests for the above. |
| `frontend/src/components/CardTile.tsx` | **Create.** One grid tile: both artworks, number, type, title. |
| `frontend/src/components/CardGrid.tsx` | **Create.** The scrolling grid of tiles. |
| `frontend/src/components/CardGrid.test.tsx` | **Create.** Unit tests for the grid and its tiles. |
| `frontend/src/components/CardDialog.tsx` | **Create.** `Dialog` + `ConceptCard`, with flip and wrap-around navigation. |
| `frontend/src/components/CardDialog.test.tsx` | **Create.** Unit tests for the above. |
| `frontend/src/components/SearchSheet.tsx` | **Create.** `Dialog` + `SearchBar` for narrow viewports. |
| `frontend/src/components/SearchSheet.test.tsx` | **Create.** Unit tests for the above. |
| `frontend/src/components/AppHeader.tsx` | **Create.** `<h1>`, a search slot, the view toggle, `ThemeToggle`. |
| `frontend/src/components/AppHeader.test.tsx` | **Create.** Unit tests for the above. |
| `frontend/src/components/SearchTrigger.tsx` | **Create.** The header magnifier, with its active-filter dot. |
| `frontend/src/components/EmptyResults.tsx` | **Create.** No-match state with a clear-filters button. |
| `frontend/src/components/EmptyResults.test.tsx` | **Create.** Unit tests for the above. |
| `frontend/src/components/ConceptExplorer.tsx` | **Create.** The shell: filter state, view mode, layout measurement, wiring. |
| `frontend/src/components/ConceptExplorer.test.tsx` | **Create.** Integration tests for the shell. |
| `frontend/src/components/ConceptDeck.tsx` | **Modify.** Shortcut guard for text fields and dialogs; `DeckHeader` loses the `<h1>` and `ThemeToggle`. |
| `frontend/src/components/ConceptDeck.test.tsx` | **Modify.** Header assertions follow the split; new guard tests. |
| `frontend/src/app/page.tsx` | **Modify.** Render `ConceptExplorer`. |
| `frontend/src/app/page.test.tsx` | **Modify.** Assert the explorer's default wide-viewport render. |
| `frontend/src/app/globals.css` | **Modify.** Tokens and layout rules for the dialog, chips, grid and shell. |
| `frontend/tailwind.config.ts` | **Modify.** Semantic names for any new token. |
| `frontend/vitest.setup.ts` | **Modify.** A `matchMedia` stub driven by `window.innerWidth`. |
| `frontend/e2e/card-explorer.spec.ts` | **Create.** Grid, search, dialog and sheet end to end. |
| `frontend/e2e/concept-deck.spec.ts` | **Modify.** Seed deck view before each test; scope the header-centring assertion. |
| `CLAUDE.md` | **Modify.** Document the explorer, the filter contract and the two layouts. |
| `docs/architecture.md` | **Modify.** Amend "Intentionally Absent" for the second storage key. |

---

### Task 1: The filter contract

**Files:**

- Create: `frontend/src/lib/filterCards.ts`
- Test: `frontend/src/lib/filterCards.test.ts`

**Interfaces:**

- Consumes: `ConceptCardData` from `@/types/concept`.
- Produces:
  `interface CardFilter { readonly query: string; readonly type: string | null }`;
  `const EMPTY_FILTER: CardFilter`;
  `cardTypes(cards: readonly ConceptCardData[]): readonly string[]`;
  `filterCards(cards: readonly ConceptCardData[], filter: CardFilter): readonly ConceptCardData[]`.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/lib/filterCards.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import type { ConceptCardData } from "@/types/concept";
import { EMPTY_FILTER, cardTypes, filterCards } from "./filterCards";

const card = (
  id: string,
  title: string,
  type: string,
  keywords: readonly string[],
  definition: string,
): ConceptCardData => ({
  id,
  cardNumber: "#001",
  type,
  title,
  image: {
    src: `/images/${id}.webp`,
    alt: `${title} photograph`,
    sketch: { src: `/images/${id}-sketch.svg`, alt: `${title} drawing` },
  },
  definition,
  keywords,
  components: [],
  howItWorks: [],
});

const fixtures: readonly ConceptCardData[] = [
  card("proxy", "Proxy", "NETWORK", ["caching", "routing"], "Forwards a request."),
  card("tls", "TLS", "SECURITY", ["handshake"], "Encrypts a connection."),
  card("state", "Terraform State", "PLATFORM", ["drift"], "Records real resources."),
];

describe("cardTypes", () => {
  it("lists each type once in the order it first appears", () => {
    expect(cardTypes(fixtures)).toEqual(["NETWORK", "SECURITY", "PLATFORM"]);
  });

  it("collapses repeats rather than listing a type twice", () => {
    expect(cardTypes([...fixtures, fixtures[0]])).toEqual([
      "NETWORK",
      "SECURITY",
      "PLATFORM",
    ]);
  });

  it("derives the shipped deck's four categories from the data", () => {
    expect([...cardTypes(conceptCards)].sort()).toEqual([
      "COMPUTE",
      "NETWORK",
      "PLATFORM",
      "SECURITY",
    ]);
  });
});

describe("filterCards", () => {
  it("returns the deck untouched when nothing is filtered", () => {
    expect(filterCards(fixtures, EMPTY_FILTER)).toBe(fixtures);
  });

  it("ignores a query that is only whitespace", () => {
    expect(filterCards(fixtures, { query: "   ", type: null })).toBe(fixtures);
  });

  it("matches a title regardless of case", () => {
    expect(filterCards(fixtures, { query: "TlS", type: null })).toEqual([
      fixtures[1],
    ]);
  });

  it("matches a category typed as text", () => {
    expect(filterCards(fixtures, { query: "security", type: null })).toEqual([
      fixtures[1],
    ]);
  });

  it("matches a keyword", () => {
    expect(filterCards(fixtures, { query: "caching", type: null })).toEqual([
      fixtures[0],
    ]);
  });

  it("matches a word from the definition", () => {
    expect(filterCards(fixtures, { query: "encrypts", type: null })).toEqual([
      fixtures[1],
    ]);
  });

  it("requires every token to match, so a second word narrows", () => {
    expect(
      filterCards(fixtures, { query: "terraform drift", type: null }),
    ).toEqual([fixtures[2]]);
    expect(
      filterCards(fixtures, { query: "terraform caching", type: null }),
    ).toEqual([]);
  });

  it("does not surface a card that merely shares letters", () => {
    expect(filterCards(fixtures, { query: "tls", type: null })).toEqual([
      fixtures[1],
    ]);
  });

  it("ands the category chip with the text", () => {
    expect(filterCards(fixtures, { query: "a", type: "NETWORK" })).toEqual([
      fixtures[0],
    ]);
    expect(filterCards(fixtures, { query: "tls", type: "NETWORK" })).toEqual([]);
  });

  it("filters by category alone", () => {
    expect(filterCards(fixtures, { query: "", type: "PLATFORM" })).toEqual([
      fixtures[2],
    ]);
  });

  it("keeps the input order rather than ranking matches", () => {
    const matched = filterCards(fixtures, { query: "s", type: null });

    expect(matched.map((entry) => entry.id)).toEqual(
      fixtures.filter((entry) => matched.includes(entry)).map((entry) => entry.id),
    );
  });

  it("returns nothing when no card matches", () => {
    expect(filterCards(fixtures, { query: "zzz", type: null })).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `pnpm --dir frontend exec vitest run src/lib/filterCards.test.ts`
Expected: FAIL — `Failed to resolve import "./filterCards"`.

- [ ] **Step 3: Write the implementation**

Create `frontend/src/lib/filterCards.ts`:

```ts
import type { ConceptCardData } from "@/types/concept";

export interface CardFilter {
  readonly query: string;
  // null is every category, so "no chip chosen" is a value rather than a
  // separate flag the callers would have to keep in step with the query.
  readonly type: string | null;
}

export const EMPTY_FILTER: CardFilter = { query: "", type: null };

export const cardTypes = (
  cards: readonly ConceptCardData[],
): readonly string[] => [...new Set(cards.map((card) => card.type))];

// Everything one typed word may reach, in one string. `components` and
// `howItWorks` are deliberately left out: their prose is long enough to match
// almost any word, which makes the filter feel arbitrary rather than helpful.
const haystack = (card: ConceptCardData): string =>
  [card.title, card.type, ...card.keywords, card.definition]
    .join(" ")
    .toLowerCase();

const tokenize = (query: string): readonly string[] =>
  query.toLowerCase().split(/\s+/).filter(Boolean);

export const filterCards = (
  cards: readonly ConceptCardData[],
  { query, type }: CardFilter,
): readonly ConceptCardData[] => {
  const tokens = tokenize(query);

  // Identity matters as much as the value: the deck re-deals its order
  // whenever its `cards` prop changes identity, so an unfiltered deck must
  // hand back the very array it was given.
  if (tokens.length === 0 && type === null) return cards;

  return cards.filter((card) => {
    if (type !== null && card.type !== type) return false;

    const text = haystack(card);

    // Tokens AND rather than OR, so a second word always narrows.
    return tokens.every((token) => text.includes(token));
  });
};
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `pnpm --dir frontend exec vitest run src/lib/filterCards.test.ts`
Expected: PASS, 15 tests.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/filterCards.ts frontend/src/lib/filterCards.test.ts
git commit -m "feat: add the card filter contract"
```

---

### Task 2: The view-mode contract

**Files:**

- Create: `frontend/src/lib/viewMode.ts`
- Test: `frontend/src/lib/viewMode.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `type ViewMode = "grid" | "deck"`; `VIEW_MODES: readonly ViewMode[]`;
  `DEFAULT_VIEW_MODE: ViewMode`; `VIEW_MODE_STORAGE_KEY: string`;
  `resolveViewMode(value: unknown): ViewMode`; `readStoredViewMode(): ViewMode`;
  `storeViewMode(mode: ViewMode): void`.

This mirrors `frontend/src/lib/theme.ts` deliberately: same shape, same
tolerance for a storage that is absent or throws.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/lib/viewMode.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_VIEW_MODE,
  VIEW_MODE_STORAGE_KEY,
  readStoredViewMode,
  resolveViewMode,
  storeViewMode,
} from "./viewMode";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("resolveViewMode", () => {
  it("keeps a known mode", () => {
    expect(resolveViewMode("deck")).toBe("deck");
    expect(resolveViewMode("grid")).toBe("grid");
  });

  it("falls back to the default for anything else", () => {
    expect(resolveViewMode("carousel")).toBe(DEFAULT_VIEW_MODE);
    expect(resolveViewMode(null)).toBe(DEFAULT_VIEW_MODE);
    expect(resolveViewMode(7)).toBe(DEFAULT_VIEW_MODE);
  });

  it("opens on the grid by default", () => {
    expect(DEFAULT_VIEW_MODE).toBe("grid");
  });
});

describe("readStoredViewMode", () => {
  it("reads a stored mode", () => {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, "deck");

    expect(readStoredViewMode()).toBe("deck");
  });

  it("returns the default when nothing is stored", () => {
    expect(readStoredViewMode()).toBe(DEFAULT_VIEW_MODE);
  });

  it("returns the default when the read itself throws", () => {
    vi.spyOn(window.localStorage, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(readStoredViewMode()).toBe(DEFAULT_VIEW_MODE);
  });
});

describe("storeViewMode", () => {
  it("writes the mode", () => {
    storeViewMode("deck");

    expect(window.localStorage.getItem(VIEW_MODE_STORAGE_KEY)).toBe("deck");
  });

  it("swallows a blocked write", () => {
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(() => storeViewMode("grid")).not.toThrow();
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `pnpm --dir frontend exec vitest run src/lib/viewMode.test.ts`
Expected: FAIL — `Failed to resolve import "./viewMode"`.

- [ ] **Step 3: Write the implementation**

Create `frontend/src/lib/viewMode.ts`:

```ts
export type ViewMode = "grid" | "deck";

export const VIEW_MODES: readonly ViewMode[] = ["grid", "deck"];

// A wide screen opens on the grid: the whole deck at once is the thing the
// carousel cannot do, and the toggle is right there for the reader who wants
// the carousel back.
export const DEFAULT_VIEW_MODE: ViewMode = "grid";

export const VIEW_MODE_STORAGE_KEY = "devops-tcg-view";

export const resolveViewMode = (value: unknown): ViewMode =>
  typeof value === "string" && (VIEW_MODES as readonly string[]).includes(value)
    ? (value as ViewMode)
    : DEFAULT_VIEW_MODE;

// As with the theme: a privacy mode can make the property access itself throw,
// so the whole read is guarded rather than only the missing-key case.
export const readStoredViewMode = (): ViewMode => {
  try {
    return resolveViewMode(window.localStorage.getItem(VIEW_MODE_STORAGE_KEY));
  } catch {
    return DEFAULT_VIEW_MODE;
  }
};

// A blocked write must not stop the view changing for this session.
export const storeViewMode = (mode: ViewMode): void => {
  try {
    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  } catch {
    return;
  }
};
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `pnpm --dir frontend exec vitest run src/lib/viewMode.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/viewMode.ts frontend/src/lib/viewMode.test.ts
git commit -m "feat: add the view mode contract"
```

---

### Task 3: Focus-trap primitives

**Files:**

- Create: `frontend/src/lib/focusTrap.ts`
- Test: `frontend/src/lib/focusTrap.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `focusableWithin(container: HTMLElement): readonly HTMLElement[]`;
  `nextFocusTarget(container: HTMLElement, active: Element | null, backwards: boolean): HTMLElement | null`.

These are the halves of a focus trap that can be tested without rendering
anything, so `Dialog` in Task 4 has almost no untested logic of its own.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/lib/focusTrap.test.ts`:

```ts
import { afterEach, describe, expect, it } from "vitest";
import { focusableWithin, nextFocusTarget } from "./focusTrap";

const mount = (html: string): HTMLElement => {
  const container = document.createElement("div");

  container.innerHTML = html;
  document.body.append(container);
  return container;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("focusableWithin", () => {
  it("finds links, buttons and fields in document order", () => {
    const container = mount(`
      <a href="/one">one</a>
      <button type="button">two</button>
      <input />
      <div tabindex="0">four</div>
    `);

    expect(focusableWithin(container).map((element) => element.tagName)).toEqual(
      ["A", "BUTTON", "INPUT", "DIV"],
    );
  });

  it("skips disabled controls and tabindex -1", () => {
    const container = mount(`
      <button type="button" disabled>no</button>
      <input disabled />
      <div tabindex="-1">no</div>
      <button type="button">yes</button>
    `);

    expect(focusableWithin(container)).toHaveLength(1);
  });

  it("skips anything hidden from the accessibility tree", () => {
    const container = mount(`
      <button type="button" aria-hidden="true">no</button>
      <button type="button">yes</button>
    `);

    expect(focusableWithin(container)).toHaveLength(1);
  });

  it("returns nothing for a container with no focusable content", () => {
    expect(focusableWithin(mount("<p>text</p>"))).toEqual([]);
  });
});

describe("nextFocusTarget", () => {
  const container = () =>
    mount(`
      <button type="button" id="a">a</button>
      <button type="button" id="b">b</button>
      <button type="button" id="c">c</button>
    `);

  it("steps forward", () => {
    const root = container();
    const b = root.querySelector("#b")!;

    expect(nextFocusTarget(root, b, false)?.id).toBe("c");
  });

  it("steps backward", () => {
    const root = container();
    const b = root.querySelector("#b")!;

    expect(nextFocusTarget(root, b, true)?.id).toBe("a");
  });

  it("wraps past the last element", () => {
    const root = container();
    const c = root.querySelector("#c")!;

    expect(nextFocusTarget(root, c, false)?.id).toBe("a");
  });

  it("wraps before the first element", () => {
    const root = container();
    const a = root.querySelector("#a")!;

    expect(nextFocusTarget(root, a, true)?.id).toBe("c");
  });

  it("enters at the first element when focus is outside the container", () => {
    const root = container();

    expect(nextFocusTarget(root, document.body, false)?.id).toBe("a");
  });

  it("enters at the last element when tabbing backwards from outside", () => {
    const root = container();

    expect(nextFocusTarget(root, null, true)?.id).toBe("c");
  });

  it("returns null when there is nothing to focus", () => {
    expect(nextFocusTarget(mount("<p>text</p>"), null, false)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `pnpm --dir frontend exec vitest run src/lib/focusTrap.test.ts`
Expected: FAIL — `Failed to resolve import "./focusTrap"`.

- [ ] **Step 3: Write the implementation**

Create `frontend/src/lib/focusTrap.ts`:

```ts
const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// Visibility is deliberately judged by aria-hidden rather than by layout: jsdom
// reports no geometry, so an offsetParent test would make every element here
// look hidden and the trap untestable. Nothing in this feature hides a control
// with CSS alone.
export const focusableWithin = (
  container: HTMLElement,
): readonly HTMLElement[] =>
  [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => element.closest('[aria-hidden="true"]') === null,
  );

export const nextFocusTarget = (
  container: HTMLElement,
  active: Element | null,
  backwards: boolean,
): HTMLElement | null => {
  const elements = focusableWithin(container);

  if (elements.length === 0) return null;

  const index = elements.findIndex((element) => element === active);

  // Focus sits outside the trap, so Tab enters at whichever end the direction
  // of travel would have arrived from.
  if (index === -1) return backwards ? elements[elements.length - 1] : elements[0];

  const step = backwards ? -1 : 1;

  return elements[(index + step + elements.length) % elements.length];
};
```

- [ ] **Step 4: Run the test and watch it pass**

Run: `pnpm --dir frontend exec vitest run src/lib/focusTrap.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/focusTrap.ts frontend/src/lib/focusTrap.test.ts
git commit -m "feat: add focus trap primitives"
```

---

### Task 4: The shared dialog

**Files:**

- Create: `frontend/src/components/Dialog.tsx`
- Test: `frontend/src/components/Dialog.test.tsx`
- Modify: `frontend/src/app/globals.css`

**Interfaces:**

- Consumes: `focusableWithin`, `nextFocusTarget` from `@/lib/focusTrap`.
- Produces: `Dialog` with props
  `{ label: string; className?: string; onClose: () => void; children: ReactNode }`.

Both the card dialog (Task 7) and the search sheet (Task 8) render through this,
so there is exactly one modal implementation to get right.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/Dialog.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";

const open = (onClose = vi.fn()) => {
  render(
    <>
      <button type="button">outside</button>
      <Dialog label="Example dialog" onClose={onClose}>
        <button type="button">first</button>
        <button type="button">second</button>
      </Dialog>
    </>,
  );

  return onClose;
};

describe("Dialog", () => {
  it("announces itself as a modal dialog with its label", () => {
    open();

    const dialog = screen.getByRole("dialog", { name: "Example dialog" });

    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("moves focus to its first control", () => {
    open();

    expect(screen.getByRole("button", { name: "first" })).toHaveFocus();
  });

  it("cycles Tab within itself rather than reaching the page behind", async () => {
    const user = userEvent.setup();

    open();

    await user.tab();
    expect(screen.getByRole("button", { name: "second" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "first" })).toHaveFocus();
  });

  it("cycles backwards with Shift+Tab", async () => {
    const user = userEvent.setup();

    open();

    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "second" })).toHaveFocus();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = open();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the backdrop is pressed", async () => {
    const user = userEvent.setup();
    const onClose = open();

    await user.click(screen.getByTestId("dialog-backdrop"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when the dialog itself is pressed", async () => {
    const user = userEvent.setup();
    const onClose = open();

    await user.click(screen.getByRole("button", { name: "first" }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("returns focus to whatever opened it", async () => {
    const user = userEvent.setup();
    const opener = document.createElement("button");

    document.body.append(opener);
    opener.focus();

    const { unmount } = render(
      <Dialog label="Example dialog" onClose={vi.fn()}>
        <button type="button">first</button>
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: "first" })).toHaveFocus();

    unmount();
    await Promise.resolve();

    expect(opener).toHaveFocus();
    opener.remove();
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `pnpm --dir frontend exec vitest run src/components/Dialog.test.tsx`
Expected: FAIL — `Failed to resolve import "./Dialog"`.

- [ ] **Step 3: Write the implementation**

Create `frontend/src/components/Dialog.tsx`:

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { focusableWithin, nextFocusTarget } from "@/lib/focusTrap";

interface DialogProps {
  readonly label: string;
  readonly className?: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

export function Dialog({ label, className, onClose, children }: DialogProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  // Focus enters on mount and goes back on unmount, so a reader who opened the
  // dialog from a grid tile is returned to that tile rather than to the top of
  // the page.
  useEffect(() => {
    opener.current = document.activeElement;

    const surface = surfaceRef.current;

    if (surface !== null) {
      (focusableWithin(surface)[0] ?? surface).focus();
    }

    return () => {
      if (opener.current instanceof HTMLElement) opener.current.focus();
    };
  }, []);

  // Captured on the document, so the trap sees Tab before anything inside the
  // dialog can act on it and before the deck's own document-level shortcuts.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const surface = surfaceRef.current;

      if (surface === null) return;

      const target = nextFocusTarget(
        surface,
        document.activeElement,
        event.shiftKey,
      );

      if (target === null) return;

      event.preventDefault();
      target.focus();
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  return (
    <div className="app-dialog fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* aria-hidden and pointer-only: the close button and Escape are the
          announced ways out, and this is the shortcut for a mouse. */}
      <div
        data-testid="dialog-backdrop"
        aria-hidden="true"
        className="app-dialog-backdrop absolute inset-0"
        onPointerDown={onClose}
      />
      <div
        ref={surfaceRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`app-dialog-surface relative z-10 flex max-h-full w-full flex-col focus:outline-none ${className ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add the dialog's styles**

Append to `frontend/src/app/globals.css` immediately before the existing
`@media (min-width: 640px)` block, so every rule this feature adds sits
together at the end of the sheet (Tasks 5, 6 and 7 chain onto this one):

```css
/* One modal for the whole application: the card dialog and the mobile search
   sheet are the same box with different contents. */
.app-dialog-backdrop {
  background: var(--scrim);
  animation: dialog-fade var(--travel) var(--travel-ease);
}

.app-dialog-surface {
  animation: dialog-rise var(--travel) var(--travel-ease);
}

@keyframes dialog-fade {
  from {
    opacity: 0;
  }
}

@keyframes dialog-rise {
  from {
    opacity: 0;
    transform: translate3d(0, 12px, 0);
  }
}
```

Add `--scrim` to both token blocks in the same file — inside `:root`, under
"Ground":

```css
  --scrim: rgb(3 4 12 / 0.78);
```

and inside `[data-theme="sketch"]`, in the matching position:

```css
  --scrim: rgb(29 29 27 / 0.55);
```

The existing `prefers-reduced-motion` block already zeroes `--travel`, which
collapses both animations to nothing, so no new rule is needed there.

- [ ] **Step 5: Expose the token to Tailwind**

In `frontend/tailwind.config.ts`, add to `colors`:

```ts
        scrim: "var(--scrim)",
```

- [ ] **Step 6: Run the test and watch it pass**

Run: `pnpm --dir frontend exec vitest run src/components/Dialog.test.tsx`
Expected: PASS, 8 tests.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/Dialog.tsx frontend/src/components/Dialog.test.tsx \
  frontend/src/app/globals.css frontend/tailwind.config.ts
git commit -m "feat: add the shared modal dialog"
```

---

### Task 5: The search bar

**Files:**

- Create: `frontend/src/components/SearchBar.tsx`
- Test: `frontend/src/components/SearchBar.test.tsx`
- Modify: `frontend/src/app/globals.css`

**Interfaces:**

- Consumes: `CardFilter` from `@/lib/filterCards`.
- Produces: `SearchBar` with props
  `{ filter: CardFilter; types: readonly string[]; resultCount: number; totalCount: number; autoFocus?: boolean; onFilterChange: (filter: CardFilter) => void }`.

Presentational only: it holds no state and does no matching. Every keystroke and
chip press is reported as a whole new `CardFilter`.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/SearchBar.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EMPTY_FILTER } from "@/lib/filterCards";
import { SearchBar } from "./SearchBar";

const types = ["NETWORK", "SECURITY"] as const;

const setup = (filter = EMPTY_FILTER, resultCount = 28) => {
  const onFilterChange = vi.fn();

  render(
    <SearchBar
      filter={filter}
      types={types}
      resultCount={resultCount}
      totalCount={28}
      onFilterChange={onFilterChange}
    />,
  );

  return onFilterChange;
};

describe("SearchBar", () => {
  it("labels its field for a screen reader", () => {
    setup();

    expect(
      screen.getByRole("searchbox", { name: "Search cards" }),
    ).toBeInTheDocument();
  });

  it("reports the whole filter on a keystroke", async () => {
    const user = userEvent.setup();
    const onFilterChange = setup();

    await user.type(screen.getByRole("searchbox"), "t");

    expect(onFilterChange).toHaveBeenCalledWith({ query: "t", type: null });
  });

  it("keeps the chosen category while the text changes", async () => {
    const user = userEvent.setup();
    const onFilterChange = setup({ query: "", type: "SECURITY" });

    await user.type(screen.getByRole("searchbox"), "t");

    expect(onFilterChange).toHaveBeenCalledWith({ query: "t", type: "SECURITY" });
  });

  it("offers an All chip alongside one chip per type", () => {
    setup();

    expect(screen.getByRole("button", { name: "All categories" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "NETWORK" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "SECURITY" })).toBeInTheDocument();
  });

  it("chooses a category without disturbing the text", async () => {
    const user = userEvent.setup();
    const onFilterChange = setup({ query: "aws", type: null });

    await user.click(screen.getByRole("button", { name: "NETWORK" }));

    expect(onFilterChange).toHaveBeenCalledWith({
      query: "aws",
      type: "NETWORK",
    });
  });

  it("deselects a chosen category by pressing it again", async () => {
    const user = userEvent.setup();
    const onFilterChange = setup({ query: "", type: "NETWORK" });

    await user.click(screen.getByRole("button", { name: "NETWORK" }));

    expect(onFilterChange).toHaveBeenCalledWith({ query: "", type: null });
  });

  it("clears everything from the All chip", async () => {
    const user = userEvent.setup();
    const onFilterChange = setup({ query: "aws", type: "NETWORK" });

    await user.click(screen.getByRole("button", { name: "All categories" }));

    expect(onFilterChange).toHaveBeenCalledWith({ query: "aws", type: null });
  });

  it("shows a clear button only while there is text to clear", async () => {
    const user = userEvent.setup();

    setup();
    expect(screen.queryByRole("button", { name: "Clear the search text" })).toBeNull();

    const onFilterChange = setup({ query: "aws", type: "NETWORK" });

    await user.click(screen.getByRole("button", { name: "Clear the search text" }));

    expect(onFilterChange).toHaveBeenCalledWith({ query: "", type: "NETWORK" });
  });

  it("counts the results in a polite live region", () => {
    setup(EMPTY_FILTER, 12);

    const count = screen.getByText("12 of 28 cards");

    expect(count).toHaveAttribute("aria-live", "polite");
  });

  it("says one card rather than 1 cards", () => {
    setup(EMPTY_FILTER, 1);

    expect(screen.getByText("1 of 28 cards")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `pnpm --dir frontend exec vitest run src/components/SearchBar.test.tsx`
Expected: FAIL — `Failed to resolve import "./SearchBar"`.

- [ ] **Step 3: Write the implementation**

Create `frontend/src/components/SearchBar.tsx`:

```tsx
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

      <p
        aria-live="polite"
        className="font-mono text-xs font-semibold tracking-[0.14em] text-ink-muted"
      >
        {resultCount} of {totalCount} cards
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Add the chip strip's styles**

Append to `frontend/src/app/globals.css`, after the dialog rules:

```css
/* The chip strip scrolls sideways on a phone; a visible scrollbar under four
   chips reads as a broken layout rather than as an affordance. */
.search-chips {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.search-chips::-webkit-scrollbar {
  display: none;
}
```

- [ ] **Step 5: Run the test and watch it pass**

Run: `pnpm --dir frontend exec vitest run src/components/SearchBar.test.tsx`
Expected: PASS, 10 tests.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/SearchBar.tsx frontend/src/components/SearchBar.test.tsx \
  frontend/src/app/globals.css
git commit -m "feat: add the card search bar"
```

---

### Task 6: The card grid

**Files:**

- Create: `frontend/src/components/CardTile.tsx`
- Create: `frontend/src/components/CardGrid.tsx`
- Test: `frontend/src/components/CardGrid.test.tsx`
- Modify: `frontend/src/app/globals.css`

**Interfaces:**

- Consumes: `ConceptCardData` from `@/types/concept`.
- Produces: `CardTile` with props
  `{ card: ConceptCardData; onSelect: (card: ConceptCardData) => void }`;
  `CardGrid` with props
  `{ cards: readonly ConceptCardData[]; onSelect: (card: ConceptCardData) => void }`.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/CardGrid.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import { CardGrid } from "./CardGrid";

const three = conceptCards.slice(0, 3);

describe("CardGrid", () => {
  it("renders one tile per card in the order it was given", () => {
    render(<CardGrid cards={three} onSelect={vi.fn()} />);

    const tiles = screen.getAllByRole("button");

    expect(tiles).toHaveLength(3);
    expect(tiles.map((tile) => tile.getAttribute("aria-label"))).toEqual([
      "Open the Proxy card",
      "Open the CDN card",
      "Open the NGINX card",
    ]);
  });

  it("shows the number, type and title on a tile", () => {
    render(<CardGrid cards={three} onSelect={vi.fn()} />);

    const tile = screen.getByRole("button", { name: "Open the Proxy card" });

    expect(tile).toHaveTextContent("#001");
    expect(tile).toHaveTextContent("NETWORK");
    expect(tile).toHaveTextContent("Proxy");
  });

  it("mounts both artworks so the theme can choose between them", () => {
    const { container } = render(<CardGrid cards={[three[0]]} onSelect={vi.fn()} />);

    const sources = [...container.querySelectorAll("img")].map(
      (image) => image.getAttribute("src"),
    );

    expect(sources).toEqual([
      "/images/proxy-thumbnail.webp",
      "/images/proxy-sketch.svg",
    ]);
  });

  it("hides tile artwork from the accessibility tree", () => {
    const { container } = render(<CardGrid cards={[three[0]]} onSelect={vi.fn()} />);

    for (const image of container.querySelectorAll("img")) {
      expect(image).toHaveAttribute("aria-hidden", "true");
      expect(image).toHaveAttribute("alt", "");
    }
  });

  it("keeps the definition readable when the artwork fails to load", () => {
    const { container } = render(<CardGrid cards={[three[0]]} onSelect={vi.fn()} />);

    const image = container.querySelector("img")!;

    image.dispatchEvent(new Event("error"));

    expect(
      screen.getByRole("button", { name: "Open the Proxy card" }),
    ).toHaveTextContent("Proxy");
  });

  it("reports the card that was chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<CardGrid cards={three} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Open the CDN card" }));

    expect(onSelect).toHaveBeenCalledWith(three[1]);
  });

  it("presents the tiles as a list", () => {
    render(<CardGrid cards={three} onSelect={vi.fn()} />);

    expect(screen.getByRole("list", { name: "Concept cards" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `pnpm --dir frontend exec vitest run src/components/CardGrid.test.tsx`
Expected: FAIL — `Failed to resolve import "./CardGrid"`.

- [ ] **Step 3: Write the tile**

Create `frontend/src/components/CardTile.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { ConceptCardData } from "@/types/concept";

interface CardTileProps {
  readonly card: ConceptCardData;
  readonly onSelect: (card: ConceptCardData) => void;
}

// A tile is for recognising a card, not for reading it, so the definition stays
// on the card itself. The button carries the whole accessible name, which is
// why both artworks are decorative here: the alt text of the one the theme
// happens to show would otherwise change what the tile is called.
export function CardTile({ card, onSelect }: CardTileProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <li className="card-tile-item">
      <button
        type="button"
        aria-label={`Open the ${card.title} card`}
        onClick={() => onSelect(card)}
        className="card-tile flex h-full w-full flex-col overflow-hidden rounded-card border border-rule bg-panel text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--paper)]"
      >
        <span className="flex items-center justify-between px-3 pb-2 pt-3 text-[0.55rem] font-bold tracking-[0.18em] text-chip-ink">
          <span className="rounded-full border border-chip-border bg-chip px-2 py-1">
            {card.cardNumber}
          </span>
          <span className="rounded-full border border-type-chip-border bg-type-chip px-2 py-1 text-type-chip-ink">
            {card.type}
          </span>
        </span>

        <span className="relative block h-[120px] overflow-hidden bg-thumb-backdrop">
          {imageFailed ? (
            <span className="card-thumbnail-fallback flex h-full items-center justify-center px-4 text-center text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-accent-ink">
              {card.type.toLowerCase()}
            </span>
          ) : (
            // The static export must preserve these exact local paths;
            // next/image rewrites them to absolute URLs even with optimization
            // disabled. CSS shows whichever the active theme calls for.
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="card-thumbnail card-thumbnail-neon h-full w-full object-cover object-center"
                onError={() => setImageFailed(true)}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image.sketch.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="card-thumbnail card-thumbnail-sketch h-full w-full object-cover object-center"
              />
            </>
          )}
        </span>

        <span className="flex flex-1 items-center px-3 py-3 font-display text-sm font-black uppercase tracking-[0.08em] text-ink">
          {card.title}
        </span>
      </button>
    </li>
  );
}
```

- [ ] **Step 4: Write the grid**

Create `frontend/src/components/CardGrid.tsx`:

```tsx
"use client";

import type { ConceptCardData } from "@/types/concept";
import { CardTile } from "./CardTile";

interface CardGridProps {
  readonly cards: readonly ConceptCardData[];
  readonly onSelect: (card: ConceptCardData) => void;
}

export function CardGrid({ cards, onSelect }: CardGridProps) {
  return (
    // The grid scrolls inside the locked 100dvh shell rather than scrolling the
    // document, so `body { overflow: hidden }` and the fixed header survive.
    <ul aria-label="Concept cards" className="card-grid min-h-0 flex-1">
      {cards.map((card) => (
        <CardTile key={card.id} card={card} onSelect={onSelect} />
      ))}
    </ul>
  );
}
```

- [ ] **Step 5: Add the grid's styles**

Append to `frontend/src/app/globals.css`, after the `.search-chips` rules:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0 0 1.5rem;
  list-style: none;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.card-tile {
  box-shadow: var(--card-shadow-flat);
}

.card-tile:hover {
  border-color: var(--control-hover-border);
}

@media (prefers-reduced-motion: reduce) {
  .card-tile {
    transition: none;
  }

  .card-tile:hover {
    transform: none;
  }
}
```

- [ ] **Step 6: Run the test and watch it pass**

Run: `pnpm --dir frontend exec vitest run src/components/CardGrid.test.tsx`
Expected: PASS, 7 tests.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/CardTile.tsx frontend/src/components/CardGrid.tsx \
  frontend/src/components/CardGrid.test.tsx frontend/src/app/globals.css
git commit -m "feat: add the desktop card grid"
```

---

### Task 7: The card dialog

**Files:**

- Create: `frontend/src/components/CardDialog.tsx`
- Test: `frontend/src/components/CardDialog.test.tsx`
- Modify: `frontend/src/app/globals.css`

**Interfaces:**

- Consumes: `Dialog` from `./Dialog`; `ConceptCard` from `./ConceptCard`;
  `FlipDirection` from `./ConceptDeck`; `RandomSource` from `@/lib/shuffle`;
  `ConceptCardData` from `@/types/concept`.
- Produces: `CardDialog` with props
  `{ cards: readonly ConceptCardData[]; index: number; random?: RandomSource; onIndexChange: (index: number) => void; onClose: () => void }`.

The dialog carries the flip state itself. `ConceptDeck` is not mounted in grid
view, so its document-level Enter/Space/Arrow handling is not available here and
the dialog supplies its own.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/CardDialog.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import { CardDialog } from "./CardDialog";

const three = conceptCards.slice(0, 3);

const setup = (index = 0) => {
  const onIndexChange = vi.fn();
  const onClose = vi.fn();

  render(
    <CardDialog
      cards={three}
      index={index}
      random={() => 0.9}
      onIndexChange={onIndexChange}
      onClose={onClose}
    />,
  );

  return { onIndexChange, onClose };
};

describe("CardDialog", () => {
  it("names itself after the card it holds", () => {
    setup();

    expect(
      screen.getByRole("dialog", { name: "Proxy card" }),
    ).toBeInTheDocument();
  });

  it("opens front-first and flips on a click", async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    );

    expect(
      screen.getByRole("button", { name: "Proxy card, back shown" }),
    ).toBeInTheDocument();
  });

  it("flips with Space and with Enter", async () => {
    const user = userEvent.setup();

    setup();

    screen.getByRole("button", { name: /front shown$/ }).focus();

    await user.keyboard(" ");
    expect(
      screen.getByRole("button", { name: /back shown$/ }),
    ).toBeInTheDocument();

    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("button", { name: /front shown$/ }),
    ).toBeInTheDocument();
  });

  it("does not flip when a control has focus", async () => {
    const user = userEvent.setup();

    setup();

    screen.getByRole("button", { name: "Next card" }).focus();
    await user.keyboard(" ");

    expect(
      screen.getByRole("button", { name: /front shown$/ }),
    ).toBeInTheDocument();
  });

  it("counts its position against the filtered deck", () => {
    setup(1);

    expect(screen.getByLabelText("Card 2 of 3")).toHaveTextContent("02 / 03");
  });

  it("steps forward with the Next button", async () => {
    const user = userEvent.setup();
    const { onIndexChange } = setup(0);

    await user.click(screen.getByRole("button", { name: "Next card" }));

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("wraps past the last card", async () => {
    const user = userEvent.setup();
    const { onIndexChange } = setup(2);

    await user.click(screen.getByRole("button", { name: "Next card" }));

    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it("wraps before the first card", async () => {
    const user = userEvent.setup();
    const { onIndexChange } = setup(0);

    await user.click(screen.getByRole("button", { name: "Previous card" }));

    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("navigates with the arrow keys", async () => {
    const user = userEvent.setup();
    const { onIndexChange } = setup(0);

    screen.getByRole("button", { name: /front shown$/ }).focus();

    await user.keyboard("{ArrowRight}");
    expect(onIndexChange).toHaveBeenCalledWith(1);

    await user.keyboard("{ArrowLeft}");
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("shows the front face again after navigating to another card", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <CardDialog
        cards={three}
        index={0}
        random={() => 0.9}
        onIndexChange={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /front shown$/ }));
    expect(
      screen.getByRole("button", { name: /back shown$/ }),
    ).toBeInTheDocument();

    rerender(
      <CardDialog
        cards={three}
        index={1}
        random={() => 0.9}
        onIndexChange={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "CDN card, front shown" }),
    ).toBeInTheDocument();
  });

  it("closes from its close button", async () => {
    const user = userEvent.setup();
    const { onClose } = setup();

    await user.click(screen.getByRole("button", { name: "Close the card" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("hides its navigation when the filter left a single card", () => {
    render(
      <CardDialog
        cards={three.slice(0, 1)}
        index={0}
        random={() => 0.9}
        onIndexChange={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Next card" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Previous card" })).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `pnpm --dir frontend exec vitest run src/components/CardDialog.test.tsx`
Expected: FAIL — `Failed to resolve import "./CardDialog"`.

- [ ] **Step 3: Write the implementation**

Create `frontend/src/components/CardDialog.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import type { RandomSource } from "@/lib/shuffle";
import type { ConceptCardData } from "@/types/concept";
import { ConceptCard } from "./ConceptCard";
import type { FlipDirection } from "./ConceptDeck";
import { Dialog } from "./Dialog";

interface CardDialogProps {
  readonly cards: readonly ConceptCardData[];
  readonly index: number;
  readonly random?: RandomSource;
  readonly onIndexChange: (index: number) => void;
  readonly onClose: () => void;
}

const formatPosition = (position: number) =>
  position.toString().padStart(2, "0");

const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

const arrowClassName =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-control-border bg-control text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]";

export function CardDialog({
  cards,
  index,
  random = Math.random,
  onIndexChange,
  onClose,
}: CardDialogProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>("forward");
  const card = cards[index];
  const hasMultipleCards = cards.length > 1;

  // A card arriving in the dialog always arrives face up, exactly as one
  // arriving in the centre of the deck does.
  useEffect(() => setIsFlipped(false), [index]);

  // The same coin toss as the deck: both directions land the same face, and
  // both are edge-on at half the flip where the faces swap.
  const flip = () => {
    setFlipDirection(random() < 0.5 ? "reverse" : "forward");
    setIsFlipped((flipped) => !flipped);
  };

  const step = (offset: number) =>
    onIndexChange(wrapIndex(index + offset, cards.length));

  return (
    <Dialog
      label={`${card.title} card`}
      className="card-dialog max-w-[420px] items-center gap-3"
      onClose={onClose}
    >
      <div
        className="flex w-full flex-1 items-stretch gap-2"
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
          }

          const target = event.target as HTMLElement | null;

          if (event.key === "Enter" || event.key === " ") {
            // A focused control keeps Enter and Space for its own activation.
            // The card itself is a div with role="button", so a real <button>
            // ancestor is what distinguishes a control from the card.
            if (target?.closest("button") !== null) return;

            event.preventDefault();
            flip();
            return;
          }

          if (!hasMultipleCards) return;

          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }

          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        {hasMultipleCards && (
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Previous card"
              onClick={() => step(-1)}
              className={arrowClassName}
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
                <path d="m15 6-6 6 6 6" />
              </svg>
            </button>
          </div>
        )}

        {/* The card is a flex column that fills its stage, exactly as a deck
            slot gives it one. */}
        <div className="card-dialog-stage flex min-h-0 flex-1 flex-col">
          <ConceptCard
            card={card}
            isActive
            isFlipped={isFlipped}
            flipDirection={flipDirection}
            onToggle={flip}
          />
        </div>

        {hasMultipleCards && (
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Next card"
              onClick={() => step(1)}
              className={arrowClassName}
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
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex w-full shrink-0 items-center justify-between gap-3">
        <p
          aria-label={`Card ${index + 1} of ${cards.length}`}
          aria-live="polite"
          className="font-mono text-xs font-semibold tracking-[0.18em] text-ink-muted"
        >
          {formatPosition(index + 1)} / {formatPosition(cards.length)}
        </p>
        <button
          type="button"
          aria-label="Close the card"
          onClick={onClose}
          className="flex h-9 items-center rounded-full border border-control-border bg-control px-4 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}
```

- [ ] **Step 4: Add the dialog stage's styles**

Append to `frontend/src/app/globals.css`, after the `.card-tile` rules:

```css
/* The dialog gives the card the same kind of stage a deck slot does: a flex
   column with a height, so `.concept-card` can fill it and both faces can
   scroll. */
.card-dialog {
  height: min(680px, 100%);
}

.card-dialog-stage {
  min-width: 0;
}
```

- [ ] **Step 5: Run the test and watch it pass**

Run: `pnpm --dir frontend exec vitest run src/components/CardDialog.test.tsx`
Expected: PASS, 12 tests.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/CardDialog.tsx frontend/src/components/CardDialog.test.tsx \
  frontend/src/app/globals.css
git commit -m "feat: add the grid card dialog"
```

---

### Task 8: The mobile search sheet

**Files:**

- Create: `frontend/src/components/SearchSheet.tsx`
- Test: `frontend/src/components/SearchSheet.test.tsx`

**Interfaces:**

- Consumes: `Dialog` from `./Dialog`; `SearchBar` from `./SearchBar`;
  `EMPTY_FILTER` and `CardFilter` from `@/lib/filterCards`.
- Produces: `SearchSheet` with props
  `{ filter: CardFilter; types: readonly string[]; resultCount: number; totalCount: number; onFilterChange: (filter: CardFilter) => void; onClose: () => void }`.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/SearchSheet.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EMPTY_FILTER } from "@/lib/filterCards";
import { SearchSheet } from "./SearchSheet";

const setup = (filter = EMPTY_FILTER) => {
  const onFilterChange = vi.fn();
  const onClose = vi.fn();

  render(
    <SearchSheet
      filter={filter}
      types={["NETWORK", "SECURITY"]}
      resultCount={28}
      totalCount={28}
      onFilterChange={onFilterChange}
      onClose={onClose}
    />,
  );

  return { onFilterChange, onClose };
};

describe("SearchSheet", () => {
  it("is a modal dialog named for its purpose", () => {
    setup();

    expect(
      screen.getByRole("dialog", { name: "Search the deck" }),
    ).toBeInTheDocument();
  });

  it("puts the caret in the field so a reader can type at once", () => {
    setup();

    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("reports each keystroke without closing", async () => {
    const user = userEvent.setup();
    const { onFilterChange, onClose } = setup();

    await user.type(screen.getByRole("searchbox"), "t");

    expect(onFilterChange).toHaveBeenCalledWith({ query: "t", type: null });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes from its Done button", async () => {
    const user = userEvent.setup();
    const { onClose } = setup();

    await user.click(screen.getByRole("button", { name: "Done" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clears both filters at once", async () => {
    const user = userEvent.setup();
    const { onFilterChange } = setup({ query: "aws", type: "NETWORK" });

    await user.click(screen.getByRole("button", { name: "Clear all filters" }));

    expect(onFilterChange).toHaveBeenCalledWith({ query: "", type: null });
  });

  it("offers nothing to clear when no filter is set", () => {
    setup();

    expect(
      screen.queryByRole("button", { name: "Clear all filters" }),
    ).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test and watch it fail**

Run: `pnpm --dir frontend exec vitest run src/components/SearchSheet.test.tsx`
Expected: FAIL — `Failed to resolve import "./SearchSheet"`.

- [ ] **Step 3: Write the implementation**

Create `frontend/src/components/SearchSheet.tsx`:

```tsx
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
```

Both buttons take their accessible name from their own text, so no aria-label is
needed for the test queries to match.

- [ ] **Step 4: Run the test and watch it pass**

Run: `pnpm --dir frontend exec vitest run src/components/SearchSheet.test.tsx`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/SearchSheet.tsx frontend/src/components/SearchSheet.test.tsx
git commit -m "feat: add the mobile search sheet"
```

---

### Task 9: Keep deck shortcuts out of text fields and dialogs

**Files:**

- Modify: `frontend/src/components/ConceptDeck.tsx` (the `handleKeyDown` inside
  the "Deck shortcuts listen on the document" effect)
- Test: `frontend/src/components/ConceptDeck.test.tsx`

**Interfaces:**

- Consumes: nothing new.
- Produces: no new export. `ConceptDeck`'s document-level shortcuts now ignore
  key presses that originate in a text field or inside a dialog.

**Why this exists.** `ConceptDeck` listens for Enter, Space, ArrowLeft and
ArrowRight on the *document* so its shortcuts work when focus sits outside the
card. Its only guard is `target?.closest("button")`, and an `<input>` is not a
button. Once the search sheet opens over a mounted deck, typing a space in the
search field would flip the card behind it *and* `preventDefault` the keystroke,
so the reader could not type a space at all; the arrow keys would move the deck
instead of the caret. This must land before the sheet is wired up in Task 11.

- [ ] **Step 1: Write the failing test**

Add to `frontend/src/components/ConceptDeck.test.tsx`, inside the existing
`describe("ConceptDeck", ...)` block:

```tsx
  it("leaves keystrokes typed into a text field alone", async () => {
    const user = userEvent.setup();

    render(
      <>
        <input aria-label="Search cards" />
        <ConceptDeck cards={conceptCards} random={() => 0.999999} />
      </>,
    );

    const field = screen.getByLabelText("Search cards");

    field.focus();
    await user.keyboard("a b{ArrowLeft}");

    expect(field).toHaveValue("a b");
    expect(slotOf("proxy")).toBe("0");
    expect(
      screen.getByRole("button", { name: /^Proxy card, front shown$/ }),
    ).toBeInTheDocument();
  });

  it("leaves keystrokes inside a dialog to that dialog", async () => {
    const user = userEvent.setup();

    render(
      <>
        <div role="dialog" aria-label="Search the deck">
          <button type="button">Done</button>
        </div>
        <ConceptDeck cards={conceptCards} random={() => 0.999999} />
      </>,
    );

    screen.getByRole("button", { name: "Done" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(slotOf("proxy")).toBe("0");
  });
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `pnpm --dir frontend exec vitest run src/components/ConceptDeck.test.tsx -t "text field"`
Expected: FAIL — the field holds `"ab"` rather than `"a b"`, because the deck
swallowed the space to flip the card.

- [ ] **Step 3: Write the guard**

In `frontend/src/components/ConceptDeck.tsx`, add above the
`type NavigationDirection` declaration:

```ts
// The deck's shortcuts listen on the document, so they must stand aside for
// anything that owns its own keys: a space typed into the search field is a
// space, not a flip, and an arrow key inside a dialog belongs to that dialog.
const ownsItsOwnKeys = (element: HTMLElement | null): boolean =>
  element !== null &&
  (element.isContentEditable ||
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.tagName === "SELECT" ||
    element.closest('[role="dialog"]') !== null);
```

Then in the `handleKeyDown` inside the "Deck shortcuts listen on the document"
effect, replace:

```ts
      const target = event.target as HTMLElement | null;

      if (event.key === "Enter" || event.key === " ") {
```

with:

```ts
      const target = event.target as HTMLElement | null;

      if (ownsItsOwnKeys(target)) return;

      if (event.key === "Enter" || event.key === " ") {
```

- [ ] **Step 4: Run the whole deck suite and watch it pass**

Run: `pnpm --dir frontend exec vitest run src/components/ConceptDeck.test.tsx`
Expected: PASS — the two new tests plus every existing one.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ConceptDeck.tsx frontend/src/components/ConceptDeck.test.tsx
git commit -m "fix: keep deck shortcuts out of text fields and dialogs"
```

---

### Task 10: The application chrome

**Files:**

- Create: `frontend/src/components/AppHeader.tsx`
- Create: `frontend/src/components/SearchTrigger.tsx`
- Create: `frontend/src/components/EmptyResults.tsx`
- Test: `frontend/src/components/AppHeader.test.tsx`
- Test: `frontend/src/components/EmptyResults.test.tsx`

**Interfaces:**

- Consumes: `ThemeToggle` from `./ThemeToggle`; `ViewMode` from `@/lib/viewMode`.
- Produces:
  `AppHeader` with props
  `{ viewMode: ViewMode; canChooseView: boolean; onViewModeChange: (mode: ViewMode) => void; children?: ReactNode }` —
  `children` is the search slot;
  `SearchTrigger` with props
  `{ isFilterActive: boolean; onOpen: () => void }`;
  `EmptyResults` with props
  `{ query: string; onClear: () => void }`.

Three presentational components, none of them mounted yet. The application keeps
working exactly as it does today until Task 11 wires them in.

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/components/AppHeader.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppHeader } from "./AppHeader";
import { SearchTrigger } from "./SearchTrigger";

describe("AppHeader", () => {
  it("shows the title and the theme toggle", () => {
    render(
      <AppHeader viewMode="grid" canChooseView={false} onViewModeChange={vi.fn()} />,
    );

    expect(
      screen.getByRole("heading", { name: "DevOps TCG" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Switch to the .* theme/ }),
    ).toBeInTheDocument();
  });

  it("offers no view toggle on a viewport with only one layout", () => {
    render(
      <AppHeader viewMode="deck" canChooseView={false} onViewModeChange={vi.fn()} />,
    );

    expect(screen.queryByRole("button", { name: /view$/ })).toBeNull();
  });

  it("offers the deck view while the grid is showing", async () => {
    const user = userEvent.setup();
    const onViewModeChange = vi.fn();

    render(
      <AppHeader
        viewMode="grid"
        canChooseView
        onViewModeChange={onViewModeChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Show the deck view" }));

    expect(onViewModeChange).toHaveBeenCalledWith("deck");
  });

  it("offers the grid view while the deck is showing", async () => {
    const user = userEvent.setup();
    const onViewModeChange = vi.fn();

    render(
      <AppHeader
        viewMode="deck"
        canChooseView
        onViewModeChange={onViewModeChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Show the grid view" }));

    expect(onViewModeChange).toHaveBeenCalledWith("grid");
  });

  it("renders whatever search control it is given", () => {
    render(
      <AppHeader viewMode="grid" canChooseView onViewModeChange={vi.fn()}>
        <p>search slot</p>
      </AppHeader>,
    );

    expect(screen.getByText("search slot")).toBeInTheDocument();
  });
});

describe("SearchTrigger", () => {
  it("opens the search", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    render(<SearchTrigger isFilterActive={false} onOpen={onOpen} />);

    await user.click(screen.getByRole("button", { name: "Search the deck" }));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("says so in its name while a filter is in force", () => {
    render(<SearchTrigger isFilterActive onOpen={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Search the deck, filter active" }),
    ).toBeInTheDocument();
  });
});
```

Create `frontend/src/components/EmptyResults.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyResults } from "./EmptyResults";

describe("EmptyResults", () => {
  it("repeats the query that matched nothing", () => {
    render(<EmptyResults query="zzz" onClear={vi.fn()} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "No cards match “zzz”",
    );
  });

  it("says so plainly when only a category was chosen", () => {
    render(<EmptyResults query="" onClear={vi.fn()} />);

    expect(screen.getByRole("status")).toHaveTextContent("No cards match");
  });

  it("clears the filters", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<EmptyResults query="zzz" onClear={onClear} />);

    await user.click(screen.getByRole("button", { name: "Clear the filters" }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the tests and watch them fail**

Run: `pnpm --dir frontend exec vitest run src/components/AppHeader.test.tsx src/components/EmptyResults.test.tsx`
Expected: FAIL — `Failed to resolve import "./AppHeader"`.

- [ ] **Step 3: Write the header**

Create `frontend/src/components/AppHeader.tsx`:

```tsx
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
  // The search slot: a full SearchBar on a wide screen, a SearchTrigger on a
  // narrow one. The header does not care which.
  readonly children?: ReactNode;
}

export function AppHeader({
  viewMode,
  canChooseView,
  onViewModeChange,
  children,
}: AppHeaderProps) {
  const target: ViewMode = viewMode === "grid" ? "deck" : "grid";

  return (
    <header className="app-header flex w-full shrink-0 flex-col items-center gap-2 border-b border-rule pb-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
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
        <ThemeToggle />
      </div>
    </header>
  );
}
```

Note: `ThemeToggle` carries its own `mt-2`, which is why this header does not
add vertical margin around it.

- [ ] **Step 4: Write the search trigger**

Create `frontend/src/components/SearchTrigger.tsx`:

```tsx
"use client";

interface SearchTriggerProps {
  readonly isFilterActive: boolean;
  readonly onOpen: () => void;
}

// A dismissed sheet leaves its filter in force, so a deck holding three cards
// would otherwise be a mystery with no visible cause. The dot — and the name a
// screen reader hears — is that cause.
export function SearchTrigger({ isFilterActive, onOpen }: SearchTriggerProps) {
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
      className="relative mt-2 flex h-7 w-7 items-center justify-center rounded-full border border-control-border bg-control text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
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
```

- [ ] **Step 5: Write the empty state**

Create `frontend/src/components/EmptyResults.tsx`:

```tsx
"use client";

interface EmptyResultsProps {
  readonly query: string;
  readonly onClear: () => void;
}

export function EmptyResults({ query, onClear }: EmptyResultsProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p role="status" className="text-sm text-ink-muted">
        {query.trim() === "" ? "No cards match" : `No cards match “${query}”`}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="flex h-9 items-center rounded-full border border-control-border bg-control px-4 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
      >
        Clear the filters
      </button>
    </div>
  );
}
```

- [ ] **Step 6: Run the tests and watch them pass**

Run: `pnpm --dir frontend exec vitest run src/components/AppHeader.test.tsx src/components/EmptyResults.test.tsx`
Expected: PASS, 10 tests.

- [ ] **Step 7: Commit**

```bash
git add frontend/src/components/AppHeader.tsx frontend/src/components/AppHeader.test.tsx \
  frontend/src/components/SearchTrigger.tsx frontend/src/components/EmptyResults.tsx \
  frontend/src/components/EmptyResults.test.tsx
git commit -m "feat: add the application header, search trigger and empty state"
```

---

### Task 11: The explorer shell

**Files:**

- Create: `frontend/src/components/ConceptExplorer.tsx`
- Test: `frontend/src/components/ConceptExplorer.test.tsx`
- Modify: `frontend/vitest.setup.ts`
- Modify: `frontend/src/components/ConceptDeck.tsx` (`DeckHeader` only)
- Modify: `frontend/src/components/ConceptDeck.test.tsx` (the header assertion)
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/page.test.tsx`
- Modify: `frontend/src/app/globals.css`

**Interfaces:**

- Consumes: `filterCards`, `cardTypes`, `EMPTY_FILTER`, `CardFilter` from
  `@/lib/filterCards`; `readStoredViewMode`, `storeViewMode`,
  `DEFAULT_VIEW_MODE`, `ViewMode` from `@/lib/viewMode`; `RandomSource` from
  `@/lib/shuffle`; `AppHeader`, `SearchBar`, `SearchTrigger`, `SearchSheet`,
  `CardGrid`, `CardDialog`, `EmptyResults`, `ConceptDeck`.
- Produces: `ConceptExplorer` with props
  `{ cards: readonly ConceptCardData[]; random?: RandomSource }`;
  `GRID_MEDIA_QUERY = "(min-width: 1024px)"`.

This is the one task that changes what the application renders. Everything
before it added components nobody mounted.

- [ ] **Step 1: Teach the test environment about matchMedia**

jsdom does not implement `window.matchMedia`, so the explorer's layout
measurement has nothing to read. Add to `frontend/vitest.setup.ts`, after the
existing `localStorage` block:

```ts
// jsdom ships no matchMedia, and the explorer measures the viewport with one.
// The stub answers `(min-width: Npx)` from `window.innerWidth`, so a test
// changes layout the same way it changes the deck's spread — by setting the
// width — and every other query (reduced motion included) stays unmatched.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList => {
      const minWidth = /\(min-width:\s*(\d+)px\)/.exec(query);

      return {
        media: query,
        get matches() {
          return minWidth !== null && window.innerWidth >= Number(minWidth[1]);
        },
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      } as MediaQueryList;
    },
  });
}
```

- [ ] **Step 2: Write the failing test**

Create `frontend/src/components/ConceptExplorer.test.tsx`:

```tsx
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import { VIEW_MODE_STORAGE_KEY } from "@/lib/viewMode";
import { ConceptExplorer } from "./ConceptExplorer";

// The explorer measures the viewport, so a test that cares which layout it gets
// has to say how wide the window is. jsdom opens at 1024, the grid boundary.
const setViewportWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
};

const mount = () =>
  render(<ConceptExplorer cards={conceptCards} random={() => 0.999999} />);

const tiles = () => screen.getAllByRole("button", { name: /^Open the .* card$/ });

afterEach(() => {
  setViewportWidth(1024);
  window.localStorage.clear();
});

describe("ConceptExplorer on a wide viewport", () => {
  it("opens on the grid with every card", async () => {
    mount();

    await waitFor(() => expect(tiles()).toHaveLength(28));
    expect(screen.getByText("28 of 28 cards")).toBeInTheDocument();
  });

  it("narrows the grid on every keystroke", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    await user.type(screen.getByRole("searchbox"), "redis");

    await waitFor(() => expect(tiles()).toHaveLength(2));
    expect(screen.getByText("2 of 28 cards")).toBeInTheDocument();
  });

  it("ands a category chip with the typed text", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    await user.type(screen.getByRole("searchbox"), "aws");
    await user.click(screen.getByRole("button", { name: "SECURITY" }));

    await waitFor(() =>
      expect(tiles().map((tile) => tile.getAttribute("aria-label"))).toEqual([
        "Open the AWS IAM Role card",
        "Open the AWS IAM Policy card",
      ]),
    );
  });

  it("offers a way out when nothing matches", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    await user.type(screen.getByRole("searchbox"), "zzz");

    expect(await screen.findByRole("status")).toHaveTextContent(
      "No cards match “zzz”",
    );

    await user.click(screen.getByRole("button", { name: "Clear the filters" }));

    await waitFor(() => expect(tiles()).toHaveLength(28));
    // The button that was clicked has just unmounted, so focus has to be put
    // somewhere deliberate rather than left on the body.
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("opens a tile as a flippable card and returns focus on Escape", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    const tile = screen.getByRole("button", { name: "Open the Redis card" });

    await user.click(tile);

    const dialog = await screen.findByRole("dialog", { name: "Redis card" });

    await user.click(
      within(dialog).getByRole("button", { name: /front shown$/ }),
    );
    expect(
      within(dialog).getByRole("button", { name: /back shown$/ }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(tile).toHaveFocus();
  });

  it("walks the filtered results from inside the dialog", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    await user.type(screen.getByRole("searchbox"), "redis");
    await waitFor(() => expect(tiles()).toHaveLength(2));

    await user.click(screen.getByRole("button", { name: "Open the Redis card" }));

    const dialog = await screen.findByRole("dialog", { name: "Redis card" });

    expect(within(dialog).getByLabelText("Card 1 of 2")).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Next card" }));

    expect(
      await screen.findByRole("dialog", { name: "Redis Cluster card" }),
    ).toBeInTheDocument();
  });

  it("switches to the carousel and remembers the choice", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    await user.click(screen.getByRole("button", { name: "Show the deck view" }));

    expect(
      await screen.findByRole("button", { name: /^Proxy card, front shown$/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Concept cards" })).toBeNull();
    expect(window.localStorage.getItem(VIEW_MODE_STORAGE_KEY)).toBe("deck");
  });

  it("filters the carousel too", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, "deck");
    mount();

    expect(
      await screen.findByRole("button", { name: /^Proxy card, front shown$/ }),
    ).toBeInTheDocument();

    await user.type(screen.getByRole("searchbox"), "redis");

    expect(await screen.findByText("01 / 02")).toBeInTheDocument();
  });
});

describe("ConceptExplorer without matchMedia", () => {
  it("falls back to the carousel rather than to nothing", async () => {
    const matchMedia = window.matchMedia;

    // @ts-expect-error -- deliberately removing the API the explorer measures with
    delete window.matchMedia;

    try {
      mount();

      expect(
        await screen.findByRole("button", { name: /^Proxy card, front shown$/ }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("list", { name: "Concept cards" })).toBeNull();
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: matchMedia,
      });
    }
  });
});

describe("ConceptExplorer on a narrow viewport", () => {
  it("shows the carousel and no grid", async () => {
    setViewportWidth(375);
    mount();

    expect(
      await screen.findByRole("button", { name: /^Proxy card, front shown$/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Concept cards" })).toBeNull();
    expect(screen.queryByRole("searchbox")).toBeNull();
  });

  it("offers no view toggle, because there is only one layout", async () => {
    setViewportWidth(375);
    mount();

    await screen.findByRole("button", { name: /^Proxy card, front shown$/ });

    expect(screen.queryByRole("button", { name: /^Show the .* view$/ })).toBeNull();
  });

  it("filters the deck from the sheet and keeps the filter after dismissal", async () => {
    const user = userEvent.setup();

    setViewportWidth(375);
    mount();

    await screen.findByRole("button", { name: /^Proxy card, front shown$/ });

    await user.click(screen.getByRole("button", { name: "Search the deck" }));

    await user.type(await screen.findByRole("searchbox"), "redis");
    expect(screen.getByText("2 of 28 cards")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Done" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(await screen.findByText("01 / 02")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Search the deck, filter active" }),
    ).toBeInTheDocument();
  });

  it("lets a space be typed into the search field", async () => {
    const user = userEvent.setup();

    setViewportWidth(375);
    mount();

    await screen.findByRole("button", { name: /^Proxy card, front shown$/ });
    await user.click(screen.getByRole("button", { name: "Search the deck" }));

    const field = await screen.findByRole("searchbox");

    await user.type(field, "reverse proxy");

    expect(field).toHaveValue("reverse proxy");
  });
});
```

- [ ] **Step 3: Run the test and watch it fail**

Run: `pnpm --dir frontend exec vitest run src/components/ConceptExplorer.test.tsx`
Expected: FAIL — `Failed to resolve import "./ConceptExplorer"`.

- [ ] **Step 4: Write the explorer**

Create `frontend/src/components/ConceptExplorer.tsx`:

```tsx
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

  const searchSlot =
    isWide === true ? (
      <SearchBar
        filter={filter}
        types={types}
        resultCount={visibleCards.length}
        totalCount={cards.length}
        onFilterChange={setFilter}
      />
    ) : isWide === false ? (
      <SearchTrigger
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
          <EmptyResults query={filter.query} onClear={clearFilter} />
        ) : showGrid ? (
          <CardGrid
            cards={visibleCards}
            onSelect={(card) => setSelectedId(card.id)}
          />
        ) : (
          <ConceptDeck cards={visibleCards} random={random} />
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
```

`ConceptDeck` takes `random` as an optional prop defaulting to `Math.random`, so
passing `undefined` through is exactly today's behaviour.

- [ ] **Step 5: Shrink the deck's own header**

In `frontend/src/components/ConceptDeck.tsx`, remove the `ThemeToggle` import
and replace the whole `DeckHeader` function with:

```tsx
// The title, the theme toggle and the search now live in AppHeader; the deck
// keeps only the counter, which is deck state. It still sits directly under the
// application header, so the layout reads exactly as it did before the split.
function DeckHeader({ position, total }: DeckHeaderProps) {
  const ready = position !== null;

  return (
    <header className="concept-deck-header mx-auto flex w-full max-w-[350px] shrink-0 flex-col items-center text-center">
      <p
        aria-label={ready ? `Card ${position} of ${total}` : undefined}
        aria-live={ready ? "polite" : undefined}
        aria-hidden={ready ? undefined : true}
        className="font-mono text-xs font-semibold tracking-[0.18em] text-ink-muted"
      >
        {ready ? formatPosition(position) : "--"} / {formatPosition(total)}
      </p>
    </header>
  );
}
```

Then in `frontend/src/app/globals.css`, drop the now-unneeded bottom padding
from the deck header, leaving:

```css
/* The application header carries the rule and the toggles now; the deck header
   is one line of counter, so it only needs the gap beneath it. */
.concept-deck-header {
  margin-bottom: clamp(0.5rem, 1.5vh, 1rem);
}
```

- [ ] **Step 6: Follow the split in the deck's tests**

In `frontend/src/components/ConceptDeck.test.tsx`, replace the first test's
opening assertions (the `heading` / `header` block at roughly lines 31-37) with:

```tsx
    expect(screen.queryByRole("heading", { name: "DevOps TCG" })).toBeNull();
    expect(screen.getByLabelText("Card 1 of 28")).toHaveTextContent("01 / 28");
```

and rename that test to
`"renders its counter above an enabled carousel"`.

- [ ] **Step 7: Mount the explorer**

Replace the body of `frontend/src/app/page.tsx` with:

```tsx
import { ConceptExplorer } from "@/components/ConceptExplorer";
import { conceptCards } from "@/data/conceptCards";

export default function Home() {
  return (
    <main className="app-shell relative isolate overflow-hidden px-4 sm:px-6">
      <div className="stage-orb stage-orb-cyan" aria-hidden="true" />
      <div className="stage-orb stage-orb-violet" aria-hidden="true" />

      {/* The stage's width now depends on the layout, so the explorer owns it. */}
      <ConceptExplorer cards={conceptCards} />
    </main>
  );
}
```

- [ ] **Step 8: Follow the change in the page test**

Replace `frontend/src/app/page.test.tsx` with:

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  // jsdom opens at 1024, which is the grid boundary.
  it("renders the searchable grid without helper text", async () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "DevOps TCG" }),
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: /^Open the .* card$/ }),
      ).toHaveLength(28),
    );

    expect(screen.getByText("28 of 28 cards")).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search cards" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/click the card or use enter or space/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/flip for anatomy and flow/i)).toBeNull();
  });
});
```

- [ ] **Step 9: Run the whole unit suite**

Run: `pnpm --dir frontend test`
Expected: PASS, every file.

- [ ] **Step 10: Run the rest of the gate**

```bash
pnpm --dir frontend exec prettier --write "src/**/*.{ts,tsx,css}" vitest.setup.ts
pnpm --dir frontend format:check
pnpm --dir frontend lint
pnpm --dir frontend typecheck
pnpm --dir frontend test:coverage
pnpm --dir frontend build
```

Expected: all green, coverage at or above lines 85, functions 85, branches 80,
statements 85, and a static export in `frontend/out`.

- [ ] **Step 11: Commit**

```bash
git add frontend/src/components/ConceptExplorer.tsx \
  frontend/src/components/ConceptExplorer.test.tsx \
  frontend/src/components/ConceptDeck.tsx \
  frontend/src/components/ConceptDeck.test.tsx \
  frontend/src/app/page.tsx frontend/src/app/page.test.tsx \
  frontend/src/app/globals.css frontend/vitest.setup.ts
git commit -m "feat: filter the deck from a searchable explorer shell"
```

---

### Task 12: End-to-end coverage

**Files:**

- Create: `frontend/e2e/card-explorer.spec.ts`
- Modify: `frontend/e2e/concept-deck.spec.ts`

**Interfaces:**

- Consumes: the running static export at `http://127.0.0.1:4173`.
- Produces: no code the application imports.

Playwright runs two projects: `chromium` at Desktop Chrome's 1280x720, which is
above the 1024px grid boundary, and `mobile` at 320x700, which is below it. So
`chromium` is now the grid project and `mobile` the deck project — but the
carousel must stay covered at a width where it spreads to more than one rank,
which is what the seeded view preference below is for.

- [ ] **Step 1: Keep the existing deck suite in deck view**

Add to `frontend/e2e/concept-deck.spec.ts`, immediately after the `import` line:

```ts
// A wide viewport now opens on the grid, so this suite asks for the carousel
// before the page loads. Seeding the preference rather than clicking the toggle
// keeps every test in the file at one `page.goto("/")`, and it means the
// chromium project still exercises the multi-rank spread that only exists above
// 1110px.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    window.localStorage.setItem("devops-tcg-view", "deck"),
  );
});
```

- [ ] **Step 2: Split the header-centring test**

The application header is centred on a phone but spreads title, search and
toggles across the width on a desktop, so the title's centring is now a mobile
assertion. In `frontend/e2e/concept-deck.spec.ts`, replace the opening of
`test("centers the stacked header and shows faded adjacent cards", ...)` — from
`await page.goto("/")` down to and including the `counterBounds!.y` expectation —
with:

```ts
  await page.goto("/");

  const counter = page.getByLabel("Card 1 of 28");
  const [counterBounds, viewportWidth] = await Promise.all([
    counter.boundingBox(),
    page.evaluate(() => document.documentElement.clientWidth),
  ]);

  expect(counterBounds).not.toBeNull();
  expect(
    Math.abs(counterBounds!.x + counterBounds!.width / 2 - viewportWidth / 2),
  ).toBeLessThanOrEqual(1);
```

and rename it to `"centers the deck counter and shows faded adjacent cards"`.

Then add, immediately after that test, the phone-only assertion it gave up:

```ts
test("stacks a centred title above the counter on a phone", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");

  await page.goto("/");

  const title = page.getByRole("heading", { name: "DevOps TCG" });
  const counter = page.getByLabel("Card 1 of 28");
  const [titleBounds, counterBounds, viewportWidth] = await Promise.all([
    title.boundingBox(),
    counter.boundingBox(),
    page.evaluate(() => document.documentElement.clientWidth),
  ]);

  expect(titleBounds).not.toBeNull();
  expect(counterBounds).not.toBeNull();
  expect(
    Math.abs(titleBounds!.x + titleBounds!.width / 2 - viewportWidth / 2),
  ).toBeLessThanOrEqual(1);
  expect(counterBounds!.y).toBeGreaterThanOrEqual(
    titleBounds!.y + titleBounds!.height,
  );
});
```

- [ ] **Step 3: Write the explorer suite**

Create `frontend/e2e/card-explorer.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const tiles = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: /^Open the .+ card$/ });

const wideOnly = (testInfo: import("@playwright/test").TestInfo) =>
  test.skip(testInfo.project.name === "mobile", "grid layout is desktop only");

const phoneOnly = (testInfo: import("@playwright/test").TestInfo) =>
  test.skip(testInfo.project.name !== "mobile", "sheet layout is phone only");

test("opens on a grid of every card", async ({ page }, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  await expect(tiles(page)).toHaveCount(28);
  await expect(page.getByText("28 of 28 cards")).toBeVisible();
});

test("filters the grid on every keystroke", async ({ page }, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");
  await expect(tiles(page)).toHaveCount(28);

  const field = page.getByRole("searchbox", { name: "Search cards" });

  // Verified against the shipped data: "kaf" and "kafka" both reach exactly one
  // card, so this asserts narrowing without pinning a count that a new card
  // could quietly change.
  await field.pressSequentially("kaf");
  await expect(tiles(page)).toHaveCount(1);

  await field.pressSequentially("ka");
  await expect(tiles(page)).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Open the Kafka card" }),
  ).toBeVisible();
  await expect(page.getByText("1 of 28 cards")).toBeVisible();

  await field.fill("");
  await expect(tiles(page)).toHaveCount(28);
});

test("finds a card by its category and by a keyword", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  const field = page.getByRole("searchbox", { name: "Search cards" });

  // "caching" is a keyword on the Proxy card and appears in no title, type or
  // definition, so this only passes if keywords are searched.
  await field.fill("caching");
  await expect(tiles(page)).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Open the Proxy card" }),
  ).toBeVisible();

  await field.fill("");
  await page.getByRole("button", { name: "COMPUTE" }).click();
  await expect(tiles(page)).toHaveCount(4);
});

test("offers a way back when nothing matches", async ({ page }, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  await page.getByRole("searchbox", { name: "Search cards" }).fill("zzzzz");

  await expect(page.getByRole("status")).toContainText("No cards match");

  await page.getByRole("button", { name: "Clear the filters" }).click();

  await expect(tiles(page)).toHaveCount(28);
});

test("opens a tile as a flippable card and returns focus on Escape", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  const tile = page.getByRole("button", { name: "Open the Kafka card" });

  await tile.click();

  const dialog = page.getByRole("dialog", { name: "Kafka card" });

  await expect(dialog).toBeVisible();
  await dialog.locator(".concept-card[data-face]").click();
  await expect(dialog.locator(".concept-card[data-face]")).toHaveAttribute(
    "data-face",
    "back",
  );

  await page.keyboard.press("Escape");

  await expect(dialog).toHaveCount(0);
  await expect(tile).toBeFocused();
});

test("walks the filtered results from inside the dialog", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  await page.getByRole("searchbox", { name: "Search cards" }).fill("redis");
  await expect(tiles(page)).toHaveCount(2);

  await page.getByRole("button", { name: "Open the Redis card" }).click();

  const dialog = page.getByRole("dialog", { name: "Redis card" });

  await expect(dialog.getByLabel("Card 1 of 2")).toBeVisible();

  await dialog.getByRole("button", { name: "Next card" }).click();

  await expect(
    page.getByRole("dialog", { name: "Redis Cluster card" }),
  ).toBeVisible();
});

test("switches to the carousel and remembers it across a reload", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  await page.getByRole("button", { name: "Show the deck view" }).click();

  await expect(page.locator(".concept-card[data-face]")).toBeVisible();
  await expect(tiles(page)).toHaveCount(0);

  await page.reload();

  await expect(page.locator(".concept-card[data-face]")).toBeVisible();
  await expect(tiles(page)).toHaveCount(0);
});

test("keeps the phone layout on the carousel with a search button", async ({
  page,
}, testInfo) => {
  phoneOnly(testInfo);

  await page.goto("/");

  await expect(page.locator(".concept-card[data-face]")).toBeVisible();
  await expect(tiles(page)).toHaveCount(0);
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Search the deck" })).toBeVisible();
});

test("filters the deck from the sheet and keeps the filter after Done", async ({
  page,
}, testInfo) => {
  phoneOnly(testInfo);

  await page.goto("/");
  await expect(page.locator(".concept-card[data-face]")).toBeVisible();

  await page.getByRole("button", { name: "Search the deck" }).click();

  const field = page.getByRole("searchbox", { name: "Search cards" });

  await field.pressSequentially("redis");
  await expect(page.getByText("2 of 28 cards")).toBeVisible();

  await page.getByRole("button", { name: "Done" }).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByLabel("Card 1 of 2")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Search the deck, filter active" }),
  ).toBeVisible();
});

test("takes a typed space rather than flipping the card behind", async ({
  page,
}, testInfo) => {
  phoneOnly(testInfo);

  await page.goto("/");
  await expect(page.locator(".concept-card[data-face]")).toBeVisible();

  await page.getByRole("button", { name: "Search the deck" }).click();

  const field = page.getByRole("searchbox", { name: "Search cards" });

  await field.pressSequentially("reverse proxy");

  await expect(field).toHaveValue("reverse proxy");
  await expect(page.locator(".concept-card[data-face]")).toHaveAttribute(
    "data-face",
    "front",
  );
});

test("keeps the document free of horizontal overflow while searching", async ({
  page,
}, testInfo) => {
  phoneOnly(testInfo);

  await page.goto("/");

  await page.getByRole("button", { name: "Search the deck" }).click();
  await page.getByRole("searchbox", { name: "Search cards" }).fill("a");

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
});

test("scrolls the grid inside the shell rather than scrolling the page", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");
  await expect(tiles(page)).toHaveCount(28);

  const documentOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight,
  );

  expect(documentOverflow).toBeLessThanOrEqual(0);

  const gridScrolls = await page
    .locator(".card-grid")
    .evaluate((grid) => grid.scrollHeight > grid.clientHeight);

  expect(gridScrolls).toBe(true);
});
```

- [ ] **Step 4: Build and run both projects**

```bash
pnpm --dir frontend build
pnpm --dir frontend test:e2e
```

Expected: PASS in both `chromium` and `mobile`, including every pre-existing
test in `concept-deck.spec.ts` and `theme.spec.ts`.

If `scrolls the grid inside the shell` reports that the grid does not overflow,
the desktop viewport is tall enough for all 28 tiles; reduce the assertion to
the document-overflow half rather than forcing a scroll that isn't there.

- [ ] **Step 5: Commit**

```bash
git add frontend/e2e/card-explorer.spec.ts frontend/e2e/concept-deck.spec.ts
git commit -m "test: cover the card grid, search and dialog end to end"
```

---

### Task 13: Documentation

**Files:**

- Modify: `CLAUDE.md`
- Modify: `docs/architecture.md`

**Interfaces:**

- Consumes: nothing.
- Produces: nothing the code imports.

- [ ] **Step 1: Amend the architecture doc**

In `docs/architecture.md`, find the "Intentionally Absent" section and the line
that records the theme's `localStorage` key. Extend that entry so it reads as
two keys rather than one — the deck stores a theme (`devops-tcg-theme`) and a
layout preference (`devops-tcg-view`), both of them per-browser conveniences
holding no card data, no identity and nothing the site reads back on the server.
Keep the rest of the list unchanged: there is still no backend, API, database,
auth, or cookie.

- [ ] **Step 2: Amend the project guide**

In `CLAUDE.md`, make three edits.

Replace the data-flow sentence in "Frontend architecture" with:

```markdown
Data flows one way: `src/data/conceptCards.ts` (a typed literal array
satisfying `ConceptCardData` from `src/types/concept.ts`) → `app/page.tsx` →
`ConceptExplorer`, which filters it and hands the result to either `CardGrid`
(viewports ≥1024px in grid view) or `ConceptDeck` → `ConceptCard` →
`CardFront`/`CardBack`, with `DeckControls` rendering the side arrows. Deck
bounds, counter, and navigation all derive from the length of the array the
deck is given, so adding a card is a data change plus tests — never a component
redesign.
```

Add a new bullet to the "Non-obvious mechanisms" list, after the theme-tokens
bullet:

```markdown
- **Two layouts, one filtered array.** `ConceptExplorer` is the shell: it owns
  the search filter, the stored view preference (`devops-tcg-view`, a second
  key alongside the theme's) and a mount-time `matchMedia("(min-width:
  1024px)")` measurement, and renders nothing that depends on the viewport
  until that measurement lands — the same placeholder beat the deck already
  takes for its shuffle, which is why the view preference needs no pre-paint
  script the way the theme does. Matching lives in `src/lib/filterCards.ts`:
  every whitespace-separated token must appear in the card's title, type,
  keywords or definition, ANDed with the category chip, and the chips are
  derived from the data so a card in a fifth category needs no code change. The
  filtered array must stay memoised — `ConceptDeck` re-deals its order whenever
  its `cards` prop changes identity, so a fresh array per render would reshuffle
  the deck on every keystroke, and `filterCards` returns the very array it was
  given when nothing is filtered for the same reason. Above 1024px the reader
  chooses between the grid and the carousel, so `RANK_BREAKPOINTS` stays whole;
  below it the carousel is the only layout and the toggle is absent rather than
  disabled. Every modal — the grid's card dialog and the phone's search sheet —
  renders through one `Dialog`, and the deck's document-level Enter/Space/Arrow
  shortcuts stand aside for any text field or anything inside a `[role="dialog"]`
  so a space typed into the search box is a space and not a flip.
```

Extend the "Behavioral contracts the tests enforce" paragraph with:

```markdown
typing in the search bar filters both layouts on every keystroke and the count
is a polite live region; a grid tile opens a dialog whose Escape returns focus
to that tile; the dialog's Previous/Next wrap through the filtered results only;
a dismissed search sheet keeps its filter and marks the header trigger; the grid
scrolls inside the locked shell rather than scrolling the document.
```

- [ ] **Step 3: Verify nothing else drifted**

```bash
pnpm --dir frontend format:check
git diff --stat
```

Expected: only `CLAUDE.md` and `docs/architecture.md` changed.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md docs/architecture.md
git commit -m "docs: describe the searchable explorer and its two layouts"
```

---

## Done When

- [ ] `pnpm --dir frontend format:check` passes.
- [ ] `pnpm --dir frontend lint` passes.
- [ ] `pnpm --dir frontend typecheck` passes.
- [ ] `pnpm --dir frontend test:coverage` passes at 85/85/80/85.
- [ ] `pnpm --dir frontend build` produces `frontend/out`.
- [ ] `pnpm --dir frontend test:e2e` passes in both the `chromium` and `mobile`
      projects.
- [ ] `frontend/package.json` still lists exactly `next`, `react` and
      `react-dom` under `dependencies`.
- [ ] Nothing has been pushed.
