# Installable PWA and Mobile Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Status (2026-11-09):** Tasks 1–7 were implemented ahead of this write-up
> and landed as `b40c7c6` (spec), `ea672de` (Tasks 1–5, 7) and `ebaf40e`
> (Task 6); their steps are checked. The steps still open are the Review Focus
> tests, which were added after the fact. Each sits in the task that owns the
> code it pins.

**Goal:** Make the DevOps TCG deck installable on phones as a standalone app that works offline, and fix the phone layout's touch defects.

**Architecture:** A Next metadata route emits the manifest, and the root layout sets viewport, Apple web-app and theme-colour tags. A dependency-free Node script runs after `next build` and writes `out/sw.js` from a hand-written template, inlining the export's file list and a content hash. A client component registers that worker in production. CSS pads the shell and the modal layer by the safe-area insets, and the phone search sheet is resized for touch.

**Tech Stack:** Next.js 14.2 static export, React 18, Tailwind 3, Vitest + jsdom, Playwright (Chromium), GitHub Actions + AWS CLI.

**Spec:** `docs/superpowers/specs/2026-11-09-installable-pwa-design.md`

## Global Constraints

- Runtime dependencies stay exactly `next`, `react`, `react-dom`: no `next-pwa`, no Workbox.
- No asset is fetched from a third-party host; the CSP is unchanged (`worker-src`/`manifest-src` fall back to `default-src 'self'`).
- Pinch zoom stays enabled: no `maximumScale`, no `userScalable: false`.
- Colour in components comes from theme tokens; `THEME_COLORS` is the only place hex repeats a token, and a test holds it equal to `--paper`.
- Manifest: `id` `/`, `name` "DevOps TCG — Concept Study Deck", `short_name` "DevOps TCG", `display` `standalone`, `start_url`/`scope` `/`, `background_color`/`theme_color` `#050714`, no `orientation`.
- Theme colours: neon `#050714`, sketch `#ece7db`.
- Cache names are `devops-tcg-<16-hex version>`; activate deletes every other `devops-tcg-*` cache and nothing else.
- Every touch target in the phone search sheet (<1024px) is ≥ 44×44px, and the search field's font size is ≥ 16px.
- Layout at ≥ 1024px is unchanged by the search-sheet work.
- Existing behavioural contracts in `CLAUDE.md` hold: the full Vitest and Playwright suites stay green, and coverage stays at or above 85/85/80/85.

## Review Focus

1. **A deploy after install.** An installed app holding `devops-tcg-<old>` should have that cache deleted once the new worker activates, while a cache it does not own survives. → Task 3, Step 7.
2. **Offline launch from a URL with a query string**, as a shared link or a launcher shortcut would produce. The cached shell should still render the deck. → Task 7, Step 5.
3. **Requests the worker must not touch:** a non-GET, a cross-origin URL, or `/sw.js` itself. They should go straight to the network, never be cached, and never be answered from the cache. → Task 3, Step 7.
4. **A stored sketch theme on first paint.** Android's status bar should already be sketch paper (`#ece7db`) before React hydrates, not flash neon. → Task 1, Step 6.
5. **A phone in landscape** (700×320). The search sheet's Done button should stay on screen and close the sheet, rather than being pushed off by the taller 44px rows. → Task 6, Step 7.

---

### Task 1: Theme colour follows the theme

**Files:**
- Modify: `frontend/src/lib/theme.ts`
- Modify: `frontend/src/app/layout.tsx` (pre-paint `themeScript`)
- Test: `frontend/src/lib/theme.test.ts`, `frontend/e2e/theme.spec.ts`

**Interfaces:**
- Produces: `THEME_COLORS: Readonly<Record<Theme, string>>`; `applyTheme(root: HTMLElement, theme: Theme): void` now also sets `content` on `meta[name="theme-color"]` in `root.ownerDocument`, if present.

