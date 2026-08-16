# Side Navigation and Shuffled Deck Design

**Date:** 2026-08-16
**Status:** Approved for implementation

## Purpose

Make the DevOps TCG deck easier to navigate on mobile by replacing the bottom
control row with side-mounted arrow buttons, simplifying the header, and showing
the cards in a fresh random order after every page reload.

## Scope

The implementation will:

- Move Previous and Next to the horizontal sides of the card.
- Replace their text with inline SVG chevron icons.
- Remove the explicit Flip button.
- Remove the `CONCEPT STUDY DECK` eyebrow while retaining `DevOps TCG` and the
  live position counter.
- Shuffle the complete card array once after each page load.
- Preserve card click, Enter, and Space as the ways to flip the active card.

Out of scope:

- Swipe gestures or ArrowLeft/ArrowRight keyboard navigation.
- Wrap-around navigation from the first card to the last or vice versa.
- Persisting the shuffled order across reloads or browser sessions.
- Guaranteeing that two consecutive reloads produce different orders.
- Adding an icon library, state-management dependency, API, or server-side
  session.
- Changing card artwork, learning copy, flip animation, or face layout.

## Navigation Layout

The selected layout is **centered edge overlay**.

Previous and Next remain native buttons inside a navigation landmark, but the
navigation is positioned around the card rather than below it. Each button is a
46-by-46-pixel circle centered vertically over the corresponding card edge:
Previous on the left and Next on the right. The controls may overlap a small
part of the decorative card edge so the card can retain its current width at a
320-pixel viewport.

The buttons use inline SVG chevrons rather than text or emoji. They retain the
project's neon cyan treatment, disabled appearance, active feedback, visible
keyboard focus ring, and accessible names `Previous card` and `Next card`.
Their minimum size exceeds the 44-by-44-pixel touch-target requirement.

The arrows must remain fully inside the browser viewport at 320 pixels wide and
must not introduce document-level horizontal or vertical scrolling. They sit
above the card visually and remain separate from the card's interactive button
semantics.

## Header and Flip Interaction

The `CONCEPT STUDY DECK` eyebrow is removed. The header continues to display the
`DevOps TCG` heading and a polite live counter such as `01 / 09`.

The explicit Flip button and its component props are removed. The card itself
continues to flip on click, Enter, and Space, and the existing instruction below
the deck remains accurate. Navigating to another card resets the active face to
the front.

## Shuffle Architecture

A small Fisher-Yates helper returns a new shuffled array without mutating the
source `conceptCards` data. The helper accepts an injectable random-number
function, defaulting to `Math.random`, so unit tests can verify exact output
without relying on probabilistic assertions.

`ConceptDeck` owns the shuffled card array and active index. To preserve static
rendering and avoid a server/client hydration mismatch, it does not calculate a
random order during the server render. Instead:

1. The server and first client render show the same layout-stable card
   placeholder.
2. A client-side effect shuffles the supplied cards once after hydration.
3. The deck renders position `01` from that shuffled order.
4. Previous and Next traverse the shuffled array with the existing bounded
   index behavior.

The placeholder uses the existing card dimensions and neon outline, exposes a
loading state with `aria-busy`, and avoids content movement while the shuffled
deck initializes. It does not announce a nonexistent active card or provide
navigation controls before the order is ready.

Every reload performs a new ordinary Fisher-Yates shuffle. Randomness may
legitimately produce the same first card or even the same order on consecutive
reloads; no local or session storage is used to prevent that outcome.

## Component Boundaries

- A focused shuffle utility owns the immutable Fisher-Yates implementation and
  injectable random source.
- `ConceptDeck` owns shuffle initialization, shuffled order, active index,
  header, counter, and empty-deck behavior.
- `ConceptCard` continues to own flip state and places the side navigation
  around the interactive card.
- `DeckControls` is reduced to Previous and Next icon buttons. Its flip-related
  props and center button are removed.
- CSS layout hooks position the arrow controls without weakening the existing
  `100dvh` and `min-height: 0` flex chain.

No global store, context, route state, browser storage, or new dependency is
introduced.

## Edge and Failure Behavior

- An empty card array renders the existing readable empty-deck message without
  a loading placeholder.
- A one-card deck completes initialization normally and disables both arrows.
- The first shuffled card disables Previous; the last disables Next.
- Navigation remains bounded and never indexes outside the shuffled array.
- The source card array remains unchanged after initialization.
- Missing-image fallback behavior continues to use the active shuffled card's
  title.
- Long front and back content continues to scroll inside the card faces at
  short viewport heights and 200% text zoom.
- Reduced-motion behavior remains unchanged.

## Accessibility

- Arrow-only buttons retain explicit accessible names and native disabled
  semantics.
- Both arrow controls remain at least 44 by 44 pixels and fully visible at the
  supported mobile viewport.
- Inline SVG icons are decorative with respect to the button name and are
  hidden from assistive technology.
- Focus remains visible and stays on the navigation button after changing
  cards.
- The card remains keyboard-flippable with Enter and Space.
- The counter remains an `aria-live="polite"` status for the shuffled position,
  not the original source-array position.
- The loading placeholder communicates busy state without announcing shuffled
  content before it exists.

## Testing

Implementation follows test-driven development.

Shuffle utility tests verify:

- Deterministic Fisher-Yates output with an injected random sequence.
- A new array is returned without mutating the source.
- Empty and one-card inputs are handled safely.

Component tests verify:

- The loading placeholder precedes shuffled content without a hydration-only
  branch mismatch.
- The eyebrow and explicit Flip button are absent.
- Card click, Enter, and Space still flip both directions.
- Previous and Next render as labelled icon buttons with bounded disabled
  states.
- Navigation follows a deterministic shuffled order, updates the live counter,
  keeps focus, and resets the card to its front face.
- Empty and one-card decks retain their defined behavior.

Browser tests stop assuming that Proxy is the first card. They verify:

- The deck initializes with nine unique cards in a shuffled sequence.
- Previous and Next traverse every card and retain correct boundary states.
- All nine local images load regardless of order.
- Arrow buttons and the usage hint are fully inside desktop and 320-pixel mobile
  viewports.
- The deck has no document-level horizontal or vertical overflow.
- Card click and keyboard flipping, 200% text zoom, internal face scrolling,
  image fallback, and reduced motion continue to work.

Final verification runs formatting, linting, type checking, unit coverage, a
production build, and the full Playwright desktop/mobile matrix.

## Success Criteria

- Reloading the page produces a fresh ordinary shuffle of all nine cards.
- Users can traverse that shuffled order with centered side-arrow controls.
- The card remains wide and readable at 320 pixels with no page overflow.
- No explicit Flip control or `CONCEPT STUDY DECK` eyebrow remains.
- Existing card flipping, accessibility, viewport-fit, and content behavior are
  preserved.
- The complete frontend quality suite passes without new dependencies.
