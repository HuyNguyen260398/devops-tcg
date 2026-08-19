# Light Sketch Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a light, hand-drawn "sketch" theme to the DevOps TCG deck, plus a
header toggle that switches between it and the existing neon theme and remembers
the choice across reloads.

**Architecture:** Every theme-dependent value becomes a CSS custom property
declared twice in `globals.css` — once on `:root` for neon, once on
`[data-theme="sketch"]` — and exposed to components as semantic Tailwind colours.
One component (`ThemeToggle`) owns the theme state; it stamps `data-theme` on the
document element and writes `localStorage`, and every visual consequence flows
from that attribute, so no other component knows a theme exists. A blocking
inline script in `<body>` applies the stored theme before first paint.

**Tech Stack:** Next.js 14 (App Router, static export), React 18, TypeScript,
Tailwind CSS 3, Vitest + Testing Library (jsdom), Playwright.

**Spec:** `docs/superpowers/specs/2026-08-19-sketch-theme-design.md`

## Global Constraints

- Runtime dependencies stay exactly `next`, `react`, `react-dom`. No rough-drawing
  library, no icon library, no state library, no `next-themes`.
- No asset is fetched from a third-party host at runtime. The handwriting font is
  committed and self-hosted; `next/font/google` is not used.
- No `mix-blend-mode` anywhere inside the card. It creates a stacking context in
  the `preserve-3d` subtree and has previously broken iOS rendering.
- No decorative `::after` overlay on a card face, and the face stays the scroll
  container. Decoration is a `background-image` layer on the face.
- Token colours are opaque CSS strings, so Tailwind opacity modifiers must never
  be applied to them: write `text-ink-faint`, never `text-ink/60`.
- No new image asset; no committed WebP is modified.
- Coverage thresholds hold: lines 85, functions 85, branches 80, statements 85.
- Node 20 (`.nvmrc`) + pnpm 9. All frontend commands run as
  `pnpm --dir frontend <script>` from the repo root.
- `pnpm --dir frontend build` must run before `test:e2e` — Playwright serves
  `frontend/out/`, not a dev server.
- Conventional commits, small and frequent. Work and commit directly on `main`.
  **Never push** — pushing `main` deploys to production.
- After every task, `pnpm --dir frontend format:check` must pass. Run
  `pnpm --dir frontend exec prettier --write <files>` if it does not.

## File Structure

| File | Responsibility |
| --- | --- |
| `frontend/src/lib/theme.ts` | **Create.** Theme union, storage key, storage read/write with failure tolerance, attribute application. No React. |
| `frontend/src/lib/theme.test.ts` | **Create.** Unit tests for the above. |
| `frontend/src/app/globals.css` | **Modify.** Token declarations for both themes; every literal colour replaced by a token. |
| `frontend/tailwind.config.ts` | **Modify.** Semantic colour and font-family mappings onto the tokens. |
| `frontend/src/components/CardFront.tsx` | **Modify.** Palette utilities → semantic tokens. |
| `frontend/src/components/CardBack.tsx` | **Modify.** Palette utilities → semantic tokens. |
| `frontend/src/components/DeckControls.tsx` | **Modify.** Arrow styling → semantic tokens. |
| `frontend/src/components/ConceptDeck.tsx` | **Modify.** `DeckHeader` only: tokens + mount the toggle. |
| `frontend/src/app/page.tsx` | **Modify.** Stage orbs → token-driven classes. |
| `frontend/src/components/ThemeToggle.tsx` | **Create.** The only stateful theme component. |
| `frontend/src/components/ThemeToggle.test.tsx` | **Create.** Unit tests for the toggle. |
| `frontend/src/app/layout.tsx` | **Modify.** Pre-paint theme script + `suppressHydrationWarning`. |
| `frontend/public/fonts/architects-daughter-latin.woff2` | **Create.** Self-hosted display face. |
| `frontend/public/fonts/ATTRIBUTION.md` | **Create.** Font source and licence. |
| `frontend/public/fonts/OFL.txt` | **Create.** The font's licence text. |
| `frontend/e2e/theme.spec.ts` | **Create.** End-to-end theme behaviour, both projects. |
| `docs/architecture.md` | **Modify.** Amend the "Intentionally Absent" list. |
| `CLAUDE.md` | **Modify.** Document the token layer. |

---

### Task 1: Theme contract module

**Files:**

- Create: `frontend/src/lib/theme.ts`
- Test: `frontend/src/lib/theme.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `type Theme = "neon" | "sketch"`; `DEFAULT_THEME: Theme`;
  `THEME_STORAGE_KEY: string`; `resolveTheme(value: unknown): Theme`;
  `readStoredTheme(): Theme`; `storeTheme(theme: Theme): void`;
  `applyTheme(root: HTMLElement, theme: Theme): void`.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/lib/theme.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  applyTheme,
  readStoredTheme,
  resolveTheme,
  storeTheme,
} from "./theme";

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("resolveTheme", () => {
  it("keeps a recognised theme", () => {
    expect(resolveTheme("sketch")).toBe("sketch");
    expect(resolveTheme("neon")).toBe("neon");
  });

  it("falls back to the default for anything else", () => {
    expect(resolveTheme("chartreuse")).toBe(DEFAULT_THEME);
    expect(resolveTheme(null)).toBe(DEFAULT_THEME);
    expect(resolveTheme(undefined)).toBe(DEFAULT_THEME);
    expect(resolveTheme(7)).toBe(DEFAULT_THEME);
  });
});

describe("readStoredTheme", () => {
  it("reads a stored theme", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "sketch");
    expect(readStoredTheme()).toBe("sketch");
  });

  it("defaults when nothing is stored", () => {
    expect(readStoredTheme()).toBe(DEFAULT_THEME);
  });

  // Privacy modes can block storage entirely; the deck must still render.
  it("defaults when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(readStoredTheme()).toBe(DEFAULT_THEME);
  });
});

describe("storeTheme", () => {
  it("writes the theme", () => {
    storeTheme("sketch");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("sketch");
  });

  it("swallows a storage failure", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(() => storeTheme("sketch")).not.toThrow();
  });
});

describe("applyTheme", () => {
  it("stamps the theme on the element", () => {
    const root = document.createElement("html");
    applyTheme(root, "sketch");
    expect(root.getAttribute("data-theme")).toBe("sketch");
    applyTheme(root, "neon");
    expect(root.getAttribute("data-theme")).toBe("neon");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/lib/theme.test.ts`