- [x] **Step 1: Write the failing tests** in `theme.test.ts`:
  - `"repaints the browser chrome to the theme's paper"`: append a `<meta name="theme-color">`, call `applyTheme(document.documentElement, "sketch")` and expect `meta.content === THEME_COLORS.sketch`, then the same for neon.
  - `"changes the theme even with no theme-color tag"`: `applyTheme(detachedHtml, "sketch")` does not throw.
  - `"repeats each theme's --paper token"`: read `src/app/globals.css`; the first `--paper:` after `:root {` equals `THEME_COLORS.neon`, and the first after `[data-theme="sketch"] {` equals `THEME_COLORS.sketch`.
- [x] **Step 2: Run** `pnpm --dir frontend exec vitest run src/lib/theme.test.ts`. Expected: FAIL, because `THEME_COLORS` is not exported.
- [x] **Step 3: Implement** `THEME_COLORS` and the meta update in `applyTheme`. In `layout.tsx`, extend `themeScript` so that after setting `data-theme` it writes `JSON.stringify(THEME_COLORS)[t]` into the same meta tag. Keep it wrapped in the existing `try`.
- [x] **Step 4: Run** the same command. Expected: PASS.
- [x] **Step 5: Commit** (landed in `ea672de`).
- [ ] **Step 6: Review Focus 4.** Add to `e2e/theme.spec.ts`:

```ts
test("paints the browser chrome sketch before hydration", async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("devops-tcg-theme", "sketch"),
  );
  await page.goto("/"); // bare goto: this is about first paint, not arrival
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#ece7db",
  );
});
```

  Run `pnpm --dir frontend build && pnpm --dir frontend exec playwright test e2e/theme.spec.ts -g "browser chrome"`. Expected: PASS on both projects. Commit as `test: pin the sketch theme-color on first paint`.

### Task 2: Manifest, icons and viewport

**Files:**
- Create: `frontend/src/app/manifest.ts`, `frontend/public/icons/app-icon.svg`, `frontend/public/icons/app-icon-maskable.svg`, `frontend/scripts/generate-icons.mjs`
- Create (generated, committed): `frontend/public/icons/{icon-192,icon-512,icon-maskable-512,apple-touch-icon}.png`
- Modify: `frontend/src/app/layout.tsx`

**Interfaces:**
- Consumes: `THEME_COLORS` (Task 1).
- Produces: `/manifest.webmanifest` and `/icons/*.png` in the export; Task 7's e2e reads both.

- [x] **Step 1: Draw the icon sources.** Each is a 512 viewBox: full-bleed `#050714` paper, a cyan radial glow, and the favicon's three fanned cards from `src/app/icon.svg`. The regular icon scales the art by 13 and the maskable one by 9.5, which keeps it inside the 80% safe zone.
- [x] **Step 2: Write `generate-icons.mjs`.** It renders each SVG with `chromium` from `@playwright/test` at a viewport of the target size and screenshots it to the PNG path: 192 and 512 from `app-icon.svg`, 180 as `apple-touch-icon.png`, and 512 maskable from `app-icon-maskable.svg`. Run `node frontend/scripts/generate-icons.mjs`. Expected: four "wrote …" lines. Look at the 512 PNGs by eye.
- [x] **Step 3: Implement `manifest(): MetadataRoute.Manifest`** with the Global Constraints values, `categories: ["education", "productivity"]`, and the three icons, the maskable one with `purpose: "maskable"`.
- [x] **Step 4: Extend the layout.**
  - `metadata` gets `applicationName`, `appleWebApp: { capable: true, title: "DevOps TCG", statusBarStyle: "black-translucent" }`, `icons: { icon: "/icon.svg", apple: "/icons/apple-touch-icon.png" }` and `formatDetection: { telephone: false }`.
  - Add `export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: THEME_COLORS.neon }`.
- [x] **Step 5: Verify.** Run `pnpm --dir frontend build`. `out/manifest.webmanifest` should exist, and `out/index.html` should contain `viewport-fit=cover`, `rel="manifest"` and `rel="apple-touch-icon"`, with exactly one `rel="icon"`.
- [x] **Step 6: Commit** (landed in `ea672de`).

