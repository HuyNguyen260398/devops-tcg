"use client";

import { useState } from "react";
import type { ConceptCardData } from "@/types/concept";

interface CardFrontProps {
  readonly card: ConceptCardData;
}

export function CardFront({ card }: CardFrontProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article>
      <header>
        <span>{card.cardNumber}</span>
        <span>{card.type}</span>
      </header>

      <div>
        {imageFailed ? (
          <div role="img" aria-label={card.image.alt}>
            Proxy network concept
          </div>
        ) : (
          <img src={card.image.src} alt={card.image.alt} onError={() => setImageFailed(true)} />
        )}
      </div>

      <div>
        <p>{card.series}</p>
        <h2>{card.title}</h2>
        <p>{card.descriptor}</p>
      </div>

      <section aria-labelledby="definition-heading">
        <h3 id="definition-heading">Basic definition</h3>
        <p>{card.definition}</p>
      </section>

      <section aria-labelledby="keywords-heading">
        <h3 id="keywords-heading">Key words</h3>
        <ul>
          {card.keywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
      </section>

      <p>Flip for anatomy and flow</p>
    </article>
  );
}
