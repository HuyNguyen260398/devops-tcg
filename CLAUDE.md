# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DevOps TCG is a read-only concept study deck (nine hardcoded cards) built as a
Next.js 14 static export and served from a private S3 bucket behind CloudFront
at https://tcg.nghuy.link. There is no backend, API, database, auth, cookie, or
browser persistence — and adding one is out of scope by design (see
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

Two non-obvious mechanisms worth knowing before editing `ConceptDeck.tsx`:

- **Hydration-safe shuffle.** The server render must be deterministic, so the
  Fisher-Yates shuffle (`src/lib/shuffle.ts`, randomness injectable via the
  `random` prop) runs in an effect after mount. Until `deckOrder` matches the
  current `cards`/`random` identity, the component renders `DeckPlaceholder` —
  a layout-stable skeleton. Tests inject a deterministic `random` (e.g.
  `() => 0.999999`, which leaves the source order intact) rather than stubbing
  `Math.random`.
- **Slot-based travel, not a re-rendered track.** Every card within
  `SLOT_RADIUS` of the active index stays mounted, keyed by `card.id`, and
  carries `data-slot` — its shortest signed distance from centre (`-2…2`).
  `globals.css` gives each `data-slot` value a transform and transitions
  between them, so changing the index makes the *same DOM node* travel from one
  slot to the next. Slots `±2` are staged invisibly so an arriving card is never
  mounted into view. Consequences worth remembering: nothing may key off a
  remount; only `offset === 0` renders a back face, takes focus, or gets
  `data-face`, so `.concept-card[data-face]` is the active-card selector; and
  because several cards are mounted at once, per-card element ids must come from
  `useId()` and test queries for card content must be scoped to one slot.
  `globals.css` also owns the 3D flip (`.concept-card-inner`, driven by
  `data-face`) and the `prefers-reduced-motion: reduce` block that zeroes both
  the flip and the slot transitions (through the `--travel`/`--flip` tokens).
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
and `Next card` with `aria-hidden` SVG chevrons; keyboard focus is restored to
the active card after ArrowLeft/ArrowRight navigation but not after button
clicks; the position counter is a polite live region; no horizontal document
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
(`feat:`, `fix:`, `test:`, `docs:`, `ci:`).

Adding a concept card: commit an optimized local WebP under
`frontend/public/images/`, record its source/license in
`public/images/ATTRIBUTION.md`, append one `ConceptCardData` object with a
unique `id` and card number, then extend both the content-contract test
(`src/data/conceptCards.test.ts`) and the e2e image/title tables in
`e2e/concept-deck.spec.ts`.

The frontend ships only `next`, `react`, and `react-dom` as dependencies —
icons are inline SVG, there is no state library, and no runtime asset is
fetched from a third-party host. Keep it that way unless a spec says otherwise.
