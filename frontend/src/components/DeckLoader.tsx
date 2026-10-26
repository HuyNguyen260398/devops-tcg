// The page's entrance: three card backs riffling like a hand being shuffled.
// It is what the server renders, and it moves on CSS alone, so it is on screen
// from the first paint rather than appearing once React hydrates.
export function DeckLoader() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading the deck"
      data-testid="deck-loader"
      className="deck-loader flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-5"
    >
      <div aria-hidden="true" className="deck-loader-fan">
        <span className="deck-loader-card" />
        <span className="deck-loader-card" />
        <span className="deck-loader-card" />
      </div>
      <p className="font-display text-[0.6rem] font-bold uppercase tracking-[0.22em] text-ink-faint">
        DEALING
      </p>
    </div>
  );
}
