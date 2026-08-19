# Light Sketch Theme Design

**Date:** 2026-08-19
**Status:** Approved for implementation

## Purpose

Give the DevOps TCG deck a second visual identity — a light, hand-drawn "marker
sketch" theme — and a control that lets a reader switch between it and the
existing neon theme. The new theme restyles the card surface, the text, and the
thumbnail artwork, and the chosen theme survives a page reload.

## Scope

The implementation will:

- Introduce a semantic colour-token layer so every card colour resolves through
  a CSS custom property rather than a hardcoded Tailwind palette utility.
- Add one new theme, `sketch`, alongside the existing default theme, `neon`.
- Restyle the card surface, all card text, and the card thumbnail under the
  sketch theme.
- Add a toggle button in the deck header that switches between the two themes.
- Persist the chosen theme in `localStorage` and apply it before first paint.
- Amend `docs/architecture.md` and `CLAUDE.md` to record the single, deliberate
  exception to the project's "no browser persistence" rule.

Out of scope:

- A third theme, a theme dropdown, or per-card theming.
- Following the operating system's `prefers-color-scheme` setting.
- Any runtime dependency beyond `next`, `react`, and `react-dom`; in particular
  no rough-drawing library and no icon library.
- New or re-processed image assets. The committed WebP thumbnails are unchanged
  and are restyled with CSS only.
- Fetching any asset from a third-party host at runtime, including web fonts.
- Changes to card content, deck order, shuffle behaviour, flip mechanics, slot
  travel, swipe gestures, or keyboard navigation.
- Server-side theme detection, cookies, or any other user state.

## Theme Roster

Two themes exist:

- **`neon`** — the current dark foil design. It remains the default for a
  first-time visitor and the fallback whenever a stored value is missing or
  unrecognised.
- **`sketch`** — the new light hand-drawn design, in the Excalidraw-style
  "marker sketch" idiom selected during design review.

The theme is expressed as a `data-theme` attribute on the root `html` element.
The absence of the attribute means `neon`, so the prerendered static export is
correct without it.

## Token Architecture

All theme-dependent colour lives in CSS custom properties declared twice in
`globals.css`: once on `:root` for `neon` and once on `[data-theme="sketch"]`.
The token set is semantic, named for the role a colour plays rather than for the
colour itself, and covers at minimum the page ground, the card surface, the card
rim, primary and muted ink, the primary and secondary accents, panel fills,
panel borders, keyword-pill fill and border, and the card shadow.

`tailwind.config.ts` extends the theme with colours mapped to those properties,
so the components author `text-ink-muted` or `border-rule` and never a palette
utility such as `text-cyan-200/70`. Card components consequently contain no
theme knowledge at all: a theme change is a change to token values, not to
markup.

Non-colour design decisions that differ per theme — the card's border radius,
its border width, its shadow shape, and the thumbnail filter — are likewise
expressed as custom properties on the same two selectors, so no component or
rule needs a `[data-theme]` selector of its own except where a whole visual
device exists in one theme only.

Two structural rules are binding, because both encode failures this codebase has
already paid for:

- The sheen, foil rim, and every other decoration stay background layers on the
  card face. No decorative `::after` overlay is reintroduced, and the face
  remains the scroll container.
- No `mix-blend-mode` is introduced anywhere inside the card. A blend mode
  establishes a stacking context within the `preserve-3d` subtree, which is
  precisely the class of compositing change that has previously broken card
  rendering on iOS Safari and touch scrolling on Linux Chromium.

## Sketch Theme Appearance

The sketch card is off-white paper with near-black ink. Its rim is a solid ink
border roughly 2.5 pixels wide with a hard offset shadow rather than a blurred
glow, and the conic foil gradient and cyan bloom of the neon theme are absent.
The hand-drawn quality comes from an asymmetric `border-radius` — different
horizontal and vertical radii per corner — applied to the card, its inner
panels, and its keyword pills. This is pure CSS; no drawing library is added.

Accents are a single marker blue for section headings and a highlighter yellow
for keyword-pill fills. The stage background behind the deck becomes flat paper;
the two decorative stage orbs keep their positions but take a faint graphite
wash so they do not read as glow on a light ground.

The deck header, the position counter, the navigation arrows, the focus ring,
the deck-slot veil that sets neighbouring cards back, and the shuffle
placeholder are all restyled through the same tokens. No element may keep a
neon-only colour that survives into the sketch theme.

## Typography

The sketch theme uses a self-hosted handwriting typeface licensed under the SIL
Open Font License — Architects Daughter. It is committed as a subsetted
`.woff2` under `frontend/public/fonts/`, declared with an `@font-face` rule carrying
`font-display: swap`, and recorded with its source and licence in a new
`frontend/public/fonts/ATTRIBUTION.md` that mirrors the existing image
attribution file. It is never fetched from a third-party host, and
`next/font/google` is not used, so a CI build needs no network access.

The face is applied to display text only: the site heading, card titles, section
headings, small tracked labels, and keyword pills. Body copy — the definition
paragraph, component names and descriptions, and the step descriptions — stays
in Inter, because the card's smallest text sizes are where a handwriting face
stops being legible. Because only sketch tokens reference the face, a reader who
never leaves the neon theme never downloads it.

## Thumbnail Treatment

