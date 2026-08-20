"use client";

import { useId, useState } from "react";
import type { ConceptCardData } from "@/types/concept";

interface CardFrontProps {
  readonly card: ConceptCardData;
}

export function CardFront({ card }: CardFrontProps) {
  const [imageFailed, setImageFailed] = useState(false);
  // Several cards are mounted at once, so section ids must not collide.
  const headingId = useId();
  const definitionHeadingId = `${headingId}-definition`;
  const keywordsHeadingId = `${headingId}-keywords`;

  return (
    // The face is the scroll container, so this block must be free to grow past
    // it: a height-capped flex column lets long content spill out of its own
    // padding box and leaves the last line sitting on the card's bottom edge.
    <article className="relative min-h-full">
      <header className="flex items-center justify-between px-4 pb-3 pt-4 text-[0.65rem] font-bold tracking-[0.18em] text-chip-ink">
        <span className="rounded-full border border-chip-border bg-chip px-3 py-1.5">
          {card.cardNumber}
        </span>
        <span className="rounded-full border border-type-chip-border bg-type-chip px-3 py-1.5 text-type-chip-ink">
          {card.type}
        </span>
      </header>

      <div className="relative h-[220px] overflow-hidden bg-thumb-backdrop sm:h-[230px]">
        {imageFailed ? (
          <div
            role="img"
            aria-label={card.image.alt}
            className="card-thumbnail-fallback flex h-full items-center justify-center px-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-accent-ink"
          >
            {card.title} {card.type.toLowerCase()} concept
          </div>
        ) : (
          // Both artworks are mounted and CSS shows the one the current theme
          // calls for. `display: none` also drops the other from the
          // accessibility tree, so exactly one description is announced.
          // The static export must preserve these exact local paths; next/image
          // rewrites them to absolute URLs even when optimization is disabled.
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image.src}
              alt={card.image.alt}
              loading="eager"
              decoding="async"
              className="card-thumbnail card-thumbnail-neon h-full w-full object-cover object-center"
              onError={() => setImageFailed(true)}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.image.sketch.src}
              alt={card.image.sketch.alt}
              loading="eager"
              decoding="async"
              className="card-thumbnail card-thumbnail-sketch h-full w-full object-cover object-center"
              onError={() => setImageFailed(true)}
            />
          </>
        )}
        <div
          className="card-thumbnail-veil absolute inset-0"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 flex flex-col px-5 pb-6 pt-4 sm:px-6 sm:pb-7">
        <div className="mb-4 border-b border-rule pb-4">
          <h2 className="font-display text-4xl font-black tracking-[-0.04em] text-ink">
            {card.title}
          </h2>
        </div>

        <section aria-labelledby={definitionHeadingId} className="mb-4">
          <h3
            id={definitionHeadingId}
            className="font-display mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-accent"
          >
            Definition
          </h3>
          <p className="rounded-card-inner border border-rule bg-panel p-4 text-sm leading-6 text-ink-muted shadow-inner">
            {card.definition}
          </p>
        </section>

        <section aria-labelledby={keywordsHeadingId}>
          <h3
            id={keywordsHeadingId}
            className="font-display mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-mark"
          >
            Key words
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {card.keywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-full border border-mark-border bg-mark-soft px-2.5 py-1 text-[0.68rem] font-medium text-mark-ink"
              >
                {keyword}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
