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

// Neighbouring cards stay mounted, so face queries must target the centre.
const front = (page: import("@playwright/test").Page) =>
  card(page).getByTestId("card-front");

const slot = (page: import("@playwright/test").Page, offset: number) =>
  page.locator(`.deck-slot[data-slot="${offset}"]`);

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

test("supports flip keys and looping directional arrow-key navigation", async ({
  page,
}) => {
  await page.goto("/");
  const activeCard = card(page);
  const initialTitle = await activeTitle(page);

  await activeCard.focus();
  await page.keyboard.press("Enter");
  await expect(activeCard).toHaveAttribute("data-face", "back");
  await expect(activeCard).toBeFocused();
  await page.keyboard.press("Space");
  await expect(activeCard).toHaveAttribute("data-face", "front");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByText("09 / 09")).toBeVisible();
  expect(await activeTitle(page)).not.toBe(initialTitle);
  await expect(activeCard).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await expect(page.getByText("01 / 09")).toBeVisible();
  expect(await activeTitle(page)).toBe(initialTitle);
  await expect(page.getByTestId("deck-track")).toHaveAttribute(
    "data-direction",
    "next",
  );
  await expect(
    page.getByRole("button", { name: "Previous card" }),
  ).toBeEnabled();
  await expect(page.getByRole("button", { name: "Next card" })).toBeEnabled();
});

test("navigates the shipped deck infinitely with a live counter", async ({
  page,
}) => {
  await page.goto("/");
  const previous = page.getByRole("button", { name: "Previous card" });
  const next = page.getByRole("button", { name: "Next card" });
  const initialTitle = await activeTitle(page);

  await expect(page.getByText("01 / 09")).toBeVisible();
  await expect(previous).toBeEnabled();
  await expect(next).toBeEnabled();

  const seen = new Set<string>();

  for (let position = 1; position <= images.length; position += 1) {
    await expect(
      page.getByText(`${position.toString().padStart(2, "0")} / 09`),
    ).toBeVisible();
    seen.add(await activeTitle(page));

    if (position < images.length) {
      await next.click();
      await expect(next).toBeFocused();
    }
  }

  expect(seen.size).toBe(images.length);
  await expect(next).toBeEnabled();
  await expect(previous).toBeEnabled();

  await next.click();
  await expect(page.getByText("01 / 09")).toBeVisible();
  expect(await activeTitle(page)).toBe(initialTitle);
  await expect(next).toBeFocused();

  await previous.click();
  await expect(page.getByText("09 / 09")).toBeVisible();
  await expect(previous).toBeFocused();
  await expect(previous).toBeEnabled();
  await expect(next).toBeEnabled();
});

test("centers the stacked header and shows faded adjacent cards", async ({
  page,
}) => {
  await page.goto("/");

  const title = page.getByRole("heading", { name: "DevOps TCG" });
  const counter = page.getByLabel("Card 1 of 9");
  const [titleBounds, counterBounds, viewportWidth] = await Promise.all([
    title.boundingBox(),
    counter.boundingBox(),
    page.evaluate(() => document.documentElement.clientWidth),
  ]);

  expect(titleBounds).not.toBeNull();
  expect(counterBounds).not.toBeNull();
  expect(
    Math.abs(titleBounds!.x + titleBounds!.width / 2 - viewportWidth / 2),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.abs(counterBounds!.x + counterBounds!.width / 2 - viewportWidth / 2),
  ).toBeLessThanOrEqual(1);
  expect(counterBounds!.y).toBeGreaterThanOrEqual(
    titleBounds!.y + titleBounds!.height,
  );

  for (const offset of [-1, 1]) {
    const neighbour = slot(page, offset);
    await expect(neighbour).toHaveCount(1);
    await expect(neighbour.locator(".concept-card")).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    const style = await neighbour.evaluate((node) => ({
      opacity: Number(getComputedStyle(node).opacity),
      events: getComputedStyle(node).pointerEvents,
    }));
    expect(style.opacity).toBeGreaterThan(0);
    expect(style.opacity).toBeLessThan(1);
    expect(style.events).toBe("none");
  }

  const staged = page.locator('.deck-slot[data-slot="2"]');
  await expect(staged).toHaveCount(1);
  expect(
    await staged.evaluate((node) => Number(getComputedStyle(node).opacity)),
  ).toBe(0);
});

