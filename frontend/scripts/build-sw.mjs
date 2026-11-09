// Runs after `next build`: writes out/sw.js from scripts/sw-template.js with
// the export's file list and a content hash inlined. No dependency — the list
// is a directory walk and the version is a sha256 of every file it names.
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

// Not page assets: the worker never caches itself, the licence notes and icon
// sources are never requested by the page, and the 404 page is never reached
// by a single-page deck — while a host that redirects it (`serve` answers
// /404.html with a 301 to a 404) would fail the whole precache.
const EXCLUDED = [
  /^\/sw\.js$/,
  /^\/404\.html$/,
  /^\/icons\/.*\.svg$/,
  /\/ATTRIBUTION\.md$/,
  /\/OFL\.txt$/,
];

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    }),
  );
  return nested.flat();
};

// CloudFront serves index.html as "/", which is also what a navigation asks
// for, so the shell is cached under that key.
export const toUrl = (outDir, file) => {
  const url = `/${path.relative(outDir, file).split(path.sep).join("/")}`;
  return url === "/index.html" ? "/" : url;
};

export const collectPrecache = async (outDir) => {
  const files = (await walk(outDir))
    .map((file) => ({ file, url: toUrl(outDir, file) }))
    .filter(({ url }) => !EXCLUDED.some((pattern) => pattern.test(url)))
    .sort((a, b) => (a.url < b.url ? -1 : a.url > b.url ? 1 : 0));

  const hash = createHash("sha256");

  for (const { file, url } of files) {
    hash.update(url);
    hash.update(await readFile(file));
  }

  return {
    urls: files.map(({ url }) => url),
    version: hash.digest("hex").slice(0, 16),
  };
};

export const renderServiceWorker = (template, { urls, version }) => {
  if (
    !template.includes("__SW_VERSION__") ||
    !template.includes("__SW_PRECACHE__")
  ) {
    throw new Error("sw-template.js is missing a placeholder");
  }

  return template
    .replace("__SW_VERSION__", version)
    .replace("__SW_PRECACHE__", JSON.stringify(urls, null, 2));
};

export const buildServiceWorker = async (outDir) => {
  const template = await readFile(path.join(here, "sw-template.js"), "utf8");
  const precache = await collectPrecache(outDir);

  await writeFile(
    path.join(outDir, "sw.js"),
    renderServiceWorker(template, precache),
  );
  return precache;
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const outDir = path.resolve(here, "../out");
  const { urls, version } = await buildServiceWorker(outDir);
  console.log(`sw.js ${version}: precaching ${urls.length} files`);
}
