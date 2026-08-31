import { describe, expect, it } from "vitest";
import { conceptCards } from "./conceptCards";

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
  [
    "lambda-throttle",
    "#010",
    "Lambda Throttle",
    "/images/lambda-throttle-thumbnail.webp",
  ],
  ["public-ca", "#011", "Public CA", "/images/public-ca-thumbnail.webp"],
  ["private-ca", "#012", "Private CA", "/images/private-ca-thumbnail.webp"],
  ["jwt", "#013", "JWT", "/images/jwt-thumbnail.webp"],
  ["aws-lambda", "#014", "AWS Lambda", "/images/aws-lambda-thumbnail.webp"],
  [
    "aws-iam-role",
    "#015",
    "AWS IAM Role",
    "/images/aws-iam-role-thumbnail.webp",
  ],
  [
    "aws-iam-policy",
    "#016",
    "AWS IAM Policy",
    "/images/aws-iam-policy-thumbnail.webp",
  ],
  ["oidc", "#017", "OIDC", "/images/oidc-thumbnail.webp"],
  ["kafka", "#018", "Kafka", "/images/kafka-thumbnail.webp"],
  ["redis", "#019", "Redis", "/images/redis-thumbnail.webp"],
  ["rbac", "#020", "RBAC", "/images/rbac-thumbnail.webp"],
  [
    "redis-cluster",
    "#021",
    "Redis Cluster",
    "/images/redis-cluster-thumbnail.webp",
  ],
  ["container", "#022", "Container", "/images/container-thumbnail.webp"],
  [
    "terraform-state",
    "#023",
    "Terraform State",
    "/images/terraform-state-thumbnail.webp",
  ],
] as const;

