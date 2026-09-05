import { expect, test } from "@playwright/test";

// A wide viewport now opens on the grid, so this suite asks for the carousel
// before the page loads. Seeding the preference rather than clicking the toggle
// keeps every test in the file at one `page.goto("/")`, and it means the
// chromium project still exercises the multi-rank spread that only exists above
// 1110px.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    window.localStorage.setItem("devops-tcg-view", "deck"),
  );
});

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
  [
    "Isometric queue of Lambda invocations blocked by a concurrency wall",
    "/images/lambda-throttle-thumbnail.webp",
  ],
  [
    "Isometric certificate authority signing a certificate that browsers around a globe already trust",
    "/images/public-ca-thumbnail.webp",
  ],
  [
    "Isometric internal certificate authority issuing certificates inside a closed organization boundary",
    "/images/private-ca-thumbnail.webp",
  ],
  [
    "Isometric authorization server signing a token that a service verifies on its own",
    "/images/jwt-thumbnail.webp",
  ],
  [
    "Isometric event source invoking a Lambda function whose execution environments scale out behind it",
    "/images/aws-lambda-thumbnail.webp",
  ],
  [
    "Isometric principal passing a trust gate to assume a role and collect an expiring credential set",
    "/images/aws-iam-role-thumbnail.webp",
  ],
  [
    "Isometric request meeting a policy document whose deny tile stands in front of its allow tile",
    "/images/aws-iam-policy-thumbnail.webp",
  ],
  [
    "Isometric identity provider authenticating a user and handing an application a signed identity card",
    "/images/oidc-thumbnail.webp",
  ],
  [
    "Isometric scene of a producer feeding a topic whose segmented log two consumer groups read from different cells",
    "/images/kafka-thumbnail.webp",
  ],
  [
    "Isometric scene of clients queued at a single command loop that reads a bank of memory cells, with a disk file to one side",
    "/images/redis-thumbnail.webp",
  ],
  [
    "Isometric scene of three people assigned to two role cards, whose listed permissions open a locked resource while a dashed tile beside it stays crossed out",
    "/images/rbac-thumbnail.webp",
  ],
  [
    "Isometric scene of a client holding a slot map beside three shard stacks labelled with slot ranges, one request bouncing off the wrong shard onto the one that owns the slot",
    "/images/redis-cluster-thumbnail.webp",
  ],
  [
    "Isometric scene of read-only image layers stacked under one writable layer, starting a single process inside a namespace frame, with a cgroup ceiling capping how much it may take from the host kernel below",
    "/images/container-thumbnail.webp",
  ],
  [
    "Isometric scene of a configuration document and a cloud of real objects with a locked ledger standing between them, its rows binding each resource address to the object it created, and a plan reading all three",
    "/images/terraform-state-thumbnail.webp",
  ],
  [
    "Isometric scene of two containers standing inside one shared sandbox frame that carries a single network address and a volume beneath it, with a deleted pod crossed out beside the differently named pod created to replace it",
    "/images/kubernetes-pod-thumbnail.webp",
  ],
  [
    "Isometric scene of one monitoring server reaching out to pull samples from three application targets, one of them answered by an exporter beside it, writing labelled series onto the disk under the server while a rule reads them back",
    "/images/prometheus-thumbnail.webp",
  ],
  [
    "Isometric scene of a global monitoring server pulling from two leaf servers below it through a selector box standing on each path, the leaves each holding five rows of series while only two of them arrive in the server above",
    "/images/prometheus-federation-thumbnail.webp",
  ],
  [
    "Isometric scene of three requests whose connections stop dead on the top edge of a load balancer, two rules inside it matching on what each request carried, and two fresh connections leaving its underside for a target group apiece, one of whose targets is crossed out",
    "/images/aws-alb-thumbnail.webp",
  ],
  [
    "Isometric scene of three flows running straight down through a load balancer without stopping, each keeping its own colour from the sealed client above to the sealed target below, pinned by a node where it crosses, with one fixed address plate standing at each end of the balancer",
    "/images/aws-nlb-thumbnail.webp",
  ],
] as const;

const card = (page: import("@playwright/test").Page) =>
  page.locator(".concept-card[data-face]");

