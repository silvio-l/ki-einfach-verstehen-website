import { test } from "node:test";
import assert from "node:assert/strict";
import { legibility, svgMinFont, svgWidth } from "./legibility.mjs";

const d2 = (width, size) =>
  `<svg viewBox="0 0 ${width} 300"><text x="1" style="text-anchor:middle;font-size:${size}px">A</text><text style="font-size:24px">B</text></svg>`;

test("reads the width from the viewBox and the smallest D2 font size", () => {
  assert.equal(svgWidth(d2(640, 14)), 640);
  assert.equal(svgMinFont(d2(640, 14)), 14);
});

test("prefers the font size Satori records on the root", () => {
  assert.equal(svgMinFont('<svg data-min-font="13" width="520" height="200"><path d="M0 0"/></svg>'), 13);
});

test("a diagram passes when its smallest text stays ≥7.5px on a phone and ≥7.5pt in the book", () => {
  assert.equal(legibility(d2(560, 14)).ok, true);
  const wide = legibility(d2(1435, 14));
  assert.equal(wide.ok, false);
  assert.ok(wide.phonePx < 4);
});

test("a graphic without text passes", () => {
  assert.equal(legibility('<svg viewBox="0 0 240 240"><path d="M0 0"/></svg>').ok, true);
});

test("a very tall diagram is judged at the size it fits the book page", () => {
  const tall = '<svg viewBox="0 0 300 2400"><text style="font-size:16px">A</text></svg>';
  const r = legibility(tall);
  assert.equal(r.phonePx, 16);
  assert.equal(r.bookPt, 3.6);
  assert.equal(r.ok, false);
});
