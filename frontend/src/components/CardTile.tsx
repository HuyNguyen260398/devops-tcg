"use client";

import { useState } from "react";
import type { ConceptCardData } from "@/types/concept";

interface CardTileProps {
  readonly card: ConceptCardData;
  readonly onSelect: (card: ConceptCardData) => void;
}

// A tile is for recognising a card, not for reading it, so the definition stays
// on the card itself. The button carries the whole accessible name, which is
// why both artworks are decorative here: the alt text of the one the theme
// happens to show would otherwise change what the tile is called.
export function CardTile({ card, onSelect }: CardTileProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <li className="card-tile-item">
      <button
        type="button"
        aria-label={`Open the ${card.title} card`}
        onClick={() => onSelect(card)}
        className="card-tile flex h-full w-full flex-col overflow-hidden rounded-card border border-rule bg-panel text-left transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--paper)]"
      >
        <span className="flex items-center justify-between px-3 pb-2 pt-3 text-[0.55rem] font-bold tracking-[0.18em] text-chip-ink">
          <span className="rounded-full border border-chip-border bg-chip px-2 py-1">
            {card.cardNumber}
          </span>
          <span className="rounded-full border border-type-chip-border bg-type-chip px-2 py-1 text-type-chip-ink">
            {card.type}
          </span>
        </span>

        <span className="relative block h-[120px] overflow-hidden bg-thumb-backdrop">
          {imageFailed ? (
            <span className="card-thumbnail-fallback flex h-full items-center justify-center px-4 text-center text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-accent-ink">
              {card.type.toLowerCase()}
            </span>
          ) : (
            // The static export must preserve these exact local paths;
            // next/image rewrites them to absolute URLs even with optimization
            // disabled. CSS shows whichever the active theme calls for.
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="card-thumbnail card-thumbnail-neon h-full w-full object-cover object-center"
                onError={() => setImageFailed(true)}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image.sketch.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="card-thumbnail card-thumbnail-sketch h-full w-full object-cover object-center"
              />
            </>
          )}
        </span>

        <span className="flex flex-1 items-center px-3 py-3 font-display text-sm font-black uppercase tracking-[0.08em] text-ink">
          <span className="card-tile-title">{card.title}</span>
        </span>
      </button>
    </li>
  );
}
