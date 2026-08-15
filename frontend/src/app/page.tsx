import { ConceptDeck } from "@/components/ConceptDeck";
import { conceptCards } from "@/data/conceptCards";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10">
      <div className="stage-orb stage-orb-cyan" aria-hidden="true" />
      <div className="stage-orb stage-orb-violet" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
        <ConceptDeck cards={conceptCards} />

        <p className="mt-5 max-w-sm text-center text-xs leading-5 text-slate-400 sm:text-sm">
          Click the card or use Enter or Space to flip it.
        </p>
      </div>
    </main>
  );
}
