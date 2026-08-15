# Expanded DevOps Concept Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand DevOps TCG from one to nine accurate, illustrated cards with a live deck counter and verified multi-card navigation.

**Architecture:** Keep `ConceptCardData` and the hardcoded collection as the content boundary. `ConceptDeck` remains the only owner of active-card state and absorbs the existing deck header so it can render a live counter without callbacks or duplicated state. Eight optimized local WebP illustrations complete the data records; no runtime data source or infrastructure changes are introduced.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS 3, Vitest, Testing Library, Playwright, pnpm 9, AI image generation, and `cwebp`.

## Global Constraints

- Work directly on the existing `main` branch; do not create a worktree or feature branch.
- Preserve the existing `ConceptCardData` interface and front/back card structure.
- Keep `conceptCards` hardcoded, local, ordered from `#001` through `#009`, and free of runtime fetches.
- Normalize the requested “TSL” term to TLS; keep SSL and TLS as separate cards.
- Describe SSL as deprecated and never recommend negotiating it in modern deployments.
- Give every new card exactly three components and four sequential “how it works” steps.
- Use unique local WebP illustrations in a neon technical isometric style, with no text, logos, trademarks, people, or copied trading-card artwork.
- Preserve bounded navigation, front-first navigation, keyboard flipping, reduced motion, missing-image fallback, and 320-pixel no-overflow behavior.
- Do not add filtering, search, grid browsing, per-card routes, persistence, APIs, dependencies, or infrastructure changes.
- Use test-driven development: add a focused failing test and observe the expected failure before each production-code change.

---

## File Structure

- Modify `frontend/src/data/conceptCards.test.ts`: enforce the complete nine-card learning and integrity contract.
- Modify `frontend/src/data/conceptCards.ts`: remain the single ordered source of all card content.
- Create eight files under `frontend/public/images/`: store one optimized illustration for each new card.
- Modify `frontend/public/images/ATTRIBUTION.md`: identify the new project-generated assets.
- Modify `frontend/src/components/ConceptDeck.test.tsx`: cover the real multi-card collection and live counter.
- Modify `frontend/src/components/ConceptDeck.tsx`: render the existing deck header from active-index state.
- Modify `frontend/src/components/CardFront.tsx`: make image fallback text concept-specific.
- Modify `frontend/src/app/page.tsx`: remove the duplicated static header.
- Modify `frontend/src/app/page.test.tsx`: expect the nine-card initial experience.
- Modify `frontend/e2e/concept-deck.spec.ts`: verify shipped navigation, counters, and all local images.
- Modify `frontend/README.md`: document the expanded local asset collection.

---

### Task 1: Nine-Card Learning Collection

**Files:**
- Modify: `frontend/src/data/conceptCards.test.ts`
- Modify: `frontend/src/data/conceptCards.ts`

**Interfaces:**
- Consumes: existing `ConceptCardData` from `frontend/src/types/concept.ts`.
- Produces: `conceptCards: readonly ConceptCardData[]` with nine records in approved navigation order.

- [ ] **Step 1: Replace the one-card assertion with failing collection-contract tests**

Keep the Proxy content assertion, then add these tests:

