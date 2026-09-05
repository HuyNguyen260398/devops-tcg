import { renderToStaticMarkup } from "react-dom/server";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { conceptCards } from "@/data/conceptCards";
import { ConceptDeck } from "./ConceptDeck";

const slot = (cardId: string) =>
  document.querySelector<HTMLElement>(`[data-testid="deck-slot-${cardId}"]`);

const slotOf = (cardId: string) => slot(cardId)?.getAttribute("data-slot");

const mountedSlots = () => screen.getAllByTestId(/^deck-slot-/);

// The deck spreads to the width it is given, so a test that cares how many
// cards are on stage has to say how wide the window is. jsdom opens at 1024.
const setViewportWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
};

afterEach(() => setViewportWidth(1024));

describe("ConceptDeck", () => {
  it("centres the first card with enabled carousel controls", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    expect(screen.queryByRole("heading", { name: "DevOps TCG" })).toBeNull();
    expect(slotOf("proxy")).toBe("0");
    expect(screen.queryByText("CONCEPT STUDY DECK")).not.toBeInTheDocument();
    const active = within(slot("proxy")!);
    expect(active.getByText(conceptCards[0].definition)).toBeInTheDocument();
    for (const keyword of conceptCards[0].keywords) {
      expect(active.getByText(keyword)).toBeInTheDocument();
    }
    const previous = screen.getByRole("button", { name: "Previous card" });
    const next = screen.getByRole("button", { name: "Next card" });

    expect(previous).toBeEnabled();
    expect(next).toBeEnabled();
    expect(previous.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    expect(next.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    expect(screen.queryByRole("button", { name: /show card/i })).toBeNull();
  });

  // The flip turns whichever way the coin lands, so the animation is not the
  // same every time. Both directions are edge-on at half the timeline, which is
  // what the visibility swap between the faces depends on.
  it("turns the card the reverse way on a low roll", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.2} />);

    const card = screen.getByRole("button", { name: /card, front shown$/ });

    await user.click(card);

    expect(card).toHaveAttribute("data-flip", "reverse");
    expect(card).toHaveAttribute("data-face", "back");
  });

  it("turns the card the forward way on a high roll", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.9} />);

    const card = screen.getByRole("button", { name: /card, front shown$/ });

    await user.click(card);

    expect(card).toHaveAttribute("data-flip", "forward");
    expect(card).toHaveAttribute("data-face", "back");
  });

  it("flips with card click, Enter, and Space without a Flip control", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const card = screen.getByRole("button", {
      name: "Proxy card, front shown",
    });
    const front = screen.getByTestId("card-front");
    const back = screen.getByTestId("card-back");

    expect(screen.queryByRole("button", { name: /show card/i })).toBeNull();

    await user.click(card);
    expect(front).toHaveAttribute("aria-hidden", "true");
    expect(back).toHaveAttribute("aria-hidden", "false");
    expect(screen.queryByText("Flip to return to the front")).toBeNull();

    card.focus();
    await user.keyboard("{Enter}");
    expect(front).toHaveAttribute("aria-hidden", "false");

    await user.keyboard(" ");
    expect(back).toHaveAttribute("aria-hidden", "false");

    await user.click(card);
    expect(front).toHaveAttribute("aria-hidden", "false");
    expect(screen.queryByText("Flip for anatomy and flow")).toBeNull();
  });

  it("flips the centred card when Space is pressed outside the card", async () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const card = screen.getByRole("button", {
      name: "Proxy card, front shown",
    });
    expect(card).toHaveAttribute("data-face", "front");

    // Scrolling the card with a wheel leaves focus on the document body.
    fireEvent.keyDown(document.body, { key: " " });

    expect(card).toHaveAttribute("data-face", "back");
  });

  it("flips the centred card when Enter is pressed outside the card", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const card = screen.getByRole("button", {
      name: "Proxy card, front shown",
    });

    fireEvent.keyDown(document.body, { key: "Enter" });

    expect(card).toHaveAttribute("data-face", "back");
  });

  it("leaves Space to a focused arrow button instead of flipping", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    screen.getByRole("button", { name: "Next card" }).focus();
    await user.keyboard(" ");

    expect(
      screen.getByRole("button", { name: "CDN card, front shown" }),
    ).toHaveAttribute("data-face", "front");
    expect(slotOf("cdn")).toBe("0");
  });

  // jsdom has no PointerEvent, and fireEvent's fallback drops the coordinates,
  // so build events that carry the geometry the deck actually reads.
  const pointer = (
    type: string,
    clientX: number,
    clientY: number,
    pointerType: string,
  ) => {
    const event = new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
    });
    Object.defineProperty(event, "pointerType", { value: pointerType });
    return event;
  };

  const swipe = (deltaX: number, deltaY = 0, pointerType = "touch") => {
    const surface = screen.getByTestId("deck-track");

    fireEvent(surface, pointer("pointerdown", 200, 300, pointerType));
    fireEvent(
      surface,
      pointer("pointerup", 200 + deltaX, 300 + deltaY, pointerType),
    );
  };

  const track = () => screen.getByTestId("deck-track");
  // The drag is written to the track's own transform rather than to an
  // inherited custom property, so nothing below the track restyles per frame.
  const dragOffset = () => track().style.transform;

  const drag = (deltaX: number, deltaY = 0, pointerType = "touch") => {
    const surface = track();

    fireEvent(surface, pointer("pointerdown", 200, 300, pointerType));
    fireEvent(
      surface,
      pointer("pointermove", 200 + deltaX, 300 + deltaY, pointerType),
    );
  };

  it("follows the finger while the drag is in progress", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    drag(-60);

    expect(track()).toHaveAttribute("data-dragging", "true");
    expect(dragOffset()).toBe("translate3d(-60px, 0px, 0px)");
    // The deck only commits on release, so it has not travelled yet.
    expect(slotOf("proxy")).toBe("0");
  });

  it("springs back when the drag stops short of the threshold", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    drag(-20);
    fireEvent(track(), pointer("pointerup", 180, 300, "touch"));

    expect(track()).not.toHaveAttribute("data-dragging");
    expect(dragOffset()).toBe("translate3d(0px, 0px, 0px)");
    expect(slotOf("proxy")).toBe("0");
  });

  it("settles onto the next card when the drag clears the threshold", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    drag(-80);
    fireEvent(track(), pointer("pointerup", 120, 300, "touch"));

    expect(track()).not.toHaveAttribute("data-dragging");
    expect(dragOffset()).toBe("translate3d(0px, 0px, 0px)");
    expect(slotOf("cdn")).toBe("0");
  });

  it("holds the deck still once a drag turns out to be a scroll", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    drag(-60, 140);

    expect(dragOffset()).toBe("translate3d(0px, 0px, 0px)");
    expect(slotOf("proxy")).toBe("0");
  });

  it("keeps latching a scroll even if the finger drifts sideways", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const surface = track();
    fireEvent(surface, pointer("pointerdown", 200, 300, "touch"));
    fireEvent(surface, pointer("pointermove", 190, 440, "touch"));
    fireEvent(surface, pointer("pointermove", 90, 450, "touch"));

    expect(dragOffset()).toBe("translate3d(0px, 0px, 0px)");
  });

  it("caps the travel so a long drag cannot fling the deck off stage", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    drag(-5000);

    expect(dragOffset()).toBe("translate3d(-360px, 0px, 0px)");
  });

  it("does not follow a mouse drag", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    drag(-80, 0, "mouse");

    expect(dragOffset()).toBe("");
    expect(track()).not.toHaveAttribute("data-dragging");
  });

  it("lets go of the drag when the browser cancels a scroll", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    drag(-30, 140);
    fireEvent(track(), pointer("pointercancel", 170, 440, "touch"));

    expect(track()).not.toHaveAttribute("data-dragging");
    expect(dragOffset()).toBe("translate3d(0px, 0px, 0px)");
    expect(slotOf("proxy")).toBe("0");
  });

  it("still turns the card when the browser cancels a latched swipe", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    drag(-80);
    fireEvent(track(), pointer("pointercancel", 120, 300, "touch"));

    expect(track()).not.toHaveAttribute("data-dragging");
    expect(dragOffset()).toBe("translate3d(0px, 0px, 0px)");
    expect(slotOf("cdn")).toBe("0");
  });

  it("turns the card on a flick too short to clear the drag threshold", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    drag(-26);
    fireEvent(track(), pointer("pointerup", 174, 300, "touch"));

    expect(slotOf("cdn")).toBe("0");
  });

  it("keeps a swipe alive when the finger drifts vertically on the way out", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const surface = track();
    fireEvent(surface, pointer("pointerdown", 200, 300, "touch"));
    // Horizontal first, so the gesture is a swipe; the arc that follows used to
    // re-judge it as a scroll and leave the card sitting still.
    fireEvent(surface, pointer("pointermove", 180, 302, "touch"));
    fireEvent(surface, pointer("pointermove", 120, 380, "touch"));
    fireEvent(surface, pointer("pointerup", 110, 400, "touch"));

    expect(slotOf("cdn")).toBe("0");
  });

  it("arms the flip guard for one gesture only", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    // A touch swipe need not produce a click, and the guard left armed used to
    // swallow the following tap instead of flipping the card.
    swipe(-80);
    const card = screen.getByRole("button", {
      name: "CDN card, front shown",
    });

    fireEvent(track(), pointer("pointerdown", 200, 300, "touch"));
    fireEvent(track(), pointer("pointerup", 200, 300, "touch"));
    fireEvent.click(card);

    expect(card).toHaveAttribute("data-face", "back");
  });

  it("advances the deck on a leftward swipe", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    swipe(-80);

    expect(
      screen.getByRole("button", { name: "CDN card, front shown" }),
    ).toBeInTheDocument();
    expect(slotOf("cdn")).toBe("0");
  });

  it("goes back on a rightward swipe", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    swipe(80);

    expect(
      screen.getByRole("button", {
        name: "AWS NLB card, front shown",
      }),
    ).toBeInTheDocument();
    expect(slotOf("aws-nlb")).toBe("0");
  });

  it("ignores a drag too short to be a swipe", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    swipe(-20);

    expect(slotOf("proxy")).toBe("0");
  });

  it("ignores a mostly vertical drag so card faces stay scrollable", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    swipe(-60, 140);

    expect(slotOf("proxy")).toBe("0");
  });

  it("leaves mouse drags alone so text stays selectable", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    swipe(-80, 0, "mouse");

    expect(slotOf("proxy")).toBe("0");
  });

  it("does not flip the card on the click that follows a swipe", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const card = screen.getByRole("button", {
      name: "Proxy card, front shown",
    });
    swipe(-80);
    fireEvent.click(card);

    expect(
      screen.getByRole("button", { name: "CDN card, front shown" }),
    ).toHaveAttribute("data-face", "front");
  });

  it("places each neighbouring card in its own signed slot", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    expect(slotOf("proxy")).toBe("0");
    expect(slotOf("cdn")).toBe("1");
    expect(slotOf("aws-nlb")).toBe("-1");
  });

  it("stages the rank beyond the spread so no card can pop in", () => {
    setViewportWidth(320);
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    expect(slotOf("nginx")).toBe("2");
    expect(slotOf("aws-alb")).toBe("-2");
    expect(slot("nginx")).toHaveAttribute("data-staged", "true");
    expect(slot("cdn")).not.toHaveAttribute("data-staged");
    expect(slot("reverse-proxy")).toBeNull();
    expect(mountedSlots()).toHaveLength(5);
  });

  it("spreads further ranks across a wider screen", () => {
    setViewportWidth(1800);
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    // Three ranks either side of the centre, plus the staged one behind them.
    expect(mountedSlots()).toHaveLength(9);
    expect(slotOf("reverse-proxy")).toBe("3");
    expect(slot("reverse-proxy")).not.toHaveAttribute("data-staged");
    expect(slot("osi-model")).toHaveAttribute("data-staged", "true");
    expect(slot("dns")).toBeNull();
  });

  it("re-spreads the deck when the window is resized", () => {
    setViewportWidth(320);
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    expect(mountedSlots()).toHaveLength(5);

    act(() => {
      setViewportWidth(1800);
      window.dispatchEvent(new Event("resize"));
    });

    expect(mountedSlots()).toHaveLength(9);
  });

  // The rank's position, size, tilt and fade are all worked out from these two
  // numbers in globals.css, so the deck only has to say where a card stands.
  it("hands every slot its depth and its side", () => {
    setViewportWidth(320);
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const depthAndSide = (cardId: string) => [
      slot(cardId)!.style.getPropertyValue("--depth"),
      slot(cardId)!.style.getPropertyValue("--side"),
    ];

    expect(depthAndSide("proxy")).toEqual(["0", "0"]);
    expect(depthAndSide("cdn")).toEqual(["1", "1"]);
    expect(depthAndSide("aws-nlb")).toEqual(["1", "-1"]);
    expect(depthAndSide("nginx")).toEqual(["2", "1"]);
    expect(depthAndSide("aws-alb")).toEqual(["2", "-1"]);
  });

  it("moves the same card element between slots instead of remounting it", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const incoming = slot("cdn");
    const outgoing = slot("proxy");
    expect(incoming).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "Next card" }));

    expect(slot("cdn")).toBe(incoming);
    expect(slot("proxy")).toBe(outgoing);
    expect(incoming).toHaveAttribute("data-slot", "0");
    expect(outgoing).toHaveAttribute("data-slot", "-1");
    expect(incoming!.isConnected).toBe(true);
  });

  it("keeps every mounted card's element ids unique", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const ids = [...document.querySelectorAll("[id]")].map((node) => node.id);

    expect(ids.length).toBeGreaterThan(0);
    expect([...new Set(ids)]).toHaveLength(ids.length);
  });

  it("hides every off-centre slot from assistive technology and focus", () => {
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    for (const id of ["cdn", "nginx", "aws-nlb", "aws-alb"]) {
      const card = slot(id)!.querySelector(".concept-card")!;
      expect(card).toHaveAttribute("aria-hidden", "true");
      expect(card).not.toHaveAttribute("tabindex");
      expect(card).not.toHaveAttribute("role", "button");
    }

    const active = slot("proxy")!.querySelector(".concept-card")!;
    expect(active).toHaveAttribute("role", "button");
    expect(active).toHaveAttribute("tabindex", "0");
    expect(active).not.toHaveAttribute("aria-hidden");
  });

  it("renders a back face only for the centred card", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    expect(screen.getAllByTestId("card-back")).toHaveLength(1);
    expect(slot("cdn")!.querySelector('[data-testid="card-back"]')).toBeNull();

    await user.click(screen.getByRole("button", { name: "Next card" }));

    expect(screen.getAllByTestId("card-back")).toHaveLength(1);
    expect(
      slot("cdn")!.querySelector('[data-testid="card-back"]'),
    ).not.toBeNull();
  });

  it("returns a flipped card to its front once it leaves the centre", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const card = screen.getByRole("button", {
      name: "Proxy card, front shown",
    });
    await user.click(card);
    expect(card).toHaveAttribute("data-face", "back");

    await user.click(screen.getByRole("button", { name: "Next card" }));
    await user.click(screen.getByRole("button", { name: "Previous card" }));

    expect(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    ).toHaveAttribute("data-face", "front");
  });

  it("renders all back-face learning content", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    await user.click(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    );
    const back = screen.getByTestId("card-back");

    for (const item of conceptCards[0].components) {
      expect(
        within(back).getByText(item.name, { selector: "dt" }),
      ).toBeInTheDocument();
      expect(within(back).getByText(item.description)).toBeInTheDocument();
    }
    for (const item of conceptCards[0].howItWorks) {
      expect(within(back).getByText(item.description)).toBeInTheDocument();
    }
  });

  it("uses the active concept in missing-image fallback text", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    await user.click(screen.getByRole("button", { name: "Next card" }));
    fireEvent.error(
      screen.getByRole("img", { name: conceptCards[1].image.alt }),
    );
    expect(screen.getByText("CDN network concept")).toBeInTheDocument();
  });

  it("updates the card and live counter in both directions", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    await user.click(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    );
    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(
      screen.getByRole("button", { name: "CDN card, front shown" }),
    ).toBeInTheDocument();
    expect(slotOf("cdn")).toBe("0");
    expect(screen.getByRole("button", { name: "Next card" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Previous card" }));
    expect(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    ).toBeInTheDocument();
    expect(slotOf("proxy")).toBe("0");
    expect(screen.getByRole("button", { name: "Previous card" })).toHaveFocus();
  });

  it("wraps both arrow buttons infinitely", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    const previous = screen.getByRole("button", { name: "Previous card" });
    const next = screen.getByRole("button", { name: "Next card" });

    await user.click(previous);
    expect(
      screen.getByRole("button", {
        name: "AWS NLB card, front shown",
      }),
    ).toBeInTheDocument();
    expect(slotOf("aws-nlb")).toBe("0");

    await user.click(next);
    expect(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    ).toBeInTheDocument();
    expect(slotOf("proxy")).toBe("0");

    for (let position = 1; position <= conceptCards.length; position += 1) {
      await user.click(next);
    }

    expect(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    ).toBeInTheDocument();
    expect(slotOf("proxy")).toBe("0");
    expect(previous).toBeEnabled();
    expect(next).toBeEnabled();
  });

  it("uses Left and Right arrows to loop with directional motion", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    screen.getByRole("button", { name: "Proxy card, front shown" }).focus();
    await user.keyboard("{ArrowLeft}");

    expect(
      screen.getByRole("button", {
        name: "AWS NLB card, front shown",
      }),
    ).toHaveFocus();
    expect(screen.getByTestId("deck-track")).toHaveAttribute(
      "data-direction",
      "previous",
    );
    expect(slotOf("aws-nlb")).toBe("0");

    await user.keyboard("{ArrowRight}");
    expect(
      screen.getByRole("button", { name: "Proxy card, front shown" }),
    ).toHaveFocus();
    expect(screen.getByTestId("deck-track")).toHaveAttribute(
      "data-direction",
      "next",
    );
    expect(slotOf("proxy")).toBe("0");
  });

  it("resets image failure state when navigation changes the card", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

    fireEvent.error(
      screen.getByRole("img", { name: conceptCards[0].image.alt }),
    );
    expect(screen.getByText("Proxy network concept")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(
      screen.getByRole("img", { name: conceptCards[1].image.alt }),
    ).toBeInTheDocument();
    expect(screen.queryByText("CDN network concept")).not.toBeInTheDocument();
  });

  it("disables both directions for an explicit one-card deck", () => {
    render(
      <ConceptDeck cards={conceptCards.slice(0, 1)} random={() => 0.999999} />,
    );

    expect(
      screen.getByRole("button", { name: "Previous card" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next card" })).toBeDisabled();
  });

  it("renders a readable empty-deck message", () => {
    render(<ConceptDeck cards={[]} />);

    expect(screen.getByText("No concept cards available.")).toBeInTheDocument();
  });

  it("renders a stable busy placeholder before client shuffle initialization", () => {
    const html = renderToStaticMarkup(
      <ConceptDeck cards={conceptCards} random={() => 0} />,
    );

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("Shuffling cards");
    expect(html).not.toContain("Proxy card, front shown");
    expect(html).not.toContain('aria-label="Card controls"');
  });

  it("navigates a deterministic shuffled order without mutating source order", async () => {
    const user = userEvent.setup();
    render(<ConceptDeck cards={conceptCards} random={() => 0} />);

    expect(
      await screen.findByRole("button", { name: "CDN card, front shown" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("CONCEPT STUDY DECK")).not.toBeInTheDocument();
    expect(slotOf("cdn")).toBe("0");

    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(
      screen.getByRole("button", { name: "NGINX card, front shown" }),
    ).toBeInTheDocument();
    expect(slotOf("nginx")).toBe("0");
    expect(conceptCards[0].title).toBe("Proxy");
  });
  // The shuffle deals a new order and slides it past, right to left, over a
  // stepped sequence of real timers, so these let the clock run and assert
  // where the reel stops. Fake timers are not an option: user-event's own
  // waits deadlock under them.
  it("leaves keystrokes typed into a text field alone", async () => {
    const user = userEvent.setup();

    render(
      <>
        <input aria-label="Search cards" />
        <ConceptDeck cards={conceptCards} random={() => 0.999999} />
      </>,
    );

    const field = screen.getByLabelText("Search cards");

    field.focus();
    await user.keyboard("a b{ArrowLeft}");

    expect(field).toHaveValue("a b");
    expect(slotOf("proxy")).toBe("0");
    expect(
      screen.getByRole("button", { name: /^Proxy card, front shown$/ }),
    ).toBeInTheDocument();
  });

  it("leaves keystrokes inside a dialog to that dialog", async () => {
    const user = userEvent.setup();

    render(
      <>
        <div role="dialog" aria-label="Search the deck">
          <button type="button">Done</button>
        </div>
        <ConceptDeck cards={conceptCards} random={() => 0.999999} />
      </>,
    );

    screen.getByRole("button", { name: "Done" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(slotOf("proxy")).toBe("0");
  });

  describe("shuffle control", () => {
    const shuffleButton = () => screen.getByRole("button", { name: "Shuffle" });

    // Comfortably past the longest reel the deck can run, and awaited inside
    // act so the state its timers set lands before the assertions.
    const settle = () =>
      act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1800));
      });

    const activeTitle = () =>
      screen
        .getByRole("button", { name: /card, (front|back) shown$/ })
        .getAttribute("aria-label")
        ?.replace(/ card, (?:front|back) shown$/, "");

    // The whole loop as the reader would meet it, one Next click at a time.
    const walkDeck = async (user: ReturnType<typeof userEvent.setup>) => {
      const titles: (string | undefined)[] = [];

      for (let step = 0; step < conceptCards.length; step += 1) {
        titles.push(activeTitle());
        await user.click(screen.getByRole("button", { name: "Next card" }));
      }

      return titles;
    };

    // A constant zero roll leaves the deck's order alone, so what it proves is
    // the travel: eight steps to the left of CDN is Lambda Throttle.
    it("slides the deck right to left and stops on the card it dealt", async () => {
      const user = userEvent.setup();
      render(<ConceptDeck cards={conceptCards} random={() => 0} />);

      expect(
        screen.getByRole("button", { name: "CDN card, front shown" }),
      ).toBeInTheDocument();

      await user.click(shuffleButton());

      // The reel picks the deck up where it stood: the card that was in hand
      // travels off to the left rather than being cut away.
      expect(track()).toHaveAttribute("data-spinning", "true");
      expect(track()).toHaveAttribute("data-direction", "next");
      expect(slotOf("cdn")).toBe("-1");

      await settle();

      expect(track()).not.toHaveAttribute("data-spinning");
      expect(
        screen.getByRole("button", {
          name: "Lambda Throttle card, front shown",
        }),
      ).toBeInTheDocument();
      expect(slotOf("lambda-throttle")).toBe("0");
    });

    // A higher roll buys three more steps, so no two shuffles run the same
    // length or stop the same distance away.
    it("runs a longer reel for a higher roll", async () => {
      const user = userEvent.setup();
      render(<ConceptDeck cards={conceptCards} random={() => 0.999999} />);

      await user.click(shuffleButton());
      await settle();

      expect(
        screen.getByRole("button", { name: "Private CA card, front shown" }),
      ).toBeInTheDocument();
      expect(slotOf("private-ca")).toBe("0");
    });

    it("deals an order the deck did not already have", async () => {
      const user = userEvent.setup();
      render(<ConceptDeck cards={conceptCards} random={() => 0.5} />);

      const before = await walkDeck(user);

      await user.click(shuffleButton());
      await settle();

      const after = await walkDeck(user);

      expect(after).not.toEqual(before);
      expect([...after].sort()).toEqual([...before].sort());
    });

    it("turns a flipped card back to its front", async () => {
      const user = userEvent.setup();
      render(<ConceptDeck cards={conceptCards} random={() => 0} />);

      await user.click(
        screen.getByRole("button", { name: "CDN card, front shown" }),
      );
      expect(
        screen.getByRole("button", { name: "CDN card, back shown" }),
      ).toBeInTheDocument();

      await user.click(shuffleButton());
      await settle();

      expect(activeTitle()).toBe("Lambda Throttle");
      expect(
        screen.getByRole("button", { name: /card, front shown$/ }),
      ).toBeInTheDocument();
    });

    it("ignores flips, navigation and a second shuffle while the reel runs", async () => {
      const user = userEvent.setup();
      render(<ConceptDeck cards={conceptCards} random={() => 0} />);

      await user.click(shuffleButton());

      fireEvent.keyDown(document.body, { key: " " });
      fireEvent.keyDown(document.body, { key: "ArrowRight" });
      await user.click(shuffleButton());

      // A key, a second reel or a flip that had been taken would move the deck
      // off the eight steps this shuffle dealt itself.
      await settle();

      expect(activeTitle()).toBe("Lambda Throttle");
      expect(
        screen.getByRole("button", { name: /card, front shown$/ }),
      ).toBeInTheDocument();
    });

    it("lands on the same card at once when motion is turned down", async () => {
      const user = userEvent.setup();

      vi.stubGlobal(
        "matchMedia",
        vi.fn(() => ({ matches: true })),
      );

      try {
        render(<ConceptDeck cards={conceptCards} random={() => 0} />);

        await user.click(shuffleButton());

        expect(track()).not.toHaveAttribute("data-spinning");
        expect(activeTitle()).toBe("Lambda Throttle");
        expect(slotOf("lambda-throttle")).toBe("0");
      } finally {
        vi.unstubAllGlobals();
      }
    });

    it("holds the control inert in the pre-shuffle placeholder", () => {
      const html = renderToStaticMarkup(
        <ConceptDeck cards={conceptCards} random={() => 0} />,
      );

      expect(html).toContain("Shuffle");
      expect(html).toContain("disabled");
    });

    it("disables the control for a one-card deck", () => {
      render(<ConceptDeck cards={conceptCards.slice(0, 1)} random={() => 0} />);

      expect(shuffleButton()).toBeDisabled();
    });
  });
});
