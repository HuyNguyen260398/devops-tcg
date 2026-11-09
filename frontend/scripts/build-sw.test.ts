import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  buildServiceWorker,
  collectPrecache,
  renderServiceWorker,
} from "./build-sw.mjs";

let outDir: string;

const put = async (relative: string, content: string) => {
  const file = path.join(outDir, relative);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
};

beforeEach(async () => {
  outDir = await mkdtemp(path.join(tmpdir(), "build-sw-"));
  await put("index.html", "<html></html>");
  await put("404.html", "missing");
  await put("_next/static/chunks/app-abc.js", "chunk");
  await put("images/ssh-thumbnail.webp", "webp");
  await put("images/ATTRIBUTION.md", "licence");
  await put("fonts/OFL.txt", "licence");
  await put("icons/icon-192.png", "png");
  await put("icons/app-icon.svg", "<svg/>");
  await put("sw.js", "old worker");
});

afterEach(async () => {
  await rm(outDir, { recursive: true, force: true });
});

describe("collectPrecache", () => {
  it("lists every page asset, with the shell keyed as /", async () => {
    const { urls } = await collectPrecache(outDir);

    expect(urls).toEqual([
      "/",
      "/_next/static/chunks/app-abc.js",
      "/icons/icon-192.png",
      "/images/ssh-thumbnail.webp",
    ]);
  });

  it("changes version when any file's content changes", async () => {
    const before = (await collectPrecache(outDir)).version;
    expect((await collectPrecache(outDir)).version).toBe(before);

    await put("images/ssh-thumbnail.webp", "new art");
    expect((await collectPrecache(outDir)).version).not.toBe(before);
  });
});

describe("renderServiceWorker", () => {
  it("inlines the version and the list", () => {
    const rendered = renderServiceWorker(
      'const V = "__SW_VERSION__"; const P = __SW_PRECACHE__;',
      { urls: ["/", "/a.js"], version: "abc123" },
    );

    expect(rendered).toContain('const V = "abc123"');
    expect(rendered).toContain('"/a.js"');
    expect(rendered).not.toContain("__SW_");
  });

  it("refuses a template that has lost a placeholder", () => {
    expect(() =>
      renderServiceWorker("const V = 1;", { urls: [], version: "x" }),
    ).toThrow(/placeholder/);
  });
});

describe("buildServiceWorker", () => {
  it("writes a worker that precaches the export", async () => {
    const { version } = await buildServiceWorker(outDir);
    const worker = await readFile(path.join(outDir, "sw.js"), "utf8");

    expect(worker).toContain(`const VERSION = "${version}"`);
    expect(worker).toContain('"/images/ssh-thumbnail.webp"');
    expect(worker).not.toContain('"/sw.js",');
  });
});
