"use client";

import { useState } from "react";
import type { ConceptCardData } from "@/types/concept";
import { ConceptCard } from "./ConceptCard";

interface ConceptDeckProps {
  readonly cards: readonly ConceptCardData[];
}

export function ConceptDeck({ cards }: ConceptDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (cards.length === 0) {
    return <p>No concept cards available.</p>;
  }

  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < cards.length - 1;
  const card = cards[activeIndex];

  return (
    <ConceptCard
      key={card.id}
      card={card}
      canGoPrevious={canGoPrevious}
      canGoNext={canGoNext}
      onPrevious={() => setActiveIndex((index) => Math.max(0, index - 1))}
      onNext={() => setActiveIndex((index) => Math.min(cards.length - 1, index + 1))}
    />
  );
}
