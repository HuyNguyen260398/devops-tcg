/* global self, caches, fetch, URL, Response */
// The DevOps TCG service worker. scripts/build-sw.mjs writes this file into the
// static export as /sw.js, replacing the two placeholders below with a content
// hash of the export and the list of every file in it. A deploy that changes
// any file therefore ships a new worker, which installs a fresh cache and
// deletes the old one: an installed app never keeps an old deck.

const VERSION = "__SW_VERSION__";
const PRECACHE = __SW_PRECACHE__;

const CACHE_PREFIX = "devops-tcg-";
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;

// Files the export did not list (a chunk fetched under a new name mid-deploy)
// are kept once fetched, so long as they live where hashed or static assets do.
const RUNTIME_CACHEABLE = ["/_next/static/", "/images/", "/fonts/", "/icons/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // `reload` skips the HTTP cache, so the precache is the deployed export
      // rather than whatever the browser happened to hold.
      .then((cache) =>
        cache.addAll(
          PRECACHE.map((url) => new Request(url, { cache: "reload" })),
        ),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// How long a launch waits on the network before opening the cached shell. On
// a train the signal is more often weak than absent, and a request that never
// answers would otherwise hold the installed app on a blank screen.
const NAVIGATION_TIMEOUT = 3000;

// Online, a navigation goes to the network, so a reader with signal sees the
// deployed page — and a good answer for "/" refreshes the cached shell, which
// repairs one a worker might have precached from a stale edge. Offline, or on
// a network that stalls, the cached shell stands in.
const handleNavigation = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const isShell = new URL(request.url).pathname === "/";
  const network = fetch(request).then(async (response) => {
    if (isShell && response.ok && !response.redirected) {
      await cache.put("/", response.clone());
    }
    return response;
  });
  const shell = await cache.match("/");

  if (shell === undefined) {
    try {
      return await network;
    } catch {
      return Response.error();
    }
  }

  let timer;
  const stalled = new Promise((resolve) => {
    timer = setTimeout(() => resolve(shell), NAVIGATION_TIMEOUT);
  });

  try {
    return await Promise.race([network.catch(() => shell), stalled]);
  } finally {
    clearTimeout(timer);
  }
};

// Everything else in the export is content-addressed or immutable between
// deploys, so the cache answers first.
const handleAsset = async (request, url) => {
  const cache = await caches.open(CACHE_NAME);
  // The RSC payload is requested with a cache-busting `_rsc` query.
  const cached = await cache.match(request, {
    ignoreSearch: url.pathname.endsWith(".txt"),
  });

  if (cached !== undefined) return cached;

  const response = await fetch(request);

  if (
    response.ok &&
    RUNTIME_CACHEABLE.some((prefix) => url.pathname.startsWith(prefix))
  ) {
    await cache.put(request, response.clone());
  }

  return response;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  // The worker never serves itself.
  if (url.pathname === "/sw.js") return;

  event.respondWith(
    request.mode === "navigate"
      ? handleNavigation(request)
      : handleAsset(request, url),
  );
});
