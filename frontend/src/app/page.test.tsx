import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders deck identity, count, card, and instruction", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "DevOps TCG" }),
    ).toBeInTheDocument();
    expect(screen.getByText("01 / 09")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/click the card or use enter or space/i),
    ).toBeInTheDocument();
  });
});
