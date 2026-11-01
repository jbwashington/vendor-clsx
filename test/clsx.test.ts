// Our src/ port must behave exactly like the pristine upstream/ file, on every input.
import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { clsx as ours } from "../src/index";
import { clsx as theirs } from "../upstream/src/index.js";

const cases: unknown[][] = [
  [], [""], ["a"], ["a", "b"], ["a", 0, null, undefined, false, true, "b"], [1, 2], [0n],
  [{ a: true, b: false, c: 1, d: 0, e: null, f: undefined, g: "x", h: "" }],
  [["a", ["b", ["c", { d: true, e: false }]]]], [[], {}, [[]]], ["a", ["", "b"], { c: true }],
  [{ "-": true, "a b": true }], [NaN], [Infinity], [new Date(0)], [() => {}], [Object.create(null)],
  [["x"], "y", { z: true }, ["", [[["deep"]]]]],
];

test.each(cases.map((c, i) => [i, c] as const))("case %i matches upstream", (_i, args) => {
  expect(ours(...(args as never[]))).toBe(theirs(...(args as never[])));
});

test("random inputs match upstream", () => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  const gen = (d: number): unknown => {
    const r = rnd();
    if (d > 3 || r < 0.3) return [`c${Math.floor(rnd() * 9)}`, 0, 1, "", null, true, false, undefined][Math.floor(rnd() * 8)];
    if (r < 0.65) return Array.from({ length: Math.floor(rnd() * 4) }, () => gen(d + 1));
    return Object.fromEntries(Array.from({ length: Math.floor(rnd() * 4) }, () => [`k${Math.floor(rnd() * 9)}`, gen(5)]));
  };
  for (let i = 0; i < 2000; i++) {
    const args = Array.from({ length: Math.floor(rnd() * 5) }, () => gen(0));
    expect(ours(...(args as never[]))).toBe(theirs(...(args as never[])));
  }
});

test("license is upstream's", () => {
  expect(readFileSync(new URL("../src/LICENSE", import.meta.url), "utf8")).toBe(
    readFileSync(new URL("../upstream/license", import.meta.url), "utf8"));
});