Expected: FAIL — cannot resolve `./theme`.

- [ ] **Step 3: Write the implementation**

Create `frontend/src/lib/theme.ts`:

```ts
export type Theme = "neon" | "sketch";

export const THEMES: readonly Theme[] = ["neon", "sketch"];

export const DEFAULT_THEME: Theme = "neon";

export const THEME_STORAGE_KEY = "devops-tcg-theme";

export const resolveTheme = (value: unknown): Theme =>
  typeof value === "string" && (THEMES as readonly string[]).includes(value)
    ? (value as Theme)
    : DEFAULT_THEME;

// Reading storage is not merely absent under SSR — a privacy mode can make the
// property access itself throw, so the whole read is guarded.
export const readStoredTheme = (): Theme => {
  try {
    return resolveTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
};

// A blocked write must not stop the theme changing for this session.
export const storeTheme = (theme: Theme): void => {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    return;
  }
};

export const applyTheme = (root: HTMLElement, theme: Theme): void => {
  root.setAttribute("data-theme", theme);
};
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/lib/theme.test.ts`
Expected: PASS, 8 tests.

- [ ] **Step 5: Typecheck, lint, format**

Run: `pnpm --dir frontend typecheck && pnpm --dir frontend lint && pnpm --dir frontend format:check`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/lib/theme.ts frontend/src/lib/theme.test.ts
git commit -m "feat: add the theme contract module"
```

---

### Task 2: Token layer, neon values only

Introduce every token and rewire `globals.css` to use them. **The rendered page
must look identical afterwards** — this task changes plumbing, not pixels.

**Files:**

- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/tailwind.config.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: the token names below, and the Tailwind colour keys `paper`,
  `ink`, `ink-muted`, `ink-faint`, `accent`, `accent-soft`, `accent-ink`,
  `mark`, `mark-soft`, `mark-border`, `mark-ink`, `panel`, `rule`, `chip`,
  `chip-border`, `chip-ink`, `type-chip`, `type-chip-border`, `type-chip-ink`,
  `control`, `control-border`, `control-ink`, plus the font family key
  `display`.

- [ ] **Step 1: Replace the `:root` block in `globals.css`**

Replace the existing `:root { … }` block (currently the `color-scheme`/`--stage`/
`--surface`/`--cyan`/`--violet` block plus the timing tokens) with:

```css
:root {
  color-scheme: dark;

  /* Motion. One source for every deck timing. The flip's half point is where
     the two faces swap, so it must stay exactly half of the flip. */
  --travel: 320ms;
  --flip: 440ms;
  --flip-half: 220ms;
  --travel-ease: cubic-bezier(0.22, 0.61, 0.24, 1);

  /* Ground */
  --paper: #050714;
  --stage-image: radial-gradient(
      circle at 50% -10%,
      rgb(34 211 238 / 0.08),
      transparent 34rem
    ),
    linear-gradient(180deg, #071023 0%, #050714 54%, #03040c 100%);
  --orb-a: radial-gradient(circle at 50% 50%, #22d3ee, transparent 62%);
  --orb-b: radial-gradient(circle at 50% 50%, #8b5cf6, transparent 62%);
  --orb-opacity: 0.12;

  /* Ink */
  --ink: #f8fafc;
  /* The components currently use three body shades — slate-100, slate-200, and
     slate-300. They collapse into this one token, which is the deliberate
     middle of the three and the only visible difference this task makes. */
  --ink-muted: #e2e8f0;
  --ink-faint: rgb(165 243 252 / 0.7);

  /* Accents */
  --accent: #a5f3fc;
  --accent-soft: rgb(34 211 238 / 0.12);
  --accent-ink: #cffafe;
  --mark: #ddd6fe;
  --mark-soft: rgb(167 139 250 / 0.1);
  --mark-border: rgb(196 181 253 / 0.2);
  --mark-ink: #ede9fe;

  /* Panels and rules */
  --panel: rgb(255 255 255 / 0.07);
  --rule: rgb(255 255 255 / 0.1);

  /* Badges */
  --chip: rgb(2 6 23 / 0.85);
  --chip-border: rgb(255 255 255 / 0.2);
  --chip-ink: #ffffff;
  --type-chip: rgb(8 51 68 / 0.85);
  --type-chip-border: rgb(165 243 252 / 0.3);
  --type-chip-ink: #cffafe;

  /* Controls */
  --control: #071226;
  --control-border: rgb(165 243 252 / 0.35);
  --control-ink: #ecfeff;
  --control-hover-border: rgb(165 243 252 / 0.7);
  --control-hover: rgb(103 232 249 / 0.15);
  --focus-ring: 0 0 0 2px rgb(103 232 249), 0 0 55px rgb(34 211 238 / 0.28);

  /* Card shell */
  --card-radius: 28px;
  --card-radius-outer: 29px;
  --card-radius-inner: 16px;
  --card-border-width: 2px;
  --card-border-color: transparent;
  --card-shadow:
    inset 0 1px 0 rgb(255 255 255 / 0.12),
    inset 0 -1px 0 rgb(103 232 249 / 0.08), 0 28px 70px rgb(0 0 0 / 0.52),
    0 0 55px rgb(34 211 238 / 0.11);
  --card-shadow-flat: 0 18px 40px rgb(0 0 0 / 0.45);
  /* Three layers: the glass sheen, the card surface, then the foil rim that
     fills the transparent border. Backgrounds do not scroll, which is why the
     sheen lives here and not in an overlay element. */
  --card-face-image:
    linear-gradient(
      125deg,
      rgb(255 255 255 / 0.14),
      transparent 22%,
      transparent 72%,
      rgb(167 139 250 / 0.1)
    ),
    linear-gradient(145deg, rgb(15 35 65 / 0.98), rgb(5 11 28 / 0.99)),
    conic-gradient(from 210deg, #67e8f9, #8b5cf6, #f6c453, #22d3ee, #67e8f9);
  --card-surface: #0a1730;
  --veil-image: linear-gradient(180deg, rgb(4 8 20 / 0.12), rgb(5 10 24 / 0.88)),
    linear-gradient(120deg, rgb(34 211 238 / 0.16), transparent 45%);

  /* Artwork */
  --thumb-backdrop: #0f172a;
  --thumb-filter: none;
  --thumb-veil: linear-gradient(
    to top,
    #08142b,
    transparent 50%,
    rgb(2 6 23 / 0.35)
  );
  --thumb-fallback: radial-gradient(
    circle at center,
    rgb(34 211 238 / 0.18),
    transparent 65%
  );

  /* Typography */
  --font-body:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  --font-display: var(--font-body);
}
```

- [ ] **Step 2: Rewire the existing rules to the tokens**

Apply these replacements in `globals.css`. Every one is a like-for-like swap of a
literal for the token holding the same value.

```css
html {
  min-width: 320px;
  background: var(--paper);
}

body {
  margin: 0;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  background-color: var(--paper);
  background-image: var(--stage-image);
  color: var(--ink);
  font-family: var(--font-body);
}

.stage-orb {
  position: absolute;
  width: 30rem;
  height: 30rem;
  opacity: var(--orb-opacity);
  pointer-events: none;
}

.stage-orb-cyan {
  top: 1rem;
  left: max(-16rem, calc(50% - 38rem));
  background: var(--orb-a);
}

.stage-orb-violet {
  right: max(-17rem, calc(50% - 39rem));
  bottom: -1rem;
  background: var(--orb-b);
}

.concept-card:focus-visible {
  box-shadow: var(--focus-ring);
}

.deck-slot:not([data-slot="0"]) .card-face-front {
  box-shadow: var(--card-shadow-flat);
}

.deck-slot-veil {
  position: absolute;
  z-index: 20;
  inset: 0;
  border-radius: var(--card-radius-outer);
  background-image: var(--veil-image);
  pointer-events: none;
}

.concept-card-placeholder {
  width: min(calc(100vw - 7rem), 350px);
  max-width: 350px;
  margin-inline: auto;
  background: var(--card-face-image);
  box-shadow: 0 0 55px rgb(34 211 238 / 0.11);
}

.concept-card-placeholder-surface {
  border: 1px solid var(--rule);
  background-color: var(--card-surface);
  background-image: var(--card-face-image);
  box-shadow: var(--card-shadow);
}
```

And in the shared `.card-face-front, .card-face-back` rule, replace the border,
radius, background, and shadow declarations (leave the scrolling, scrollbar,
`background-origin`, `background-clip`, `backface-visibility`, and `visibility`
declarations and all their comments exactly as they are):

```css
  border: var(--card-border-width) solid var(--card-border-color);
  border-radius: var(--card-radius);
  background-color: var(--card-surface);
  background-image: var(--card-face-image);
  box-shadow: var(--card-shadow);
```

- [ ] **Step 3: Add the thumbnail helper classes**

Append to `globals.css`, before the `@media (min-width: 640px)` block:

```css
/* The artwork is restyled per theme with a filter, so the committed WebP files
   serve both themes unmodified. No blend mode: it would create a stacking
   context inside the card's preserve-3d subtree. */
.card-thumbnail {
  filter: var(--thumb-filter);
}

.card-thumbnail-veil {
  background-image: var(--thumb-veil);
}

.card-thumbnail-fallback {
  background-image: var(--thumb-fallback);
}
```

- [ ] **Step 4: Map the tokens into Tailwind**

Replace `frontend/tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

// Every colour here resolves to a CSS custom property declared in globals.css,
// so a theme change is a change to token values rather than to markup. The
// values are opaque strings, so Tailwind opacity modifiers (text-ink/60) must
// not be used on them.
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        "ink-faint": "var(--ink-faint)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-ink": "var(--accent-ink)",
        mark: "var(--mark)",
        "mark-soft": "var(--mark-soft)",
        "mark-border": "var(--mark-border)",
        "mark-ink": "var(--mark-ink)",
        panel: "var(--panel)",
        rule: "var(--rule)",
        chip: "var(--chip)",
        "chip-border": "var(--chip-border)",
        "chip-ink": "var(--chip-ink)",
        "type-chip": "var(--type-chip)",
        "type-chip-border": "var(--type-chip-border)",
        "type-chip-ink": "var(--type-chip-ink)",
        control: "var(--control)",
        "control-border": "var(--control-border)",
        "control-ink": "var(--control-ink)",
        "thumb-backdrop": "var(--thumb-backdrop)",
      },
      fontFamily: {
        display: "var(--font-display)",
      },
      borderRadius: {
        card: "var(--card-radius)",
        "card-outer": "var(--card-radius-outer)",
        "card-inner": "var(--card-radius-inner)",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 5: Verify nothing rendered changed**

Run: `pnpm --dir frontend test && pnpm --dir frontend typecheck && pnpm --dir frontend lint && pnpm --dir frontend format:check`
Expected: all pass, no test changes needed.

Then run `pnpm --dir frontend dev`, open `http://localhost:3000`, and confirm by
eye that the deck is unchanged: foil rim, cyan glow, dark stage, orbs, neighbour
veil, focus ring on Tab. Stop the dev server.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app/globals.css frontend/tailwind.config.ts
git commit -m "refactor: express every card colour as a theme token"
```

---

### Task 3: Components consume the semantic tokens

Remove every hardcoded palette utility from the components. The only intended
visual change is the body-copy consolidation noted in Task 2: `text-slate-100`,
`text-slate-200`, and `text-slate-300` all become `text-ink-muted`. Nothing else
may shift.

**Files:**

- Modify: `frontend/src/components/CardFront.tsx`
- Modify: `frontend/src/components/CardBack.tsx`
- Modify: `frontend/src/components/DeckControls.tsx`
- Modify: `frontend/src/components/ConceptDeck.tsx:76-94`
- Test: `frontend/src/components/ConceptDeck.test.tsx` (unchanged; it must keep
  passing)

**Interfaces:**

- Consumes: the Tailwind colour keys produced by Task 2.
- Produces: `.card-thumbnail` on the artwork `<img>`, and card markup free of
  palette utilities.

- [ ] **Step 1: Rewrite the `CardFront` class strings**

In `frontend/src/components/CardFront.tsx`, apply exactly these `className`
replacements. Nothing else in the file changes.

Header row:

```tsx
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 text-[0.65rem] font-bold tracking-[0.18em] text-chip-ink">
        <span className="rounded-full border border-chip-border bg-chip px-3 py-1.5 shadow-lg">
          {card.cardNumber}
        </span>
        <span className="rounded-full border border-type-chip-border bg-type-chip px-3 py-1.5 text-type-chip-ink shadow-lg">
          {card.type}
        </span>
      </header>
```

Artwork block — note `bg-thumb-backdrop` on the wrapper, `card-thumbnail-fallback`
on the fallback, `card-thumbnail` on the image, and `card-thumbnail-veil` on the
overlay:

```tsx
      <div className="relative h-[220px] shrink-0 overflow-hidden bg-thumb-backdrop sm:h-[230px]">
        {imageFailed ? (
          <div
            role="img"
            aria-label={card.image.alt}
            className="card-thumbnail-fallback flex h-full items-center justify-center px-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-accent-ink"
          >
            {card.title} {card.type.toLowerCase()} concept
          </div>
        ) : (
          // The static export must preserve this exact local path; next/image
          // rewrites it to an absolute URL even when optimization is disabled.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.image.src}
            alt={card.image.alt}
            loading="eager"
            decoding="async"
            className="card-thumbnail h-full w-full object-cover object-center"
            onError={() => setImageFailed(true)}
          />
        )}
        <div className="card-thumbnail-veil absolute inset-0" aria-hidden="true" />
      </div>
```

Title block:

```tsx
        <div className="mb-4 flex items-end justify-between border-b border-rule pb-4">
          <div>
            <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.24em] text-ink-faint">
              {card.series}
            </p>
            <h2 className="font-display text-4xl font-black tracking-[-0.04em] text-ink">
              {card.title}
            </h2>
          </div>
          <p className="pb-1 text-[0.6rem] font-bold tracking-[0.18em] text-mark">
            {card.descriptor}
          </p>
        </div>
```

Definition section:

```tsx
        <section
          aria-labelledby={definitionHeadingId}
          className="mb-4 rounded-card-inner border border-rule bg-panel p-4 shadow-inner"
        >
          <h3
            id={definitionHeadingId}
            className="font-display mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-accent"
          >
            Basic definition
          </h3>
          <p className="text-sm leading-6 text-ink-muted">{card.definition}</p>
        </section>
```

Keywords section:

```tsx
        <section aria-labelledby={keywordsHeadingId}>
          <h3
            id={keywordsHeadingId}
            className="font-display mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-mark"
          >
            Key words
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {card.keywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-full border border-mark-border bg-mark-soft px-2.5 py-1 text-[0.68rem] font-medium text-mark-ink"
              >
                {keyword}
              </li>
            ))}
          </ul>
        </section>
```

- [ ] **Step 2: Rewrite the `CardBack` class strings**

In `frontend/src/components/CardBack.tsx`:

```tsx
      <header className="mb-5 flex items-start justify-between border-b border-rule pb-4">
        <div>
          <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.24em] text-ink-faint">
            {card.series}
          </p>
          <h2 className="font-display text-3xl font-black tracking-[-0.03em] text-ink">
            {card.title}
          </h2>
        </div>
        <p className="rounded-full border border-mark-border bg-mark-soft px-2.5 py-1.5 text-[0.55rem] font-bold tracking-[0.16em] text-mark-ink">
          ANATOMY / FLOW
        </p>
      </header>
