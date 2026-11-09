"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { focusableWithin, nextFocusTarget } from "@/lib/focusTrap";

interface DialogProps {
  readonly label: string;
  readonly className?: string;
  readonly onClose: () => void;
  // Where focus goes on close if the control that opened the dialog has left
  // the page in the meantime — a search that empties the deck rebuilds the bar
  // that held the search button.
  readonly fallbackFocus?: () => HTMLElement | null;
  readonly children: ReactNode;
}

export function Dialog({
  label,
  className,
  onClose,
  fallbackFocus,
  children,
}: DialogProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  // Read during the first render, not in an effect: a child with autoFocus
  // (the search sheet's field) takes focus during commit, before any effect
  // here runs, and would otherwise be remembered as the opener.
  const [opener] = useState<Element | null>(() =>
    typeof document === "undefined" ? null : document.activeElement,
  );
  const fallbackRef = useRef(fallbackFocus);
  fallbackRef.current = fallbackFocus;

  // Focus enters on mount and goes back on unmount, so a reader who opened the
  // dialog from a grid tile is returned to that tile rather than to the top of
  // the page.
  useEffect(() => {
    const surface = surfaceRef.current;

    // A child that already took focus on mount (the search sheet's field)
    // keeps it; otherwise the first control does.
    if (surface !== null && !surface.contains(document.activeElement)) {
      (focusableWithin(surface)[0] ?? surface).focus();
    }

    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus();
        return;
      }

      fallbackRef.current?.()?.focus();
    };
  }, [opener]);

  // Captured on the document, so the trap sees Tab before anything inside the
  // dialog can act on it and before the deck's own document-level shortcuts.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const surface = surfaceRef.current;

      if (surface === null) return;

      const target = nextFocusTarget(
        surface,
        document.activeElement,
        event.shiftKey,
      );

      if (target === null) return;

      event.preventDefault();
      target.focus();
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose]);

  return (
    <div className="app-dialog fixed inset-0 z-40 flex items-center justify-center">
      {/* aria-hidden and pointer-only: the close button and Escape are the
          announced ways out, and this is the shortcut for a mouse. */}
      <div
        data-testid="dialog-backdrop"
        aria-hidden="true"
        className="app-dialog-backdrop absolute inset-0"
        onPointerDown={onClose}
      />
      <div
        ref={surfaceRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`app-dialog-surface relative z-10 flex max-h-full w-full flex-col focus:outline-none ${className ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}
