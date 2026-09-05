import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EMPTY_FILTER } from "@/lib/filterCards";
import { SearchSheet } from "./SearchSheet";

const setup = (filter = EMPTY_FILTER) => {
  const onFilterChange = vi.fn();
  const onClose = vi.fn();

  render(
    <SearchSheet
      filter={filter}
      types={["NETWORK", "SECURITY"]}
      resultCount={28}
      totalCount={28}
      onFilterChange={onFilterChange}
      onClose={onClose}
    />,
  );

  return { onFilterChange, onClose };
};

describe("SearchSheet", () => {
  it("is a modal dialog named for its purpose", () => {
    setup();

    expect(
      screen.getByRole("dialog", { name: "Search the deck" }),
    ).toBeInTheDocument();
  });

  it("puts the caret in the field so a reader can type at once", () => {
    setup();

    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("reports each keystroke without closing", async () => {
    const user = userEvent.setup();
    const { onFilterChange, onClose } = setup();

    await user.type(screen.getByRole("searchbox"), "t");

    expect(onFilterChange).toHaveBeenCalledWith({ query: "t", type: null });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes from its Done button", async () => {
    const user = userEvent.setup();
    const { onClose } = setup();

    await user.click(screen.getByRole("button", { name: "Done" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clears both filters at once", async () => {
    const user = userEvent.setup();
    const { onFilterChange } = setup({ query: "aws", type: "NETWORK" });

    await user.click(screen.getByRole("button", { name: "Clear all filters" }));

    expect(onFilterChange).toHaveBeenCalledWith({ query: "", type: null });
  });

  it("offers nothing to clear when no filter is set", () => {
    setup();

    expect(
      screen.queryByRole("button", { name: "Clear all filters" }),
    ).toBeNull();
  });
});
