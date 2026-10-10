// Semantic hue tokens shared by every D2/Satori lesson-graphic generator
// (ADR-0012/0013). Diagrams distinguish up to four roles by hue today
// (teal = tokenizer/vocabulary, amber = model/next-step, purple = a third
// category in the richer concept diagrams, neutral = default/inactive) --
// every `diagrams/*.mjs` file used to hardcode those as raw hex. This
// module is the single place that maps a role name to concrete style
// values, per rendering profile (ADR-0016).
//
// `color` values are unchanged from what the diagrams hardcoded before --
// the website keeps using this profile untouched. `grayscale` values are
// true grays (R=G=B, so they can't accidentally regain a hue distinction
// once desaturated further by a Kindle/KDP pipeline) and additionally
// distinguish each role by fill lightness *and* a D2 fill-pattern / Satori
// hatch background *and* a stroke-dash -- any one signal degrading (e.g. a
// low-contrast e-ink refresh) still leaves the other two.

// `accent` is a saturated, high-contrast value for solid-fill areas that
// carry meaning on their own (e.g. a bar-chart bar) rather than being a
// light card fill with a separate border -- in the color profile it's
// always the same hex as `stroke` (matches what those diagrams hardcoded
// before this module existed), but in grayscale it gets its own,
// deliberately far-apart lightness step per role so two accent areas next
// to each other (e.g. a positive vs. negative bar) stay distinguishable
// by lightness alone even without a pattern.
//
// Every grayscale fill keeps at least 10 % ink coverage, KDP's minimum gray
// fill for a black-and-white interior (lighter grays may print as white);
// the lightest, neutral, sits at about 12 %, each role one clear step darker.
const TONES = {
  neutral: {
    color: { fill: "#F7F5EF", fillStrong: "#F3F0E8", stroke: "#817B6D", text: "#5F594D", accent: "#817B6D" },
    grayscale: { fill: "#E0E0E0", fillStrong: "#D6D6D6", stroke: "#6B6B6B", text: "#333333", accent: "#6B6B6B" },
  },
  teal: {
    color: { fill: "#E8F3F1", fillStrong: "#D7ECE7", stroke: "#0E7469", text: "#0A5148", accent: "#0E7469" },
    grayscale: { fill: "#D0D0D0", fillStrong: "#C6C6C6", stroke: "#333333", text: "#1A1A1A", accent: "#4A4A4A" },
  },
  amber: {
    color: { fill: "#FFF3D8", fillStrong: "#FBF2E0", stroke: "#986816", text: "#62430E", accent: "#986816" },
    grayscale: { fill: "#C0C0C0", fillStrong: "#B6B6B6", stroke: "#333333", text: "#1A1A1A", accent: "#A8A8A8" },
  },
  purple: {
    color: { fill: "#E8E5F4", fillStrong: "#E8E5F4", stroke: "#5E4B8B", text: "#49386F", accent: "#5E4B8B" },
    grayscale: { fill: "#B0B0B0", fillStrong: "#A6A6A6", stroke: "#1A1A1A", text: "#141414", accent: "#787878" },
  },
};

// Grayscale-only differentiators, one triple per role, deliberately absent
// (all-zero/undefined) for `color` since the color profile already
// distinguishes roles by hue alone and must stay pixel-identical to what
// shipped before ADR-0016.
//
// `satoriBorderStyle` is constrained to Satori's supported CSS border
// values ("solid" | "dashed" -- "dotted" throws at render time), so amber
// and purple share "dashed" there; they stay distinguishable in Satori
// output via their different hatch pattern (lines vs. dots) and fill
// lightness. D2 has no such constraint -- `d2Pattern`/`strokeDash` give
// purple its own dotted D2 border independent of this field.
const GRAYSCALE_MARKS = {
  neutral: { d2Pattern: undefined, strokeDash: 0, satoriBorderStyle: "solid" },
  teal: { d2Pattern: undefined, strokeDash: 0, satoriBorderStyle: "solid" },
  amber: { d2Pattern: "lines", strokeDash: 6, satoriBorderStyle: "dashed" },
  purple: { d2Pattern: "dots", strokeDash: 2, satoriBorderStyle: "dashed" },
};

export const TONE_NAMES = Object.keys(TONES);

/**
 * Resolve one semantic role ("neutral" | "teal" | "amber" | "purple") to
 * concrete style values for a rendering profile ("color" | "grayscale").
 */
export function tone(name, profile) {
  const set = TONES[name];
  if (!set) throw new Error(`unknown tone: ${name}`);
  if (profile !== "color" && profile !== "grayscale") {
    throw new Error(`unknown profile: ${profile}`);
  }
  const base = set[profile];
  const marks = profile === "grayscale" ? GRAYSCALE_MARKS[name] : { d2Pattern: undefined, strokeDash: 0, satoriBorderStyle: "solid" };
  return { ...base, ...marks };
}

/** D2 `style.*` lines for a shape carrying role `name`, e.g. interpolated into a D2 template string. */
export function d2Style(name, profile, { fillKey = "fill", strokeWidth } = {}) {
  const t = tone(name, profile);
  const lines = [
    `  style.font-color: "${t.text}"`,
    `  style.fill: "${fillKey === "fillStrong" ? t.fillStrong : t.fill}"`,
    `  style.stroke: "${t.stroke}"`,
  ];
  if (t.d2Pattern) lines.push(`  style.fill-pattern: "${t.d2Pattern}"`);
  if (t.strokeDash) lines.push(`  style.stroke-dash: ${t.strokeDash}`);
  if (strokeWidth) lines.push(`  style.stroke-width: ${strokeWidth}`);
  return lines.join("\n");
}

/** D2 `style.*` lines for an edge carrying role `name` (edges have no fill). */
export function d2EdgeStyle(name, profile) {
  const t = tone(name, profile);
  const lines = [`  style.stroke: "${t.stroke}"`];
  if (t.strokeDash) lines.push(`  style.stroke-dash: ${t.strokeDash}`);
  return lines.join("\n");
}

/** Satori CSS `background` value for role `name` -- a solid fill in the color profile, a diagonal hatch over the gray fill for amber/purple in grayscale. */
export function satoriBackground(name, profile, { fillKey = "fill" } = {}) {
  const t = tone(name, profile);
  const base = fillKey === "fillStrong" ? t.fillStrong : t.fill;
  if (!t.d2Pattern) return base;
  const hatch = t.d2Pattern === "dots" ? "radial-gradient(circle at 3px 3px, #8C8C8C 1.1px, transparent 1.2px)" : "repeating-linear-gradient(45deg, #8C8C8C 0 2px, transparent 2px 8px)";
  return `${hatch}, ${base}`;
}

/** Satori CSS `border` shorthand for role `name`. */
export function satoriBorder(name, profile, { width = 2 } = {}) {
  const t = tone(name, profile);
  return `${width}px ${t.satoriBorderStyle} ${t.stroke}`;
}
