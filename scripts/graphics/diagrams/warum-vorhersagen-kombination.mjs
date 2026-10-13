import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder, printLine } from "../tokens.mjs";

// Baustein warum-vorhersagen-mehr-ist-als-nachplappern (Themenbereich 4, Nr. 2),
// diagram D2: "dax zweimal". Two parts the model has seen (the word, the rule)
// are stored and drawn with a solid border; the combination is produced while
// writing and drawn with a dashed border on a white field. Invented example
// words only (Lake & Baroni 2018 use the same kind of nonsense word).

const FONT = "IBM Plex Sans";
const W = 720;
const H = 300;

const WORD_BOX = { left: 16, top: 40, width: 310, height: 96 };
const RULE_BOX = { left: 16, top: 160, width: 310, height: 96 };
const RESULT_BOX = { left: 440, top: 72, width: 264, height: 152 };

function arrow(x1, y1, x2, y2, stroke, width) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const head = 12;
  const bx = x2 - head * Math.cos(ang);
  const by = y2 - head * Math.sin(ang);
  const nx = -Math.sin(ang) * 6.5;
  const ny = Math.cos(ang) * 6.5;
  return [
    { type: "line", props: { x1, y1, x2: bx, y2: by, stroke, strokeWidth: width } },
    { type: "polygon", props: { points: `${x2},${y2} ${(bx + nx).toFixed(1)},${(by + ny).toFixed(1)} ${(bx - nx).toFixed(1)},${(by - ny).toFixed(1)}`, fill: stroke } },
  ];
}

function line(content, { size = 18, weight = 400, mt = 0, color } = {}) {
  return {
    type: "div",
    props: { style: { display: "flex", fontFamily: FONT, fontSize: `${size}px`, fontWeight: weight, marginTop: `${mt}px`, color }, children: content },
  };
}

// Stored parts: solid border, tone fill. Computed result: dashed border, white field.
function box(profile, role, geo, lines, { computed = false } = {}) {
  const t = tone(role, profile);
  const border = computed ? `${printLine(2, profile)}px dashed ${t.stroke}` : satoriBorder(role, profile);
  return {
    type: "div",
    props: {
      style: abs({
        left: `${geo.left}px`,
        top: `${geo.top}px`,
        width: `${geo.width}px`,
        height: `${geo.height}px`,
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "14px",
        paddingRight: "14px",
        borderRadius: "12px",
        background: computed ? "#FFFFFF" : satoriBackground(role, profile, { fillKey: "fillStrong" }),
        border,
        color: t.text,
      }),
      children: lines,
    },
  };
}

// Legend sample: the same border style as the box it explains.
function sample(profile, role, left, top, { computed = false } = {}) {
  const t = tone(role, profile);
  return {
    type: "div",
    props: {
      style: abs({
        left: `${left}px`,
        top: `${top}px`,
        width: "40px",
        height: "24px",
        borderRadius: "6px",
        background: computed ? "#FFFFFF" : satoriBackground(role, profile, { fillKey: "fillStrong" }),
        border: computed ? `${printLine(2, profile)}px dashed ${t.stroke}` : satoriBorder(role, profile),
      }),
      children: [],
    },
  };
}

function build(l, profile) {
  const ink = tone("neutral", profile);
  const width = printLine(2.5, profile);
  const wordStroke = tone("teal", profile).stroke;
  const ruleStroke = ink.stroke;
  const resultMid = RESULT_BOX.top + RESULT_BOX.height / 2;
  const svgChildren = [
    ...arrow(WORD_BOX.left + WORD_BOX.width + 2, WORD_BOX.top + WORD_BOX.height / 2, RESULT_BOX.left - 2, resultMid - 26, wordStroke, width),
    ...arrow(RULE_BOX.left + RULE_BOX.width + 2, RULE_BOX.top + RULE_BOX.height / 2, RESULT_BOX.left - 2, resultMid + 26, ruleStroke, width),
  ];
  const tree = {
    type: "div",
    props: {
      style: { width: `${W}px`, height: `${H}px`, display: "flex", position: "relative" },
      children: [
        { type: "svg", props: { xmlns: "http://www.w3.org/2000/svg", viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: { position: "absolute", left: 0, top: 0 }, children: svgChildren } },
        box(profile, "teal", WORD_BOX, [line(l.wordTitle, { size: 22, weight: 700 }), line(l.wordSub, { mt: 4 })]),
        box(profile, "neutral", RULE_BOX, [line(l.ruleTitle, { size: 22, weight: 700 }), line(l.ruleSub, { mt: 4 })]),
        box(profile, "neutral", RESULT_BOX, [line(l.resultTitle, { size: 22, weight: 700 }), line(l.resultSub, { mt: 4 })], { computed: true }),
        sample(profile, "teal", 16, 268),
        {
          type: "div",
          props: { style: abs({ left: "66px", top: "266px", fontFamily: FONT, fontSize: "18px" }), children: l.legendStored },
        },
        sample(profile, "neutral", 370, 268, { computed: true }),
        {
          type: "div",
          props: { style: abs({ left: "420px", top: "266px", fontFamily: FONT, fontSize: "18px" }), children: l.legendComputed },
        },
      ],
    },
  };
  return renderSvg(tree, W, H);
}

const DE = {
  wordTitle: "Wort: dax",
  wordSub: "im Training vorhanden",
  ruleTitle: "Regel: zweimal = wiederholen",
  ruleSub: "vielfach gelernt",
  resultTitle: "dax zweimal",
  resultSub: "Kombination, so nie im Text",
  legendStored: "gespeichert: aus dem Training",
  legendComputed: "neu erzeugt: beim Schreiben",
};

const EN = {
  wordTitle: "Word: dax",
  wordSub: "present in training",
  ruleTitle: "Rule: twice = repeat",
  ruleSub: "learned from many texts",
  resultTitle: "dax twice",
  resultSub: "Combination, never in the text",
  legendStored: "stored: from training",
  legendComputed: "new: generated while writing",
};

export const kombinationDe = {
  outPath: "public/bausteine/warum-vorhersagen-mehr-ist-als-nachplappern/neu-a-kombination.svg",
  build: (profile) => build(DE, profile),
};

export const kombinationEn = {
  outPath: "public/bausteine/warum-vorhersagen-mehr-ist-als-nachplappern/neu-a-combination.svg",
  build: (profile) => build(EN, profile),
};
