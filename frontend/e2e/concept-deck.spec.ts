import { expect, test } from "@playwright/test";

const images = [
  [
    "Ethernet cables connected to network equipment",
    "/images/proxy-thumbnail.webp",
  ],
  [
    "Isometric CDN edge nodes distributing content around a globe",
    "/images/cdn-thumbnail.webp",
  ],
  [
    "Isometric web server routing requests to application services",
    "/images/nginx-thumbnail.webp",
  ],
  [
    "Isometric reverse proxy directing clients to backend servers",
    "/images/reverse-proxy-thumbnail.webp",
  ],
  [
    "Seven illuminated network layers in an isometric stack",
    "/images/osi-model-thumbnail.webp",
  ],
  [
    "Isometric DNS hierarchy resolving a domain to a server",
    "/images/dns-thumbnail.webp",
  ],
  [
    "Dim legacy security tunnel beside a deprecated lock",
    "/images/ssl-thumbnail.webp",
  ],
  [
    "Bright encrypted TLS tunnel joining a client and server",
    "/images/tls-thumbnail.webp",
  ],
  [
    "Encrypted terminal connection to a remote server",
    "/images/ssh-thumbnail.webp",
  ],
] as const;

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

test("supports keyboard use and first-card navigation", async ({ page }) => {
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
  await expect(page.getByRole("button", { name: "Next card" })).toBeEnabled();
});

test("navigates the shipped deck with a live bounded counter", async ({
  page,
}) => {
  await page.goto("/");
  const previous = page.getByRole("button", { name: "Previous card" });
  const next = page.getByRole("button", { name: "Next card" });

  await expect(page.getByText("01 / 09")).toBeVisible();
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();

  await next.click();
  await expect(
    page.getByRole("button", { name: "CDN card, front shown" }),
  ).toBeVisible();
  await expect(page.getByText("02 / 09")).toBeVisible();

  for (let position = 3; position <= 9; position += 1) {
    await next.click();
  }

  await expect(
    page.getByRole("button", { name: "SSH card, front shown" }),
  ).toBeVisible();
  await expect(page.getByText("09 / 09")).toBeVisible();
  await expect(next).toBeDisabled();
  await expect(previous).toBeEnabled();
});

test("loads a unique local image for every card", async ({ page }) => {
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

  for (const [index, [alt, src]] of images.entries()) {
    const image = page.getByRole("img", { name: alt });
    await expect(image).toHaveAttribute("src", src);
    await expect
      .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
      .toBeGreaterThan(0);

    if (index < images.length - 1) {
      await page.getByRole("button", { name: "Next card" }).click();
    }
  }

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

test("keeps the Reverse Proxy card readable at 200 percent text zoom", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");

  for (let position = 1; position < 4; position += 1) {
    await page.getByRole("button", { name: "Next card" }).click();
  }
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  await expect(
    page.getByRole("heading", { name: "Reverse Proxy" }),
  ).toBeVisible();
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
