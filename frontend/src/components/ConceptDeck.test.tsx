import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import { ConceptDeck } from "./ConceptDeck";

describe("ConceptDeck", () => {
  it("renders the Proxy front and disables one-card navigation", () => {
    render(<ConceptDeck cards={conceptCards} />);

    expect(screen.getByText(conceptCards[0].definition)).toBeInTheDocument();
    for (const keyword of conceptCards[0].keywords) {
      expect(screen.getByText(keyword)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("button", { name: "Previous card" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next card" })).toBeDisabled();
  });

  it("flips with the control, Enter, Space, and card click", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} />);

    const card = screen.getByRole("button", {
      name: "Proxy card, front shown",
    });
    const front = screen.getByTestId("card-front");
    const back = screen.getByTestId("card-back");

    await user.click(screen.getByRole("button", { name: "Show card back" }));
    expect(front).toHaveAttribute("aria-hidden", "true");
    expect(back).toHaveAttribute("aria-hidden", "false");

    card.focus();
    await user.keyboard("{Enter}");
    expect(front).toHaveAttribute("aria-hidden", "false");

    await user.keyboard(" ");
    expect(back).toHaveAttribute("aria-hidden", "false");

    await user.click(card);
    expect(front).toHaveAttribute("aria-hidden", "false");
  });

  it("renders all back-face learning content", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} />);

    await user.click(screen.getByRole("button", { name: "Show card back" }));
    const back = screen.getByTestId("card-back");

    for (const item of conceptCards[0].components) {
      expect(
        within(back).getByText(item.name, { selector: "dt" }),
      ).toBeInTheDocument();
      expect(within(back).getByText(item.description)).toBeInTheDocument();
    }
    for (const item of conceptCards[0].howItWorks) {
      expect(within(back).getByText(item.description)).toBeInTheDocument();
    }
  });

  it("shows readable fallback content when the local image fails", () => {
    render(<ConceptDeck cards={conceptCards} />);

    fireEvent.error(
      screen.getByRole("img", { name: conceptCards[0].image.alt }),
    );
    expect(screen.getByText("Proxy network concept")).toBeInTheDocument();
  });

  it("navigates within a multi-card hardcoded deck", async () => {
    const user = userEvent.setup();
    const secondCard = {
      ...conceptCards[0],
      id: "proxy-two",
      cardNumber: "#002",
      title: "Proxy Two",
    };

    render(<ConceptDeck cards={[conceptCards[0], secondCard]} />);

    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(
      screen.getByRole("button", { name: "Proxy Two card, front shown" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next card" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Previous card" }));
    expect(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    ).toBeInTheDocument();
  });

  it("renders a readable empty-deck message", () => {
    render(<ConceptDeck cards={[]} />);

    expect(screen.getByText("No concept cards available.")).toBeInTheDocument();
  });
});
