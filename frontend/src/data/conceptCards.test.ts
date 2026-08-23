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

  it("contains all fourteen concepts in the approved order", () => {
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
});
