// Renders the committed PWA icons from their SVG sources with the Playwright
// Chromium the e2e suite already installs, so no image dependency is needed.
// Run by hand after editing an icon SVG:
//   node scripts/generate-icons.mjs
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const iconsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/icons",
);

const targets = [
  { source: "app-icon.svg", output: "icon-192.png", size: 192 },
  { source: "app-icon.svg", output: "icon-512.png", size: 512 },
  { source: "app-icon.svg", output: "apple-touch-icon.png", size: 180 },
  {
    source: "app-icon-maskable.svg",
    output: "icon-maskable-512.png",
    size: 512,
  },
];

const browser = await chromium.launch();

try {
  for (const { source, output, size } of targets) {
    const svg = await readFile(path.join(iconsDir, source), "utf8");
    const page = await browser.newPage({
      viewport: { width: size, height: size },
    });

    await page.setContent(
      `<style>html,body{margin:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
    );
    await page.screenshot({ path: path.join(iconsDir, output) });
    await page.close();
    console.log(`wrote ${output}`);
  }
} finally {
  await browser.close();
}
