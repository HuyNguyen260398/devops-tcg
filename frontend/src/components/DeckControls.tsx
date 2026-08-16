interface DeckControlsProps {
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
}

export function DeckControls({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: DeckControlsProps) {
  const buttonClassName =
    "deck-arrow pointer-events-auto absolute flex h-[46px] w-[46px] items-center justify-center rounded-full border border-cyan-200/35 bg-[#071226]/95 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.18)] backdrop-blur-md transition-[border-color,background-color,transform,opacity] duration-200 hover:border-cyan-200/70 hover:bg-cyan-300/15 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050714] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-cyan-200/35 disabled:hover:bg-[#071226]/95";

  return (
    <nav
      aria-label="Card controls"
      className="deck-controls pointer-events-none fixed inset-0 z-30"
    >
      <button
        type="button"
        aria-label="Previous card"
        disabled={!canGoPrevious}
        onClick={onPrevious}
        className={`${buttonClassName} deck-arrow-previous`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next card"
        disabled={!canGoNext}
        onClick={onNext}
        className={`${buttonClassName} deck-arrow-next`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </nav>
  );
}
