# DevOps TCG Frontend

The frontend is a Next.js 14 App Router application exported entirely as static
files. Its nine-card collection is typed and stored locally; production performs
no API, authentication, persistence, or third-party image requests.

## Development

Use Node.js 20.x and pnpm 9:

```bash
corepack enable
pnpm install
pnpm dev
```

Open http://localhost:3000. No runtime environment variables or `.env` files
are required.

## Quality and Static Export

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

`pnpm build` writes the deployable site to `out/`. Build before running the
Playwright suite because it serves that directory on localhost.

## Content Model

`src/types/concept.ts` defines `ConceptCardData`. The hardcoded collection lives
in `src/data/conceptCards.ts`, separately from the presentation components.

To add a concept:

1. Add an optimized local image under `public/images/`.
2. Record third-party creator, source URL, and license details—or generated
   asset tool and creation date—in `public/images/ATTRIBUTION.md`.
3. Add one complete `ConceptCardData` object to `conceptCards` with a unique
   `id` and card number.
4. Extend the content-contract and browser acceptance tests.

`ConceptDeck` derives its navigation bounds from the collection length, so new
hardcoded cards do not require component changes.

## Accessibility Contracts

- Card click, Enter, Space, and Flip button all switch faces.
- Previous and Next use native disabled buttons at deck boundaries.
- The focused card exposes its current face in its accessible label.
- `prefers-reduced-motion: reduce` removes the 3D transition duration.
- The layout must not create horizontal page overflow at 320 pixels.
- An image error preserves the definition and shows readable fallback context.

## Asset Attribution

See [public/images/ATTRIBUTION.md](public/images/ATTRIBUTION.md). Production uses
only the committed local `*-thumbnail.webp` assets listed there.
