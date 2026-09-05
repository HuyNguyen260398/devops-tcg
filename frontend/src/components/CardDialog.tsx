"use client";

import { useEffect, useState } from "react";
import type { RandomSource } from "@/lib/shuffle";
import type { ConceptCardData } from "@/types/concept";
import { ConceptCard } from "./ConceptCard";
import type { FlipDirection } from "./ConceptDeck";
import { Dialog } from "./Dialog";

interface CardDialogProps {
  readonly cards: readonly ConceptCardData[];
  readonly index: number;
  readonly random?: RandomSource;
  readonly onIndexChange: (index: number) => void;
  readonly onClose: () => void;
}

const formatPosition = (position: number) =>
  position.toString().padStart(2, "0");

const wrapIndex = (index: number, length: number) =>
  ((index % length) + length) % length;

const arrowClassName =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-control-border bg-control text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]";

export function CardDialog({
  cards,
  index,
  random = Math.random,
  onIndexChange,
  onClose,
}: CardDialogProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipDirection, setFlipDirection] = useState<FlipDirection>("forward");
  const card = cards[index];
  const hasMultipleCards = cards.length > 1;

  // A card arriving in the dialog always arrives face up, exactly as one
  // arriving in the centre of the deck does.
  useEffect(() => setIsFlipped(false), [index]);

  // The same coin toss as the deck: both directions land the same face, and
  // both are edge-on at half the flip where the faces swap.
  const flip = () => {
    setFlipDirection(random() < 0.5 ? "reverse" : "forward");
    setIsFlipped((flipped) => !flipped);
  };

  const step = (offset: number) =>
    onIndexChange(wrapIndex(index + offset, cards.length));

  return (
    <Dialog
      label={`${card.title} card`}
      className="card-dialog max-w-[420px] items-center gap-3"
      onClose={onClose}
    >
      {/* min-h-0 is what makes every card the same size: without it this row
          keeps min-height:auto, so a card whose content is taller pushes the
          row past its flex basis and arrives bigger than the one before it. */}
      <div
        className="flex w-full min-h-0 flex-1 items-stretch gap-2"
        onKeyDown={(event) => {
          if (
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey
          ) {
            return;
          }

          const target = event.target as HTMLElement | null;

          if (event.key === "Enter" || event.key === " ") {
            // A focused control keeps Enter and Space for its own activation.
            // The card itself is a div with role="button", so a real <button>
            // ancestor is what distinguishes a control from the card.
            if (target?.closest("button") !== null) return;

            event.preventDefault();
            flip();
            return;
          }

          if (!hasMultipleCards) return;

          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }

          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
        }}
      >
        {hasMultipleCards && (
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Previous card"
              onClick={() => step(-1)}
              className={arrowClassName}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m15 6-6 6 6 6" />
              </svg>
            </button>
          </div>
        )}

        {/* The card is a flex column that fills its stage, exactly as a deck
            slot gives it one. */}
        <div className="card-dialog-stage flex min-h-0 flex-1 flex-col">
          <ConceptCard
            card={card}
            isActive
            isFlipped={isFlipped}
            flipDirection={flipDirection}
            onToggle={flip}
          />
        </div>

        {hasMultipleCards && (
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Next card"
              onClick={() => step(1)}
              className={arrowClassName}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
                focusable="false"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex w-full shrink-0 items-center justify-between gap-3">
        <p
          aria-label={`Card ${index + 1} of ${cards.length}`}
          aria-live="polite"
          className="font-mono text-xs font-semibold tracking-[0.18em] text-ink-muted"
        >
          {formatPosition(index + 1)} / {formatPosition(cards.length)}
        </p>
        <button
          type="button"
          aria-label="Close the card"
          onClick={onClose}
          className="flex h-9 items-center rounded-full border border-control-border bg-control px-4 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}
