import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders deck identity, count, shuffled card, and instruction", async () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "DevOps TCG" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /card, front shown$/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("01 / 09")).toBeInTheDocument();
    expect(
      screen.getByText(/click the card or use enter or space/i),
    ).toBeInTheDocument();
  });
});
