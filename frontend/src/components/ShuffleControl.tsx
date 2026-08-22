interface ShuffleControlProps {
  readonly disabled: boolean;
  readonly onShuffle?: () => void;
}

// The deck's own control, in the flow under the carousel rather than in the
// fixed arrow layer: it is centred on the card, not pinned to a screen edge.
export function ShuffleControl({ disabled, onShuffle }: ShuffleControlProps) {
  return (
    <div className="deck-footer flex w-full shrink-0 justify-center">
      <button
        type="button"
        disabled={disabled}
        onClick={(event) => {
          onShuffle?.();

          // Same reason as the theme toggle: the deck hands Enter and Space to
          // whichever button holds focus, so a pointer click that kept focus
          // here would swallow the next Space and reshuffle instead of
          // flipping the card. A keyboard activation reports detail 0 and
          // keeps its focus, because a keyboard user put it here on purpose.
          if (event.detail > 0) {
            event.currentTarget.blur();
          }
        }}
        className="shuffle-button flex h-11 items-center gap-2 rounded-full border border-control-border bg-control px-5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-control-ink shadow-[shadow:var(--control-shadow)] transition-[border-color,background-color,transform] duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--paper)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-control-border disabled:hover:bg-control"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.8-1.1 2-1.7 3.3-1.7H22" />
          <path d="m18 2 4 4-4 4" />
          <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
          <path d="M22 18h-2.1c-1.3 0-2.5-.6-3.3-1.7l-.5-.7" />
          <path d="m18 14 4 4-4 4" />
        </svg>
        Shuffle
      </button>
    </div>
  );
}
