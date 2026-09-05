import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import { VIEW_MODE_STORAGE_KEY } from "@/lib/viewMode";
import { ConceptExplorer } from "./ConceptExplorer";

// The explorer measures the viewport, so a test that cares which layout it gets
// has to say how wide the window is. jsdom opens at 1024, the grid boundary.
const setViewportWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
};

const mount = () =>
  render(<ConceptExplorer cards={conceptCards} random={() => 0.999999} />);

const tiles = () =>
  screen.getAllByRole("button", { name: /^Open the .* card$/ });

afterEach(() => {
  setViewportWidth(1024);
  window.localStorage.clear();
});

describe("ConceptExplorer on a wide viewport", () => {
  it("opens on the grid with every card", async () => {
    mount();

    await waitFor(() => expect(tiles()).toHaveLength(28));
    expect(screen.getByText("28 / 28")).toBeInTheDocument();
  });

  it("narrows the grid on every keystroke", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    await user.type(screen.getByRole("searchbox"), "redis");

    await waitFor(() => expect(tiles()).toHaveLength(2));
    expect(screen.getByText("2 / 28")).toBeInTheDocument();
  });

  it("ands a category chip with the typed text", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    await user.type(screen.getByRole("searchbox"), "aws");
    await user.click(screen.getByRole("button", { name: "SECURITY" }));

    await waitFor(() =>
      expect(tiles().map((tile) => tile.getAttribute("aria-label"))).toEqual([
        "Open the AWS IAM Role card",
        "Open the AWS IAM Policy card",
      ]),
    );
  });

  it("offers a way out when nothing matches", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    await user.type(screen.getByRole("searchbox"), "zzz");

    expect(await screen.findByRole("status")).toHaveTextContent(
      "No cards match “zzz”",
    );

    await user.click(screen.getByRole("button", { name: "Clear the filters" }));

    await waitFor(() => expect(tiles()).toHaveLength(28));
    // The button that was clicked has just unmounted, so focus has to be put
    // somewhere deliberate rather than left on the body.
    expect(screen.getByRole("searchbox")).toHaveFocus();
  });

  it("opens a tile as a flippable card and returns focus on Escape", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    const tile = screen.getByRole("button", { name: "Open the Redis card" });

    await user.click(tile);

    const dialog = await screen.findByRole("dialog", { name: "Redis card" });

    await user.click(
      within(dialog).getByRole("button", { name: /front shown$/ }),
    );
    expect(
      within(dialog).getByRole("button", { name: /back shown$/ }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(tile).toHaveFocus();
  });

  it("walks the filtered results from inside the dialog", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    await user.type(screen.getByRole("searchbox"), "redis");
    await waitFor(() => expect(tiles()).toHaveLength(2));

    await user.click(
      screen.getByRole("button", { name: "Open the Redis card" }),
    );

    const dialog = await screen.findByRole("dialog", { name: "Redis card" });

    await user.click(within(dialog).getByRole("button", { name: "Next card" }));

    expect(
      await screen.findByRole("dialog", { name: "Redis Cluster card" }),
    ).toBeInTheDocument();
  });

  it("switches to the carousel and remembers the choice", async () => {
    const user = userEvent.setup();

    mount();
    await waitFor(() => expect(tiles()).toHaveLength(28));

    await user.click(
      screen.getByRole("button", { name: "Show the deck view" }),
    );

    expect(
      await screen.findByRole("button", { name: /^Proxy card, front shown$/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Concept cards" })).toBeNull();
    expect(window.localStorage.getItem(VIEW_MODE_STORAGE_KEY)).toBe("deck");
  });

  it("filters the carousel too", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(VIEW_MODE_STORAGE_KEY, "deck");
    mount();

    expect(
      await screen.findByRole("button", { name: /^Proxy card, front shown$/ }),
    ).toBeInTheDocument();

    await user.type(screen.getByRole("searchbox"), "redis");

    expect(
      await screen.findByRole("button", { name: /^Redis card, front shown$/ }),
    ).toBeInTheDocument();
  });
});

