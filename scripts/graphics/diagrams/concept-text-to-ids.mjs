import { renderSvg } from "../satori-render.mjs";
import { tone as roleTone, satoriBackground, satoriBorder } from "../tokens.mjs";

const WIDTH = 640;
const HEIGHT = 360;

// The "dark" accent for chips/badges is teal's text color but amber's
// (more saturated) stroke color, not amber's text color -- an asymmetry
// this file already had (amber.text alone read as too muted against the
// light chip background) that this migration preserves rather than "fixes".

// A visible-space mark (the "␣" open-box shape), drawn as a bordered box
// because the brand fonts have no glyph for U+2423.
function withSpaceMark(text, color, size) {
  if (!text.startsWith("␣")) return text;
  const mark = {
    type: "div",
    props: {
      style: { display: "flex", width: `${Math.round(size * 0.5)}px`, height: `${Math.round(size * 0.3)}px`, marginRight: "3px", marginTop: `${Math.round(size * 0.35)}px`, borderLeft: `2px solid ${color}`, borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}` },
      children: [],
    },
  };
  return { type: "div", props: { style: { display: "flex", alignItems: "center" }, children: [mark, { type: "div", props: { style: { display: "flex" }, children: text.slice(1) } }] } };
}

function darkFor(role, profile) {
  return role === "teal" ? roleTone("teal", profile).text : roleTone("amber", profile).stroke;
}

function line(width) {
  return { type: "div", props: { style: { display: "flex", width: `${width}px`, height: "8px", borderRadius: "4px", background: "#DAD6CB" }, children: [] } };
}

function chip({ text, tone, width, profile }) {
  const role = tone === "teal" ? "teal" : "amber";
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: `${width}px`,
        height: "38px",
        borderRadius: "9px",
        background: satoriBackground(role, profile, { fillKey: "fillStrong" }),
        fontFamily: "IBM Plex Sans",
        fontSize: "19px",
        color: darkFor(role, profile),
      },
      children: withSpaceMark(text, darkFor(role, profile), 19),
    },
  };
}

function sourceCard(chips, profile) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "18px",
        width: "240px",
        height: "252px",
        padding: "0 32px",
        background: "#FFFFFF",
        border: satoriBorder("teal", profile, { width: 3 }),
        borderRadius: "18px",
      },
      children: [
        { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [line(176), line(142), line(164)] } },
        { type: "div", props: { style: { display: "flex", flexWrap: "wrap", gap: "8px 6px" }, children: chips.map((c) => chip({ ...c, profile })) } },
      ],
    },
  };
}

function idBadge({ value, tone, profile }) {
  const role = tone === "teal" ? "teal" : "amber";
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "76px",
        height: "60px",
        borderRadius: "14px",
        background: darkFor(role, profile),
        fontFamily: "IBM Plex Sans",
        fontWeight: 600,
        fontSize: "26px",
        color: "#FFFFFF",
      },
      children: value,
    },
  };
}

function idGrid(values, profile) {
  return {
    type: "div",
    props: {
      style: { display: "flex", flexDirection: "column", gap: "16px" },
      children: [
        // Three per row; colors alternate like the chips they stand for.
        ...[values.slice(0, 3), values.slice(3)].map((row, r) => ({
          type: "div",
          props: { style: { display: "flex", gap: "16px" }, children: row.map((value, i) => idBadge({ value, tone: (r * 3 + i) % 2 ? "amber" : "teal", profile })) },
        })),
      ],
    },
  };
}

function arrow(profile) {
  return { type: "div", props: { style: { display: "flex", alignItems: "center", justifyContent: "center", color: roleTone("teal", profile).stroke, fontSize: "30px" }, children: "→" } };
}

function build({ chips, ids }, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", alignItems: "center", justifyContent: "center", background: satoriBackground("neutral", profile), borderRadius: "28px", gap: "40px" },
      children: [
        sourceCard(chips, profile),
        arrow(profile),
        {
          type: "div",
          props: {
            style: { display: "flex", flexDirection: "column", gap: "16px" },
            children: [idGrid(ids, profile), { type: "div", props: { style: { display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "6px" }, children: [line(184), line(136)] } }],
          },
        },
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const conceptTextToIdsDe = {
  outPath: "public/bausteine/token-ids-und-vokabular/text-zu-ids.svg",
  build: (profile) =>
    build(
      {
        chips: [
          { text: "Die", tone: "teal", width: 46 },
          { text: "␣Kat", tone: "amber", width: 62 },
          { text: "ze", tone: "teal", width: 43 },
          { text: "␣sitzt", tone: "amber", width: 74 },
          { text: ".", tone: "teal", width: 22 },
        ],
        ids: ["417", "82", "903", "771", "13"],
      },
      profile,
    ),
};

export const conceptTextToIdsEn = {
  outPath: "public/bausteine/token-ids-und-vokabular/text-to-ids.svg",
  build: (profile) =>
    build(
      {
        chips: [
          { text: "The", tone: "teal", width: 58 },
          { text: "␣cat", tone: "amber", width: 62 },
          { text: "s", tone: "teal", width: 22 },
          { text: "␣sit", tone: "amber", width: 56 },
          { text: ".", tone: "teal", width: 22 },
        ],
        ids: ["417", "82", "903", "771", "13"],
      },
      profile,
    ),
};