```ts
const expectedCards = [
  ["proxy", "#001", "Proxy", "/images/proxy-thumbnail.webp"],
  ["cdn", "#002", "CDN", "/images/cdn-thumbnail.webp"],
  ["nginx", "#003", "NGINX", "/images/nginx-thumbnail.webp"],
  [
    "reverse-proxy",
    "#004",
    "Reverse Proxy",
    "/images/reverse-proxy-thumbnail.webp",
  ],
  ["osi-model", "#005", "OSI Model", "/images/osi-model-thumbnail.webp"],
  ["dns", "#006", "DNS", "/images/dns-thumbnail.webp"],
  ["ssl", "#007", "SSL", "/images/ssl-thumbnail.webp"],
  ["tls", "#008", "TLS", "/images/tls-thumbnail.webp"],
  ["ssh", "#009", "SSH", "/images/ssh-thumbnail.webp"],
] as const;

it("contains all nine concepts in the approved order", () => {
  expect(conceptCards).toHaveLength(expectedCards.length);
  expect(
    conceptCards.map(({ id, cardNumber, title, image }) => [
      id,
      cardNumber,
      title,
      image.src,
    ]),
  ).toEqual(expectedCards);
});

it("uses unique identifiers, numbers, and local illustrations", () => {
  expect(new Set(conceptCards.map(({ id }) => id)).size).toBe(9);
  expect(new Set(conceptCards.map(({ cardNumber }) => cardNumber)).size).toBe(9);
  expect(new Set(conceptCards.map(({ image }) => image.src)).size).toBe(9);
  expect(conceptCards.every(({ image }) => image.src.startsWith("/images/"))).toBe(true);
});

it("gives every card a complete learning contract", () => {
  for (const card of conceptCards) {
    expect(
      [card.series, card.type, card.title, card.descriptor, card.definition].every(Boolean),
    ).toBe(true);
    expect(card.image.alt).toBeTruthy();
    expect(card.keywords.length).toBeGreaterThan(0);
    expect(card.keywords.every(Boolean)).toBe(true);
    expect(card.components).toHaveLength(3);
    expect(card.components.every(({ name, description }) => name && description)).toBe(true);
    expect(card.howItWorks.map(({ step }) => step)).toEqual([1, 2, 3, 4]);
    expect(card.howItWorks.every(({ description }) => description)).toBe(true);
  }
});

it("distinguishes deprecated SSL from modern TLS", () => {
  const ssl = conceptCards.find(({ id }) => id === "ssl");
  const tls = conceptCards.find(({ id }) => id === "tls");

  expect(ssl?.definition).toMatch(/deprecated/i);
  expect(ssl?.definition).toMatch(/use TLS/i);
  expect(tls?.definition).toMatch(/modern protocol/i);
});
```

- [ ] **Step 2: Run the data test and verify the expected RED state**

Run: `pnpm --dir frontend test -- src/data/conceptCards.test.ts`

Expected: FAIL because the collection has length 1 and the eight approved cards are absent.

- [ ] **Step 3: Add the eight complete card records**

Append the following records after Proxy, preserving this exact metadata and learning direction:

| Card | Series / type / descriptor | Definition | Keywords | Components | Four-step flow |
| --- | --- | --- | --- | --- | --- |
| CDN | `DELIVERY SERIES` / `NETWORK` / `EDGE DELIVERY` | A content delivery network distributes cached content across geographically dispersed edge locations so users can receive it from a nearby server. | edge location; origin; cache; latency; cache hit | Client—requests content; Edge location—serves nearby cached content; Origin server—provides canonical content on a cache miss | Request routes to an edge; edge checks cache; miss fetches from origin; edge caches and returns response |
| NGINX | `WEB SERIES` / `PLATFORM` / `EVENT DRIVEN` | NGINX is a high-performance web server that can also route, proxy, cache, and load-balance HTTP and TCP traffic. | web server; event loop; reverse proxy; load balancing; static files | Configuration—defines listeners and routes; Worker process—handles many connections; Upstream—serves proxied requests | Accept connection; match server/location rules; serve locally or select upstream; return response |
| Reverse Proxy | `NETWORK SERIES` / `NETWORK` / `SERVER SIDE` | A reverse proxy receives client traffic for one or more services, then forwards each request to an appropriate backend. | backend; routing; load balancing; TLS termination; gateway | Client—uses the public endpoint; Reverse proxy—applies policy and chooses a backend; Backend service—processes forwarded work | Client targets proxy; proxy evaluates route/policy; selected backend handles request; response returns through proxy |
| OSI Model | `FOUNDATIONS SERIES` / `NETWORK` / `7 LAYERS` | The OSI model organizes network communication into seven conceptual layers so protocols and responsibilities can be discussed consistently. | seven layers; encapsulation; protocol; packet; frame | Application layers (7–5)—shape user-facing data; Transport layer (4)—manages end-to-end delivery; Network access layers (3–1)—address, frame, and transmit data | Application creates data; layers add control information; physical layer sends bits; receiver removes information in reverse |
| DNS | `NAMING SERIES` / `NETWORK` / `RESOLUTION` | The Domain Name System maps human-readable domain names to records that computers use to locate and communicate with services. | resolver; authoritative; record; cache; nameserver | Stub resolver—starts the lookup; Recursive resolver—queries and caches results; Authoritative nameserver—returns source-of-truth records | Device asks recursive resolver; cached result is used or hierarchy queried; authoritative server returns record; resolver caches and responds |
| SSL | `SECURITY SERIES` / `SECURITY` / `DEPRECATED` | Secure Sockets Layer (SSL) is a deprecated predecessor to TLS; modern systems should disable SSL and use TLS instead. | legacy protocol; certificate; encryption; handshake; deprecated | Legacy client—offers an SSL version; Legacy server—selects legacy parameters; Certificate—binds identity to a public key | Peers negotiate legacy version/cipher; server presents certificate; handshake derives keys; records are encrypted, though this obsolete protocol must be replaced |
| TLS | `SECURITY SERIES` / `SECURITY` / `SECURE TRANSPORT` | Transport Layer Security (TLS) is the modern protocol for authenticating peers and protecting data in transit with encryption and integrity checks. | certificate; handshake; encryption; integrity; session key | Client—initiates negotiation; Server certificate—proves server identity; Session keys—protect application records | ClientHello offers parameters; server selects parameters and presents certificate; peers authenticate and derive keys; encrypted application data flows |
| SSH | `SECURITY SERIES` / `SECURITY` / `REMOTE ACCESS` | Secure Shell (SSH) provides authenticated, encrypted remote login, command execution, and tunneling over an untrusted network. | remote access; host key; public key; port 22; tunnel | SSH client—starts the session; SSH daemon—accepts and manages connections; Credentials—authenticate host and user | Client opens transport connection; peers negotiate and verify server host key; user authenticates; encrypted channel carries commands or tunnels |

Use these exact local images and alt texts:

```ts
{ src: "/images/cdn-thumbnail.webp", alt: "Isometric CDN edge nodes distributing content around a globe" }
{ src: "/images/nginx-thumbnail.webp", alt: "Isometric web server routing requests to application services" }
{ src: "/images/reverse-proxy-thumbnail.webp", alt: "Isometric reverse proxy directing clients to backend servers" }
{ src: "/images/osi-model-thumbnail.webp", alt: "Seven illuminated network layers in an isometric stack" }
{ src: "/images/dns-thumbnail.webp", alt: "Isometric DNS hierarchy resolving a domain to a server" }
{ src: "/images/ssl-thumbnail.webp", alt: "Dim legacy security tunnel beside a deprecated lock" }
{ src: "/images/tls-thumbnail.webp", alt: "Bright encrypted TLS tunnel joining a client and server" }
{ src: "/images/ssh-thumbnail.webp", alt: "Encrypted terminal connection to a remote server" }
```

- [ ] **Step 4: Run data tests and frontend type checking**

Run: `pnpm --dir frontend test -- src/data/conceptCards.test.ts && pnpm --dir frontend typecheck`

Expected: PASS with nine ordered, structurally complete cards and no TypeScript errors.

