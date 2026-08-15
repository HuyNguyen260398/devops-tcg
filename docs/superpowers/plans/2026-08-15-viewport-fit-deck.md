# Viewport-Fit Concept Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the complete DevOps TCG page and its card navigation within the visible browser height without sacrificing readable card content.

**Architecture:** Convert the page, deck, and card wrappers into one continuous `min-height: 0` flex chain rooted in a `100dvh` shell. Header, controls, and keyboard hint remain non-shrinking while the card takes the remaining height up to its existing visual maximum; long front/back content continues to scroll inside the card face.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, global CSS, Playwright

## Global Constraints

- Work directly on `main`; do not create a worktree or feature branch.
- Use `100dvh` for the visible mobile viewport with `100vh` as a CSS fallback.
- Preserve the existing 350px card maximum width, neon styling, flip animation, focus behavior, artwork, and copy.
- Keep Previous, Flip, and Next visible with their existing minimum 44px touch targets.
- Allow vertical scrolling inside each card face on short screens and at 200% text zoom.
- Do not introduce document-level vertical or horizontal scrolling at desktop 1280×720 or mobile 320×700.
- Add no dependencies.

---

## File Map

- `frontend/e2e/concept-deck.spec.ts` — browser acceptance coverage for viewport height, visible controls, and the keyboard hint.
- `frontend/src/app/page.tsx` — full-height page shell and flexible centered stage.
- `frontend/src/components/ConceptDeck.tsx` — flexible deck column with a non-shrinking header.
- `frontend/src/components/ConceptCard.tsx` — flexible card-and-controls column.
- `frontend/src/components/DeckControls.tsx` — non-shrinking control row with height-aware top spacing.
- `frontend/src/app/globals.css` — dynamic viewport sizing, scroll containment, clamped vertical spacing, and flexible card height.

### Task 1: Keep the deck navigation inside the viewport

**Files:**
- Modify: `frontend/e2e/concept-deck.spec.ts:134-145`
- Modify: `frontend/src/app/page.tsx:6-16`
- Modify: `frontend/src/components/ConceptDeck.tsx:26-27`
- Modify: `frontend/src/components/ConceptCard.tsx:32-48`
- Modify: `frontend/src/components/DeckControls.tsx:19-22`
- Modify: `frontend/src/app/globals.css:17-43,72-81,132-136`

**Interfaces:**
- Consumes: the existing `ConceptDeck`, `ConceptCard`, and `DeckControls` React component props without changing their signatures.
- Produces: CSS layout hooks `.app-shell`, `.app-stage`, `.concept-deck-header`, `.concept-card-layout`, `.deck-controls`, and `.deck-hint`; no new TypeScript API.

- [ ] **Step 1: Write the failing viewport acceptance test**

Add this test after the existing 320px horizontal-overflow test in `frontend/e2e/concept-deck.spec.ts`:

```ts
test("keeps the complete deck navigation inside the viewport", async ({
  page,
}) => {
  await page.goto("/");

  const dimensions = await page.evaluate(() => ({
    viewportHeight: document.documentElement.clientHeight,
    pageHeight: document.documentElement.scrollHeight,
  }));

  expect(dimensions.pageHeight).toBeLessThanOrEqual(
    dimensions.viewportHeight,
  );
  await expect(
    page.getByRole("button", { name: "Previous card" }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Show card back" }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Next card" }),
  ).toBeInViewport();
  await expect(
    page.getByText("Click the card or use Enter or Space to flip it."),
  ).toBeInViewport();
});
```

- [ ] **Step 2: Build the unchanged application and verify RED**

Run these commands separately:

```bash
pnpm --dir frontend build
```

```bash
pnpm --dir frontend exec playwright test e2e/concept-deck.spec.ts --grep "keeps the complete deck navigation"
```

Expected: FAIL in both Playwright projects because the fixed 680–700px card plus the header, controls, hint, padding, and gaps makes `pageHeight` exceed `viewportHeight`.

- [ ] **Step 3: Create the full-height page flex chain**

In `frontend/src/app/page.tsx`, replace the main and stage class names and mark the hint as non-shrinking:

```tsx
<main className="app-shell relative isolate overflow-hidden px-4 sm:px-6">
  <div className="stage-orb stage-orb-cyan" aria-hidden="true" />
  <div className="stage-orb stage-orb-violet" aria-hidden="true" />

  <div className="app-stage relative z-10 mx-auto flex min-h-0 w-full max-w-5xl flex-col items-center">
    <ConceptDeck cards={conceptCards} />

    <p className="deck-hint max-w-sm shrink-0 text-center text-xs leading-5 text-slate-400 sm:text-sm">
      Click the card or use Enter or Space to flip it.
    </p>
  </div>
</main>
```

