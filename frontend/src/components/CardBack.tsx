import type { ConceptCardData } from "@/types/concept";

interface CardBackProps {
  readonly card: ConceptCardData;
}

export function CardBack({ card }: CardBackProps) {
  return (
    <article className="relative z-10 flex h-full flex-col p-5 sm:p-6">
      <header className="mb-5 flex items-start justify-between border-b border-cyan-200/15 pb-4">
        <div>
          <p className="mb-1 text-[0.6rem] font-semibold tracking-[0.24em] text-cyan-200/65">
            {card.series}
          </p>
          <h2 className="text-3xl font-black tracking-[-0.03em] text-white">
            {card.title}
          </h2>
        </div>
        <p className="rounded-full border border-violet-300/20 bg-violet-400/10 px-2.5 py-1.5 text-[0.55rem] font-bold tracking-[0.16em] text-violet-100">
          ANATOMY / FLOW
        </p>
      </header>

      <section aria-labelledby="components-heading" className="mb-5">
        <h2
          id="components-heading"
          className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200"
        >
          Components
        </h2>
        <dl className="space-y-2">
          {card.components.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-white/10 bg-white/[0.045] px-3.5 py-2.5"
            >
              <dt className="text-xs font-bold text-white">{item.name}</dt>
              <dd className="mt-1 text-[0.72rem] leading-4 text-slate-300">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="flow-heading">
        <h2
          id="flow-heading"
          className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-violet-200"
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
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-300/25 bg-violet-400/10 font-mono text-xs font-bold text-violet-100"
              >
                {item.step}
              </span>
              <span className="pt-0.5 text-[0.72rem] leading-[1.15rem] text-slate-200">
                {item.description}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
