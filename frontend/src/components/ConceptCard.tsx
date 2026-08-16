"use client";

import { forwardRef, useState } from "react";
import type { ConceptCardData } from "@/types/concept";
import { CardBack } from "./CardBack";
import { CardFront } from "./CardFront";

interface ConceptCardProps {
  readonly card: ConceptCardData;
}

export const ConceptCard = forwardRef<HTMLDivElement, ConceptCardProps>(
  function ConceptCard({ card }, ref) {
    const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
    const isFlipped = flippedCardId === card.id;
    const toggleCard = () =>
      setFlippedCardId((currentCardId) =>
        currentCardId === card.id ? null : card.id,
      );

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={`${card.title} card, ${isFlipped ? "back" : "front"} shown`}
        aria-pressed={isFlipped}
        data-face={isFlipped ? "back" : "front"}
        className="concept-card relative flex min-h-0 w-full flex-1 flex-col cursor-pointer rounded-[29px] bg-[conic-gradient(from_210deg,_#67e8f9,_#8b5cf6,_#f6c453,_#22d3ee,_#67e8f9)] p-[2px] shadow-[0_0_55px_rgba(34,211,238,0.11)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050714]"
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
    );
  },
);