test("shows keyboard focus on the card edge, not as a panel around it", async ({
  page,
}) => {
  await page.goto("/");
  const active = card(page);
  await expect(active).toBeVisible(); // The card only exists after hydration.
  await page.keyboard.press("Tab");

  await expect
    .poll(() => active.evaluate((node) => node.matches(":focus-visible")))
    .toBe(true);

  const focus = await active.evaluate((node) => ({
    shadow: getComputedStyle(node).boxShadow,
  }));

  // Keyboard focus must stay visible for accessibility.
  expect(focus.shadow).toContain("rgb(103, 232, 249)");
  // But never as an opaque offset band, which reads as a panel behind the card.
  expect(focus.shadow).not.toContain("rgb(5, 7, 20)");

  const spreads = [...focus.shadow.matchAll(/(\d+)px(?=[,)]|\s*$)/g)].map(
    (match) => Number(match[1]),
  );
  expect(Math.max(...spreads)).toBeLessThanOrEqual(4);
});

test("flips against the page background with nothing bright behind the faces", async ({
  page,
}) => {
  await page.goto("/");
  const active = card(page);
  await expect(active).toBeVisible();

  // Freeze the flip at its midpoint, where both faces are edge-on and whatever
  // sits behind them is fully exposed.
  await active.evaluate((node) => {
    const inner = node.querySelector<HTMLElement>(".concept-card-inner")!;
    inner.style.transition = "none";
    inner.style.transform = "rotateY(90deg)";
  });

  const behind = await page.evaluate(() => {
    const el = document.querySelector(".concept-card[data-face]")!;
    const rect = el.getBoundingClientRect();
    return document
      .elementsFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)
      .map((node) => getComputedStyle(node).backgroundImage)
      .filter((image) => image !== "none");
  });

  // The foil must not be left behind the faces as a bright slab.
  expect(behind.filter((image) => image.includes("conic-gradient"))).toEqual(
    [],
  );
  // What shows through mid-flip is the dark page background itself.
  expect(behind).toHaveLength(1);
  expect(behind[0]).toContain("rgb(5, 7, 20)");

  // The foil edge still belongs to the faces, so it turns away with them.
  const rim = await active
    .locator(".card-face-front")
    .evaluate((node) => getComputedStyle(node).backgroundImage);
  expect(rim).toContain("conic-gradient");
});

test("paints only one card face at a time through the flip", async ({
  page,
}) => {
  await page.goto("/");
  const active = card(page);
  await expect(active).toBeVisible();

  const painted = () =>
    active.evaluate(
      (node) =>
        [...node.querySelectorAll(".card-face-front, .card-face-back")].filter(
          (face) => getComputedStyle(face).visibility === "visible",
        ).length,
    );

  expect(await painted()).toBe(1);

  // Frozen at the half point, where the faces swap. WebKit does not
  // backface-cull a composited scrolling layer, so culling alone left the
  // turned-away face painting its mirrored text over the face in view.
  await active.evaluate((node) => {
    const inner = node.querySelector<HTMLElement>(".concept-card-inner")!;
    inner.style.transition = "none";
    inner.style.transform = "rotateY(90deg)";
  });
  expect(await painted()).toBe(1);

  await active.evaluate((node) => {
    node.querySelector<HTMLElement>(".concept-card-inner")!.style.transform =
      "rotateY(180deg)";
    node.setAttribute("data-face", "back");
  });
  await expect.poll(painted).toBe(1);
  await expect(active.getByTestId("card-back")).toBeVisible();
});

