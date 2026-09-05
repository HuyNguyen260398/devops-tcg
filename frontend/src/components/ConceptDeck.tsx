"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { shuffleCards, type RandomSource } from "@/lib/shuffle";
import type { ConceptCardData } from "@/types/concept";
import { ConceptCard } from "./ConceptCard";
import { DeckControls } from "./DeckControls";
import { ShuffleControl } from "./ShuffleControl";

interface ConceptDeckProps {
  readonly cards: readonly ConceptCardData[];
  readonly random?: RandomSource;
}

const formatPosition = (position: number) =>
  position.toString().padStart(2, "0");

const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

// How many ranks of cards flank the centre, so the deck spreads across the
// screen it is given rather than always showing three cards. The thresholds
// are derived from the slot geometry in globals.css — a rank is on screen
// while its inner edge is still inside the viewport, which for the capped
// 350px card at an even 2rem between cards puts rank two past 1108px, rank
// three past 1732px and rank four past 2286px. Rank one is always at least
// partly on screen, down to 320px. Change the geometry tokens and these move
// with them.
const RANK_BREAKPOINTS = [1110, 1735, 2290];

const ranksForWidth = (width: number) =>
  RANK_BREAKPOINTS.reduce(
    (ranks, breakpoint) => (width > breakpoint ? ranks + 1 : ranks),
    1,
  );

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

// The reel. A shuffle deals a new order and then slides it past the viewer,
// right to left, one card at a time — so the cards that fly by are the new
// deck, and the card it coasts to a stop on is the one it dealt.
//
// The travel is the deck's ordinary slot transition, repeated: each step
// advances the active index by one and writes that step's own duration and
// easing onto the track, so there is no second animation system to keep in
// step with the first. Steps run flat out until the last few, which stretch
// towards SPIN_SLOWEST and brake the reel to a stop.
const SPIN_MIN_STEPS = 8;
// So no two shuffles run the same length, and the card it lands on is not a
// fixed distance away.
const SPIN_EXTRA_STEPS = 4;
const SPIN_FAST = 80;
const SPIN_SLOWEST = 360;
const SPIN_BRAKE_STEPS = 4;
// Each flat-out step eases straight into the next, so the reel reads as one
// continuous slide rather than a series of nudges. Only the last step, which
// has a card to land on, is shaped.
const SPIN_EASE = "linear";
const SPIN_SETTLE_EASE = "cubic-bezier(0.16, 0.84, 0.32, 1)";

// `remaining` counts the steps left, this one included, so the reel brakes over
// the last SPIN_BRAKE_STEPS however long the spin turned out to be.
const spinStepDuration = (remaining: number) => {
  if (remaining > SPIN_BRAKE_STEPS) return SPIN_FAST;

  const braking = (SPIN_BRAKE_STEPS - remaining + 1) / SPIN_BRAKE_STEPS;

  return Math.round(SPIN_FAST + (SPIN_SLOWEST - SPIN_FAST) * braking);
};

// A reel is an animation with a delayed payload, so with motion turned down the
// payload has to land at once rather than after an animation nobody sees.
const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// The shortest signed distance from the active card, so the deck can loop
// without a card ever jumping the long way around the order.
const slotOffset = (index: number, activeIndex: number, length: number) => {
  const half = Math.floor(length / 2);
  const offset = index - activeIndex;

  if (offset > half) return offset - length;
  if (offset < -half) return offset + length;
  return offset;
};

// The deck's shortcuts listen on the document, so they must stand aside for
// anything that owns its own keys: a space typed into the search field is a
// space, not a flip, and an arrow key inside a dialog belongs to that dialog.
const ownsItsOwnKeys = (element: HTMLElement | null): boolean =>
  element !== null &&
  (element.isContentEditable ||
    element.tagName === "INPUT" ||
    element.tagName === "TEXTAREA" ||
    element.tagName === "SELECT" ||
    element.closest('[role="dialog"]') !== null);

type NavigationDirection = "previous" | "next";

