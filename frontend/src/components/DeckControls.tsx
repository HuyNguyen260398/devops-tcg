interface DeckControlsProps {
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
  readonly isFlipped: boolean;
  readonly onPrevious: () => void;
  readonly onFlip: () => void;
  readonly onNext: () => void;
}

export function DeckControls({
  canGoPrevious,
  canGoNext,
  isFlipped,
  onPrevious,
  onFlip,
  onNext,
}: DeckControlsProps) {
  return (
    <nav
      aria-label="Card controls"
      className="mt-5 grid w-full grid-cols-3 gap-2 sm:gap-3"
    >
      <button
        type="button"
        aria-label="Previous card"
        disabled={!canGoPrevious}
        onClick={onPrevious}
        className="min-h-11 rounded-xl border border-white/10 bg-white/[0.055] px-2 text-xs font-semibold text-slate-200 transition-colors duration-200 hover:border-cyan-200/35 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050714] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/10 disabled:hover:bg-white/[0.055]"
      >
        Previous
      </button>
      <button
        type="button"
        aria-label={isFlipped ? "Show card front" : "Show card back"}
        onClick={onFlip}
        className="min-h-11 rounded-xl border border-violet-200/30 bg-gradient-to-r from-cyan-300/20 to-violet-400/20 px-2 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_8px_28px_rgba(103,232,249,0.08)] transition-[border-color,background-color,transform] duration-200 hover:border-cyan-200/55 hover:from-cyan-300/30 hover:to-violet-400/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050714]"
      >
        Flip
      </button>
      <button
        type="button"
        aria-label="Next card"
        disabled={!canGoNext}
        onClick={onNext}
        className="min-h-11 rounded-xl border border-white/10 bg-white/[0.055] px-2 text-xs font-semibold text-slate-200 transition-colors duration-200 hover:border-cyan-200/35 hover:bg-cyan-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050714] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/10 disabled:hover:bg-white/[0.055]"
      >
        Next
      </button>
    </nav>
  );
}
