"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleCards, type RandomSource } from "@/lib/shuffle";
import type { ConceptCardData } from "@/types/concept";
import { ConceptCard } from "./ConceptCard";
import { DeckControls } from "./DeckControls";

interface ConceptDeckProps {
  readonly cards: readonly ConceptCardData[];
  readonly random?: RandomSource;
}

const formatPosition = (position: number) =>
  position.toString().padStart(2, "0");

const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

// Cards within this many slots of the centre stay mounted. The outermost ring
// is staged off-stage and invisible so an arriving card can travel in rather
// than appear at its neighbouring position.
const SLOT_RADIUS = 2;

// A touch drag must clear this horizontally, and be more horizontal than
// vertical, before it counts as a swipe rather than a scroll of the card face.
const SWIPE_THRESHOLD = 45;

// How far the deck may trail the finger. Slightly past the 350px card cap, so a
// long drag still reads as holding the card rather than throwing it off stage.
const MAX_DRAG = 360;

// Vertical travel that latches a gesture as a scroll of the card face. Once
// latched it stays a scroll, so a finger drifting sideways mid-scroll cannot
// start dragging the deck out from under it.
const SCROLL_LATCH = 12;

// The shortest signed distance from the active card, so the deck can loop
// without a card ever jumping the long way around the order.
const slotOffset = (index: number, activeIndex: number, length: number) => {
  const half = Math.floor(length / 2);
  const offset = index - activeIndex;

  if (offset > half) return offset - length;
  if (offset < -half) return offset + length;
  return offset;
};

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

export function ConceptDeck({ cards, random = Math.random }: ConceptDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [deckOrder, setDeckOrder] = useState<DeckOrder | null>(null);
  const [direction, setDirection] = useState<NavigationDirection | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const restoreActiveFocus = useRef(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const isScrollGesture = useRef(false);
  const suppressFlip = useRef(false);
  const deckLength = deckOrder?.cards.length ?? 0;

  const navigate = useCallback(
    (requested: NavigationDirection, shouldRestoreCardFocus = false) => {
      if (deckLength < 2) return;

      restoreActiveFocus.current = shouldRestoreCardFocus;
      setDirection(requested);
      setIsFlipped(false);
      setActiveIndex((index) =>
        wrapIndex(index + (requested === "next" ? 1 : -1), deckLength),
      );
    },
    [deckLength],
  );

  useEffect(() => {
    if (cards.length === 0) return;

    setDeckOrder({
      sourceCards: cards,
      random,
      cards: shuffleCards(cards, random),
    });
    setActiveIndex(0);
    setDirection(null);
  }, [cards, random]);

  useEffect(() => {
    if (!restoreActiveFocus.current) return;

    activeCardRef.current?.focus();
    restoreActiveFocus.current = false;
  }, [activeIndex]);

  // Deck shortcuts listen on the document so they keep working when focus sits
  // outside the card, such as after the pointer scrolls a card face.
  useEffect(() => {
    if (deckLength === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (event.key === "Enter" || event.key === " ") {
        // A focused control keeps Enter and Space for its own activation.
        if (target?.closest("button")) return;

        event.preventDefault();
        setIsFlipped((flipped) => !flipped);
        return;
      }

      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      const cardHasFocus =
        activeCardRef.current === target ||
        Boolean(target && activeCardRef.current?.contains(target));
      navigate(event.key === "ArrowRight" ? "next" : "previous", cardHasFocus);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deckLength, navigate]);

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

  const toggleFlip = () => {
    // A swipe still ends in a click, which must not also flip the card.
    if (suppressFlip.current) {
      suppressFlip.current = false;
      return;
    }

    setIsFlipped((flipped) => !flipped);
  };

  // The drag is written straight to the track rather than held in state: a
  // gesture updates every frame, and re-rendering five mounted cards that often
  // would cost far more than it buys. The slot transforms stay untouched — the
  // whole track carries the offset, so the cards travel together.
  const setDrag = (offset: number | null) => {
    const track = trackRef.current;

    if (track === null) return;

    if (offset === null) {
      delete track.dataset.dragging;
      track.style.setProperty("--deck-drag", "0px");
      return;
    }

    track.dataset.dragging = "true";
    track.style.setProperty("--deck-drag", `${offset}px`);
  };

  const trackDrag = (event: React.PointerEvent) => {
    const start = swipeStart.current;

    if (start === null) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (
      isScrollGesture.current ||
      (Math.abs(deltaY) > SCROLL_LATCH && Math.abs(deltaY) > Math.abs(deltaX))
    ) {
      isScrollGesture.current = true;
      setDrag(null);
      return;
    }

    setDrag(Math.max(Math.min(deltaX, MAX_DRAG), -MAX_DRAG));
  };

  const endSwipe = (event: React.PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;

    if (start === null) return;

    // Releasing hands the deck back to the slot transitions: the track eases
    // home while the slots travel one gap, which compose into a single settle.
    const wasScroll = isScrollGesture.current;
    isScrollGesture.current = false;
    setDrag(null);

    if (wasScroll) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const isSwipe =
      Math.abs(deltaX) >= SWIPE_THRESHOLD &&
      Math.abs(deltaX) > Math.abs(deltaY);

    if (!isSwipe) return;

    suppressFlip.current = true;
    navigate(deltaX < 0 ? "next" : "previous");
  };

  return (
    <section
      aria-label="Concept card deck"
      className="concept-deck flex min-h-0 w-full flex-1 flex-col"
    >
      <DeckHeader position={activeIndex + 1} total={shuffledCards.length} />

      <div
        className="deck-carousel relative flex min-h-0 w-full flex-1"
        onPointerDown={(event) => {
          // Mouse drags stay available for selecting card text.
          if (event.pointerType === "mouse") return;
          swipeStart.current = { x: event.clientX, y: event.clientY };
          isScrollGesture.current = false;
        }}
        onPointerMove={trackDrag}
        onPointerUp={endSwipe}
        onPointerCancel={() => {
          // The browser took the gesture over to scroll a card face.
          swipeStart.current = null;
          isScrollGesture.current = false;
          setDrag(null);
        }}
      >
        <div
          ref={trackRef}
          data-testid="deck-track"
          data-direction={direction ?? undefined}
          className="deck-track relative min-h-0 w-full flex-1"
        >
          {shuffledCards.map((deckCard, index) => {
            const offset = slotOffset(index, activeIndex, shuffledCards.length);

            if (Math.abs(offset) > SLOT_RADIUS) return null;

            const isActive = offset === 0;

            return (
              <div
                key={deckCard.id}
                data-testid={`deck-slot-${deckCard.id}`}
                data-slot={offset}
                className="deck-slot"
              >
                <ConceptCard
                  ref={isActive ? activeCardRef : undefined}
                  card={deckCard}
                  isActive={isActive}
                  isFlipped={isFlipped}
                  onToggle={toggleFlip}
                />
              </div>
            );
          })}
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
