import { afterEach, describe, expect, it } from "vitest";
import { focusableWithin, nextFocusTarget } from "./focusTrap";

const mount = (html: string): HTMLElement => {
  const container = document.createElement("div");

  container.innerHTML = html;
  document.body.append(container);
  return container;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("focusableWithin", () => {
  it("finds links, buttons and fields in document order", () => {
    const container = mount(`
      <a href="/one">one</a>
      <button type="button">two</button>
      <input />
      <div tabindex="0">four</div>
    `);

    expect(
      focusableWithin(container).map((element) => element.tagName),
    ).toEqual(["A", "BUTTON", "INPUT", "DIV"]);
  });

  it("skips disabled controls and tabindex -1", () => {
    const container = mount(`
      <button type="button" disabled>no</button>
      <input disabled />
      <div tabindex="-1">no</div>
      <button type="button">yes</button>
    `);

    expect(focusableWithin(container)).toHaveLength(1);
  });

  it("skips anything hidden from the accessibility tree", () => {
    const container = mount(`
      <button type="button" aria-hidden="true">no</button>
      <button type="button">yes</button>
    `);

    expect(focusableWithin(container)).toHaveLength(1);
  });

  it("returns nothing for a container with no focusable content", () => {
    expect(focusableWithin(mount("<p>text</p>"))).toEqual([]);
  });
});

describe("nextFocusTarget", () => {
  const container = () =>
    mount(`
      <button type="button" id="a">a</button>
      <button type="button" id="b">b</button>
      <button type="button" id="c">c</button>
    `);

  it("steps forward", () => {
    const root = container();
    const b = root.querySelector("#b")!;

    expect(nextFocusTarget(root, b, false)?.id).toBe("c");
  });

  it("steps backward", () => {
    const root = container();
    const b = root.querySelector("#b")!;

    expect(nextFocusTarget(root, b, true)?.id).toBe("a");
  });

  it("wraps past the last element", () => {
    const root = container();
    const c = root.querySelector("#c")!;

    expect(nextFocusTarget(root, c, false)?.id).toBe("a");
  });

  it("wraps before the first element", () => {
    const root = container();
    const a = root.querySelector("#a")!;

    expect(nextFocusTarget(root, a, true)?.id).toBe("c");
  });

  it("enters at the first element when focus is outside the container", () => {
    const root = container();

    expect(nextFocusTarget(root, document.body, false)?.id).toBe("a");
  });

  it("enters at the last element when tabbing backwards from outside", () => {
    const root = container();

    expect(nextFocusTarget(root, null, true)?.id).toBe("c");
  });

  it("returns null when there is nothing to focus", () => {
    expect(nextFocusTarget(mount("<p>text</p>"), null, false)).toBeNull();
  });
});
