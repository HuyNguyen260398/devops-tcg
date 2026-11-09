// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";
import { renderServiceWorker } from "./build-sw.mjs";

const ORIGIN = "https://tcg.nghuy.link";

interface FakeRequest {
  readonly method: string;
  readonly url: string;
  readonly mode?: string;
}

// The worker addresses its cache by URL, so the fake keys entries by path and
// query, and drops the query only when asked to — the one option it uses.
const keyOf = (input: string | FakeRequest, ignoreSearch = false) => {
  const url = new URL(typeof input === "string" ? input : input.url, ORIGIN);
  return ignoreSearch ? url.pathname : url.pathname + url.search;
};

const fakeCaches = (initial: Record<string, Record<string, string>>) => {
  const store = new Map<string, Map<string, Response>>(
    Object.entries(initial).map(([name, entries]) => [
      name,
      new Map(
        Object.entries(entries).map(([url, body]) => [url, new Response(body)]),
      ),
    ]),
  );

  const open = async (name: string) => {
    if (!store.has(name)) store.set(name, new Map());
    const entries = store.get(name)!;

    return {
      match: async (
        request: string | FakeRequest,
        options?: { ignoreSearch?: boolean },
      ) => {
        const wanted = keyOf(request, options?.ignoreSearch);
        for (const [url, response] of entries) {
          if (keyOf(url, options?.ignoreSearch) === wanted) return response;
        }
        return undefined;
      },
      put: async (request: string | FakeRequest, response: Response) => {
        entries.set(keyOf(request), response);
      },
      addAll: async () => undefined,
    };
  };

  return {
    store,
    api: {
      open,
      keys: async () => [...store.keys()],
      delete: async (name: string) => store.delete(name),
    },
  };
};

const startWorker = (
  initial: Record<string, Record<string, string>>,
  fetchImpl: (request: FakeRequest) => Promise<Response>,
) => {
  const template = readFileSync(
    path.resolve(__dirname, "sw-template.js"),
    "utf8",
  );
  const handlers = new Map<string, (event: unknown) => void>();
  const caches = fakeCaches(initial);
  const fetch = vi.fn(fetchImpl);
  const self = {
    location: { origin: ORIGIN },
    clients: { claim: vi.fn(async () => undefined) },
    skipWaiting: vi.fn(async () => undefined),
    addEventListener: (type: string, handler: (event: unknown) => void) =>
      handlers.set(type, handler),
  };

  vm.runInNewContext(
    renderServiceWorker(template, { urls: ["/"], version: "new" }),
    { self, caches: caches.api, fetch, URL, Request, Response, Promise },
  );

  const dispatch = (type: string, request?: FakeRequest) => {
    const waits: Promise<unknown>[] = [];
    let response: Promise<Response> | undefined;

    handlers.get(type)!({
      request,
      waitUntil: (promise: Promise<unknown>) => waits.push(promise),
      respondWith: (promise: Promise<Response>) => {
        response = promise;
      },
    });

    return { settled: Promise.all(waits), response };
  };

  return { caches: caches.store, fetch, dispatch };
};

describe("the service worker", () => {
  // An installed app updated by a deploy: the old deck's cache goes, the new
  // one stays, and a cache some other script on the origin owns is not ours.
  it("keeps only its own cache once activated", async () => {
    const worker = startWorker(
      { "devops-tcg-old": {}, "devops-tcg-new": {}, "other-app": {} },
      async () => new Response(""),
    );

    await worker.dispatch("activate").settled;

    expect([...worker.caches.keys()]).toEqual(["devops-tcg-new", "other-app"]);
  });

  it("leaves non-GET, cross-origin and its own script to the network", () => {
    const worker = startWorker({}, async () => new Response(""));

    for (const request of [
      { method: "POST", url: `${ORIGIN}/` },
      { method: "GET", url: "https://example.com/x" },
      { method: "GET", url: `${ORIGIN}/sw.js` },
    ]) {
      expect(worker.dispatch("fetch", request).response).toBeUndefined();
    }
    expect(worker.fetch).not.toHaveBeenCalled();
  });

  // A shared link or a launcher shortcut carries a query; offline, the cached
  // shell must still answer it.
  it("falls back to the cached shell for an offline navigation with a query", async () => {
    const worker = startWorker({ "devops-tcg-new": { "/": "shell" } }, () =>
      Promise.reject(new TypeError("Failed to fetch")),
    );

    const { response } = worker.dispatch("fetch", {
      method: "GET",
      url: `${ORIGIN}/?card=ssh`,
      mode: "navigate",
    });

    expect(await (await response!).text()).toBe("shell");
  });

  it("caches a missed static asset but not an arbitrary path", async () => {
    const worker = startWorker(
      { "devops-tcg-new": {} },
      async () => new Response("fresh", { status: 200 }),
    );

    for (const url of [`${ORIGIN}/_next/static/x.js`, `${ORIGIN}/other.json`]) {
      const { response } = worker.dispatch("fetch", { method: "GET", url });
      expect(await (await response!).text()).toBe("fresh");
    }

    expect([...worker.caches.get("devops-tcg-new")!.keys()]).toEqual([
      "/_next/static/x.js",
    ]);
  });
});
