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
import { conceptFixedPairDe, conceptFixedPairEn } from "./diagrams/concept-fixed-pair.mjs";
import { conceptSplitJobsDe, conceptSplitJobsEn } from "./diagrams/concept-split-jobs.mjs";
import { conceptTextToIdsDe, conceptTextToIdsEn } from "./diagrams/concept-text-to-ids.mjs";
import { conceptVocabularyCardsDe, conceptVocabularyCardsEn } from "./diagrams/concept-vocabulary-cards.mjs";
import { ruleFilterDe, ruleFilterEn } from "./diagrams/rule-filter.mjs";
import { wordWeightsDe, wordWeightsEn } from "./diagrams/word-weights.mjs";
import { trainingLoopDe, trainingLoopEn } from "./diagrams/training-loop.mjs";
import { generationLoopDe, generationLoopEn } from "./diagrams/generation-loop.mjs";
import { trainingPairsDe, trainingPairsEn } from "./diagrams/training-pairs.mjs";
import { numberListTableDe, numberListTableEn, tensorStackDe, tensorStackEn } from "./diagrams/number-blocks.mjs";
import { rowLookupDe, rowLookupEn } from "./diagrams/row-lookup.mjs";
import { pointsToPercentDe, pointsToPercentEn, greedySamplingDe, greedySamplingEn, temperatureDe, temperatureEn, softmaxStepsDe, softmaxStepsEn } from "./diagrams/softmax.mjs";
import { calculatorIcon, envelopeIcon, checklistIcon, mixingDeskIcon, cakeIcon, tagIcon, cardsIcon, rulerIcon, thermometerIcon, umbrellaIcon, chipIcon, flagIcon, balanceIcon, barcodeIcon, parkBenchIcon, bankIcon, eyeSlashIcon } from "./diagrams/icons.mjs";
import { chatSequenceDe, fourTemplatesDe, vocabTradeoffDe, contextBudgetDe } from "./diagrams/chat-sequence.mjs";
import { neighboursDe, neighboursEn, positionDe, positionEn, trainingPushDe, trainingPushEn } from "./diagrams/embeddings.mjs";
import { modelFileDe, modelFileEn, modelSizesDe, modelSizesEn, trainingInferenceDe, trainingInferenceEn } from "./diagrams/model-runs.mjs";
import { databaseModelDe, databaseModelEn, numberFeatureDe, numberFeatureEn, twoRunsDe, twoRunsEn, modelKindsDe, modelKindsEn, twoStepsDe, twoStepsEn } from "./diagrams/was-ein-ki-modell.mjs";
import { attentionWeightsDe, attentionWeightsEn, causalMaskDe, causalMaskEn, blockStackDe, blockStackEn, qkvStepperDe, qkvStepperEn } from "./diagrams/attention.mjs";

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
  conceptFixedPairDe,
  conceptFixedPairEn,
  conceptSplitJobsDe,
  conceptSplitJobsEn,
  conceptTextToIdsDe,
  conceptTextToIdsEn,
  conceptVocabularyCardsDe,
  conceptVocabularyCardsEn,
  ruleFilterDe,
  ruleFilterEn,
  wordWeightsDe,
  wordWeightsEn,
  trainingLoopDe,
  trainingLoopEn,
  generationLoopDe,
  generationLoopEn,
  trainingPairsDe,
  trainingPairsEn,
  numberListTableDe,
  numberListTableEn,
  tensorStackDe,
  tensorStackEn,
  rowLookupDe,
  rowLookupEn,
  pointsToPercentDe,
  pointsToPercentEn,
  greedySamplingDe,
  greedySamplingEn,
  temperatureDe,
  temperatureEn,
  softmaxStepsDe,
  softmaxStepsEn,
  calculatorIcon,
  envelopeIcon,
  checklistIcon,
  mixingDeskIcon,
  cakeIcon,
  tagIcon,
  cardsIcon,
  rulerIcon,
  thermometerIcon,
  umbrellaIcon,
  chipIcon,
  databaseModelDe,
  databaseModelEn,
  numberFeatureDe,
  numberFeatureEn,
  twoRunsDe,
  twoRunsEn,
  modelKindsDe,
  modelKindsEn,
  twoStepsDe,
  twoStepsEn,
  modelFileDe,
  modelFileEn,
  modelSizesDe,
  modelSizesEn,
  trainingInferenceDe,
  trainingInferenceEn,
  chatSequenceDe,
  fourTemplatesDe,
  vocabTradeoffDe,
  contextBudgetDe,
  flagIcon,
  balanceIcon,
  barcodeIcon,
  parkBenchIcon,
  neighboursDe,
  neighboursEn,
  positionDe,
  positionEn,
  trainingPushDe,
  trainingPushEn,
  bankIcon,
  eyeSlashIcon,
  attentionWeightsDe,
  attentionWeightsEn,
  causalMaskDe,
  causalMaskEn,
  blockStackDe,
  blockStackEn,
  qkvStepperDe,
  qkvStepperEn,
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
  for (const { outPath, build, html } of diagrams) {
    await writeSvg(outPath, await build("color"));
    await writeSvg(grayscaleOutPath(outPath), await build("grayscale"));
    // Step-through animations (stepper.mjs): `outPath` is their static
    // figure for the book, `html` the interactive version for the website.
    if (html) await writeSvg(html.outPath, await html.build());
  }
}
