"use client";

import { useEffect, useRef, useState } from "react";
import { shuffleCards, type RandomSource } from "@/lib/shuffle";
import type { ConceptCardData } from "@/types/concept";
import { ConceptCard } from "./ConceptCard";
import { DeckControls } from "./DeckControls";
import { DeckPreview } from "./DeckPreview";

interface ConceptDeckProps {
  readonly cards: readonly ConceptCardData[];
  readonly random?: RandomSource;
}

const formatPosition = (position: number) =>
  position.toString().padStart(2, "0");

const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

type NavigationDirection = "previous" | "next";

interface DeckHeaderProps {
  readonly position: number | null;
  readonly total: number;
}

function DeckHeader({ position, total }: DeckHeaderProps) {
  const ready = position !== null;

  return (
    <header className="concept-deck-header mx-auto flex w-full max-w-[350px] shrink-0 flex-col items-center border-b border-white/10 text-center">
      <h1 className="text-2xl font-black uppercase tracking-[0.12em] text-white sm:text-3xl">
        DevOps TCG
      </h1>
      <p
        aria-label={ready ? `Card ${position} of ${total}` : undefined}
        aria-live={ready ? "polite" : undefined}
        aria-hidden={ready ? undefined : true}
        className="mt-1 font-mono text-xs font-semibold tracking-[0.18em] text-slate-300"
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
      className="concept-deck flex min-h-0 w-full flex-1 flex-col"
    >
      <DeckHeader position={null} total={total} />
      <div
        role="status"
        aria-busy="true"
        aria-label="Shuffling cards"
        className="concept-card-layout flex min-h-0 w-full flex-1 flex-col"
      >
        <div className="concept-card concept-card-placeholder relative mx-auto flex min-h-0 w-full flex-1 flex-col p-[2px]">
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

interface DeckMotion {
  readonly direction: NavigationDirection;
  readonly sequence: number;
}

export function ConceptDeck({ cards, random = Math.random }: ConceptDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [deckOrder, setDeckOrder] = useState<DeckOrder | null>(null);
  const [motion, setMotion] = useState<DeckMotion | null>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const restoreActiveFocus = useRef(false);

  useEffect(() => {
    if (cards.length === 0) return;

    setDeckOrder({
      sourceCards: cards,
      random,
      cards: shuffleCards(cards, random),
    });
    setActiveIndex(0);
    setMotion(null);
  }, [cards, random]);

  useEffect(() => {
    if (!restoreActiveFocus.current) return;

    activeCardRef.current?.focus();
    restoreActiveFocus.current = false;
  }, [activeIndex]);

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
  const hasMultipleCards = shuffledCards.length > 1;
  const card = shuffledCards[activeIndex];
  const previousCard =
    shuffledCards[wrapIndex(activeIndex - 1, shuffledCards.length)];
  const nextCard =
    shuffledCards[wrapIndex(activeIndex + 1, shuffledCards.length)];

  const navigate = (
    direction: NavigationDirection,
    shouldRestoreCardFocus = false,
  ) => {
    if (!hasMultipleCards) return;

    restoreActiveFocus.current = shouldRestoreCardFocus;
    setMotion((current) => ({
      direction,
      sequence: (current?.sequence ?? 0) + 1,
    }));
    setActiveIndex((index) =>
      wrapIndex(index + (direction === "next" ? 1 : -1), shuffledCards.length),
    );
  };

  return (
    <section
      aria-label="Concept card deck"
      className="concept-deck flex min-h-0 w-full flex-1 flex-col"
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
          return;
        }

        event.preventDefault();
        const eventTarget = event.target as Node;
        const cardHasFocus =
          activeCardRef.current === eventTarget ||
          Boolean(activeCardRef.current?.contains(eventTarget));
        navigate(
          event.key === "ArrowRight" ? "next" : "previous",
          cardHasFocus,
        );
      }}
    >
      <DeckHeader position={activeIndex + 1} total={shuffledCards.length} />

      <div className="deck-carousel relative flex min-h-0 w-full flex-1">
        <div
          key={motion?.sequence ?? 0}
          data-testid="deck-track"
          data-direction={motion?.direction}
          className="deck-track relative flex min-h-0 w-full flex-1 items-stretch justify-center"
        >
          {hasMultipleCards ? (
            <DeckPreview card={previousCard} position="previous" />
          ) : null}
          <div className="deck-active-card relative z-10 flex min-h-0">
            <ConceptCard ref={activeCardRef} card={card} />
          </div>
          {hasMultipleCards ? (
            <DeckPreview card={nextCard} position="next" />
          ) : null}
        </div>
      </div>

      <DeckControls
        canGoPrevious={hasMultipleCards}
        canGoNext={hasMultipleCards}
        onPrevious={() => navigate("previous")}
        onNext={() => navigate("next")}
      />
    </section>
  );
}