### Task 3: Service worker generated after build

**Files:**
- Create: `frontend/scripts/sw-template.js`, `frontend/scripts/build-sw.mjs`, `frontend/scripts/build-sw.d.mts`
- Modify: `frontend/package.json` (`"build": "next build && node scripts/build-sw.mjs"`)
- Test: `frontend/scripts/build-sw.test.ts`, `frontend/scripts/sw-template.test.ts`

**Interfaces:**
- Produces, from `build-sw.mjs`:
  - `interface Precache { urls: readonly string[]; version: string }`
  - `toUrl(outDir: string, file: string): string`, which maps `index.html` to `/`
  - `collectPrecache(outDir: string): Promise<Precache>`
  - `renderServiceWorker(template: string, precache: Precache): string`
  - `buildServiceWorker(outDir: string): Promise<Precache>`
- Produces: the template's placeholders, `"__SW_VERSION__"` (inside a string) and `__SW_PRECACHE__` (a bare expression), and the cache name `devops-tcg-${VERSION}`.

- [x] **Step 1: Write the failing tests** in `build-sw.test.ts`, against a temp dir holding `index.html`, `404.html`, `_next/static/chunks/app-abc.js`, `images/ssh-thumbnail.webp`, `images/ATTRIBUTION.md`, `fonts/OFL.txt`, `icons/icon-192.png`, `icons/app-icon.svg` and `sw.js`:
  - `collectPrecache(...).urls` equals `["/", "/_next/static/chunks/app-abc.js", "/icons/icon-192.png", "/images/ssh-thumbnail.webp"]`.
  - `version` is stable across two calls and changes when one file's bytes change.
  - `renderServiceWorker` replaces both placeholders, leaving no `__SW_` behind, and throws `/placeholder/` when one is missing.
  - `buildServiceWorker` writes `out/sw.js` containing `const VERSION = "<version>"` and the image URL, and not `"/sw.js",`.
- [x] **Step 2: Run** `pnpm --dir frontend exec vitest run scripts/build-sw.test.ts`. Expected: FAIL, because the module is not found.
- [x] **Step 3: Implement `build-sw.mjs`.**
  - Walk the directory recursively and sort the URLs.
  - Exclude `/sw.js`, `/404.html`, `/icons/*.svg`, `*/ATTRIBUTION.md` and `*/OFL.txt`. `/404.html` is excluded because `serve` answers it with a 301 to a 404, which fails `cache.addAll` and leaves no worker at all.
  - The version is the sha256 over each URL plus its bytes, truncated to 16 hex characters.
  - When run directly, build `../out` and log `sw.js <version>: precaching <n> files`.
- [x] **Step 4: Implement `sw-template.js`.**
  - **install:** `addAll` the precache list as `new Request(url, { cache: "reload" })`, then `skipWaiting()`.
  - **activate:** delete the `devops-tcg-*` caches other than the current one, then `clients.claim()`.
  - **fetch:** skip non-GET requests, other origins and `/sw.js`.
    - Navigations go network-first and fall back to the cached `/`, or `Response.error()` if that is missing.
    - Other requests go cache-first, with `ignoreSearch` only for `.txt` (the RSC `_rsc` query). On a miss, fetch from the network and `put` the response if it is ok and under `/_next/static/`, `/images/`, `/fonts/` or `/icons/`.
