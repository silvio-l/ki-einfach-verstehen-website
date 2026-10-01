import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground } from "../tokens.mjs";

// Weather data as scalar, vector, matrix and a three-axis tensor (Baustein 4).
// All values are made up; Berlin's week is the vector and the matrix's first row.
const WEEK = [
  [18, 21, 19, 15, 14, 17, 20],
  [16, 18, 17, 13, 12, 15, 17],
  [19, 22, 20, 16, 15, 18, 21],
  [17, 20, 18, 14, 11, 16, 19],
];
const CELL = 48;
const ROW = 42;
const FONT = "IBM Plex Sans";
const INK = "#1B1A17";

function at({ children, ...style }) {
  return { type: "div", props: { style: abs(style), children } };
}

function text(content, style = {}) {
  return { type: "div", props: { style: { display: "flex", fontFamily: FONT, fontSize: "20px", color: INK, ...style }, children: content } };
}

function cell(value, { profile, highlight = false, width = CELL, height = ROW } = {}) {
  const t = tone(highlight ? "amber" : "teal", profile);
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${width}px`,
        height: `${height}px`,
        background: highlight ? satoriBackground("amber", profile) : "#FFFFFF",
        border: `1.5px solid ${t.stroke}`,
        fontFamily: FONT,
        fontSize: "20px",
        color: INK,
      },
      children: String(value),
    },
  };
}

function heading(name, form, profile) {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "10px" },
      children: [
        text(name, { fontWeight: 700, fontSize: "24px", color: tone("teal", profile).text }),
        text(form, { fontSize: "19px", color: tone("neutral", profile).text }),
      ],
    },
  };
}

function panel(children, profile, style = {}) {
  return {
    type: "div",
    props: {
      style: { display: "flex", flexDirection: "column", padding: "18px 22px", borderRadius: "18px", background: satoriBackground("teal", profile), ...style },
      children,
    },
  };
}

function dayRow(days, offset = 0) {
  return {
    type: "div",
    props: {
      style: { display: "flex", marginLeft: `${offset}px` },
      children: days.map((d) => text(d, { width: `${CELL}px`, justifyContent: "center", fontSize: "18px" })),
    },
  };
}

function build(l, profile) {
  const WIDTH = 760;
  const HEIGHT = 446;
  const cityWidth = 112;
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", flexDirection: "column", gap: "18px", padding: "8px", background: "#FFFFFF" },
      children: [
        {
          type: "div",
          props: {
            style: { display: "flex", gap: "18px" },
            children: [
              panel([heading(l.scalar, l.scalarForm, profile), text(l.today, { fontSize: "18px", marginBottom: "4px" }), cell(18, { profile, highlight: true, width: 64 })], profile, { width: "236px" }),
              panel(
                [
                  heading(l.vector, `${l.form} 7`, profile),
                  dayRow(l.days),
                  { type: "div", props: { style: { display: "flex" }, children: WEEK[0].map((v) => cell(v, { profile })) } },
                ],
                profile,
                { flexGrow: 1 },
              ),
            ],
          },
        },
        panel(
          [
            heading(l.matrix, `${l.form} 4 × 7`, profile),
            dayRow(l.days, cityWidth),
            ...WEEK.map((row, i) => ({
              type: "div",
              props: {
                style: { display: "flex", alignItems: "center" },
                children: [text(l.cities[i], { width: `${cityWidth}px`, fontSize: "19px" }), ...row.map((v) => cell(v, { profile }))],
              },
            })),
          ],
          profile,
        ),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

const DE = {
  scalar: "Skalar",
  scalarForm: "keine Achse",
  today: "heute Mittag",
  vector: "Vektor",
  matrix: "Matrix",
  form: "Form",
  days: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  cities: ["Berlin", "Hamburg", "Köln", "München"],
};

const EN = {
  scalar: "Scalar",
  scalarForm: "no axis",
  today: "today at noon",
  vector: "Vector",
  matrix: "Matrix",
  form: "shape",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  cities: ["Berlin", "Hamburg", "Cologne", "Munich"],
};

export const numberListTableDe = {
  outPath: "public/bausteine/skalar-vektor-matrix-tensor/zahl-liste-tabelle.svg",
  build: (profile) => build(DE, profile),
};

export const numberListTableEn = {
  outPath: "public/bausteine/skalar-vektor-matrix-tensor/number-list-table.svg",
  build: (profile) => build(EN, profile),
};

// Three tables of the same shape stacked: measure × city × day.
function layer({ title, values, front, profile, l }) {
  const t = tone(front ? "teal" : "neutral", profile);
  const cityWidth = 104;
  return {
    type: "div",
    props: {
      style: { display: "flex", flexDirection: "column", padding: "12px 16px", borderRadius: "14px", background: "#FFFFFF", border: `2px solid ${t.stroke}` },
      children: [
        text(title, { fontWeight: 700, fontSize: "21px", color: t.text, marginBottom: "6px" }),
        dayRow(l.days, cityWidth),
        ...values.map((row, i) => ({
          type: "div",
          props: {
            style: { display: "flex", alignItems: "center" },
            children: [
              text(l.cities[i], { width: `${cityWidth}px`, fontSize: "18px" }),
              ...row.map((v) => cell(front ? v : " ", { profile, height: 36 })),
            ],
          },
        })),
      ],
    },
  };
}

function buildStack(l, profile) {
  const WIDTH = 760;
  const HEIGHT = 370;
  const STEP = 44;
  const left = 96;
  const top = 96;
  const layers = [l.rain, l.wind, l.temperature];
  const axisColor = tone("amber", profile).text;
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", position: "relative", background: "#FFFFFF" },
      children: [
        ...layers.map((title, i) => {
          const depth = layers.length - 1 - i;
          return at({ left: `${left + depth * STEP}px`, top: `${top - depth * STEP}px`, children: [layer({ title, values: WEEK, front: depth === 0, profile, l })] });
        }),
        at({ left: "0px", top: "6px", width: "150px", flexDirection: "column", children: [text(l.measureAxis, { fontWeight: 700, fontSize: "19px", color: axisColor }), text(l.measureList, { fontSize: "18px", color: axisColor })] }),
        at({ left: "0px", top: `${top + 110}px`, width: "60px", flexDirection: "column", alignItems: "center", children: [text("↕", { fontSize: "26px", color: axisColor }), text(l.cityAxis, { fontWeight: 700, fontSize: "19px", color: axisColor })] }),
        at({ left: `${left + 120}px`, top: `${top + 238}px`, width: "336px", justifyContent: "center", children: [text(`↔ ${l.dayAxis}`, { fontWeight: 700, fontSize: "19px", color: axisColor })] }),
        at({ left: "648px", top: `${top + 170}px`, width: "112px", flexDirection: "column", children: [text(l.form, { fontSize: "19px", color: tone("neutral", profile).text }), text("3 × 4 × 7", { fontWeight: 700, fontSize: "22px", color: tone("teal", profile).text })] }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

const STACK_DE = {
  ...DE,
  temperature: "Temperatur",
  wind: "Wind",
  rain: "Regen",
  measureAxis: "Messgröße ↗",
  measureList: "3 Tabellen",
  cityAxis: "Stadt",
  dayAxis: "Tag",
  form: "Form",
};

const STACK_EN = {
  ...EN,
  temperature: "Temperature",
  wind: "Wind",
  rain: "Rain",
  measureAxis: "measure ↗",
  measureList: "3 tables",
  cityAxis: "city",
  dayAxis: "day",
  form: "shape",
};

export const tensorStackDe = {
  outPath: "public/bausteine/skalar-vektor-matrix-tensor/tensor-stapel.svg",
  build: (profile) => buildStack(STACK_DE, profile),
};

export const tensorStackEn = {
  outPath: "public/bausteine/skalar-vektor-matrix-tensor/tensor-stack.svg",
  build: (profile) => buildStack(STACK_EN, profile),
};