- [ ] **Step 5: Commit the learning collection**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: add expanded DevOps card content"
```

---

### Task 2: Unique Neon Isometric Illustrations

**Files:**
- Create: `frontend/public/images/cdn-thumbnail.webp`
- Create: `frontend/public/images/nginx-thumbnail.webp`
- Create: `frontend/public/images/reverse-proxy-thumbnail.webp`
- Create: `frontend/public/images/osi-model-thumbnail.webp`
- Create: `frontend/public/images/dns-thumbnail.webp`
- Create: `frontend/public/images/ssl-thumbnail.webp`
- Create: `frontend/public/images/tls-thumbnail.webp`
- Create: `frontend/public/images/ssh-thumbnail.webp`
- Modify: `frontend/public/images/ATTRIBUTION.md`

**Interfaces:**
- Consumes: exact image paths and alternative text from Task 1.
- Produces: eight loadable, optimized static assets used directly by `CardFront`.

- [ ] **Step 1: Verify that the card paths currently have no corresponding assets**

Run:

```bash
for name in cdn nginx reverse-proxy osi-model dns ssl tls ssh; do
  test -f "frontend/public/images/$name-thumbnail.webp" || echo "missing: $name"
done
```

Expected: print all eight `missing:` lines, proving the new asset contract is not yet satisfied.

- [ ] **Step 2: Generate eight individual source illustrations with the imagegen skill**

Create the task-owned scratch directory `/private/tmp/devops-tcg-card-sources/`.
After each imagegen call, copy its returned image to the corresponding exact
source path: `cdn.png`, `nginx.png`, `reverse-proxy.png`, `osi-model.png`,
`dns.png`, `ssl.png`, `tls.png`, or `ssh.png` inside that directory.

Use a shared prompt prefix for visual continuity:

```text
Wide 16:9 collectible educational card illustration, neon technical isometric style, dark navy infrastructure environment, luminous cyan and violet connection paths, crisp readable silhouettes, cinematic depth, one clear central technical metaphor, no text, no letters, no numbers, no logos, no trademarks, no people, no mascots, no border.
```

Add one exact subject suffix per asset:

- CDN: a globe surrounded by distributed edge nodes, with one origin server and multiple nearby delivery paths.
- NGINX: a high-capacity web-server gateway routing many incoming request beams toward static content and upstream services; do not depict the NGINX logo.
- Reverse Proxy: one public gateway receiving many client paths and privately fanning them toward three backend servers.
- OSI Model: seven distinct translucent technical layers stacked vertically, with data descending and ascending through the stack; no layer text or numbers.
- DNS: a branching nameserver hierarchy resolving one domain request into a glowing destination server.
- SSL: an older dim encrypted tunnel with a visibly obsolete, fading lock motif; no warning text or symbols containing letters.
- TLS: a modern bright encrypted tunnel between client and server, with certificate and session-key motifs.
- SSH: a terminal-shaped client connected through an encrypted tunnel to a remote server rack; no terminal text.

Generate each subject as a separate image so every final WebP is an independent illustration, not a crop from a contact sheet.

- [ ] **Step 3: Convert each generated source to the exact WebP path**

Run these exact conversions:

```bash
cwebp -quiet -q 82 -resize 1200 675 /private/tmp/devops-tcg-card-sources/cdn.png -o frontend/public/images/cdn-thumbnail.webp
cwebp -quiet -q 82 -resize 1200 675 /private/tmp/devops-tcg-card-sources/nginx.png -o frontend/public/images/nginx-thumbnail.webp
cwebp -quiet -q 82 -resize 1200 675 /private/tmp/devops-tcg-card-sources/reverse-proxy.png -o frontend/public/images/reverse-proxy-thumbnail.webp
cwebp -quiet -q 82 -resize 1200 675 /private/tmp/devops-tcg-card-sources/osi-model.png -o frontend/public/images/osi-model-thumbnail.webp
cwebp -quiet -q 82 -resize 1200 675 /private/tmp/devops-tcg-card-sources/dns.png -o frontend/public/images/dns-thumbnail.webp
cwebp -quiet -q 82 -resize 1200 675 /private/tmp/devops-tcg-card-sources/ssl.png -o frontend/public/images/ssl-thumbnail.webp
cwebp -quiet -q 82 -resize 1200 675 /private/tmp/devops-tcg-card-sources/tls.png -o frontend/public/images/tls-thumbnail.webp
cwebp -quiet -q 82 -resize 1200 675 /private/tmp/devops-tcg-card-sources/ssh.png -o frontend/public/images/ssh-thumbnail.webp
```

- [ ] **Step 4: Record generated-asset provenance**

Append this exact section to `frontend/public/images/ATTRIBUTION.md`:

```markdown
## Project-generated illustrations