```

Components section — heading, panel, term, and description:

```tsx
        <h2
          id="components-heading"
          className="font-display mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent"
        >
          Components
        </h2>
        <dl className="space-y-2">
          {card.components.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-rule bg-panel px-3.5 py-2.5"
            >
              <dt className="text-xs font-bold text-ink">{item.name}</dt>
              <dd className="mt-1 text-[0.72rem] leading-4 text-ink-muted">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
```

Flow section — heading, step badge, and step text:

```tsx
        <h2
          id="flow-heading"
          className="font-display mb-3 text-xs font-bold uppercase tracking-[0.22em] text-mark"
        >
          How it works
        </h2>
```

```tsx
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-mark-border bg-mark-soft font-mono text-xs font-bold text-mark-ink"
              >
                {item.step}
              </span>
              <span className="pt-0.5 text-[0.72rem] leading-[1.15rem] text-ink-muted">
                {item.description}
              </span>
```

- [ ] **Step 3: Rewrite the arrow button styling**

In `frontend/src/components/DeckControls.tsx`, replace the `buttonClassName`
constant with:

```tsx
  const buttonClassName =
    "deck-arrow pointer-events-auto absolute flex h-[46px] w-[46px] items-center justify-center rounded-full border border-control-border bg-control text-control-ink shadow-lg transition-[border-color,background-color,transform,opacity] duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-control-border disabled:hover:bg-control";
```

- [ ] **Step 4: Rewrite the deck header styling**

In `frontend/src/components/ConceptDeck.tsx`, inside `DeckHeader`, replace the
three class strings (leave the ARIA attributes and the `formatPosition` logic
exactly as they are):

```tsx
    <header className="concept-deck-header mx-auto flex w-full max-w-[350px] shrink-0 flex-col items-center border-b border-rule text-center">
      <h1 className="font-display text-2xl font-black uppercase tracking-[0.12em] text-ink sm:text-3xl">
        DevOps TCG
      </h1>
```

```tsx
        className="mt-1 font-mono text-xs font-semibold tracking-[0.18em] text-ink-muted"
```

- [ ] **Step 5: Replace the stage orb markup**

`frontend/src/app/page.tsx` needs no change — the orbs already use the
`.stage-orb-*` classes that Task 2 rewired. Confirm with:

Run: `grep -n "stage-orb" frontend/src/app/page.tsx`
Expected: the two existing `stage-orb stage-orb-cyan` / `stage-orb-violet`
divs, unchanged.

- [ ] **Step 6: Verify no palette utility survives**

Run:

```bash
grep -rnE "text-(cyan|violet|slate|white)|bg-(cyan|violet|slate|white)|border-(cyan|violet|slate|white)|#0[0-9a-f]{5}" frontend/src/components frontend/src/app/page.tsx
```

Expected: no matches. If any remain, map them to a token before continuing.

- [ ] **Step 7: Run the full unit suite and the visual check**

Run: `pnpm --dir frontend test && pnpm --dir frontend typecheck && pnpm --dir frontend lint && pnpm --dir frontend format:check`
Expected: all pass with no test edits.

Then `pnpm --dir frontend dev` and confirm the deck looks as it did apart from
the single body-copy shade — card front, card back after a flip, arrows, hover
and focus states. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components frontend/src/app
git commit -m "refactor: style the cards from semantic theme tokens"
```

---

### Task 4: Self-host the sketch display face

**Files:**

- Create: `frontend/public/fonts/architects-daughter-latin.woff2`
- Create: `frontend/public/fonts/OFL.txt`
- Create: `frontend/public/fonts/ATTRIBUTION.md`
- Modify: `frontend/src/app/globals.css`

**Interfaces:**

- Consumes: nothing.
- Produces: the CSS font family name `"Architects Daughter"`.

- [ ] **Step 1: Download the font and its licence**

The Google Fonts CSS endpoint returns a `woff2` URL only when asked with a
modern browser user agent:

```bash
mkdir -p frontend/public/fonts
curl -sS -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" \
  "https://fonts.googleapis.com/css2?family=Architects+Daughter&display=swap"
```

Copy the `src: url(...)` value for the `latin` subset from that output and fetch
it:

```bash
curl -sS -o frontend/public/fonts/architects-daughter-latin.woff2 "<the latin woff2 URL>"
curl -sS -o frontend/public/fonts/OFL.txt \
  "https://raw.githubusercontent.com/google/fonts/main/ofl/architectsdaughter/OFL.txt"
```

- [ ] **Step 2: Verify the download**

Run:

```bash
file frontend/public/fonts/architects-daughter-latin.woff2
ls -la frontend/public/fonts
head -3 frontend/public/fonts/OFL.txt
```

Expected: the font reports as `Web Open Font Format (Version 2)`, is roughly
10–30 KB, and `OFL.txt` starts with the SIL copyright line. If the download
produced an HTML error page instead, stop and report it rather than committing a
broken asset.

- [ ] **Step 3: Record the attribution**

Create `frontend/public/fonts/ATTRIBUTION.md`:

```markdown
# Font Attribution

| File | Family | Source | Licence |
| --- | --- | --- | --- |
| `architects-daughter-latin.woff2` | Architects Daughter (latin subset) | Google Fonts — https://fonts.google.com/specimen/Architects+Daughter | SIL Open Font License 1.1 — see `OFL.txt` |

The file is committed and served from this origin. Nothing here is fetched from
a third-party host at runtime, and the font is referenced only by the sketch
theme's tokens, so a reader who stays on the neon theme never downloads it.
```

- [ ] **Step 4: Declare the face**

Add to the top of `frontend/src/app/globals.css`, immediately after the three
`@tailwind` directives:

```css
/* Self-hosted so no runtime request leaves this origin. `swap` keeps card text
   visible while the face loads; only the sketch theme's --font-display
   references it, so the neon theme never triggers the download. */
@font-face {
  font-family: "Architects Daughter";
  src: url("/fonts/architects-daughter-latin.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 5: Verify the build still passes**

Run: `pnpm --dir frontend build && ls frontend/out/fonts`
Expected: build succeeds and the woff2 is present in the export.

- [ ] **Step 6: Commit**

```bash
git add frontend/public/fonts frontend/src/app/globals.css
git commit -m "feat: self-host the Architects Daughter display face"
```

---

### Task 5: Sketch theme token values

Give `[data-theme="sketch"]` its values. Still no control — verify by setting the
attribute by hand in devtools.

**Files:**

- Modify: `frontend/src/app/globals.css`

**Interfaces:**

- Consumes: the token names from Task 2, the font family from Task 4.
- Produces: the `[data-theme="sketch"]` selector as the single source of the
  sketch look.

- [ ] **Step 1: Add the sketch token block**

Append immediately after the `:root` block in `globals.css`:

```css
/* The sketch theme redefines token values and nothing else — no component and
   no layout rule knows it exists. Hand-drawn edges come from asymmetric
   border-radii, so no drawing library is needed. */
[data-theme="sketch"] {
  color-scheme: light;

  --paper: #ece7db;
  --stage-image: radial-gradient(
      circle at 50% -10%,
      rgb(255 255 255 / 0.55),
      transparent 30rem
    ),
    linear-gradient(180deg, #f1ece1 0%, #ece7db 55%, #e3ddcf 100%);
  --orb-a: radial-gradient(circle at 50% 50%, #9a9484, transparent 62%);
  --orb-b: radial-gradient(circle at 50% 50%, #b0a893, transparent 62%);
  --orb-opacity: 0.22;

  --ink: #1d1d1b;
  --ink-muted: #3d3d39;
  --ink-faint: #6b6b63;

  --accent: #1d4ed8;
  --accent-soft: rgb(29 78 216 / 0.08);
  --accent-ink: #1d4ed8;
  --mark: #92400e;
  --mark-soft: #fff2c4;
  --mark-border: #1d1d1b;
  --mark-ink: #1d1d1b;

  --panel: #fffdf6;
  --rule: rgb(29 29 27 / 0.3);

  --chip: #fffdf6;
  --chip-border: #1d1d1b;
  --chip-ink: #1d1d1b;
  --type-chip: #fff2c4;
  --type-chip-border: #1d1d1b;
  --type-chip-ink: #1d1d1b;

  --control: #fbfaf6;
  --control-border: #1d1d1b;
  --control-ink: #1d1d1b;
  --control-hover-border: #1d1d1b;
  --control-hover: #fff2c4;
  --focus-ring: 0 0 0 3px #1d4ed8;

  /* Asymmetric radii are what read as hand-drawn. */
  --card-radius: 18px 14px 19px 13px / 14px 19px 13px 18px;
  --card-radius-outer: 19px 15px 20px 14px / 15px 20px 14px 19px;
  --card-radius-inner: 12px 9px 13px 10px / 9px 13px 10px 12px;
  --card-border-width: 2.5px;
  --card-border-color: transparent;
  --card-shadow: 3px 4px 0 rgb(29 29 27 / 0.85);
  --card-shadow-flat: 2px 3px 0 rgb(29 29 27 / 0.55);
  /* Same three-layer mechanism as neon: sheen, surface, then the rim that fills
     the transparent border — only the paint differs. */
  --card-face-image: linear-gradient(
      125deg,
      rgb(255 255 255 / 0.5),
      transparent 26%,
      transparent 74%,
      rgb(29 29 27 / 0.04)
    ),
    linear-gradient(180deg, #fbfaf6, #f6f3ea),
    linear-gradient(180deg, #1d1d1b, #1d1d1b);
  --card-surface: #fbfaf6;
  --veil-image: linear-gradient(
      180deg,
      rgb(236 231 219 / 0.35),
      rgb(236 231 219 / 0.72)
    ),
    linear-gradient(120deg, rgb(255 255 255 / 0.4), transparent 45%);

  --thumb-backdrop: #f6f3ea;
  --thumb-filter: grayscale(1) contrast(1.45) brightness(1.12);
  --thumb-veil: linear-gradient(
    to top,
    rgb(251 250 246 / 0.9),
    transparent 45%,
    rgb(251 250 246 / 0.25)
  );
  --thumb-fallback: radial-gradient(
    circle at center,
    rgb(29 78 216 / 0.1),
    transparent 65%
  );

  --font-display: "Architects Daughter", "Bradley Hand", "Comic Sans MS", cursive;
}
```

- [ ] **Step 2: Verify by hand**

Run `pnpm --dir frontend dev`, open `http://localhost:3000`, and in the devtools
console run:

```js
document.documentElement.setAttribute("data-theme", "sketch");
```

Confirm all of the following, then set it back to `"neon"` and confirm the neon
theme is intact:

- Paper ground, ink card rim with a hard offset shadow, no cyan glow.
- Card titles, section headings, and the site heading render in the handwriting
  face; the definition paragraph and the component descriptions stay in Inter.
- The thumbnail reads as a high-contrast pencil drawing.
- Flipping the card shows a sketch-styled back face.
- The neighbouring cards' veil sets them back without darkening them to black.
- Tab focus draws a visible blue ring on the paper ground.
- Switching the attribute mid-flip neither restarts nor cancels the rotation,
  and switching it mid-travel does not disturb the slot transition — no token
  the transitions depend on changes identity.
- With the OS set to reduce motion, both themes still land the flip and the
  travel instantly.

- [ ] **Step 3: Check contrast**

In devtools, confirm with the accessibility inspector that `--ink-muted` on
`--panel` (the definition paragraph) and `--ink-faint` on `--card-surface` (the
series eyebrow) both report at least 4.5:1. Adjust the token value, not the
component, if either falls short.

- [ ] **Step 4: Run the gate**

Run: `pnpm --dir frontend test && pnpm --dir frontend lint && pnpm --dir frontend format:check`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/globals.css
git commit -m "feat: add the light sketch theme token values"
```

---

### Task 6: The theme toggle

**Files:**

- Create: `frontend/src/components/ThemeToggle.tsx`
- Create: `frontend/src/components/ThemeToggle.test.tsx`
- Modify: `frontend/src/components/ConceptDeck.tsx:76-94`

**Interfaces:**

- Consumes: `Theme`, `DEFAULT_THEME`, `readStoredTheme`, `storeTheme`,
  `applyTheme` from `@/lib/theme`.
- Produces: `<ThemeToggle />`, a no-prop client component rendered inside
  `DeckHeader`.

- [ ] **Step 1: Write the failing test**

Create `frontend/src/components/ThemeToggle.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { ThemeToggle } from "./ThemeToggle";

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeToggle", () => {
  it("offers the sketch theme while the neon theme is on", () => {
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Switch to the sketch theme" }),
    ).toHaveTextContent("SKETCH");
  });

  it("switches the document theme and remembers it", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(document.documentElement).toHaveAttribute("data-theme", "sketch");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("sketch");
    expect(
      screen.getByRole("button", { name: "Switch to the neon theme" }),
    ).toHaveTextContent("NEON");
  });

  it("switches back", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));

    expect(document.documentElement).toHaveAttribute("data-theme", "neon");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("neon");
  });

  // The pre-paint script has already stamped the element; only the button's
  // own label has to catch up after mount.
  it("adopts the stored theme after mounting", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "sketch");
    render(<ThemeToggle />);

    expect(
      await screen.findByRole("button", { name: "Switch to the neon theme" }),
    ).toBeInTheDocument();
  });

  it("carries an aria-hidden icon", () => {
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button").querySelector('svg[aria-hidden="true"]'),
    ).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/components/ThemeToggle.test.tsx`
Expected: FAIL — cannot resolve `./ThemeToggle`.

- [ ] **Step 3: Write the implementation**

Create `frontend/src/components/ThemeToggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_THEME,
  applyTheme,
  readStoredTheme,
  storeTheme,
  type Theme,
} from "@/lib/theme";

