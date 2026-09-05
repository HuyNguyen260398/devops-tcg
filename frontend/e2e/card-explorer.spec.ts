import { expect, test } from "@playwright/test";

const tiles = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: /^Open the .+ card$/ });

const wideOnly = (testInfo: import("@playwright/test").TestInfo) =>
  test.skip(testInfo.project.name === "mobile", "grid layout is desktop only");

const phoneOnly = (testInfo: import("@playwright/test").TestInfo) =>
  test.skip(testInfo.project.name !== "mobile", "sheet layout is phone only");

test("opens on a grid of every card", async ({ page }, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  await expect(tiles(page)).toHaveCount(28);
  await expect(page.getByText("28 / 28")).toBeVisible();
});

test("filters the grid on every keystroke", async ({ page }, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");
  await expect(tiles(page)).toHaveCount(28);

  const field = page.getByRole("searchbox", { name: "Search cards" });

  // Verified against the shipped data: "kaf" and "kafka" both reach exactly one
  // card, so this asserts narrowing without pinning a count that a new card
  // could quietly change.
  await field.pressSequentially("kaf");
  await expect(tiles(page)).toHaveCount(1);

  await field.pressSequentially("ka");
  await expect(tiles(page)).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Open the Kafka card" }),
  ).toBeVisible();
  await expect(page.getByText("1 / 28")).toBeVisible();

  await field.fill("");
  await expect(tiles(page)).toHaveCount(28);
});

test("finds a card by its category and by a keyword", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  const field = page.getByRole("searchbox", { name: "Search cards" });

  // "caching" is a keyword on the Proxy card and appears in no title, type or
  // definition, so this only passes if keywords are searched.
  await field.fill("caching");
  await expect(tiles(page)).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Open the Proxy card" }),
  ).toBeVisible();

  await field.fill("");
  await page.getByRole("button", { name: "COMPUTE" }).click();
  await expect(tiles(page)).toHaveCount(4);
});

test("deals every tile the same height, whatever the filter", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");
  await expect(tiles(page)).toHaveCount(28);

  const heights = () =>
    page.$$eval("button[aria-label^='Open the']", (els) => [
      ...new Set(
        els.map((el) => Math.round(el.getBoundingClientRect().height)),
      ),
    ]);

  // One height across the whole deck: no title wraps its tile taller than its
  // neighbour's.
  expect(await heights()).toHaveLength(1);
  const [unfiltered] = await heights();

  // And the same height when a filter leaves too few rows to fill the grid,
  // which is what used to stretch them.
  for (const query of ["aws", "redis", "terraform state"]) {
    await page.getByRole("searchbox", { name: "Search cards" }).fill(query);
    await expect(tiles(page)).not.toHaveCount(28);
    expect(await heights()).toEqual([unfiltered]);
  }
});

test("offers a way back when nothing matches", async ({ page }, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  await page.getByRole("searchbox", { name: "Search cards" }).fill("zzzzz");

  await expect(page.getByRole("status")).toContainText("No cards match");

  await page.getByRole("button", { name: "Clear the filters" }).click();

  await expect(tiles(page)).toHaveCount(28);
});

test("opens a tile as a flippable card and returns focus on Escape", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  const tile = page.getByRole("button", { name: "Open the Kafka card" });

  await tile.click();

  const dialog = page.getByRole("dialog", { name: "Kafka card" });

  await expect(dialog).toBeVisible();
  await dialog.locator(".concept-card[data-face]").click();
  await expect(dialog.locator(".concept-card[data-face]")).toHaveAttribute(
    "data-face",
    "back",
  );

  await page.keyboard.press("Escape");

  await expect(dialog).toHaveCount(0);
  await expect(tile).toBeFocused();
});

test("walks the filtered results from inside the dialog", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  await page.getByRole("searchbox", { name: "Search cards" }).fill("redis");
  await expect(tiles(page)).toHaveCount(2);

  await page.getByRole("button", { name: "Open the Redis card" }).click();

  const dialog = page.getByRole("dialog", { name: "Redis card" });

  await expect(dialog.getByLabel("Card 1 of 2")).toBeVisible();

  await dialog.getByRole("button", { name: "Next card" }).click();

  await expect(
    page.getByRole("dialog", { name: "Redis Cluster card" }),
  ).toBeVisible();
});

test("switches to the carousel and remembers it across a reload", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");

  await page.getByRole("button", { name: "Show the deck view" }).click();

  await expect(page.locator(".concept-card[data-face]")).toBeVisible();
  await expect(tiles(page)).toHaveCount(0);

  await page.reload();

  await expect(page.locator(".concept-card[data-face]")).toBeVisible();
  await expect(tiles(page)).toHaveCount(0);
});

test("keeps the phone layout on the carousel with a search button", async ({
  page,
}, testInfo) => {
  phoneOnly(testInfo);

  await page.goto("/");

  await expect(page.locator(".concept-card[data-face]")).toBeVisible();
  await expect(tiles(page)).toHaveCount(0);
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Search the deck" }),
  ).toBeVisible();
});

test("filters the deck from the sheet and keeps the filter after Done", async ({
  page,
}, testInfo) => {
  phoneOnly(testInfo);

  await page.goto("/");
  await expect(page.locator(".concept-card[data-face]")).toBeVisible();

  await page.getByRole("button", { name: "Search the deck" }).click();

  const field = page.getByRole("searchbox", { name: "Search cards" });

  await field.pressSequentially("redis");
  await expect(page.getByText("2 / 28")).toBeVisible();

  await page.getByRole("button", { name: "Done" }).click();

  await expect(page.getByRole("dialog")).toHaveCount(0);
  // The deck prints no counter, so the filtered pair shows as the card it deals.
  await expect(page.locator(".concept-card[data-face]")).toHaveAttribute(
    "aria-label",
    /^Redis( Cluster)? card, front shown$/,
  );
  await expect(
    page.getByRole("button", { name: "Search the deck, filter active" }),
  ).toBeVisible();
});

test("takes a typed space rather than flipping the card behind", async ({
  page,
}, testInfo) => {
  phoneOnly(testInfo);

  await page.goto("/");
  await expect(page.locator(".concept-card[data-face]")).toBeVisible();

  await page.getByRole("button", { name: "Search the deck" }).click();

  const field = page.getByRole("searchbox", { name: "Search cards" });

  await field.pressSequentially("reverse proxy");

  await expect(field).toHaveValue("reverse proxy");
  await expect(page.locator(".concept-card[data-face]")).toHaveAttribute(
    "data-face",
    "front",
  );
});

test("keeps the document free of horizontal overflow while searching", async ({
  page,
}, testInfo) => {
  phoneOnly(testInfo);

  await page.goto("/");

  await page.getByRole("button", { name: "Search the deck" }).click();
  await page.getByRole("searchbox", { name: "Search cards" }).fill("a");

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );

  expect(overflow).toBeLessThanOrEqual(0);
});

test("scrolls the grid inside the shell rather than scrolling the page", async ({
  page,
}, testInfo) => {
  wideOnly(testInfo);

  await page.goto("/");
  await expect(tiles(page)).toHaveCount(28);

  const documentOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight,
  );

  expect(documentOverflow).toBeLessThanOrEqual(0);

  const gridScrolls = await page
    .locator(".card-grid")
    .evaluate((grid) => grid.scrollHeight > grid.clientHeight);

  expect(gridScrolls).toBe(true);
});