// Which way the card rotates about its Y axis. Both land the same face and
// both are edge-on at half the flip, where the faces swap visibility.
export type FlipDirection = "forward" | "reverse";

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

// The title, the theme toggle and the search now live in AppHeader; the deck
// keeps only the counter, which is deck state. It still sits directly under the
// application header, so the layout reads exactly as it did before the split.
function DeckHeader({ position, total }: DeckHeaderProps) {
  const ready = position !== null;

  return (
    <header className="concept-deck-header mx-auto flex w-full max-w-[350px] shrink-0 flex-col items-center text-center">
      <p
        aria-label={ready ? `Card ${position} of ${total}` : undefined}
        aria-live={ready ? "polite" : undefined}
        aria-hidden={ready ? undefined : true}
        className="font-mono text-xs font-semibold tracking-[0.18em] text-ink-muted"
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
      {/* Rendered inert rather than omitted: the deck is a locked 100dvh
          column, so a control that only appeared after mount would take its
          height out of the card and shift the whole layout at hydration. */}
      <ShuffleControl disabled />
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
  const [flipDirection, setFlipDirection] = useState<FlipDirection>("forward");
  const [isSpinning, setIsSpinning] = useState(false);
  // The server cannot know the viewport, so the deck renders its narrowest
  // spread until the measurement lands — in the same effect flush as the
  // shuffle, so the reader never sees the deck widen.
  const [ranks, setRanks] = useState(1);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const restoreActiveFocus = useRef(false);
  const gesture = useRef<SwipeGesture | null>(null);
  const suppressFlip = useRef(false);
  const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const deckLength = deckOrder?.cards.length ?? 0;

  const navigate = useCallback(
    (requested: NavigationDirection, shouldRestoreCardFocus = false) => {
      // A deck mid-spin has no card in hand to leave or turn.
      if (deckLength < 2 || isSpinning) return;

      restoreActiveFocus.current = shouldRestoreCardFocus;
      setDirection(requested);
      setIsFlipped(false);
      setActiveIndex((index) =>
        wrapIndex(index + (requested === "next" ? 1 : -1), deckLength),
      );
    },
    [deckLength, isSpinning],
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
    const measure = () => setRanks(ranksForWidth(window.innerWidth));

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!restoreActiveFocus.current) return;

    activeCardRef.current?.focus();
    restoreActiveFocus.current = false;
  }, [activeIndex]);

  // Which way the card turns is a coin toss, so the flip is not the same
  // animation every time. Re-rolling on the way back costs nothing: the front's
  // transform is 0 whichever way the card last turned, so nothing jumps.
  const flip = useCallback(() => {
    if (isSpinning) return;

    setFlipDirection(random() < 0.5 ? "reverse" : "forward");
    setIsFlipped((flipped) => !flipped);
  }, [random, isSpinning]);

  // Deal a new order, then slide it past and stop on the card it dealt.
  const shuffle = useCallback(() => {
    if (deckOrder === null || deckLength < 2 || isSpinning) return;

    // The reel starts from the card already in hand: the new order is rotated
    // so that card keeps its place, and the slide is what reveals the rest of
    // it. Dealing without the rotation would cut to a different card before
    // the reel had moved a pixel.
    const inHand = deckOrder.cards[activeIndex];
    const dealt = shuffleCards(deckOrder.cards, random);
    const rotation = wrapIndex(dealt.indexOf(inHand) - activeIndex, deckLength);
    const cards = [...dealt.slice(rotation), ...dealt.slice(0, rotation)];
    // Which card it stops on falls out of the deal rather than being chosen
    // here: the order is new, so a fixed band of steps still lands anywhere in
    // the deck while keeping the spin a predictable length.
    const steps = SPIN_MIN_STEPS + Math.floor(random() * SPIN_EXTRA_STEPS);

    setDeckOrder({ ...deckOrder, cards });
    setIsFlipped(false);
    setDirection("next");

    if (prefersReducedMotion()) {
      setActiveIndex(wrapIndex(activeIndex + steps, deckLength));
      return;
    }

    // The step's timing is written to the track's own style rather than held
    // in state: it is read only by the slot transitions, and the index change
    // that follows it in the same tick is what the browser transitions.
    const setStepTiming = (duration: number, ease: string) => {
      trackRef.current?.style.setProperty("--travel", `${duration}ms`);
      trackRef.current?.style.setProperty("--travel-ease", ease);
    };

    const advance = (remaining: number) => {
      if (remaining === 0) {
        trackRef.current?.style.removeProperty("--travel");
        trackRef.current?.style.removeProperty("--travel-ease");
        spinTimer.current = null;
        setIsSpinning(false);
        return;
      }

      const duration = spinStepDuration(remaining);

      setStepTiming(duration, remaining === 1 ? SPIN_SETTLE_EASE : SPIN_EASE);
      setActiveIndex((index) => wrapIndex(index + 1, deckLength));
      // The reel is only at rest once the last step's travel has played out,
      // so the wait after each step is that step's own duration.
      spinTimer.current = setTimeout(() => advance(remaining - 1), duration);
    };

    setIsSpinning(true);
    advance(steps);
  }, [deckOrder, deckLength, activeIndex, isSpinning, random]);

  // A reel left in flight by an unmount must not wake up to set state.
  useEffect(
    () => () => {
      if (spinTimer.current !== null) clearTimeout(spinTimer.current);
    },
    [],
  );

  // Deck shortcuts listen on the document so they keep working when focus sits
  // outside the card, such as after the pointer scrolls a card face.
  useEffect(() => {
    if (deckLength === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (ownsItsOwnKeys(target)) return;

      if (event.key === "Enter" || event.key === " ") {
        // A focused control keeps Enter and Space for its own activation.
        if (target?.closest("button")) return;

        event.preventDefault();
        flip();
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
  }, [deckLength, navigate, flip]);

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
  // One more rank than the deck shows, staged invisibly, so an arriving card
  // travels in rather than appearing at the rank next to the centre. A short
  // deck cannot fill that many ranks without a card claiming two slots at
  // once, so it caps the spread instead.
  const slotRadius = Math.min(ranks + 1, Math.floor(shuffledCards.length / 2));

  const toggleFlip = () => {
    // A swipe still ends in a click, which must not also flip the card.
    if (suppressFlip.current) {
      suppressFlip.current = false;
      return;
    }

    flip();
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

          // The reel owns the deck until it stops. CSS already takes the
          // track's pointer events away; this covers the margin around it.
          if (isSpinning) return;

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
          data-spinning={isSpinning ? "true" : undefined}
          className="deck-track relative min-h-0 w-full flex-1"
        >
          {shuffledCards.map((deckCard, index) => {
            const offset = slotOffset(index, activeIndex, shuffledCards.length);
            const depth = Math.abs(offset);

            if (depth > slotRadius) return null;

            const isActive = offset === 0;

            return (
              <div
                key={deckCard.id}
                data-testid={`deck-slot-${deckCard.id}`}
                data-slot={offset}
                data-staged={
                  depth === slotRadius && depth > 0 ? "true" : undefined
                }
                // The rank's own position, size, tilt and fade are worked out
                // from these two numbers in globals.css, so a wider screen is
                // more ranks and nothing else.
                style={
                  {
                    "--depth": depth,
                    "--side": Math.sign(offset),
                  } as React.CSSProperties
                }
                className="deck-slot"
              >
                <ConceptCard
                  ref={isActive ? activeCardRef : undefined}
                  card={deckCard}
                  isActive={isActive}
                  isFlipped={isFlipped}
                  flipDirection={flipDirection}
                  onToggle={toggleFlip}
                />
              </div>
            );
          })}
        </div>
      </div>

      <ShuffleControl disabled={!hasMultipleCards} onShuffle={shuffle} />

      <DeckControls
        canGoPrevious={hasMultipleCards}
        canGoNext={hasMultipleCards}
        onPrevious={() => navigate("previous")}
        onNext={() => navigate("next")}
      />
    </section>
  );
}
