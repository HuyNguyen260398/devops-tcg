import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DeckToolbar } from "./DeckToolbar";

const setup = (props: Partial<Parameters<typeof DeckToolbar>[0]> = {}) => {
  const onPrevious = vi.fn();
  const onNext = vi.fn();
  const onShuffle = vi.fn();

  render(
    <DeckToolbar
      onPrevious={onPrevious}
      onNext={onNext}
      onShuffle={onShuffle}
      searchControl={<button type="button">Search the deck</button>}
      {...props}
    />,
  );

  return { onPrevious, onNext, onShuffle };
};

describe("DeckToolbar", () => {
  it("carries the five controls in reading order", () => {
    setup();

    const names = screen
      .getAllByRole("button")
      .map((button) => button.getAttribute("aria-label") ?? button.textContent);

    expect(names).toEqual([
      "Previous card",
      expect.stringMatching(/^Switch to the .* theme$/),
      "Shuffle",
      "Search the deck",
      "Next card",
    ]);
  });

  it("is announced as the deck's controls", () => {
    setup();

    expect(
      screen.getByRole("navigation", { name: "Card controls" }),
    ).toBeInTheDocument();
  });

  it("steps the deck backwards and forwards", async () => {
    const user = userEvent.setup();
    const { onPrevious, onNext } = setup();

    await user.click(screen.getByRole("button", { name: "Previous card" }));
    await user.click(screen.getByRole("button", { name: "Next card" }));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("shuffles the deck", async () => {
    const user = userEvent.setup();
    const { onShuffle } = setup();

    await user.click(screen.getByRole("button", { name: "Shuffle" }));

    expect(onShuffle).toHaveBeenCalledTimes(1);
  });

  // An absent handler is the only way a control is switched off, so a caller
  // never has to pass a no-op alongside a disabled flag.
  it("disables whichever control it was given no handler for", () => {
    setup({ onPrevious: undefined, onNext: undefined, onShuffle: undefined });

    expect(
      screen.getByRole("button", { name: "Previous card" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next card" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Shuffle" })).toBeDisabled();
  });

  it("keeps the theme available even with every deck control off", () => {
    setup({ onPrevious: undefined, onNext: undefined, onShuffle: undefined });

    expect(
      screen.getByRole("button", { name: /^Switch to the .* theme$/ }),
    ).toBeEnabled();
  });

  it("leaves a gap rather than a control when given no search button", () => {
    setup({ searchControl: undefined });

    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("lays the controls out in five even columns", () => {
    setup();

    const bar = screen.getByRole("navigation", { name: "Card controls" });

    expect(bar).toHaveClass("deck-toolbar");
  });
});
