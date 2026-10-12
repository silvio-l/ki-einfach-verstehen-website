// Arithmetic of the backward pass in "Backpropagation und Gradienten".
//
// The network is the Treppenlicht of "Neuronale Netze" (two switches, neurons
// A and B with the lower limit, linear output C), with one weight set wrong by
// hand: C takes B times -1 instead of -2. The error of one case is the
// deviation times itself, the batch error the average over the four cases.
// A note ("Zettel") is the slope of the error for one slider: positive means
// the slider should go lower, negative higher. All numbers are invented
// (origin "simulation"); both demos use this module, and the tests pin the
// numbers that the text and the graphics repeat.

/** The four switch positions in the order of the text: none, top, bottom, both. */
export const CASES = Object.freeze([
	[0, 0],
	[1, 0],
	[0, 1],
	[1, 1],
]);

/** The lower limit: negative sums become 0. */
const relu = (x) => (x > 0 ? x : 0);

/** The nine sliders in the order of the text: A, B, then C. */
export const KEYS = Object.freeze(['wa0', 'wa1', 'ba', 'wb0', 'wb1', 'bb', 'wc0', 'wc1', 'bc']);

/** The Treppenlicht with C's weight for B set to -1 instead of -2. */
export const MISSET = Object.freeze({ wa0: 1, wa1: 1, ba: 0, wb0: 1, wb1: 1, bb: -1, wc0: 1, wc1: -1, bc: 0 });

/** The correct Treppenlicht, for comparison. */
export const CORRECT = Object.freeze({ ...MISSET, wc1: -2 });

/** Step size of the probing: each slider is turned up by this much. */
export const PROBE_STEP = 0.01;

/** The light should burn when exactly one switch is pressed. */
export function target([top, bottom]) {
	return top === bottom ? 0 : 1;
}

/** One forward pass; keeps the sums and outputs the backward pass needs. */
export function forward([top, bottom], p) {
	const aSum = top * p.wa0 + bottom * p.wa1 + p.ba;
	const bSum = top * p.wb0 + bottom * p.wb1 + p.bb;
	const a = relu(aSum);
	const b = relu(bSum);
	const out = a * p.wc0 + b * p.wc1 + p.bc;
	return { aSum, bSum, a, b, out };
}

/** Error of one case: deviation times itself. */
export function caseError(switches, p) {
	const d = forward(switches, p).out - target(switches);
	return d * d;
}

/**
 * One backward pass for one case.
 * `slope` is the slope at the output of C (2 times the deviation),
 * `influence` the slope at the outputs of A and B, `gate` the factor of the
 * lower limit (1 lets through, 0 blocks), `notes` one note per slider.
 */
export function backward(switches, p) {
	const [top, bottom] = switches;
	const f = forward(switches, p);
	const slope = 2 * (f.out - target(switches));
	const influence = { a: slope * p.wc0, b: slope * p.wc1 };
	const gate = { a: f.aSum > 0 ? 1 : 0, b: f.bSum > 0 ? 1 : 0 };
	const at = { a: influence.a * gate.a, b: influence.b * gate.b };
	const notes = {
		wa0: at.a * top,
		wa1: at.a * bottom,
		ba: at.a,
		wb0: at.b * top,
		wb1: at.b * bottom,
		bb: at.b,
		wc0: slope * f.a,
		wc1: slope * f.b,
		bc: slope,
	};
	// x + 0 turns -0 (a blocked or unpressed path times a negative factor) into 0.
	for (const k of KEYS) notes[k] += 0;
	return { forward: f, error: (f.out - target(switches)) ** 2, slope, influence, gate, notes };
}

/** Notes for a batch: the average of the notes of its cases. */
export function batchNotes(p, cases = CASES) {
	const sum = Object.fromEntries(KEYS.map((k) => [k, 0]));
	for (const c of cases) {
		const { notes } = backward(c, p);
		for (const k of KEYS) sum[k] += notes[k];
	}
	return Object.fromEntries(KEYS.map((k) => [k, sum[k] / cases.length]));
}

/** Probing one slider: turn it up by `h`, run forward again, compare errors. */
export function probe(switches, p, key, h = PROBE_STEP) {
	const turned = { ...p, [key]: p[key] + h };
	return (caseError(switches, turned) - caseError(switches, p)) / h;
}

/** Direction word of a note: positive lower, negative higher, zero none. */
export function direction(note) {
	if (Math.abs(note) < 1e-12) return 'none';
	return note > 0 ? 'lower' : 'higher';
}

/**
 * A number for display: at most `digits` decimals, trailing zeros dropped,
 * typographic minus, decimal comma in German.
 */
export function formatNumber(n, lang = 'de', digits = 2) {
	const rounded = Number(n.toFixed(digits));
	const clean = Object.is(rounded, -0) ? 0 : rounded;
	const text = String(Math.abs(clean)).replace('.', lang === 'de' ? ',' : '.');
	return clean < 0 ? `−${text}` : text;
}
