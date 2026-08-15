"use client";

import { useState } from "react";
import type { ConceptCardData } from "@/types/concept";
import { CardBack } from "./CardBack";
import { CardFront } from "./CardFront";
import { DeckControls } from "./DeckControls";

interface ConceptCardProps {
  readonly card: ConceptCardData;
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

export function ConceptCard({
  card,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: ConceptCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const toggleCard = () => setIsFlipped((currentFace) => !currentFace);

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={`${card.title} card, ${isFlipped ? "back" : "front"} shown`}
        aria-pressed={isFlipped}
        data-face={isFlipped ? "back" : "front"}
        onClick={toggleCard}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleCard();
          }
        }}
      >
        <section data-testid="card-front" aria-hidden={isFlipped}>
          <CardFront card={card} />
        </section>
        <section data-testid="card-back" aria-hidden={!isFlipped}>
          <CardBack card={card} />
        </section>
      </div>

      <DeckControls
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        isFlipped={isFlipped}
        onPrevious={onPrevious}
        onFlip={toggleCard}
        onNext={onNext}
      />
    </div>
  );
}
