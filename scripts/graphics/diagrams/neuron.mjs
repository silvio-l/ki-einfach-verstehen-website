import { renderSvg, abs } from "../satori-render.mjs";
import { tone } from "../tokens.mjs";
import { block, edge } from "../d2-blocks.mjs";
import { renderD2 } from "../d2-render.mjs";
import { stepperFigure } from "../stepper.mjs";

// Arrows without a label: the input arrows cross, and their weight 1 is said
// in the neuron labels instead, so no two labels land on top of each other.
const bare = (profile) => `{
  style.stroke: "${tone("teal", profile).stroke}"
  style.stroke-width: 2
}`;

// Baustein "Neuronale Netze: Wie aus vielen kleinen Rechnungen ein Modell
// wird". All numbers are the invented Treppenlicht values of the text (two
// switches, neurons A and B, output neuron C with weights 1 and -2) and of the
// live demo (src/scripts/demos/neuron.mjs). Nothing here is a measurement.

const FONT = "IBM Plex Sans";
const INK = "#1B1A17";

// ---------------------------------------------------------------------------
// 1. Knick curve (Abschnitt "Der Grundregler ersetzt die Schwelle"):
//    schematic, not a measurement. Sum on the horizontal axis, output of the
//    neuron on the vertical one. Below zero flat, above zero a straight line.

const K_W = 640;
const K_H = 370;
const K_PLOT = { left: 92, right: 612, top: 34, bottom: 296 };
const K_X = { min: -3, max: 3 };
const K_Y = { min: -0.5, max: 3.2 };

const kx = (x) => K_PLOT.left + ((x - K_X.min) / (K_X.max - K_X.min)) * (K_PLOT.right - K_PLOT.left);
const ky = (y) => K_PLOT.bottom - ((y - K_Y.min) / (K_Y.max - K_Y.min)) * (K_PLOT.bottom - K_PLOT.top);

function klabel(content, left, top, style = {}) {
  return {
    type: "div",
    props: {
      style: abs({ left: `${left}px`, top: `${top}px`, fontFamily: FONT, fontSize: "17px", ...style }),
      children: content,
    },
  };
}

async function buildKnickkurve(l, profile) {
  const ink = tone("neutral", profile);
  const teal = tone("teal", profile);
  const amber = tone("amber", profile);
  const ticksX = [-3, -2, -1, 1, 2, 3];
  const ticksY = [1, 2, 3];
  const svgChildren = [
    // axes cross at the knick (0 | 0)
    { type: "line", props: { x1: K_PLOT.left, y1: ky(0), x2: K_PLOT.right, y2: ky(0), stroke: ink.stroke, strokeWidth: 1.5 } },
    { type: "line", props: { x1: kx(0), y1: K_PLOT.top - 10, x2: kx(0), y2: K_PLOT.bottom, stroke: ink.stroke, strokeWidth: 1.5 } },
    { type: "line", props: { x1: kx(0), y1: K_PLOT.top - 10, x2: kx(0) - 5, y2: K_PLOT.top, stroke: ink.stroke, strokeWidth: 1.5 } },
    { type: "line", props: { x1: kx(0), y1: K_PLOT.top - 10, x2: kx(0) + 5, y2: K_PLOT.top, stroke: ink.stroke, strokeWidth: 1.5 } },
    // the knick: flat below zero, straight above
    {
      type: "path",
      props: {
        d: `M${kx(K_X.min).toFixed(1)},${ky(0).toFixed(1)} L${kx(0).toFixed(1)},${ky(0).toFixed(1)} L${kx(3).toFixed(1)},${ky(3).toFixed(1)}`,
        fill: "none",
        stroke: teal.stroke,
        strokeWidth: 4.5,
        strokeLinejoin: "round",
      },
    },
    { type: "circle", props: { cx: kx(0), cy: ky(0), r: 8, fill: amber.accent, stroke: ink.stroke, strokeWidth: 2 } },
    ...ticksX.map((x) => ({ type: "line", props: { x1: kx(x), y1: ky(0) - 4, x2: kx(x), y2: ky(0) + 4, stroke: ink.stroke, strokeWidth: 1.5 } })),
    ...ticksY.map((y) => ({ type: "line", props: { x1: kx(0) - 4, y1: ky(y), x2: kx(0) + 4, y2: ky(y), stroke: ink.stroke, strokeWidth: 1.5 } })),
  ];
  const tree = {
    type: "div",
    props: {
      style: { width: `${K_W}px`, height: `${K_H}px`, display: "flex", position: "relative" },
      children: [
        {
          type: "svg",
          props: {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: `0 0 ${K_W} ${K_H}`,
            width: K_W,
            height: K_H,
            style: { position: "absolute", left: 0, top: 0 },
            children: svgChildren,
          },
        },
        ...ticksX.map((x) => klabel(x < 0 ? `−${Math.abs(x)}` : String(x), kx(x) - 9, ky(0) + 8, { color: ink.text })),
        ...ticksY.map((y) => klabel(String(y), kx(0) - 28, ky(y) - 10, { color: ink.text })),
        klabel(l.zero, kx(0) + 10, ky(0) + 30, { color: ink.text, fontWeight: 700 }),
        klabel(l.axisX, K_PLOT.left + 110, K_PLOT.bottom + 34, { color: ink.text, fontWeight: 700 }),
        klabel(l.axisY, kx(0) + 12, K_PLOT.top - 16, { color: ink.text, fontWeight: 700 }),
        klabel(l.flat, kx(-2.9), ky(0) - 30, { color: teal.text, fontWeight: 700 }),
        klabel(l.straight, kx(0.35), ky(2.7), { color: teal.text, fontWeight: 700 }),
        klabel(l.schematic, 8, 44, { color: amber.text, fontWeight: 700 }),
      ],
    },
  };
  return renderSvg(tree, K_W, K_H);
}

