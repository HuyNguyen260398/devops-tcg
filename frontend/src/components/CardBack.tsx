import type { ConceptCardData } from "@/types/concept";

interface CardBackProps {
  readonly card: ConceptCardData;
}

export function CardBack({ card }: CardBackProps) {
  return (
    // The face is the scroll container, so this block must be free to grow
    // past it; a height-capped one drops its bottom padding under long content.
    <article className="relative z-10 min-h-full p-5 pb-6 sm:p-6 sm:pb-7">
      <header className="mb-5 flex items-start justify-between border-b border-rule pb-4">
        <h2 className="font-display text-3xl font-black tracking-[-0.03em] text-ink">
          {card.title}
        </h2>
        <p className="rounded-full border border-mark-border bg-mark-soft px-2.5 py-1.5 text-[0.55rem] font-bold tracking-[0.16em] text-mark-ink">
          ANATOMY / FLOW
        </p>
      </header>

      <section aria-labelledby="components-heading" className="mb-5">
        <h2
          id="components-heading"
          className="font-display mb-3 text-xs font-bold uppercase tracking-[0.22em] text-accent"
        >
          Components
        </h2>
        <dl className="space-y-2">
          {card.components.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-rule bg-panel px-3.5 py-2.5"
            >
              <dt className="text-xs font-bold text-ink">{item.name}</dt>
              <dd className="mt-1 text-[0.72rem] leading-4 text-ink-muted">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="flow-heading">
        <h2
          id="flow-heading"
          className="font-display mb-3 text-xs font-bold uppercase tracking-[0.22em] text-mark"
        >
          How it works
        </h2>
        <ol className="space-y-2.5">
          {card.howItWorks.map((item) => (
            <li
              key={item.step}
              className="grid grid-cols-[1.75rem_1fr] items-start gap-2.5"
            >
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-mark-border bg-mark-soft font-mono text-xs font-bold text-mark-ink"
              >
                {item.step}
              </span>
              <span className="pt-0.5 text-[0.72rem] leading-[1.15rem] text-ink-muted">
                {item.description}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
