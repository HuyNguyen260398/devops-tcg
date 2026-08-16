"use client";

import { useState } from "react";
import type { ConceptCardData } from "@/types/concept";
import { ConceptCard } from "./ConceptCard";

interface ConceptDeckProps {
  readonly cards: readonly ConceptCardData[];
}

const formatPosition = (position: number) =>
  position.toString().padStart(2, "0");

export function ConceptDeck({ cards }: ConceptDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (cards.length === 0) {
    return <p>No concept cards available.</p>;
  }

  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < cards.length - 1;
  const card = cards[activeIndex];

  return (
    <section
      aria-label="Concept card deck"
      className="flex min-h-0 w-full max-w-[350px] flex-1 flex-col"
    >
      <header className="concept-deck-header flex w-full shrink-0 items-end justify-between border-b border-white/10">
        <div>
          <p className="mb-1 text-[0.65rem] font-semibold tracking-[0.28em] text-cyan-200/70">
            CONCEPT STUDY DECK
          </p>
          <h1 className="text-2xl font-black uppercase tracking-[0.12em] text-white sm:text-3xl">
            DevOps TCG
          </h1>
        </div>
        <p
          aria-label={`Card ${activeIndex + 1} of ${cards.length}`}
          aria-live="polite"
          className="pb-1 font-mono text-xs font-semibold tracking-[0.18em] text-slate-300"
        >
          {formatPosition(activeIndex + 1)} / {formatPosition(cards.length)}
        </p>
      </header>

      <ConceptCard
        card={card}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={() => setActiveIndex((index) => Math.max(0, index - 1))}
        onNext={() =>
          setActiveIndex((index) => Math.min(cards.length - 1, index + 1))
        }
      />
    </section>
  );
}