const other = (theme: Theme): Theme => (theme === "neon" ? "sketch" : "neon");

const names: Record<Theme, string> = { neon: "neon", sketch: "sketch" };

export function ThemeToggle() {
  // The server cannot know the stored theme, so the first client render must
  // match the markup it produced. The pre-paint script has already applied the
  // real theme to the document; this only catches the label up after mount.
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(readStoredTheme());
  }, []);

  const target = other(theme);

  return (
    <button
      type="button"
      aria-label={`Switch to the ${names[target]} theme`}
      onClick={() => {
        setTheme(target);
        applyTheme(document.documentElement, target);
        storeTheme(target);
      }}
      className="theme-toggle mt-2 flex h-7 items-center gap-1.5 rounded-full border border-control-border bg-control px-3 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--paper)]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 3a9 9 0 0 0 0 18Z" />
        <circle cx="12" cy="12" r="9" />
      </svg>
      {names[target]}
    </button>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/components/ThemeToggle.test.tsx`
Expected: PASS, 5 tests.

- [ ] **Step 5: Mount it in the deck header**

In `frontend/src/components/ConceptDeck.tsx`, import it beside the other
component imports:

```tsx
import { ThemeToggle } from "./ThemeToggle";
```

Then render it as the last child of `DeckHeader`, after the counter paragraph.
The touch target stays comfortable because the header has its own bottom padding:

```tsx
      <ThemeToggle />
```

- [ ] **Step 6: Claw back the header height**

The button costs roughly 36px on a 320×700 phone, where card height is the
scarce resource. In `globals.css`, tighten the header's bottom padding:

```css
.concept-deck-header {
  margin-bottom: clamp(0.5rem, 1.5vh, 1rem);
  padding-bottom: clamp(0.375rem, 1vh, 0.75rem);
}
```

- [ ] **Step 7: Run the whole unit suite**

Run: `pnpm --dir frontend test`
Expected: PASS. `ConceptDeck.test.tsx` and `page.test.tsx` query the heading,
counter, and named arrow buttons specifically, so a new button in the header does
not disturb them. If any test now matches the toggle by an ambiguous role query,
tighten that query with an accessible name rather than removing the assertion.

- [ ] **Step 8: Check coverage**

Run: `pnpm --dir frontend test:coverage`
Expected: PASS, thresholds 85/85/80/85 still met.

- [ ] **Step 9: Commit**

```bash
git add frontend/src/components frontend/src/app/globals.css
git commit -m "feat: add the deck header theme toggle"
```

---

### Task 7: Apply the stored theme before first paint

**Files:**

- Modify: `frontend/src/app/layout.tsx`

**Interfaces:**

- Consumes: `THEME_STORAGE_KEY` from `@/lib/theme`.
- Produces: `data-theme` present on `<html>` before the deck paints.

- [ ] **Step 1: Write the implementation**

Replace `frontend/src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://tcg.nghuy.link"),
  title: "DevOps TCG | Concept Study Deck",
  description:
    "Learn DevOps concepts through an accessible trading-card-inspired study deck.",
};

