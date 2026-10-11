import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

// The same number 417 in two vocabularies, with two different pieces. The
// model's tokenizer holds the invented piece "Die"; the foreign tokenizer
// holds "el", which is GPT-2's real entry for 417.
const WIDTH = 720;
const HEIGHT = 250;

function textLine(text, { size, weight = 400, color }) {
  return {
    type: "div",
    props: {
      style: { display: "flex", fontFamily: "IBM Plex Sans", fontWeight: weight, fontSize: `${size}px`, color },
      children: text,
    },
  };
}

function card({ role, profile, width, lines }) {
  return {
    type: "div",
    props: {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        width: `${width}px`,
        padding: "14px 12px",
        background: satoriBackground(role, profile, { fillKey: "fillStrong" }),
        border: satoriBorder(role, profile, { width: 1 }),
        borderRadius: "14px",
      },
      children: lines,
    },
  };
}

function arrow(profile) {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", justifyContent: "center", color: tone("teal", profile).stroke, fontSize: "26px" },
      children: "→",
    },
  };
}

function row({ profile, tokenizer, subtitle, idLabel, pieceLabel, piece }) {
  const tealText = tone("teal", profile).text;
  const amberText = tone("amber", profile).text;
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" },
      children: [
        card({
          role: "teal",
          profile,
          width: 250,
          lines: [textLine(tokenizer, { size: 18, color: tealText }), textLine(subtitle, { size: 18, color: tealText })],
        }),
        card({
          role: "amber",
          profile,
          width: 150,
          lines: [textLine(idLabel, { size: 18, color: amberText }), textLine("417", { size: 28, weight: 700, color: amberText })],
        }),
        arrow(profile),
        card({
          role: "teal",
          profile,
          width: 170,
          lines: [textLine(pieceLabel, { size: 18, color: tealText }), textLine(piece, { size: 28, weight: 700, color: tealText })],
        }),
      ],
    },
  };
}

function build(labels, profile) {
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px" },
      children: [
        row({ profile, ...labels.model }),
        row({ profile, ...labels.foreign }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const fremderTokenizerDe = {
  outPath: "public/bausteine/token-ids-und-vokabular/kartei-neu-verteilt.svg",
  build: (profile) =>
    build(
      {
        model: { tokenizer: "Tokenizer des Modells", subtitle: "ausgedacht", idLabel: "Token-ID", pieceLabel: "Textstück", piece: "„Die“" },
        foreign: { tokenizer: "Fremder Tokenizer", subtitle: "wie bei GPT-2", idLabel: "Token-ID", pieceLabel: "Textstück", piece: "„el“" },
      },
      profile,
    ),
};

export const fremderTokenizerEn = {
  outPath: "public/bausteine/token-ids-und-vokabular/card-index-reassigned.svg",
  build: (profile) =>
    build(
      {
        model: { tokenizer: "Tokenizer of the model", subtitle: "invented", idLabel: "Token ID", pieceLabel: "Text piece", piece: "“The”" },
        foreign: { tokenizer: "Foreign tokenizer", subtitle: "like GPT-2", idLabel: "Token ID", pieceLabel: "Text piece", piece: "“el”" },
      },
      profile,
    ),
};
