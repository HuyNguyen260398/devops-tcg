import { describe, expect, it } from "vitest";
import { shuffleCards } from "./shuffle";

describe("shuffleCards", () => {
  it("uses Fisher-Yates with an injectable random sequence", () => {
    const values = [0, 0.5, 0.75];
    let index = 0;

    expect(shuffleCards(["a", "b", "c", "d"], () => values[index++])).toEqual([
      "d",
      "c",
      "b",
      "a",
    ]);
  });

  it("returns a new array without mutating the source", () => {
    const source = Object.freeze(["proxy", "cdn", "nginx"]);
    const shuffled = shuffleCards(source, () => 0);

    expect(shuffled).toEqual(["cdn", "nginx", "proxy"]);
    expect(shuffled).not.toBe(source);
    expect(source).toEqual(["proxy", "cdn", "nginx"]);
  });

  it("handles empty and one-card collections", () => {
    const onlyCard = { id: "proxy" };

    expect(shuffleCards([], () => 0)).toEqual([]);
    expect(shuffleCards([onlyCard], () => 0)).toEqual([onlyCard]);
  });
});
