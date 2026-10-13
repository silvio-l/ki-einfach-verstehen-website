import { renderSvg, abs } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// Baustein "Versteht KI, was sie sagt?", section on the positions in the research
// debate. Three columns order the arguments; they are not a ranking, so every
// entry sits in the same neutral role and no arrows connect them.
// At 720 units wide the smallest text must be 18 units to stay legible (legibility.mjs).

const WIDTH = 720;
const HEIGHT = 350;
const FONT_SIZE = "18px";
const COL_WIDTH = 220;
const COL_GAP = 30;

function entry({ title, sub }, profile) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        padding: "8px 12px",
        background: satoriBackground("neutral", profile),
        border: satoriBorder("neutral", profile, { width: 2 }),
        borderRadius: "10px",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        lineHeight: 1.15,
        color: tone("neutral", profile).text,
      },
      children: [
        { type: "div", props: { style: { display: "flex", fontWeight: 700 }, children: title } },
        { type: "div", props: { style: { display: "flex" }, children: sub } },
      ],
    },
  };
}

function column({ header, entries }, index, profile) {
  const t = tone("neutral", profile);
  return {
    type: "div",
    props: {
      style: abs({
        left: `${index * (COL_WIDTH + COL_GAP)}px`,
        top: "0px",
        width: `${COL_WIDTH}px`,
        flexDirection: "column",
        gap: "12px",
        fontFamily: "IBM Plex Sans",
        fontSize: FONT_SIZE,
        color: t.text,
      }),
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontWeight: 700,
              fontSize: "20px",
              paddingBottom: "6px",
              borderBottom: `2px solid ${t.stroke}`,
            },
            children: header,
          },
        },
        ...entries.map((e) => entry(e, profile)),
      ],
    },
  };
}

function build({ columns }, profile) {
  const tree = {
    type: "div",
    props: {
      style: {
        position: "relative",
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        display: "flex",
        background: "#FFFFFF",
      },
      children: columns.map((c, i) => column(c, i, profile)),
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const positionenBefundeDe = {
  outPath: "public/bausteine/versteht-ki-was-sie-sagt/positionen-befunde.svg",
  build: (profile) =>
    build(
      {
        columns: [
          {
            header: "Dagegen",
            entries: [
              { title: "Oktopus am Kabel", sub: "Bender & Koller, 2020" },
              { title: "Stochastischer Papagei", sub: "Bender u. a., 2021" },
              { title: "Chinesisches Zimmer", sub: "Searle, 1980" },
            ],
          },
          {
            header: "Dafür",
            entries: [
              { title: "Othello-Modell: Brett lesbar", sub: "Li u. a., 2023" },
              { title: "Lineare Sicht auf dieselbe Information", sub: "Nanda u. a., 2023" },
              { title: "Orte und Zeiten lesbar", sub: "Gurnee & Tegmark, 2024" },
            ],
          },
          {
            header: "Gegenbelege",
            entries: [
              { title: "Stadtkarte aus Taxifahrten", sub: "Vafa u. a., 2024" },
              { title: "Reversal Curse", sub: "Berglund u. a., 2024" },
            ],
          },
        ],
      },
      profile,
    ),
};

export const positionsFindingsEn = {
  outPath: "public/bausteine/versteht-ki-was-sie-sagt/positions-findings.svg",
  build: (profile) =>
    build(
      {
        columns: [
          {
            header: "Against",
            entries: [
              { title: "Octopus on the cable", sub: "Bender & Koller, 2020" },
              { title: "Stochastic parrot", sub: "Bender et al., 2021" },
              { title: "Chinese room", sub: "Searle, 1980" },
            ],
          },
          {
            header: "For",
            entries: [
              { title: "Othello model: board readable", sub: "Li et al., 2023" },
              { title: "Linear view of the same information", sub: "Nanda et al., 2023" },
              { title: "Places and times readable", sub: "Gurnee & Tegmark, 2024" },
            ],
          },
          {
            header: "Counter-evidence",
            entries: [
              { title: "Taxi-ride city map", sub: "Vafa et al., 2024" },
              { title: "Reversal curse", sub: "Berglund et al., 2024" },
            ],
          },
        ],
      },
      profile,
    ),
};