test("scrolls the card faces without drawing a scrollbar over them", async ({
  page,
}) => {
  await page.goto("/");
  const face = front(page);
  await expect(face).toBeVisible();

  await face.evaluate((node) => {
    node.style.height = "120px";
  });

  const gutter = await face.evaluate(
    (node: HTMLElement) => node.offsetWidth - node.clientWidth,
  );

  // Forced to overflow, the face still gives up nothing but its own 2px rim on
  // each side — no gutter for a bar, so none is drawn down either edge.
  expect(gutter).toBeLessThanOrEqual(4);
});

test("never parks a neighbouring card behind the centred card", async ({
  page,
}) => {
  await page.goto("/");

  const centre = await slot(page, 0).boundingBox();
  expect(centre).not.toBeNull();

  for (const offset of [-1, 1]) {
    const neighbour = await slot(page, offset).boundingBox();
    expect(neighbour).not.toBeNull();

    const overlaps =
      neighbour!.x < centre!.x + centre!.width &&
      neighbour!.x + neighbour!.width > centre!.x;
    expect(overlaps, `slot ${offset} sits behind the centred card`).toBe(false);
  }
});

test("flips the centred card with Space after the pointer scrolls it", async ({
  page,
}) => {
  await page.goto("/");
  const active = card(page);

  await active.hover();
  await page.mouse.wheel(0, 200);
  await expect
    .poll(() => page.evaluate(() => document.activeElement?.tagName))
    .toBe("BODY");

  await page.keyboard.press("Space");
  await expect(active).toHaveAttribute("data-face", "back");

  await page.keyboard.press("Enter");
  await expect(active).toHaveAttribute("data-face", "front");
});

test("travels the neighbouring card into the centre without remounting it", async ({
  page,
}) => {
  await page.goto("/");

  const motion = await slot(page, 1).evaluate((node) => ({
    property: getComputedStyle(node).transitionProperty,
    duration: getComputedStyle(node).transitionDuration,
  }));
  expect(motion.property).toContain("transform");
  expect(motion.duration).toContain("0.32s");

  const incoming = await slot(page, 1).elementHandle();
  const outgoing = await slot(page, 0).elementHandle();
  expect(incoming).not.toBeNull();
  expect(outgoing).not.toBeNull();

  await page.getByRole("button", { name: "Next card" }).click();
  const track = page.getByTestId("deck-track");
  await expect(track).toHaveAttribute("data-direction", "next");

  // The very element that was peeking on the right is now the centred card,
  // which is what makes the movement read as travel rather than a swap.
  await expect.poll(() => incoming!.getAttribute("data-slot")).toBe("0");
  expect(await incoming!.evaluate((node) => node.isConnected)).toBe(true);
  expect(await outgoing!.getAttribute("data-slot")).toBe("-1");

  await page.getByRole("button", { name: "Previous card" }).click();
  await expect(track).toHaveAttribute("data-direction", "previous");
  await expect.poll(() => outgoing!.getAttribute("data-slot")).toBe("0");
  expect(await incoming!.getAttribute("data-slot")).toBe("1");
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

test("serves a card-themed tab icon", async ({ page }) => {
  await page.goto("/");

  const href = await page
    .locator('link[rel~="icon"]')
    .first()
    .getAttribute("href");

  expect(href).not.toBeNull();

  const response = await page.request.get(
    new URL(href!, page.url()).toString(),
  );

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");
});

test("keeps the arrows clear of the card at phone widths", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");

  for (const width of [320, 375, 390, 412]) {
    await page.setViewportSize({ width, height: 700 });
    await page.goto("/");
    await expect(card(page)).toBeVisible();

    const centre = await slot(page, 0).boundingBox();
    expect(centre).not.toBeNull();

    for (const name of ["Previous card", "Next card"]) {
      const arrow = await page.getByRole("button", { name }).boundingBox();
      expect(arrow).not.toBeNull();

      const overlaps =
        arrow!.x < centre!.x + centre!.width &&
        arrow!.x + arrow!.width > centre!.x;
      expect(overlaps, `${name} covers the card at ${width}px`).toBe(false);
      expect(arrow!.width).toBeGreaterThanOrEqual(44);
      expect(arrow!.height).toBeGreaterThanOrEqual(44);
    }
  }
});

test("navigates the deck with a touch swipe", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await expect(page.getByText("01 / 09")).toBeVisible();

  const track = page.getByTestId("deck-track");
  const box = await track.boundingBox();
  const midY = box!.y + box!.height / 2;
  const touch = (clientX: number, clientY: number) => ({
    clientX,
    clientY,
    pointerType: "touch",
    isPrimary: true,
    bubbles: true,
  });

  await track.dispatchEvent(
    "pointerdown",
    touch(box!.x + box!.width - 40, midY),
  );
  await track.dispatchEvent("pointerup", touch(box!.x + 40, midY));
  await expect(page.getByText("02 / 09")).toBeVisible();

  await track.dispatchEvent("pointerdown", touch(box!.x + 40, midY));
  await track.dispatchEvent("pointerup", touch(box!.x + box!.width - 40, midY));
  await expect(page.getByText("01 / 09")).toBeVisible();
});

