import { test } from "node:test";
import assert from "node:assert/strict";
import { tone, d2Style, d2EdgeStyle, satoriBackground, satoriBorder, TONE_NAMES } from "./tokens.mjs";

test("color profile keeps the exact hex values diagrams hardcoded before ADR-0016", () => {
  assert.deepEqual(tone("teal", "color"), {
    fill: "#E8F3F1",
    fillStrong: "#D7ECE7",
    stroke: "#0E7469",
    text: "#0A5148",
    accent: "#0E7469",
    d2Pattern: undefined,
    strokeDash: 0,
    satoriBorderStyle: "solid",
  });
  assert.equal(tone("amber", "color").stroke, "#986816");
  assert.equal(tone("purple", "color").stroke, "#5E4B8B");
  assert.equal(tone("neutral", "color").stroke, "#817B6D");
});

test("grayscale profile uses true grays (R=G=B) for every tone", () => {
  for (const name of TONE_NAMES) {
    for (const key of ["fill", "fillStrong", "stroke", "text", "accent"]) {
      const hex = tone(name, "grayscale")[key];
      const [r, g, b] = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)];
      assert.equal(r, g, `${name}.${key} = ${hex} is not a true gray`);
      assert.equal(g, b, `${name}.${key} = ${hex} is not a true gray`);
    }
  }
});

test("grayscale profile distinguishes every tone by more than lightness alone", () => {
  const marks = TONE_NAMES.map((name) => {
    const t = tone(name, "grayscale");
    return `${name}:${t.d2Pattern ?? "none"}:${t.strokeDash}:${t.satoriBorderStyle}`;
  });
  assert.equal(new Set(marks).size, TONE_NAMES.length, "each tone needs a unique pattern/dash/border-style combination");

  // amber and purple must be reachable without relying on color at all --
  // pattern + dash present and different from each other and from the two
  // undecorated tones (neutral, teal).
  assert.notEqual(tone("amber", "grayscale").d2Pattern, undefined);
  assert.notEqual(tone("purple", "grayscale").d2Pattern, undefined);
  assert.notEqual(tone("amber", "grayscale").d2Pattern, tone("purple", "grayscale").d2Pattern);
  assert.equal(tone("neutral", "grayscale").d2Pattern, undefined);
  assert.equal(tone("teal", "grayscale").d2Pattern, undefined);
});

test("color profile never carries a pattern or dash (must render identically to pre-ADR-0016 output)", () => {
  for (const name of TONE_NAMES) {
    const t = tone(name, "color");
    assert.equal(t.d2Pattern, undefined);
    assert.equal(t.strokeDash, 0);
    assert.equal(t.satoriBorderStyle, "solid");
  }
});

test("grayscale accent values stay far apart in lightness for roles used side-by-side (e.g. positive/negative bars)", () => {
  const gray = (hex) => parseInt(hex.slice(1, 3), 16);
  const tealAccent = gray(tone("teal", "grayscale").accent);
  const amberAccent = gray(tone("amber", "grayscale").accent);
  assert.ok(Math.abs(tealAccent - amberAccent) >= 40, `teal/amber grayscale accents too close: ${tealAccent} vs ${amberAccent}`);
  // Color-profile accent must match the pre-existing hardcoded bar-chart hex exactly.
  assert.equal(tone("teal", "color").accent, "#0E7469");
  assert.equal(tone("amber", "color").accent, "#986816");
});

test("tone rejects an unknown role or profile", () => {
  assert.throws(() => tone("nope", "color"), /unknown tone/);
  assert.throws(() => tone("teal", "sepia"), /unknown profile/);
});

test("d2Style emits fill-pattern/stroke-dash lines only in the grayscale profile", () => {
  const color = d2Style("amber", "color");
  const gray = d2Style("amber", "grayscale");
  assert.doesNotMatch(color, /fill-pattern/);
  assert.doesNotMatch(color, /stroke-dash/);
  assert.match(gray, /style\.fill-pattern: "lines"/);
  assert.match(gray, /style\.stroke-dash: 6/);
  assert.match(gray, /style\.fill: "#D6D6D6"/);
});

test("d2Style honors fillKey and strokeWidth overrides", () => {
  const strong = d2Style("teal", "color", { fillKey: "fillStrong" });
  assert.match(strong, /style\.fill: "#D7ECE7"/);
  const widened = d2Style("teal", "color", { strokeWidth: 3 });
  assert.match(widened, /style\.stroke-width: 3/);
});

test("d2EdgeStyle carries stroke-dash but never a fill (edges have none)", () => {
  const gray = d2EdgeStyle("purple", "grayscale");
  assert.doesNotMatch(gray, /fill/);
  assert.match(gray, /style\.stroke-dash: 2/);
});

test("satoriBackground returns a flat color for undecorated tones and a hatch layered over the fill for decorated ones", () => {
  assert.equal(satoriBackground("teal", "grayscale"), "#E4E4E4");
  const hatched = satoriBackground("amber", "grayscale");
  assert.match(hatched, /repeating-linear-gradient/);
  assert.match(hatched, /#D6D6D6$/);
  const dotted = satoriBackground("purple", "grayscale");
  assert.match(dotted, /radial-gradient/);
});

test("satoriBorder emits the role's border style and stroke color", () => {
  assert.equal(satoriBorder("amber", "grayscale"), "2px dashed #333333");
  assert.equal(satoriBorder("teal", "color", { width: 3 }), "3px solid #0E7469");
});