// Neighbouring cards stay mounted, so face queries must target the centre.
const front = (page: import("@playwright/test").Page) =>
  card(page).getByTestId("card-front");

// The face is the fixed card; the box inside it is what scrolls.
const scroller = (
  page: import("@playwright/test").Page,
  face: "card-front" | "card-back" = "card-front",
) => card(page).getByTestId(face);

const slot = (page: import("@playwright/test").Page, offset: number) =>
  page.locator(`.deck-slot[data-slot="${offset}"]`);

// The deck no longer prints a counter, so "where the deck is" is the centred
// card's own name, and "the deck settled" is that name arriving or holding.
const settledOn = (page: import("@playwright/test").Page, title: string) =>
  expect.poll(() => activeTitle(page)).toBe(title);

const movedOff = (page: import("@playwright/test").Page, title: string) =>
  expect.poll(() => activeTitle(page)).not.toBe(title);

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
  await movedOff(page, initialTitle);
  await expect(activeCard).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await settledOn(page, initialTitle);
  await expect(page.getByTestId("deck-track")).toHaveAttribute(
    "data-direction",
    "next",
  );
  await expect(
    page.getByRole("button", { name: "Previous card" }),
  ).toBeEnabled();
  await expect(page.getByRole("button", { name: "Next card" })).toBeEnabled();
});

test("navigates the shipped deck infinitely", async ({ page }) => {
  await page.goto("/");
  const previous = page.getByRole("button", { name: "Previous card" });
  const next = page.getByRole("button", { name: "Next card" });

  await expect(card(page)).toBeVisible();
  const initialTitle = await activeTitle(page);

  await expect(previous).toBeEnabled();
  await expect(next).toBeEnabled();

  const seen = new Set<string>();

  for (let position = 1; position <= images.length; position += 1) {
    const title = await activeTitle(page);
    seen.add(title);

    if (position < images.length) {
      await next.click();
      await expect(next).toBeFocused();
      await movedOff(page, title);
    }
  }

  // Every card was reached exactly once, so the walk went the whole way round.
  expect(seen.size).toBe(images.length);
  await expect(next).toBeEnabled();
  await expect(previous).toBeEnabled();

  await next.click();
  await settledOn(page, initialTitle);
  await expect(next).toBeFocused();

  await previous.click();
  await movedOff(page, initialTitle);
  await expect(previous).toBeFocused();
  await expect(previous).toBeEnabled();
  await expect(next).toBeEnabled();
});

test("centers the deck and shows faded adjacent cards", async ({ page }) => {
  await page.goto("/");
  await expect(card(page)).toBeVisible();

  const [cardBounds, viewportWidth] = await Promise.all([
    card(page).boundingBox(),
    page.evaluate(() => document.documentElement.clientWidth),
  ]);

  expect(cardBounds).not.toBeNull();
  expect(
    Math.abs(cardBounds!.x + cardBounds!.width / 2 - viewportWidth / 2),
  ).toBeLessThanOrEqual(1);

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

  // However many ranks this viewport spreads to, the one behind them is
  // mounted unpainted so an arriving card has somewhere to travel in from.
  const staged = page.locator(".deck-slot[data-staged]");
  await expect(staged).toHaveCount(2);
  for (const node of await staged.all()) {
    expect(
      await node.evaluate((slot) => Number(getComputedStyle(slot).opacity)),
    ).toBe(0);
  }
});

test("stacks a centred title above the card on a phone", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");

  await page.goto("/");
  await expect(card(page)).toBeVisible();

  const title = page.getByRole("heading", { name: "DevOps TCG" });
  const [titleBounds, cardBounds, viewportWidth] = await Promise.all([
    title.boundingBox(),
    card(page).boundingBox(),
    page.evaluate(() => document.documentElement.clientWidth),
  ]);

  expect(titleBounds).not.toBeNull();
  expect(cardBounds).not.toBeNull();
  expect(
    Math.abs(titleBounds!.x + titleBounds!.width / 2 - viewportWidth / 2),
  ).toBeLessThanOrEqual(1);
  expect(cardBounds!.y).toBeGreaterThanOrEqual(
    titleBounds!.y + titleBounds!.height,
  );
});

