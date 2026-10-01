import { test } from "node:test";
import assert from "node:assert/strict";
import { renderD2 } from "./d2-render.mjs";
import { renderStepper, validateSteps } from "./stepper.mjs";
import { trainingLoopDe, trainingLoopEn } from "./diagrams/training-loop.mjs";

const svg = renderD2("a: A\nb: B\na -> b");

test("validateSteps accepts ids that exist in the D2 output", () => {
  validateSteps(svg, [
    { nodes: ["a"], caption: "one" },
    { nodes: ["b"], edges: ["a -> b"], caption: "two" },
  ]);
});

test("validateSteps rejects unknown nodes and edges", () => {
  assert.throws(
    () => validateSteps(svg, [
      { nodes: ["c"], caption: "one" },
      { edges: ["b -> a"], caption: "two" },
    ]),
    /node "c" not in diagram.*edge "b -> a" not in diagram/,
  );
});

test("validateSteps rejects a step without caption", () => {
  assert.throws(() => validateSteps(svg, [{ nodes: ["a"] }, { nodes: ["b"], caption: "x" }]), /caption missing/);
});

test("renderStepper embeds the diagram, step data and autoplay", () => {
  const html = renderStepper({
    wide: svg,
    steps: [{ nodes: ["a"], caption: "one" }, { nodes: ["b"], caption: "two" }],
    title: "T",
    intro: "intro",
  });
  assert.match(html, /id="stage"/);
  assert.match(html, /IntersectionObserver/);
  assert.match(html, /kevStepper/);
  assert.match(html, /"caption":"two"/);
});

test("training loop animations build in both languages", () => {
  for (const loop of [trainingLoopDe, trainingLoopEn]) {
    assert.match(loop.html.build(), /<!doctype html>/);
  }
});
