// Toy attention for the QkvDemo of Baustein transformerbloecke-und-attention
// (EN transformer-blocks-and-attention). Learning goal 3 of the lesson plan:
// the three roles query, key and value and the path comparison -> score ->
// softmax -> share -> mix of the values, added to the old state.
//
// All numbers are MADE UP and labelled as such in the demo. Every vector has
// only two named places, "seat" (DE Sitzmöbel) and "money" (DE Geld), and the
// numbers are small integers so every score can be checked by hand:
// score = a·c + b·d. Unlike a real model, the scores are not divided by
// √d_k before softmax (the text explains that step in its "one level deeper"
// box). The two query settings stand for two differently trained query
// matrices, e.g. two heads.

/** The two named places of every toy vector, in this order. */
export const DIMS = ['seat', 'money'];

/** State of "Bank" before this block: equally seat and money. */
export const OLD_STATE = [1, 1];

/**
 * Learned factors that turn a state into a query (one row per place of the
 * query). Every number of the query is a weighted sum of the state's numbers.
 */
export const QUERY_FACTORS = {
	seat: [
		[0.5, 0.5],
		[0, 0],
	],
	money: [
		[0, 0],
		[0.5, 0.5],
	],
};

/**
 * The two sentences of the text. `focus` is the position of "Bank"; keys and
 * values exist for the visible positions only (the token itself and all
 * before it). Later words are locked by the causal mask.
 */
export const SENTENCES = {
	park: {
		words: {
			de: ['Ich', 'sitze', 'auf', 'der', 'Bank', 'im', 'Park'],
			en: ['I', 'sit', 'on', 'the', 'bank', 'in', 'the', 'park'],
		},
		focus: 4,
		keys: [
			[0, 0],
			[2, 0],
			[1, 0],
			[0, 0],
			[1, 1],
		],
		// "auf"/"on" fits a little (key) but brings nothing (value 0).
		values: [
			[0, 0],
			[2, 0],
			[0, 0],
			[0, 0],
			[1, 1],
		],
	},
	money: {
		words: {
			de: ['Ich', 'zahle', 'Geld', 'bei', 'der', 'Bank', 'ein'],
			en: ['I', 'pay', 'money', 'into', 'the', 'bank'],
		},
		focus: 5,
		keys: [
			[0, 0],
			[0, 2],
			[0, 3],
			[0, 0],
			[0, 0],
			[1, 1],
		],
		values: [
			[0, 0],
			[0, 1],
			[0, 2],
			[0, 0],
			[0, 0],
			[1, 1],
		],
	},
};

/** Multiply in pairs and add up: a·c + b·d. */
export function dot(a, b) {
	return a.reduce((sum, x, i) => sum + x * b[i], 0);
}

/** Every row of the matrix times the vector: one weighted sum per place. */
export function matVec(matrix, vector) {
	return matrix.map((row) => dot(row, vector));
}

/** Softmax: scores to shares that add up to exactly 1. */
export function softmax(scores) {
	const max = Math.max(...scores);
	const exps = scores.map((s) => Math.exp(s - max));
	const total = exps.reduce((a, b) => a + b, 0);
	return exps.map((e) => e / total);
}

/**
 * Whole percentages that always add up to 100 (largest remainder). For the
 * four settings of the demo this equals plain rounding.
 */
export function percents(weights) {
	const raw = weights.map((w) => w * 100);
	const out = raw.map(Math.floor);
	let missing = 100 - out.reduce((a, b) => a + b, 0);
	const order = raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
	for (const [, i] of order) {
		if (missing <= 0) break;
		out[i] += 1;
		missing -= 1;
	}
	return out;
}

/** The query of "Bank" for one setting ('seat' or 'money'). */
export function queryOf(kind) {
	return matVec(QUERY_FACTORS[kind], OLD_STATE);
}

/**
 * One full pass for "Bank": scores, shares, the mix of the values and the new
 * state (old state + mix).
 * @param {'park' | 'money'} sentence
 * @param {'seat' | 'money'} kind
 */
export function attend(sentence, kind) {
	const s = SENTENCES[sentence];
	const query = queryOf(kind);
	const scores = s.keys.map((k) => dot(query, k));
	const weights = softmax(scores);
	const pct = percents(weights);
	const mix = DIMS.map((_, d) => weights.reduce((sum, w, i) => sum + w * s.values[i][d], 0));
	const next = OLD_STATE.map((x, d) => x + mix[d]);
	return {
		query,
		focus: s.focus,
		rows: s.keys.map((key, i) => ({ key, value: s.values[i], score: scores[i], weight: weights[i], pct: pct[i] })),
		mix,
		next,
	};
}

/** "0,5" / "0.5": a number with at most `digits` decimals, per language. */
export function fmt(n, lang, digits = 1) {
	const f = 10 ** digits;
	const s = String(Math.round(n * f + 1e-9) / f);
	return lang === 'de' ? s.replace('.', ',') : s;
}

/** "0,50" / "0.50": a share written as a decimal with two places. */
export function shareDecimal(pct, lang) {
	const s = (pct / 100).toFixed(2);
	return lang === 'de' ? s.replace('.', ',') : s;
}