test("trails the finger while a swipe is in progress", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await expect(page.getByText("01 / 09")).toBeVisible();

  const track = page.getByTestId("deck-track");
  const box = await track.boundingBox();
  const midY = box!.y + box!.height / 2;
  const startX = box!.x + box!.width - 40;
  const touch = (clientX: number, clientY: number) => ({
    clientX,
    clientY,
    pointerType: "touch",
    isPrimary: true,
    bubbles: true,
  });

  const translateX = () =>
    track.evaluate((node: HTMLElement) => {
      const { transform } = getComputedStyle(node);
      return transform === "none" ? 0 : new DOMMatrix(transform).m41;
    });

  await track.dispatchEvent("pointerdown", touch(startX, midY));
  await track.dispatchEvent("pointermove", touch(startX - 90, midY));

  await expect(track).toHaveAttribute("data-dragging", "true");
  expect(await translateX()).toBeLessThanOrEqual(-80);
  // The card only commits on release, so the deck has not moved on yet.
  await expect(page.getByText("01 / 09")).toBeVisible();

  await track.dispatchEvent("pointerup", touch(startX - 90, midY));

  await expect(track).not.toHaveAttribute("data-dragging", "true");
  await expect(page.getByText("02 / 09")).toBeVisible();
  await expect.poll(translateX).toBe(0);
});

// A real finger, unlike a synthesised pointer event, is routed by hit testing
// and touch-action: a gesture's touch-action is resolved from the touched
// element only as far as the first scrolling ancestor, so a rule further up the
// tree never reaches a touch that starts on a card face. Playwright has no
// swipe of its own, so the raw Chromium input pipeline drives this one.
const drag = async (
  page: import("@playwright/test").Page,
  from: { x: number; y: number },
  travel: { dx?: number; dy?: number },
) => {
  const { dx = 0, dy = 0 } = travel;
  const cdp = await page.context().newCDPSession(page);
  const send = (
    type: "touchStart" | "touchMove" | "touchEnd",
    progress: number,
  ) =>
    cdp.send("Input.dispatchTouchEvent", {
      type,
      touchPoints:
        type === "touchEnd"
          ? []
          : [{ x: from.x + dx * progress, y: from.y + dy * progress }],
    });

  await send("touchStart", 0);
  for (let step = 1; step <= 6; step += 1) {
    await send("touchMove", step / 6);
  }
  await send("touchEnd", 1);
  await cdp.detach();
};

const cardCentre = async (page: import("@playwright/test").Page) => {
  // Well inside the scrolling face rather than the margin beside it, which is
  // the part of the deck a thumb actually lands on.
  const box = await card(page).boundingBox();
  return { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 };
};

test("swipes with a finger on the card itself", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await expect(page.getByText("01 / 09")).toBeVisible();

  const from = await cardCentre(page);

  await drag(page, from, { dx: -120 });
  await expect(page.getByText("02 / 09")).toBeVisible();

  await drag(page, from, { dx: 120 });
  await expect(page.getByText("01 / 09")).toBeVisible();
});

