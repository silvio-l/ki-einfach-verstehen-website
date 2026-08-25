import { renderD2 } from "../d2-render.mjs";
import { tone } from "../tokens.mjs";

const NEUTRAL_FONT_COLOR = "#1B1A17";

function block(role, profile, { fontColor } = {}) {
  const t = tone(role, profile);
  return `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 17
  style.font-color: "${fontColor ?? t.text}"
  style.fill: "${t.fill}"
  style.stroke: "${t.stroke}"${t.d2Pattern ? `\n  style.fill-pattern: "${t.d2Pattern}"` : ""}${t.strokeDash ? `\n  style.stroke-dash: ${t.strokeDash}` : ""}`;
}

function loopBackEdge(profile) {
  const t = tone("amber", profile);
  return `  style.stroke: "${t.stroke}"\n  style.stroke-width: 2\n  style.stroke-dash: ${t.strokeDash || 5}`;
}

function source({ textSoFar, scoreList, selection, newPiece }, profile) {
  const neutral = block("neutral", profile, { fontColor: NEUTRAL_FONT_COLOR });
  const petrol = block("teal", profile);
  const tealStroke = tone("teal", profile).stroke;
  return `
direction: right

textSoFar: "${textSoFar}" {${neutral}}
scoreList: "${scoreList}" {${petrol}}
selection: "${selection}" {${neutral}}
newPiece: "${newPiece}" {${neutral}}

textSoFar -> scoreList: {
  style.stroke: "${tealStroke}"
  style.stroke-width: 3
}
scoreList -> selection: {
  style.stroke: "${tealStroke}"
  style.stroke-width: 3
}
selection -> newPiece: {
  style.stroke: "${tealStroke}"
  style.stroke-width: 3
}
newPiece -> textSoFar: {
${loopBackEdge(profile)}
}
`;
}

export const conceptScoreLoopDe = {
  outPath: "public/bausteine/input-und-output/score-schleife.svg",
  build: (profile) =>
    renderD2(
      source(
        {
          textSoFar: "bisheriger Text",
          scoreList: "Score-Liste",
          selection: "Auswahl",
          newPiece: "neues Textstück",
        },
        profile,
      ),
    ),
};

export const conceptScoreLoopEn = {
  outPath: "public/bausteine/input-und-output/score-loop.svg",
  build: (profile) =>
    renderD2(
      source(
        {
          textSoFar: "text so far",
          scoreList: "score list",
          selection: "selection",
          newPiece: "new text piece",
        },
        profile,
      ),
    ),
};
