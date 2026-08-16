"use client";

import { forwardRef } from "react";
import type { ConceptCardData } from "@/types/concept";
import { CardBack } from "./CardBack";
import { CardFront } from "./CardFront";

interface ConceptCardProps {
  readonly card: ConceptCardData;
  readonly isActive: boolean;
  readonly isFlipped?: boolean;
  readonly onToggle?: () => void;
}

// The foil edge and glow live on the faces, not here, so they turn away with
// them instead of staying behind the flip as a bright slab.
const baseClassName =
  "concept-card relative flex min-h-0 w-full flex-1 flex-col rounded-[29px]";

const activeClassName = "cursor-pointer focus-visible:outline-none";

export const ConceptCard = forwardRef<HTMLDivElement, ConceptCardProps>(
  function ConceptCard({ card, isActive, isFlipped = false, onToggle }, ref) {
    // The deck owns the flip so its keyboard shortcuts work from anywhere on
    // the page, not only while the card itself holds focus.
    const showBack = isActive && isFlipped;

    if (!isActive) {
      return (
        <div ref={ref} aria-hidden="true" className={baseClassName}>
          <div className="deck-slot-veil" />
          <div className="concept-card-inner">
            <section className="card-face-front">
              <CardFront card={card} />
            </section>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-label={`${card.title} card, ${showBack ? "back" : "front"} shown`}
        aria-pressed={showBack}
        data-face={showBack ? "back" : "front"}
        className={`${baseClassName} ${activeClassName}`}
        onClick={onToggle}
      >
        <div className="concept-card-inner">
          <section
            className="card-face-front"
            data-testid="card-front"
            aria-hidden={showBack}
          >
            <CardFront card={card} />
          </section>
          <section
            className="card-face-back"
            data-testid="card-back"
            aria-hidden={!showBack}
          >
            <CardBack card={card} />
          </section>
        </div>
      </div>
    );
  },
);
