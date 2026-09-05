import { describe, expect, it } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import type { ConceptCardData } from "@/types/concept";
import { EMPTY_FILTER, cardTypes, filterCards } from "./filterCards";

const card = (
  id: string,
  title: string,
  type: string,
  keywords: readonly string[],
  definition: string,
): ConceptCardData => ({
  id,
  cardNumber: "#001",
  type,
  title,
  image: {
    src: `/images/${id}.webp`,
    alt: `${title} photograph`,
    sketch: { src: `/images/${id}-sketch.svg`, alt: `${title} drawing` },
  },
  definition,
  keywords,
  components: [],
  howItWorks: [],
});

const fixtures: readonly ConceptCardData[] = [
  card(
    "proxy",
    "Proxy",
    "NETWORK",
    ["caching", "routing"],
    "Forwards a request.",
  ),
  card("tls", "TLS", "SECURITY", ["handshake"], "Encrypts a connection."),
  card(
    "state",
    "Terraform State",
    "PLATFORM",
    ["drift"],
    "Records real resources.",
  ),
];

describe("cardTypes", () => {
  it("lists each type once in the order it first appears", () => {
    expect(cardTypes(fixtures)).toEqual(["NETWORK", "SECURITY", "PLATFORM"]);
  });

  it("collapses repeats rather than listing a type twice", () => {
    expect(cardTypes([...fixtures, fixtures[0]])).toEqual([
      "NETWORK",
      "SECURITY",
      "PLATFORM",
    ]);
  });

  it("derives the shipped deck's four categories from the data", () => {
    expect([...cardTypes(conceptCards)].sort()).toEqual([
      "COMPUTE",
      "NETWORK",
      "PLATFORM",
      "SECURITY",
    ]);
  });
});

describe("filterCards", () => {
  it("returns the deck untouched when nothing is filtered", () => {
    expect(filterCards(fixtures, EMPTY_FILTER)).toBe(fixtures);
  });

  it("ignores a query that is only whitespace", () => {
    expect(filterCards(fixtures, { query: "   ", type: null })).toBe(fixtures);
  });

  it("matches a title regardless of case", () => {
    expect(filterCards(fixtures, { query: "TlS", type: null })).toEqual([
      fixtures[1],
    ]);
  });

  it("matches a category typed as text", () => {
    expect(filterCards(fixtures, { query: "security", type: null })).toEqual([
      fixtures[1],
    ]);
  });

  it("matches a keyword", () => {
    expect(filterCards(fixtures, { query: "caching", type: null })).toEqual([
      fixtures[0],
    ]);
  });

  it("matches a word from the definition", () => {
    expect(filterCards(fixtures, { query: "encrypts", type: null })).toEqual([
      fixtures[1],
    ]);
  });

  it("requires every token to match, so a second word narrows", () => {
    expect(
      filterCards(fixtures, { query: "terraform drift", type: null }),
    ).toEqual([fixtures[2]]);
    expect(
      filterCards(fixtures, { query: "terraform caching", type: null }),
    ).toEqual([]);
  });

  it("does not surface a card that merely shares letters", () => {
    expect(filterCards(fixtures, { query: "tls", type: null })).toEqual([
      fixtures[1],
    ]);
  });

  it("ands the category chip with the text", () => {
    expect(filterCards(fixtures, { query: "a", type: "NETWORK" })).toEqual([
      fixtures[0],
    ]);
    expect(filterCards(fixtures, { query: "tls", type: "NETWORK" })).toEqual(
      [],
    );
  });

  it("filters by category alone", () => {
    expect(filterCards(fixtures, { query: "", type: "PLATFORM" })).toEqual([
      fixtures[2],
    ]);
  });

  it("keeps the input order rather than ranking matches", () => {
    const matched = filterCards(fixtures, { query: "s", type: null });

    expect(matched.map((entry) => entry.id)).toEqual(
      fixtures
        .filter((entry) => matched.includes(entry))
        .map((entry) => entry.id),
    );
  });

  it("returns nothing when no card matches", () => {
    expect(filterCards(fixtures, { query: "zzz", type: null })).toEqual([]);
  });
});
