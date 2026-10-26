import { expect, type Page } from "@playwright/test";

// Every page load now plays the entrance: the loading wheel, then a reel on the
// deck or a fade on the grid, and the deck refuses input while it runs. A test
// that means "open the page" means the page after that, so it arrives here.
export async function arrive(page: Page, path = "/"): Promise<void> {
  await page.goto(path);
  await expect(page.locator('[data-intro="done"]')).toBeVisible({
    timeout: 10_000,
  });
}
