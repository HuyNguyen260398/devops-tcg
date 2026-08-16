import { ConceptDeck } from "@/components/ConceptDeck";
import { conceptCards } from "@/data/conceptCards";

export default function Home() {
  return (
    <main className="app-shell relative isolate overflow-hidden px-4 sm:px-6">
      <div className="stage-orb stage-orb-cyan" aria-hidden="true" />
      <div className="stage-orb stage-orb-violet" aria-hidden="true" />

      <div className="app-stage relative z-10 mx-auto flex min-h-0 w-full max-w-5xl flex-col items-center">
        <ConceptDeck cards={conceptCards} />

        <p className="deck-hint max-w-sm shrink-0 text-center text-xs leading-5 text-slate-400 sm:text-sm">
          Click the card or use Enter or Space to flip it.
        </p>
      </div>
    </main>
  );
}
