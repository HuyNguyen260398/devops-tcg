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
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const isFlipped = flippedCardId === card.id;
  const toggleCard = () =>
    setFlippedCardId((currentCardId) =>
      currentCardId === card.id ? null : card.id,
    );

  return (
    <div className="concept-card-layout relative flex min-h-0 w-full flex-1 flex-col">
      <div
        role="button"
        tabIndex={0}
        aria-label={`${card.title} card, ${isFlipped ? "back" : "front"} shown`}
        aria-pressed={isFlipped}
        data-face={isFlipped ? "back" : "front"}
        className="concept-card relative mx-auto flex min-h-0 w-full max-w-[350px] flex-1 flex-col cursor-pointer rounded-[29px] bg-[conic-gradient(from_210deg,_#67e8f9,_#8b5cf6,_#f6c453,_#22d3ee,_#67e8f9)] p-[2px] shadow-[0_0_55px_rgba(34,211,238,0.11)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050714]"
        onClick={toggleCard}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleCard();
          }
        }}
      >
        <div className="concept-card-inner">
          <section
            className="card-face-front"
            data-testid="card-front"
            aria-hidden={isFlipped}
          >
            <CardFront key={card.id} card={card} />
          </section>
          <section
            className="card-face-back"
            data-testid="card-back"
            aria-hidden={!isFlipped}
          >
            <CardBack card={card} />
          </section>
        </div>
      </div>

      <DeckControls
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={() => {
          setFlippedCardId(null);
          onPrevious();
        }}
        onNext={() => {
          setFlippedCardId(null);
          onNext();
        }}
      />
    </div>
  );
}
