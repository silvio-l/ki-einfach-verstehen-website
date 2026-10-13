// Number bases for BasisDemo (Baustein warum-vorhersagen-mehr-ist-als-nachplappern,
// learning goal 3: does the same task get harder when only the notation changes?).
// Converting and adding run here in plain arithmetic. No model runs in the
// browser. The accuracy values are published measurements, copied as constants.

/** Bases the demo offers, in display order. */
export const BASES = [8, 9, 10, 11, 16];
/** Where the demo starts: the decimal base, the one the text uses. */
export const DEFAULT_BASE = 10;
/** The task: two two-digit numbers, given in decimal. */
export const OPERANDS = [47, 38];

/**
 * Share of correct answers to two-digit addition, in percent.
 * Source: Wu et al. 2023, arXiv 2307.02477, Table 18, row "2 digits, 0 shots":
 * GPT-4 (gpt-4-0314), 0-shot with chain-of-thought. Published values, not
 * recomputed. Only one model family, one test, one year.
 */
export const PUBLISHED = { 8: 60.2, 9: 38.6, 10: 98.2, 11: 56.5, 16: 74.0 };

/**
 * The same natural number written in a base, as digits (upper case for 10 to 15).
 * @param {number} n non-negative integer
 * @param {number} base integer from 2 to 36
 */
export function toBase(n, base) {
	if (!Number.isInteger(n) || n < 0) throw new RangeError(`not a natural number: ${n}`);
	if (!Number.isInteger(base) || base < 2 || base > 36) throw new RangeError(`unsupported base: ${base}`);
	return n.toString(base).toUpperCase();
}

/**
 * The addition a, b in a base: both operands and the sum as digits, plus the
 * decimal sum for comparison. The sum is the same number in every base.
 * @param {number} a
 * @param {number} b
 * @param {number} base
 */
export function sumInBase(a, b, base) {
	return { base, a: toBase(a, base), b: toBase(b, base), sum: toBase(a + b, base), decimal: a + b };
}
