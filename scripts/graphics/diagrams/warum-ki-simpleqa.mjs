import { renderSvg, abs } from "../satori-render.mjs";
import { tone, printLine } from "../tokens.mjs";

// Baustein warum-ki-ueberzeugend-falsch-liegt: SimpleQA results of two models
// without web search, one bar per measure: accuracy (answered questions) and
// hallucination rate. Values from the GPT-5 system card, Table 8. The card
// gives no abstention rate, so none is drawn.

const FONT = "IBM Plex Sans";
const W = 720;
const H = 352;

const X0 = 236; // left edge of the bars
const SCALE = 4.6; // px per percentage point: 100 % = 460 px
const BAR_H = 44;
const ROWS = [
  { y: 30, model: "gpt-5-thinking-mini", bars: [{ pct: 22, role: "teal" }, { pct: 26, role: "amber" }] },
  { y: 150, model: "o4-mini", bars: [{ pct: 24, role: "teal" }, { pct: 75, role: "amber" }] },
];
const BAR_GAP = 16; // vertical gap between the two bars of one model

function text(content, left, top, width, style = {}) {
  return {
    type: "div",
    props: { style: abs({ left: `${left}px`, top: `${top}px`, width: `${width}px`, fontFamily: FONT, fontSize: "18px", ...style }), children: content },
  };
}

// White on teal and on amber in the colour profile; dark on the light amber
// grey of the grayscale profile (white there would fall below 3:1).
function onFill(role, profile) {
  return role === "amber" && profile === "grayscale" ? "#1A1A1A" : "#FFFFFF";
}

function build(l, profile) {
  const ink = tone("neutral", profile);
  const svgChildren = [];
  const labels = [];

  ROWS.forEach((row) => {
    row.bars.forEach((bar, i) => {
      const y = row.y + i * (BAR_H + BAR_GAP);
      const w = bar.pct * SCALE;
      const t = tone(bar.role, profile);
      svgChildren.push({
        type: "rect",
        props: { x: X0, y, width: w, height: BAR_H, fill: t.accent },
      });
      if (w >= 60) {
        labels.push(text(l.pct(bar.pct), X0, y + 11, w, { fontWeight: 700, color: onFill(bar.role, profile), justifyContent: "center" }));
      } else {
        labels.push(text(l.pct(bar.pct), X0 + w + 8, y + 11, 80, { fontWeight: 700, color: ink.text }));
      }
    });
    labels.push(text(row.model, 16, row.y + 11, 210, { fontWeight: 700, color: ink.text }));
  });

  // Legend below the bars.
  const legend = [
    { x: 16, role: "teal", label: l.correct, labelW: 300 },
    { x: 340, role: "amber", label: l.wrong, labelW: 350 },
  ];
  legend.forEach((item) => {
    const t = tone(item.role, profile);
    svgChildren.push({
      type: "rect",
      props: { x: item.x, y: 262, width: 18, height: 18, fill: t.accent },
    });
    labels.push(text(item.label, item.x + 26, 258, item.labelW, { color: ink.text }));
  });

  labels.push(text(l.caption, 16, 300, 688, { color: ink.text, lineHeight: "24px" }));

  const tree = {
    type: "div",
    props: {
      style: { width: `${W}px`, height: `${H}px`, display: "flex", position: "relative" },
      children: [{ type: "svg", props: { xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: { position: "absolute", left: 0, top: 0 }, children: svgChildren } }, ...labels],
    },
  };
  return renderSvg(tree, W, H);
}

const DE = {
  pct: (p) => `${p} %`,
  correct: "Genauigkeit (beantwortete Fragen)",
  wrong: "Halluzinationsrate (erfundene Antworten)",
  caption: "SimpleQA ohne Websuche, Bericht zu GPT-5, Tabelle 8.",
};

const EN = {
  pct: (p) => `${p}%`,
  correct: "Accuracy (answered questions)",
  wrong: "Hallucination rate (invented answers)",
  caption: "SimpleQA without web search, GPT-5 report, Table 8.",
};

export const simpleQaDe = {
  outPath: "public/bausteine/warum-ki-ueberzeugend-falsch-liegt/simpleqa-vergleich.svg",
  build: (profile) => build(DE, profile),
};

export const simpleQaEn = {
  outPath: "public/bausteine/warum-ki-ueberzeugend-falsch-liegt/simpleqa-comparison.svg",
  build: (profile) => build(EN, profile),
};
