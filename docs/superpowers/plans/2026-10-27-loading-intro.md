# Loading Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On every page load, show a fanning-cards loading wheel for about
0.8s, then either run the existing shuffle reel once (carousel) or fade the
grid in (grid view).

**Architecture:** `ConceptExplorer` owns a one-way intro phase,
`"holding" → "arriving" → "done"`, which only a page load ever starts. A new
`DeckLoader` is what the explorer renders while holding (and what the server
renders). On arriving, the grid gets a one-shot CSS fade, and `ConceptDeck`
receives `dealOnArrival` and runs its own `shuffle()` once, reporting back
through `onArrived`. The reel is the existing reel; nothing about its timing
changes.

**Tech Stack:** Next.js 14 (App Router, static export), React 18, TypeScript,
Tailwind CSS 3, Vitest + Testing Library (jsdom), Playwright.

**Spec:** `docs/superpowers/specs/2026-10-27-loading-intro-design.md`

## Global Constraints

- Runtime dependencies stay exactly `next`, `react`, `react-dom`. The wheel is
  markup and CSS keyframes, with no animation library.
- Every new colour comes from a custom property declared twice in
  `globals.css`, on `:root` (neon) and on `[data-theme="sketch"]`. No palette
  class or hex literal in a component.
- Every new animation and transition is switched off under
  `prefers-reduced-motion: reduce`.
- Hold: `INTRO_HOLD = 800` ms, measured from `performance.now()` (page-load
  origin), a minimum, never a maximum. Grid fade: `GRID_ARRIVE = 400` ms.
- Status label is exactly `Loading the deck`; the visible caption is exactly
  `DEALING`. `DeckPlaceholder` keeps `Shuffling cards`.
- Server render stays deterministic: it renders the wheel, never a dealt deck.
- No layout shift: the wheel fills the same box the deck/grid will, and on a
  narrow viewport an inert `DeckToolbar` holds its height under it.
- The intro starts only on mount of `ConceptExplorer`. Filter changes, chip
  changes, view switches, theme toggles and resizes never restart it.
- No new storage key, and no test-only switch in the production bundle (no
  query param, no global flag). Tests use props, which production never sets.

## Review Focus

- **Filter typed during the hold** (wide header search is live): the intro
  still runs on the filtered cards. If nothing matches, it ends at once on the
  empty state and never fires later. Pinned in Task 2.
- **Switching grid → deck after the intro:** the deck appears dealt, with no
  reel. Pinned in Task 3.
- **Filter changed after the reel:** the re-deal is silent (today's
  behaviour), with no second reel. Pinned in Task 3.
- **Reduced motion:** no hold and no reel, and the explorer reaches `done`
  immediately after the measurement. Pinned in Tasks 2 and 3.
- **Phone toolbar height:** the toolbar's top edge is the same while the wheel
  is up as once the deck has landed. Pinned in Task 4 (e2e, mobile).

---

### Task 1: The fanning-cards wheel

**Files:**
- Create: `frontend/src/components/DeckLoader.tsx`
- Create: `frontend/src/components/DeckLoader.test.tsx`
- Modify: `frontend/src/app/globals.css` (tokens in both theme blocks, the
  loader rules near `.concept-card-placeholder`, and an entry in the final
  reduced-motion block)

**Interfaces:**
- Produces: `export function DeckLoader(): JSX.Element`, with no props. It
  renders one `role="status"` element with `aria-busy="true"`,
  `aria-label="Loading the deck"`, `data-testid="deck-loader"` and class
  `deck-loader`, laid out as `flex min-h-0 w-full flex-1` so it fills the
  content area. Inside: an `aria-hidden="true"` `.deck-loader-fan` holding
  three `.deck-loader-card` spans, then the caption `DEALING`.

- [ ] **Step 1: Write the failing test**

