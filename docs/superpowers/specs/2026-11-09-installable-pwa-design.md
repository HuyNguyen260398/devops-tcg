# Installable PWA and Mobile Polish — Design

Date: 2026-11-09
Status: requested by the owner ("convert the web app to PWA so it can be
installed as app in mobile devices", plus a ui-ux-pro-max pass optimised for
mobile); the owner opted out of design questions, so every call below is the
builder's and is marked as such.

## Intent

The deck is used on phones. The owner wants it on the home screen like a
native app: its own icon, its own window with no browser chrome, and — the
part that makes an installed study deck worth having — working on a train with
no signal. Alongside that, a mobile UX pass using the ui-ux-pro-max guidelines.

## Goals

- Installable on Android (Chrome) and iOS (Safari "Add to Home Screen"), and on
  desktop Chromium as a bonus.
- Standalone window that respects the notch, the home indicator and rounded
  corners (safe areas).
- Fully usable offline after the first visit: all forty-nine cards, both
  themes' artwork, the sketch font.
- A deploy reaches installed users on their next launch, with no stale deck
  stuck behind a cache.
- Fix the mobile UX defects found against the ui-ux-pro-max rules.

## Non-goals

- No custom "Install" button or banner. Browsers already offer installation,
  and the phone toolbar has no free cell. *(builder's call)*
- No push notifications, background sync, or anything that needs a server.
- No change to the neon/sketch identity. The skill's generated design system
  (claymorphism, purple, Google-hosted Orbitron) was rejected: it fights the
  established look and the no-third-party-fetch rule. *(builder's call)*

## Anti-goals

- A new runtime dependency (`next-pwa`, Workbox). The service worker is
  hand-written; the repo still ships only `next`, `react`, `react-dom`.
- A service worker that serves an old deck after a deploy, or that a broken
  build can wedge in place.
- Disabling pinch zoom.

## Design

### Manifest and icons

- `src/app/manifest.ts` (Next metadata route → `/manifest.webmanifest`):
  `name` "DevOps TCG — Concept Study Deck", `short_name` "DevOps TCG",
  `display: standalone`, `start_url`/`scope` `/`, background and theme colour
  `#050714` (the neon paper). No `orientation` lock — tablets and desktop
  installs may want landscape.
- Icons are a full-bleed redraw of the favicon's fanned cards on the neon
  paper, committed as PNGs under `public/icons/` (192, 512, maskable 512 with
  the art inside the 80% safe zone, and a 180px `apple-touch-icon`). They are
  rendered from `public/icons/app-icon.svg` and `app-icon-maskable.svg` by
  `scripts/generate-icons.mjs` with the Playwright Chromium the repo already
  has; regenerating is a manual step.

### Viewport, status bar, theme colour

- `viewport` export: `viewportFit: "cover"` so the page can paint behind the
  notch, `themeColor` `#050714`. Zoom stays enabled.
- `appleWebApp`: capable, title "DevOps TCG", `black-translucent` status bar.
  The sketch theme's light paper gets white status-bar text on iOS; iOS reads
  that style once at launch, so it cannot follow the theme. Accepted.
- `<meta name="theme-color">` follows the theme on Android and desktop:
  `applyTheme` and the pre-paint script both rewrite it from a
  `THEME_COLORS` map in `lib/theme.ts` (the same hex as each theme's
  `--paper`).

### Safe areas

`.app-shell` pads every edge with `max(<current padding>,
env(safe-area-inset-*))`, and the modal layer does the same, so the title clears
the notch, the toolbar clears the home indicator, and landscape content clears
the rounded corners. In a browser tab the insets are zero and nothing moves.

### Service worker

- `scripts/sw-template.js` is the worker; `scripts/build-sw.mjs` runs after
  `next build`. It lists every file in `out/` (with `index.html` keyed as `/`),
  hashes their contents into a version string, and writes `out/sw.js` with both
  inlined. Each deploy whose output changes therefore gets a new worker.
- **install**: precache the whole export (about 4 MB, 120 files) into
  `devops-tcg-<version>`, then `skipWaiting`.
- **activate**: delete every other `devops-tcg-*` cache, `clients.claim()`.
- **fetch** (same-origin GET only):
  - navigations: network first, so an online reader always gets the deployed
    page; fall back to the cached `/`.
  - everything else: cache first, then network, and cache-on-success for
    anything under `/_next/static/`, `/images/`, `/fonts/`, `/icons/`.
- Registered from a small client component in the layout after `load`, in
  production builds only.
- Hosting: `aws s3 sync` cannot set per-file headers, so the deploy re-uploads
  `sw.js` and `manifest.webmanifest` with `Cache-Control: no-cache` and explicit
  content types. The existing `/*` invalidation already covers CloudFront. The
  CSP needs no change: `worker-src` and `manifest-src` fall back to
  `default-src 'self'`.
- `docs/architecture.md` → "Intentionally Absent" is amended: the Cache
  Storage the worker holds is a copy of the public static export, with no user
  data in it.

### Mobile UX pass (ui-ux-pro-max findings)

Found by screenshotting the export at 375×812 and 320×640:

1. **Search sheet is translucent.** `bg-panel` is 7% white, so the card behind
   shows through the count. The sheet gets an opaque `--control` surface.
2. **Search sheet has no visible way out on a touch screen.** Only Escape and
   tapping the backdrop. Add a 44px "Done" button in a header row with the
   label "Search", so the sheet reads as a titled sheet.
3. **iOS zooms into the search field.** 14px input text triggers Safari's
   focus zoom. Use 16px below 1024px, and a 44px height.
4. **Touch targets under 44px.** Below 1024px, category chips go from about
   26px to 44px tall, and the clear-text button from 28px to 44px.
5. **Clipped chip strip gives no hint.** The last chip is cut mid-word with no
   scroll cue. A trailing fade mask below 1024px shows there is more.
6. **Long-press and overscroll.** A long press on card art opens the image
   callout and interrupts the flip/swipe, so `-webkit-touch-callout: none` goes
   on card thumbnails. The body gets `overscroll-behavior: none` so Android's
   pull-to-refresh cannot reload the standalone app mid-reel. Tap highlight is
   already off.

Wide-screen layout (≥1024px) is unchanged by items 3–5.

## Testing

- Unit: `lib/theme` theme-colour sync; `lib/serviceWorker` registration guards;
  `scripts/build-sw.mjs` file listing, version and rendering; `SearchSheet`
  Done button; `SearchBar` mobile sizing classes are present.
- e2e (`e2e/pwa.spec.ts`, desktop project): the manifest is linked and parses,
  its icons load, the worker takes control, and the page still renders a card
  after going offline and reloading. Mobile project: the search field's
  computed font size is at least 16px, and the Done button closes the sheet.
- Manual: install on a real iPhone and Android phone after deploy; screenshot
  320/375 in both themes.
