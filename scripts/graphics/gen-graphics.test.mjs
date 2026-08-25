import { test } from "node:test";
import assert from "node:assert/strict";
import { grayscaleOutPath, diagrams } from "./gen-graphics.mjs";

test("grayscaleOutPath inserts .grayscale before the .svg extension", () => {
  assert.equal(
    grayscaleOutPath("public/bausteine/tokenizer-ids-vokabular/granularitaet.svg"),
    "public/bausteine/tokenizer-ids-vokabular/granularitaet.grayscale.svg",
  );
});

test("grayscaleOutPath handles a bare filename", () => {
  assert.equal(grayscaleOutPath("foo.svg"), "foo.grayscale.svg");
});

test("grayscaleOutPath rejects a non-.svg outPath", () => {
  assert.throws(() => grayscaleOutPath("foo.png"), /expected a \.svg outPath/);
});

test("every diagram entry has a distinct outPath and grayscale sibling path", () => {
  const outPaths = diagrams.map((d) => d.outPath);
  assert.equal(new Set(outPaths).size, outPaths.length, "duplicate outPath across diagram entries");
  const grayPaths = outPaths.map(grayscaleOutPath);
  assert.equal(new Set(grayPaths).size, grayPaths.length, "duplicate grayscale outPath across diagram entries");
  // No diagram's color outPath can collide with another's grayscale sibling.
  for (const p of grayPaths) assert.ok(!outPaths.includes(p), `grayscale path collides with a color outPath: ${p}`);
});
