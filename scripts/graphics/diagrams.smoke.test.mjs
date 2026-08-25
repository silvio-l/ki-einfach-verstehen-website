// Renders every diagram/icon entry through the real D2 CLI / Satori backend
// for both profiles (ADR-0016) -- this is the one place that actually
// proves the grayscale profile differs from color for all 35 lesson
// graphics, not just the ones spot-checked while writing tokens.mjs. It
// shells out to `d2` for the ~15 D2-backed entries, so it's slower than a
// unit test (several seconds), but that matches how `pnpm gen:graphics`
// already runs -- no thinning to a subset.
import { test } from "node:test";
import assert from "node:assert/strict";
import { diagrams } from "./gen-graphics.mjs";

// Stroke hex from tokens.mjs's *color* profile -- must never leak into a
// grayscale render, since color and grayscale stroke values are disjoint
// by construction (grayscale strokes are true grays).
const COLOR_ROLE_HEXES = ["#0E7469", "#986816", "#5E4B8B", "#817B6D"];

for (const { outPath, build } of diagrams) {
  test(`${outPath}: color and grayscale profiles both render and differ`, async () => {
    const color = await build("color");
    const gray = await build("grayscale");
    assert.ok(color.length > 0, "color profile produced an empty SVG");
    assert.ok(gray.length > 0, "grayscale profile produced an empty SVG");
    assert.notEqual(color, gray, "grayscale profile is byte-identical to color -- ADR-0016 not applied");
    // Some backends (Satori's clip-path/image wrapping) URI-encode part of
    // the SVG, so check both the raw and the percent-encoded ("#" -> "%23")
    // form of each hex instead of blanket-decoding (some outputs contain
    // literal, non-percent-encoding "%" from CSS values and would throw).
    for (const hex of COLOR_ROLE_HEXES) {
      assert.ok(!gray.includes(hex), `grayscale output for ${outPath} still contains color-profile hex ${hex}`);
      const encoded = `%23${hex.slice(1)}`;
      assert.ok(!gray.includes(encoded), `grayscale output for ${outPath} still contains URI-encoded color-profile hex ${encoded}`);
    }
  });
}
