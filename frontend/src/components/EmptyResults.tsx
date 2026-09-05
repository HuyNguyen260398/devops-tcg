"use client";

interface EmptyResultsProps {
  readonly query: string;
  readonly onClear: () => void;
}

export function EmptyResults({ query, onClear }: EmptyResultsProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p role="status" className="text-sm text-ink-muted">
        {query.trim() === "" ? "No cards match" : `No cards match “${query}”`}
      </p>
      <button
        type="button"
        onClick={onClear}
        className="flex h-9 items-center rounded-full border border-control-border bg-control px-4 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-control-ink transition-colors duration-200 hover:border-[color:var(--control-hover-border)] hover:bg-[color:var(--control-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
      >
        Clear the filters
      </button>
    </div>
  );
}
