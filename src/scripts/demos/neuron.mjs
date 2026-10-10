// Arithmetic of the Treppenlicht network in "Neuronale Netze" (Baustein 9).
//
// Two input switches (0 or 1) feed two neurons A and B. Each neuron forms its
// weighted sum and adds its Grundregler (bias); unless the knick is switched
// off, the knick (ReLU: negative values become 0) follows. The output neuron C
// weights A with 1 and B with -2 and has no Grundregler. All numbers are
// invented and set by hand (origin "simulation"); the default values are the
// ones of the text, so text, demo and graphics share one source.

export const DEFAULT_WEIGHTS = Object.freeze({
	a: Object.freeze([1, 1]),
	b: Object.freeze([1, 1]),
	c: Object.freeze([1, -2]),
});

export const DEFAULT_BIASES = Object.freeze({ a: 0, b: -1, c: 0 });

/** The four answers the reader can guess for the Zielfrage (no knick, both switches 0). */
export const GUESSES = Object.freeze([0, 2, 1, -2]);

/** The knick: negative values become 0, positive values stay as they are. */
export function relu(x) {
	return x > 0 ? x : 0;
}

/** A switch is 0 (not pressed) or 1 (pressed). Anything else is a bug. */
export function assertSwitch(value) {
	if (value !== 0 && value !== 1) throw new RangeError(`switch must be 0 or 1, got ${value}`);
	return value;
}

/**
 * Runs the network once.
 * @returns {{ a: {sum: number, value: number}, b: {sum: number, value: number}, out: number }}
 *   `sum` is the weighted sum including the Grundregler, `value` what the neuron
 *   passes on (after the knick when it is on), `out` the output of neuron C.
 */
export function run({ switches, weights = DEFAULT_WEIGHTS, biases = DEFAULT_BIASES, knick = true }) {
	const [top, bottom] = switches.map(assertSwitch);
	const stage = (w, bias) => {
		const sum = top * w[0] + bottom * w[1] + bias;
		return { sum, value: knick ? relu(sum) : sum };
	};
	const a = stage(weights.a, biases.a);
	const b = stage(weights.b, biases.b);
	const out = a.value * weights.c[0] + b.value * weights.c[1] + biases.c;
	return { a, b, out };
}

/** The four switch positions in the order of the text: none, top, bottom, both. */
export const CASES = Object.freeze([
	[0, 0],
	[1, 0],
	[0, 1],
	[1, 1],
]);

/** Output for every switch position, e.g. [0, 1, 1, 0] with knick. */
export function table({ weights, biases, knick }) {
	return CASES.map((switches) => run({ switches, weights, biases, knick }).out);
}

/** Whether a guess matches the output; the Zielfrage is answered only by an exact match. */
export function judge(guess, actual) {
	return guess === actual;
}

/** Writes a number with the typographic minus sign (−1, not -1). */
export function formatNumber(n) {
	return n < 0 ? `−${Math.abs(n)}` : String(n);
}
