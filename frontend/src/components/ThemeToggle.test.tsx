import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { ThemeToggle } from "./ThemeToggle";

afterEach(() => {
  window.localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeToggle", () => {
  it("offers the sketch theme while the neon theme is on", () => {
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button", { name: "Switch to the sketch theme" }),
    ).toHaveTextContent(/sketch/i);
  });

  it("switches the document theme and remembers it", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(document.documentElement).toHaveAttribute("data-theme", "sketch");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("sketch");
    expect(
      screen.getByRole("button", { name: "Switch to the neon theme" }),
    ).toHaveTextContent(/neon/i);
  });

  it("switches back", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));

    expect(document.documentElement).toHaveAttribute("data-theme", "neon");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("neon");
  });

  // The pre-paint script has already stamped the element; only the button's
  // own label has to catch up after mount.
  it("adopts the stored theme after mounting", async () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "sketch");
    render(<ThemeToggle />);

    expect(
      await screen.findByRole("button", { name: "Switch to the neon theme" }),
    ).toBeInTheDocument();
  });

  // The deck yields Enter and Space to a focused button, so a toggle that kept
  // focus after a pointer click would swallow the next Space instead of letting
  // it flip the card.
  it("does not keep focus after a pointer click", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).not.toHaveFocus();
  });

  // A keyboard user put focus there deliberately; it stays.
  it("keeps focus after a keyboard activation", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");

    expect(screen.getByRole("button")).toHaveFocus();
    expect(document.documentElement).toHaveAttribute("data-theme", "sketch");
  });

  it("carries an aria-hidden icon", () => {
    render(<ThemeToggle />);

    expect(
      screen.getByRole("button").querySelector('svg[aria-hidden="true"]'),
    ).not.toBeNull();
  });
});