// The static export ships markup with no data-theme, so a stored sketch choice
// would otherwise appear only once React hydrates — a visible flash of the neon
// card first. This runs before the body paints. The CSP already allows inline
// scripts ('unsafe-inline'), which the RSC payload depends on too.
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});document.documentElement.setAttribute("data-theme",t==="sketch"?"sketch":"neon")}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    // The script above mutates this element before hydration.
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify the script survives the export**

Run:

```bash
pnpm --dir frontend build
grep -c "devops-tcg-theme" frontend/out/index.html
```

Expected: at least 1 — the inline script is present in the exported HTML.

- [ ] **Step 3: Verify the flash is gone by hand**

Run `pnpm --dir frontend dev`, switch to the sketch theme, then hard-reload the
page several times. Expected: the page comes up on paper every time, with no dark
frame. Stop the server.

- [ ] **Step 4: Run the gate**

Run: `pnpm --dir frontend test && pnpm --dir frontend typecheck && pnpm --dir frontend lint && pnpm --dir frontend format:check`
Expected: all pass. In particular `page.test.tsx` must still pass — it renders
`Home`, not the layout, so the script is not in its tree.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/layout.tsx
git commit -m "feat: apply the stored theme before first paint"
```

---

### Task 8: End-to-end coverage

**Files:**

- Create: `frontend/e2e/theme.spec.ts`

**Interfaces:**

- Consumes: the toggle's accessible names `Switch to the sketch theme` and
  `Switch to the neon theme`; the `data-theme` attribute; the existing
  `.concept-card[data-face]` active-card selector.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Write the failing test**

Create `frontend/e2e/theme.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const toSketch = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "Switch to the sketch theme" });

