import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyResults } from "./EmptyResults";

describe("EmptyResults", () => {
  it("repeats the query that matched nothing", () => {
    render(<EmptyResults query="zzz" onClear={vi.fn()} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "No cards match “zzz”",
    );
  });

  it("says so plainly when only a category was chosen", () => {
    render(<EmptyResults query="" onClear={vi.fn()} />);

    expect(screen.getByRole("status")).toHaveTextContent("No cards match");
  });

  it("clears the filters", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<EmptyResults query="zzz" onClear={onClear} />);

    await user.click(screen.getByRole("button", { name: "Clear the filters" }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
