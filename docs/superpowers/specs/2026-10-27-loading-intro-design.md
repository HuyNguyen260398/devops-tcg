# Loading Intro — Design

Date: 2026-10-27
Status: approved in conversation; awaiting review of this write-up

## Intent

Opening or refreshing the page today has no entrance: the deck or the grid
simply appears in place. The owner wants the arrival to feel deliberate, the
way a polished app introduces itself — a short loading wheel, and then the
cards arrive with a gesture that suits a deck of cards.

## What the reader sees

1. **The wheel.** On every page load (first open or refresh) the content area
   under the header shows a loading wheel: three card backs fanning back and
   forth like a hand being riffled — option B from the mockups. A small
   "DEALING" label sits under it, styled like the deck's other small caps
   labels. It stays up for about **0.8 seconds**, or longer if the deck is
   genuinely not ready yet (a slow connection), never shorter.
2. **Then, in the carousel** (every phone, and a wide screen whose stored view
   is the deck): the deck shuffles **once**, using the existing Shuffle reel
   unchanged — eight to eleven cards slide past right to left and brake onto a
   card that lands front-up. Flips, navigation, swipes and the Shuffle button
   are refused while it runs, as they already are during a shuffle.
3. **Or, in the grid** (a wide screen in grid view, the wide default): the grid
   fades in over about **0.4 seconds**. No shuffle — the grid has none.

End to end, the carousel reader waits roughly 2.5–3 seconds before the first
card can be read (0.8s wheel + ~1.5–2s reel). That is accepted as the cost of
the effect.

## Goals

- A visible, deliberate entrance on every real page load, in both layouts.
- The wheel matches the theme: neon card backs on `:root`, an ink-outline
  sketch version on `[data-theme="sketch"]`, both from theme tokens.
- The carousel's entrance *is* the existing shuffle reel — no second animation
  system.

## Non-goals

- No intro on anything other than a page load: typing in search, changing a
  category chip, switching grid ↔ deck, toggling the theme, resizing across
  1024px, or clearing an empty search never show the wheel or run the reel.
  Switching from the grid to the deck after load shows the deck as it does
  today, without a reel.
- No change to the Shuffle button, the reel's timing constants, or the card
  dialog (which reuses `ConceptCard`, not `ConceptDeck`).
- No progress percentage, no skip button, no persistence ("seen it already")
  — every load gets the intro. Persistence would also contradict the project's
  no-new-storage stance.

## Anti-goals (would count as failure even if it "works")

- **Layout shift.** The card area, the narrow `DeckToolbar` and the header must
  not move between the wheel, the placeholder and the dealt deck. The wheel
  occupies the same box the deck will.
- **A flash before the wheel.** The wheel must be in the server-rendered HTML
  and animate with CSS alone, so it is on screen from first paint, before
  hydration — not a blank area that becomes a wheel once JS runs.
- **A neon wheel in the sketch theme**, or any colour that does not come from
  a theme token.
- **Motion forced on a reader who asked for less** (see below).
- **The reel replaying** on a filter change or view switch.

## Reduced motion

Under `prefers-reduced-motion: reduce`, the entrance's payload must not wait
on animation nobody sees (the same rule `ConceptDeck` already follows for the
Shuffle button):

- No 0.8s hold: the content appears as soon as it is ready.
- No reel: the deck appears already dealt, front-up.
- No grid fade.
- The wheel, if it is on screen at all before hydration, stands still (the fan
  animation is switched off in the reduced-motion block).

## Accessibility

- The wheel is a `role="status"` region with `aria-busy="true"` and the label
  **"Loading the deck"**. It replaces today's "Preparing the deck" status in
  `ConceptExplorer`. The deck's own `DeckPlaceholder` keeps "Shuffling cards"
  (a test asserts it in the server render).
- The fanned card backs are decorative (`aria-hidden`).
- Focus is not moved by the intro. When the reel stops, focus stays wherever
  the reader left it (normally the document body, since nothing has been
  focused yet).

## Constraints

- Hydration: server render stays deterministic. The wheel is what the server
  renders in the slot where today an empty "Preparing the deck" status sits;
  the shuffle still runs only after mount.
- `ConceptExplorer` already renders nothing viewport-dependent until its
  `matchMedia` measurement lands; the wheel covers that same beat and the
  0.8s hold, so it is the only thing shown until both have passed.
- The narrow layout's `DeckToolbar` keeps reserving its height while the wheel
  is up (rendered inert, as `DeckPlaceholder` does), or the card box would
  jump when the deck arrives. The wheel cannot know `isWide` on the server, so
  the builder must keep the server and first client render identical and
  avoid shifting once `isWide` lands — matching what happens today.
- The frontend ships only `next`, `react`, `react-dom`: the wheel is CSS and
  markup, no animation library. Colours come from theme tokens declared twice
  in `globals.css`, never from the palette or a hex literal in a component.
- Timing must be injectable for tests, the way `random` already is: unit tests
  should not sit through a real 0.8s hold or a real reel.
- The intro is opt-in on `ConceptDeck` (for example a prop the explorer passes
  only for the first deal after load), so `ConceptDeck`'s own tests and any
  other caller keep today's behaviour by default.

## Decided

| Decision | By |
| --- | --- |
| Wheel on every open and refresh | owner |
| Wheel style: fanning card backs (mockup B) | owner |
| Hold about 0.8s | owner |
| Carousel then shuffles once | owner |
| Grid fades in instead (no shuffle) | owner |
| Hold is a minimum: stays longer if not ready | my call, owner agreed |
| Reuse the existing Shuffle reel as-is | my call, owner agreed |
| Grid fade ≈0.4s | my call, owner agreed |
| Only real page loads trigger it | my call, owner agreed |
| Reduced motion: no hold, no reel, no fade, wheel still | my call, owner agreed |
| Status label "Loading the deck" | my call, owner agreed |
| Sketch-theme wheel in ink outlines | my call, owner agreed |
| 0.8s counted from the start of page load (`performance.now()`), not from hydration, so the visible wheel is close to 0.8s | my call |
| Wheel sits in the content area under the header; the header is shown as today | my call |
| Typing in the header search during the hold is allowed; the intro still runs on whatever the filter then shows, and is spent if the filter shows nothing | my call |

## Left to the builder

- Where the intro state lives (the explorer is the natural owner, since it
  outlives view switches and filter changes) and how the deck is told to run
  its first deal as a reel.
- Exact fan geometry, sizes and keyframes, within the mockup's look.
- How the e2e suite copes with a ~3s entrance: the existing specs must stay
  green on both Playwright projects without adding a production-only escape
  hatch. A shared helper that waits for the intro to finish (wheel gone and
  the track not `data-spinning`) is the obvious route.
- Unit tests for: wheel in the server render; hold respected; reel runs once on
  first deal in the carousel; no reel after a filter change or view switch;
  grid fade class/attribute present; reduced motion skips hold and reel.
- An e2e check that the page opens on the wheel and settles on a front-up card
  (mobile) or a full grid (desktop), and that the narrow toolbar does not move.
- Updating `CLAUDE.md`'s frontend notes and behavioural contracts with the
  intro, as the repo's conventions expect.