export const neuronKnickkurveDe = {
  outPath: "public/bausteine/neuronale-netze/neuron-knickkurve.svg",
  build: (profile) =>
    buildKnickkurve(
      {
        axisX: "Summe mit Grundregler",
        axisY: "Ausgabe des Neurons",
        zero: "Knick bei 0",
        flat: "negativ: wird 0",
        straight: "positiv: bleibt",
        schematic: "schematisch, keine Messwerte",
      },
      profile,
    ),
};

export const neuronKnickkurveEn = {
  outPath: "public/bausteine/neuronale-netze/neuron-knickkurve-en.svg",
  build: (profile) =>
    buildKnickkurve(
      {
        axisX: "Sum with bias",
        axisY: "Output of the neuron",
        zero: "kink at 0",
        flat: "negative: becomes 0",
        straight: "positive: stays",
        schematic: "schematic, no measured values",
      },
      profile,
    ),
};

// ---------------------------------------------------------------------------
// 2. Matrix (Abschnitt "Wie viele Zahlen stecken in einer Schicht?"):
//    rows are neurons, columns are inputs, the last column the Grundregler.

// Rows are neurons (Neuron 1-3), columns the two inputs and the Grundregler.
// Every cell is a stored number, so all cells share the stored-value look
// (Grundregler cells amber: the separate column is what the text counts).
function matrixSource(t, profile) {
  const cell = (id, label, role) => `${id}: "${label}" {${block(role, profile)}}`;
  const lines = [
    "grid-rows: 4",
    "grid-columns: 4",
    "horizontal-gap: 18",
    "vertical-gap: 18",
    `corner: "${t.corner}" {${block("neutral", profile)}}`,
    cell("in1", t.in1, "neutral"),
    cell("in2", t.in2, "neutral"),
    cell("bias", t.bias, "neutral"),
  ];
  for (let row = 1; row <= 3; row += 1) {
    lines.push(cell(`n${row}`, t.neuron[row - 1], "neutral"));
    lines.push(cell(`w${row}1`, t.weight, "teal"));
    lines.push(cell(`w${row}2`, t.weight, "teal"));
    lines.push(cell(`g${row}`, t.bias2, "amber"));
  }
  return lines.join("\n");
}

