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

const card = (page: import("@playwright/test").Page) =>
  page.locator(".concept-card[data-face]");

async function activeTitle(page: import("@playwright/test").Page) {
  const label = await card(page).getAttribute("aria-label");

  if (!label) {
    throw new Error("The active card is missing its accessible label");
  }

  return label.replace(/ card, (?:front|back) shown$/, "");
}

async function navigateToCard(
  page: import("@playwright/test").Page,
  title: string,
) {
  const next = page.getByRole("button", { name: "Next card" });

  for (let position = 1; position <= images.length; position += 1) {
    if ((await activeTitle(page)) === title) return;
    if (await next.isDisabled()) break;
    await next.click();
  }

  throw new Error(`Could not find the ${title} card in the shuffled deck`);
}

test("loads front-first and flips both directions", async ({ page }) => {
  await page.goto("/");
  const activeCard = card(page);
  const title = await activeTitle(page);

  await expect(activeCard).toHaveAttribute("data-face", "front");
  await expect(page.getByRole("button", { name: /show card/i })).toHaveCount(0);
  await activeCard.click();
  await expect(activeCard).toHaveAttribute(
    "aria-label",
    `${title} card, back shown`,
  );
  await expect(activeCard).toHaveAttribute("data-face", "back");
  await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "How it works" }),
  ).toBeVisible();
  await activeCard.click();
  await expect(activeCard).toHaveAttribute("data-face", "front");
});

test("supports keyboard use and first-card navigation", async ({ page }) => {
  await page.goto("/");
  const activeCard = card(page);

  await activeCard.focus();
  await page.keyboard.press("Enter");
  await expect(activeCard).toHaveAttribute("data-face", "back");
  await expect(activeCard).toBeFocused();
  await page.keyboard.press("Space");
  await expect(activeCard).toHaveAttribute("data-face", "front");
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

  const seen = new Set<string>();

  for (let position = 1; position <= images.length; position += 1) {
    await expect(
      page.getByText(`${position.toString().padStart(2, "0")} / 09`),
    ).toBeVisible();
    seen.add(await activeTitle(page));

    if (position < images.length) {
      await next.click();
      if (position === images.length - 1) {
        await expect(previous).toBeFocused();
      } else {
        await expect(next).toBeFocused();
      }
    }
  }

  expect(seen.size).toBe(images.length);
  await expect(next).toBeDisabled();
  await expect(previous).toBeEnabled();

  for (let position: number = images.length; position > 1; position -= 1) {
    await previous.click();
    if (position === 2) {
      await expect(next).toBeFocused();
    } else {
      await expect(previous).toBeFocused();
    }
  }

  await expect(page.getByText("01 / 09")).toBeVisible();
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();
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
  const loadedSources = new Set<string>();

  for (let position = 1; position <= images.length; position += 1) {
    const image = card(page).locator(".card-face-front img");
    const source = await image.getAttribute("src");

    expect(source).not.toBeNull();
    loadedSources.add(source!);
    await expect
      .poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth))
      .toBeGreaterThan(0);

    if (position < images.length) {
      await page.getByRole("button", { name: "Next card" }).click();
    }
  }

  expect([...loadedSources].sort()).toEqual(
    images.map(([, source]) => source).sort(),
  );
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

test("keeps the complete deck navigation inside the viewport", async ({
  page,
}) => {
  await page.goto("/");

  const dimensions = await page.evaluate(() => ({
    viewportHeight: document.documentElement.clientHeight,
    pageHeight: document.documentElement.scrollHeight,
  }));

  expect(dimensions.pageHeight).toBeLessThanOrEqual(dimensions.viewportHeight);
  for (const name of ["Previous card", "Next card"]) {
    const arrow = page.getByRole("button", { name });
    await expect(arrow).toBeInViewport({ ratio: 1 });

    const bounds = await arrow.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  }
  await expect(page.getByRole("button", { name: /show card/i })).toHaveCount(0);
  await expect(
    page.getByText("Click the card or use Enter or Space to flip it."),
  ).toBeInViewport({ ratio: 1 });

  const front = page.getByTestId("card-front");
  const frontLayout = await front.evaluate((node) => ({
    height: node.clientHeight,
    overflowY: getComputedStyle(node).overflowY,
  }));
  expect(frontLayout.height).toBeGreaterThan(44);
  expect(frontLayout.overflowY).toBe("auto");
});

test("keeps the Reverse Proxy card readable at 200 percent text zoom", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");

  await navigateToCard(page, "Reverse Proxy");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  await expect(
    page.getByRole("heading", { name: "Reverse Proxy" }),
  ).toBeVisible();

  const front = page.getByTestId("card-front");
  const frontScroll = await front.evaluate((node) => ({
    overflowY: getComputedStyle(node).overflowY,
    scrollHeight: node.scrollHeight,
    clientHeight: node.clientHeight,
  }));
  expect(frontScroll.overflowY).toBe("auto");
  expect(frontScroll.scrollHeight).toBeGreaterThan(frontScroll.clientHeight);
  await front.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  await expect(front.getByText("gateway", { exact: true })).toBeVisible();

  await card(page).click();
  const back = page.getByTestId("card-back");
  const backScroll = await back.evaluate((node) => ({
    overflowY: getComputedStyle(node).overflowY,
    scrollHeight: node.scrollHeight,
    clientHeight: node.clientHeight,
  }));
  expect(backScroll.overflowY).toBe("auto");
  expect(backScroll.scrollHeight).toBeGreaterThan(backScroll.clientHeight);
  await back.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  await expect(
    back.getByText("The response returns to the client through the proxy."),
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
