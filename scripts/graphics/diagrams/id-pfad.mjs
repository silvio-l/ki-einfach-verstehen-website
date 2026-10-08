import { renderSvg } from "../satori-render.mjs";
import { tone, satoriBackground, satoriBorder } from "../tokens.mjs";

const WIDTH = 720;
const HEIGHT = 250;

function textLine(text, { size, weight = 400, color, font = "IBM Plex Sans" }) {
  return {
    type: "div",
    props: {
      style: { display: "flex", fontFamily: font, fontWeight: weight, fontSize: `${size}px`, color },
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
        padding: "16px 12px",
        background: satoriBackground(role, profile, { fillKey: "fillStrong" }),
        border: satoriBorder(role, profile, { width: 1 }),
        borderRadius: "14px",
      },
      children: lines,
    },
  };
}

function arrow(profile, glyph = "→") {
  return {
    type: "div",
    props: {
      style: { display: "flex", alignItems: "center", justifyContent: "center", color: tone("teal", profile).stroke, fontSize: "26px", padding: "0 10px" },
      children: glyph,
    },
  };
}

function build({ idLabel, idValue, vocabLabel, vocabValue, vocabCaption, modelLabel, vector1, vector2, modelCaption }, profile) {
  const amberText = tone("amber", profile).text;
  const tealText = tone("teal", profile).text;
  const purpleText = tone("purple", profile).text;
  const tree = {
    type: "div",
    props: {
      style: { width: `${WIDTH}px`, height: `${HEIGHT}px`, display: "flex", alignItems: "center", justifyContent: "center" },
      children: [
        // The ID sits in the middle with two separate arrows: the tokenizer's
        // vocabulary and the model's table are both addressed by the number
        // itself -- the model never goes through the text piece.
        card({
          role: "teal",
          profile,
          width: 230,
          lines: [
            textLine(vocabLabel, { size: 18, color: tealText }),
            textLine(vocabValue, { size: 24, weight: 700, color: tealText }),
            textLine(vocabCaption, { size: 18, color: tealText }),
          ],
        }),
        arrow(profile, "←"),
        card({
          role: "amber",
          profile,
          width: 150,
          lines: [textLine(idLabel, { size: 18, color: amberText }), textLine(idValue, { size: 28, weight: 700, color: amberText })],
        }),
        arrow(profile),
        card({
          role: "purple",
          profile,
          width: 210,
          lines: [
            textLine(modelLabel, { size: 18, color: purpleText }),
            textLine(vector1, { size: 18, color: purpleText, font: "IBM Plex Mono" }),
            textLine(vector2, { size: 18, color: purpleText, font: "IBM Plex Mono" }),
            textLine(modelCaption, { size: 18, color: purpleText }),
          ],
        }),
      ],
    },
  };
  return renderSvg(tree, WIDTH, HEIGHT);
}

export const idPfadDe = {
  outPath: "public/bausteine/token-ids-und-vokabular/id-pfad.svg",
  build: (profile) =>
    build(
      {
        idLabel: "Token-ID",
        idValue: "417",
        vocabLabel: "Tokenizer",
        vocabValue: '417 ↔ „Die"',
        vocabCaption: "Vokabular-Eintrag",
        modelLabel: "Modell",
        // Row 417 of the model's learned table.
        vector1: "[0,12; −0,7;",
        vector2: "0,03; …]",
        modelCaption: "gelernte Zeile",
      },
      profile,
    ),
};

export const idPathEn = {
  outPath: "public/bausteine/token-ids-und-vokabular/id-path.svg",
  build: (profile) =>
    build(
      {
        idLabel: "Token ID",
        idValue: "417",
        vocabLabel: "Tokenizer",
        vocabValue: '417 ↔ "The"',
        vocabCaption: "vocabulary entry",
        modelLabel: "Model",
        vector1: "[0.12; −0.7;",
        vector2: "0.03; …]",
        modelCaption: "learned row",
      },
      profile,
    ),
};
