import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";

const open = (onClose = vi.fn()) => {
  render(
    <>
      <button type="button">outside</button>
      <Dialog label="Example dialog" onClose={onClose}>
        <button type="button">first</button>
        <button type="button">second</button>
      </Dialog>
    </>,
  );

  return onClose;
};

describe("Dialog", () => {
  it("announces itself as a modal dialog with its label", () => {
    open();

    const dialog = screen.getByRole("dialog", { name: "Example dialog" });

    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("moves focus to its first control", () => {
    open();

    expect(screen.getByRole("button", { name: "first" })).toHaveFocus();
  });

  it("cycles Tab within itself rather than reaching the page behind", async () => {
    const user = userEvent.setup();

    open();

    await user.tab();
    expect(screen.getByRole("button", { name: "second" })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole("button", { name: "first" })).toHaveFocus();
  });

  it("cycles backwards with Shift+Tab", async () => {
    const user = userEvent.setup();

    open();

    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "second" })).toHaveFocus();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = open();

    await user.keyboard("{Escape}");

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the backdrop is pressed", async () => {
    const user = userEvent.setup();
    const onClose = open();

    await user.click(screen.getByTestId("dialog-backdrop"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when the dialog itself is pressed", async () => {
    const user = userEvent.setup();
    const onClose = open();

    await user.click(screen.getByRole("button", { name: "first" }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("returns focus to whatever opened it", async () => {
    const user = userEvent.setup();
    const opener = document.createElement("button");

    document.body.append(opener);
    opener.focus();

    const { unmount } = render(
      <Dialog label="Example dialog" onClose={vi.fn()}>
        <button type="button">first</button>
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: "first" })).toHaveFocus();

    unmount();
    await Promise.resolve();

    expect(opener).toHaveFocus();
    opener.remove();
  });

  // The search sheet's field takes focus as it mounts, before the dialog's own
  // effects run. The opener is still the control that was focused before the
  // dialog appeared, not the field.
  it("returns focus to the opener even when a child takes focus on mount", async () => {
    const opener = document.createElement("button");

    document.body.append(opener);
    opener.focus();

    const { unmount } = render(
      <Dialog label="Example dialog" onClose={vi.fn()}>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input aria-label="field" autoFocus />
      </Dialog>,
    );

    expect(screen.getByRole("textbox", { name: "field" })).toHaveFocus();

    unmount();
    await Promise.resolve();

    expect(opener).toHaveFocus();
    opener.remove();
  });

  it("falls back when the opener has left the page", async () => {
    const opener = document.createElement("button");
    const replacement = document.createElement("button");

    document.body.append(opener, replacement);
    opener.focus();

    const { unmount } = render(
      <Dialog
        label="Example dialog"
        onClose={vi.fn()}
        fallbackFocus={() => replacement}
      >
        <button type="button">first</button>
      </Dialog>,
    );

    opener.remove();
    unmount();
    await Promise.resolve();

    expect(replacement).toHaveFocus();
    replacement.remove();
  });
});
