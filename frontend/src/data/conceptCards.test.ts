import { describe, expect, it } from "vitest";
import { conceptCards } from "./conceptCards";

describe("conceptCards", () => {
  it("contains the complete Proxy learning contract", () => {
    expect(conceptCards).toHaveLength(1);
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
      keywords: ["intermediary", "forward proxy", "reverse proxy", "routing", "caching"],
    });
    expect(conceptCards[0].components).toHaveLength(3);
    expect(conceptCards[0].howItWorks).toHaveLength(4);
  });

  it("has no empty required content", () => {
    for (const card of conceptCards) {
      expect(Object.values(card.image).every(Boolean)).toBe(true);
      expect(card.keywords.every(Boolean)).toBe(true);
      expect(card.components.every(({ name, description }) => name && description)).toBe(true);
      expect(card.howItWorks.every(({ step, description }) => step > 0 && description)).toBe(true);
    }
  });
});
