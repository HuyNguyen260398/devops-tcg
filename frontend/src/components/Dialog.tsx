"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { focusableWithin, nextFocusTarget } from "@/lib/focusTrap";

interface DialogProps {
  readonly label: string;
  readonly className?: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
}

export function Dialog({ label, className, onClose, children }: DialogProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  // Focus enters on mount and goes back on unmount, so a reader who opened the
  // dialog from a grid tile is returned to that tile rather than to the top of
  // the page.
  useEffect(() => {
    opener.current = document.activeElement;

    const surface = surfaceRef.current;

    if (surface !== null) {
      (focusableWithin(surface)[0] ?? surface).focus();
    }

    return () => {
      if (opener.current instanceof HTMLElement) opener.current.focus();
    };
  }, []);

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
    <div className="app-dialog fixed inset-0 z-40 flex items-center justify-center p-4">
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
