import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the shuffled deck without helper text", async () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "DevOps TCG" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /card, front shown$/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("01 / 25")).toBeInTheDocument();
    expect(
      screen.queryByText(/click the card or use enter or space/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/flip for anatomy and flow/i)).toBeNull();
  });
});
