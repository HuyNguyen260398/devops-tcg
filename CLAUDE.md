# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DevOps TCG is a read-only concept study deck (sixteen hardcoded cards) built
as a Next.js 14 static export and served from a private S3 bucket behind
CloudFront at https://tcg.nghuy.link. There is no backend, API, database, auth,
cookie, or browser persistence — and adding one is out of scope by design (see
`docs/architecture.md` → "Intentionally Absent").

## Commands

All frontend commands run from `frontend/` (or with `pnpm --dir frontend …`
from the repo root). Node 20 (`.nvmrc`) + pnpm 9 via `corepack enable`.

```bash
pnpm --dir frontend dev                     # http://localhost:3000
pnpm --dir frontend format:check            # prettier
pnpm --dir frontend lint                    # next lint
pnpm --dir frontend typecheck               # tsc --noEmit
pnpm --dir frontend test                    # vitest (jsdom)
pnpm --dir frontend test:coverage           # enforces 85/85/80/85 thresholds
pnpm --dir frontend build                   # static export -> frontend/out
pnpm --dir frontend exec playwright install chromium
pnpm --dir frontend test:e2e                # serves frontend/out on :4173
```

Single test runs:

```bash
pnpm --dir frontend exec vitest run src/lib/shuffle.test.ts
pnpm --dir frontend exec vitest run -t "flips with card click"
pnpm --dir frontend exec playwright test --project=mobile -g "flip"
```

`pnpm build` must run before `test:e2e` — Playwright serves `frontend/out/`,
not a dev server. The Playwright suite runs two projects: `chromium` (desktop)
and `mobile` (320×700).

Terraform (all offline checks; `-backend=false` init is required first for
roots that declare a remote backend):

```bash
terraform fmt -check -recursive infra
terraform -chdir=infra/bootstrap test
terraform -chdir=infra/modules/frontend test
terraform -chdir=infra/modules/domain test
terraform -chdir=infra/envs/prod validate
tflint --chdir=infra --recursive
uvx checkov -d infra --quiet
actionlint .github/workflows/quality.yml .github/workflows/deploy.yml
```

Terraform module tests use native `.tftest.hcl` files with mock providers, so
they need no AWS credentials. CI pins Terraform 1.15.5.

## Frontend architecture

Data flows one way: `src/data/conceptCards.ts` (a typed literal array
satisfying `ConceptCardData` from `src/types/concept.ts`) → `app/page.tsx` →
`ConceptDeck` → `ConceptCard` → `CardFront`/`CardBack`, with `DeckControls`
rendering the side arrows. Deck bounds, counter, and navigation all derive from
`cards.length`, so adding a card is a data change plus tests — never a component
redesign.

Non-obvious mechanisms worth knowing before editing `ConceptDeck.tsx`:

- **Hydration-safe shuffle.** The server render must be deterministic, so the
  Fisher-Yates shuffle (`src/lib/shuffle.ts`, randomness injectable via the
  `random` prop) runs in an effect after mount. Until `deckOrder` matches the
  current `cards`/`random` identity, the component renders `DeckPlaceholder` —
  a layout-stable skeleton. Tests inject a deterministic `random` (e.g.
  `() => 0.999999`, which leaves the source order intact) rather than stubbing
  `Math.random`.