```tsx
// DeckLoader.test.tsx
it("is a busy status the server can render", () => {
  const html = renderToStaticMarkup(<DeckLoader />);
  expect(html).toContain('role="status"');
  expect(html).toContain('aria-busy="true"');
  expect(html).toContain('aria-label="Loading the deck"');
  expect(html).toContain("DEALING");
});

it("keeps the card backs out of the accessibility tree", () => {
  render(<DeckLoader />);
  const fan = screen.getByTestId("deck-loader").querySelector(".deck-loader-fan");
  expect(fan).toHaveAttribute("aria-hidden", "true");
  expect(fan!.querySelectorAll(".deck-loader-card")).toHaveLength(3);
});
```

- [ ] **Step 2: Run it and see it fail**

Run: `pnpm --dir frontend exec vitest run src/components/DeckLoader.test.tsx`
Expected: FAIL, module `./DeckLoader` not found.

- [ ] **Step 3: Implement `DeckLoader` and its CSS**

Tokens, declared on `:root` and again on `[data-theme="sketch"]`:
`--loader-back-1`, `--loader-back-2`, `--loader-back-3` (outline colours;
neon: violet / cyan / gold matching the rim, as in mockup B; sketch: all the
ink colour), `--loader-back-fill` (neon: `var(--card-surface)`; sketch: paper)
and `--loader-back-shadow` (neon: a soft glow in the outline colour; sketch:
the `3px 4px 0` ink offset used by `--placeholder-shadow`). Caption styled from
the existing small-caps label tokens.

The fan: cards about 56×76px with rounded corners, `transform-origin: 50% 120%`.
Card 1 runs `@keyframes deck-loader-fan` (−14deg ↔ 14deg, 1.1s ease-in-out
infinite), card 2 runs the same animation reversed, and card 3 stays still. In
the existing final `@media (prefers-reduced-motion: reduce)` block, set
`.deck-loader-card { animation: none; }`.

- [ ] **Step 4: Run it and see it pass**

Run: `pnpm --dir frontend exec vitest run src/components/DeckLoader.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/DeckLoader.tsx frontend/src/components/DeckLoader.test.tsx frontend/src/app/globals.css
git commit -m "feat: add the fanning-cards loading wheel"
```

---

### Task 2: The explorer's intro phase, the hold and the grid fade

**Files:**
- Modify: `frontend/src/components/ConceptExplorer.tsx`
- Modify: `frontend/src/components/CardGrid.tsx`
- Modify: `frontend/src/app/globals.css` (grid fade keyframes and their
  reduced-motion entry)
- Test: `frontend/src/components/ConceptExplorer.test.tsx`,
  `frontend/src/app/page.test.tsx`

**Interfaces:**
- Consumes: `DeckLoader` (Task 1).
- Produces:
  - `export type IntroPhase = "holding" | "arriving" | "done";` exported from
    `ConceptExplorer.tsx`.
  - Exported constants `INTRO_HOLD = 800` and `GRID_ARRIVE = 400`.
  - New optional props on `ConceptExplorer`:
    - `intro?: boolean`, default `true`. When `false`, the phase starts at
      `"done"`, which is today's behaviour exactly. This is for tests only.
    - `introHold?: number`, default `INTRO_HOLD`.
  - The stage root (`.app-stage`) carries `data-intro={phase}`. The e2e suite
    waits on `[data-intro="done"]`.
  - `CardGrid` gains `arriving?: boolean`. When true, the `<ul>` carries
    `data-arriving="true"`.
  - Task 3 wires the deck into the `"arriving"` phase. Until then, a deck
    view goes from `"arriving"` straight to `"done"`.

Phase rules:
- `"holding"` lasts until the viewport is measured (`isWide !== null`) **and**
  `max(0, introHold - performance.now())` ms have passed. Under reduced motion,
  the hold is 0.
- `"arriving"` then `"done"`:
  - Grid: after `GRID_ARRIVE` ms, or at once under reduced motion.
  - Empty results: at once.
  - Deck: Task 3.
- While `"holding"`, the content slot renders `<DeckLoader />`, plus
  `<DeckToolbar searchControl={searchControl} />` when `isWide === false`
  (inert, as `DeckPlaceholder` does). The old `isWide === null` status `div`
  is deleted: `DeckLoader` covers that beat.

