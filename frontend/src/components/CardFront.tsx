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
    <article className="relative flex h-full flex-col">
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 text-[0.65rem] font-bold tracking-[0.18em] text-chip-ink">
        <span className="rounded-full border border-chip-border bg-chip px-3 py-1.5 shadow-lg">
          {card.cardNumber}
        </span>
        <span className="rounded-full border border-type-chip-border bg-type-chip px-3 py-1.5 text-type-chip-ink shadow-lg">
          {card.type}
        </span>
      </header>

      <div className="relative h-[220px] shrink-0 overflow-hidden bg-thumb-backdrop sm:h-[230px]">
        {imageFailed ? (
          <div
            role="img"
            aria-label={card.image.alt}
            className="card-thumbnail-fallback flex h-full items-center justify-center px-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-accent-ink"
          >
            {card.title} {card.type.toLowerCase()} concept
          </div>
        ) : (
          // The static export must preserve this exact local path; next/image
          // rewrites it to an absolute URL even when optimization is disabled.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.image.src}
            alt={card.image.alt}
            loading="eager"
            decoding="async"
            className="card-thumbnail h-full w-full object-cover object-center"
            onError={() => setImageFailed(true)}
          />
        )}
        <div
          className="card-thumbnail-veil absolute inset-0"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4 sm:px-6">
        <div className="mb-4 flex items-end justify-between border-b border-rule pb-4">
          <div>
            <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.24em] text-ink-faint">
              {card.series}
            </p>
            <h2 className="font-display text-4xl font-black tracking-[-0.04em] text-ink">
              {card.title}
            </h2>
          </div>
          <p className="pb-1 text-[0.6rem] font-bold tracking-[0.18em] text-mark">
            {card.descriptor}
          </p>
        </div>

        <section
          aria-labelledby={definitionHeadingId}
          className="mb-4 rounded-card-inner border border-rule bg-panel p-4 shadow-inner"
        >
          <h3
            id={definitionHeadingId}
            className="font-display mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-accent"
          >
            Basic definition
          </h3>
          <p className="text-sm leading-6 text-ink-muted">{card.definition}</p>
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
