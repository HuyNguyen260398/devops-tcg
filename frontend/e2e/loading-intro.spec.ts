import { expect, test, type Page } from "@playwright/test";

// These read the page before the entrance has finished, so unlike every other
// spec they open it with a bare goto rather than arrive().

const loader = (page: Page) => page.getByTestId("deck-loader");
const settled = (page: Page) =>
  expect(page.locator('[data-intro="done"]')).toBeVisible({ timeout: 10_000 });

test("opens on the wheel, then settles on a front-up card", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");

  await expect(loader(page)).toBeVisible();
  const toolbarTop = await page
    .locator(".deck-toolbar")
    .evaluate((el) => el.getBoundingClientRect().top);

  await expect(page.getByTestId("deck-track")).toHaveAttribute(
    "data-spinning",
    "true",
  );
  await settled(page);

  await expect(page.locator(".concept-card[data-face]")).toHaveAttribute(
    "data-face",
    "front",
  );
  // The bar held its height under the wheel, so the deck arriving moved nothing.
  expect(
    await page
      .locator(".deck-toolbar")
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBe(toolbarTop);
});

test("opens on the wheel, then fades in the full grid", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium");
  await page.goto("/");

  await expect(loader(page)).toBeVisible();
  await settled(page);

  await expect(
    page.getByRole("button", { name: /^Open the .* card$/ }),
  ).toHaveCount(48);
});

test("skips the reel under reduced motion", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator('[data-intro="done"]')).toBeVisible({
    timeout: 2_000,
  });
  await expect(page.getByTestId("deck-track")).not.toHaveAttribute(
    "data-spinning",
  );
});
