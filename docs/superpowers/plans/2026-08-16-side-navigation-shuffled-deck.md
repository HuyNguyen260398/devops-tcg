# Side Navigation and Shuffled Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the bottom deck controls with accessible side-arrow navigation and show all nine cards in a newly shuffled order after each reload.

**Architecture:** Add an immutable, injectable Fisher-Yates utility, then initialize `ConceptDeck` from that utility in a client effect behind a layout-stable server-safe placeholder. Reduce `DeckControls` to two absolutely positioned icon buttons around the existing flexible card and make the browser suite order-independent.

**Tech Stack:** Next.js 14 static export, React 18, TypeScript, Tailwind CSS, global CSS, Vitest, Testing Library, Playwright

## Global Constraints

- Use the approved centered-edge overlay layout with 46-by-46-pixel Previous and Next buttons.
- Use inline SVG chevrons with `aria-hidden="true"`; add no icon package or other dependency.
- Keep native button disabled behavior, visible focus rings, and the accessible names `Previous card` and `Next card`.
- Remove the explicit Flip button, but preserve card click, Enter, and Space flipping in both directions.
- Remove `CONCEPT STUDY DECK`; retain `DevOps TCG` and the polite live position counter.
- Shuffle the entire card order once after hydration with immutable Fisher-Yates and `Math.random` by default.
- Use no local storage, session storage, API, server session, or guarantee that consecutive reloads differ.
- Keep navigation bounded; add no wrap-around, swipe, or ArrowLeft/ArrowRight behavior.
- Preserve the 350px card maximum width, artwork, copy, neon styling, flip animation, reduced motion, and missing-image fallback.
- Preserve the `100dvh` viewport flex chain, internal card-face scrolling, and zero document overflow at desktop 1280×720 and mobile 320×700.
- Keep every navigation target fully inside the viewport and at least 44 by 44 pixels.

---

## File Map

- Create `frontend/src/lib/shuffle.ts` — immutable generic Fisher-Yates utility with injectable randomness.
- Create `frontend/src/lib/shuffle.test.ts` — deterministic algorithm, immutability, and boundary coverage.
- Modify `frontend/src/components/ConceptDeck.tsx` — hydration-safe shuffle ownership, loading placeholder, simplified header, shuffled counter/navigation.
- Modify `frontend/src/components/ConceptDeck.test.tsx` — deterministic shuffled-deck, placeholder, header, flip, and navigation coverage.
- Modify `frontend/src/app/page.test.tsx` — hydration-aware, order-independent page integration coverage.
- Modify `frontend/src/components/ConceptCard.tsx` — remove explicit flip-control plumbing and anchor side navigation around the card.
- Modify `frontend/src/components/DeckControls.tsx` — two labelled SVG arrow buttons only.
- Modify `frontend/src/app/globals.css` — stable loading surface and centered edge-overlay control positioning.
- Modify `frontend/e2e/concept-deck.spec.ts` — stop assuming source order and verify the new side controls in both viewport projects.

### Task 1: Add an immutable Fisher-Yates shuffle utility

**Files:**

- Create: `frontend/src/lib/shuffle.ts`
- Create: `frontend/src/lib/shuffle.test.ts`

**Interfaces:**

- Consumes: a `readonly T[]` and optional `RandomSource` function returning the same `[0, 1)` values as `Math.random`.
- Produces: `RandomSource = () => number` and `shuffleCards<T>(cards: readonly T[], random?: RandomSource): T[]`.

- [ ] **Step 1: Write the failing utility tests**

Create `frontend/src/lib/shuffle.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { shuffleCards } from "./shuffle";

describe("shuffleCards", () => {
  it("uses Fisher-Yates with an injectable random sequence", () => {
    const values = [0, 0.5, 0.75];
    let index = 0;

    expect(shuffleCards(["a", "b", "c", "d"], () => values[index++])).toEqual([
      "d",
      "c",
      "b",
      "a",
    ]);
  });

  it("returns a new array without mutating the source", () => {
    const source = Object.freeze(["proxy", "cdn", "nginx"]);
    const shuffled = shuffleCards(source, () => 0);

    expect(shuffled).toEqual(["cdn", "nginx", "proxy"]);
    expect(shuffled).not.toBe(source);
    expect(source).toEqual(["proxy", "cdn", "nginx"]);
  });

  it("handles empty and one-card collections", () => {
    const onlyCard = { id: "proxy" };

    expect(shuffleCards([], () => 0)).toEqual([]);
    expect(shuffleCards([onlyCard], () => 0)).toEqual([onlyCard]);
  });
});
```