- [x] **Step 5: Run** the Step 2 command, then `pnpm --dir frontend build`. Expected: PASS, and the build prints `precaching 122 files` (give or take, as cards are added).
- [x] **Step 6: Commit** (landed in `ea672de`).
- [ ] **Step 7: Review Focus 1 and 3.** Create `scripts/sw-template.test.ts`, which runs the rendered template in `node:vm`:
  - `renderServiceWorker(template, { urls: ["/"], version: "new" })` runs in a context whose `self` records `addEventListener` handlers.
  - The context also has a `self.location.origin` of `https://tcg.nghuy.link`, `self.clients.claim`, `self.skipWaiting`, a `caches` fake backed by a `Map<string, Map<string, Response>>`, and a `fetch` mock. Pass Node's `Request`, `Response` and `URL` in.
  - Fire each handler with an event exposing `waitUntil(p)` and `respondWith(p)`, collecting the promises.

  Tests:
  - `"keeps only its own cache once activated"`: with caches `devops-tcg-old`, `devops-tcg-new` and `other-app`, after `activate` the keys are `["devops-tcg-new", "other-app"]`.
  - `"leaves non-GET, cross-origin and its own script to the network"`: for a `POST /`, a `GET https://example.com/x` and a `GET /sw.js`, `respondWith` is never called.
  - `"falls back to the cached shell for an offline navigation with a query"`: with `/` cached and `fetch` rejecting, a `navigate`-mode `GET /?card=ssh` resolves to the cached `/` body.
  - `"caches a missed static asset but not an arbitrary path"`: `fetch` resolves 200 for `/_next/static/x.js` and for `/other.json`. Only the first is in the cache afterwards.

  Run `pnpm --dir frontend exec vitest run scripts/sw-template.test.ts`. Expected: PASS. If one fails, fix the template, not the test. Commit as `test: pin the service worker's cache rotation and bypasses`.

### Task 4: Register the worker in production

**Files:**
- Create: `frontend/src/lib/serviceWorker.ts`, `frontend/src/components/ServiceWorkerRegistrar.tsx`
- Modify: `frontend/src/app/layout.tsx` (render `<ServiceWorkerRegistrar />` after `{children}`)
- Test: `frontend/src/lib/serviceWorker.test.ts`, `frontend/src/components/ServiceWorkerRegistrar.test.tsx`

**Interfaces:**
- Produces:
  - `SERVICE_WORKER_URL = "/sw.js"`
  - `registerServiceWorker(container: ServiceWorkerContainer | undefined, enabled: boolean): Promise<ServiceWorkerRegistration | null>`
  - `ServiceWorkerRegistrar(): null`

- [x] **Step 1: Write the failing tests.**
  - `registerServiceWorker` calls `register("/sw.js", { scope: "/" })` and returns its registration.
  - It returns `null` without calling anything when `enabled` is false or the container is `undefined`.
  - It returns `null` when `register` rejects.
  - The registrar renders an empty container and calls the helper with `(undefined, false)` under jsdom.
  - With `document.readyState` mocked to `"loading"`, the registrar waits for a `load` event before calling the helper.
- [x] **Step 2: Run** `pnpm --dir frontend exec vitest run src/lib/serviceWorker.test.ts src/components/ServiceWorkerRegistrar.test.tsx`. Expected: FAIL.
- [x] **Step 3: Implement.**
  - The helper wraps `register` in `try`/`catch`.
  - The registrar's `useEffect` passes `navigator.serviceWorker` (when `"serviceWorker" in navigator`) and `process.env.NODE_ENV === "production"`.
  - It registers at once if `readyState === "complete"`, otherwise on a `{ once: true }` `load` listener, which it removes on unmount.
- [x] **Step 4: Run** the Step 2 command. Expected: PASS.
- [x] **Step 5: Commit** (landed in `ea672de`).

### Task 5: Safe areas and touch hygiene

**Files:**
- Modify: `frontend/src/app/globals.css`, `frontend/src/app/page.tsx` (drop `px-4 sm:px-6` from `main`), `frontend/src/components/Dialog.tsx` (drop `p-4` from `.app-dialog`)

- [x] **Step 1: Write the CSS.**
  - `.app-shell` pads top and bottom with `max(clamp(0.75rem, 3vh, 2rem), env(safe-area-inset-top|bottom))`. Left and right use `max(1rem, env(safe-area-inset-left|right))`, and `max(1.5rem, …)` at ≥ 640px.
  - `.app-dialog` pads every side with `max(1rem, env(safe-area-inset-*))`.
  - `body` gets `overscroll-behavior: none`.
  - `.card-thumbnail` gets `-webkit-touch-callout: none; -webkit-user-drag: none; user-select: none`.
