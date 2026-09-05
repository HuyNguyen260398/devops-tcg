import { ConceptExplorer } from "@/components/ConceptExplorer";
import { conceptCards } from "@/data/conceptCards";

export default function Home() {
  return (
    <main className="app-shell relative isolate overflow-hidden px-4 sm:px-6">
      <div className="stage-orb stage-orb-cyan" aria-hidden="true" />
      <div className="stage-orb stage-orb-violet" aria-hidden="true" />

      {/* The stage's width now depends on the layout, so the explorer owns it. */}
      <ConceptExplorer cards={conceptCards} />
    </main>
  );
}