const MATRIX_DE = {
  corner: "Schema,\\nkeine Zahlen",
  in1: "Eingang 1\\n(Schalter oben)",
  in2: "Eingang 2\\n(Schalter unten)",
  bias: "Grundregler\\n(je Neuron)",
  neuron: ["Neuron 1", "Neuron 2", "Neuron 3"],
  weight: "Gewicht",
  bias2: "Grundregler",
};
const MATRIX_EN = {
  corner: "schema,\\nno numbers",
  in1: "Input 1\\n(switch top)",
  in2: "Input 2\\n(switch bottom)",
  bias: "bias\\n(per neuron)",
  neuron: ["Neuron 1", "Neuron 2", "Neuron 3"],
  weight: "weight",
  bias2: "bias",
};

function matrixFigure(t, outPath) {
  return { outPath, build: (profile) => renderD2(matrixSource(t, profile)) };
}

export const neuronMatrixDe = matrixFigure(MATRIX_DE, "public/bausteine/neuronale-netze/neuron-matrix.svg");
export const neuronMatrixEn = matrixFigure(MATRIX_EN, "public/bausteine/neuronale-netze/neuron-matrix-en.svg");

// ---------------------------------------------------------------------------
// 3. Step animation without knick (Abschnitt "Ohne Knick bleibt alles
//    Addition"). The four switch positions in turn; each with two steps:
//    inputs to A and B, then into C. Values in the captions; with the knick
//    the same positions give 0, 1, 1, 0.

// Node ids: oben, unten (inputs), a, b (sums), c (output). Edge labels are the
// weights; they carry the calculation in the static book figure as well.
function ohneKnickSource(t, profile) {
  return `
oben: "${t.top}" {${block("neutral", profile)}}
unten: "${t.bottom}" {${block("neutral", profile)}}
a: "${t.a}" {${block("teal", profile)}}
b: "${t.b}" {${block("teal", profile)}}
c: "${t.c}" {${block("amber", profile)}}

oben -> a: ${bare(profile)}
unten -> a: ${bare(profile)}
oben -> b: ${bare(profile)}
unten -> b: ${bare(profile)}
a -> c: ${edge(profile, "1")}
b -> c: ${edge(profile, "−2")}
`;
}

const OHNE_STEPS = (c) => [
  { nodes: ["oben", "unten", "a", "b"], edges: ["oben -> a", "unten -> a", "oben -> b", "unten -> b"], caption: c[0] },
  { nodes: ["a", "b", "c"], edges: ["a -> c", "b -> c"], caption: c[1] },
  { nodes: ["oben", "a", "b"], edges: ["oben -> a", "oben -> b"], caption: c[2] },
  { nodes: ["a", "b", "c"], edges: ["a -> c", "b -> c"], caption: c[3] },
  { nodes: ["unten", "a", "b"], edges: ["unten -> a", "unten -> b"], caption: c[4] },
  { nodes: ["a", "b", "c"], edges: ["a -> c", "b -> c"], caption: c[5] },
  { nodes: ["oben", "unten", "a", "b"], edges: ["oben -> a", "unten -> a", "oben -> b", "unten -> b"], caption: c[6] },
  { nodes: ["a", "b", "c"], edges: ["a -> c", "b -> c"], caption: c[7] },
];