CSS: `.card-grid[data-arriving] { animation: card-grid-arrive 400ms ease both; }`
with keyframes from `opacity: 0` to `opacity: 1`, set to `animation: none`
under reduced motion.

- [ ] **Step 1: Keep the existing suite on today's behaviour**

Change the `mount` helper in `ConceptExplorer.test.tsx` to pass `intro={false}`.
In `page.test.tsx`, give the tile `waitFor` a `{ timeout: 3000 }`, since
`Home` uses the real intro.

- [ ] **Step 2: Write the failing tests** (new `describe("intro")` in `ConceptExplorer.test.tsx`)

```tsx
const mountIntro = (props: Partial<ComponentProps<typeof ConceptExplorer>> = {}) =>
  render(<ConceptExplorer cards={conceptCards} random={() => 0.999999} introHold={0} {...props} />);
const stage = () => document.querySelector(".app-stage")!;

it("server-renders the loading wheel and no cards", () => {
  const html = renderToStaticMarkup(<ConceptExplorer cards={conceptCards} />);
  expect(html).toContain("Loading the deck");
  expect(html).not.toContain("Open the Proxy card");
});

it("holds the wheel until the hold has passed", () => {
  vi.useFakeTimers();
  vi.spyOn(performance, "now").mockReturnValue(100);
  mountIntro({ introHold: 800 });
  act(() => vi.advanceTimersByTime(650));
  expect(screen.getByRole("status", { name: "Loading the deck" })).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(100));
  expect(screen.queryByRole("status", { name: "Loading the deck" })).not.toBeInTheDocument();
  vi.useRealTimers();
});

it("fades the grid in once and then finishes", async () => {
  mountIntro();
  await waitFor(() => expect(screen.getByRole("list", { name: "Concept cards" })).toHaveAttribute("data-arriving", "true"));
  await waitFor(() => expect(stage()).toHaveAttribute("data-intro", "done"), { timeout: 1500 });
  expect(screen.getByRole("list", { name: "Concept cards" })).not.toHaveAttribute("data-arriving");
});

it("ends at once on an empty filter typed during the hold", async () => {
  // Wide: the header search exists while holding.
  const user = userEvent.setup();
  mountIntro({ introHold: 300 });
  await user.type(await screen.findByRole("searchbox"), "zzz");
  await waitFor(() => expect(stage()).toHaveAttribute("data-intro", "done"));
  expect(screen.getByRole("button", { name: "Clear the filters" })).toBeInTheDocument();
});

it("skips the hold and the fade under reduced motion", async () => {
  // jsdom has no matchMedia; stub it so "(prefers-reduced-motion: reduce)"
  // matches and GRID_MEDIA_QUERY matches at 1024.
  stubMatchMedia({ reducedMotion: true });
  mountIntro({ introHold: 800 });
  await waitFor(() => expect(stage()).toHaveAttribute("data-intro", "done"), { timeout: 200 });
});

it("shows an inert toolbar under the wheel on a narrow viewport", () => {
  setViewportWidth(375);
  mountIntro({ introHold: 60_000 });
  expect(screen.getByRole("status", { name: "Loading the deck" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Previous card" })).toBeDisabled();
});
```

`stubMatchMedia` is a small local helper in the test file. Restore it in
`afterEach`.

- [ ] **Step 3: Run them and see them fail**

Run: `pnpm --dir frontend exec vitest run src/components/ConceptExplorer.test.tsx`
Expected: the new `intro` tests FAIL. The pre-existing tests still PASS
because of `intro={false}`.

- [ ] **Step 4: Implement the phase, the hold, `data-intro`, the loader slot and the grid fade** as specified above.

- [ ] **Step 5: Run the explorer, page and grid tests and see them pass**

Run: `pnpm --dir frontend exec vitest run src/components/ConceptExplorer.test.tsx src/app/page.test.tsx src/components/CardGrid.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/ConceptExplorer.tsx frontend/src/components/ConceptExplorer.test.tsx frontend/src/components/CardGrid.tsx frontend/src/app/page.test.tsx frontend/src/app/globals.css
git commit -m "feat: hold a loading wheel on page load and fade the grid in"
```

---