test("spreads the deck across the width it is given", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  const painted = page.locator(".deck-slot:not([data-staged])");
  const viewportWidth = await page.evaluate(
    () => document.documentElement.clientWidth,
  );

  // A phone has room for the centred card and one rank; a desktop fits more,
  // and every rank it mounts has to earn its place on screen.
  await expect(painted).toHaveCount(testInfo.project.name === "mobile" ? 3 : 5);

  for (const node of await painted.all()) {
    const bounds = await node.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeLessThan(viewportWidth);
    expect(bounds!.x + bounds!.width).toBeGreaterThan(0);
  }

  // Each rank sits further out and fades further back than the one inside it.
  const ranks = await page.evaluate(() =>
    [1, 2].map((depth) => {
      const node = document.querySelector<HTMLElement>(
        `.deck-slot[data-slot="${depth}"]:not([data-staged])`,
      );

      return node === null
        ? null
        : {
            left: node.getBoundingClientRect().left,
            opacity: Number(getComputedStyle(node).opacity),
          };
    }),
  );

  expect(ranks[0]).not.toBeNull();

  if (ranks[1] !== null) {
    expect(ranks[1].left).toBeGreaterThan(ranks[0]!.left);
    expect(ranks[1].opacity).toBeLessThan(ranks[0]!.opacity);
    expect(ranks[1].opacity).toBeGreaterThan(0);
  }
});

test("leaves the same gap between every pair of adjacent cards", async ({
  page,
}) => {
  await page.goto("/");

  // Measured off the real layout rather than the geometry: a slot's rect grows
  // with its tilt, so the card's own edges come from its layout width times the
  // scale in its computed matrix, about the centre the rotation leaves alone.
  const edges = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".deck-slot:not([data-staged])")]
      .map((slot) => {
        const rect = slot.getBoundingClientRect();
        const [a, b] = new DOMMatrix(getComputedStyle(slot).transform)
          .toFloat32Array()
          .subarray(0, 2);
        const half = (slot.offsetWidth * Math.hypot(a, b)) / 2;
        const centre = rect.x + rect.width / 2;

        return { left: centre - half, right: centre + half };
      })
      .sort((one, other) => one.left - other.left),
  );

  expect(edges.length).toBeGreaterThanOrEqual(3);

  const gaps = edges
    .slice(1)
    .map((card, index) => card.left - edges[index].right);

  // Every card stands clear of its neighbours, by the same amount each time.
  for (const gap of gaps) {
    expect(gap).toBeGreaterThan(0);
  }

  expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThan(2);
});

