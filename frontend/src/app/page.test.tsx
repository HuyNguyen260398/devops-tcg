import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  // jsdom opens at 1024, which is the grid boundary.
  it("renders the searchable grid without helper text", async () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "DevOps TCG" }),
    ).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getAllByRole("button", { name: /^Open the .* card$/ }),
      ).toHaveLength(28),
    );

    expect(screen.getByText("28 / 28")).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", { name: "Search cards" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/click the card or use enter or space/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/flip for anatomy and flow/i)).toBeNull();
  });
});