- [x] **Step 2: Run** `pnpm --dir frontend build && pnpm --dir frontend test:e2e`. Expected: every existing spec passes. The 320px overflow, card-centring and equal-gap assertions are the regression guard here, since a browser tab has zero insets.
- [x] **Step 3: Commit** (landed in `ea672de`).

### Task 6: Phone search sheet fits touch

**Files:**
- Modify: `frontend/src/components/SearchSheet.tsx`, `frontend/src/components/SearchBar.tsx`, `frontend/src/components/Dialog.tsx`, `frontend/src/app/globals.css`
- Test: `frontend/src/components/SearchSheet.test.tsx`, `frontend/e2e/pwa.spec.ts` (the "search sheet on a phone" block)

**Interfaces:**
- Consumes: `Dialog` (existing); `SearchBar` props are unchanged.
- Produces: a `Done` button (`type="button"`, accessible name "Done") that calls `onClose`, and an `h2` reading "Search".

- [x] **Step 1: Write the failing tests.**
  - Replace `"carries nothing but the search bar"` with `"carries the search bar and a way out, nothing more"`: there is a heading named "Search", a button named "Done", and no button named "Clear all filters".
  - Add `"closes from its Done button"`: clicking Done calls `onClose` once and never calls `onFilterChange`.
  - Keep `"puts the caret in the field so a reader can type at once"` unchanged; it is the guard for Step 3's focus rule.
- [x] **Step 2: Run** `pnpm --dir frontend exec vitest run src/components/SearchSheet.test.tsx`. Expected: FAIL, because there is no Done button.
- [x] **Step 3: Implement.**
  - The header row is `-mt-2 mb-1 flex justify-between`. Done is `h-11 min-w-[44px]`.
  - The sheet loses `bg-panel`, and `.card-search-sheet` gets `background: var(--control)` and `box-shadow: var(--card-shadow-flat)`.
  - `Dialog`'s mount effect focuses the first focusable element only when `!surface.contains(document.activeElement)`. Otherwise Done would steal the field's `autoFocus`.
- [x] **Step 4: Size `SearchBar` below `lg`.**
  - Chips: `flex h-11 items-center px-4 text-[0.65rem]`, then `lg:h-auto lg:px-3 lg:py-1.5 lg:text-[0.6rem]`.
  - Input: `h-11 pr-12 text-base`, then `lg:h-10 lg:pr-10 lg:text-sm`.
  - Clear button: `right-0 h-11 w-11`, then `lg:right-2 lg:h-7 lg:w-7`.
  - In `globals.css`: hide `.search-input::-webkit-search-cancel-button` and `::-webkit-search-decoration` with `appearance: none`. Below 1023px, `.search-chips` gets `mask-image: linear-gradient(to right, #000 calc(100% - 2rem), transparent)` (with the `-webkit-` form) and `padding-right: 2rem`.
- [x] **Step 5: Write the e2e checks** (mobile project, skipped elsewhere with `test.beforeEach(({}, testInfo) => test.skip(...))`):
  - `"types at 16px so iOS never zooms into the field"`: the search box's computed `fontSize` is at least 16.
  - `"gives every chip and the Done button a 44px target"`: first await `Promise.all(sheet.getAnimations().map(a => a.finished))`, because measuring mid-rise reads 43.99. Then Done and "All categories" are at least 44 in both dimensions. Fill "ssh", tap Done, and expect the dialog count to be 0 and "Search the deck, filter active" to be visible.

  Run `pnpm --dir frontend build && pnpm --dir frontend exec playwright test e2e/pwa.spec.ts --repeat-each 10`. Expected: all pass.
- [x] **Step 6: Commit** (landed in `ebaf40e`).
- [ ] **Step 7: Review Focus 5.** Add to the same block:

