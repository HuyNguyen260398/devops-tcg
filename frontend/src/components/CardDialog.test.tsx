import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import { CardDialog } from "./CardDialog";

const three = conceptCards.slice(0, 3);

const setup = (index = 0) => {
  const onIndexChange = vi.fn();
  const onClose = vi.fn();

  render(
    <CardDialog
      cards={three}
      index={index}
      random={() => 0.9}
      onIndexChange={onIndexChange}
      onClose={onClose}
    />,
  );

  return { onIndexChange, onClose };
};

describe("CardDialog", () => {
  it("names itself after the card it holds", () => {
    setup();

    expect(
      screen.getByRole("dialog", { name: "Proxy card" }),
    ).toBeInTheDocument();
  });

  it("opens front-first and flips on a click", async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    );

    expect(
      screen.getByRole("button", { name: "Proxy card, back shown" }),
    ).toBeInTheDocument();
  });

  it("flips with Space and with Enter", async () => {
    const user = userEvent.setup();

    setup();

    screen.getByRole("button", { name: /front shown$/ }).focus();

    await user.keyboard(" ");
    expect(
      screen.getByRole("button", { name: /back shown$/ }),
    ).toBeInTheDocument();

    await user.keyboard("{Enter}");
    expect(
      screen.getByRole("button", { name: /front shown$/ }),
    ).toBeInTheDocument();
  });

  it("does not flip when a control has focus", async () => {
    const user = userEvent.setup();

    setup();

    screen.getByRole("button", { name: "Next card" }).focus();
    await user.keyboard(" ");

    expect(
      screen.getByRole("button", { name: /front shown$/ }),
    ).toBeInTheDocument();
  });

  it("counts its position against the filtered deck", () => {
    setup(1);

    expect(screen.getByLabelText("Card 2 of 3")).toHaveTextContent("02 / 03");
  });

  it("steps forward with the Next button", async () => {
    const user = userEvent.setup();
    const { onIndexChange } = setup(0);

    await user.click(screen.getByRole("button", { name: "Next card" }));

    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("wraps past the last card", async () => {
    const user = userEvent.setup();
    const { onIndexChange } = setup(2);

    await user.click(screen.getByRole("button", { name: "Next card" }));

    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it("wraps before the first card", async () => {
    const user = userEvent.setup();
    const { onIndexChange } = setup(0);

    await user.click(screen.getByRole("button", { name: "Previous card" }));

    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("navigates with the arrow keys", async () => {
    const user = userEvent.setup();
    const { onIndexChange } = setup(0);

    screen.getByRole("button", { name: /front shown$/ }).focus();

    await user.keyboard("{ArrowRight}");
    expect(onIndexChange).toHaveBeenCalledWith(1);

    await user.keyboard("{ArrowLeft}");
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });

  it("shows the front face again after navigating to another card", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <CardDialog
        cards={three}
        index={0}
        random={() => 0.9}
        onIndexChange={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /front shown$/ }));
    expect(
      screen.getByRole("button", { name: /back shown$/ }),
    ).toBeInTheDocument();

    rerender(
      <CardDialog
        cards={three}
        index={1}
        random={() => 0.9}
        onIndexChange={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("button", { name: "CDN card, front shown" }),
    ).toBeInTheDocument();
  });

  it("closes from its close button", async () => {
    const user = userEvent.setup();
    const { onClose } = setup();

    await user.click(screen.getByRole("button", { name: "Close the card" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("hides its navigation when the filter left a single card", () => {
    render(
      <CardDialog
        cards={three.slice(0, 1)}
        index={0}
        random={() => 0.9}
        onIndexChange={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "Next card" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Previous card" })).toBeNull();
  });
});