const OHNE_DE = {
  top: "Schalter oben",
  bottom: "Schalter unten",
  a: "Neuron A\\nSumme der Schalter",
  b: "Neuron B\\nSumme der Schalter − 1",
  c: "Ausgabe-Neuron C\\nA − 2 · B\\nGrundregler 0",
  title: "Das Treppenlicht ohne Knick",
  intro: "Ohne Knick bleibt jede Rechnung eine Summe. Die vier Schalterstellungen nacheinander, mit Weiter oder Abspielen.",
  captions: [
    "Keiner gedrückt: A rechnet 0, B rechnet 0 − 1 = −1. Ohne Knick bleibt die −1 stehen.",
    "C rechnet 0 · 1 + (−1) · (−2) = 2. Mit Knick würde B zu 0 und C zu 0.",
    "Nur oben gedrückt: A rechnet 1, B rechnet 1 − 1 = 0.",
    "C rechnet 1 · 1 + 0 · (−2) = 1. Mit und ohne Knick gleich.",
    "Nur unten gedrückt: A rechnet 1, B rechnet 1 − 1 = 0.",
    "C rechnet 1 · 1 + 0 · (−2) = 1. Mit und ohne Knick gleich.",
    "Beide gedrückt: A rechnet 2, B rechnet 2 − 1 = 1.",
    "C rechnet 2 · 1 + 1 · (−2) = 0. Ohne Knick: 2, 1, 1, 0. Nach Anzahl gedrückter Schalter sinkt der Wert gleichmäßig, 2, 1, 0. Ein Gipfel bei genau einem gedrückten Schalter entsteht so nicht.",
  ],
};

const OHNE_EN = {
  top: "Switch top",
  bottom: "Switch bottom",
  a: "Neuron A\\nsum of switches",
  b: "Neuron B\\nsum of switches − 1",
  c: "Output neuron C\\nA − 2 · B\\nbias 0",
  title: "The stair light without a kink",
  intro: "Without the kink every calculation stays a sum. The four switch positions one after another, with Next or Play.",
  captions: [
    "None pressed: A computes 0, B computes 0 − 1 = −1. Without the kink the −1 stays.",
    "C computes 0 · 1 + (−1) · (−2) = 2. With the kink B would be 0 and C would be 0.",
    "Only top pressed: A computes 1, B computes 1 − 1 = 0.",
    "C computes 1 · 1 + 0 · (−2) = 1. The same with and without the kink.",
    "Only bottom pressed: A computes 1, B computes 1 − 1 = 0.",
    "C computes 1 · 1 + 0 · (−2) = 1. The same with and without the kink.",
    "Both pressed: A computes 2, B computes 2 − 1 = 1.",
    "C computes 2 · 1 + 1 · (−2) = 0. Without the kink: 2, 1, 1, 0. By the number of pressed switches the value falls evenly, 2, 1, 0. A peak at exactly one pressed switch does not arise.",
  ],
};

export const neuronOhneKnickDe = stepperFigure({
  source: ohneKnickSource,
  text: OHNE_DE,
  copy: OHNE_DE,
  steps: OHNE_STEPS,
  lang: "de",
  outPath: "public/bausteine/neuronale-netze/neuron-ohne-knick.static.svg",
  htmlPath: "public/bausteine/neuronale-netze/neuron-ohne-knick.html",
});

export const neuronOhneKnickEn = stepperFigure({
  source: ohneKnickSource,
  text: OHNE_EN,
  copy: OHNE_EN,
  steps: OHNE_STEPS,
  lang: "en",
  outPath: "public/bausteine/neuronale-netze/neuron-ohne-knick-en.static.svg",
  htmlPath: "public/bausteine/neuronale-netze/neuron-ohne-knick-en.html",
});

// ---------------------------------------------------------------------------
// 4. Step animation of stacking (Abschnitt "Schichten stapeln"): two layers,
//    the knick in layer 1 marked (amber), the intermediate values A and B
//    running into C. Positions: nothing pressed, then both pressed.

function stapelungSource(t, profile) {
  return `
oben: "${t.top}" {${block("neutral", profile)}}
unten: "${t.bottom}" {${block("neutral", profile)}}
a: "${t.a}" {${block("amber", profile)}}
b: "${t.b}" {${block("amber", profile)}}
c: "${t.c}" {${block("teal", profile)}}

oben -> a: ${bare(profile)}
unten -> a: ${bare(profile)}
oben -> b: ${bare(profile)}
unten -> b: ${bare(profile)}
a -> c: ${edge(profile, "1")}
b -> c: ${edge(profile, "−2")}
`;
}

