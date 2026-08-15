"use client";

import { useState } from "react";
import type { ConceptCardData } from "@/types/concept";

interface CardFrontProps {
  readonly card: ConceptCardData;
}

export function CardFront({ card }: CardFrontProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="relative flex h-full flex-col">
      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 text-[0.65rem] font-bold tracking-[0.18em] text-white">
        <span className="rounded-full border border-white/20 bg-slate-950/65 px-3 py-1.5 shadow-lg backdrop-blur-md">
          {card.cardNumber}
        </span>
        <span className="rounded-full border border-cyan-200/30 bg-cyan-950/70 px-3 py-1.5 text-cyan-100 shadow-lg backdrop-blur-md">
          {card.type}
        </span>
      </header>

      <div className="relative h-[220px] shrink-0 overflow-hidden bg-slate-900 sm:h-[230px]">
        {imageFailed ? (
          <div
            role="img"
            aria-label={card.image.alt}
            className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.18),_transparent_65%)] px-8 text-center text-sm font-semibold uppercase tracking-[0.2em] text-cyan-100"
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
            className="h-full w-full object-cover object-center"
            onError={() => setImageFailed(true)}
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#08142b] via-transparent to-slate-950/35"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4 sm:px-6">
        <div className="mb-4 flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.24em] text-cyan-200/70">
              {card.series}
            </p>
            <h2 className="text-4xl font-black tracking-[-0.04em] text-white">
              {card.title}
            </h2>
          </div>
          <p className="pb-1 text-[0.6rem] font-bold tracking-[0.18em] text-violet-200">
            {card.descriptor}
          </p>
        </div>

        <section
          aria-labelledby="definition-heading"
          className="mb-4 rounded-2xl border border-white/10 bg-white/[0.055] p-4 shadow-inner backdrop-blur-sm"
        >
          <h3
            id="definition-heading"
            className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-cyan-200"
          >
            Basic definition
          </h3>
          <p className="text-sm leading-6 text-slate-100">{card.definition}</p>
        </section>

        <section aria-labelledby="keywords-heading">
          <h3
            id="keywords-heading"
            className="mb-2 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-violet-200"
          >
            Key words
          </h3>
          <ul className="flex flex-wrap gap-1.5">
            {card.keywords.map((keyword) => (
              <li
                key={keyword}
                className="rounded-full border border-violet-300/20 bg-violet-400/10 px-2.5 py-1 text-[0.68rem] font-medium text-violet-100"
              >
                {keyword}
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-auto pt-3 text-center text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Flip for anatomy and flow
        </p>
      </div>
    </article>
  );
}
