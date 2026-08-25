import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sortierablaufDe, sortFlowEn } from "./diagrams/sortierablauf.mjs";
import { trainingsablaufDe, trainingFlowEn } from "./diagrams/trainingsablauf.mjs";
import { scoreListDe1, scoreListDe2, scoreListEn1, scoreListEn2 } from "./diagrams/score-list.mjs";
import { granularitaetDe, granularityEn } from "./diagrams/granularitaet.mjs";
import { idPfadDe, idPathEn } from "./diagrams/id-pfad.mjs";
import { conceptTrainingTransferDe, conceptTrainingTransferEn } from "./diagrams/concept-training-transfer.mjs";
import { conceptModelUpdateDe, conceptModelUpdateEn } from "./diagrams/concept-model-update.mjs";
import { conceptScoreLoopDe, conceptScoreLoopEn } from "./diagrams/concept-score-loop.mjs";
import { conceptFixedPairDe, conceptFixedPairEn } from "./diagrams/concept-fixed-pair.mjs";
import { conceptSplitJobsDe, conceptSplitJobsEn } from "./diagrams/concept-split-jobs.mjs";
import { conceptTrainingSamplesDe, conceptTrainingSamplesEn } from "./diagrams/concept-training-samples.mjs";
import { conceptTextToIdsDe, conceptTextToIdsEn } from "./diagrams/concept-text-to-ids.mjs";
import { conceptVocabularyCardsDe, conceptVocabularyCardsEn } from "./diagrams/concept-vocabulary-cards.mjs";
import { calculatorIcon, envelopeIcon, checklistIcon, mixingDeskIcon, cakeIcon, tagIcon, openBookIcon } from "./diagrams/icons.mjs";

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const diagrams = [
  sortierablaufDe,
  sortFlowEn,
  trainingsablaufDe,
  trainingFlowEn,
  scoreListDe1,
  scoreListDe2,
  scoreListEn1,
  scoreListEn2,
  granularitaetDe,
  granularityEn,
  idPfadDe,
  idPathEn,
  conceptTrainingTransferDe,
  conceptTrainingTransferEn,
  conceptModelUpdateDe,
  conceptModelUpdateEn,
  conceptScoreLoopDe,
  conceptScoreLoopEn,
  conceptFixedPairDe,
  conceptFixedPairEn,
  conceptSplitJobsDe,
  conceptSplitJobsEn,
  conceptTrainingSamplesDe,
  conceptTrainingSamplesEn,
  conceptTextToIdsDe,
  conceptTextToIdsEn,
  conceptVocabularyCardsDe,
  conceptVocabularyCardsEn,
  calculatorIcon,
  envelopeIcon,
  checklistIcon,
  mixingDeskIcon,
  cakeIcon,
  tagIcon,
  openBookIcon,
];

// ADR-0016: every graphic gets a grayscale-safe sibling alongside its
// (unchanged-filename) color SVG, so the website's existing references
// keep resolving to the color profile with no other change required.
export function grayscaleOutPath(outPath) {
  if (!outPath.endsWith(".svg")) {
    throw new Error(`expected a .svg outPath, got: ${outPath}`);
  }
  return `${outPath.slice(0, -".svg".length)}.grayscale.svg`;
}

async function writeSvg(outPath, svg) {
  const absPath = path.join(websiteRoot, outPath);
  mkdirSync(path.dirname(absPath), { recursive: true });
  writeFileSync(absPath, svg);
  console.log("wrote", outPath, `(${svg.length} bytes)`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const { outPath, build } of diagrams) {
    await writeSvg(outPath, await build("color"));
    await writeSvg(grayscaleOutPath(outPath), await build("grayscale"));
  }
}
