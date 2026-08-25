import { renderSvg } from "../satori-render.mjs";
import { tone as roleTone, satoriBackground, satoriBorder } from "../tokens.mjs";

const WIDTH = 640;
const HEIGHT = 360;

// The "dark" accent for chips/badges is teal's text color but amber's
// (more saturated) stroke color, not amber's text color -- an asymmetry
// this file already had (amber.text alone read as too muted against the
// light chip background) that this migration preserves rather than "fixes".
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
      children: text,
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
        { type: "div", props: { style: { display: "flex", gap: "6px" }, children: chips.map((c) => chip({ ...c, profile })) } },
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
        width: "88px",
        height: "64px",
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
        { type: "div", props: { style: { display: "flex", gap: "16px" }, children: [idBadge({ value: values[0], tone: "teal", profile }), idBadge({ value: values[1], tone: "amber", profile })] } },
        { type: "div", props: { style: { display: "flex", gap: "16px" }, children: [idBadge({ value: values[2], tone: "teal", profile }), idBadge({ value: values[3], tone: "amber", profile })] } },
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
  outPath: "public/bausteine/tokenizer-ids-vokabular/text-zu-ids.svg",
  build: (profile) =>
    build(
      {
        chips: [
          { text: "Die", tone: "teal", width: 46 },
          { text: " Kat", tone: "amber", width: 68 },
          { text: "ze", tone: "teal", width: 43 },
          { text: ".", tone: "amber", width: 18 },
        ],
        ids: ["417", "82", "903", "13"],
      },
      profile,
    ),
};

export const conceptTextToIdsEn = {
  outPath: "public/bausteine/tokenizer-ids-vokabular/text-to-ids.svg",
  build: (profile) =>
    build(
      {
        chips: [
          { text: "The", tone: "teal", width: 58 },
          { text: " cat", tone: "amber", width: 68 },
          { text: "s", tone: "teal", width: 18 },
          { text: ".", tone: "amber", width: 18 },
        ],
        ids: ["417", "82", "903", "13"],
      },
      profile,
    ),
};
