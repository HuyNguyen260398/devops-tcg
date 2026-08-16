"use client";

import { useEffect, useState } from "react";
import { shuffleCards, type RandomSource } from "@/lib/shuffle";
import type { ConceptCardData } from "@/types/concept";
import { ConceptCard } from "./ConceptCard";

interface ConceptDeckProps {
  readonly cards: readonly ConceptCardData[];
  readonly random?: RandomSource;
}

const formatPosition = (position: number) =>
  position.toString().padStart(2, "0");

interface DeckHeaderProps {
  readonly position: number | null;
  readonly total: number;
}

function DeckHeader({ position, total }: DeckHeaderProps) {
  const ready = position !== null;

  return (
    <header className="concept-deck-header flex w-full shrink-0 items-end justify-between border-b border-white/10">
      <h1 className="text-2xl font-black uppercase tracking-[0.12em] text-white sm:text-3xl">
        DevOps TCG
      </h1>
      <p
        aria-label={ready ? `Card ${position} of ${total}` : undefined}
        aria-live={ready ? "polite" : undefined}
        aria-hidden={ready ? undefined : true}
        className="pb-1 font-mono text-xs font-semibold tracking-[0.18em] text-slate-300"
      >
        {ready ? formatPosition(position) : "--"} / {formatPosition(total)}
      </p>
    </header>
  );
}

function DeckPlaceholder({ total }: { readonly total: number }) {
  return (
    <section
      aria-label="Concept card deck"
      className="flex min-h-0 w-full max-w-[350px] flex-1 flex-col"
    >
      <DeckHeader position={null} total={total} />
      <div
        role="status"
        aria-busy="true"
        aria-label="Shuffling cards"
        className="concept-card-layout flex min-h-0 w-full flex-1 flex-col"
      >
        <div className="concept-card concept-card-placeholder relative mx-auto flex min-h-0 w-full max-w-[350px] flex-1 flex-col p-[2px]">
          <div className="concept-card-placeholder-surface h-full w-full rounded-[26px]" />
        </div>
      </div>
    </section>
  );
}

interface DeckOrder {
  readonly sourceCards: readonly ConceptCardData[];
  readonly random: RandomSource;
  readonly cards: readonly ConceptCardData[];
}

export function ConceptDeck({ cards, random = Math.random }: ConceptDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [deckOrder, setDeckOrder] = useState<DeckOrder | null>(null);

  useEffect(() => {
    if (cards.length === 0) return;

    setDeckOrder({
      sourceCards: cards,
      random,
      cards: shuffleCards(cards, random),
    });
    setActiveIndex(0);
  }, [cards, random]);

  if (cards.length === 0) {
    return <p>No concept cards available.</p>;
  }

  if (
    deckOrder === null ||
    deckOrder.sourceCards !== cards ||
    deckOrder.random !== random
  ) {
    return <DeckPlaceholder total={cards.length} />;
  }

  const shuffledCards = deckOrder.cards;
  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < shuffledCards.length - 1;
  const card = shuffledCards[activeIndex];

  return (
    <section
      aria-label="Concept card deck"
      className="flex min-h-0 w-full max-w-[350px] flex-1 flex-col"
    >
      <DeckHeader position={activeIndex + 1} total={shuffledCards.length} />

      <ConceptCard
        card={card}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onPrevious={() => setActiveIndex((index) => Math.max(0, index - 1))}
        onNext={() =>
          setActiveIndex((index) =>
            Math.min(shuffledCards.length - 1, index + 1),
          )
        }
      />
    </section>
  );
}
