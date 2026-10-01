import { tone } from "./tokens.mjs";

// Shared D2 styling for the step-through animations and their static
// figures: a rounded box in a semantic tone and a labelled teal arrow.
export function block(role, profile) {
  const t = tone(role, profile);
  return `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 20
  style.font-color: "${t.text}"
  style.fill: "${t.fill}"
  style.stroke: "${t.stroke}"${t.d2Pattern ? `\n  style.fill-pattern: "${t.d2Pattern}"` : ""}${t.strokeDash ? `\n  style.stroke-dash: ${t.strokeDash}` : ""}`;
}

export function edge(profile, label, { dashed = false } = {}) {
  return `{
  label: "${label}"
  style.stroke: "${tone("teal", profile).stroke}"
  style.stroke-width: 2
  style.font-size: 18${dashed ? "\n  style.stroke-dash: 4" : ""}
}`;
}

// Four nodes as a clockwise 2x2 cycle (landscape). The gaps leave room for
// an edge label beside its arrow.
export const GRID_HEAD = "grid-rows: 2\ngrid-columns: 2\nhorizontal-gap: 150\nvertical-gap: 80";