const STAPEL_STEPS = (c) => [
  { nodes: ["oben", "unten"], caption: c[0] },
  { nodes: ["a", "b"], edges: ["oben -> a", "unten -> a", "oben -> b", "unten -> b"], caption: c[1] },
  { nodes: ["a", "b"], caption: c[2] },
  { nodes: ["a", "b", "c"], edges: ["a -> c", "b -> c"], caption: c[3] },
  { nodes: ["c"], caption: c[4] },
  { nodes: ["oben", "unten"], caption: c[5] },
  { nodes: ["a", "b"], edges: ["oben -> a", "unten -> a", "oben -> b", "unten -> b"], caption: c[6] },
  { nodes: ["a", "b", "c"], edges: ["a -> c", "b -> c"], caption: c[7] },
];

const STAPEL_DE = {
  top: "Eingabe\\nSchalter oben",
  bottom: "Eingabe\\nSchalter unten",
  a: "Schicht 1\\nNeuron A, mit Knick\\nSumme der Schalter",
  b: "Schicht 1\\nNeuron B, mit Knick\\nSumme der Schalter − 1",
  c: "Schicht 2\\nNeuron C\\nAusgabe\\nGrundregler 0",
  title: "Zwei Schichten: Der Zwischenwert läuft weiter",
  intro: "Die Eingabe läuft durch zwei Schichten. Die Werte von A und B sind die Zwischenwerte. Der Knick in Schicht 1 ist orange markiert.",
  captions: [
    "Keiner gedrückt: Beide Eingaben sind 0.",
    "Schicht 1: A rechnet 0, B rechnet 0 − 1 = −1.",
    "Der Knick setzt die −1 auf 0. B gibt also den Zwischenwert 0 weiter, A bleibt bei 0.",
    "Schicht 2: C rechnet 0 · 1 + 0 · (−2) = 0.",
    "Ausgabe: 0. Das Licht bleibt aus.",
    "Beide gedrückt: Beide Eingaben sind 1.",
    "Schicht 1: A rechnet 2, B rechnet 2 − 1 = 1. Der Knick lässt beide Werte stehen.",
    "Schicht 2: C rechnet 2 · 1 + 1 · (−2) = 0. Ausgabe: 0.",
  ],
};

const STAPEL_EN = {
  top: "Input\\nswitch top",
  bottom: "Input\\nswitch bottom",
  a: "Layer 1\\nNeuron A, with kink\\nsum of switches",
  b: "Layer 1\\nNeuron B, with kink\\nsum of switches − 1",
  c: "Layer 2\\nNeuron C\\nOutput\\nbias 0",
  title: "Two layers: the intermediate value keeps going",
  intro: "The input runs through two layers. The values of A and B are the intermediate values. The kink in layer 1 is marked in amber.",
  captions: [
    "None pressed: both inputs are 0.",
    "Layer 1: A computes 0, B computes 0 − 1 = −1.",
    "The kink sets the −1 to 0. B passes on the intermediate value 0, A stays at 0.",
    "Layer 2: C computes 0 · 1 + 0 · (−2) = 0.",
    "Output: 0. The light stays off.",
    "Both pressed: both inputs are 1.",
    "Layer 1: A computes 2, B computes 2 − 1 = 1. The kink keeps both values.",
    "Layer 2: C computes 2 · 1 + 1 · (−2) = 0. Output: 0.",
  ],
};

export const neuronStapelungDe = stepperFigure({
  source: stapelungSource,
  text: STAPEL_DE,
  copy: STAPEL_DE,
  steps: STAPEL_STEPS,
  lang: "de",
  outPath: "public/bausteine/neuronale-netze/neuron-stapelung.static.svg",
  htmlPath: "public/bausteine/neuronale-netze/neuron-stapelung.html",
});

export const neuronStapelungEn = stepperFigure({
  source: stapelungSource,
  text: STAPEL_EN,
  copy: STAPEL_EN,
  steps: STAPEL_STEPS,
  lang: "en",
  outPath: "public/bausteine/neuronale-netze/neuron-stapelung-en.static.svg",
  htmlPath: "public/bausteine/neuronale-netze/neuron-stapelung-en.html",
});