describe("conceptCards", () => {
  it("contains the complete Proxy learning contract", () => {
    expect(conceptCards[0]).toMatchObject({
      id: "proxy",
      cardNumber: "#001",
      type: "NETWORK",
      title: "Proxy",
      image: {
        src: "/images/proxy-thumbnail.webp",
        alt: "Ethernet cables connected to network equipment",
      },
      definition:
        "A proxy receives a request from one system and forwards it to another on the requester’s behalf.",
      keywords: [
        "intermediary",
        "forward proxy",
        "reverse proxy",
        "routing",
        "caching",
      ],
    });
    expect(conceptCards[0].components).toHaveLength(3);
    expect(conceptCards[0].howItWorks).toHaveLength(4);
  });

  it("contains all twenty-three concepts in the approved order", () => {
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
    expect(new Set(conceptCards.map(({ id }) => id)).size).toBe(
      expectedCards.length,
    );
    expect(new Set(conceptCards.map(({ cardNumber }) => cardNumber)).size).toBe(
      expectedCards.length,
    );
    expect(new Set(conceptCards.map(({ image }) => image.src)).size).toBe(
      expectedCards.length,
    );
    expect(
      conceptCards.every(({ image }) => image.src.startsWith("/images/")),
    ).toBe(true);
  });

  it("gives every card a complete learning contract", () => {
    for (const card of conceptCards) {
      expect([card.type, card.title, card.definition].every(Boolean)).toBe(
        true,
      );
      expect(card.image.alt).toBeTruthy();
      expect(card.keywords.length).toBeGreaterThan(0);
      expect(card.keywords.every(Boolean)).toBe(true);
      expect(card.components).toHaveLength(3);
      expect(
        card.components.every(({ name, description }) => name && description),
      ).toBe(true);
      expect(card.howItWorks.map(({ step }) => step)).toEqual([1, 2, 3, 4]);
      expect(card.howItWorks.every(({ description }) => description)).toBe(
        true,
      );
    }
  });

  it("gives every card sketch artwork of its own", () => {
    expect(
      new Set(conceptCards.map(({ image }) => image.sketch.src)).size,
    ).toBe(expectedCards.length);

    for (const card of conceptCards) {
      expect(card.image.sketch.src).toBe(`/images/${card.id}-sketch.svg`);
      expect(card.image.sketch.alt).toBeTruthy();
      // The drawing depicts something different from the photograph, so reusing
      // one description would misdescribe whichever artwork is on screen.
      expect(card.image.sketch.alt).not.toBe(card.image.alt);
    }
  });

  it("distinguishes deprecated SSL from modern TLS", () => {
    const ssl = conceptCards.find(({ id }) => id === "ssl");
    const tls = conceptCards.find(({ id }) => id === "tls");

    expect(ssl?.definition).toMatch(/deprecated/i);
    expect(ssl?.definition).toMatch(/use TLS/i);
    expect(tls?.definition).toMatch(/modern protocol/i);
    expect(tls?.definition).toMatch(/optionally clients/i);
    expect(tls?.howItWorks[2]?.description).toMatch(
      /client authentication is optional/i,
    );
  });

  it("separates a publicly trusted CA from an organisation's own", () => {
    const publicCa = conceptCards.find(({ id }) => id === "public-ca");
    const privateCa = conceptCards.find(({ id }) => id === "private-ca");

    // The pair is only worth two cards if each says what the other does not:
    // who already trusts the root, and who is left rejecting the certificate.
    expect(publicCa?.definition).toMatch(/browsers and operating systems/i);
    expect(publicCa?.definition).toMatch(/without extra configuration/i);
    expect(publicCa?.howItWorks[1]?.description).toMatch(/validat/i);
    expect(publicCa?.keywords).toContain("trust store");

    expect(privateCa?.definition).toMatch(/own systems/i);
    expect(privateCa?.definition).toMatch(/trust its root/i);
    expect(privateCa?.howItWorks[1]?.description).toMatch(/distribut/i);
    expect(privateCa?.keywords).toContain("internal PKI");
  });

  it("presents a JWT as claims a service can verify without the issuer", () => {
    const jwt = conceptCards.find(({ id }) => id === "jwt");

    // The card earns its place only by saying what a session cookie does not:
    // the verifier needs the key, not a call back to whoever issued the token.
    expect(jwt?.definition).toMatch(/signed claims/i);
    expect(jwt?.definition).toMatch(/without calling back to the issuer/i);
    expect(jwt?.keywords).toContain("stateless");
    // Encoded is not encrypted is the mistake this card exists to prevent.
    expect(jwt?.components[1]?.description).toMatch(/not encrypted/i);
    expect(jwt?.howItWorks[3]?.description).toMatch(/expired/i);
  });

  it("explains Lambda throttling as a concurrency limit answered with 429", () => {
    const throttle = conceptCards.find(({ id }) => id === "lambda-throttle");

    expect(throttle?.definition).toMatch(/concurrenc/i);
    expect(throttle?.definition).toMatch(/429/);
    expect(throttle?.keywords).toContain("reserved concurrency");
    expect(throttle?.howItWorks[2]?.description).toMatch(
      /TooManyRequestsException/,
    );
    expect(throttle?.howItWorks[3]?.description).toMatch(/retr/i);
  });

  it("presents Lambda as event-driven code on managed execution environments", () => {
    const lambda = conceptCards.find(({ id }) => id === "aws-lambda");

    // The general card must carry what the throttle card assumes: an
    // invocation is an event, and the environment running it is Lambda's to
    // create, reuse, and bill for — not a server anyone provisions.
    expect(lambda?.definition).toMatch(/event/i);
    expect(lambda?.definition).toMatch(/execution environment/i);
    expect(lambda?.keywords).toContain("serverless");
    // Reuse is the whole reason a cold start is only sometimes paid.
    expect(lambda?.howItWorks[1]?.description).toMatch(/cold start/i);
    expect(lambda?.howItWorks[3]?.description).toMatch(/reuse|frozen/i);
    // Scaling belongs here; the 429 that ends it belongs to Lambda Throttle.
    expect(lambda?.howItWorks[3]?.description).toMatch(/concurren|scal/i);
    expect(lambda?.definition).not.toMatch(/429/);
  });

  it("presents an IAM role as an identity that is assumed, not owned", () => {
    const role = conceptCards.find(({ id }) => id === "aws-iam-role");

    // The card exists to break the habit of thinking of a role as a user with
    // credentials: nobody signs in as it, and what it hands out expires.
    expect(role?.definition).toMatch(/assume/i);
    expect(role?.definition).toMatch(/temporary/i);
    expect(role?.definition).not.toMatch(/password|access key id/i);
    expect(role?.keywords).toContain("trust policy");
    // The trust policy is the half of a role that a permissions policy is not,
    // and it is checked first — an allow it does not name never gets read.
    expect(role?.components[0]?.description).toMatch(/who/i);
    expect(role?.howItWorks[1]?.description).toMatch(/trust policy/i);
    expect(role?.howItWorks[2]?.description).toMatch(/expir/i);
    // What those permissions say is the policy card's story, not this one's.
    expect(role?.definition).not.toMatch(/explicit deny/i);
  });

  it("presents an IAM policy as a document evaluated deny-first", () => {
    const policy = conceptCards.find(({ id }) => id === "aws-iam-policy");

    // Two rules decide every AWS request, and both are counter-intuitive
    // enough to be the reason this card is in the deck.
    expect(policy?.definition).toMatch(/allow|deny/i);
    expect(policy?.keywords).toContain("least privilege");
    expect(policy?.components[0]?.name).toMatch(/statement/i);
    // An explicit deny wins outright; without an allow the answer is still no.
    expect(policy?.howItWorks[2]?.description).toMatch(/explicit deny/i);
    expect(policy?.howItWorks[3]?.description).toMatch(/allow/i);
    expect(policy?.howItWorks[3]?.description).toMatch(/default/i);
    // Who may assume a role is the role card's story, not this one's.
    expect(policy?.definition).not.toMatch(/assume/i);
  });

  it("presents OIDC as the identity OAuth 2.0 alone never states", () => {
    const oidc = conceptCards.find(({ id }) => id === "oidc");

    // The card only earns its slot beside JWT by naming what it layers on and
    // what that layer adds: authentication, carried in an ID token.
    expect(oidc?.definition).toMatch(/OAuth 2\.0/);
    expect(oidc?.definition).toMatch(/authenticat/i);
    expect(oidc?.definition).toMatch(/ID token/i);
    expect(oidc?.keywords).toContain("ID token");
    // Treating an access token as proof of identity is the mistake this card
    // exists to prevent, so the ID token component has to say the difference.
    expect(oidc?.components[2]?.description).toMatch(/access token/i);
    expect(oidc?.components[2]?.description).toMatch(/not proof/i);
    // The password stays with the provider — that is the point of the redirect.
    expect(oidc?.howItWorks[1]?.description).toMatch(
      /never reach the relying party/i,
    );
    // Verification is against published keys, the same contract JWT states.
    expect(oidc?.howItWorks[3]?.description).toMatch(/signature/i);
    expect(oidc?.howItWorks[3]?.description).toMatch(/audience/i);
  });

  it("presents Kafka as a retained stream many consumers read", () => {
    const kafka = conceptCards.find(({ id }) => id === "kafka");

    // The card is a general-purpose introduction, so the definition has to say
    // what Kafka is for: events kept for a while, not messages handed over once.
    expect(kafka?.definition).toMatch(/event/i);
    expect(kafka?.definition).toMatch(/retain|retention/i);
    expect(kafka?.keywords).toContain("consumer group");
    // Reading is not consuming — that is the habit a queue leaves behind, and
    // it is why one stream can feed several unrelated readers at once.
    expect(kafka?.components[1]?.description).toMatch(/append-only|log/i);
    expect(kafka?.components[1]?.description).toMatch(/does not remove/i);
    expect(kafka?.components[2]?.description).toMatch(/own offset/i);
    // Durability is the broker's job, and it is what makes the rest credible.
    expect(kafka?.components[0]?.description).toMatch(/replicat/i);
    expect(kafka?.howItWorks[1]?.description).toMatch(/append/i);
    expect(kafka?.howItWorks[3]?.description).toMatch(/retention/i);
  });

  it("presents Redis as memory first, with durability an opt-in", () => {
    const redis = conceptCards.find(({ id }) => id === "redis");

    // The card is the general introduction, so the definition has to say where
    // the data lives and what that buys — not pick the cache use case.
    expect(redis?.definition).toMatch(/in-memory/i);
    expect(redis?.definition).toMatch(/data structure/i);
    expect(redis?.keywords).toContain("key-value");
    // Values are typed. Treating Redis as a flat string cache is the habit the
    // keyspace component exists to correct.
    expect(redis?.components[0]?.description).toMatch(/hash|list|sorted set/i);
    expect(redis?.components[0]?.description).toMatch(/TTL|expire/i);
    // One command at a time is where the atomicity comes from, and it is also
    // why one slow command stalls every other client.
    expect(redis?.components[1]?.description).toMatch(/one command at a time/i);
    expect(redis?.components[1]?.description).toMatch(/atomic/i);
    // Durability is something you turn on. A default Redis restarts empty, and
    // that is the misconception this card exists to break.
    expect(redis?.components[2]?.description).toMatch(/RDB|AOF/);
    expect(redis?.howItWorks[1]?.description).toMatch(/memory|RAM/i);
    expect(redis?.howItWorks[3]?.description).toMatch(/evict/i);
    expect(redis?.howItWorks[3]?.description).toMatch(/restart/i);
  });

  it("presents RBAC as permissions held by roles, never by people", () => {
    const rbac = conceptCards.find(({ id }) => id === "rbac");

    // The card sits one level above the deck's IAM pair, so the definition has
    // to name the indirection itself rather than any one implementation of it.
    expect(rbac?.definition).toMatch(/role/i);
    expect(rbac?.definition).toMatch(/rather than to people/i);
    expect(rbac?.keywords).toContain("role assignment");
    // A subject holding a permission of its own is RBAC already abandoned.
    expect(rbac?.components[0]?.description).toMatch(/never/i);
    expect(rbac?.components[0]?.description).toMatch(/assignment/i);
    // A role is a job, not a person; carving it finer is where roles multiply.
    expect(rbac?.components[1]?.description).toMatch(/role explosion/i);
    // What an administrator hands out is the assignment, not the permission.
    expect(rbac?.howItWorks[1]?.description).toMatch(/assign/i);
    // Additive with no deny rule to write is the habit this card exists to
    // break: what no assigned role names is already refused.
    expect(rbac?.howItWorks[2]?.description).toMatch(/union/i);
    expect(rbac?.howItWorks[2]?.description).toMatch(/additive/i);
    expect(rbac?.howItWorks[2]?.description).toMatch(/deny/i);
    // Where RBAC stops: a rule that reads the request itself needs attributes.
    expect(rbac?.howItWorks[3]?.description).toMatch(/attribute/i);
  });

  it("presents Redis Cluster as slots routed to owners, not a proxy", () => {
    const cluster = conceptCards.find(({ id }) => id === "redis-cluster");

    // The card is the sequel to Redis, so the definition has to name what
    // sharding is done in units of — slots, never keys or nodes.
    expect(cluster?.definition).toMatch(/16384/);
    expect(cluster?.definition).toMatch(/slot/i);
    expect(cluster?.keywords).toContain("hash slot");
    // A slot is what a shard owns and what a resharding moves. Thinking in
    // keys is what makes resharding look impossible.
    expect(cluster?.components[0]?.description).toMatch(/CRC16/);
    expect(cluster?.components[0]?.description).toMatch(/hash tag/i);
    // Availability is per shard: a promoted replica takes its own slots, and
    // slots with no live owner leave the cluster short rather than the whole
    // keyspace down.
    expect(cluster?.components[1]?.description).toMatch(/replica/i);
    expect(cluster?.components[1]?.description).toMatch(/majority/i);
    // There is no proxy in front of a cluster. The client holds the map and
    // follows the redirect itself — the habit this card exists to correct.
    expect(cluster?.components[2]?.description).toMatch(
      /no proxy|without a proxy/i,
    );
    expect(cluster?.components[2]?.description).toMatch(/MOVED/);
    expect(cluster?.howItWorks[1]?.description).toMatch(/own|owner/i);
    expect(cluster?.howItWorks[2]?.description).toMatch(/MOVED/);
    expect(cluster?.howItWorks[2]?.description).toMatch(/ASK/);
    // Where the model stops: a command whose keys hash apart is refused, and
    // co-locating them is a deliberate act.
    expect(cluster?.howItWorks[3]?.description).toMatch(/CROSSSLOT/);
    expect(cluster?.howItWorks[3]?.description).toMatch(/hash tag/i);
  });

  it("separates what a container may see from what it may consume", () => {
    const container = conceptCards.find(({ id }) => id === "container");

    // The card exists to break the "a container is a small VM" habit: it is a
    // process on the host's own kernel, which is both why it costs so little
    // and why the boundary is thinner than it looks.
    expect(container?.definition).toMatch(/process/i);
    expect(container?.definition).toMatch(/kernel/i);
    expect(container?.keywords).toContain("namespace");
    expect(container?.keywords).toContain("cgroup");
    // A digest is the bytes; a tag is a pointer that moves underneath you.
    expect(container?.components[0]?.description).toMatch(/digest/i);
    expect(container?.components[0]?.description).toMatch(/tag/i);
    // Isolation is granted one resource at a time, so it is given away one
    // resource at a time — the reason a single flag can undo it.
    expect(container?.components[1]?.description).toMatch(/see/i);
    expect(container?.components[1]?.description).toMatch(/--net=host/);
    // A memory limit is not backpressure. The kernel enforces it by killing.
    expect(container?.components[2]?.description).toMatch(/consume/i);
    expect(container?.components[2]?.description).toMatch(/kill/i);
    // The image stays read-only; the writes land in a layer above it.
    expect(container?.howItWorks[1]?.description).toMatch(/copy-on-write/i);
    expect(container?.howItWorks[1]?.description).toMatch(/writable layer/i);
    // No boot, the same kernel: why it starts in milliseconds, and why an
    // escape from it lands on the host rather than in a hypervisor.
    expect(container?.howItWorks[2]?.description).toMatch(/kernel/i);
    // Where the model stops: the container is PID 1, and nothing it wrote to
    // its own filesystem outlives it.
    expect(container?.howItWorks[3]?.description).toMatch(/PID 1/);
    expect(container?.howItWorks[3]?.description).toMatch(/volume/i);
  });
  it("makes state the third input a plan compares, not a cache", () => {
    const state = conceptCards.find(({ id }) => id === "terraform-state");

    // The card exists to replace "Terraform diffs my config against the cloud"
    // with the comparison it actually runs. Everything surprising about a plan
    // comes from that third input being something other than you assumed.
    expect(state?.definition).toMatch(/three-way/i);
    expect(state?.definition).toMatch(/address/i);
    expect(state?.keywords).toContain("drift");
    // Losing the file loses the binding, not the infrastructure — and the file
    // holds whatever the provider returned, secrets included.
    expect(state?.components[0]?.description).toMatch(
      /create everything again/i,
    );
    expect(state?.components[0]?.description).toMatch(/secret/i);
    // Shared state is what forces exclusive writes, so the backend decides both.
    expect(state?.components[1]?.description).toMatch(/local/i);
    expect(state?.components[2]?.description).toMatch(/force-unlock/i);
    // Drift is real state moving under Terraform, and it has an author.
    expect(state?.howItWorks[0]?.description).toMatch(/drift/i);
    // Deleting a resource block is a destroy, which is why removing code ships.
    expect(state?.howItWorks[1]?.description).toMatch(/destroy/i);
    // State is written per resource, so the answer to a failed apply is another
    // apply — never an editor.
    expect(state?.howItWorks[2]?.description).toMatch(/lock/i);
    expect(state?.howItWorks[2]?.description).toMatch(/hand-edit/i);
    // The binding is by address, so a rename and an import are both map edits
    // that leave the cloud untouched.
    expect(state?.howItWorks[3]?.description).toMatch(/moved/i);
    expect(state?.howItWorks[3]?.description).toMatch(/import/i);
  });
});
