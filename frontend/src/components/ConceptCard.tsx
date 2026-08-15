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
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label={`${card.title} card, ${isFlipped ? "back" : "front"} shown`}
        aria-pressed={isFlipped}
        data-face={isFlipped ? "back" : "front"}
        className="concept-card relative mx-auto w-full max-w-[350px] cursor-pointer rounded-[29px] bg-[conic-gradient(from_210deg,_#67e8f9,_#8b5cf6,_#f6c453,_#22d3ee,_#67e8f9)] p-[2px] shadow-[0_0_55px_rgba(34,211,238,0.11)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050714]"
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
            <CardFront card={card} />
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
        isFlipped={isFlipped}
        onPrevious={onPrevious}
        onFlip={toggleCard}
        onNext={onNext}
      />
    </div>
  );
}
