import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import { CardGrid } from "./CardGrid";

const three = conceptCards.slice(0, 3);

describe("CardGrid", () => {
  it("renders one tile per card in the order it was given", () => {
    render(<CardGrid cards={three} onSelect={vi.fn()} />);

    const tiles = screen.getAllByRole("button");

    expect(tiles).toHaveLength(3);
    expect(tiles.map((tile) => tile.getAttribute("aria-label"))).toEqual([
      "Open the Proxy card",
      "Open the CDN card",
      "Open the NGINX card",
    ]);
  });

  it("shows the number, type and title on a tile", () => {
    render(<CardGrid cards={three} onSelect={vi.fn()} />);

    const tile = screen.getByRole("button", { name: "Open the Proxy card" });

    expect(tile).toHaveTextContent("#001");
    expect(tile).toHaveTextContent("NETWORK");
    expect(tile).toHaveTextContent("Proxy");
  });

  it("mounts both artworks so the theme can choose between them", () => {
    const { container } = render(
      <CardGrid cards={[three[0]]} onSelect={vi.fn()} />,
    );

    const sources = [...container.querySelectorAll("img")].map((image) =>
      image.getAttribute("src"),
    );

    expect(sources).toEqual([
      "/images/proxy-thumbnail.webp",
      "/images/proxy-sketch.svg",
    ]);
  });

  it("hides tile artwork from the accessibility tree", () => {
    const { container } = render(
      <CardGrid cards={[three[0]]} onSelect={vi.fn()} />,
    );

    for (const image of container.querySelectorAll("img")) {
      expect(image).toHaveAttribute("aria-hidden", "true");
      expect(image).toHaveAttribute("alt", "");
    }
  });

  it("keeps the definition readable when the artwork fails to load", () => {
    const { container } = render(
      <CardGrid cards={[three[0]]} onSelect={vi.fn()} />,
    );

    const image = container.querySelector("img")!;

    image.dispatchEvent(new Event("error"));

    expect(
      screen.getByRole("button", { name: "Open the Proxy card" }),
    ).toHaveTextContent("Proxy");
  });

  it("reports the card that was chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<CardGrid cards={three} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Open the CDN card" }));

    expect(onSelect).toHaveBeenCalledWith(three[1]);
  });

  it("presents the tiles as a list", () => {
    render(<CardGrid cards={three} onSelect={vi.fn()} />);

    expect(
      screen.getByRole("list", { name: "Concept cards" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
});
