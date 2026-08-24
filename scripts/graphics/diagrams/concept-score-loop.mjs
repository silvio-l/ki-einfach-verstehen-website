import { renderD2 } from "../d2-render.mjs";

const NEUTRAL = `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 17
  style.font-color: "#1B1A17"
  style.fill: "#F7F5EF"
  style.stroke: "#817B6D"
`;

const PETROL = `
  shape: rectangle
  style.stroke-width: 2
  style.border-radius: 12
  style.font-size: 17
  style.font-color: "#0A5148"
  style.fill: "#E8F3F1"
  style.stroke: "#0E7469"
`;

function source({ textSoFar, scoreList, selection, newPiece }) {
  return `
direction: right

textSoFar: "${textSoFar}" {${NEUTRAL}}
scoreList: "${scoreList}" {${PETROL}}
selection: "${selection}" {${NEUTRAL}}
newPiece: "${newPiece}" {${NEUTRAL}}

textSoFar -> scoreList: {
  style.stroke: "#0E7469"
  style.stroke-width: 3
}
scoreList -> selection: {
  style.stroke: "#0E7469"
  style.stroke-width: 3
}
selection -> newPiece: {
  style.stroke: "#0E7469"
  style.stroke-width: 3
}
newPiece -> textSoFar: {
  style.stroke: "#986816"
  style.stroke-width: 2
  style.stroke-dash: 5
}
`;
}

export const conceptScoreLoopDe = {
  outPath: "public/bausteine/input-und-output/score-schleife.svg",
  build: () =>
    renderD2(
      source({
        textSoFar: "bisheriger Text",
        scoreList: "Score-Liste",
        selection: "Auswahl",
        newPiece: "neues Textstück",
      }),
    ),
};

export const conceptScoreLoopEn = {
  outPath: "public/bausteine/input-und-output/score-loop.svg",
  build: () =>
    renderD2(
      source({
        textSoFar: "text so far",
        scoreList: "score list",
        selection: "selection",
        newPiece: "new text piece",
      }),
    ),
};
