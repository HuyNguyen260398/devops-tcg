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
] as const;

describe("conceptCards", () => {
  it("contains the complete Proxy learning contract", () => {
    expect(conceptCards[0]).toMatchObject({
      id: "proxy",
      cardNumber: "#001",
      type: "NETWORK",
      title: "Proxy",
      descriptor: "INTERMEDIARY",
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
    expect(new Set(conceptCards.map(({ cardNumber }) => cardNumber)).size).toBe(
      9,
    );
    expect(new Set(conceptCards.map(({ image }) => image.src)).size).toBe(9);
    expect(
      conceptCards.every(({ image }) => image.src.startsWith("/images/")),
    ).toBe(true);
  });

  it("gives every card a complete learning contract", () => {
    for (const card of conceptCards) {
      expect(
        [
          card.series,
          card.type,
          card.title,
          card.descriptor,
          card.definition,
        ].every(Boolean),
      ).toBe(true);
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

  it("distinguishes deprecated SSL from modern TLS", () => {
    const ssl = conceptCards.find(({ id }) => id === "ssl");
    const tls = conceptCards.find(({ id }) => id === "tls");

    expect(ssl?.definition).toMatch(/deprecated/i);
    expect(ssl?.definition).toMatch(/use TLS/i);
    expect(tls?.definition).toMatch(/modern protocol/i);
  });
});
