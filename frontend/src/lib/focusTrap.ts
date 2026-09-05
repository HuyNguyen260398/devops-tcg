const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// Visibility is deliberately judged by aria-hidden rather than by layout: jsdom
// reports no geometry, so an offsetParent test would make every element here
// look hidden and the trap untestable. Nothing in this feature hides a control
// with CSS alone.
export const focusableWithin = (
  container: HTMLElement,
): readonly HTMLElement[] =>
  [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => element.closest('[aria-hidden="true"]') === null,
  );

export const nextFocusTarget = (
  container: HTMLElement,
  active: Element | null,
  backwards: boolean,
): HTMLElement | null => {
  const elements = focusableWithin(container);

  if (elements.length === 0) return null;

  const index = elements.findIndex((element) => element === active);

  // Focus sits outside the trap, so Tab enters at whichever end the direction
  // of travel would have arrived from.
  if (index === -1)
    return backwards ? elements[elements.length - 1] : elements[0];

  const step = backwards ? -1 : 1;

  return elements[(index + step + elements.length) % elements.length];
};
