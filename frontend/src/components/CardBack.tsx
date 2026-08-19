import type { ConceptCardData } from "@/types/concept";

interface CardBackProps {
  readonly card: ConceptCardData;
}

export function CardBack({ card }: CardBackProps) {
  return (
    <article className="relative z-10 flex h-full flex-col p-5 sm:p-6">
      <header className="mb-5 flex items-start justify-between border-b border-rule pb-4">
        <div>
          <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.24em] text-ink-faint">
            {card.series}
          </p>
          <h2 className="font-display text-3xl font-black tracking-[-0.03em] text-ink">
            {card.title}
          </h2>
        </div>
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