- **Slot-based travel, not a re-rendered track.** Every card within
  the deck's spread of the active index stays mounted, keyed by `card.id`, and
  carries `data-slot` — its shortest signed distance from centre — plus the
  `--depth` (`|offset|`) and `--side` (`-1`/`0`/`1`) that place it. `globals.css`
  turns those two numbers into one formula for every rank — how far out it
  sits, how much it shrinks, which way it tilts, how far it has faded — and
  transitions between them, so changing the index makes the *same DOM node*
  travel from one slot to the next. How many ranks are mounted comes from the
  viewport: `RANK_BREAKPOINTS` in `ConceptDeck.tsx` (derived from the
  `--slot-*` geometry tokens, and re-measured on resize) says how many fit, so
  a phone still shows three cards while a wide screen fills with nine. One rank
  beyond those is mounted carrying `data-staged` and painted at zero opacity,
  so an arriving card is never mounted into view. Consequences worth
  remembering: nothing may key off a remount; only `offset === 0` renders a back face, takes focus, or gets
  `data-face`, so `.concept-card[data-face]` is the active-card selector; and
  because several cards are mounted at once, per-card element ids must come from
  `useId()` and test queries for card content must be scoped to one slot.
  `globals.css` also owns the 3D flip (`.concept-card-inner`, driven by
  `data-face`, with `data-flip` choosing between a `+180deg` and a `-180deg`
  rotation so the turn is a coin toss rather than the same animation every
  time — both settle to the same matrix and both are edge-on at half the flip,
  so the visibility swap is unaffected) and the `prefers-reduced-motion: reduce` block that zeroes both
  the flip and the slot transitions (through the `--travel`/`--flip` tokens).
- **Everything that decorates a face is a background layer on it.** The face
  is itself the scroll container, so an absolutely positioned overlay inside it
  travels with the content — that is what used to drag the glass sheen's
  rounded bottom edge into the middle of any card long enough to scroll. The
  sheen is therefore the first `background-image` layer, above the surface
  gradient and the conic foil rim; backgrounds stay fixed to the padding box.
  Do not reintroduce a decorative `::after`, and do not move the scrolling into
  a child: Chromium refuses to deliver a touch scroll to a scroller that sits
  inside a 3D rendering context behind a rounded clip — an `overflow: hidden`
  ancestor with a radius, one pixel of `border-radius` on the scroller itself,
  or even a rounded clip on a descendant such as the artwork block. The face
  being the scroller is what keeps a finger able to scroll a long card, and it
  fails only on Linux Chromium, so `pnpm test:e2e` on macOS will not catch it.
  The same fact is why each face's content block is `min-h-full` rather than a
  height-capped `h-full` flex column: a capped block lets long content spill
  past its own `padding-bottom`, parking the last line on the card's bottom
  edge instead of leaving room under it.
- **The shuffle is a reel, built from the slot travel itself.**
  `ShuffleControl` sits in the deck's flow under the carousel (the fixed arrow
  layer is for the arrows only). A click deals a new order, rotates it so the
  card already in hand keeps its index — otherwise the deck would cut to
  another card before the reel had moved a pixel — and then slides that order
  past, right to left, by advancing the active index one step at a time. Each
  step writes its own `--travel` and `--travel-ease` onto the track before the
  index changes, so the reel *is* the ordinary slot transition, repeated: eight
  to eleven steps run flat out and linear at `SPIN_FAST`, then the last
  `SPIN_BRAKE_STEPS` stretch towards `SPIN_SLOWEST` and the final one eases out
  onto the card it stops on. There is no second animation system and no timing
  token to keep in sync — `globals.css` only lifts the neighbouring slots'
  opacity under `data-spinning` so the reel reads as a stream of cards, and the
  track's inline properties are removed when it stops. A flip, a navigation, a
  swipe or a second shuffle is refused while the reel runs, and under
  `prefers-reduced-motion` the deck lands on the same card at once — so the
  animation's payload is never gated on an animation nobody sees.
- **Colour comes from theme tokens, never from the palette.** `globals.css`
  declares every theme-dependent value as a custom property twice — on `:root`
  for the `neon` default and on `[data-theme="sketch"]` for the light sketch
  theme — and `tailwind.config.ts` maps them to semantic names (`text-ink`,
  `bg-panel`, `border-rule`, `font-display`). A component must never reach for
  `text-cyan-200` or a hex literal, and because the tokens are opaque strings,
  Tailwind opacity modifiers (`text-ink/60`) do not work on them. `ThemeToggle`
  is the only component that knows a theme exists: it stamps `data-theme` on
  the document element and writes the `devops-tcg-theme` key, and an inline
  script in `layout.tsx` replays that key before first paint so a stored sketch
  choice never flashes neon. It also takes the first tab stop, ahead of the
  card. Adding a theme is a third token block, not a component change.
