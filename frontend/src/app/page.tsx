import { ConceptDeck } from "@/components/ConceptDeck";
import { conceptCards } from "@/data/conceptCards";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10">
      <div className="stage-orb stage-orb-cyan" aria-hidden="true" />
      <div className="stage-orb stage-orb-violet" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        <header className="mb-6 flex w-full max-w-[350px] items-end justify-between border-b border-white/10 pb-4">
          <div>
            <p className="mb-1 text-[0.65rem] font-semibold tracking-[0.28em] text-cyan-200/70">
              CONCEPT STUDY DECK
            </p>
            <h1 className="text-2xl font-black uppercase tracking-[0.12em] text-white sm:text-3xl">
              DevOps TCG
            </h1>
          </div>
          <p
            aria-label={`${conceptCards.length} card in this deck`}
            className="pb-1 font-mono text-xs font-semibold tracking-[0.18em] text-slate-300"
          >
            01 / 01
          </p>
        </header>

        <ConceptDeck cards={conceptCards} />

        <p className="mt-5 max-w-sm text-center text-xs leading-5 text-slate-400 sm:text-sm">
          Click the card or use Enter or Space to flip it.
        </p>
      </div>
    </main>
  );
}