- [ ] **Step 2: Run the utility test and verify RED**

Run:

```bash
pnpm --dir frontend test -- src/lib/shuffle.test.ts
```

Expected: FAIL because `frontend/src/lib/shuffle.ts` does not exist.

- [ ] **Step 3: Implement the minimal immutable shuffle**

Create `frontend/src/lib/shuffle.ts`:

```ts
export type RandomSource = () => number;

export function shuffleCards<T>(
  cards: readonly T[],
  random: RandomSource = Math.random,
): T[] {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}
```

- [ ] **Step 4: Run the utility test and verify GREEN**

Run:

```bash
pnpm --dir frontend test -- src/lib/shuffle.test.ts
```

Expected: 3 tests pass with no failures.

- [ ] **Step 5: Run type checking and inspect the diff**

Run separately:

```bash
pnpm --dir frontend typecheck
```

```bash
git diff --check
```

Expected: both commands exit successfully.

- [ ] **Step 6: Commit the shuffle utility**

```bash
git add frontend/src/lib/shuffle.ts frontend/src/lib/shuffle.test.ts
git commit -m "feat: add immutable card shuffle"
```

### Task 2: Initialize the deck from a hydration-safe shuffled order

**Files:**

- Modify: `frontend/src/components/ConceptDeck.tsx`
- Modify: `frontend/src/components/ConceptDeck.test.tsx`
- Modify: `frontend/src/app/page.test.tsx`
- Modify: `frontend/src/app/globals.css`

**Interfaces:**

- Consumes: `shuffleCards` and `RandomSource` from Task 1.
- Produces: `ConceptDeckProps.random?: RandomSource` for deterministic component tests; `.concept-card-placeholder` and `.concept-card-placeholder-surface` CSS hooks.
- Preserves: `ConceptDeckProps.cards: readonly ConceptCardData[]`, bounded index navigation, empty-deck text, live counter, and `ConceptCard` props.

- [ ] **Step 1: Add failing shuffled-order and server-placeholder tests**

Update the imports in `frontend/src/components/ConceptDeck.test.tsx`:

```ts
import { renderToStaticMarkup } from "react-dom/server";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
```

Add these tests inside `describe("ConceptDeck", ...)`:

```ts
it("renders a stable busy placeholder before client shuffle initialization", () => {
  const html = renderToStaticMarkup(
    <ConceptDeck cards={conceptCards} random={() => 0} />,
  );

  expect(html).toContain('aria-busy="true"');
  expect(html).toContain("Shuffling cards");
  expect(html).not.toContain("Proxy card, front shown");
  expect(html).not.toContain('aria-label="Card controls"');
});

it("navigates a deterministic shuffled order without mutating source order", async () => {
  const user = userEvent.setup();
  render(<ConceptDeck cards={conceptCards} random={() => 0} />);

  expect(
    await screen.findByRole("button", { name: "CDN card, front shown" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("CONCEPT STUDY DECK")).not.toBeInTheDocument();
  expect(screen.getByText("01 / 09")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Next card" }));
  expect(
    screen.getByRole("button", { name: "NGINX card, front shown" }),
  ).toBeInTheDocument();
  expect(screen.getByText("02 / 09")).toBeInTheDocument();
  expect(conceptCards[0].title).toBe("Proxy");
});
```

For every existing component test that needs the original order, pass the
stable identity random source explicitly:

```tsx
<ConceptDeck cards={conceptCards} random={() => 0.999999} />
```

For the existing one-card test, keep the single-card input and add the same
`random` prop. Leave the empty-deck test without `random` because it must render
the message synchronously.

Replace the test in `frontend/src/app/page.test.tsx` with an async,
order-independent integration assertion:

