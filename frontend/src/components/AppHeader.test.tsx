import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppHeader } from "./AppHeader";
import { SearchTrigger } from "./SearchTrigger";

describe("AppHeader", () => {
  it("shows the title and the theme toggle", () => {
    render(
      <AppHeader
        viewMode="grid"
        canChooseView={false}
        onViewModeChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "DevOps TCG" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Switch to the .* theme/ }),
    ).toBeInTheDocument();
  });

  it("offers no view toggle on a viewport with only one layout", () => {
    render(
      <AppHeader
        viewMode="deck"
        canChooseView={false}
        onViewModeChange={vi.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: /view$/ })).toBeNull();
  });

  it("offers the deck view while the grid is showing", async () => {
    const user = userEvent.setup();
    const onViewModeChange = vi.fn();

    render(
      <AppHeader
        viewMode="grid"
        canChooseView
        onViewModeChange={onViewModeChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Show the deck view" }),
    );

    expect(onViewModeChange).toHaveBeenCalledWith("deck");
  });

  it("offers the grid view while the deck is showing", async () => {
    const user = userEvent.setup();
    const onViewModeChange = vi.fn();

    render(
      <AppHeader
        viewMode="deck"
        canChooseView
        onViewModeChange={onViewModeChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Show the grid view" }),
    );

    expect(onViewModeChange).toHaveBeenCalledWith("grid");
  });

  it("renders whatever search control it is given", () => {
    render(
      <AppHeader viewMode="grid" canChooseView onViewModeChange={vi.fn()}>
        <p>search slot</p>
      </AppHeader>,
    );

    expect(screen.getByText("search slot")).toBeInTheDocument();
  });
});

describe("SearchTrigger", () => {
  it("opens the search", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    render(<SearchTrigger isFilterActive={false} onOpen={onOpen} />);

    await user.click(screen.getByRole("button", { name: "Search the deck" }));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("says so in its name while a filter is in force", () => {
    render(<SearchTrigger isFilterActive onOpen={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Search the deck, filter active" }),
    ).toBeInTheDocument();
  });
});