```ts
test("keeps Done on screen with the phone turned sideways", async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 320 });
  await arrive(page);
  await page.getByRole("button", { name: /Search the deck/ }).click();
  const done = page.getByRole("button", { name: "Done" });
  await expect(done).toBeInViewport({ ratio: 1 });
  await done.tap();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
```

  Run `pnpm --dir frontend exec playwright test e2e/pwa.spec.ts --project=mobile -g sideways`. Expected: PASS. If Done is clipped, give `.card-search-sheet` `overflow-y: auto` (the dialog surface is already `max-h-full`) instead of shrinking the targets. Commit as `test: keep the search sheet usable in landscape`.

### Task 7: Prove install and offline end to end, ship, document

**Files:**
- Create: `frontend/e2e/pwa.spec.ts` (the "installable app" block)
- Modify: `.github/workflows/deploy.yml`, `docs/architecture.md`, `CLAUDE.md`

- [x] **Step 1: Write the e2e checks** (chromium project only):
  - `"links a manifest whose icons all load"`: `link[rel=manifest]` points to `/manifest.webmanifest`. Its JSON matches `{ short_name: "DevOps TCG", display: "standalone", start_url: "/" }` and has a maskable icon. Every icon returns 200 with a `content-type` containing its `type`, and the apple-touch-icon returns 200.
  - `"keeps the whole deck readable offline once installed"`: after `arrive`, await `navigator.serviceWorker.ready` and poll until there is a `controller`. Then `context.setOffline(true)`, `arrive` again, and expect the first visible `img.card-thumbnail-neon` to have `naturalWidth > 0`. The desktop project opens on the grid, so do not look for `.concept-card[data-face]`.
- [x] **Step 2: Run** `pnpm --dir frontend build && pnpm --dir frontend exec playwright test e2e/pwa.spec.ts`. Expected: PASS.
- [x] **Step 3: Change the deploy.** After `s3 sync`, add the step "Publish the service worker and manifest uncached". It runs `aws s3 cp` for `sw.js` (`application/javascript; charset=utf-8`) and `manifest.webmanifest` (`application/manifest+json; charset=utf-8`), both with `--cache-control "no-cache"`, reading the bucket from `env: BUCKET`. Run `actionlint .github/workflows/deploy.yml`. Expected: no output.
- [x] **Step 4: Update the docs.**
  - `architecture.md`: add the deploy-diagram line and an "Installable App (PWA)" section. Amend "Intentionally Absent" so it says the Cache Storage holds only the public export.
  - `CLAUDE.md`: a paragraph on `build-sw.mjs`, `sw-template.js`, production-only registration, `generate-icons.mjs`, `THEME_COLORS`, and the 44px/16px rule.

  Then run the full gate: `format:check`, `lint`, `typecheck`, `test:coverage` (≥ 85/85/80/85), `build`, `test:e2e`, and `terraform fmt -check -recursive infra`. Expected: all green. Commit (landed in `ea672de`/`ebaf40e`).
- [ ] **Step 5: Review Focus 2.** Add to the "installable app" block:

```ts
test("opens a shared link offline from the cached shell", async ({
  page,
  context,
}) => {
  await arrive(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect
    .poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null))
    .toBe(true);
  await context.setOffline(true);
  await arrive(page, "/?from=share");
  await expect(page.locator("img.card-thumbnail-neon:visible").first()).toBeVisible();
  await context.setOffline(false);
});
```

  Run `pnpm --dir frontend exec playwright test e2e/pwa.spec.ts -g "shared link"`. Expected: PASS. Commit as `test: open a query-string link offline`.
- [ ] **Step 6: Manual acceptance after the owner pushes.**
  - On an Android phone in Chrome: install from the menu prompt, launch it, turn on airplane mode, relaunch, and flip and search a card.
  - On an iPhone in Safari: Share → Add to Home Screen, then the same checks. The title should clear the notch and the toolbar should clear the home indicator, in both themes.
  - Record what you find in the spec's Testing section.
