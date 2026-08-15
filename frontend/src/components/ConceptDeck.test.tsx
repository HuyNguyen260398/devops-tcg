import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import { ConceptDeck } from "./ConceptDeck";

describe("ConceptDeck", () => {
  it("renders the first of nine cards with bounded initial navigation", () => {
    render(<ConceptDeck cards={conceptCards} />);

    expect(
      screen.getByRole("heading", { name: "DevOps TCG" }),
    ).toBeInTheDocument();
    expect(screen.getByText("01 / 09")).toBeInTheDocument();
    expect(screen.getByText(conceptCards[0].definition)).toBeInTheDocument();
    for (const keyword of conceptCards[0].keywords) {
      expect(screen.getByText(keyword)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("button", { name: "Previous card" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next card" })).toBeEnabled();
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

  it("uses the active concept in missing-image fallback text", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} />);

    await user.click(screen.getByRole("button", { name: "Next card" }));
    fireEvent.error(
      screen.getByRole("img", { name: conceptCards[1].image.alt }),
    );
    expect(screen.getByText("CDN network concept")).toBeInTheDocument();
  });

  it("updates the card and live counter in both directions", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} />);

    await user.click(screen.getByRole("button", { name: "Show card back" }));
    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(
      screen.getByRole("button", { name: "CDN card, front shown" }),
    ).toBeInTheDocument();
    expect(screen.getByText("02 / 09")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous card" }));
    expect(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    ).toBeInTheDocument();
    expect(screen.getByText("01 / 09")).toBeInTheDocument();
  });

  it("disables both directions for an explicit one-card deck", () => {
    render(<ConceptDeck cards={conceptCards.slice(0, 1)} />);

    expect(screen.getByText("01 / 01")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous card" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next card" })).toBeDisabled();
  });

  it("renders a readable empty-deck message", () => {
    render(<ConceptDeck cards={[]} />);

    expect(screen.getByText("No concept cards available.")).toBeInTheDocument();
  });
});
