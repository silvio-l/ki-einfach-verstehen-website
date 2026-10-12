import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Forward Pass und Loss" (Themenbereich 3, Nr. 2). Strafpunkte are
// the per-position cross-entropy loss, -ln p (natural log, as PyTorch). The
// halving staircase and the four-position sentence use made-up field sizes
// that sit on the halving series; the real values on the scale come from
// Qwen3-0.6B-Base (src/scripts/demos/data/satzloss.json: Paris 0.744, "Der
// Hund jagt die Katze" mean 4.832) and from ln(vocabulary size) for the
// untrained start (151,936 -> 11.93, GPT-2 50,257 -> 10.82).

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "16px", color: INK, ...style }, children: content } };
}

function at({ children, ...style }) {
  return { type: "div", props: { style: abs(style), children } };
}

function box(width, height, role, profile, { fillKey = "fill", radius = 3, border = false } = {}) {
  const style = { display: "flex", width: `${width}px`, height: `${height}px`, borderRadius: `${radius}px` };
  if (border) Object.assign(style, { background: satoriBackground(role, profile, { fillKey }), border: satoriBorder(role, profile, { width: 2 }) });
  else style.background = tone(role, profile).accent;
  return { type: "div", props: { style, children: "" } };
}

function line(left, top, width, height, profile, role = "neutral") {
  return at({ left: `${left}px`, top: `${top}px`, children: [{ type: "div", props: { style: { display: "flex", width: `${width}px`, height: `${height}px`, background: tone(role, profile).stroke }, children: "" } }] });
}

function frame(children, w, h) {
  return { type: "div", props: { style: { width: `${w}px`, height: `${h}px`, display: "flex", position: "relative" }, children } };
}

const num = (x, lang, digits = 1) => {
  const s = x.toFixed(digits);
  return lang === "de" ? s.replace(".", ",") : s;
};

// ---------------------------------------------------------------------------
// 1. Halving the field: every halving costs about 0.7 more (Abschnitt 1)

const HV_W = 640;
const HV_H = 320;
const HV_BASE = 236; // y of the zero line
const HV_SCALE = 30; // px per Strafpunkt
const HV_COL = 78;
const HV_X0 = 20;
const HV_BAR = 46;

async function buildHalving(l, profile) {
  const muted = tone("neutral", profile).text;
  const steps = [100, 50, 25, 12.5, 6.25, 3.125];
  const children = [
    at({ left: "0px", top: "4px", width: `${HV_W}px`, children: [text(l.title, { fontWeight: 700 })] }),
    at({ left: "0px", top: "30px", alignItems: "center", children: [box(16, 16, "amber", profile), text(l.legendPenalty, { marginLeft: "8px", color: muted })] }),
    at({ left: "180px", top: "30px", alignItems: "center", children: [box(16, 16, "teal", profile), text(l.legendField, { marginLeft: "8px", color: muted })] }),
    line(HV_X0 - 6, HV_BASE, HV_COL * 7 + 6, 2, profile),
  ];
  const cols = [...steps.map((p, i) => ({ p, label: l.percents[i] })), { p: 1, label: l.percents[6], extra: true }];
  cols.forEach(({ p, label, extra }, i) => {
    const x = HV_X0 + i * HV_COL + (extra ? 14 : 0);
    const loss = -Math.log(p / 100);
    const h = Math.max(2, Math.round(loss * HV_SCALE));
    const value = i === 0 ? "0" : extra ? num(loss, l.lang, 2) : num(Math.round(loss * 10) / 10, l.lang);
    children.push(at({ left: `${x}px`, top: `${HV_BASE - h}px`, children: [box(HV_BAR, h, "amber", profile)] }));
    children.push(at({ left: `${x - 10}px`, top: `${HV_BASE - h - 24}px`, width: `${HV_BAR + 20}px`, justifyContent: "center", children: [text(value, { fontWeight: 700 })] }));
    // The field: a teal strip whose width is the field's share of the column.
    const fw = Math.max(2, Math.round((HV_BAR * p) / 100));
    children.push(at({ left: `${x}px`, top: `${HV_BASE + 10}px`, children: [box(HV_BAR, 14, "neutral", profile, { border: true, radius: 2 })] }));
    children.push(at({ left: `${x + 2}px`, top: `${HV_BASE + 12}px`, children: [box(Math.max(1, fw - 4), 10, "teal", profile, { radius: 1 })] }));
    children.push(at({ left: `${x - 12}px`, top: `${HV_BASE + 30}px`, width: `${HV_BAR + 24}px`, justifyContent: "center", children: [text(label)] }));
    if (i > 0 && !extra) children.push(at({ left: `${x - 30}px`, top: `${HV_BASE + 52}px`, width: "60px", justifyContent: "center", children: [text(l.half, { color: muted })] }));
  });
  children.push(at({ left: `${HV_X0 + 6 * HV_COL - 44}px`, top: `${HV_BASE + 52}px`, width: "196px", justifyContent: "flex-end", children: [text(l.noLimit, { color: muted })] }));
  return renderSvg(frame(children, HV_W, HV_H), HV_W, HV_H);
}

