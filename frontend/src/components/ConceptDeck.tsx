"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleCards, type RandomSource } from "@/lib/shuffle";
import type { ConceptCardData } from "@/types/concept";
import { ConceptCard } from "./ConceptCard";
import { DeckControls } from "./DeckControls";
import { ThemeToggle } from "./ThemeToggle";

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

// How far a slow, deliberate drag must travel before releasing it turns the
// card. A flick commits well short of this — see the FLICK_ constants.
const SWIPE_THRESHOLD = 32;

// How far the deck may trail the finger. Slightly past the 350px card cap, so a
// long drag still reads as holding the card rather than throwing it off stage.
const MAX_DRAG = 360;

// Travel on either axis that decides which one owns the gesture. The first axis
// to clear it keeps the gesture to the end, so a finger that arcs on its way
// out cannot be re-judged as a scroll halfway through a swipe.
const AXIS_LATCH = 8;

// A flick is judged on speed rather than distance, so a short fast throw turns
// the card instead of requiring the finger to drag it most of the way across.
const FLICK_VELOCITY = 0.35; // px per ms
const FLICK_DISTANCE = 24;
// A finger that came to rest before lifting is a drag, however fast it moved
// earlier, so stale velocity may not commit the card.
const FLICK_IDLE = 120;

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

// One gesture's whole life. `axis` is decided once and then never revisited,
// and `velocity` is the speed of the last sample so a release can tell a flick
// from a drag that merely ended in the same place.
interface SwipeGesture {
  x: number;
  y: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  axis: "undecided" | "horizontal" | "vertical";
}

interface DeckHeaderProps {
  readonly position: number | null;
  readonly total: number;
}

function DeckHeader({ position, total }: DeckHeaderProps) {
  const ready = position !== null;

  return (
    <header className="concept-deck-header mx-auto flex w-full max-w-[350px] shrink-0 flex-col items-center border-b border-rule text-center">
      <h1 className="font-display text-2xl font-black uppercase tracking-[0.12em] text-ink sm:text-3xl">
        DevOps TCG
      </h1>
      <p
        aria-label={ready ? `Card ${position} of ${total}` : undefined}
        aria-live={ready ? "polite" : undefined}
        aria-hidden={ready ? undefined : true}
        className="mt-1 font-mono text-xs font-semibold tracking-[0.18em] text-ink-muted"
      >
        {ready ? formatPosition(position) : "--"} / {formatPosition(total)}
      </p>
      <ThemeToggle />
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
  const gesture = useRef<SwipeGesture | null>(null);
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

  // The drag is written straight to the track's own transform rather than held
  // in state or in a custom property. State would re-render five mounted cards
  // on every frame of the gesture, and a custom property set on the track is
  // inherited, so changing it invalidates style for the entire card subtree —
  // for a value nothing below the track ever reads. The slot transforms stay
  // untouched: the whole track carries the offset, so the cards travel together.
  const setDrag = (offset: number | null) => {
    const track = trackRef.current;

    if (track === null) return;

    if (offset === null) {
      delete track.dataset.dragging;
      track.style.transform = "translate3d(0px, 0px, 0px)";
      return;
    }

    track.dataset.dragging = "true";
    track.style.transform = `translate3d(${offset}px, 0px, 0px)`;
  };

  // Capturing keeps the rest of the gesture coming to the carousel even when
  // the finger crosses the fixed side arrows, which otherwise swallow the
  // remaining moves and the release, leaving the card sitting still.
  const capturePointer = (event: React.PointerEvent) => {
    const surface = event.currentTarget;

    if (typeof surface.setPointerCapture !== "function") return;

    try {
      surface.setPointerCapture(event.pointerId);
    } catch {
      // Some pointers cannot be captured; the gesture still works without it.
    }
  };

  const trackDrag = (event: React.PointerEvent) => {
    const swipe = gesture.current;

    if (swipe === null) return;

    const deltaX = event.clientX - swipe.x;
    const deltaY = event.clientY - swipe.y;

    if (swipe.axis === "undecided") {
      if (Math.abs(deltaX) < AXIS_LATCH && Math.abs(deltaY) < AXIS_LATCH) {
        return;
      }

      swipe.axis =
        Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";

      if (swipe.axis === "horizontal") capturePointer(event);
    }

    if (swipe.axis === "vertical") {
      setDrag(null);
      return;
    }

    const now = performance.now();
    // Samples can arrive in the same millisecond, so the elapsed time is
    // floored rather than letting a zero divisor invent an enormous flick.
    const elapsed = Math.max(now - swipe.lastTime, 8);

    swipe.velocity = (event.clientX - swipe.lastX) / elapsed;
    swipe.lastX = event.clientX;
    swipe.lastTime = now;

    setDrag(Math.max(Math.min(deltaX, MAX_DRAG), -MAX_DRAG));
  };

  // Releasing hands the deck back to the slot transitions: the track eases
  // home while the slots travel one gap, which compose into a single settle.
  const commitSwipe = (clientX: number, clientY: number) => {
    const swipe = gesture.current;
    gesture.current = null;
    setDrag(null);

    if (swipe === null || swipe.axis === "vertical") return;

    const deltaX = clientX - swipe.x;
    const deltaY = clientY - swipe.y;

    // A gesture that never cleared the latch has no axis of its own, so the
    // release itself has to say which way the finger went.
    if (swipe.axis === "undecided" && Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    const isFlick =
      performance.now() - swipe.lastTime <= FLICK_IDLE &&
      Math.abs(swipe.velocity) >= FLICK_VELOCITY &&
      Math.abs(deltaX) >= FLICK_DISTANCE;

    if (!isFlick && Math.abs(deltaX) < SWIPE_THRESHOLD) return;

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

          // A swipe that produced no click leaves the guard armed, which would
          // otherwise eat the next tap instead of flipping the card.
          suppressFlip.current = false;
          gesture.current = {
            x: event.clientX,
            y: event.clientY,
            lastX: event.clientX,
            lastTime: performance.now(),
            velocity: 0,
            axis: "undecided",
          };
        }}
        onPointerMove={trackDrag}
        onPointerUp={(event) => commitSwipe(event.clientX, event.clientY)}
        onPointerCancel={() => {
          const swipe = gesture.current;

          // The browser took the gesture over. A gesture already latched as a
          // swipe has still travelled, and throwing that away is what left a
          // card sitting still after a swipe the finger clearly finished.
          if (swipe?.axis === "horizontal") {
            commitSwipe(swipe.lastX, swipe.y);
            return;
          }

          gesture.current = null;
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