### Task 3: The deck's arrival reel

**Files:**
- Modify: `frontend/src/components/ConceptDeck.tsx`
- Modify: `frontend/src/components/ConceptExplorer.tsx`
- Test: `frontend/src/components/ConceptDeck.test.tsx`,
  `frontend/src/components/ConceptExplorer.test.tsx`

**Interfaces:**
- Consumes: `IntroPhase` and `data-intro` (Task 2); the existing `shuffle()`
  and `isSpinning` inside `ConceptDeck`.
- Produces: new optional `ConceptDeckProps`:
  - `dealOnArrival?: boolean`, default `false`.
  - `onArrived?: () => void`.

Rules:
- When `dealOnArrival` is true and the current `deckOrder` belongs to the
  current `cards`, the deck calls `shuffle()` exactly once.
  - It calls `onArrived()` when the reel stops: in the same place that already
    calls `setIsSpinning(false)`.
  - Under reduced motion, `shuffle()` lands at once, so it calls `onArrived()`
    straight after.
  - A ref guards against running twice, including a StrictMode double effect
    and the prop staying true across renders.
- If the deck has fewer than two cards, `shuffle()` is a no-op. `onArrived()`
  must still fire.
- The explorer passes `dealOnArrival={phase === "arriving"}` and
  `onArrived={() => setPhase("done")}` to the deck, and passes nothing to
  `CardDialog`.

- [ ] **Step 1: Write the failing deck tests** (`ConceptDeck.test.tsx`)

```tsx
it("reels once on arrival and reports when it stops", async () => {
  const onArrived = vi.fn();
  render(<ConceptDeck cards={conceptCards} random={() => 0.999999} dealOnArrival onArrived={onArrived} />);
  await waitFor(() => expect(screen.getByTestId("deck-track")).toHaveAttribute("data-spinning", "true"));
  expect(onArrived).not.toHaveBeenCalled();
  await waitFor(() => expect(onArrived).toHaveBeenCalledTimes(1), { timeout: 4000 });
  expect(screen.getByTestId("deck-track")).not.toHaveAttribute("data-spinning");
  expect(document.querySelector(".concept-card[data-face]")).toHaveAttribute("data-face", "front");
});

it("does not reel without dealOnArrival", async () => {
  render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);
  await screen.findByRole("button", { name: "Proxy card, front shown" });
  expect(screen.getByTestId("deck-track")).not.toHaveAttribute("data-spinning");
});

it("still reports arrival for a single card", async () => {
  const onArrived = vi.fn();
  render(<ConceptDeck cards={conceptCards.slice(0, 1)} dealOnArrival onArrived={onArrived} />);
  await waitFor(() => expect(onArrived).toHaveBeenCalledTimes(1));
});
```

Use the file's existing reduced-motion stub pattern if there is one, or a
local `matchMedia` stub, and add:
`it("arrives at once under reduced motion")`. It asserts that `onArrived` is
called with `data-spinning` never set.

- [ ] **Step 2: Write the failing explorer tests** (inside the Task 2 `describe("intro")`)

```tsx
it("reels the deck once on load, then finishes", async () => {
  setViewportWidth(375);
  mountIntro();
  await waitFor(() => expect(screen.getByTestId("deck-track")).toHaveAttribute("data-spinning", "true"));
  await waitFor(() => expect(stage()).toHaveAttribute("data-intro", "done"), { timeout: 4000 });
});

it("does not reel again when the filter changes after arrival", async () => { /* narrow; finish intro; open sheet; type "redis"; assert data-spinning never "true" over 300ms */ });

it("shows the deck without a reel when switching from the grid after load", async () => { /* wide; wait done; click "Show the deck view"; assert no data-spinning */ });
```

- [ ] **Step 3: Run them and see them fail**

Run: `pnpm --dir frontend exec vitest run src/components/ConceptDeck.test.tsx src/components/ConceptExplorer.test.tsx`
Expected: the new tests FAIL. Everything else PASSES.

- [ ] **Step 4: Implement `dealOnArrival`/`onArrived` in `ConceptDeck` and wire them in the explorer** per the rules above.

