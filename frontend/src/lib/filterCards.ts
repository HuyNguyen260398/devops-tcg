import type { ConceptCardData } from "@/types/concept";

export interface CardFilter {
  readonly query: string;
  // null is every category, so "no chip chosen" is a value rather than a
  // separate flag the callers would have to keep in step with the query.
  readonly type: string | null;
}

export const EMPTY_FILTER: CardFilter = { query: "", type: null };

export const cardTypes = (
  cards: readonly ConceptCardData[],
): readonly string[] => [...new Set(cards.map((card) => card.type))];

// Everything one typed word may reach, in one string. `components` and
// `howItWorks` are deliberately left out: their prose is long enough to match
// almost any word, which makes the filter feel arbitrary rather than helpful.
const haystack = (card: ConceptCardData): string =>
  [card.title, card.type, ...card.keywords, card.definition]
    .join(" ")
    .toLowerCase();

const tokenize = (query: string): readonly string[] =>
  query.toLowerCase().split(/\s+/).filter(Boolean);

export const filterCards = (
  cards: readonly ConceptCardData[],
  { query, type }: CardFilter,
): readonly ConceptCardData[] => {
  const tokens = tokenize(query);

  // Identity matters as much as the value: the deck re-deals its order
  // whenever its `cards` prop changes identity, so an unfiltered deck must
  // hand back the very array it was given.
  if (tokens.length === 0 && type === null) return cards;

  return cards.filter((card) => {
    if (type !== null && card.type !== type) return false;

    const text = haystack(card);

    // Tokens AND rather than OR, so a second word always narrows.
    return tokens.every((token) => text.includes(token));
  });
};