- [ ] **Step 4: Make the deck, card, and controls participate in the flex chain**

In `frontend/src/components/ConceptDeck.tsx`, use:

```tsx
<section
  aria-label="Concept card deck"
  className="flex min-h-0 w-full max-w-[350px] flex-1 flex-col"
>
  <header className="concept-deck-header flex w-full shrink-0 items-end justify-between border-b border-white/10">
```

In `frontend/src/components/ConceptCard.tsx`, use these classes while leaving all event behavior unchanged:

```tsx
<div className="concept-card-layout flex min-h-0 w-full flex-1 flex-col">
  <div
    // Existing role, keyboard, ARIA, data, and event props remain unchanged.
    className="concept-card relative mx-auto flex min-h-0 w-full max-w-[350px] flex-1 flex-col cursor-pointer rounded-[29px] bg-[conic-gradient(from_210deg,_#67e8f9,_#8b5cf6,_#f6c453,_#22d3ee,_#67e8f9)] p-[2px] shadow-[0_0_55px_rgba(34,211,238,0.11)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050714]"
  >
```

In `frontend/src/components/DeckControls.tsx`, replace the navigation class with:

```tsx
className="deck-controls grid w-full shrink-0 grid-cols-3 gap-2 sm:gap-3"
```

- [ ] **Step 5: Replace fixed card height with dynamic viewport CSS**

In `frontend/src/app/globals.css`, update `body` and add the layout hooks before `.stage-orb`:

```css
body {
  margin: 0;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  /* Keep the existing background, color, font, and rendering declarations. */
}

.app-shell {
  height: 100vh;
  height: 100dvh;
  padding-top: clamp(0.75rem, 3vh, 2rem);
  padding-bottom: clamp(0.75rem, 3vh, 2rem);
}

.app-stage {
  height: 100%;
  gap: clamp(0.5rem, 1.5vh, 1.25rem);
}

.concept-deck-header {
  margin-bottom: clamp(0.75rem, 2.5vh, 1.5rem);
  padding-bottom: clamp(0.5rem, 1.5vh, 1rem);
}

.deck-controls {
  margin-top: clamp(0.75rem, 2vh, 1.25rem);
}
```

Replace the fixed `.concept-card-inner` height and preserve the previous tall-screen maximums on `.concept-card`:

```css
.concept-card {
  max-height: 700px;
  perspective: 1200px;
}

.concept-card-inner {
  position: relative;
  height: 100%;
  min-height: 0;
  transform-style: preserve-3d;
  transition: transform 600ms cubic-bezier(0.2, 0.75, 0.25, 1);
}

@media (min-width: 640px) {
  .concept-card {
    max-height: 680px;
  }
}
```

Keep `.card-face-front` and `.card-face-back` at `height: 100%` with `overflow-y: auto`; do not change the reduced-motion media query.

- [ ] **Step 6: Rebuild and verify GREEN for the viewport test**

Run these commands separately:

```bash
pnpm --dir frontend build
```

```bash
pnpm --dir frontend exec playwright test e2e/concept-deck.spec.ts --grep "keeps the complete deck navigation"
```

Expected: 2 passed. Both desktop 1280×720 and mobile 320×700 have no document-level vertical overflow, and all controls plus the hint are inside the viewport.

- [ ] **Step 7: Run static checks and unit coverage**

Run each command separately:

```bash
pnpm --dir frontend format:check
pnpm --dir frontend lint
pnpm --dir frontend typecheck
pnpm --dir frontend test:coverage
```

Expected: formatting, lint, and typecheck pass; all unit tests pass and the existing coverage thresholds remain satisfied.

- [ ] **Step 8: Run the complete browser regression suite**

Run:

```bash
pnpm --dir frontend test:e2e
```

Expected: the full desktop/mobile matrix passes, with only the two existing desktop skips for mobile-specific tests. Confirm specifically that keyboard focus, card navigation, unique images, 320px horizontal containment, 200% text-zoom internal scrolling, reduced motion, and the new viewport-height behavior pass.

- [ ] **Step 9: Inspect the diff and commit the implementation**

Run:

```bash
git diff --check
git status --short
```

Expected: no whitespace errors and only the six implementation/test files listed in this task are modified.

Commit:

```bash
git add frontend/e2e/concept-deck.spec.ts frontend/src/app/page.tsx frontend/src/app/globals.css frontend/src/components/ConceptDeck.tsx frontend/src/components/ConceptCard.tsx frontend/src/components/DeckControls.tsx
git commit -m "fix: fit concept deck within viewport"
```
