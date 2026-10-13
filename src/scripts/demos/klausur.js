// Expected points of two models on 100 exam questions, for KlausurDemo
// (origin "simulation": both models are invented). Model A answers "I don't
// know" whenever it is unsure; model B always guesses. Both know the same
// share k of the questions; B guesses the rest with hit chance p.
// Scoring is either "only right answers count" or "a wrong answer costs one
// point". Everything here is expected values, not a simulation run.

import { formatNumber } from './softmax.js';

export { formatNumber };

/** Default share of questions both models know, in percent. */
export const DEFAULT_KNOWN = 40;
/** Default hit chance of B when it guesses, in percent (1 in 4). */
export const DEFAULT_GUESS = 25;
export const SCORING_ZERO_ONE = 'zero-one';
export const SCORING_PENALTY = 'penalty';
export const DEFAULT_SCORING = SCORING_ZERO_ONE;

/** Clamp a percentage to 0..100; anything that is not a number counts as 0. */
export function clampPercent(x) {
	if (!Number.isFinite(x)) return 0;
	return Math.min(100, Math.max(0, x));
}

/**
 * Expected right and wrong answers per 100 questions.
 * @param {number} known share k in percent, the questions both know
 * @param {number} guess hit chance p in percent, B's guesses
 * @returns {{ a: { right: number, wrong: number }, b: { right: number, wrong: number } }}
 */
export function expected(known, guess) {
	const k = clampPercent(known);
	const p = clampPercent(guess) / 100;
	const unknown = 100 - k;
	return {
		a: { right: k, wrong: 0 },
		b: { right: k + unknown * p, wrong: unknown * (1 - p) },
	};
}

/**
 * Points of one outcome under the chosen scoring.
 * @param {{ right: number, wrong: number }} outcome
 * @param {string} scoring SCORING_ZERO_ONE or SCORING_PENALTY
 */
export function points(outcome, scoring = DEFAULT_SCORING) {
	return scoring === SCORING_PENALTY ? outcome.right - outcome.wrong : outcome.right;
}

/**
 * Points of model A and model B for the given settings.
 * @returns {{ a: number, b: number }}
 */
export function scores(known, guess, scoring = DEFAULT_SCORING) {
	const e = expected(known, guess);
	return { a: points(e.a, scoring), b: points(e.b, scoring) };
}

/**
 * Which model has more points: 'a', 'b' or 'tie'.
 * @param {number} a
 * @param {number} b
 */
export function leader(a, b) {
	if (Math.abs(a - b) < 1e-9) return 'tie';
	return a > b ? 'a' : 'b';
}

/**
 * A point value as the text writes it: whole numbers without decimals,
 * otherwise one decimal. "55", "10", "−30", "10,5".
 * @param {number} n
 * @param {'de' | 'en'} lang
 */
export function formatPoints(n, lang) {
	const whole = Math.abs(n - Math.round(n)) < 1e-9;
	return formatNumber(n, lang, whole ? 0 : 1);
}