- **The faces are swapped by `visibility`, not by backface culling.** WebKit
  does not backface-cull a composited scrolling layer, and both faces scroll,
  so on iOS the turned-away face painted its mirrored text straight through the
  face in view. `backface-visibility: hidden` stays for the browsers that
  honour it, but correctness comes from `.card-face-*` being `visibility:
  hidden` by default and switched on by `data-face` with a `--flip-half` delay,
  so the swap lands exactly where both faces are edge-on. `--flip-half` must
  stay half of `--flip`, and a card leaving the centre resets its flip with no
  transition because its back face unmounts in the same render.

Behavioral contracts the tests enforce (don't regress them silently):
card click / Enter / Space all flip; arrow buttons are named `Previous card`
and `Next card` with `aria-hidden` SVG chevrons; the `Shuffle` button is
centred under the card, deals a new order, reels forwards eight to eleven cards
and stops front-up on the card it dealt; every pair of adjacent cards in the
spread stands the same gap apart at any width; keyboard focus is restored to the active card after
ArrowLeft/ArrowRight navigation but not after button clicks; the position counter is a polite live region; no horizontal document
overflow at 320px; images failing to load keep the definition readable.

## Infrastructure

`infra/bootstrap/` (state bucket + lock table) is applied once, by hand, and is
separate from `infra/envs/prod/`, which composes `modules/domain` (existing
`nghuy.link.` zone lookup + us-east-1 ACM cert) and `modules/frontend`
(private versioned S3, CloudFront + OAC, security headers, 404 behavior).
The parent hosted zone is external shared infrastructure — Terraform reads it
and manages only `tcg.nghuy.link` records. Buckets are versioned with no
`force_destroy`, so teardown is a documented manual sequence (`infra/README.md`).

Deploy (`.github/workflows/deploy.yml`, push to `main`, protected `production`
environment) runs the full frontend gate → OIDC apply → validates that
`site_url` matches the `SITE_DOMAIN` variable → rebuilds → `s3 sync --delete`
→ CloudFront invalidation → HTTPS smoke check. PRs run
`.github/workflows/quality.yml`; the Terraform plan job only fires when
`infra/**` changed. Auth is OIDC role assumption only — never add AWS keys.

## Working conventions

Changes here follow a spec → plan → implementation trail under
`docs/superpowers/`: an approved design in `specs/YYYY-MM-DD-<slug>-design.md`
and a task-by-task plan in `plans/YYYY-MM-DD-<slug>.md`. For a non-trivial
feature, read the latest of both before coding, and treat the plan's "Global
Constraints" as binding. Commits are conventional-commit style and small
(`feat:`, `fix:`, `test:`, `docs:`, `ci:`). Work and commit directly on `main` —
this repo does not use feature branches. Pushing `main` deploys to production,
so push only when asked.

Adding a concept card: commit an optimized local WebP under
`frontend/public/images/`, record its source/license in
`public/images/ATTRIBUTION.md`, append one `ConceptCardData` object with a
unique `id` and card number, then extend both the content-contract test
(`src/data/conceptCards.test.ts`) and the e2e image/title tables in
`e2e/concept-deck.spec.ts`. A card needs artwork for both themes: the WebP
photograph plus a hand-authored `*-sketch.svg` line drawing at the same
`/images/` path stem, each with its own `alt`, because `CardFront` mounts both
and CSS shows whichever the active `data-theme` calls for. Any new markup
styles itself from the theme tokens, so it works in both themes without a
second pass.

The frontend ships only `next`, `react`, and `react-dom` as dependencies —
icons are inline SVG, there is no state library, and no runtime asset is
fetched from a third-party host. Keep it that way unless a spec says otherwise.
