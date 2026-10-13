import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sortierablaufDe, sortFlowEn } from "./diagrams/sortierablauf.mjs";
import { trainingsablaufDe, trainingFlowEn } from "./diagrams/trainingsablauf.mjs";
import { scoreListDe1, scoreListDe2, scoreListEn1, scoreListEn2 } from "./diagrams/score-list.mjs";
import { granularitaetDe, granularityEn } from "./diagrams/granularitaet.mjs";
import { bpeMergesDe, bpeMergesEn } from "./diagrams/bpe-merges.mjs";
import { woerterUndTokensDe, wordsAndTokensEn } from "./diagrams/woerter-und-tokens.mjs";
import { kontextfensterDe, contextWindowEn } from "./diagrams/kontextfenster.mjs";
import { idPfadDe, idPathEn } from "./diagrams/id-pfad.mjs";
import { fremderTokenizerDe, fremderTokenizerEn } from "./diagrams/fremder-tokenizer.mjs";
import { conceptTrainingTransferDe, conceptTrainingTransferEn } from "./diagrams/concept-training-transfer.mjs";
import { conceptModelUpdateDe, conceptModelUpdateEn } from "./diagrams/concept-model-update.mjs";
import { conceptTextToIdsDe, conceptTextToIdsEn } from "./diagrams/concept-text-to-ids.mjs";
import { ruleFilterDe, ruleFilterEn } from "./diagrams/rule-filter.mjs";
import { wordWeightsDe, wordWeightsEn } from "./diagrams/word-weights.mjs";
import { trainingLoopDe, trainingLoopEn } from "./diagrams/training-loop.mjs";
import { generationLoopDe, generationLoopEn } from "./diagrams/generation-loop.mjs";
import { trainingPairsDe, trainingPairsEn } from "./diagrams/training-pairs.mjs";
import { numberListTableDe, numberListTableEn, tensorStackDe, tensorStackEn } from "./diagrams/number-blocks.mjs";
import { rowLookupDe, rowLookupEn } from "./diagrams/row-lookup.mjs";
import { pointsToPercentDe, pointsToPercentEn, greedySamplingDe, greedySamplingEn, temperatureDe, temperatureEn, softmaxStepsDe, softmaxStepsEn } from "./diagrams/softmax.mjs";
import { calculatorIcon, envelopeIcon, recipeCardIcon, mixingDeskIcon, mixingDeskIconParams, cakeIcon, scissorsIcon, tagIcon, rulerIcon, knobIcon, thermometerIcon, chipIcon, flagIcon, barcodeIcon, parkBenchIcon, bankIcon, eyeSlashIcon, arrowsLeftRightIcon, slidersIcon, layersStackIcon } from "./diagrams/icons.mjs";
import { chatSequenceDe, chatSequenceEn, fourTemplatesDe, fourTemplatesEn, contextBudgetDe, contextBudgetEn } from "./diagrams/chat-sequence.mjs";
import { neighboursDe, neighboursEn, positionDe, positionEn, profileMapDe, profileMapEn, toyVocabularyDe, toyVocabularyEn, trainingPushDe, trainingPushEn } from "./diagrams/embeddings.mjs";
import { errorCurveDe, errorCurveEn, learningRateDe, learningRateEn } from "./diagrams/error-curve.mjs";
import { llamaScheduleDe, llamaScheduleEn, momentumDe, momentumEn, ravineDe, ravineEn } from "./diagrams/optimierung.mjs";
import { quantisationDe, quantisationEn, trainingMemoryDe, trainingMemoryEn } from "./diagrams/model-memory.mjs";
import { modelFileDe, modelFileEn, modelSizesDe, modelSizesEn, trainingInferenceDe, trainingInferenceEn, whoSetsDe, whoSetsEn } from "./diagrams/model-runs.mjs";
import { databaseModelDe, databaseModelEn, numberFeatureDe, numberFeatureEn, twoRunsDe, twoRunsEn, modelKindsDe, modelKindsEn, twoStepsDe, twoStepsEn, wayMapDe, wayMapEn, toyModelDe, toyModelEn, threeQuantitiesDe, threeQuantitiesEn } from "./diagrams/was-ein-ki-modell.mjs";
import { attentionWeightsDe, attentionWeightsEn, causalMaskDe, causalMaskEn, blockStackDe, blockStackEn, qkvStepperDe, qkvStepperEn } from "./diagrams/attention.mjs";
import { parisBoardDe, parisBoardEn, stateMeetsRowsDe, stateMeetsRowsEn, positionsDe, positionsEn, oneRoundDe, oneRoundEn } from "./diagrams/output-head.mjs";
import { gpt3MixDe, gpt3MixEn, learningCurvesDe, learningCurvesEn, tokensPerParamDe, tokensPerParamEn } from "./diagrams/training-measures.mjs";
import { gueterzugFolgenDe, gueterzugFolgenEn, siebStufenDe, siebStufenEn, datenmischungDe, datenmischungEn } from "./diagrams/uebungsaufgaben.mjs";
import { halvingDe, halvingEn, positionsLossDe, positionsLossEn, lossScaleDe, lossScaleEn } from "./diagrams/loss.mjs";
import { rueckwegDe, rueckwegEn, probedrehenDe, probedrehenEn, vierFaelleDe, vierFaelleEn } from "./diagrams/backpropagation.mjs";
import { neuronKnickkurveDe, neuronKnickkurveEn, neuronMatrixDe, neuronMatrixEn, neuronOhneKnickDe, neuronOhneKnickEn, neuronStapelungDe, neuronStapelungEn, neuronViermailsDe, neuronViermailsEn, neuronSchichtenDe, neuronSchichtenEn } from "./diagrams/neuron.mjs";
import { textUndGewichteDe, textUndGewichteEn } from "./diagrams/warum-vorhersagen-text-und-gewichte.mjs";
import { kombinationDe, kombinationEn } from "./diagrams/warum-vorhersagen-kombination.mjs";
import { basisGenauigkeitDe, basisGenauigkeitEn } from "./diagrams/warum-vorhersagen-basis-genauigkeit.mjs";
import { simpleQaDe, simpleQaEn } from "./diagrams/warum-ki-simpleqa.mjs";
import { fabricatedCitationsDe, fabricatedCitationsEn } from "./diagrams/warum-ki-walters.mjs";
import { followUpDe, followUpEn } from "./diagrams/warum-ki-nachfrage.mjs";
import { vortrainingNachtrainingDe, pretrainingPosttrainingEn } from "./diagrams/vortraining-nachtraining.mjs";
import { woherDerInputKommtDe, whereTheInputComesFromEn } from "./diagrams/woher-der-input-kommt.mjs";
import { vierQuellenDe, fourSourcesEn } from "./diagrams/vier-quellen.mjs";
import { lageImFensterDe, positionInContextEn } from "./diagrams/lage-im-fenster.mjs";
import { stichtagDe, knowledgeCutoffEn } from "./diagrams/stichtag-zeitstrahl.mjs";
import { nachtrainingDreiSchritteDe, postTrainingThreeStepsEn } from "./diagrams/nachtraining-drei-schritte.mjs";
import { denkschritteKetteDe, denkschritteKetteEn } from "./diagrams/denkschritte-kette.mjs";
import { werEntscheidetDe, werEntscheidetEn } from "./diagrams/wer-entscheidet.mjs";
import { werkzeugschleifeDe, toolLoopEn } from "./diagrams/werkzeugschleife.mjs";
import { werFuehrtAusDe, whoRunsItEn } from "./diagrams/wer-fuehrt-aus.mjs";
import { stoppUndPruefenDe, stopAndCheckEn } from "./diagrams/stopp-und-pruefen.mjs";
import { risikoAmpelDe, risikoAmpelEn } from "./diagrams/risiko-ampel.mjs";
import { fuenfPruefregelnDe, fuenfPruefregelnEn } from "./diagrams/fuenf-pruefregeln.mjs";
import { siftSchritteDe, siftSchritteEn } from "./diagrams/sift-schritte.mjs";
import { positionenBefundeDe, positionsFindingsEn } from "./diagrams/positionen-befunde.mjs";
import { sondeSchemaDe, probeSchemaEn } from "./diagrams/sonde-schema.mjs";
import { umkehrBalkenDe, reversalBarsEn } from "./diagrams/umkehr-balken.mjs";
import { lupeNotizIcon } from "./diagrams/icons.mjs";
import { dreiStellenDe, dreiStellenEn } from "./diagrams/drei-stellen.mjs";
import { vorbehaltZeitleisteDe, reservationTimelineEn } from "./diagrams/vorbehalt-zeitleiste.mjs";
import { verfahrenZeitleisteDe, proceedingsTimelineEn } from "./diagrams/verfahren-zeitleiste.mjs";
import { memorierungStellungenDe, memorizationStatesEn } from "./diagrams/memorierung-stellungen.mjs";

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
  bpeMergesDe,
  bpeMergesEn,
  woerterUndTokensDe,
  wordsAndTokensEn,
  kontextfensterDe,
  contextWindowEn,
  idPfadDe,
  idPathEn,
  conceptTrainingTransferDe,
  conceptTrainingTransferEn,
  conceptModelUpdateDe,
  conceptModelUpdateEn,
  conceptTextToIdsDe,
  conceptTextToIdsEn,
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
  recipeCardIcon,
  mixingDeskIcon,
  mixingDeskIconParams,
  cakeIcon,
  scissorsIcon,
  tagIcon,
  fremderTokenizerDe,
  fremderTokenizerEn,
  rulerIcon,
  knobIcon,
  thermometerIcon,
  chipIcon,
  databaseModelDe,
  databaseModelEn,
  numberFeatureDe,
  numberFeatureEn,
  twoRunsDe,
  twoRunsEn,
  wayMapDe,
  wayMapEn,
  modelKindsDe,
  modelKindsEn,
  twoStepsDe,
  twoStepsEn,
  toyModelDe,
  toyModelEn,
  threeQuantitiesDe,
  threeQuantitiesEn,
  modelFileDe,
  modelFileEn,
  modelSizesDe,
  modelSizesEn,
  trainingInferenceDe,
  trainingInferenceEn,
  errorCurveDe,
  errorCurveEn,
  learningRateDe,
  learningRateEn,
  quantisationDe,
  quantisationEn,
  trainingMemoryDe,
  trainingMemoryEn,
  whoSetsDe,
  whoSetsEn,
  chatSequenceDe,
  fourTemplatesDe,
  contextBudgetDe,
  chatSequenceEn,
  fourTemplatesEn,
  contextBudgetEn,
  flagIcon,
  barcodeIcon,
  parkBenchIcon,
  profileMapDe,
  profileMapEn,
  neighboursDe,
  neighboursEn,
  positionDe,
  positionEn,
  trainingPushDe,
  trainingPushEn,
  toyVocabularyDe,
  toyVocabularyEn,
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
  parisBoardDe,
  parisBoardEn,
  stateMeetsRowsDe,
  stateMeetsRowsEn,
  positionsDe,
  positionsEn,
  oneRoundDe,
  oneRoundEn,
  neuronKnickkurveDe,
  neuronKnickkurveEn,
  neuronMatrixDe,
  neuronMatrixEn,
  neuronOhneKnickDe,
  neuronOhneKnickEn,
  neuronStapelungDe,
  neuronStapelungEn,
  ravineDe,
  ravineEn,
  momentumDe,
  momentumEn,
  llamaScheduleDe,
  llamaScheduleEn,
  neuronViermailsDe,
  neuronViermailsEn,
  neuronSchichtenDe,
  neuronSchichtenEn,
  layersStackIcon,
  arrowsLeftRightIcon,
  slidersIcon,
  gueterzugFolgenDe,
  gueterzugFolgenEn,
  siebStufenDe,
  siebStufenEn,
  datenmischungDe,
  datenmischungEn,
  halvingDe,
  halvingEn,
  positionsLossDe,
  positionsLossEn,
  lossScaleDe,
  lossScaleEn,
  rueckwegDe,
  rueckwegEn,
  probedrehenDe,
  probedrehenEn,
  vierFaelleDe,
  vierFaelleEn,
  gpt3MixDe,
  gpt3MixEn,
  learningCurvesDe,
  learningCurvesEn,
  tokensPerParamDe,
  tokensPerParamEn,
  vortrainingNachtrainingDe,
  pretrainingPosttrainingEn,
  woherDerInputKommtDe,
  whereTheInputComesFromEn,
  vierQuellenDe,
  fourSourcesEn,
  lageImFensterDe,
  positionInContextEn,
  stichtagDe,
  knowledgeCutoffEn,
  nachtrainingDreiSchritteDe,
  postTrainingThreeStepsEn,
  textUndGewichteDe,
  textUndGewichteEn,
  kombinationDe,
  kombinationEn,
  basisGenauigkeitDe,
  basisGenauigkeitEn,
  simpleQaDe,
  simpleQaEn,
  fabricatedCitationsDe,
  fabricatedCitationsEn,
  followUpDe,
  followUpEn,
  denkschritteKetteDe,
  denkschritteKetteEn,
  werEntscheidetDe,
  werEntscheidetEn,
  werkzeugschleifeDe,
  toolLoopEn,
  werFuehrtAusDe,
  whoRunsItEn,
  stoppUndPruefenDe,
  stopAndCheckEn,
  risikoAmpelDe,
  risikoAmpelEn,
  fuenfPruefregelnDe,
  fuenfPruefregelnEn,
  siftSchritteDe,
  siftSchritteEn,
  positionenBefundeDe,
  positionsFindingsEn,
  sondeSchemaDe,
  probeSchemaEn,
  umkehrBalkenDe,
  reversalBarsEn,
  lupeNotizIcon,
  dreiStellenDe,
  vorbehaltZeitleisteDe,
  verfahrenZeitleisteDe,
  memorierungStellungenDe,
  dreiStellenEn,
  reservationTimelineEn,
  proceedingsTimelineEn,
  memorizationStatesEn,
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
