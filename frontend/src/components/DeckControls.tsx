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
    <nav aria-label="Card controls">
      <button type="button" aria-label="Previous card" disabled={!canGoPrevious} onClick={onPrevious}>
        Previous
      </button>
      <button type="button" aria-label={isFlipped ? "Show card front" : "Show card back"} onClick={onFlip}>
        Flip
      </button>
      <button type="button" aria-label="Next card" disabled={!canGoNext} onClick={onNext}>
        Next
      </button>
    </nav>
  );
}