```tsx
it("renders deck identity, count, shuffled card, and instruction", async () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", { name: "DevOps TCG" }),
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("button", { name: /card, front shown$/ }),
  ).toBeInTheDocument();
  expect(screen.getByText("01 / 09")).toBeInTheDocument();
  expect(
    screen.getByText(/click the card or use enter or space/i),
  ).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the component tests and verify RED**

Run:

```bash
pnpm --dir frontend test -- src/components/ConceptDeck.test.tsx src/app/page.test.tsx
```

Expected: FAIL because `ConceptDeck` has no `random` prop, renders Proxy during
server rendering, retains the eyebrow, and does not shuffle its cards.

- [ ] **Step 3: Add private header and loading-placeholder components**

In `frontend/src/components/ConceptDeck.tsx`, update imports and props:

```ts
import { useEffect, useState } from "react";
import { shuffleCards, type RandomSource } from "@/lib/shuffle";

interface ConceptDeckProps {
  readonly cards: readonly ConceptCardData[];
  readonly random?: RandomSource;
}
```

Add these private components below `formatPosition`:

```tsx
interface DeckHeaderProps {
  readonly position: number | null;
  readonly total: number;
}

function DeckHeader({ position, total }: DeckHeaderProps) {
  const ready = position !== null;

  return (
    <header className="concept-deck-header flex w-full shrink-0 items-end justify-between border-b border-white/10">
      <h1 className="text-2xl font-black uppercase tracking-[0.12em] text-white sm:text-3xl">
        DevOps TCG
      </h1>
      <p
        aria-label={ready ? `Card ${position} of ${total}` : undefined}
        aria-live={ready ? "polite" : undefined}
        aria-hidden={ready ? undefined : true}
        className="pb-1 font-mono text-xs font-semibold tracking-[0.18em] text-slate-300"
      >
        {ready ? formatPosition(position) : "--"} / {formatPosition(total)}
      </p>
    </header>
  );
}

