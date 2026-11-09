// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";
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
    {
      self,
      caches: caches.api,
      fetch,
      URL,
      Request,
      Response,
      Promise,
      // Read through globalThis so a test's fake timers reach the worker.
      setTimeout: (...args: Parameters<typeof setTimeout>) =>
        globalThis.setTimeout(...args),
      clearTimeout: (id: ReturnType<typeof setTimeout>) =>
        globalThis.clearTimeout(id),
    },
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

afterEach(() => {
  vi.useRealTimers();
});

const text = async (response: Response | undefined) => response?.text();

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

  // A worker that installed while the edge still served an old shell would
  // otherwise keep it until the next deploy; an online launch repairs it.
  it("refreshes the cached shell from an online launch", async () => {
    const worker = startWorker(
      { "devops-tcg-new": { "/": "old shell" } },
      async () => new Response("new shell", { status: 200 }),
    );

    const { response } = worker.dispatch("fetch", {
      method: "GET",
      url: `${ORIGIN}/?from=share`,
      mode: "navigate",
    });

    expect(await text(await response)).toBe("new shell");
    expect(await text(worker.caches.get("devops-tcg-new")!.get("/"))).toBe(
      "new shell",
    );
  });

  it("never caches a failed navigation as the shell", async () => {
    const worker = startWorker(
      { "devops-tcg-new": { "/": "old shell" } },
      async () => new Response("bad gateway", { status: 502 }),
    );

    const { response } = worker.dispatch("fetch", {
      method: "GET",
      url: `${ORIGIN}/`,
      mode: "navigate",
    });

    expect((await response)!.status).toBe(502);
    expect(await text(worker.caches.get("devops-tcg-new")!.get("/"))).toBe(
      "old shell",
    );
  });

  // On a train the signal is more often weak than absent: a request that never
  // answers must not keep the installed app on a blank launch.
  it("opens the cached shell when the network stalls", async () => {
    vi.useFakeTimers();
    const worker = startWorker(
      { "devops-tcg-new": { "/": "shell" } },
      () => new Promise<Response>(() => undefined),
    );

    const { response } = worker.dispatch("fetch", {
      method: "GET",
      url: `${ORIGIN}/`,
      mode: "navigate",
    });
    await vi.advanceTimersByTimeAsync(3000);

    expect(await text(await response)).toBe("shell");
  });

  it("waits out a slow network when there is no shell to fall back to", async () => {
    vi.useFakeTimers();
    const worker = startWorker(
      { "devops-tcg-new": {} },
      () =>
        new Promise<Response>((resolve) =>
          globalThis.setTimeout(() => resolve(new Response("late")), 5000),
        ),
    );

    let settled = false;
    const { response } = worker.dispatch("fetch", {
      method: "GET",
      url: `${ORIGIN}/`,
      mode: "navigate",
    });
    void response!.then(() => {
      settled = true;
    });

    await vi.advanceTimersByTimeAsync(3000);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(2000);
    expect(await text(await response)).toBe("late");
  });
});
