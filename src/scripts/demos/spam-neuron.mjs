// Arithmetic of the spam neuron in "Neuronale Netze" (Baustein 9): one neuron
// with three word weights and a Grundregler (bias). A word is either in the
// mail (1) or not (0); it counts once. The weights, the bias and the numbers
// are invented and set by hand (origin "simulation"), they stand for nothing
// in a real spam filter.

/** The three words with their weights, in the order of the text. */
export const WORDS = Object.freeze([
	Object.freeze({ key: 'gewinn', weight: 3 }),
	Object.freeze({ key: 'gratis', weight: 2 }),
	Object.freeze({ key: 'rechnung', weight: -2 }),
]);

/** The Grundregler (bias): fixed in this demo. */
export const BIAS = -2;

/** The candidate numbers for the prediction, in this order. */
export const GUESSES = Object.freeze([1, 3, 5]);

/** Default names for the calculation steps (German); the demo passes its own. */
export const DEFAULT_NAMES = Object.freeze({
	words: Object.freeze(['Gewinn', 'gratis', 'Rechnung']),
	bias: 'Grundregler',
	lowerLimit: 'Untergrenze',
});

/** The Untergrenze: negative values become 0, positive values stay as they are. */
export function lowerLimit(x) {
	return x > 0 ? x : 0;
}

/** A word is either in the mail (1) or not (0). Anything else is a bug. */
export function assertPresent(value) {
	if (value !== 0 && value !== 1) throw new RangeError(`word must be 0 or 1, got ${value}`);
	return value;
}

/**
 * Runs the neuron once.
 * @param {{ present: number[], lowerLimit: boolean, bias?: number }} input
 *   `present` has one 0 or 1 per word in the order of WORDS.
 * @returns {{ sum: number, value: number, out: number }}
 *   `value` is the weighted sum of the words present (without the bias),
 *   `sum` adds the bias to it, `out` is the output after the Untergrenze
 *   when it is on.
 */
export function run({ present, lowerLimit: withLimit, bias = BIAS }) {
	if (!Array.isArray(present) || present.length !== WORDS.length) {
		throw new RangeError(`present needs exactly ${WORDS.length} entries`);
	}
	const flags = present.map(assertPresent);
	const value = WORDS.reduce((acc, word, i) => acc + flags[i] * word.weight, 0);
	const sum = value + bias;
	const out = withLimit ? lowerLimit(sum) : sum;
	return { sum, value, out };
}

/** Signed numbers in brackets inside a calculation, so "1 · (−2)" reads at a glance. */
function term(x) {
	return x < 0 ? `(${formatNumber(x)})` : String(x);
}

/**
 * The calculation as plain lines, one per step:
 * "Gewinn 1 · 3 + gratis 1 · 2 + Rechnung 0 · (−2) = 5", "Grundregler −2: 3",
 * and with the Untergrenze on "Untergrenze: 3" (or 0 for a negative sum).
 */
export function steps({ present, lowerLimit: withLimit, bias = BIAS, names = DEFAULT_NAMES }) {
	const result = run({ present, lowerLimit: withLimit, bias });
	const terms = WORDS.map((word, i) => `${names.words[i]} ${present[i]} · ${term(word.weight)}`).join(' + ');
	const lines = [`${terms} = ${formatNumber(result.value)}`, `${names.bias} ${formatNumber(bias)}: ${formatNumber(result.sum)}`];
	if (withLimit) lines.push(`${names.lowerLimit}: ${formatNumber(result.out)}`);
	return lines;
}

/** Whether a guess matches the output; the Zielfrage is answered only by an exact match. */
export function judge(guess, actual) {
	return guess === actual;
}

/** Writes a number with the typographic minus sign (−1, not -1). */
export function formatNumber(n) {
	return n < 0 ? `−${Math.abs(n)}` : String(n);
}
