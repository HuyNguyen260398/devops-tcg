"use client";

import type { ConceptCardData } from "@/types/concept";
import { CardTile } from "./CardTile";

interface CardGridProps {
  readonly cards: readonly ConceptCardData[];
  readonly onSelect: (card: ConceptCardData) => void;
  // Set only while the page's entrance is fading the grid in.
  readonly arriving?: boolean;
}

export function CardGrid({ cards, onSelect, arriving = false }: CardGridProps) {
  return (
    // The grid scrolls inside the locked 100dvh shell rather than scrolling the
    // document, so `body { overflow: hidden }` and the fixed header survive.
    <ul
      aria-label="Concept cards"
      data-arriving={arriving ? "true" : undefined}
      className="card-grid min-h-0 flex-1"
    >
      {cards.map((card) => (
        <CardTile key={card.id} card={card} onSelect={onSelect} />
      ))}
    </ul>
  );
}