describe("ConceptExplorer without matchMedia", () => {
  it("falls back to the carousel rather than to nothing", async () => {
    const matchMedia = window.matchMedia;

    // @ts-expect-error -- deliberately removing the API the explorer measures with
    delete window.matchMedia;

    try {
      mount();

      expect(
        await screen.findByRole("button", {
          name: /^Proxy card, front shown$/,
        }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("list", { name: "Concept cards" })).toBeNull();
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: matchMedia,
      });
    }
  });
});

describe("ConceptExplorer on a narrow viewport", () => {
  it("shows the carousel and no grid", async () => {
    setViewportWidth(375);
    mount();

    expect(
      await screen.findByRole("button", { name: /^Proxy card, front shown$/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("list", { name: "Concept cards" })).toBeNull();
    expect(screen.queryByRole("searchbox")).toBeNull();
  });

  it("offers no view toggle, because there is only one layout", async () => {
    setViewportWidth(375);
    mount();

    await screen.findByRole("button", { name: /^Proxy card, front shown$/ });

    expect(
      screen.queryByRole("button", { name: /^Show the .* view$/ }),
    ).toBeNull();
  });

  it("filters the deck from the sheet and keeps the filter after dismissal", async () => {
    const user = userEvent.setup();

    setViewportWidth(375);
    mount();

    await screen.findByRole("button", { name: /^Proxy card, front shown$/ });

    await user.click(screen.getByRole("button", { name: "Search the deck" }));

    await user.type(await screen.findByRole("searchbox"), "redis");
    expect(screen.getByText("2 / 28")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Done" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(
      await screen.findByRole("button", { name: /^Redis card, front shown$/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Search the deck, filter active" }),
    ).toBeInTheDocument();
  });

  it("gathers every control into one bar under the card", async () => {
    setViewportWidth(375);
    mount();

    await screen.findByRole("button", { name: /^Proxy card, front shown$/ });

    const bar = screen.getByRole("navigation", { name: "Card controls" });

    expect(
      within(bar)
        .getAllByRole("button")
        .map((button) => button.getAttribute("aria-label")),
    ).toEqual([
      "Previous card",
      expect.stringMatching(/^Switch to the .* theme$/),
      "Shuffle",
      "Search the deck",
      "Next card",
    ]);
  });

  it("leaves the theme toggle to the bar rather than the header", async () => {
    setViewportWidth(375);
    mount();

    await screen.findByRole("button", { name: /^Proxy card, front shown$/ });

    expect(
      screen.getAllByRole("button", { name: /^Switch to the .* theme$/ }),
    ).toHaveLength(1);
  });

  // Without this the search button would vanish at the one moment the reader
  // most needs it: the filter matched nothing and there is no deck to hold it.
  it("keeps the search button reachable when nothing matches", async () => {
    const user = userEvent.setup();

    setViewportWidth(375);
    mount();

    await screen.findByRole("button", { name: /^Proxy card, front shown$/ });
    await user.click(screen.getByRole("button", { name: "Search the deck" }));
    await user.type(await screen.findByRole("searchbox"), "zzz");
    await user.click(screen.getByRole("button", { name: "Done" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "No cards match",
    );
    expect(
      screen.getByRole("button", { name: "Search the deck, filter active" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Previous card" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Shuffle" })).toBeDisabled();
  });

  it("lets a space be typed into the search field", async () => {
    const user = userEvent.setup();

    setViewportWidth(375);
    mount();

    await screen.findByRole("button", { name: /^Proxy card, front shown$/ });
    await user.click(screen.getByRole("button", { name: "Search the deck" }));

    const field = await screen.findByRole("searchbox");

    await user.type(field, "reverse proxy");

    expect(field).toHaveValue("reverse proxy");
  });
});
