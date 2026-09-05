import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EMPTY_FILTER } from "@/lib/filterCards";
import { SearchBar } from "./SearchBar";

const types = ["NETWORK", "SECURITY"] as const;

const setup = (filter = EMPTY_FILTER, resultCount = 28) => {
  const onFilterChange = vi.fn();

  render(
    <SearchBar
      filter={filter}
      types={types}
      resultCount={resultCount}
      totalCount={28}
      onFilterChange={onFilterChange}
    />,
  );

  return onFilterChange;
};

describe("SearchBar", () => {
  it("labels its field for a screen reader", () => {
    setup();

    expect(
      screen.getByRole("searchbox", { name: "Search cards" }),
    ).toBeInTheDocument();
  });

  it("reports the whole filter on a keystroke", async () => {
    const user = userEvent.setup();
    const onFilterChange = setup();

    await user.type(screen.getByRole("searchbox"), "t");

    expect(onFilterChange).toHaveBeenCalledWith({ query: "t", type: null });
  });

  it("keeps the chosen category while the text changes", async () => {
    const user = userEvent.setup();
    const onFilterChange = setup({ query: "", type: "SECURITY" });

    await user.type(screen.getByRole("searchbox"), "t");

    expect(onFilterChange).toHaveBeenCalledWith({
      query: "t",
      type: "SECURITY",
    });
  });

  it("offers an All chip alongside one chip per type", () => {
    setup();

    expect(
      screen.getByRole("button", { name: "All categories" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "NETWORK" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(
      screen.getByRole("button", { name: "SECURITY" }),
    ).toBeInTheDocument();
  });

  it("chooses a category without disturbing the text", async () => {
    const user = userEvent.setup();
    const onFilterChange = setup({ query: "aws", type: null });

    await user.click(screen.getByRole("button", { name: "NETWORK" }));

    expect(onFilterChange).toHaveBeenCalledWith({
      query: "aws",
      type: "NETWORK",
    });
  });

  it("deselects a chosen category by pressing it again", async () => {
    const user = userEvent.setup();
    const onFilterChange = setup({ query: "", type: "NETWORK" });

    await user.click(screen.getByRole("button", { name: "NETWORK" }));

    expect(onFilterChange).toHaveBeenCalledWith({ query: "", type: null });
  });

  it("clears everything from the All chip", async () => {
    const user = userEvent.setup();
    const onFilterChange = setup({ query: "aws", type: "NETWORK" });

    await user.click(screen.getByRole("button", { name: "All categories" }));

    expect(onFilterChange).toHaveBeenCalledWith({ query: "aws", type: null });
  });

  it("shows a clear button only while there is text to clear", async () => {
    const user = userEvent.setup();

    setup();
    expect(
      screen.queryByRole("button", { name: "Clear the search text" }),
    ).toBeNull();

    const onFilterChange = setup({ query: "aws", type: "NETWORK" });

    await user.click(
      screen.getByRole("button", { name: "Clear the search text" }),
    );

    expect(onFilterChange).toHaveBeenCalledWith({ query: "", type: "NETWORK" });
  });

  it("counts the results in a polite live region", () => {
    setup(EMPTY_FILTER, 12);

    const count = screen.getByText("12 / 28");

    expect(count).toHaveAttribute("aria-live", "polite");
  });

  it("spells the count out for a screen reader", () => {
    setup(EMPTY_FILTER, 1);

    expect(screen.getByLabelText("1 of 28 cards")).toHaveTextContent("1 / 28");
  });
});
