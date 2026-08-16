import type { ConceptCardData } from "@/types/concept";

interface DeckPreviewProps {
  readonly card: ConceptCardData;
  readonly position: "previous" | "next";
}

export function DeckPreview({ card, position }: DeckPreviewProps) {
  return (
    <div
      aria-hidden="true"
      data-deck-preview=""
      data-testid={`deck-preview-${position}`}
      data-card-title={card.title}
      className={`deck-preview deck-preview-${position}`}
    >
      <div className="deck-preview-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image.src}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        <div className="deck-preview-shade" />
        <div className="deck-preview-copy">
          <span>{card.type}</span>
          <strong>{card.title}</strong>
        </div>
      </div>
    </div>
  );
}
