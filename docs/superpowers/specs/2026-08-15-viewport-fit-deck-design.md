# Viewport-Fit Concept Deck Design

**Date:** 2026-08-15
**Status:** Approved

## Goal

Keep the complete DevOps TCG interface within the visible browser height so users
can reach Previous, Flip, and Next without scrolling the page. Preserve readable
content by allowing the active card face to scroll internally when the available
height is limited.

## Scope

- Replace the fixed 680–700px card height with a viewport-aware flexible height.
- Keep the deck header, card controls, and keyboard hint visible within the
  viewport.
- Preserve the existing card width, visual treatment, flip animation, focus
  behavior, and content.
- Support both desktop and mobile layouts, including dynamic mobile browser
  chrome and high text zoom.

Changing card content, navigation order, artwork, or the horizontal layout is
outside this change.

## Layout Design

The page shell will occupy the visible viewport using `100dvh`, with `100vh` as
the fallback. It will prevent document-level overflow while retaining the
existing background treatment.

The layout will use a vertical flex chain with `min-height: 0` at each flexible
boundary:

1. The page shell fills the viewport.
2. The centered stage fills the available page-shell height.
3. The deck fills the available stage height below the keyboard hint.
4. The deck header and card controls remain fixed-size flex items.
5. The card consumes the remaining height.
6. Each card face retains vertical `overflow: auto`, so long content remains
   reachable without moving the navigation controls off-screen.

Spacing will become height-aware where necessary, using small responsive or
clamped gaps rather than scaling the interface. The card keeps its current
maximum width and is never transformed solely to make it fit.

## Interaction and Accessibility

- Previous, Flip, and Next remain visible and retain a minimum 44px touch target.
- Keyboard focus and navigation behavior remain unchanged.
- Card-face scrolling remains available for short viewports and 200% text zoom.
- The existing reduced-motion behavior remains unchanged.
- No horizontal or document-level vertical scrolling is introduced at the
  supported test sizes.

## Testing

Playwright acceptance coverage will assert that:

- the document does not vertically overflow at desktop 1280×720;
- the document does not vertically overflow at mobile 320×700;
- the Previous, Flip, and Next controls remain within the visible viewport;
- the existing 200% text-zoom card-face scrolling behavior still works; and
- existing navigation, focus, image, reduced-motion, and horizontal-overflow
  tests continue to pass.

Implementation will follow test-driven development: add the viewport-height
acceptance test, observe it fail against the fixed-height layout, then make the
smallest layout changes required to pass it.

## Success Criteria

At the supported desktop and mobile viewport sizes, users can move to the next
card without scrolling the document. When content exceeds the flexible card
height, it remains accessible by scrolling inside the active card face.