const toNeon = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "Switch to the neon theme" });

const card = (page: import("@playwright/test").Page) =>
  page.locator(".concept-card[data-face]");

test.describe("theme switching", () => {
  test("starts on neon and switches to sketch", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "neon");

    await toSketch(page).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "sketch");
    await expect(toNeon(page)).toBeVisible();
  });

  test("switches back to neon", async ({ page }) => {
    await page.goto("/");
    await toSketch(page).click();
    await toNeon(page).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "neon");
    await expect(toSketch(page)).toBeVisible();
  });

  test("remembers the theme across a reload without a neon frame", async ({
    page,
  }) => {
    await page.goto("/");
    await toSketch(page).click();
    await page.reload();

    // Asserted before any wait, so a theme applied only at hydration would
    // still be neon here.
    expect(
      await page.evaluate(() => document.documentElement.dataset.theme),
    ).toBe("sketch");
    await expect(toNeon(page)).toBeVisible();
  });

  test("falls back to neon when the stored value is unrecognised", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("devops-tcg-theme", "chartreuse");
    });
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "neon");
  });

  test("restyles the card surface and its artwork", async ({ page }) => {
    await page.goto("/");
    const face = card(page).getByTestId("card-front");
    const artwork = face.locator("img").first();

    const neonFilter = await artwork.evaluate(
      (node) => getComputedStyle(node).filter,
    );
    expect(neonFilter).toBe("none");

    await toSketch(page).click();

    await expect(artwork).toHaveCSS("filter", /grayscale/);
    const surface = await face.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    );
    expect(surface).toBe("rgb(251, 250, 246)");
  });

  test("keeps the flip working under the sketch theme", async ({ page }) => {
    await page.goto("/");
    await toSketch(page).click();

    await expect(card(page)).toHaveAttribute("data-face", "front");
    await card(page).click();
    await expect(card(page)).toHaveAttribute("data-face", "back");
  });

  test("adds no horizontal overflow under the sketch theme", async ({
    page,
  }) => {
    await page.goto("/");
    await toSketch(page).click();

    const overflows = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflows).toBe(false);
  });
});
```

- [ ] **Step 2: Build and run the suite to verify it passes**

Run:

```bash
pnpm --dir frontend build
pnpm --dir frontend test:e2e --grep "theme"
```

Expected: PASS in both the `chromium` and `mobile` projects.

If `restyles the card surface` fails on the background colour, read the actual
computed value from the failure output and reconcile it with `--card-surface` in
the sketch block — do not weaken the assertion to a substring match.

- [ ] **Step 3: Run the entire e2e suite**

Run: `pnpm --dir frontend test:e2e`
Expected: PASS — the existing deck, flip, swipe, and image specs are unaffected.

- [ ] **Step 4: Commit**

```bash
git add frontend/e2e/theme.spec.ts
git commit -m "test: cover theme switching end to end"
```

---

### Task 9: Documentation and the full gate

**Files:**

- Modify: `docs/architecture.md:76`
- Modify: `CLAUDE.md`

**Interfaces:**

- Consumes: everything above.
- Produces: nothing.

- [ ] **Step 1: Amend the "Intentionally Absent" list**

In `docs/architecture.md`, replace the bullet

```markdown
- Browser persistence, accounts, scores, or user state
```

with

```markdown
- Accounts, scores, progress, or any user state beyond the theme choice
- Browser persistence other than a single `localStorage` key,
  `devops-tcg-theme`, holding `neon` or `sketch`. It is read by a pre-paint
  inline script and by the header toggle, it is never sent anywhere, and an
  unreadable or unrecognised value resolves to the neon default.
