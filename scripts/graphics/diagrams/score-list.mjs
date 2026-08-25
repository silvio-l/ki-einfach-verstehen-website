import { renderSvg, abs } from "../satori-render.mjs";
import { tone } from "../tokens.mjs";

const WIDTH = 520;
const HEIGHT = 200;
const ZERO_X = 180;
const ROW_H = 36;
const BAR_H = 18;
const SCALE = 20; // px per score point, matches the original hand-authored charts

function formatScore(score, decimalSeparator) {
  const text = Math.abs(score).toFixed(1).replace(".", decimalSeparator);
  return score < 0 ? `−${text}` : text;
}

function label(text, style) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        fontFamily: "IBM Plex Sans",
        fontSize: "13px",
        color: "#1B1A17",
        ...style,
      },
      children: text,
    },
  };
}

async function build(rows, decimalSeparator, profile) {
  // Positive/negative are already distinguished structurally (bar grows
  // right vs. left of the zero line) and by the +/- sign baked into
  // `scoreText` -- so a flat, pattern-free tone fill is enough here to
  // satisfy ADR-0016 without the Satori-pattern-fill/multi-rect complexity
  // that would break the animation regex below (a hatch background
  // renders as two stacked <rect fill="url(#...)"> instead of one
  // <rect fill="#hex">).
  const positiveColor = tone("teal", profile).accent;
  const negativeColor = tone("amber", profile).accent;

  const children = [
    { type: "div", props: { style: abs({ left: `${ZERO_X}px`, top: "8px", width: "1px", height: "184px", background: "#DAD6CB" }), children: "" } },
  ];

  rows.forEach((row, i) => {
    const y = 16 + i * ROW_H;
    const w = Math.round(Math.abs(row.score) * SCALE);
    const barX = row.positive ? ZERO_X : ZERO_X - w;
    const color = row.positive ? positiveColor : negativeColor;
    const scoreText = formatScore(row.score, decimalSeparator);

    if (row.positive) {
      children.push(
        { type: "div", props: { style: abs({ left: "0px", top: `${y - 4}px`, width: `${ZERO_X - 10}px`, height: "22px", justifyContent: "flex-end", alignItems: "center" }), children: [label(row.label, {})] } },
        { type: "div", props: { style: abs({ left: `${barX}px`, top: `${y}px`, width: `${w}px`, height: `${BAR_H}px`, background: color }), children: "" } },
        { type: "div", props: { style: abs({ left: `${barX + w + 6}px`, top: `${y - 4}px`, height: "22px", alignItems: "center" }), children: [label(scoreText, {})] } },
      );
    } else {
      children.push(
        { type: "div", props: { style: abs({ left: "0px", top: `${y - 4}px`, width: `${barX - 6}px`, height: "22px", justifyContent: "flex-end", alignItems: "center" }), children: [label(scoreText, {})] } },
        { type: "div", props: { style: abs({ left: `${barX}px`, top: `${y}px`, width: `${w}px`, height: `${BAR_H}px`, background: color }), children: "" } },
        { type: "div", props: { style: abs({ left: `${ZERO_X + 6}px`, top: `${y - 4}px`, height: "22px", alignItems: "center" }), children: [label(row.label, {})] } },
      );
    }
  });

  const tree = { type: "div", props: { style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", position: "relative" }, children } };
  let svg = await renderSvg(tree, WIDTH, HEIGHT);

  // Re-inject the staggered reveal animation satori's static output doesn't produce.
  // The fill alternation is built from this profile's actual tone hex values
  // (not hardcoded) -- the grayscale profile's fills differ from color's, and a
  // hardcoded alternation would silently stop matching and drop the animation.
  let barIndex = 0;
  const fillAlternation = [positiveColor, negativeColor].join("|");
  const barRect = new RegExp(`<rect x="([\\d.]+)" y="([\\d.]+)" width="([\\d.]+)" height="18" fill="(${fillAlternation})"\\/>`, "g");
  svg = svg.replace(barRect, (match, x, y, w, fill) => {
    const row = rows[barIndex++];
    const begin = `${(rows.indexOf(row) * 0.12).toFixed(2)}s`;
    const animX = row.positive ? "" : `<animate attributeName="x" from="${ZERO_X}" to="${x}" dur="0.7s" begin="${begin}" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1"/>`;
    const animW = `<animate attributeName="width" from="0" to="${w}" dur="0.7s" begin="${begin}" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1"/>`;
    return `<rect x="${x}" y="${y}" width="${w}" height="18" fill="${fill}">${animX}${animW}</rect>`;
  });
  return svg;
}

export const scoreListDe1 = {
  outPath: "public/bausteine/input-und-output/score-liste-1.svg",
  build: (profile) =>
    build(
      [
        { label: "auf", score: 8.1, positive: true },
        { label: "still", score: 5.4, positive: true },
        { label: "schnell", score: 2.0, positive: true },
        { label: "Auto", score: -3.7, positive: false },
        { label: "Regen", score: -4.9, positive: false },
      ],
      ",",
      profile,
    ),
};

export const scoreListDe2 = {
  outPath: "public/bausteine/input-und-output/score-liste-2.svg",
  build: (profile) =>
    build(
      [
        { label: "dem", score: 7.6, positive: true },
        { label: "einem", score: 6.8, positive: true },
        { label: "still", score: 1.2, positive: true },
        { label: "Auto", score: -2.9, positive: false },
        { label: "Regen", score: -5.3, positive: false },
      ],
      ",",
      profile,
    ),
};

export const scoreListEn1 = {
  outPath: "public/bausteine/input-und-output/score-list-1.svg",
  build: (profile) =>
    build(
      [
        { label: "quietly", score: 8.1, positive: true },
        { label: "still", score: 5.4, positive: true },
        { label: "outside", score: 2.0, positive: true },
        { label: "car", score: -3.7, positive: false },
        { label: "rain", score: -4.9, positive: false },
      ],
      ".",
      profile,
    ),
};

export const scoreListEn2 = {
  outPath: "public/bausteine/input-und-output/score-list-2.svg",
  build: (profile) =>
    build(
      [
        { label: "on", score: 7.4, positive: true },
        { label: "by", score: 6.5, positive: true },
        { label: "still", score: 1.1, positive: true },
        { label: "car", score: -2.8, positive: false },
        { label: "rain", score: -5.1, positive: false },
      ],
      ".",
      profile,
    ),
};
