# Shorter Concept Cards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shorten the copy of every over-long concept card so each can be read at a glance, keeping each card's main concept and core definition, with one task and one commit per card.

**Architecture:** This is a data change only. The shortened copy goes into the existing `ConceptCardData` objects in `frontend/src/data/conceptCards.ts`, and no component changes. A new `reading budget` block in the content-contract test (`conceptCards.test.ts`) sets the limits. Cards join it one commit at a time through a `withinBudget` set, which gives each card task a real red → green cycle. The last task drops the set so every card, including future ones, is held to the budget.

**Tech Stack:** Next.js 14 static export, TypeScript, Vitest (jsdom), Playwright, pnpm 9 on Node 20.

**Spec:** The request of 2026-09-29: "the contents of all cards in our deck are a bit too long… shorten the contents of these cards but still keep the main concept and core definition; each card update must be treated as one task in the plan, with a commit per task done." There is no separate design doc. The decisions that would have gone in one are recorded under **Design decisions** below.

## Design decisions

- **What "too long" means.** The deck grew by accretion. Cards #001–#013 read in 450–830 characters, while #014–#047 run from 1,038 to 5,438 (AWS Transit Gateway), and the later cards spend most of that on edge cases rather than on the concept. The budget below is set from the shape of #001–#013. Those thirteen cards already fit inside it, so they get no task: shortening a 96-character definition further would lose meaning, not length. Reverse Proxy (#004) is also pinned by e2e text and overflow tests, and must not change.
- **The budget** (characters, `String.length`): definition ≤ 200, component name ≤ 40, component description ≤ 130, each how-it-works step ≤ 150, and definition + components + steps ≤ 960 per card. The per-field caps do most of the work. The total catches a card that sits near every cap at once.
- **What is kept.** For each card: the definition's thesis, all three components, and all four steps, same count and same order. Every existing content-contract assertion still passes against the new copy, except 19 assertions across 8 cards. Those pin trivia the shorter card drops on purpose (`8500`, `5 Gbps`, `twenty rules`, `Single Logout`…). Each task lists the exact lines it deletes.
- **The copy in this plan is pre-validated.** It was merged into a trial copy of the deck. There, typecheck passed and the full Vitest suite (234 tests) passed with exactly the listed assertions removed. The pinned search results (`kaf`, `kafka`, `redis`, `caching`, `aws` + SECURITY, `terraform state`) came back unchanged. So paste it verbatim.

## Global Constraints

- Only `definition`, `components[].description`, `howItWorks[].description`, and the component `name`s a task explicitly lists may change. Never change `id`, `cardNumber`, `type`, `title`, `image`, `keywords`, `step` numbers, or the number of components (3) or steps (4).
- Paste the copy exactly as written, including its typographic characters (`’`, `“`, `”`, `—`, `…`). If you must change a word, re-run that card's tests and the budget test before committing.
- A definition must not gain the substrings `aws`, `redis`, `kaf` or `caching` unless the card's title already carries them. Search is a plain substring match over title, type, keywords and definition (`src/lib/filterCards.ts`), and `ConceptExplorer.test.tsx` and `card-explorer.spec.ts` pin those result lists.
- Retire only the assertions a task names. Never loosen or delete any other assertion to make a card pass.
- Keep every `#NNN` cross-reference exactly as the copy gives it.
- One commit per task, conventional-commit style, directly on `main`. Do not push: pushing `main` deploys to production.
- No dependency, component, style, or e2e change. The frontend ships only `next`, `react`, and `react-dom`.
- Run frontend commands from the repo root with `pnpm --dir frontend …`.

## Review Focus

1. **Search reach shifts with definitions.** Every definition is part of the search haystack, so a shorter one can drop a card from a result. Kubernetes Cluster stops matching `aws` because the word "draws" is gone; that is intended and asserted nowhere. Guarded in every task by Step "Run the card's tests and the search tests", which runs `ConceptExplorer.test.tsx` and `filterCards.test.ts`, and in Task 35 by the e2e suite.
2. **The mobile vertical-scroll e2e test needs the first card's front to overflow at 320×700.** Which card that is depends on the random shuffle. No shortened definition is shorter than Proxy's 96 characters, which already passes, and the artwork window dominates the front's height. Verified in Task 35 by the e2e run.
3. **Reverse Proxy's e2e text and overflow tests.** Both faces must still overflow and quote exact strings. #004 is out of scope and must stay untouched. Verified in Task 35 by the e2e run.
4. **Cross-references still land.** Copy like "#044" or "(#024)" must name a card that exists. Task 35 adds a test that every `#NNN` in a definition, component or step is some card's `cardNumber`.
5. **Compressed sentences must stay true.** No test can catch a shortened sentence that became wrong. The reviewer should read each card's new copy against the old copy once (`git show HEAD~1:frontend/src/data/conceptCards.ts`) and check that each surviving claim still holds.

---

### Task 1: Shorten #014 AWS Lambda (and add the reading budget) ✅

Reading length 1038 → 821 characters (definition 175 → 154).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-lambda"`
- Test: `frontend/src/data/conceptCards.test.ts` — new `reading budget` block

**Interfaces:**
- Consumes: nothing.
- Produces: `BUDGET`, `withinBudget` and `readingLength` in `conceptCards.test.ts`. Every later task adds one id to `withinBudget`, and Task 35 removes the set.

- [ ] **Step 1: Add the reading budget and hold the thirteen cards already inside it**

In `frontend/src/data/conceptCards.test.ts`, add the type import beneath the existing import:

```ts
import { describe, expect, it } from "vitest";
import type { ConceptCardData } from "@/types/concept";
import { conceptCards } from "./conceptCards";
```

Then add this after the `expectedCards` constant and before `describe("conceptCards", …)`:

```ts
// A face scrolls, but a card is meant to be read at a glance: these are the
// most any one card may ask of its reader. Cards #001–#013 were written inside
// them; the rest join `withinBudget` one commit at a time as they are shortened.
const BUDGET = {
  definition: 200,
  componentName: 40,
  component: 130,
  step: 150,
  total: 960,
} as const;

const withinBudget = new Set<string>([
  "proxy",
  "cdn",
  "nginx",
  "reverse-proxy",
  "osi-model",
  "dns",
  "ssl",
  "tls",
  "ssh",
  "lambda-throttle",
  "public-ca",
  "private-ca",
  "jwt",
  "aws-lambda",
]);

// Everything a reader reads past the title: the definition, the three
// components and the four steps.
const readingLength = (card: ConceptCardData): number =>
  card.definition.length +
  card.components.reduce(
    (sum, { description }) => sum + description.length,
    0,
  ) +
  card.howItWorks.reduce((sum, { description }) => sum + description.length, 0);

describe("reading budget", () => {
  it("names only cards that exist", () => {
    const ids = new Set<string>(conceptCards.map(({ id }) => id));

    expect([...withinBudget].filter((id) => !ids.has(id))).toEqual([]);
  });

  it.each(
    conceptCards
      .filter(({ id }) => withinBudget.has(id))
      .map((card) => [card.cardNumber, card.title, card] as const),
  )("keeps %s %s within the reading budget", (_number, _title, card) => {
    expect(card.definition.length, "definition").toBeLessThanOrEqual(
      BUDGET.definition,
    );
    card.components.forEach(({ name, description }, index) => {
      expect(name.length, `component ${index} name`).toBeLessThanOrEqual(
        BUDGET.componentName,
      );
      expect(description.length, `component ${index}`).toBeLessThanOrEqual(
        BUDGET.component,
      );
    });
    card.howItWorks.forEach(({ description }, index) => {
      expect(description.length, `step ${index + 1}`).toBeLessThanOrEqual(
        BUDGET.step,
      );
    });
    expect(readingLength(card), "total").toBeLessThanOrEqual(BUDGET.total);
  });
});
```