function DeckPlaceholder({ total }: { readonly total: number }) {
  return (
    <section
      aria-label="Concept card deck"
      className="flex min-h-0 w-full max-w-[350px] flex-1 flex-col"
    >
      <DeckHeader position={null} total={total} />
      <div
        role="status"
        aria-busy="true"
        aria-label="Shuffling cards"
        className="concept-card-layout flex min-h-0 w-full flex-1 flex-col"
      >
        <div className="concept-card concept-card-placeholder relative mx-auto flex min-h-0 w-full max-w-[350px] flex-1 flex-col p-[2px]">
          <div className="concept-card-placeholder-surface h-full w-full rounded-[26px]" />
        </div>
      </div>
    </section>
  );
}
```

This intentionally implements the approved header simplification at the same
time, so neither the real deck nor its placeholder duplicates the removed
eyebrow.

- [ ] **Step 4: Own a shuffled order in `ConceptDeck`**

Add this private state type:

```ts
interface DeckOrder {
  readonly sourceCards: readonly ConceptCardData[];
  readonly random: RandomSource;
  readonly cards: readonly ConceptCardData[];
}
```

Change the component signature and initialize the shuffled order after mount:

```tsx
export function ConceptDeck({ cards, random = Math.random }: ConceptDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [deckOrder, setDeckOrder] = useState<DeckOrder | null>(null);

  useEffect(() => {
    if (cards.length === 0) return;

    setDeckOrder({
      sourceCards: cards,
      random,
      cards: shuffleCards(cards, random),
    });
    setActiveIndex(0);
  }, [cards, random]);

  if (cards.length === 0) {
    return <p>No concept cards available.</p>;
  }

  if (
    deckOrder === null ||
    deckOrder.sourceCards !== cards ||
    deckOrder.random !== random
  ) {
    return <DeckPlaceholder total={cards.length} />;
  }

  const shuffledCards = deckOrder.cards;
  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < shuffledCards.length - 1;
  const card = shuffledCards[activeIndex];
```

In the returned section, replace the existing header with:

```tsx
<DeckHeader position={activeIndex + 1} total={shuffledCards.length} />
```

Update both navigation bounds to use `shuffledCards.length`:

```tsx
onPrevious={() => setActiveIndex((index) => Math.max(0, index - 1))}
onNext={() =>
  setActiveIndex((index) => Math.min(shuffledCards.length - 1, index + 1))
}
```

- [ ] **Step 5: Style the layout-stable placeholder**

Add these rules to `frontend/src/app/globals.css` after `.concept-card`:

```css
.concept-card-placeholder {
  background: conic-gradient(
    from 210deg,
    #67e8f9,
    #8b5cf6,
    #f6c453,
    #22d3ee,
    #67e8f9
  );
  box-shadow: 0 0 55px rgb(34 211 238 / 0.11);
}

.concept-card-placeholder-surface {
  border: 1px solid rgb(255 255 255 / 0.12);
  background:
    radial-gradient(circle at 50% 25%, rgb(34 211 238 / 0.1), transparent 40%),
    linear-gradient(145deg, rgb(15 35 65 / 0.98), rgb(5 11 28 / 0.99));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.12),
    0 28px 70px rgb(0 0 0 / 0.52);
}
```

- [ ] **Step 6: Run the component and page tests and verify GREEN**

Run:

```bash
pnpm --dir frontend test -- src/components/ConceptDeck.test.tsx src/app/page.test.tsx
```

Expected: all component/page tests pass. The component tests may await the
post-effect card with `findByRole`, but the server-markup test must see only the
busy placeholder.

- [ ] **Step 7: Run static checks and inspect the diff**

Run separately:

```bash
pnpm --dir frontend format:check
pnpm --dir frontend lint
pnpm --dir frontend typecheck
```

```bash
git diff --check
```

Expected: formatting, lint, type checking, and whitespace checks pass.

- [ ] **Step 8: Commit hydration-safe shuffled initialization**

```bash
git add frontend/src/components/ConceptDeck.tsx frontend/src/components/ConceptDeck.test.tsx frontend/src/app/page.test.tsx frontend/src/app/globals.css
git commit -m "feat: shuffle deck after hydration"
```

### Task 3: Replace the bottom controls with side-arrow navigation

**Files:**

- Modify: `frontend/src/components/ConceptCard.tsx`
- Modify: `frontend/src/components/DeckControls.tsx`
- Modify: `frontend/src/components/ConceptDeck.test.tsx`
- Modify: `frontend/src/app/globals.css`

**Interfaces:**

- Consumes: the shuffled `card`, `canGoPrevious`, `canGoNext`, `onPrevious`, and `onNext` values already passed through `ConceptCard`.
- Produces: `DeckControlsProps` containing only `canGoPrevious`, `canGoNext`, `onPrevious`, and `onNext`; `.deck-controls`, `.deck-arrow`, `.deck-arrow-previous`, and `.deck-arrow-next` CSS hooks.
- Removes: `DeckControlsProps.isFlipped`, `DeckControlsProps.onFlip`, and the `Show card front` / `Show card back` button.

- [ ] **Step 1: Rewrite component expectations for the approved controls**

In `frontend/src/components/ConceptDeck.test.tsx`, replace the initial render
test with an async test that checks the simplified header and arrow-only
controls:

```ts
it("renders the simplified header and bounded arrow controls", async () => {
  render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

  await screen.findByRole("button", { name: "Proxy card, front shown" });
  expect(
    screen.getByRole("heading", { name: "DevOps TCG" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("CONCEPT STUDY DECK")).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /Show card/ }),
  ).not.toBeInTheDocument();
  expect(screen.getByText(conceptCards[0].definition)).toBeInTheDocument();
  for (const keyword of conceptCards[0].keywords) {
    expect(screen.getByText(keyword)).toBeInTheDocument();
  }

  const previous = screen.getByRole("button", { name: "Previous card" });
  const next = screen.getByRole("button", { name: "Next card" });
  expect(previous).toBeDisabled();
  expect(next).toBeEnabled();
  expect(previous.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  expect(next.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
});
```

Replace the explicit-control flip test with card-only interaction coverage:

```ts
it("flips with card click, Enter, and Space without a Flip button", async () => {
  const user = userEvent.setup();
  render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

  const card = await screen.findByRole("button", {
    name: "Proxy card, front shown",
  });
  const front = screen.getByTestId("card-front");
  const back = screen.getByTestId("card-back");

  expect(
    screen.queryByRole("button", { name: /Show card/ }),
  ).not.toBeInTheDocument();
  await user.click(card);
  expect(front).toHaveAttribute("aria-hidden", "true");
  expect(back).toHaveAttribute("aria-hidden", "false");

  card.focus();
  await user.keyboard("{Enter}");
  expect(front).toHaveAttribute("aria-hidden", "false");

  await user.keyboard(" ");
  expect(back).toHaveAttribute("aria-hidden", "false");

  await user.click(card);
  expect(front).toHaveAttribute("aria-hidden", "false");
});
```

In the existing back-face-content test, replace the removed Flip-button click
with a click on the active card:

```ts
await user.click(
  await screen.findByRole("button", { name: "Proxy card, front shown" }),
);
```

In the existing bidirectional navigation test, flip the card with the same card
click before selecting Next. Keep the assertions that the navigation button
retains focus and the new card is front-first.

- [ ] **Step 2: Run the component tests and verify RED**

Run:

```bash
pnpm --dir frontend test -- src/components/ConceptDeck.test.tsx
```

Expected: FAIL because the Flip button still renders and the navigation buttons
still contain text rather than SVG icons.

- [ ] **Step 3: Reduce `DeckControls` to labelled SVG arrows**

Replace `frontend/src/components/DeckControls.tsx` with:

```tsx
interface DeckControlsProps {
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

export function DeckControls({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: DeckControlsProps) {
  const buttonClassName =
    "deck-arrow pointer-events-auto absolute flex h-[46px] w-[46px] items-center justify-center rounded-full border border-cyan-200/35 bg-[#071226]/95 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.18)] backdrop-blur-md transition-[border-color,background-color,transform,opacity] duration-200 hover:border-cyan-200/70 hover:bg-cyan-300/15 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050714] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-cyan-200/35 disabled:hover:bg-[#071226]/95";

  return (
    <nav
      aria-label="Card controls"
      className="deck-controls pointer-events-none absolute inset-0 z-20"
    >
      <button
        type="button"
        aria-label="Previous card"
        disabled={!canGoPrevious}
        onClick={onPrevious}
        className={`${buttonClassName} deck-arrow-previous`}
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

      <button
        type="button"
        aria-label="Next card"
        disabled={!canGoNext}
        onClick={onNext}
        className={`${buttonClassName} deck-arrow-next`}
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
    </nav>
  );
}
```

- [ ] **Step 4: Remove Flip-control plumbing from `ConceptCard`**

In `frontend/src/components/ConceptCard.tsx`, make the layout wrapper the
positioning context:

```tsx
<div className="concept-card-layout relative flex min-h-0 w-full flex-1 flex-col">
```

Replace the `DeckControls` call with:

```tsx
<DeckControls
  canGoPrevious={canGoPrevious}
  canGoNext={canGoNext}
  onPrevious={() => {
    setFlippedCardId(null);
    onPrevious();
  }}
  onNext={() => {
    setFlippedCardId(null);
    onNext();
  }}
/>
```

Do not change `toggleCard`, the outer card's `role`, click handler, Enter/Space
handler, `aria-pressed`, face state, or focus classes.

- [ ] **Step 5: Position the arrow controls at the card edges**

In `frontend/src/app/globals.css`, replace the old `.deck-controls` margin rule:

```css
.deck-controls {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
}

.deck-arrow {
  top: 50%;
  transform: translateY(-50%);
  touch-action: manipulation;
}

.deck-arrow:active {
  transform: translateY(-50%) scale(0.95);
}

.deck-arrow-previous {
  left: -0.5rem;
}

.deck-arrow-next {
  right: -0.5rem;
}
```

The 0.5rem offset keeps each 46px button within the 16px page padding at a
320px viewport while overlaying only the card edge. Do not change the card's
350px maximum width or the page's horizontal padding.

- [ ] **Step 6: Run component tests and verify GREEN**

Run:

```bash
pnpm --dir frontend test -- src/components/ConceptDeck.test.tsx
```

Expected: all tests pass. There is no Flip button or eyebrow; clicking and
keyboard activation still flip; both arrow buttons retain accessible labels,
SVG icons, bounds, and focus behavior.

- [ ] **Step 7: Run static checks and inspect the diff**

Run separately:

```bash
pnpm --dir frontend format:check
pnpm --dir frontend lint
pnpm --dir frontend typecheck
```

```bash
git diff --check
```

Expected: all checks pass without dependencies or unrelated file changes.

- [ ] **Step 8: Commit the side-arrow redesign**

```bash
git add frontend/src/components/ConceptCard.tsx frontend/src/components/DeckControls.tsx frontend/src/components/ConceptDeck.test.tsx frontend/src/app/globals.css
git commit -m "feat: add side arrow deck navigation"
```

### Task 4: Make browser acceptance coverage order-independent

**Files:**

- Modify: `frontend/e2e/concept-deck.spec.ts`

**Interfaces:**

- Consumes: `.concept-card[data-face]`, the existing card/button accessible names, the live counter, local image metadata, and the shuffled bounded arrow controls.
- Produces: order-independent acceptance coverage that still visits all nine shipped cards and verifies both desktop and 320×700 mobile layouts.

- [ ] **Step 1: Add order-independent browser helpers**

Below the `images` constant in `frontend/e2e/concept-deck.spec.ts`, add:

```ts
const card = (page: import("@playwright/test").Page) =>
  page.locator(".concept-card[data-face]");

const activeTitle = async (page: import("@playwright/test").Page) => {
  const label = await card(page).getAttribute("aria-label");
  if (!label) throw new Error("Active card has no accessible label");
  return label.replace(/ card, (?:front|back) shown$/, "");
};

async function navigateToCard(
  page: import("@playwright/test").Page,
  title: string,
) {
  const next = page.getByRole("button", { name: "Next card" });

  for (let position = 1; position <= images.length; position += 1) {
    if ((await activeTitle(page)) === title) return;
    if (await next.isDisabled()) break;
    await next.click();
  }

  throw new Error(`Could not find ${title} in the shuffled deck`);
}
```

- [ ] **Step 2: Rewrite flip and keyboard tests without a fixed first title**

Replace the first two tests with:

```ts
test("loads front-first and flips both directions without a Flip button", async ({
  page,
}) => {
  await page.goto("/");
  const activeCard = card(page);
  const title = await activeTitle(page);

  await expect(activeCard).toHaveAttribute("data-face", "front");
  await expect(
    page.getByRole("button", { name: /Show card (?:front|back)/ }),
  ).toHaveCount(0);
  await activeCard.click();
  await expect(
    page.getByRole("button", { name: `${title} card, back shown` }),
  ).toHaveAttribute("data-face", "back");
  await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "How it works" }),
  ).toBeVisible();
  await activeCard.click();
  await expect(activeCard).toHaveAttribute("data-face", "front");
});