test("still scrolls the card face under a vertical finger", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await expect(card(page)).toBeVisible();

  const face = front(page);
  const from = await cardCentre(page);

  await drag(page, from, { dy: -160 });

  await expect
    .poll(() => face.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0);
  // Scrolling the face is not a swipe, so the deck stays where it was.
  await expect(page.getByText("01 / 09")).toBeVisible();
});

test("keeps a vertical drag from dragging the deck sideways", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");

  const track = page.getByTestId("deck-track");
  const box = await track.boundingBox();
  const startX = box!.x + box!.width / 2;
  const startY = box!.y + box!.height / 2;
  const touch = (clientX: number, clientY: number) => ({
    clientX,
    clientY,
    pointerType: "touch",
    isPrimary: true,
    bubbles: true,
  });

  await track.dispatchEvent("pointerdown", touch(startX, startY));
  await track.dispatchEvent("pointermove", touch(startX - 30, startY - 120));

  expect(
    await track.evaluate((node: HTMLElement) => node.style.transform),
  ).toBe("translate3d(0px, 0px, 0px)");
  await expect(track).not.toHaveAttribute("data-dragging", "true");
  await expect(page.getByText("01 / 09")).toBeVisible();
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
    viewportWidth: document.documentElement.clientWidth,
    viewportHeight: document.documentElement.clientHeight,
    pageHeight: document.documentElement.scrollHeight,
  }));

  expect(dimensions.pageHeight).toBeLessThanOrEqual(dimensions.viewportHeight);
  const activeCardBounds = await card(page).boundingBox();
  const activeContentBounds = await front(page)
    .locator("h2")
    .locator("../..")
    .boundingBox();
  expect(activeCardBounds).not.toBeNull();
  expect(activeContentBounds).not.toBeNull();

  for (const name of ["Previous card", "Next card"]) {
    const arrow = page.getByRole("button", { name });
    await expect(arrow).toBeInViewport({ ratio: 1 });

    const bounds = await arrow.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);

    if (name === "Previous card") {
      expect(bounds!.x).toBeLessThanOrEqual(16);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
        activeContentBounds!.x,
      );
    } else {
      expect(
        dimensions.viewportWidth - (bounds!.x + bounds!.width),
      ).toBeLessThanOrEqual(16);
      expect(bounds!.x).toBeGreaterThanOrEqual(
        activeContentBounds!.x + activeContentBounds!.width,
      );
    }
  }
  await expect(page.getByRole("button", { name: /show card/i })).toHaveCount(0);
  await expect(
    page.getByText("Click the card or use Enter or Space to flip it."),
  ).toHaveCount(0);
  await expect(page.getByText("Flip for anatomy and flow")).toHaveCount(0);

  const frontLayout = await front(page).evaluate((node) => ({
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

  const activeFront = front(page);
  const frontScroll = await activeFront.evaluate((node) => ({
    overflowY: getComputedStyle(node).overflowY,
    scrollHeight: node.scrollHeight,
    clientHeight: node.clientHeight,
  }));
  expect(frontScroll.overflowY).toBe("auto");
  expect(frontScroll.scrollHeight).toBeGreaterThan(frontScroll.clientHeight);
  await activeFront.evaluate((node) => {
    node.scrollTop = node.scrollHeight;
  });
  await expect(activeFront.getByText("gateway", { exact: true })).toBeVisible();

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

  // The slot animates two properties, so its duration list has two entries.
  const durations = (node: Element) =>
    getComputedStyle(node)
      .transitionDuration.split(",")
      .map((duration) => duration.trim());

  await expect
    .poll(() => card(page).locator(".concept-card-inner").evaluate(durations))
    .toEqual(["0s"]);

  await page.getByRole("button", { name: "Next card" }).click();
  await expect
    .poll(() => slot(page, 0).evaluate(durations))
    .toEqual(["0s", "0s"]);

  // The faces swap at the flip's half point, which must not survive either.
  await expect
    .poll(() =>
      card(page)
        .locator(".card-face-front")
        .evaluate((node) => getComputedStyle(node).transitionDelay.trim()),
    )
    .toBe("0s");
});
