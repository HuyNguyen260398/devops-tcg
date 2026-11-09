import { expect, test } from "@playwright/test";
import { arrive } from "./arrive";

test.describe("installable app", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "service worker behaviour is checked once, on desktop Chromium",
    );
  });

  test("links a manifest whose icons all load", async ({ page, request }) => {
    await arrive(page);

    const href = await page
      .locator('link[rel="manifest"]')
      .getAttribute("href");
    expect(href).toBe("/manifest.webmanifest");

    const manifest = await (await request.get(href!)).json();
    expect(manifest).toMatchObject({
      short_name: "DevOps TCG",
      display: "standalone",
      start_url: "/",
    });
    expect(
      manifest.icons.some(
        (icon: { purpose?: string }) => icon.purpose === "maskable",
      ),
    ).toBe(true);

    for (const icon of manifest.icons as { src: string; type: string }[]) {
      const response = await request.get(icon.src);
      expect(response.ok(), icon.src).toBe(true);
      expect(response.headers()["content-type"]).toContain(icon.type);
    }

    const apple = await page
      .locator('link[rel="apple-touch-icon"]')
      .getAttribute("href");
    expect((await request.get(apple!)).ok()).toBe(true);
  });

  test("keeps the whole deck readable offline once installed", async ({
    page,
    context,
  }) => {
    await arrive(page);

    // The worker precaches the export during install and claims the page
    // when it activates.
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect
      .poll(() =>
        page.evaluate(() => navigator.serviceWorker.controller !== null),
      )
      .toBe(true);

    await context.setOffline(true);
    await arrive(page);

    // A wide screen opens on the grid; every tile's artwork must have come
    // from the cache, since the network is gone.
    const art = page.locator("img.card-thumbnail-neon:visible").first();
    await expect(art).toBeVisible();
    await expect
      .poll(() => art.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);

    await context.setOffline(false);
  });

  // A shared link or a launcher shortcut opens with a query string, which the
  // precache never listed; offline, the cached shell must still answer it.
  test("opens a shared link offline from the cached shell", async ({
    page,
    context,
  }) => {
    await arrive(page);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect
      .poll(() =>
        page.evaluate(() => navigator.serviceWorker.controller !== null),
      )
      .toBe(true);

    await context.setOffline(true);
    await arrive(page, "/?from=share");

    await expect(
      page.locator("img.card-thumbnail-neon:visible").first(),
    ).toBeVisible();

    await context.setOffline(false);
  });
});

test.describe("search sheet on a phone", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile",
      "the sheet is the phone's search",
    );
  });

  test("types at 16px so iOS never zooms into the field", async ({ page }) => {
    await arrive(page);
    await page.getByRole("button", { name: "Search the deck" }).click();

    const size = await page
      .getByRole("searchbox")
      .evaluate((input) => parseFloat(getComputedStyle(input).fontSize));
    expect(size).toBeGreaterThanOrEqual(16);
  });

  test("gives every chip and the Done button a 44px target", async ({
    page,
  }) => {
    await arrive(page);
    await page.getByRole("button", { name: "Search the deck" }).click();

    const sheet = page.getByRole("dialog", { name: "Search the deck" });
    const done = sheet.getByRole("button", { name: "Done" });
    const chip = sheet.getByRole("button", { name: "All categories" });

    // The sheet rises into place; measure it once it has landed.
    await sheet.evaluate((element) =>
      Promise.all(
        element.getAnimations().map((animation) => animation.finished),
      ),
    );

    for (const target of [done, chip]) {
      const box = await target.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.width).toBeGreaterThanOrEqual(44);
    }

    await page.getByRole("searchbox").fill("ssh");
    await done.tap();

    await expect(sheet).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Search the deck, filter active" }),
    ).toBeVisible();
  });

  // A phone turned sideways is 320px tall, and the sheet's rows are now 44px
  // each; the way out must not be the part that falls off the screen.
  test("keeps Done on screen with the phone turned sideways", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 700, height: 320 });
    await arrive(page);
    await page.getByRole("button", { name: /Search the deck/ }).click();

    const done = page.getByRole("button", { name: "Done" });
    await expect(done).toBeInViewport({ ratio: 1 });
    await done.tap();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("puts keyboard focus back on the search button after the sheet", async ({
    page,
  }) => {
    await arrive(page);
    await page.getByRole("button", { name: "Search the deck" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("searchbox")).toBeFocused();

    await page.keyboard.type("redis");
    await page.keyboard.press("Escape");

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Search the deck, filter active" }),
    ).toBeFocused();
  });
});

// An installed iPhone app paints behind a notch inset (59px on a 390x844
// iPhone) far taller than the home-indicator inset (34px). Padding each end by
// its own inset would leave the card low; the shell gives both ends the larger
// one, so the card stays centred and clear of both.
test.describe("installed on a notched phone", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "a phone layout");
  });

  test("keeps the card centred between the notch and the home indicator", async ({
    page,
    context,
  }) => {
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setSafeAreaInsetsOverride", {
      insets: { top: 59, bottom: 34, left: 0, right: 0 },
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await arrive(page);

    const card = page.locator(".concept-card[data-face]");
    await expect(card).toBeVisible();

    const bounds = (await card.boundingBox())!;
    const above = bounds.y;
    const below = 844 - (bounds.y + bounds.height);

    expect(
      Math.abs(above - below),
      `card sits ${above} from the top and ${below} from the bottom`,
    ).toBeLessThanOrEqual(1);

    const title = (await page
      .getByRole("heading", { level: 1 })
      .boundingBox())!;
    const bar = (await page
      .getByRole("navigation", { name: "Card controls" })
      .boundingBox())!;

    expect(title.y).toBeGreaterThanOrEqual(59);
    expect(bar.y + bar.height).toBeLessThanOrEqual(844 - 34);
  });
});
