import { expect, test } from "@playwright/test";

const toSketch = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "Switch to the sketch theme" });

const toNeon = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: "Switch to the neon theme" });

const card = (page: import("@playwright/test").Page) =>
  page.locator(".concept-card[data-face]");

test.describe("theme switching", () => {
  test("starts on neon and switches to sketch", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "neon");

    await toSketch(page).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "sketch");
    await expect(toNeon(page)).toBeVisible();
  });

  test("switches back to neon", async ({ page }) => {
    await page.goto("/");
    await toSketch(page).click();
    await toNeon(page).click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "neon");
    await expect(toSketch(page)).toBeVisible();
  });

  test("remembers the theme across a reload without a neon frame", async ({
    page,
  }) => {
    await page.goto("/");
    await toSketch(page).click();
    await page.reload();

    // Asserted before any wait, so a theme applied only at hydration would
    // still be neon here.
    expect(
      await page.evaluate(() => document.documentElement.dataset.theme),
    ).toBe("sketch");
    await expect(toNeon(page)).toBeVisible();
  });

  test("falls back to neon when the stored value is unrecognised", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("devops-tcg-theme", "chartreuse");
    });
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-theme", "neon");
    await expect(toSketch(page)).toBeVisible();
  });

  test("restyles the card surface and swaps in the drawn artwork", async ({
    page,
  }) => {
    await page.goto("/");
    const face = card(page).getByTestId("card-front");
    const photo = face.locator(".card-thumbnail-neon");
    const drawing = face.locator(".card-thumbnail-sketch");

    // Each theme has its own artwork; the photograph is never filtered into
    // standing in for a drawing.
    await expect(photo).toBeVisible();
    await expect(drawing).toBeHidden();
    expect(await photo.getAttribute("src")).toMatch(/-thumbnail\.webp$/);

    await toSketch(page).click();

    await expect(drawing).toBeVisible();
    await expect(photo).toBeHidden();
    expect(await drawing.getAttribute("src")).toMatch(/-sketch\.svg$/);
    await expect(drawing).toHaveCSS("filter", "none");
    await expect(face).toHaveCSS("background-color", "rgb(251, 250, 246)");
  });

  // Regression: the toggle used to keep focus after a click, and the deck hands
  // Space to a focused button, so the next Space re-toggled the theme instead of
  // flipping the card.
  test("leaves Space flipping the card after the toggle is clicked", async ({
    page,
  }) => {
    await page.goto("/");
    await toSketch(page).click();

    await expect(card(page)).toHaveAttribute("data-face", "front");
    await page.keyboard.press(" ");

    await expect(card(page)).toHaveAttribute("data-face", "back");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "sketch");
  });

  test("keeps the flip working under the sketch theme", async ({ page }) => {
    await page.goto("/");
    await toSketch(page).click();

    await expect(card(page)).toHaveAttribute("data-face", "front");
    await card(page).click();
    await expect(card(page)).toHaveAttribute("data-face", "back");
  });

  test("adds no horizontal overflow under the sketch theme", async ({
    page,
  }) => {
    await page.goto("/");
    await toSketch(page).click();

    const overflows = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflows).toBe(false);
  });
});
