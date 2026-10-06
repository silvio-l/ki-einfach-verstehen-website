// Toy output head for the OutputScoreDemo of Baustein output-head (EN
// output-head). Learning goal 1 of the lesson plan: the score of a token is
// state times row, position by position, all added up. The numbers are the
// made-up toy example of the text ("Der Hund jagt die" / "The dog chases
// the"), not model values; the text itself labels them as made up. The names
// of the three positions are invented for the demo only -- real positions
// have no names, as the text says right after the demo.

/** The state after "Der Hund jagt die", exactly as in the text. */
export const START_STATE = [1, 0.5, -1];

/** The four rows of the text, in the text's order. */
export const ROWS = [
	{ key: 'cat', word: { de: 'Katze', en: 'cat' }, row: [2, 1, -1.5] },
	{ key: 'pigeon', word: { de: 'Taube', en: 'pigeon' }, row: [1, 1, -1] },
	{ key: 'duck', word: { de: 'Ente', en: 'duck' }, row: [0.5, 0, -1] },
	{ key: 'cloud', word: { de: 'Wolke', en: 'cloud' }, row: [-1, 0, 0] },
];

/** Invented names of the three positions (made up, labelled as such). */
export const DIMS = [
	{ key: 'animal', name: { de: 'Tier', en: 'animal' } },
	{ key: 'quick', name: { de: 'flink', en: 'quick' } },
	{ key: 'object', name: { de: 'Gegenstand', en: 'object' } },
];

/** Slider range for every position of the state. */
export const RANGE = { min: -2, max: 2, step: 0.5 };

/** Largest possible |score| within RANGE, for scaling the bars. */
export const MAX_ABS_SCORE = Math.max(...ROWS.map((r) => r.row.reduce((s, x) => s + Math.abs(x), 0))) * Math.max(Math.abs(RANGE.min), RANGE.max);

/** Position-by-position products of state and row. */
export function products(state, row) {
	return row.map((x, i) => round(state[i] * x));
}

/** The score: all products added up. */
export function score(state, row) {
	return round(products(state, row).reduce((s, x) => s + x, 0));
}

/**
 * Every row with its products and score, best first. Ties keep the text's
 * order, so the ranking never flickers between equal scores.
 */
export function ranking(state) {
	return ROWS.map((r, i) => ({ ...r, index: i, products: products(state, r.row), score: score(state, r.row) })).sort(
		(a, b) => b.score - a.score || a.index - b.index,
	);
}

/** The row that equals the state exactly, if any (to show "equal is not needed"). */
export function equalRow(state) {
	return ROWS.find((r) => r.row.every((x, i) => x === state[i]));
}

/**
 * "2,0", "−1,5", "0", "0,25": a number as the text writes it -- one decimal,
 * two only where needed, zero bare, a real minus sign. With `sign`, positive
 * numbers get a "+".
 */
export function formatNumber(x, lang, { sign = false } = {}) {
	const v = round(x);
	if (v === 0) return '0';
	const abs = Math.abs(v);
	let s = Number.isInteger(Math.round(abs * 1000) / 100) ? abs.toFixed(1) : abs.toFixed(2);
	if (lang === 'de') s = s.replace('.', ',');
	if (v < 0) return `−${s}`;
	return sign ? `+${s}` : s;
}

/** Round away floating-point noise (all inputs are multiples of 0.5). */
function round(x) {
	const r = Math.round(x * 100) / 100;
	return Object.is(r, -0) ? 0 : r;
}