test("shows keyboard focus on the card edge, not as a panel around it", async ({
  page,
}) => {
  await page.goto("/");
  const active = card(page);
  await expect(active).toBeVisible(); // The card only exists after hydration.

  // The application header's search and toggles stand between the document
  // start and the card, and how many of them there are depends on the viewport,
  // so this walks the tab order to the card rather than pinning a count.
  for (let stop = 0; stop < 12; stop += 1) {
    await page.keyboard.press("Tab");
    if (await active.evaluate((node) => node.matches(":focus-visible"))) break;
  }

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
  const face = scroller(page);
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

test("keeps the card's own surface still while its content scrolls", async ({
  page,
}) => {
  await page.goto("/");
  const active = card(page);
  await expect(active).toBeVisible();

  const face = active.getByTestId("card-front");

  // Forced to overflow whatever the viewport is, then scrolled to the end.
  await face.evaluate((node) => {
    node.style.height = "160px";
    node.scrollTop = node.scrollHeight;
  });
  expect(await face.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);

  const surface = await face.evaluate((node) => ({
    layers: getComputedStyle(node).backgroundImage,
    overlay: getComputedStyle(node, "::after").content,
  }));

  // Every decoration the card carries — sheen, surface, foil rim — is painted
  // by the face's own background, which stays fixed to the padding box however
  // far the content has been dragged. As an ::after overlay the sheen scrolled
  // with the text and cut its rounded bottom edge across the middle of the
  // card, which is the surface changing colour partway down a long one.
  expect(surface.layers).toContain("linear-gradient(125deg");
  expect(surface.layers).toContain("conic-gradient");
  expect(surface.overlay).toBe("none");
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
    const image = card(page).locator(".card-face-front .card-thumbnail-neon");
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

test("loads a unique local sketch drawing for every card", async ({ page }) => {
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
  await page
    .getByRole("button", { name: "Switch to the sketch theme" })
    .click();
  const loadedSources = new Set<string>();

  for (let position = 1; position <= images.length; position += 1) {
    const drawing = card(page).locator(
      ".card-face-front .card-thumbnail-sketch",
    );
    const source = await drawing.getAttribute("src");

    expect(source).not.toBeNull();
    loadedSources.add(source!);
    await expect(drawing).toBeVisible();
    await expect
      .poll(() =>
        drawing.evaluate((node: HTMLImageElement) => node.naturalWidth),
      )
      .toBeGreaterThan(0);

    if (position < images.length) {
      await page.getByRole("button", { name: "Next card" }).click();
    }
  }

  expect([...loadedSources].sort()).toEqual(
    images
      .map(([, source]) => source.replace("-thumbnail.webp", "-sketch.svg"))
      .sort(),
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
  await expect(card(page)).toBeVisible();
  const start = await activeTitle(page);

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
  await movedOff(page, start);

  await track.dispatchEvent("pointerdown", touch(box!.x + 40, midY));
  await track.dispatchEvent("pointerup", touch(box!.x + box!.width - 40, midY));
  await settledOn(page, start);
});

test("trails the finger while a swipe is in progress", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await expect(card(page)).toBeVisible();
  const start = await activeTitle(page);

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
  expect(await activeTitle(page)).toBe(start);

  await track.dispatchEvent("pointerup", touch(startX - 90, midY));

  await expect(track).not.toHaveAttribute("data-dragging", "true");
  await movedOff(page, start);
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
  await expect(card(page)).toBeVisible();
  const start = await activeTitle(page);

  const from = await cardCentre(page);

  await drag(page, from, { dx: -120 });
  await movedOff(page, start);

  await drag(page, from, { dx: 120 });
  await settledOn(page, start);
});

test("still scrolls the card face under a vertical finger", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await expect(card(page)).toBeVisible();
  const start = await activeTitle(page);

  const face = scroller(page);
  const from = await cardCentre(page);

  await drag(page, from, { dy: -160 });

  await expect
    .poll(() => face.evaluate((node) => node.scrollTop))
    .toBeGreaterThan(0);
  // Scrolling the face is not a swipe, so the deck stays where it was.
  expect(await activeTitle(page)).toBe(start);
});

test("keeps a vertical drag from dragging the deck sideways", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  await expect(card(page)).toBeVisible();
  const start = await activeTitle(page);

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
  expect(await activeTitle(page)).toBe(start);
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

  const frontLayout = await scroller(page).evaluate((node) => ({
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

  const activeFront = scroller(page);
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
  const back = scroller(page, "card-back");
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

// The face is the scroll container, so its own content block has to grow with
// the text: a height-capped one spills past its padding and parks the last line
// on the card's bottom edge.
test("leaves space under the last line when a face scrolls", async ({
  page,
}) => {
  await page.goto("/");
  await navigateToCard(page, "Reverse Proxy");

  const gapAtScrollEnd = async (face: "card-front" | "card-back") => {
    const node = scroller(page, face);
    const overflows = await node.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    );
    expect(overflows).toBe(true);

    return node.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      const lowest = Array.from(element.querySelectorAll("*"))
        .filter((child) => !child.children.length && child.textContent?.trim())
        .reduce(
          (bottom, child) =>
            Math.max(bottom, child.getBoundingClientRect().bottom),
          0,
        );
      return element.getBoundingClientRect().bottom - lowest;
    });
  };

  expect(await gapAtScrollEnd("card-front")).toBeGreaterThan(16);
  await card(page).click();
  expect(await gapAtScrollEnd("card-back")).toBeGreaterThan(16);
});

// Eight to eleven cards fly past a shuffle, so from the top of a twenty-card
// deck the reel can only come to rest on one of these four positions. Direction
// is checked on the track itself rather than here: a backwards reel of the same
// length would land on this very set, 9 through 12, so the position alone
// cannot tell the two apart.
const LANDINGS = ["9", "10", "11", "12"];

const landedAt = (page: import("@playwright/test").Page) =>
  page.getByTestId("deck-track").getAttribute("data-position");

test("shuffles the deck from a control centred under the cards", async ({
  page,
}) => {
  await page.goto("/");
  const shuffle = page.getByRole("button", { name: "Shuffle" });
  const track = page.getByTestId("deck-track");

  const [cardBounds, shuffleBounds, viewport] = await Promise.all([
    card(page).boundingBox(),
    shuffle.boundingBox(),
    page.evaluate(() => document.documentElement.clientWidth),
  ]);

  expect(cardBounds).not.toBeNull();
  expect(shuffleBounds).not.toBeNull();
  await expect(shuffle).toBeInViewport({ ratio: 1 });
  expect(shuffleBounds!.y).toBeGreaterThanOrEqual(
    cardBounds!.y + cardBounds!.height,
  );
  expect(
    Math.abs(shuffleBounds!.x + shuffleBounds!.width / 2 - viewport / 2),
  ).toBeLessThan(2);
  expect(shuffleBounds!.height).toBeGreaterThanOrEqual(44);

  await shuffle.click();

  // The reel runs, then brakes to a stop on the card it dealt itself.
  await expect(track).toHaveAttribute("data-spinning", "true");
  await expect(track).not.toHaveAttribute("data-spinning", "true");
  expect(LANDINGS).toContain(await landedAt(page));
  await expect(card(page)).toHaveAttribute("data-face", "front");
  await expect(slot(page, 0)).toBeVisible();

  // Nothing of the reel's own timing is left on the track for the next move.
  expect(
    await track.evaluate((node) => [
      node.style.getPropertyValue("--travel"),
      node.style.getPropertyValue("--travel-ease"),
    ]),
  ).toEqual(["", ""]);
});

test("slides the deck leftwards from the card already in hand", async ({
  page,
}) => {
  await page.goto("/");

  const inHand = await slot(page, 0).getAttribute("data-testid");
  expect(inHand).not.toBeNull();

  // The rank a card travels into is the one drawn to the left of centre.
  const [centreBounds, leftRankBounds] = await Promise.all([
    slot(page, 0).boundingBox(),
    slot(page, -1).boundingBox(),
  ]);
  expect(centreBounds).not.toBeNull();
  expect(leftRankBounds!.x).toBeLessThan(centreBounds!.x);

  await page.getByRole("button", { name: "Shuffle" }).click();

  // The reel picks the deck up where it stood rather than cutting away from
  // it: the card in hand is still on stage, travelling out through the left
  // ranks, while the next card of the new order takes the centre. (Which card
  // that is comes from the deal, so it is not the neighbour that stood there.)
  // Both are read in one round trip because the reel takes its next step in
  // 80ms, and by then the card in hand is a rank further out.
  const moved = await page.evaluate((testId) => {
    const travelling = document.querySelector(`[data-testid="${testId}"]`);
    const centre = document.querySelector('.deck-slot[data-slot="0"]');

    return {
      slot: Number(travelling?.getAttribute("data-slot")),
      centre: centre?.getAttribute("data-testid") ?? null,
    };
  }, inHand!);

  expect(moved.slot).toBeLessThan(0);
  expect(moved.centre).not.toBe(inHand);
});

test("ignores a finger on the deck while the reel is running", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  const track = page.getByTestId("deck-track");

  await page.getByRole("button", { name: "Shuffle" }).click();
  await expect(track).toHaveAttribute("data-spinning", "true");

  const box = await track.boundingBox();
  expect(box).not.toBeNull();
  await page.touchscreen.tap(box!.x + 8, box!.y + box!.height / 2);

  // The reel must not trail the finger, and the tap must not turn a card.
  await expect(track).not.toHaveAttribute("data-dragging", "true");
  await expect(track).not.toHaveAttribute("data-spinning", "true");
  await expect(card(page)).toHaveAttribute("data-face", "front");
  expect(LANDINGS).toContain(await landedAt(page));
});

test("lands the shuffle at once for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const track = page.getByTestId("deck-track");
  await page.getByRole("button", { name: "Shuffle" }).click();

  // Same destination, no reel: the counter is already there.
  expect(LANDINGS).toContain(await landedAt(page));
  await expect(track).not.toHaveAttribute("data-spinning", "true");
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
