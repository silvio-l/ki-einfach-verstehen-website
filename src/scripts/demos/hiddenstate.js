// The invented two-stage mini model of the demo "Fixed faders, changing
// meters" (Baustein W1 was-ein-ki-modell-eigentlich-ist). Three input
// numbers per sentence start, two intermediate values (meters), one score
// per answer. Every stage is a sum of products, like the spam filter of
// Baustein 1: fader value × incoming number, added up. All numbers are made
// up and small enough to check in your head; the demo says so.

/** Allowed fader positions (integers). */
export const RANGE = { min: -3, max: 3 };

/** Fixed display scales (absolute value at the bar's end); bars clamp. */
export const SCALE = { hidden: 14, score: 30 };

/**
 * The faders (parameters). Stage 1: meter `row` = Σ fader × input `col`.
 * Stage 2: score of answer `row` = Σ fader × meter `col`.
 */
export const FADERS = [
	{ key: 'r1', stage: 1, row: 0, col: 0, value: 2 },
	{ key: 'r2', stage: 1, row: 0, col: 1, value: -1 },
	{ key: 'r3', stage: 1, row: 0, col: 2, value: 1 },
	{ key: 'r4', stage: 1, row: 1, col: 0, value: -1 },
	{ key: 'r5', stage: 1, row: 1, col: 1, value: 2 },
	{ key: 'r6', stage: 1, row: 1, col: 2, value: 1 },
	{ key: 'r7', stage: 2, row: 0, col: 0, value: 2 },
	{ key: 'r8', stage: 2, row: 0, col: 1, value: 1 },
	{ key: 'r9', stage: 2, row: 1, col: 0, value: 1 },
	{ key: 'r10', stage: 2, row: 1, col: 1, value: 2 },
];

/** The two sentence starts, their input numbers and the two answers. */
export const SENTENCES = [
	{ key: 'a', input: [2, 1, 1], text: { de: 'Die Hauptstadt von Frankreich ist', en: 'The capital of France is' } },
	{ key: 'b', input: [1, 2, 1], text: { de: 'Paris ist die Hauptstadt von', en: 'Paris is the capital of' } },
];
export const ANSWERS = [
	{ key: 'paris', label: { de: 'Paris', en: 'Paris' } },
	{ key: 'france', label: { de: 'Frankreich', en: 'France' } },
];

/** Starting fader values as a map key -> value. */
export function startValues() {
	return Object.fromEntries(FADERS.map((f) => [f.key, f.value]));
}

/** Clamps and rounds a fader position into RANGE. */
export function clampFader(value) {
	const n = Math.round(Number(value));
	if (!Number.isFinite(n)) return 0;
	return Math.max(RANGE.min, Math.min(RANGE.max, n));
}

/**
 * Runs one sentence start through both stages.
 * @param {Record<string, number>} values fader values by key
 * @param {number[]} input three input numbers
 * @returns {{ hidden: number[], scores: number[], hiddenTerms: {fader: string, value: number, factor: number}[][], scoreTerms: {fader: string, value: number, factor: number}[][], winner: number }}
 */
export function run(values, input) {
	const stage = (n, s, factors) =>
		Array.from({ length: n }, (_, row) =>
			FADERS.filter((f) => f.stage === s && f.row === row).map((f) => ({ fader: f.key, value: values[f.key], factor: factors[f.col] })),
		);
	const total = (terms) => terms.reduce((acc, t) => acc + t.value * t.factor, 0);
	const hiddenTerms = stage(2, 1, input);
	const hidden = hiddenTerms.map(total);
	const scoreTerms = stage(ANSWERS.length, 2, hidden);
	const scores = scoreTerms.map(total);
	// Ties go to the first answer; the demo shows the tie anyway.
	const winner = scores[1] > scores[0] ? 1 : 0;
	return { hidden, scores, hiddenTerms, scoreTerms, winner };
}

/** Both sentence starts under one set of fader values. */
export function runAll(values) {
	return SENTENCES.map((s) => run(values, s.input));
}

/** Typographic minus for display. */
export const minus = (n) => String(n).replace('-', '−');

/** "2 × 2 + (−1) × 1 + 1 × 1 = 4": a stage written out, fader first. */
export function equation(terms) {
	const factor = (n) => (n < 0 ? `(${minus(n)})` : String(n));
	const sum = terms.reduce((acc, t) => acc + t.value * t.factor, 0);
	return `${terms.map((t) => `${factor(t.value)} × ${factor(t.factor)}`).join(' + ')} = ${minus(sum)}`;
}

/**
 * What one fader move changed, per sentence: which scores moved and from
 * what to what. Drives the announcement "Wissen ist verteilt".
 */
export function diff(before, after) {
	return before.map((b, i) => ({
		sentence: SENTENCES[i].key,
		changed: b.scores.some((s, j) => s !== after[i].scores[j]),
		scores: b.scores.map((s, j) => ({ answer: ANSWERS[j].key, from: s, to: after[i].scores[j] })).filter((d) => d.from !== d.to),
		winnerFlipped: b.winner !== after[i].winner,
	}));
}

/** Bar geometry on a zero-centred scale: left offset and width in percent. */
export function bar(value, scale) {
	const v = Math.max(-scale, Math.min(scale, value));
	const half = (Math.abs(v) / scale) * 50;
	return { left: v < 0 ? 50 - half : 50, width: half };
}