- [ ] **Step 2: Run the budget test and watch AWS Lambda fail**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #014 AWS Lambda within the reading budget` with `step 4: expected 153 to be less than or equal to 150`; the thirteen cards #001–#013 and `names only cards that exist` pass.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-lambda"` (`cardNumber: "#014"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "AWS Lambda runs a function in an execution environment it creates on demand for each event — no server to provision, and you pay only while the code runs.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Event source",
        description:
          "Delivers the event that invokes the function: a direct call, an HTTP request, or a queue, stream, or bucket notification.",
      },
      {
        name: "Function",
        description:
          "The handler plus its runtime and settings: memory, timeout, and environment variables.",
      },
      {
        name: "Execution environment",
        description:
          "The isolated sandbox that runs the handler, kept warm for a while to serve later events.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "An event arrives and Lambda looks for an idle execution environment.",
      },
      {
        step: 2,
        description:
          "With none free, it pays a cold start: provision an environment, load the package, run the init code.",
      },
      {
        step: 3,
        description:
          "The handler runs until it returns or times out, and Lambda bills the duration and memory used.",
      },
      {
        step: 4,
        description:
          "The environment is frozen for reuse, and concurrent events scale out to more environments instead of queueing.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #014 AWS Lambda within the reading budget` and `presents Lambda as event-driven code on managed execution environments`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS Lambda concept card" -m "Reading length 1038 -> 821 characters; the core definition stays and so does every assertion that pins it. Adds the reading budget the rest of the deck is brought under one card at a time." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Shorten #015 AWS IAM Role ✅

Reading length 1110 → 788 characters (definition 212 → 175).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-iam-role"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS IAM Role to the budget**

Append `"aws-iam-role",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-lambda",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #015 AWS IAM Role within the reading budget` with `definition: expected 212 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-iam-role"` (`cardNumber: "#015"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "An IAM role is an identity nobody owns or signs in as: a principal assumes it and receives temporary credentials, so access is borrowed rather than issued as a lasting secret.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Trust policy",
        description:
          "Names who may assume the role — a service, another account, or a federated identity provider.",
      },
      {
        name: "Permissions policies",
        description:
          "Decide what an assumed session may do once it exists.",
      },
      {
        name: "STS",
        description:
          "Mints the session’s temporary access key, secret, and token, stamped with an expiry.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A principal — an EC2 instance, a Lambda function, a user, or another account — calls AssumeRole on the role’s ARN.",
      },
      {
        step: 2,
        description:
          "IAM checks the trust policy first; if it does not name that principal, the call is refused.",
      },
      {
        step: 3,
        description:
          "STS returns temporary credentials that expire, typically after an hour.",
      },
      {
        step: 4,
        description:
          "Requests signed with them are judged against the role’s permissions and stop working when the session ends.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #015 AWS IAM Role within the reading budget` and `presents an IAM role as an identity that is assumed, not owned`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS IAM Role concept card" -m "Reading length 1110 -> 788 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Shorten #016 AWS IAM Policy ✅

Reading length 1066 → 800 characters (definition 166 → 154).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-iam-policy"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS IAM Policy to the budget**

Append `"aws-iam-policy",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-iam-role",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #016 AWS IAM Policy within the reading budget` with `component 1: expected 134 to be less than or equal to 130`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-iam-policy"` (`cardNumber: "#016"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "An IAM policy is a JSON document of statements that allow or deny actions on resources, and AWS evaluates every policy that applies to a request together.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Statement",
        description:
          "The unit AWS evaluates: an Allow or Deny effect, the actions and resources it covers, and an optional condition.",
      },
      {
        name: "Identity and resource policies",
        description:
          "One document format, attached to a user, group, or role — or to the resource itself, which can grant across accounts.",
      },
      {
        name: "Condition",
        description:
          "Keys that narrow when a statement applies, such as the source network, MFA, or a resource tag.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A signed request names a principal, an action, and a resource.",
      },
      {
        step: 2,
        description:
          "AWS gathers every policy in scope: identity, resource, permissions boundary, session, and service control policies.",
      },
      {
        step: 3,
        description:
          "An explicit deny anywhere ends evaluation, and no allow can overrule it.",
      },
      {
        step: 4,
        description:
          "Otherwise the request needs a matching allow, because the default is deny.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #016 AWS IAM Policy within the reading budget` and `presents an IAM policy as a document evaluated deny-first`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS IAM Policy concept card" -m "Reading length 1066 -> 800 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Shorten #017 OIDC ✅

Reading length 1093 → 832 characters (definition 224 → 175).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "oidc"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold OIDC to the budget**

Append `"oidc",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-iam-policy",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #017 OIDC within the reading budget` with `definition: expected 224 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "oidc"` (`cardNumber: "#017"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "OpenID Connect is an identity layer on OAuth 2.0: the provider authenticates the user and returns a signed ID token saying who they are, so the app never handles the password.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Identity provider",
        description:
          "Authenticates the user, issues the ID token, and publishes the keys that verify it.",
      },
      {
        name: "Relying party",
        description:
          "The application that sends the user to the provider and reads the identity from the token.",
      },
      {
        name: "ID token",
        description:
          "A JWT stating who the user is — what OAuth 2.0 alone never says; an access token grants access and is not proof of identity.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The relying party redirects the browser to the provider with the openid scope.",
      },
      {
        step: 2,
        description:
          "The provider authenticates the user, and those credentials never reach the relying party.",
      },
      {
        step: 3,
        description:
          "The browser returns with a short-lived code, which the relying party exchanges for an ID token.",
      },
      {
        step: 4,
        description:
          "The relying party checks the signature, issuer, audience, and expiry before trusting the identity.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #017 OIDC within the reading budget` and `presents OIDC as the identity OAuth 2.0 alone never states`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the OIDC concept card" -m "Reading length 1093 -> 832 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Shorten #018 Kafka ✅

Reading length 1150 → 792 characters (definition 231 → 187).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "kafka"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Kafka to the budget**

Append `"kafka",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"oidc",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #018 Kafka within the reading budget` with `definition: expected 231 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "kafka"` (`cardNumber: "#018"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "Apache Kafka is a distributed event streaming platform: producers append events to partitioned topics that brokers retain on disk, so many consumers can read one stream at their own pace.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Broker cluster",
        description:
          "Stores topics on disk and replicates every partition across brokers, so the stream outlives any one machine.",
      },
      {
        name: "Topic",
        description:
          "A named, append-only log split into partitions; reading an event does not remove it.",
      },
      {
        name: "Producers and consumer groups",
        description:
          "Producers write without knowing who reads; each consumer group tracks its own offset.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A producer sends an event, and its key picks the partition.",
      },
      {
        step: 2,
        description:
          "The broker appends it to that partition’s log and copies it to the follower replicas.",
      },
      {
        step: 3,
        description:
          "Each consumer in a group reads its assigned partitions in order and commits its offset.",
      },
      {
        step: 4,
        description:
          "The event stays until retention expires, so another group — or a rewound one — can read it again.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #018 Kafka within the reading budget` and `presents Kafka as a retained stream many consumers read`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Kafka concept card" -m "Reading length 1150 -> 792 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Shorten #019 Redis ✅

Reading length 1351 → 864 characters (definition 276 → 167).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "redis"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Redis to the budget**

Append `"redis",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"kafka",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #019 Redis within the reading budget` with `definition: expected 276 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "redis"` (`cardNumber: "#019"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "Redis is an in-memory data structure store: typed values live in RAM and are served by a single command loop, so operations take microseconds and durability is opt-in.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Keyspace",
        description:
          "One flat namespace of keys holding typed values — hashes, lists, sets, sorted sets — each able to expire via a TTL.",
      },
      {
        name: "Command loop",
        description:
          "A single thread runs one command at a time, so every command is atomic — and one slow command stalls every client.",
      },
      {
        name: "Persistence and replication",
        description:
          "RDB snapshots, the AOF log, and replicas copy the data, but memory stays the source of truth.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A client sends a command naming a key, such as setting a field on a hash.",
      },
      {
        step: 2,
        description:
          "The server runs it to completion against memory, so no client sees a half-finished change.",
      },
      {
        step: 3,
        description:
          "The reply returns in microseconds, and the write goes on to replicas and, if enabled, the AOF.",
      },
      {
        step: 4,
        description:
          "The key lives until deleted, expired, or evicted under maxmemory — and without persistence a restart comes back empty.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #019 Redis within the reading budget` and `presents Redis as memory first, with durability an opt-in`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Redis concept card" -m "Reading length 1351 -> 864 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Shorten #020 RBAC ✅

Reading length 1513 → 835 characters (definition 280 → 177).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "rbac"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold RBAC to the budget**

Append `"rbac",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"redis",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #020 RBAC within the reading budget` with `definition: expected 280 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "rbac"` (`cardNumber: "#020"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "Role-based access control grants permissions to roles rather than to people, then assigns roles to subjects — so a job change is a new assignment, not an edited permission list.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Subject",
        description:
          "A user, group, or service account. It holds role assignments and never permissions of its own.",
      },
      {
        name: "Role",
        description:
          "A named bundle of permissions for a job, not a person; cutting roles too fine leads to role explosion.",
      },
      {
        name: "Permission",
        description:
          "One operation on one resource, only ever granted through a role.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Permissions are grouped into roles named after the jobs people actually do.",
      },
      {
        step: 2,
        description:
          "An administrator assigns roles to a subject, and that assignment is the whole grant.",
      },
      {
        step: 3,
        description:
          "A request is allowed if the union of the subject’s roles covers it. RBAC is additive: there is no deny rule to write.",
      },
      {
        step: 4,
        description:
          "Editing a role updates every holder at once. Rules that depend on the request, such as who owns a record, need attributes.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #020 RBAC within the reading budget` and `presents RBAC as permissions held by roles, never by people`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the RBAC concept card" -m "Reading length 1513 -> 835 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Shorten #021 Redis Cluster ✅

Reading length 1935 → 911 characters (definition 318 → 181).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "redis-cluster"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Redis Cluster to the budget**

Append `"redis-cluster",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"rbac",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #021 Redis Cluster within the reading budget` with `definition: expected 318 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "redis-cluster"` (`cardNumber: "#021"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "Redis Cluster shards one keyspace across many primaries by hashing each key into one of 16384 slots, and clients are redirected to a slot’s owner rather than routed through a proxy.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Hash slot map",
        description:
          "A key’s slot is CRC16 of the key, or of its {…} hash tag, which forces related keys into the same slot.",
      },
      {
        name: "Shard",
        description:
          "A primary and its replicas own a range of slots; when a majority of primaries agree one failed, a replica is promoted.",
      },
      {
        name: "Cluster-aware client",
        description:
          "Caches the slot map and follows MOVED and ASK redirects itself, so the cluster needs no proxy in front of it.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The client hashes the key to a slot and looks up its owner in its cached map.",
      },
      {
        step: 2,
        description:
          "It sends the command straight to that owner; a node that does not own the slot will not run it.",
      },
      {
        step: 3,
        description:
          "If the slot moved, the node replies MOVED and the client refreshes its map; mid-resharding, ASK redirects one key.",
      },
      {
        step: 4,
        description:
          "A multi-key command whose keys hash to different slots is refused with CROSSSLOT — a hash tag keeps them together.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #021 Redis Cluster within the reading budget` and `presents Redis Cluster as slots routed to owners, not a proxy`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Redis Cluster concept card" -m "Reading length 1935 -> 911 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Shorten #022 Container ✅

Reading length 2314 → 877 characters (definition 383 → 166).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "container"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Container to the budget**

Append `"container",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"redis-cluster",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #022 Container within the reading budget` with `definition: expected 383 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "container"` (`cardNumber: "#022"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A container is an ordinary process on the host’s kernel with its own view of the machine and a cap on what it may consume — lighter than a VM, and a thinner boundary.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Image",
        description:
          "Read-only layers plus a start command. A digest names the same bytes everywhere; a tag can move.",
      },
      {
        name: "Namespaces",
        description:
          "What the process may see: its own mounts, processes, network, and users. --net=host hands the host’s network back.",
      },
      {
        name: "cgroups",
        description:
          "What the process may consume: CPU, memory, PIDs. Too much CPU slows it; too much memory gets it killed.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A build file produces the image, one layer per instruction.",
      },
      {
        step: 2,
        description:
          "The runtime pulls missing layers and adds a writable layer on top; writes are copy-on-write, so the image is untouched.",
      },
      {
        step: 3,
        description:
          "The kernel creates fresh namespaces and a cgroup and starts the command — no boot and no second kernel.",
      },
      {
        step: 4,
        description:
          "The container lives as long as PID 1. When it exits the writable layer goes too, so lasting data belongs in a volume.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #022 Container within the reading budget` and `separates what a container may see from what it may consume`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Container concept card" -m "Reading length 2314 -> 877 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Shorten #023 Terraform State ✅

Reading length 2840 → 906 characters (definition 382 → 175).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "terraform-state"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Terraform State to the budget**

Append `"terraform-state",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"container",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #023 Terraform State within the reading budget` with `definition: expected 382 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "terraform-state"` (`cardNumber: "#023"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "Terraform state binds each resource address in your configuration to the real object it created, making every plan a three-way comparison: code, last-known state, and reality.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "State file",
        description:
          "Maps each address to a real resource ID. Lose it and Terraform will create everything again. It holds secrets, so encrypt it.",
      },
      {
        name: "Backend",
        description:
          "Where state lives. The default is local — fine alone, fatal for a team — so teams share a remote backend.",
      },
      {
        name: "Lock",
        description:
          "Stops two applies writing state at once. Use force-unlock only when you are sure the other run has ended.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Refresh asks the provider what each object looks like now; the gap from state is drift.",
      },
      {
        step: 2,
        description:
          "The plan creates, updates, or destroys each resource — so deleting a block means destroy.",
      },
      {
        step: 3,
        description:
          "Apply takes the lock and writes state after each resource; fix a failed apply with another apply, never a hand-edit.",
      },
      {
        step: 4,
        description:
          "Renaming a block needs a moved block, and outside resources must be imported — both edit only the state.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #023 Terraform State within the reading budget` and `makes state the third input a plan compares, not a cache`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Terraform State concept card" -m "Reading length 2840 -> 906 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Shorten #024 Kubernetes Pod

Reading length 2942 → 925 characters (definition 333 → 173).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "kubernetes-pod"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Kubernetes Pod to the budget**

Append `"kubernetes-pod",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"terraform-state",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #024 Kubernetes Pod within the reading budget` with `definition: expected 333 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "kubernetes-pod"` (`cardNumber: "#024"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A pod is the smallest unit Kubernetes schedules: one or more containers on one node in a shared sandbox, with one IP and shared volumes. It is never repaired, only replaced.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Shared sandbox",
        description:
          "Containers share one network namespace and IP and reach each other on localhost, so a port is claimed pod-wide.",
      },
      {
        name: "Containers",
        description:
          "Init containers run to completion first; the pod is Ready only when every other container is.",
      },
      {
        name: "Requests and limits",
        description:
          "The scheduler places pods by request, not usage. Ask for more than any node has and the pod stays Pending.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The scheduler picks one node. The pod is never rescheduled; a crowded node deletes pods rather than moving them.",
      },
      {
        step: 2,
        description:
          "The kubelet builds the sandbox and its IP first, then starts the containers; a crashed container restarts in place.",
      },
      {
        step: 3,
        description:
          "A failing liveness probe restarts the container; a failing readiness probe removes the pod from its Service.",
      },
      {
        step: 4,
        description:
          "A deleted pod is replaced by a new one with a new name and IP. Keep data in a volume and address a Service.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #024 Kubernetes Pod within the reading budget` and `presents a pod as one shared sandbox that is replaced, never repaired`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Kubernetes Pod concept card" -m "Reading length 2942 -> 925 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Shorten #025 Prometheus

Reading length 3133 → 859 characters (definition 396 → 159).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "prometheus"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Prometheus to the budget**

Append `"prometheus",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"kubernetes-pod",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #025 Prometheus within the reading budget` with `definition: expected 396 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "prometheus"` (`cardNumber: "#025"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "Prometheus is a monitoring server that pulls: it scrapes metrics from targets on a schedule and stores each as a labelled time series. Nothing is pushed to it.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Target and exporter",
        description:
          "A target exposes its current metrics over HTTP; an exporter does it for software that cannot.",
      },
      {
        name: "Series and labels",
        description:
          "Name plus labels is a series’ identity. Change a label and it is a different series; unbounded labels exhaust memory.",
      },
      {
        name: "Rules and PromQL",
        description:
          "PromQL queries series. Recording rules precompute results; alerting rules hand firing alerts to Alertmanager.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Service discovery builds the target list, and relabelling sets each target’s labels.",
      },
      {
        step: 2,
        description:
          "Every scrape interval it sends one HTTP GET per target; a spike shorter than the interval is never recorded.",
      },
      {
        step: 3,
        description:
          "Samples go to local disk with no clustering or replication, so long history needs remote write.",
      },
      {
        step: 4,
        description:
          "A target that stops answering goes stale and its up metric drops to 0 — alert on that absence.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #025 Prometheus within the reading budget` and `presents Prometheus as a server that pulls and keeps what it scraped`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Prometheus concept card" -m "Reading length 3133 -> 859 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Shorten #026 Prometheus Federation

Reading length 3156 → 922 characters (definition 423 → 160).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "prometheus-federation"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Prometheus Federation to the budget**

Append `"prometheus-federation",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"prometheus",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #026 Prometheus Federation within the reading budget` with `definition: expected 423 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "prometheus-federation"` (`cardNumber: "#026"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "Federation is one Prometheus scraping another: a global server scrapes each leaf’s /federate endpoint and copies a chosen subset of series into its own storage.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Leaf and global server",
        description:
          "Leaves scrape targets; the global scrapes leaves. A leaf does not know the global exists, so losing it costs no detail.",
      },
      {
        name: "The /federate endpoint and match[]",
        description:
          "Returns series matching match[]; an empty selector matches nothing. Too broad and the global takes every leaf’s cardinality.",
      },
      {
        name: "honor_labels and external_labels",
        description:
          "honor_labels keeps the leaf’s own labels, and external_labels tell leaves apart so their series never collide.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Each leaf scrapes its targets, and recording rules pre-aggregate what the global will ask for.",
      },
      {
        step: 2,
        description:
          "The global requests /federate?match[]=… on its own schedule and gets the latest sample of each match.",
      },
      {
        step: 3,
        description:
          "The copy has the global’s resolution, not the leaf’s, so detail between its scrapes stays on the leaf.",
      },
      {
        step: 4,
        description:
          "The global lags by up to one scrape and is still one server; long retention and a global view need remote write.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #026 Prometheus Federation within the reading budget` and `presents federation as one Prometheus scraping another`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Prometheus Federation concept card" -m "Reading length 3156 -> 922 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Shorten #027 AWS ALB

Reading length 3028 → 881 characters (definition 374 → 149).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-alb"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS ALB to the budget**

Append `"aws-alb",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"prometheus-federation",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #027 AWS ALB within the reading budget` with `definition: expected 374 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-alb"` (`cardNumber: "#027"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "An Application Load Balancer works at layer 7: it terminates the client’s connection, reads the HTTP request, and routes it by what the request says.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Listener and its rules",
        description:
          "Rules run in priority order and the first match wins; a default action answers anything unmatched.",
      },
      {
        name: "Target group and its health check",
        description:
          "Holds the targets and health-checks them; with no healthy target left in the target group, clients get a 503.",
      },
      {
        name: "Two connections, not one",
        description:
          "The target sees only the balancer; the caller’s IP travels in X-Forwarded-For, worth trusting only when the balancer set it.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The client connects and TLS is terminated at the listener, so rules can read the plain request.",
      },
      {
        step: 2,
        description:
          "Rules are checked in priority order, and the first match picks the target group.",
      },
      {
        step: 3,
        description:
          "A healthy target is chosen — round robin or least outstanding requests — and X-Forwarded-* headers are added.",
      },
      {
        step: 4,
        description:
          "The response returns the same way. A protocol it cannot parse gives rules nothing to match, and parsing adds latency.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #027 AWS ALB within the reading budget` and `presents the ALB as a balancer that reads the request`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS ALB concept card" -m "Reading length 3028 -> 881 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Shorten #028 AWS NLB

Reading length 3088 → 900 characters (definition 372 → 164).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-nlb"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS NLB to the budget**

Append `"aws-nlb",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-alb",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #028 AWS NLB within the reading budget` with `definition: expected 372 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-nlb"` (`cardNumber: "#028"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A Network Load Balancer works at layer 4: it forwards TCP and UDP flows without reading them, choosing a target from addresses and ports alone, at very low latency.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "A listener is a port",
        description:
          "A protocol and port with no rules: everything goes to one target group, so any content routing happens elsewhere.",
      },
      {
        name: "The flow hash",
        description:
          "Picks a target by hashing the flow’s five-tuple, so stickiness is to a flow, not to a client.",
      },
      {
        name: "Fixed addresses, real client addresses",
        description:
          "One static address per zone, optionally an Elastic IP, and targets see the client’s real source address.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A client connects to a zonal address. Nothing is terminated, so there is no handshake at the balancer.",
      },
      {
        step: 2,
        description:
          "The five-tuple is hashed once to choose a healthy target, and every later packet of the flow follows it.",
      },
      {
        step: 3,
        description:
          "Packets arrive with the client’s address intact. A failing target gets no new flows, and existing ones are drained.",
      },
      {
        step: 4,
        description:
          "No content routing, redirects, or headers — client details reach the app only through the proxy protocol.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #028 AWS NLB within the reading budget` and `presents the NLB as a balancer that never opens the packet`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS NLB concept card" -m "Reading length 3088 -> 900 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: Shorten #029 AWS VPC

Reading length 3758 → 952 characters (definition 295 → 161).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-vpc"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS VPC to the budget**

Append `"aws-vpc",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-nlb",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #029 AWS VPC within the reading budget` with `definition: expected 295 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-vpc"` (`cardNumber: "#029"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A VPC is a private IP range in one region, cut into subnets, one per Availability Zone. Nothing about a subnet makes it public or private — its route table does.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "CIDR block and its subnets",
        description:
          "The range is fixed at creation. Each subnet is a slice of it in one zone, minus five addresses AWS reserves.",
      },
      {
        name: "Route table and what it points at",
        description:
          "The local route cannot be removed, so subnets reach each other. A 0.0.0.0/0 row to an internet gateway makes a subnet public.",
      },
      {
        name: "Security group and network ACL",
        description:
          "A security group is stateful and sits on the interface; a network ACL is stateless, sits on the subnet, and needs return rules.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Choose the CIDR, cut subnets, and launch resources; each gets an interface in one subnet.",
      },
      {
        step: 2,
        description:
          "Packets match the subnet’s route table. The local route links every subnet, so private never meant isolated.",
      },
      {
        step: 3,
        description:
          "Outside traffic needs a matching row; without one the packet is dropped for lack of a route and shows up as a timeout.",
      },
      {
        step: 4,
        description:
          "Then the filters apply: the stateful group lets replies back, the ACL needs rules for them. Other VPCs need peering.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #029 AWS VPC within the reading budget` and `makes the route table, not the subnet, decide what a VPC reaches`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS VPC concept card" -m "Reading length 3758 -> 952 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: Shorten #030 AWS Subnet

Reading length 4347 → 932 characters (definition 385 → 155).
Component names shortened: `Auto-assign public IPv4, and the route beside it` → `Auto-assign public IPv4`; `NAT gateway, egress-only gateway, and VPC endpoints` → `Three ways out of a private subnet`.

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-subnet"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS Subnet to the budget**

Append `"aws-subnet",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-vpc",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #030 AWS Subnet within the reading budget` with `definition: expected 385 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-subnet"` (`cardNumber: "#030"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A subnet has no public or private setting. “Public” means a route to an internet gateway plus public addresses on its interfaces — neither one works alone.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "The association you may never have made",
        description:
          "A subnet never explicitly associated uses the VPC’s main route table, so one row there can make many subnets public.",
      },
      {
        name: "Auto-assign public IPv4",
        description:
          "Grants an address, not reach: the gateway’s one-to-one NAT needs a route too, and an address alone is equally unreachable.",
      },
      {
        name: "Three ways out of a private subnet",
        description:
          "A NAT gateway (which stands in a public subnet), an egress-only gateway for IPv6, or a VPC endpoint.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A new subnet is just an address range in one zone, using its own route table or the main one.",
      },
      {
        step: 2,
        description:
          "Public needs a 0.0.0.0/0 row to an internet gateway plus a public address, which the instance’s config never mentions.",
      },
      {
        step: 3,
        description:
          "Private with egress routes to a NAT gateway; one per zone avoids cross-zone charges and zonal outages.",
      },
      {
        step: 4,
        description:
          "An interface endpoint works with no route at all. IPv6 addresses are always routable, so an egress-only gateway holds them in.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #030 AWS Subnet within the reading budget` and `makes a subnet public by two separate things, not by a setting`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS Subnet concept card" -m "Reading length 4347 -> 932 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: Shorten #031 AWS CIDR

Reading length 4291 → 868 characters (definition 270 → 152).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-cidr"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS CIDR to the budget**

Append `"aws-cidr",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-subnet",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #031 AWS CIDR within the reading budget` with `definition: expected 270 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-cidr"` (`cardNumber: "#031"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A VPC’s CIDR block is chosen once and cannot be taken back — and AWS reserves five addresses in every subnet, so you get fewer than the prefix suggests.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "What the slash actually fixes",
        description:
          "The prefix counts network bits: a /24 leaves 256 addresses. With five reserved, a /28 holds eleven usable, not sixteen.",
      },
      {
        name: "Nothing here is an edit",
        description:
          "A subnet cannot be resized. Secondary CIDR blocks add room beside the first range, never instead of it.",
      },
      {
        name: "What overlap costs, and when",
        description:
          "VPCs whose ranges overlap cannot peer or share a Transit Gateway route table. Avoid 10.0.0.0/16 — everyone uses it.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Pick a range from /16 to /28. AWS reserves five addresses in every subnet.",
      },
      {
        step: 2,
        description:
          "The primary block is immutable; changing it means building a replacement and migrating to it.",
      },
      {
        step: 3,
        description:
          "The cost arrives later: a refused peering, an unroutable attachment, or an on-premises network on the same range.",
      },
      {
        step: 4,
        description:
          "IPv6 avoids it: AWS assigns a /56 and every subnet is a /64 — a range that was never yours to pick.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #031 AWS CIDR within the reading budget` and `makes the CIDR block the one decision a VPC cannot take back`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS CIDR concept card" -m "Reading length 4291 -> 868 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 19: Shorten #032 AWS Route Table

Reading length 3914 → 916 characters (definition 216 → 141).
Component names shortened: `Longest prefix, and the two places that is not the rule` → `Longest prefix wins, with two exceptions`.

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-route-table"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set, and the `it("makes the route table a lookup rather than a list", () => {` block

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS Route Table to the budget**

Append `"aws-route-table",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-cidr",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #032 AWS Route Table within the reading budget` with `definition: expected 216 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-route-table"` (`cardNumber: "#032"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A route table is not a list read from the top down. It is a lookup where the most specific matching row wins — and some rows you never wrote.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Longest prefix wins, with two exceptions",
        description:
          "The local route wins even when a propagated route is more specific, and on a tie a static route beats a propagated one.",
      },
      {
        name: "The rows you never wrote",
        description:
          "Propagated rows follow somebody else’s BGP. Delete a target and its row turns blackhole, still matching and dropping.",
      },
      {
        name: "Tables that hang off no subnet at all",
        description:
          "A gateway route table sends ingress through inspection first. The local route is undeletable, but a narrower row beats it.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Every row is compared at once and the longest matching prefix wins; console order means nothing.",
      },
      {
        step: 2,
        description:
          "On equal prefixes static beats propagated; among propagated rows, Direct Connect beats VPN, then BGP.",
      },
      {
        step: 3,
        description:
          "A blackhole row drops traffic. It looks like a firewall but is not, so a security group audit will not find it.",
      },
      {
        step: 4,
        description:
          "A Transit Gateway has route tables of its own; a VPC row does not change them, and traffic must satisfy both.",
      },
    ],
```

- [ ] **Step 4: Retire the assertions for detail the card no longer carries**

In the `it("makes the route table a lookup rather than a list", () => {` block of `frontend/src/data/conceptCards.test.ts`:

Delete these assertions — they pin detail the shortened card drops on purpose:

```ts
    expect(table?.components[2]?.description).toMatch(
      /Gateway Load Balancer endpoint/i,
    );
```

- [ ] **Step 5: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #032 AWS Route Table within the reading budget` and `makes the route table a lookup rather than a list`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS Route Table concept card" -m "Reading length 3914 -> 916 characters; the core definition stays, and 1 assertion pinning detail the card no longer carries is retired." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 20: Shorten #033 AWS NAT Gateway

Reading length 3954 → 889 characters (definition 268 → 140).
Component names shortened: `Charged twice, and usually for the wrong traffic` → `Charged twice`; `Not a filter, and not always an internet device` → `Not a filter, not always public`.

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-nat-gateway"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS NAT Gateway to the budget**

Append `"aws-nat-gateway",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-route-table",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #033 AWS NAT Gateway within the reading budget` with `definition: expected 268 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-nat-gateway"` (`cardNumber: "#033"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A NAT gateway is a resource billed by the hour and per gigabyte, and what limits it is not bandwidth but connections to any one destination.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Charged twice",
        description:
          "Hourly plus per gigabyte, even for S3 and DynamoDB traffic — which a free gateway endpoint takes off it entirely.",
      },
      {
        name: "It runs out of ports, not of bandwidth",
        description:
          "About 55,000 connections per unique destination. Exhaustion shows as ErrorPortAllocation; secondary IPs add more.",
      },
      {
        name: "Not a filter, not always public",
        description:
          "You cannot attach a security group — only the subnet’s network ACL. A private NAT gateway joins overlapping networks.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Routed traffic arrives, and each connection’s source is rewritten to the gateway’s address and a port.",
      },
      {
        step: 2,
        description:
          "Replies match the stored pairing and are rewritten back. Nothing inbound can start a connection.",
      },
      {
        step: 3,
        description:
          "Each pairing uses one of 55,000 ports per destination; an idle one expires after 350 seconds and gets an RST.",
      },
      {
        step: 4,
        description:
          "IPv6 uses an egress-only gateway instead. A NAT gateway is never a destination for inbound traffic.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #033 AWS NAT Gateway within the reading budget` and `meters the NAT gateway and caps it by ports rather than bandwidth`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS NAT Gateway concept card" -m "Reading length 3954 -> 889 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 21: Shorten #034 AWS Internet Gateway

Reading length 4663 → 924 characters (definition 264 → 155).
Component names shortened: `The public address is never on the interface` → `The public address isn’t on the instance`; `Nothing to size, nothing to filter, and not free to use` → `Nothing to size or filter`.

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-internet-gateway"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS Internet Gateway to the budget**

Append `"aws-internet-gateway",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-nat-gateway",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #034 AWS Internet Gateway within the reading budget` with `definition: expected 264 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-internet-gateway"` (`cardNumber: "#034"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "An internet gateway filters nothing. It is a VPC attachment doing static one-to-one translation for IPv4, so an instance never sees its own public address.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "The public address isn’t on the instance",
        description:
          "The OS sees only its private address; the public one is in instance metadata. Group references break over public IPs.",
      },
      {
        name: "Nothing to size or filter",
        description:
          "It takes no security group and scales itself, but public IPv4 is billed by the hour and one flow tops out near 5 Gbps.",
      },
      {
        name: "IPv6 crosses it untouched",
        description:
          "IPv6 is not translated, and an egress-only gateway blocks inbound. Rows left after a detach become blackhole routes.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Attach it to the VPC; nothing changes until a route table points at it.",
      },
      {
        step: 2,
        description:
          "The private source is rewritten to the mapped public address. The mapping is static and symmetric, so outsiders can connect in.",
      },
      {
        step: 3,
        description:
          "The public address is auto-assigned, changing on stop, or an Elastic IP you keep; both are billed hourly.",
      },
      {
        step: 4,
        description:
          "It holds no policy and makes nothing public alone. A private subnet reaches out through a NAT gateway that uses it.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #034 AWS Internet Gateway within the reading budget` and `hides the internet gateway's translation from the instance behind it`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS Internet Gateway concept card" -m "Reading length 4663 -> 924 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 22: Shorten #035 AWS Transit Gateway

Reading length 5438 → 949 characters (definition 289 → 156).
Component names shortened: `Two tables, and the second one belongs to the gateway` → `The gateway’s own route tables`; `Segmentation is a count of route tables, not a filter` → `Segmentation by route tables`; `The attachment is an interface in each zone, and it is metered` → `One interface per zone, metered`.

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-transit-gateway"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set, and the `it("makes the transit gateway a router with tables of its own", () => {` block

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS Transit Gateway to the budget**

Append `"aws-transit-gateway",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-internet-gateway",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #035 AWS Transit Gateway within the reading budget` with `definition: expected 289 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-transit-gateway"` (`cardNumber: "#035"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A transit gateway is a regional router that VPCs, VPNs, and Direct Connect attach to. It has its own route tables, so a packet crossing it is matched twice.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "The gateway’s own route tables",
        description:
          "Each attachment is associated with one gateway table, and propagation copies its ranges into others. Both directions need rows.",
      },
      {
        name: "Segmentation by route tables",
        description:
          "It takes no security group; isolation is separate tables. Two VPCs with the same CIDR cannot both be routed across it.",
      },
      {
        name: "One interface per zone, metered",
        description:
          "Name a subnet per Availability Zone or that zone is dropped. Billed hourly and per GB; appliance mode keeps flows symmetric.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Create it and attach VPCs. New attachments land in the default route table, so a simple setup just works.",
      },
      {
        step: 2,
        description:
          "The subnet’s row sends traffic to the attachment, and at the gateway it is matched again against the associated table.",
      },
      {
        step: 3,
        description:
          "The return path is a separate decision needing its own rows in both places; a route to nothing is a blackhole.",
      },
      {
        step: 4,
        description:
          "It does no translation and holds no policy, and peering between gateways is non-transitive.",
      },
    ],
```

- [ ] **Step 4: Retire the assertions for detail the card no longer carries**

In the `it("makes the transit gateway a router with tables of its own", () => {` block of `frontend/src/data/conceptCards.test.ts`:

Delete these assertions — they pin detail the shortened card drops on purpose:

```ts
    expect(transit?.components[0]?.description).toMatch(/no BGP session/i);
    expect(transit?.components[0]?.description).toMatch(/four rows/i);
    expect(transit?.components[1]?.description).toMatch(/longest prefix/i);
    expect(transit?.components[1]?.description).toMatch(/by its id/i);
    expect(transit?.components[2]?.description).toMatch(/per gigabyte/i);
    expect(transit?.components[2]?.description).toMatch(/5 Gbps/);
    expect(transit?.howItWorks[3]?.description).toMatch(/8500/);
```

- [ ] **Step 5: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #035 AWS Transit Gateway within the reading budget` and `makes the transit gateway a router with tables of its own`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS Transit Gateway concept card" -m "Reading length 5438 -> 949 characters; the core definition stays, and 7 assertions pinning detail the card no longer carries are retired." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 23: Shorten #036 AWS Security Group

Reading length 4497 → 871 characters (definition 312 → 141).
Component names shortened: `Attached to an interface, and counted together` → `Unioned on the interface`.

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-security-group"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set, and the `it("makes the security group an allow-only filter on the interface", () => {` block

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS Security Group to the budget**

Append `"aws-security-group",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-transit-gateway",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #036 AWS Security Group within the reading budget` with `definition: expected 312 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-security-group"` (`cardNumber: "#036"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A security group is an allow-only, stateful filter on a network interface. Groups on one interface are unioned, so a rule only widens access.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Unioned on the interface",
        description:
          "Every rule in every attached group forms one union with no order, so narrowing access is always a deletion.",
      },
      {
        name: "Stateful, and what tracking is",
        description:
          "Replies to an allowed flow return automatically. A new group allows all outbound traffic and no inbound.",
      },
      {
        name: "A rule that names a group, not a range",
        description:
          "A source can be a range, a prefix list, or another group. Group references do not resolve across a Transit Gateway.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A new group has no inbound rule and allows all outbound, so nothing unsolicited arrives.",
      },
      {
        step: 2,
        description:
          "Every rule is checked together, with no first match. With no allow the packet is dropped silently: a timeout.",
      },
      {
        step: 3,
        description:
          "Replies return on the group’s memory of the flow. It judges a flow; the subnet’s ACL judges packets.",
      },
      {
        step: 4,
        description:
          "It cannot deny, so blocking one address inside an allowed range belongs on the network ACL — the next card.",
      },
    ],
```

- [ ] **Step 4: Retire the assertions for detail the card no longer carries**

In the `it("makes the security group an allow-only filter on the interface", () => {` block of `frontend/src/data/conceptCards.test.ts`:

Delete these assertions — they pin detail the shortened card drops on purpose:

```ts
    expect(group?.components[1]?.description).toMatch(/untracked/i);
    expect(group?.components[1]?.description).toMatch(/tears down/i);
    expect(group?.components[2]?.description).toMatch(/public source/i);
```

Replace:

```ts
    // Stateful is a memory of flows, and the memory has consequences.
```

with:

```ts
    // Stateful means the reply needs no rule, and a new group admits nothing.
    expect(group?.components[1]?.description).toMatch(/automatically/i);
    expect(group?.components[1]?.description).toMatch(/no inbound/i);
```

Replace:

```ts
    // A rule can name a group, and #034 and #035 are where that stops working.
```

with:

```ts
    // A rule can name a group, and a Transit Gateway is where that stops working.
```

- [ ] **Step 5: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #036 AWS Security Group within the reading budget` and `makes the security group an allow-only filter on the interface`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS Security Group concept card" -m "Reading length 4497 -> 871 characters; the core definition stays, and 3 assertions pinning detail the card no longer carries are retired." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 24: Shorten #037 AWS Network ACL

Reading length 4141 → 805 characters (definition 355 → 155).
Component names shortened: `Numbered, ordered, and finished at the first match` → `Numbered and first-match`.

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-network-acl"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set, and the `it("makes the network ACL the stateless half of the pair", () => {` block

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS Network ACL to the budget**

Append `"aws-network-acl",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-security-group",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #037 AWS Network ACL within the reading budget` with `definition: expected 355 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-network-acl"` (`cardNumber: "#037"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A network ACL is a stateless filter on the subnet: numbered allow and deny rules, judged in each direction separately — so replies need rules of their own.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Numbered and first-match",
        description:
          "Rules 1 to 32766 run in ascending order and the first match wins. A final asterisk rule denies everything else.",
      },
      {
        name: "Stateless, and the rule on the way back",
        description:
          "Replies go to ephemeral ports, so outbound must allow 1024 to 65535 — or the connection times out.",
      },
      {
        name: "The only place a deny can be written",
        description:
          "Security groups have no deny, so blocking a single address happens here, for the whole subnet at once.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A custom ACL denies everything until rules are added; the default ACL allows all.",
      },
      {
        step: 2,
        description:
          "Each packet is checked in rule-number order, and the first match decides.",
      },
      {
        step: 3,
        description:
          "The reply is judged again by the other direction’s rules, with no memory of the request.",
      },
      {
        step: 4,
        description:
          "Traffic within the same subnet never crosses it, and DNS, DHCP, and instance metadata are exempt.",
      },
    ],
```

- [ ] **Step 4: Retire the assertions for detail the card no longer carries**

In the `it("makes the network ACL the stateless half of the pair", () => {` block of `frontend/src/data/conceptCards.test.ts`:

Delete these assertions — they pin detail the shortened card drops on purpose:

```ts
    expect(acl?.components[2]?.description).toMatch(/twenty rules/i);
```

- [ ] **Step 5: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #037 AWS Network ACL within the reading budget` and `makes the network ACL the stateless half of the pair`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS Network ACL concept card" -m "Reading length 4141 -> 805 characters; the core definition stays, and 1 assertion pinning detail the card no longer carries is retired." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 25: Shorten #038 AWS VPC Endpoint

Reading length 4021 → 927 characters (definition 355 → 166).
Component names shortened: `The gateway endpoint is a row, and it is free` → `Gateway endpoint: a free row`; `The interface endpoint is an address, and it is metered` → `Interface endpoint: a metered address`.

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-vpc-endpoint"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS VPC Endpoint to the budget**

Append `"aws-vpc-endpoint",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-network-acl",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #038 AWS VPC Endpoint within the reading budget` with `definition: expected 355 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-vpc-endpoint"` (`cardNumber: "#038"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A VPC endpoint lets a private subnet with no way out reach a service. A gateway endpoint is a row in a route table; an interface endpoint is an address found by name.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Gateway endpoint: a free row",
        description:
          "For S3 and DynamoDB only: a route to a prefix list, no hourly charge. Unreachable from a VPN, a peer, or a Transit Gateway.",
      },
      {
        name: "Interface endpoint: a metered address",
        description:
          "An elastic network interface in your subnets, filtered by a security group and billed hourly and per gigabyte.",
      },
      {
        name: "Private DNS is what makes it invisible",
        description:
          "Private DNS points the service’s usual name at the endpoint, so clients need no change. An endpoint policy narrows access.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The service decides the type: S3 and DynamoDB allow either, and everything else needs an interface endpoint.",
      },
      {
        step: 2,
        description:
          "A gateway endpoint adds a row naming the service’s prefix list to each chosen route table.",
      },
      {
        step: 3,
        description:
          "An interface endpoint is reached because a name resolved to it — no route was involved.",
      },
      {
        step: 4,
        description:
          "It reaches a service, not a network. Until the old route or DNS name stops being used, the NAT gateway is still metering.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #038 AWS VPC Endpoint within the reading budget` and `splits the VPC endpoint into the row and the address`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS VPC Endpoint concept card" -m "Reading length 4021 -> 927 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 26: Shorten #039 TCP

Reading length 4967 → 919 characters (definition 358 → 166).
Component names shortened: `An acknowledgement is a statement about numbers` → `Acknowledgements`.

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "tcp"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set, and the `it("makes the TCP connection an agreement about numbers", () => {` block

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold TCP to the budget**

Append `"tcp",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-vpc-endpoint",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #039 TCP within the reading budget` with `definition: expected 358 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "tcp"` (`cardNumber: "#039"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A TCP connection is not a pipe the network holds open — it is an agreement between two ends about how to number bytes, acknowledge them, and resend what goes missing.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "The handshake agrees the first number",
        description:
          "SYN, SYN-ACK, ACK trade each side’s initial sequence number. The four-tuple names the connection; TIME_WAIT guards reuse.",
      },
      {
        name: "Acknowledgements",
        description:
          "An ACK names the next byte it expects. What arrives is a byte stream: message boundaries are not kept.",
      },
      {
        name: "The window is permission to be ahead",
        description:
          "The sender may run ahead by the smaller of the receive window and its own congestion window.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "After the handshake both ends share starting numbers and a window; the routers know nothing of it.",
      },
      {
        step: 2,
        description:
          "Bytes go out numbered; the sender keeps copies until they are acknowledged, and the receiver restores order.",
      },
      {
        step: 3,
        description:
          "Three duplicate ACKs trigger fast retransmit; otherwise a timer fires. Either way the congestion window shrinks.",
      },
      {
        step: 4,
        description:
          "One lost segment stalls everything behind it (head-of-line blocking), and an idle flow needs a keepalive to survive NAT.",
      },
    ],
```

- [ ] **Step 4: Retire the assertions for detail the card no longer carries**

In the `it("makes the TCP connection an agreement about numbers", () => {` block of `frontend/src/data/conceptCards.test.ts`:

Delete these assertions — they pin detail the shortened card drops on purpose:

```ts
    expect(tcp?.components[1]?.description).toMatch(
      /selective acknowledgement/i,
    );
    expect(tcp?.components[2]?.description).toMatch(/window scaling/i);
```

- [ ] **Step 5: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #039 TCP within the reading budget` and `makes the TCP connection an agreement about numbers`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the TCP concept card" -m "Reading length 4967 -> 919 characters; the core definition stays, and 2 assertions pinning detail the card no longer carries are retired." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 27: Shorten #040 UDP

Reading length 4728 → 861 characters (definition 283 → 163).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "udp"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set, and the `it("makes UDP the transport with the agreement taken out", () => {` block

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold UDP to the budget**

Append `"udp",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"tcp",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #040 UDP within the reading budget` with `definition: expected 283 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "udp"` (`cardNumber: "#040"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "UDP is what is left of a transport when you remove the agreement: no connection, and nothing is remembered between datagrams. Reliability is the application’s job.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "The header is the whole promise",
        description:
          "Eight bytes: ports, length, checksum. One send is one receive, so message boundaries survive.",
      },
      {
        name: "Nothing is remembered",
        description:
          "No ordering, no retries, no congestion control; connect() establishes nothing, and losing one fragment loses the datagram.",
      },
      {
        name: "What the absence buys, and who spends it",
        description:
          "No handshake delay, no head-of-line blocking, and multicast. DNS, voice, and QUIC are built on exactly that.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "Bind a port, name a destination, and send — the first packet already carries data.",
      },
      {
        step: 2,
        description:
          "The datagram may be lost, duplicated, or reordered, and nothing reports which.",
      },
      {
        step: 3,
        description:
          "Matching replies, retry timers, and pacing are the application’s job; what it does not supply, it lacks.",
      },
      {
        step: 4,
        description:
          "QUIC is ordered and reliable on top of UDP, so the choice against #039 is where the agreement lives, not speed.",
      },
    ],
```

- [ ] **Step 4: Retire the assertions for detail the card no longer carries**

In the `it("makes UDP the transport with the agreement taken out", () => {` block of `frontend/src/data/conceptCards.test.ts`:

Delete these assertions — they pin detail the shortened card drops on purpose:

```ts
    expect(udp?.components[0]?.description).toMatch(/IPv6/);
```

- [ ] **Step 5: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #040 UDP within the reading budget` and `makes UDP the transport with the agreement taken out`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the UDP concept card" -m "Reading length 4728 -> 861 characters; the core definition stays, and 1 assertion pinning detail the card no longer carries is retired." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 28: Shorten #041 Kubernetes Node

Reading length 3774 → 914 characters (definition 414 → 189).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "kubernetes-node"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set, and the `it("makes the Kubernetes Node a machine the cluster only reads about", () => {` block

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Kubernetes Node to the budget**

Append `"kubernetes-node",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"udp",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #041 Kubernetes Node within the reading budget` with `definition: expected 414 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "kubernetes-node"` (`cardNumber: "#041"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A node is a machine the cluster observes rather than owns: the kubelet reports its capacity and renews a lease. When the lease stops, nothing is repaired — its pods are recreated elsewhere.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Allocatable",
        description:
          "Capacity minus kube-reserved, system-reserved, and eviction headroom. Requests are a claim, not a measurement, against it.",
      },
      {
        name: "Conditions and the lease",
        description:
          "The kubelet renews a Lease. If it stops, the node goes NotReady and its pods are deleted after 300 seconds.",
      },
      {
        name: "Taints and tolerations",
        description:
          "A taint repels pods without a toleration; NoExecute also evicts running ones. A drain is a cordon plus evictions.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The kubelet registers the Node object with its capacity, addresses, and labels.",
      },
      {
        step: 2,
        description:
          "The scheduler filters nodes on allocatable, taints, and affinity, then binds the pod once.",
      },
      {
        step: 3,
        description:
          "Short on resources, the kubelet evicts BestEffort pods first — unlike #022’s cgroup kill of one container.",
      },
      {
        step: 4,
        description:
          "A departing node’s pods are recreated elsewhere. A node is a unit of failure, not a unit of identity (#024).",
      },
    ],
```

- [ ] **Step 4: Retire the assertions for detail the card no longer carries**

In the `it("makes the Kubernetes Node a machine the cluster only reads about", () => {` block of `frontend/src/data/conceptCards.test.ts`:

Delete these assertions — they pin detail the shortened card drops on purpose:

```ts
    expect(node?.components[0]?.description).toMatch(/host port/i);
    expect(node?.components[1]?.description).toMatch(
      /still shows them Running/i,
    );
```

- [ ] **Step 5: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #041 Kubernetes Node within the reading budget` and `makes the Kubernetes Node a machine the cluster only reads about`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Kubernetes Node concept card" -m "Reading length 3774 -> 914 characters; the core definition stays, and 2 assertions pinning detail the card no longer carries are retired." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 29: Shorten #042 Kubernetes Cluster

Reading length 3906 → 924 characters (definition 470 → 145).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "kubernetes-cluster"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Kubernetes Cluster to the budget**

Append `"kubernetes-cluster",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"kubernetes-node",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #042 Kubernetes Cluster within the reading budget` with `definition: expected 470 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "kubernetes-cluster"` (`cardNumber: "#042"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A cluster is two planes and one door: the control plane decides, the nodes run, and everything talks only to the API server — a star, not a mesh.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "The control plane",
        description:
          "etcd holds all state and the API server is the only process that touches it; losing etcd quorum freezes the cluster.",
      },
      {
        name: "The node side",
        description:
          "The kubelet, with a CRI runtime, watches for pods carrying its nodeName and pulls the work, so it has no listening port for it.",
      },
      {
        name: "The wiring",
        description:
          "Every loop is level-triggered, rereading state rather than trusting messages, and the API server is the chokepoint.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A request passes authentication, RBAC, and admission, then lands in etcd — a record of intent, with nothing running yet.",
      },
      {
        step: 2,
        description:
          "The scheduler sees an unbound pod, scores nodes (#041), and writes the binding. It never contacts the node.",
      },
      {
        step: 3,
        description:
          "The kubelet sees its name, starts the containers in a sandbox (#024), and reports status back.",
      },
      {
        step: 4,
        description:
          "The design fails static: without the control plane, pods keep running, but nothing new is scheduled.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #042 Kubernetes Cluster within the reading budget` and `draws the cluster as one door with a plane on either side of it`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Kubernetes Cluster concept card" -m "Reading length 3906 -> 924 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 30: Shorten #043 Kubernetes Deployment

Reading length 3928 → 883 characters (definition 437 → 143).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "kubernetes-deployment"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Kubernetes Deployment to the budget**

Append `"kubernetes-deployment",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"kubernetes-cluster",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #043 Kubernetes Deployment within the reading budget` with `definition: expected 437 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "kubernetes-deployment"` (`cardNumber: "#043"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A Deployment never touches a pod. It owns one ReplicaSet per template version, and a rolling update scales the new one up and the old one down.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "The two objects below it",
        description:
          "A pod-template-hash label keeps each revision’s pods apart, which is why the Deployment’s selector cannot change.",
      },
      {
        name: "The rollout",
        description:
          "maxSurge and maxUnavailable bound the drift from desired replicas, and readiness (#024) paces each step.",
      },
      {
        name: "Revisions",
        description:
          "Old ReplicaSets at zero replicas are the history, and revisionHistoryLimit sets how far back an undo can go.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A new template creates a new ReplicaSet at zero replicas; nothing running is touched.",
      },
      {
        step: 2,
        description:
          "The controller scales the new set up and the old one down as the new pods become ready.",
      },
      {
        step: 3,
        description:
          "A pod that never becomes ready stalls the rollout; progressDeadlineSeconds marks it Failed but rolls nothing back.",
      },
      {
        step: 4,
        description:
          "Undo goes forwards, re-applying an old template as a new revision. Stable identity needs a StatefulSet; scaling arrives via #042.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #043 Kubernetes Deployment within the reading budget` and `puts a ReplicaSet between the Deployment and every pod`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Kubernetes Deployment concept card" -m "Reading length 3928 -> 883 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 31: Shorten #044 AWS Stateless Services

Reading length 3510 → 910 characters (definition 464 → 177).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-stateless-services"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS Stateless Services to the budget**

Append `"aws-stateless-services",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"kubernetes-deployment",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #044 AWS Stateless Services within the reading budget` with `definition: expected 464 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-stateless-services"` (`cardNumber: "#044"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A stateless service keeps nothing between requests, so any instance can serve any caller and every instance is disposable. The state moved — into the request, or a store (#045).",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Where the state went",
        description:
          "Identity travels in a token (#013), and data lives in DynamoDB or S3. The service is stateless; the system is not.",
      },
      {
        name: "The disposable instance",
        description:
          "Capacity is a count, not a name. Any instance can be stopped, and the deregistration delay protects in-flight requests.",
      },
      {
        name: "The leak",
        description:
          "Nothing enforces it: Lambda sandboxes are reused, so globals and /tmp persist, and ALB stickiness pins callers.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The load balancer (#027) picks any healthy target; none is special.",
      },
      {
        step: 2,
        description:
          "The target uses the request plus fetched data, verifying tokens rather than looking up sessions (#013).",
      },
      {
        step: 3,
        description:
          "With no data on it, an instance can be removed at any time: deregister, finish in-flight requests, terminate.",
      },
      {
        step: 4,
        description:
          "Retries are safe only if the operation is idempotent, and the hard part has moved to the stateful tier (#045).",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #044 AWS Stateless Services within the reading budget` and `makes the stateless instance disposable and names what leaks`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS Stateless Services concept card" -m "Reading length 3510 -> 910 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 32: Shorten #045 AWS Stateful Services

Reading length 3568 → 888 characters (definition 485 → 153).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "aws-stateful-services"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold AWS Stateful Services to the budget**

Append `"aws-stateful-services",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-stateless-services",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #045 AWS Stateful Services within the reading budget` with `definition: expected 485 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "aws-stateful-services"` (`cardNumber: "#045"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A stateful service holds data that outlives any process, so a new instance is empty. Failure is a promotion, not a replacement — the counterpart of #044.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Identity that outlives the process",
        description:
          "You address a name, not a count — an RDS endpoint, a volume, a slot range (#021) — so recovery is restore or promote.",
      },
      {
        name: "Scaling that isn’t a slider",
        description:
          "A bigger primary needs a restart, read replicas add reads with lag, and only sharding adds write capacity.",
      },
      {
        name: "The blast radius",
        description:
          "An EBS volume lives in one Availability Zone. Backups bound your losses; deletion protection guards what #023 cannot rebuild.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A write must be durable before it is acknowledged, and that wait is most of the latency.",
      },
      {
        step: 2,
        description:
          "The data has a fixed location, so the floating tier above it (#044) is placed around it.",
      },
      {
        step: 3,
        description:
          "Failover promotes a standby and repoints DNS; open connections drop, so apps must reconnect and retry.",
      },
      {
        step: 4,
        description:
          "Writes scale by partition key, chosen early. A bad key makes a hot partition, and more of #044 cannot fix it.",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #045 AWS Stateful Services within the reading budget` and `makes the stateful service a promotion rather than a replacement`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the AWS Stateful Services concept card" -m "Reading length 3568 -> 888 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 33: Shorten #046 Kubernetes ReplicaSet

Reading length 4144 → 925 characters (definition 431 → 170).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "kubernetes-replicaset"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold Kubernetes ReplicaSet to the budget**

Append `"kubernetes-replicaset",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"aws-stateful-services",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #046 Kubernetes ReplicaSet within the reading budget` with `definition: expected 431 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "kubernetes-replicaset"` (`cardNumber: "#046"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "A ReplicaSet keeps no list of its pods: each pass it counts whatever matches its selector and fixes the difference. Deletes cascade through an ownerReference on each pod.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "A selector, not a list",
        description:
          "Matching pods with no controller are adopted. The selector is immutable, as a Deployment’s is (#043).",
      },
      {
        name: "ownerReferences",
        description:
          "The garbage collector deletes pods whose owner is gone; --cascade=orphan leaves them. Avoid overlapping selectors.",
      },
      {
        name: "Which pod goes",
        description:
          "Scale-down removes the cheapest pods first — unscheduled, not ready, youngest — and pod-deletion-cost lets apps vote.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "A replica count arrives through the API server (#042) and the controller lists matching pods; nothing is carried over.",
      },
      {
        step: 2,
        description:
          "It creates or deletes the difference, and at zero it idles, like a Deployment’s old revisions (#043).",
      },
      {
        step: 3,
        description:
          "A pod relabelled off the selector is released and replaced, so it stays running for debugging.",
      },
      {
        step: 4,
        description:
          "Template edits touch no running pod — there is no rollout. Pods with a deletionTimestamp stop counting (#024).",
      },
    ],
```

- [ ] **Step 4: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #046 Kubernetes ReplicaSet within the reading budget` and `makes the ReplicaSet\u2019s selector, rather than a list, what it owns`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the Kubernetes ReplicaSet concept card" -m "Reading length 4144 -> 925 characters; the core definition stays and so does every assertion that pins it." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 34: Shorten #047 SAML

Reading length 3716 → 953 characters (definition 479 → 178).

**Files:**
- Modify: `frontend/src/data/conceptCards.ts` — the object with `id: "saml"`
- Test: `frontend/src/data/conceptCards.test.ts` — the `withinBudget` set, and the `it("makes SAML a signed claim the browser carries between two strangers", () => {` block

**Interfaces:**
- Consumes: `withinBudget` (a `Set<string>` of card ids) from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Hold SAML to the budget**

Append `"saml",` as the last entry of the `withinBudget` set in `frontend/src/data/conceptCards.test.ts` (directly after `"kubernetes-replicaset",`).

- [ ] **Step 2: Run the budget test to verify it fails**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: FAIL on `keeps #047 SAML within the reading budget` with `definition: expected 479 to be less than or equal to 200`.

- [ ] **Step 3: Replace the card's copy**

In `frontend/src/data/conceptCards.ts`, find the object with `id: "saml"` (`cardNumber: "#047"`). Leave `id`, `cardNumber`, `type`, `title`, `image` and `keywords` exactly as they are. Replace the `definition` property with:

```ts
    definition:
      "SAML is browser single sign-on built from signed XML: the identity provider’s assertion reaches the app through the user’s browser, trusted via a certificate imported beforehand.",
```

Then, below the untouched `keywords` array, replace the `components` and `howItWorks` arrays with:

```ts
    components: [
      {
        name: "Metadata",
        description:
          "Each side imports the other’s entityID, endpoints, and certificate. When a provider rotates its key, logins break — unlike #017.",
      },
      {
        name: "Assertion",
        description:
          "Signed XML naming the user, bounded by NotOnOrAfter and an AudienceRestriction; unlike a JWT (#013), it crosses the browser.",
      },
      {
        name: "Bindings",
        description:
          "HTTP-Redirect carries the request and HTTP-POST the response; Artifact uses a back channel. RelayState returns the user.",
      },
    ],
    howItWorks: [
      {
        step: 1,
        description:
          "The app redirects the browser to the provider with an AuthnRequest and remembers its ID.",
      },
      {
        step: 2,
        description:
          "The provider authenticates the user, and the credentials never reach the app (as with #017).",
      },
      {
        step: 3,
        description:
          "The browser posts the signed response to the app. It is the only courier, so trust rests on the signature.",
      },
      {
        step: 4,
        description:
          "The app checks the signature on the element it reads (signature wrapping), then the audience, time, and InResponseTo.",
      },
    ],
```

- [ ] **Step 4: Retire the assertions for detail the card no longer carries**

In the `it("makes SAML a signed claim the browser carries between two strangers", () => {` block of `frontend/src/data/conceptCards.test.ts`:

Delete these assertions — they pin detail the shortened card drops on purpose:

```ts
    expect(saml?.howItWorks[3]?.description).toMatch(/Single Logout/);
    expect(saml?.howItWorks[3]?.description).toMatch(/replay/i);
```

Replace:

```ts
    // The payload: verify the node you read, then the provider has no say.
```

with:

```ts
    // The payload: verify the very node you read, and the request it answers.
```

- [ ] **Step 5: Run the card's tests and the search tests to verify they pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts src/components/ConceptExplorer.test.tsx src/lib/filterCards.test.ts`
Expected: PASS — including `keeps #047 SAML within the reading budget` and `makes SAML a signed claim the browser carries between two strangers`.

Then: `pnpm --dir frontend exec prettier --write src/data/conceptCards.ts src/data/conceptCards.test.ts`

- [ ] **Step 6: Commit**

```bash
git add frontend/src/data/conceptCards.ts frontend/src/data/conceptCards.test.ts
git commit -m "feat: shorten the SAML concept card" -m "Reading length 3716 -> 953 characters; the core definition stays, and 2 assertions pinning detail the card no longer carries are retired." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---
### Task 35: Hold every card to the reading budget

Once all 34 cards are in `withinBudget`, the set is just a list of every card. This task swaps it for the whole deck, so a card added later is held to the budget without anyone remembering to add it. It also pins cross-references and runs the full gate, e2e included.

**Files:**
- Modify: `frontend/src/data/conceptCards.test.ts` — the `reading budget` block, plus one new test in `describe("conceptCards", …)`
- Modify: `CLAUDE.md` — the "Adding a concept card" paragraph

**Interfaces:**
- Consumes: `BUDGET`, `withinBudget` and `readingLength` from Task 1, with all 47 ids in `withinBudget` by the end of Task 34.
- Produces: nothing; this closes the plan.

- [ ] **Step 1: Add the cross-reference test**

In `frontend/src/data/conceptCards.test.ts`, inside `describe("conceptCards", …)`, add this directly after the `gives every card sketch artwork of its own` test:

```ts
  it("points every #NNN cross-reference at a card in the deck", () => {
    const numbers = new Set<string>(
      conceptCards.map(({ cardNumber }) => cardNumber),
    );
    const references = conceptCards.flatMap((card) =>
      [
        card.definition,
        ...card.components.map(({ description }) => description),
        ...card.howItWorks.map(({ description }) => description),
      ].flatMap((text) => text.match(/#\d{3}/g) ?? []),
    );

    expect(references.filter((reference) => !numbers.has(reference))).toEqual(
      [],
    );
  });
```

- [ ] **Step 2: Run it to verify it passes**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "cross-reference"`
Expected: PASS. It checks copy that is already written, so it guards against regressions and has no red step. To see it bite, change one `#044` to `#094` temporarily: it fails with `["#094"]`. Then revert.

- [ ] **Step 3: Replace the staged set with the whole deck**

In the `reading budget` block, delete the `withinBudget` set and the `names only cards that exist` test. Replace the comment above `BUDGET` and the `it.each` source so the block reads:

```ts
// A face scrolls, but a card is meant to be read at a glance: these are the
// most any one card may ask of its reader, and a new card is held to them from
// its first commit.
const BUDGET = {
  definition: 200,
  componentName: 40,
  component: 130,
  step: 150,
  total: 960,
} as const;

// Everything a reader reads past the title: the definition, the three
// components and the four steps.
const readingLength = (card: ConceptCardData): number =>
  card.definition.length +
  card.components.reduce(
    (sum, { description }) => sum + description.length,
    0,
  ) +
  card.howItWorks.reduce((sum, { description }) => sum + description.length, 0);

describe("reading budget", () => {
  it.each(
    conceptCards.map((card) => [card.cardNumber, card.title, card] as const),
  )("keeps %s %s within the reading budget", (_number, _title, card) => {
    expect(card.definition.length, "definition").toBeLessThanOrEqual(
      BUDGET.definition,
    );
    card.components.forEach(({ name, description }, index) => {
      expect(name.length, `component ${index} name`).toBeLessThanOrEqual(
        BUDGET.componentName,
      );
      expect(description.length, `component ${index}`).toBeLessThanOrEqual(
        BUDGET.component,
      );
    });
    card.howItWorks.forEach(({ description }, index) => {
      expect(description.length, `step ${index + 1}`).toBeLessThanOrEqual(
        BUDGET.step,
      );
    });
    expect(readingLength(card), "total").toBeLessThanOrEqual(BUDGET.total);
  });
});
```

- [ ] **Step 4: Run the budget test to verify all 47 cards pass**

Run: `pnpm --dir frontend exec vitest run src/data/conceptCards.test.ts -t "reading budget"`
Expected: PASS, 47 tests, from `keeps #001 Proxy within the reading budget` to `keeps #047 SAML within the reading budget`.

- [ ] **Step 5: Record the budget where the next card's author will look**

In `CLAUDE.md`, in the "Adding a concept card" paragraph, replace:

```markdown
append one `ConceptCardData` object with a
unique `id` and card number, then extend both the content-contract test
```

with:

```markdown
append one `ConceptCardData` object with a
unique `id` and card number — its copy inside the reading budget the
content-contract test enforces (definition ≤ 200 characters, component names
≤ 40, each component ≤ 130, each step ≤ 150, ≤ 960 in all), which is what keeps
a card readable at a glance — then extend both the content-contract test
```

- [ ] **Step 6: Run the whole gate**

Run each and confirm it passes:

```bash
pnpm --dir frontend format:check
pnpm --dir frontend lint
pnpm --dir frontend typecheck
pnpm --dir frontend test:coverage
pnpm --dir frontend build
pnpm --dir frontend exec playwright install chromium
pnpm --dir frontend test:e2e
```

Expected: all green. Coverage stays above the 85/85/80/85 thresholds, since only data and tests changed. Both Playwright projects (`chromium` and `mobile`) pass, including `still scrolls the card face under a vertical finger`, `keeps the Reverse Proxy card readable at 200 percent text zoom` and `leaves space under the last line when a face scrolls`.

- [ ] **Step 7: Look at the longest card before and after**

Run: `pnpm --dir frontend dev`. At a 320px-wide viewport, open AWS Transit Gateway (#035) and flip it. The back should now show all three components and four steps in about two screens rather than eight. Stop the server.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/data/conceptCards.test.ts CLAUDE.md
git commit -m "test: hold every concept card to the reading budget" -m "Every card now fits the budget, so the staged list becomes the whole deck and a new card is held to it from its first commit. Also pins every #NNN cross-reference to a real card and records the budget beside the steps for adding a card." -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