export const halvingDe = {
  outPath: "public/bausteine/forward-pass-und-loss/halbieren.svg",
  build: (profile) =>
    buildHalving(
      {
        lang: "de",
        title: "Feld des richtigen Tokens und seine Strafpunkte (berechnet)",
        legendPenalty: "Strafpunkte",
        legendField: "Feld des Tokens, das tatsächlich folgt",
        percents: ["100 %", "50 %", "25 %", "12,5 %", "6,25 %", "3,1 %", "1 %"],
        half: "halb",
        noLimit: "gegen 0 % ohne Grenze",
      },
      profile,
    ),
};

export const halvingEn = {
  outPath: "public/bausteine/forward-pass-und-loss/halving.svg",
  build: (profile) =>
    buildHalving(
      {
        lang: "en",
        title: "Segment of the right token and its penalty points (calculated)",
        legendPenalty: "Penalty points",
        legendField: "Segment of the token that actually follows",
        percents: ["100%", "50%", "25%", "12.5%", "6.25%", "3.1%", "1%"],
        half: "half",
        noLimit: "no limit towards 0%",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 2. One forward pass, four positions, one average (Abschnitt 2)

const PL_W = 640;
const PL_H = 410;
const PL_COL = 126;
const PL_X0 = 10;

async function buildPositions(l, profile) {
  const muted = tone("neutral", profile).text;
  const children = [at({ left: "0px", top: "4px", width: `${PL_W}px`, children: [text(l.title, { fontWeight: 700 })] })];
  l.words.forEach((w, i) => {
    const x = PL_X0 + i * PL_COL;
    children.push(
      at({
        left: `${x}px`,
        top: "40px",
        width: "108px",
        height: "38px",
        alignItems: "center",
        justifyContent: "center",
        background: satoriBackground("neutral", profile, { fillKey: "fillStrong" }),
        border: satoriBorder("neutral", profile, { width: 2 }),
        borderRadius: "6px",
        children: [text(w, { fontWeight: 700 })],
      }),
    );
    // The card sits under the predicted word: its segment came from the
    // position before it. The first word is not predicted.
    const pos = i > 0 ? l.positions[i - 1] : null;
    if (!pos) {
      children.push(at({ left: `${x}px`, top: "104px", width: "108px", justifyContent: "center", children: [text(l.noTarget, { color: muted, textAlign: "center" })] }));
      return;
    }
    children.push(line(x + 53, 78, 2, 20, profile));
    const card = [
      text(l.after(l.words[i - 1]), { color: muted }),
      text(l.field(pos.p), { marginTop: "8px", color: tone("teal", profile).text }),
      text(num(pos.loss, l.lang), { fontSize: "20px", fontWeight: 700, marginTop: "6px", color: tone("amber", profile).text }),
      text(l.penalty, { color: tone("amber", profile).text }),
    ];
    children.push(
      at({
        left: `${x - 8}px`,
        top: "98px",
        width: "124px",
        height: "150px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: satoriBackground("amber", profile),
        border: satoriBorder("amber", profile, { width: 2 }),
        borderRadius: "6px",
        children: card,
      }),
    );
    children.push(line(x + 53, 248, 2, 22, profile));
  });
  children.push(line(PL_X0 + 53 + PL_COL, 270, 3 * PL_COL + 2, 2, profile));
  children.push(line(PL_X0 + 53 + 2.5 * PL_COL, 270, 2, 20, profile));
  children.push(
    at({
      left: "40px",
      top: "290px",
      width: `${PL_W - 80}px`,
      height: "66px",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: satoriBackground("amber", profile, { fillKey: "fillStrong" }),
      border: satoriBorder("amber", profile, { width: 2 }),
      borderRadius: "6px",
      children: [text(l.sum), text(l.mean, { fontWeight: 700, marginTop: "4px" })],
    }),
  );
  children.push(at({ left: "0px", top: "364px", width: `${PL_W}px`, children: [text(l.note, { color: muted })] }));
  return renderSvg(frame(children, PL_W, PL_H), PL_W, PL_H);
}

const TOY = [
  { p: 1, loss: 4.6 },
  { p: 25, loss: 1.4 },
  { p: 50, loss: 0.7 },
  { p: 12.5, loss: 2.1 },
];

export const positionsLossDe = {
  outPath: "public/bausteine/forward-pass-und-loss/positionen-loss.svg",
  build: (profile) =>
    buildPositions(
      {
        lang: "de",
        title: "Ein Vorwärtsdurchlauf: Strafpunkte an jeder Position",
        words: ["Der", "Hund", "jagt", "die", "Katze"],
        positions: ["Hund", "jagt", "die", "Katze"].map((target, i) => ({ target, ...TOY[i] })),
        after: (w) => `nach „${w}“`,
        field: (p) => `Feld ${num(p, "de", p % 1 ? 1 : 0)} %`,
        penalty: "Strafpunkte",
        noTarget: "Start, wird nicht vorhergesagt",
        sum: "4,6 + 1,4 + 0,7 + 2,1 = 8,8 Strafpunkte, geteilt durch 4 Positionen",
        mean: "Durchschnitt mit ausgedachten Feldern: 2,2",
        note: "Feld: was die Position davor dem Wort gab, das tatsächlich folgt. Prozente ausgedacht, Strafpunkte daraus berechnet.",
      },
      profile,
    ),
};

export const positionsLossEn = {
  outPath: "public/bausteine/forward-pass-und-loss/positions-loss.svg",
  build: (profile) =>
    buildPositions(
      {
        lang: "en",
        title: "One forward pass: penalty points at every position",
        words: ["The", "dog", "chases", "the", "cat"],
        positions: ["dog", "chases", "the", "cat"].map((target, i) => ({ target, ...TOY[i] })),
        after: (w) => `after “${w}”`,
        field: (p) => `segment ${num(p, "en", p % 1 ? 1 : 0)}%`,
        penalty: "penalty points",
        noTarget: "start, not predicted",
        sum: "4.6 + 1.4 + 0.7 + 2.1 = 8.8 penalty points, divided by 4 positions",
        mean: "Average with the made-up segments: 2.2",
        note: "Segment: what the position before gave the word that actually follows. Percentages made up, penalty points calculated from them.",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 3. Where loss values lie (Abschnitt 3)

const SC_W = 640;
const SC_H = 320;
const SC_X0 = 26;
const SC_PX = 46; // px per Strafpunkt
const SC_AXIS = 134;
const SC_LABEL = 230; // label column width

async function buildScale(l, profile) {
  const muted = tone("neutral", profile).text;
  const children = [
    at({ left: "0px", top: "4px", width: `${SC_W}px`, children: [text(l.title, { fontWeight: 700 })] }),
    line(SC_X0, SC_AXIS, 12.6 * SC_PX, 3, profile),
    // Arrow head: no upper limit.
    at({
      left: `${SC_X0 + 12.6 * SC_PX - 12}px`,
      top: `${SC_AXIS - 6}px`,
      width: "14px",
      height: "14px",
      borderTop: `3px solid ${tone("neutral", profile).stroke}`,
      borderRight: `3px solid ${tone("neutral", profile).stroke}`,
      transform: "rotate(45deg)",
      children: [],
    }),
  ];
  for (let t = 0; t <= 12; t += 2) {
    const x = SC_X0 + t * SC_PX;
    children.push(line(x - 1, SC_AXIS - 6, 2, 15, profile));
    children.push(at({ left: `${x - 15}px`, top: `${SC_AXIS + 12}px`, width: "30px", justifyContent: "center", children: [text(String(t), { color: muted })] }));
  }
  l.marks.forEach(({ v, label, above, role }) => {
    const x = SC_X0 + v * SC_PX;
    children.push(at({ left: `${x - 6}px`, top: `${SC_AXIS - 5}px`, children: [box(12, 12, role, profile, { radius: 6 })] }));
    if (!label.length) return;
    const top = above ? 36 : 184;
    // Leader line from the label to its dot on the axis; below the axis it
    // starts under the tick numbers.
    children.push(above ? line(x - 1, 108, 2, SC_AXIS - 112, profile, role) : line(x - 1, SC_AXIS + 8, 2, 4, profile, role));
    if (!above) children.push(line(x - 1, SC_AXIS + 36, 2, top - SC_AXIS - 40, profile, role));
    const half = SC_LABEL / 2;
    const left = Math.min(Math.max(0, x - half), SC_W - SC_LABEL);
    const align = x - half < 0 ? "left" : x + half > SC_W ? "right" : "center";
    children.push(
      at({
        left: `${left}px`,
        top: `${top}px`,
        width: `${SC_LABEL}px`,
        flexDirection: "column",
        alignItems: { left: "flex-start", right: "flex-end", center: "center" }[align],
        children: [text(l.lang === "de" ? String(v).replace(".", ",") : String(v), { fontWeight: 700 }), ...label.map((s) => text(s, { color: muted, textAlign: align }))],
      }),
    );
  });
  children.push(at({ left: "0px", top: `${SC_H - 50}px`, width: `${SC_W}px`, children: [text(l.note, { color: muted })] }));
  return renderSvg(frame(children, SC_W, SC_H), SC_W, SC_H);
}

export const lossScaleDe = {
  outPath: "public/bausteine/forward-pass-und-loss/loss-skala.svg",
  build: (profile) =>
    buildScale(
      {
        lang: "de",
        title: "Wo Loss-Werte liegen (Strafpunkte pro Position im Durchschnitt)",
        marks: [
          { v: 0, label: [], above: false, role: "teal" },
          { v: 0.74, label: ["„Paris“, eine Position", "Qwen3-0.6B"], above: false, role: "teal" },
          { v: 4.8, label: ["„Der Hund …“, ganzer Satz", "Qwen3-0.6B"], above: true, role: "teal" },
          { v: 10.8, label: ["gleichmäßiges Rad,", "50.257 Tokens (GPT-2)"], above: false, role: "amber" },
          { v: 11.9, label: ["gleichmäßiges Rad,", "151.936 Tokens (Qwen3)"], above: true, role: "amber" },
        ],
        note: "0 nur bei 100 % für jedes richtige Token. Nach oben keine Grenze. Direkt vergleichbar nur bei gleichem Tokenizer und Text.",
      },
      profile,
    ),
};

export const lossScaleEn = {
  outPath: "public/bausteine/forward-pass-und-loss/loss-scale.svg",
  build: (profile) =>
    buildScale(
      {
        lang: "en",
        title: "Where loss values lie (average penalty points per position)",
        marks: [
          { v: 0, label: [], above: false, role: "teal" },
          { v: 1.05, label: ["“Paris”, one position", "Qwen3-0.6B"], above: false, role: "teal" },
          { v: 3.7, label: ["“The dog …”, whole sentence", "Qwen3-0.6B"], above: true, role: "teal" },
          { v: 10.8, label: ["even wheel,", "50,257 tokens (GPT-2)"], above: false, role: "amber" },
          { v: 11.9, label: ["even wheel,", "151,936 tokens (Qwen3)"], above: true, role: "amber" },
        ],
        note: "0 only with 100% on every right token. No upper limit. Directly comparable only with the same tokenizer and text.",
      },
      profile,
    ),
};
