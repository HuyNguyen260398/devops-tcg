import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DeckLoader } from "./DeckLoader";

describe("DeckLoader", () => {
  it("is a busy status the server can render", () => {
    const html = renderToStaticMarkup(<DeckLoader />);

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('aria-label="Loading the deck"');
    expect(html).toContain("DEALING");
  });

  it("keeps the card backs out of the accessibility tree", () => {
    render(<DeckLoader />);

    const fan = screen
      .getByTestId("deck-loader")
      .querySelector(".deck-loader-fan");

    expect(fan).toHaveAttribute("aria-hidden", "true");
    expect(fan!.querySelectorAll(".deck-loader-card")).toHaveLength(3);
  });
});