Under the sketch theme the card artwork is restyled with a CSS `filter` only:
grayscale, inversion, and slightly raised contrast and brightness, so the
artwork reads as a pencil drawing on the paper ground. The inversion is what
makes it work: the committed thumbnails are dark neon renderings, and
desaturating one without inverting it produces a near-black block on the paper
rather than a drawing. The filter value is a token, so
the neon theme sets it to `none` and the same rule serves both themes. The
committed WebP files are not modified, no second copy of any image is added, and
the existing image-failure fallback — which must keep the definition readable —
is restyled through tokens like any other element.

## Theme State and Persistence

`src/lib/theme.ts` owns the theme contract: the theme union type, the
`localStorage` key, a guard that maps an arbitrary stored string to a valid
theme or to the `neon` default, and a helper that applies a theme to the
document element. It touches the DOM only through the helper, so the guard is
unit-testable without a DOM, in the same spirit as `src/lib/shuffle.ts`.

`src/components/ThemeToggle.tsx` is the only component that holds theme state.
On click it flips the theme, writes it to `localStorage`, and sets
`data-theme` on the document element. Because every visual consequence flows
from that attribute through the token layer, no context provider, prop drilling,
or state library is introduced, and no other component re-renders on a theme
change.

Two correctness hazards are handled explicitly:

- **Flash of the wrong theme.** The static export ships markup with no
  `data-theme`, so a stored `sketch` choice would otherwise appear only after
  React hydrates, showing a neon frame first. A small blocking inline script in
  the document head reads the key and stamps the attribute before first paint.
  The script must tolerate `localStorage` being unavailable or throwing — as in
  a privacy mode that blocks storage — and fall back to the default theme
  without breaking the page. The root element carries
  `suppressHydrationWarning` because that script mutates it.
- **Hydration mismatch in the button.** The button's label depends on the stored
  theme, which the server cannot know. The first client render therefore matches
  the server exactly, and the button synchronises to the actual theme in an
  effect after mount — the same pattern `ConceptDeck` already uses to keep the
  shuffle hydration-safe.

A write to `localStorage` that fails must not prevent the theme from changing
for the current session.

## Control Placement and Semantics

The control is a single toggle button, not a dropdown: with two themes a menu
adds a disclosure state, focus management, and a dismissal contract for no gain.

It renders inside `DeckHeader`, in normal document flow, centred beneath the
position counter. It is a compact pill roughly 28 pixels tall containing an
inline SVG icon marked `aria-hidden` and `focusable="false"` — matching the
existing arrow buttons — plus a short text label. The header's bottom padding
tightens to offset most of the vertical space the button occupies, because the
layout is a locked `100dvh` with no page scroll and card height is the scarce
resource at 320 by 700 pixels.

The button names the theme it will switch *to*, and carries an accessible name
that says so explicitly in both states. It is a native `button`, so keyboard
activation, focus order, and focus-visible styling follow the existing pattern.
Its touch target meets the same 44-pixel minimum the arrows do, and it must not
introduce document-level horizontal scrolling at 320 pixels.

## Edge and Failure Behaviour

- No stored theme, an unrecognised stored value, or unavailable storage all
  resolve to `neon`, and the page renders normally.
- The handwriting font failing to load leaves the sketch theme readable in the
  declared fallback stack; `font-display: swap` means text is never invisible.
- A theme change during a card flip or a slot transition must not restart,
  cancel, or visibly disturb either animation, because no token the transitions
  depend on changes identity.
- The `prefers-reduced-motion` block continues to zero the travel and flip
  tokens in both themes. The toggle introduces no animation of its own beyond a
  colour transition.
- Switching theme never changes the deck order, the active card, or the flipped
  state.

## Accessibility

Both themes meet WCAG AA contrast for body copy and for the small tracked labels
on card faces, and the sketch theme's focus ring is verified against the paper
ground rather than inherited from the neon design. The toggle's accessible name
describes the action in both states. The position counter remains a polite live
region, and the arrows keep the accessible names `Previous card` and
`Next card`. Nothing about the theme is communicated by colour alone: the
button's text label states the theme.

## Testing

Unit tests cover the stored-value guard for a valid value, an unrecognised
value, an absent value, and a storage access that throws; and cover the toggle
for switching the document attribute, writing storage, updating its label and
accessible name, and rendering identically on first paint regardless of stored
state. Existing card and deck tests are updated where they assert a colour class
that becomes a semantic token, and are not otherwise weakened.

End-to-end tests run in both the `chromium` and `mobile` projects and cover:
toggling switches `data-theme` and visibly restyles the card; the choice
survives a reload with no neon frame painted first; the sketch theme produces no
horizontal document overflow at 320 pixels; and card flip and swipe navigation
behave identically under the sketch theme.

Coverage stays above the existing 85/85/80/85 thresholds, and the full frontend
gate — format, lint, typecheck, unit, build, e2e — passes.

## Success Criteria

- A reader can switch between the neon and sketch themes from the deck header.
- The sketch theme restyles the card surface, all card text, and the thumbnail.
- The chosen theme survives a reload with no visible flash of the other theme.
- No component contains a hardcoded theme colour; every card colour resolves
  through a semantic token.
- The frontend's runtime dependencies remain `next`, `react`, and `react-dom`,
  and no asset is fetched from a third-party host.
- No new image asset is added and no committed WebP is modified.
- The documented "Intentionally Absent" list reflects the theme-key exception.
- The full quality gate passes and coverage thresholds hold.