test("supports keyboard flipping and first-card navigation", async ({
  page,
}) => {
  await page.goto("/");
  const activeCard = card(page);

  await activeCard.focus();
  await page.keyboard.press("Enter");
  await expect(activeCard).toHaveAttribute("data-face", "back");
  await expect(activeCard).toBeFocused();
  await page.keyboard.press("Space");
  await expect(activeCard).toHaveAttribute("data-face", "front");
  await expect(
    page.getByRole("button", { name: "Previous card" }),
  ).toBeDisabled();
  await expect(page.getByRole("button", { name: "Next card" })).toBeEnabled();
});
```

- [ ] **Step 3: Traverse and verify the complete shuffled deck**

Replace the existing bounded-counter test with:

```ts
test("navigates every shuffled card with a live bounded counter", async ({
  page,
}) => {
  await page.goto("/");
  const previous = page.getByRole("button", { name: "Previous card" });
  const next = page.getByRole("button", { name: "Next card" });
  const seen = new Set<string>();

  for (let position = 1; position <= images.length; position += 1) {
    await expect(
      page.getByText(
        `${position.toString().padStart(2, "0")} / ${images.length
          .toString()
          .padStart(2, "0")}`,
      ),
    ).toBeVisible();
    seen.add(await activeTitle(page));

    if (position < images.length) {
      await next.click();
      await expect(next).toBeFocused();
    }
  }

  expect(seen.size).toBe(images.length);
  await expect(next).toBeDisabled();
  await expect(previous).toBeEnabled();

  for (let position = images.length; position > 1; position -= 1) {
    await previous.click();
  }

  await expect(previous).toBeDisabled();
  await expect(page.getByText("01 / 09")).toBeVisible();
});
```

- [ ] **Step 4: Verify every image independent of shuffled position**

Replace the unique-image loop with:

```ts
await page.goto("/");
const loadedSources = new Set<string>();