- [ ] **Step 5: Run the whole unit suite with coverage**

Run: `pnpm --dir frontend test:coverage`
Expected: all PASS, and the thresholds (85/85/80/85) hold.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/components/ConceptDeck.tsx frontend/src/components/ConceptDeck.test.tsx frontend/src/components/ConceptExplorer.tsx frontend/src/components/ConceptExplorer.test.tsx
git commit -m "feat: deal the deck with one reel on page load"
```

---

### Task 4: End-to-end coverage and docs

**Files:**
- Create: `frontend/e2e/arrive.ts`
- Create: `frontend/e2e/loading-intro.spec.ts`
- Modify: `frontend/e2e/concept-deck.spec.ts`,
  `frontend/e2e/card-explorer.spec.ts`, `frontend/e2e/theme.spec.ts`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: `[data-intro="done"]` (Task 2), `data-testid="deck-loader"`
  (Task 1), `data-spinning` on `deck-track`.
- Produces: `export async function arrive(page: Page, path = "/"): Promise<void>`,
  which does `page.goto(path)` and then
  `await expect(page.locator('[data-intro="done"]')).toBeVisible({ timeout: 10_000 })`.

- [ ] **Step 1: Route the existing specs through `arrive`**

Replace each `await page.goto(<path>)` with `await arrive(page, <path>)`. The
exception is a test that deliberately asserts something before hydration or
during loading; leave those on `goto`. Do not add `emulateMedia` globally:
the reduced-motion specs at `concept-deck.spec.ts` ~1406/1418 keep their own.

- [ ] **Step 2: Write `loading-intro.spec.ts`**

```ts
test("opens on the wheel, then settles on a front-up card", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  await expect(page.getByTestId("deck-loader")).toBeVisible();
  const toolbarTop = await page.locator(".deck-toolbar").evaluate((el) => el.getBoundingClientRect().top);
  await expect(page.getByTestId("deck-track")).toHaveAttribute("data-spinning", "true");
  await expect(page.locator('[data-intro="done"]')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".concept-card[data-face]")).toHaveAttribute("data-face", "front");
  expect(await page.locator(".deck-toolbar").evaluate((el) => el.getBoundingClientRect().top)).toBe(toolbarTop);
});

test("opens on the wheel, then fades in the full grid", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium");
  await page.goto("/");
  await expect(page.getByTestId("deck-loader")).toBeVisible();
  await expect(page.locator('[data-intro="done"]')).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("button", { name: /^Open the .* card$/ })).toHaveCount(48);
});

test("skips the reel under reduced motion", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator('[data-intro="done"]')).toBeVisible({ timeout: 2_000 });
  await expect(page.getByTestId("deck-track")).not.toHaveAttribute("data-spinning");
});
```

Capture `toolbarTop` while the wheel is up. If the wheel is gone before the
first read on a fast machine, read it from the server HTML state by pausing
with `page.route` on the JS chunks. That is the builder's call, as long as the
assertion compares a pre-arrival position to the settled one.

- [ ] **Step 3: Build and run the whole e2e suite**

Run: `pnpm --dir frontend build && pnpm --dir frontend test:e2e`
Expected: all PASS on both `chromium` and `mobile`.

- [ ] **Step 4: Document the intro in `CLAUDE.md`**

Add a bullet under "Non-obvious mechanisms" covering:
- the explorer's `holding → arriving → done` phase, `data-intro`, and that
  only mount starts it;
- `DeckLoader` replacing the old "Preparing the deck" beat;
- `dealOnArrival` reusing `shuffle()`;
- the e2e `arrive()` helper.

Add the behavioural contract: "a page load shows the `Loading the deck` wheel
for at least 0.8s, then reels the deck once or fades the grid in, and nothing
else ever replays it."

- [ ] **Step 5: Run the full gate**

Run: `pnpm --dir frontend format:check && pnpm --dir frontend lint && pnpm --dir frontend typecheck && pnpm --dir frontend test:coverage`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add frontend/e2e CLAUDE.md
git commit -m "test: drive the e2e suite through the loading intro"
```