The following illustrations were generated specifically for DevOps TCG with
OpenAI image generation on 2026-08-15 and are stored locally:

- `cdn-thumbnail.webp`
- `nginx-thumbnail.webp`
- `reverse-proxy-thumbnail.webp`
- `osi-model-thumbnail.webp`
- `dns-thumbnail.webp`
- `ssl-thumbnail.webp`
- `tls-thumbnail.webp`
- `ssh-thumbnail.webp`
```

- [ ] **Step 5: Verify dimensions, format, uniqueness, and file-size bounds**

Run:

```bash
file frontend/public/images/*-thumbnail.webp
shasum frontend/public/images/{cdn,nginx,reverse-proxy,osi-model,dns,ssl,tls,ssh}-thumbnail.webp
du -h frontend/public/images/{cdn,nginx,reverse-proxy,osi-model,dns,ssl,tls,ssh}-thumbnail.webp
```

Expected: all files report WebP data, all eight generated assets have different hashes, and each is no larger than 500 KB.

- [ ] **Step 6: Commit the illustration set**

```bash
git add frontend/public/images
git commit -m "feat: add concept card illustrations"
```

---

### Task 3: Live Counter and Real Multi-Card Navigation

**Files:**
- Modify: `frontend/src/components/ConceptDeck.test.tsx`
- Modify: `frontend/src/app/page.test.tsx`
- Modify: `frontend/src/components/ConceptDeck.tsx`
- Modify: `frontend/src/components/CardFront.tsx`
- Modify: `frontend/src/app/page.tsx`

**Interfaces:**
- Consumes: the nine-record `conceptCards` collection from Task 1.
- Produces: `ConceptDeck({ cards }: { cards: readonly ConceptCardData[] })` with a deck header, live `NN / NN` counter, bounded navigation, and concept-specific image fallback.

- [ ] **Step 1: Write failing tests for the initial counter, navigation state, and fallback**

Replace the obsolete one-card navigation expectations and synthetic second card with assertions against the shipped collection:

```tsx
it("renders the first of nine cards with bounded initial navigation", () => {
  render(<ConceptDeck cards={conceptCards} />);

  expect(screen.getByRole("heading", { name: "DevOps TCG" })).toBeInTheDocument();
  expect(screen.getByText("01 / 09")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Proxy card, front shown" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Previous card" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next card" })).toBeEnabled();
});

it("updates the card and live counter in both directions", async () => {
  const user = userEvent.setup();
  render(<ConceptDeck cards={conceptCards} />);

  await user.click(screen.getByRole("button", { name: "Show card back" }));
  await user.click(screen.getByRole("button", { name: "Next card" }));
  expect(screen.getByRole("button", { name: "CDN card, front shown" })).toBeInTheDocument();
  expect(screen.getByText("02 / 09")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Previous card" }));
  expect(screen.getByRole("button", { name: "Proxy card, front shown" })).toBeInTheDocument();
  expect(screen.getByText("01 / 09")).toBeInTheDocument();
});

it("uses the active concept in missing-image fallback text", async () => {
  const user = userEvent.setup();
  render(<ConceptDeck cards={conceptCards} />);
  await user.click(screen.getByRole("button", { name: "Next card" }));

  fireEvent.error(screen.getByRole("img", { name: conceptCards[1].image.alt }));
  expect(screen.getByText("CDN network concept")).toBeInTheDocument();
});

it("disables both directions for an explicit one-card deck", () => {
  render(<ConceptDeck cards={conceptCards.slice(0, 1)} />);
  expect(screen.getByText("01 / 01")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Previous card" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next card" })).toBeDisabled();
});
```

Update `page.test.tsx` to expect `01 / 09` while retaining the identity, Proxy card, and instruction assertions.

- [ ] **Step 2: Run the component tests and verify the expected RED state**

Run: `pnpm --dir frontend test -- src/components/ConceptDeck.test.tsx src/app/page.test.tsx`

Expected: FAIL because the static page header still renders `01 / 01`, `ConceptDeck` has no counter/header, and fallback text is Proxy-specific.

- [ ] **Step 3: Move the existing deck header into `ConceptDeck`**

Add helpers inside `ConceptDeck.tsx`:

```ts
const formatPosition = (position: number) => position.toString().padStart(2, "0");
```

Render the current header markup as the first child of the non-empty deck section and derive the counter from state:

```tsx
<header className="mb-6 flex w-full items-end justify-between border-b border-white/10 pb-4">
  <div>
    <p className="mb-1 text-[0.65rem] font-semibold tracking-[0.28em] text-cyan-200/70">
      CONCEPT STUDY DECK
    </p>
    <h1 className="text-2xl font-black uppercase tracking-[0.12em] text-white sm:text-3xl">
      DevOps TCG
    </h1>
  </div>
  <p
    aria-label={`Card ${activeIndex + 1} of ${cards.length}`}
    aria-live="polite"
    className="pb-1 font-mono text-xs font-semibold tracking-[0.18em] text-slate-300"
  >
    {formatPosition(activeIndex + 1)} / {formatPosition(cards.length)}
  </p>
</header>
```

Keep `ConceptCard` immediately after the header and retain all existing navigation bounds. Remove the matching static header from `page.tsx`.

- [ ] **Step 4: Make the image fallback card-specific**

Replace the hardcoded fallback text in `CardFront.tsx` with:

```tsx
{card.title} {card.type.toLowerCase()} concept
```

- [ ] **Step 5: Run focused tests and refactor only after GREEN**

Run: `pnpm --dir frontend test -- src/components/ConceptDeck.test.tsx src/app/page.test.tsx`

Expected: PASS with the live counter, real collection navigation, front reset, fallback, flip, back content, one-card bound, and empty deck all covered.

- [ ] **Step 6: Run frontend linting and type checking**

Run: `pnpm --dir frontend lint && pnpm --dir frontend typecheck`

Expected: PASS with no warnings or TypeScript errors.

- [ ] **Step 7: Commit the live deck experience**

```bash
git add frontend/src/components/ConceptDeck.tsx frontend/src/components/ConceptDeck.test.tsx frontend/src/components/CardFront.tsx frontend/src/app/page.tsx frontend/src/app/page.test.tsx
git commit -m "feat: add live multi-card deck navigation"
```

---

### Task 4: Shipped-Deck Browser Acceptance and Documentation

**Files:**
- Modify: `frontend/e2e/concept-deck.spec.ts`
- Modify: `frontend/README.md`

**Interfaces:**
- Consumes: the complete nine-card collection, local illustration assets, and stateful `ConceptDeck`.
- Produces: browser-level acceptance coverage and accurate contributor documentation.

- [ ] **Step 1: Update browser tests to describe the shipped multi-card behavior**

Replace the one-card navigation test with:

```ts
test("navigates the shipped deck with a live bounded counter", async ({ page }) => {
  await page.goto("/");
  const previous = page.getByRole("button", { name: "Previous card" });
  const next = page.getByRole("button", { name: "Next card" });

  await expect(page.getByText("01 / 09")).toBeVisible();
  await expect(previous).toBeDisabled();
  await expect(next).toBeEnabled();

  await next.click();
  await expect(page.getByRole("button", { name: "CDN card, front shown" })).toBeVisible();
  await expect(page.getByText("02 / 09")).toBeVisible();

  for (let position = 3; position <= 9; position += 1) await next.click();
  await expect(page.getByRole("button", { name: "SSH card, front shown" })).toBeVisible();
  await expect(page.getByText("09 / 09")).toBeVisible();
  await expect(next).toBeDisabled();
  await expect(previous).toBeEnabled();
});
```

Replace the single-image check with all shipped assets:

```ts
const images = [
  ["Ethernet cables connected to network equipment", "/images/proxy-thumbnail.webp"],
  ["Isometric CDN edge nodes distributing content around a globe", "/images/cdn-thumbnail.webp"],
  ["Isometric web server routing requests to application services", "/images/nginx-thumbnail.webp"],
  ["Isometric reverse proxy directing clients to backend servers", "/images/reverse-proxy-thumbnail.webp"],
  ["Seven illuminated network layers in an isometric stack", "/images/osi-model-thumbnail.webp"],
  ["Isometric DNS hierarchy resolving a domain to a server", "/images/dns-thumbnail.webp"],
  ["Dim legacy security tunnel beside a deprecated lock", "/images/ssl-thumbnail.webp"],
  ["Bright encrypted TLS tunnel joining a client and server", "/images/tls-thumbnail.webp"],
  ["Encrypted terminal connection to a remote server", "/images/ssh-thumbnail.webp"],
] as const;

test("loads a unique local image for every card", async ({ page }) => {
  const externalImages: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "image" && new URL(request.url()).hostname !== "127.0.0.1") {
      externalImages.push(request.url());
    }
  });
  await page.goto("/");

  for (const [index, [alt, src]] of images.entries()) {
    const image = page.getByRole("img", { name: alt });
    await expect(image).toHaveAttribute("src", src);
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
    if (index < images.length - 1) await page.getByRole("button", { name: "Next card" }).click();
  }

  expect(externalImages).toEqual([]);
});
```

Retain flip-both-directions, keyboard flip, 320-pixel overflow, and reduced-motion tests. Update the keyboard test name and navigation assertions for a multi-card deck: Previous is disabled and Next is enabled on Proxy.

Add a mobile text-zoom regression for the longest title:

```ts
test("keeps the Reverse Proxy card readable at 200 percent text zoom", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("/");
  for (let position = 1; position < 4; position += 1) {
    await page.getByRole("button", { name: "Next card" }).click();
  }
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
  });

  await expect(page.getByRole("heading", { name: "Reverse Proxy" })).toBeVisible();
  const size = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(size.content).toBeLessThanOrEqual(size.viewport);
});
```

- [ ] **Step 2: Build and run the browser test to verify the acceptance change**

Run: `pnpm --dir frontend build && pnpm --dir frontend test:e2e`

Expected: PASS across configured desktop and mobile projects. The production
behaviors were introduced test-first in Tasks 1 and 3; this task adds
browser-level acceptance coverage without another production-code change.

- [ ] **Step 3: Update contributor documentation**

In `frontend/README.md`:

- Replace “single Proxy object” implications with a nine-card collection.
- State that production uses the committed local `*-thumbnail.webp` assets listed in `public/images/ATTRIBUTION.md`.
- Keep the existing add-a-card instructions and local-only runtime contract.

- [ ] **Step 4: Run the complete frontend verification suite**

Run:

```bash
pnpm --dir frontend format:check
pnpm --dir frontend lint
pnpm --dir frontend typecheck
pnpm --dir frontend test:coverage
pnpm --dir frontend build
pnpm --dir frontend test:e2e
git diff --check
```

Expected: every command exits 0, all nine cards render from local assets, and no whitespace errors are reported.

- [ ] **Step 5: Commit browser coverage and documentation**

```bash
git add frontend/e2e/concept-deck.spec.ts frontend/README.md
git commit -m "test: cover expanded concept deck"
```

- [ ] **Step 6: Confirm the final repository state**

Run:

```bash
git status --short --branch
git log -5 --oneline --decorate
```

Expected: clean `main`, ahead of `origin/main`, with the design, plan, content, illustrations, live deck, and acceptance commits visible.
