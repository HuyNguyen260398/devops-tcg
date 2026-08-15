import { expect, test } from "@playwright/test";

test("loads front-first and flips both directions", async ({ page }) => {
  await page.goto("/");
  const card = page.getByRole("button", { name: "Proxy card, front shown" });

  await expect(card).toHaveAttribute("data-face", "front");
  await page.getByRole("button", { name: "Show card back" }).click();
  await expect(
    page.getByRole("button", { name: "Proxy card, back shown" }),
  ).toHaveAttribute("data-face", "back");
  await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "How it works" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show card front" }).click();
  await expect(card).toHaveAttribute("data-face", "front");
});

test("supports keyboard use and one-card navigation", async ({ page }) => {
  await page.goto("/");
  const card = page.getByRole("button", { name: "Proxy card, front shown" });

  await card.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Proxy card, back shown" }),
  ).toBeFocused();
  await page.keyboard.press("Space");
  await expect(card).toHaveAttribute("data-face", "front");
  await expect(
    page.getByRole("button", { name: "Previous card" }),
  ).toBeDisabled();
  await expect(page.getByRole("button", { name: "Next card" })).toBeDisabled();
});

test("uses a local image only", async ({ page }) => {
  const externalImages: string[] = [];
  page.on("request", (request) => {
    if (
      request.resourceType() === "image" &&
      new URL(request.url()).hostname !== "127.0.0.1"
    ) {
      externalImages.push(request.url());
    }
  });

  await page.goto("/");
  const image = page.getByRole("img", {
    name: "Ethernet cables connected to network equipment",
  });

  await expect(image).toHaveAttribute("src", "/images/proxy-thumbnail.webp");
  await expect
    .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
    .toBeGreaterThan(0);
  expect(externalImages).toEqual([]);
});

test("does not overflow at 320 pixels", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");

  const size = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));

  expect(size.content).toBeLessThanOrEqual(size.viewport);
});

test("removes transition for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect
    .poll(() =>
      page
        .locator(".concept-card-inner")
        .evaluate((node) => getComputedStyle(node).transitionDuration),
    )
    .toBe("0s");
});
