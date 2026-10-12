// Real penalty points of whole sentences, for SatzLossDemo (Baustein
// forward-pass-und-loss, learning goal 2). The values were computed in
// advance with Qwen3-0.6B-Base by scripts/demos/precompute/satzloss.py:
// for every position the share the model gave the token that actually
// follows, and −ln of it. The loss of a sentence is their average.

export { formatNumber, formatPercent } from './softmax.js';

/** @typedef {{ context: string, target: string, p: number, loss: number, top: string, topP: number }} Position */
/** @typedef {{ key: string, text: string, lang: 'de' | 'en', first: string, positions: Position[], mean: number }} Sentence */

/**
 * The sentences of one language, in the order of the precompute script.
 * @param {{ sentences: Sentence[] }} data
 * @param {'de' | 'en'} lang
 * @returns {Sentence[]}
 */
export function sentencesFor(data, lang) {
	return data.sentences.filter((s) => s.lang === lang);
}

/** A token as the reader sees it: without the leading space that marks a word start. */
export function tokenLabel(token) {
	return token.replace(/^ /, '');
}

/** The tokens of a sentence: the first one (no target) and every target. */
export function tokensOf(sentence) {
	return [sentence.first, ...sentence.positions.map((p) => p.target)];
}

/** Index (into `positions`) of the position with the most penalty points. */
export function costliest(sentence) {
	let best = 0;
	sentence.positions.forEach((p, i) => {
		if (p.loss > sentence.positions[best].loss) best = i;
	});
	return best;
}

/** Penalty points by which a guess may miss the maximum and still count as a hit. */
export const NEAR_TIE = 0.5;

/** Whether position `i` costs at most NEAR_TIE less than the costliest one. */
export function isNearCostliest(sentence, i) {
	return sentence.positions[costliest(sentence)].loss - sentence.positions[i].loss <= NEAR_TIE;
}

/** Index (into `positions`) of the position with the fewest penalty points. */
export function cheapest(sentence) {
	let best = 0;
	sentence.positions.forEach((p, i) => {
		if (p.loss < sentence.positions[best].loss) best = i;
	});
	return best;
}

/** The average penalty points over all positions: the loss of the sentence. */
export function meanLoss(sentence) {
	const n = sentence.positions.length;
	return n ? sentence.positions.reduce((a, p) => a + p.loss, 0) / n : 0;
}