for (let position = 0; position < images.length; position += 1) {
  const image = page.locator(".card-face-front img");
  await expect(image).toHaveCount(1);
  await expect
    .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
    .toBeGreaterThan(0);

  const source = await image.getAttribute("src");
  if (!source) throw new Error("Active card image has no source");
  loadedSources.add(source);

  if (position < images.length - 1) {
    await page.getByRole("button", { name: "Next card" }).click();
  }
}

expect([...loadedSources].sort()).toEqual(
  images.map(([, source]) => source).sort(),
);
expect(externalImages).toEqual([]);
```

Keep the existing `externalImages` request listener above this replacement.

- [ ] **Step 5: Update viewport and text-zoom acceptance**

In the complete-navigation viewport test, remove the assertion for `Show card
back`. Keep full-viewport assertions for Previous, Next, and the usage hint, then
add exact touch-target checks:

```ts
for (const name of ["Previous card", "Next card"]) {
  const button = page.getByRole("button", { name });
  await expect(button).toBeInViewport({ ratio: 1 });
  const box = await button.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
}
```

Keep the current document-height and front-face height/overflow assertions.

In the 200% text-zoom test, replace the fixed three-click loop with:

```ts
await navigateToCard(page, "Reverse Proxy");
```

Replace the removed `Show card back` click with:

```ts
await card(page).click();
```

Keep all front/back overflow measurements, scroll-to-bottom checks, content
assertions, and the 320px horizontal-containment assertion unchanged.

- [ ] **Step 6: Build and run the updated browser spec**

Run separately:

```bash
pnpm --dir frontend build
```

```bash
pnpm --dir frontend exec playwright test e2e/concept-deck.spec.ts
```

Expected: 14 passed and the two existing desktop skips for mobile-specific tests.
Confirm specifically that all shuffled cards/images are visited, arrows are
fully visible and at least 44px, card clicking and keyboard flipping work, 320px
horizontal containment passes, 200% text zoom scrolls internally, viewport
height remains contained, and reduced motion still passes.

- [ ] **Step 7: Run the complete static and unit quality gate**

Run each command separately:

```bash
pnpm --dir frontend format:check
pnpm --dir frontend lint
pnpm --dir frontend typecheck
pnpm --dir frontend test:coverage
```

Expected: formatting, lint, and type checking pass; all unit tests pass; existing
coverage thresholds remain satisfied with the new shuffle utility included.

- [ ] **Step 8: Run the complete browser regression suite**

Run:

```bash
pnpm --dir frontend test:e2e
```

Expected: the full desktop/mobile matrix passes with only the two intended
desktop skips.

- [ ] **Step 9: Inspect the final diff**

Run separately:

```bash
git diff --check
```

```bash
git status --short
```

```bash
git diff HEAD~3 --stat
```

Expected: no whitespace errors; `git status --short` lists only the uncommitted
browser spec from this task; and the three-task implementation range plus the
current browser changes contains only these files:

```text
frontend/e2e/concept-deck.spec.ts
frontend/src/app/globals.css
frontend/src/app/page.test.tsx
frontend/src/components/ConceptCard.tsx
frontend/src/components/ConceptDeck.test.tsx
frontend/src/components/ConceptDeck.tsx
frontend/src/components/DeckControls.tsx
frontend/src/lib/shuffle.test.ts
frontend/src/lib/shuffle.ts
```

- [ ] **Step 10: Commit the order-independent acceptance coverage**

```bash
git add frontend/e2e/concept-deck.spec.ts
git commit -m "test: cover shuffled side navigation"
```