```

- [ ] **Step 2: Document the token layer in `CLAUDE.md`**

In `CLAUDE.md`, add this bullet to the "Frontend architecture" list of
non-obvious mechanisms, after the "Everything that decorates a face is a
background layer on it" bullet:

```markdown
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
  choice never flashes neon. Adding a theme is a third token block, not a
  component change.
```

Also update the "Adding a concept card" paragraph's closing sentence to mention
that new markup must use tokens:

```markdown
Adding a concept card: commit an optimized local WebP under
`frontend/public/images/`, record its source/license in
`public/images/ATTRIBUTION.md`, append one `ConceptCardData` object with a
unique `id` and card number, then extend both the content-contract test
(`src/data/conceptCards.test.ts`) and the e2e image/title tables in
`e2e/concept-deck.spec.ts`. Any new markup styles itself from the theme tokens,
so it works in both themes without a second pass.
```

- [ ] **Step 3: Run the complete quality gate**

Run:

```bash
pnpm --dir frontend format:check
pnpm --dir frontend lint
pnpm --dir frontend typecheck
pnpm --dir frontend test:coverage
pnpm --dir frontend build
pnpm --dir frontend test:e2e
```

Expected: every command passes and coverage holds at 85/85/80/85.

- [ ] **Step 4: Verify the constraints held**

Run:

```bash
git diff --stat main@{u}..HEAD -- frontend/public/images
grep -n '"dependencies"' -A 5 frontend/package.json
grep -rn "mix-blend-mode" frontend/src
grep -rn "fonts.googleapis\|fonts.gstatic\|next/font" frontend/src frontend/public
```

Expected: no image asset changed; dependencies are still exactly `next`,
`react`, `react-dom`; no `mix-blend-mode`; no third-party font reference.

- [ ] **Step 5: Commit**

```bash
git add docs/architecture.md CLAUDE.md
git commit -m "docs: record the theme token layer and the theme storage key"
```

- [ ] **Step 6: Report, do not push**

Summarise what shipped and state explicitly that `main` has **not** been pushed.
Pushing deploys to production and happens only when the user asks.

---

## Verification Summary

The feature is done when, from a clean checkout:

- `pnpm --dir frontend format:check`, `lint`, `typecheck`, `test:coverage`,
  `build`, and `test:e2e` all pass.
- The deck opens on the neon theme, the header toggle switches it to the sketch
  theme, and the choice survives a reload with no flash.
- The sketch theme restyles the card surface, every piece of card text, and the
  thumbnail artwork.
- `grep -rE "text-(cyan|violet|slate|white)|bg-(cyan|violet|slate|white)"
  frontend/src/components` returns nothing.
- `frontend/package.json` still lists exactly three runtime dependencies.
