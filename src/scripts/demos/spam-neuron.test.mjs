import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { BIAS, GUESSES, WORDS, assertPresent, formatNumber, judge, lowerLimit, run, steps } from './spam-neuron.mjs';

test('the Untergrenze sets negative values to 0 and keeps positive ones', () => {
	assert.equal(lowerLimit(-1), 0);
	assert.equal(lowerLimit(0), 0);
	assert.equal(lowerLimit(2), 2);
});

test('the words keep the order and weights of the text', () => {
	assert.deepEqual(WORDS, [
		{ key: 'gewinn', weight: 3 },
		{ key: 'gratis', weight: 2 },
		{ key: 'rechnung', weight: -2 },
	]);
	assert.equal(BIAS, -2);
});

test('all three words present: sum 1, output 1 with and without the Untergrenze', () => {
	const on = run({ present: [1, 1, 1], lowerLimit: true });
	const off = run({ present: [1, 1, 1], lowerLimit: false });
	assert.equal(on.sum, 1);
	assert.equal(on.out, 1);
	assert.equal(off.sum, 1);
	assert.equal(off.out, 1);
});

test('no word present: sum -2, output 0 with the Untergrenze, -2 without', () => {
	assert.equal(run({ present: [0, 0, 0], lowerLimit: true }).out, 0);
	assert.equal(run({ present: [0, 0, 0], lowerLimit: false }).out, -2);
	assert.equal(run({ present: [0, 0, 0], lowerLimit: false }).sum, -2);
});

test('Gewinn and gratis together: 3', () => {
	const result = run({ present: [1, 1, 0], lowerLimit: true });
	assert.equal(result.value, 5);
	assert.equal(result.sum, 3);
	assert.equal(result.out, 3);
});

test('Gewinn alone: 1, gratis alone: 0', () => {
	assert.equal(run({ present: [1, 0, 0], lowerLimit: true }).out, 1);
	assert.equal(run({ present: [0, 1, 0], lowerLimit: true }).out, 0);
});

test('Rechnung alone: sum -4, output 0 with the Untergrenze', () => {
	const result = run({ present: [0, 0, 1], lowerLimit: true });
	assert.equal(result.sum, -4);
	assert.equal(result.out, 0);
});

test('Gewinn and Rechnung together: sum -1, output 0 with the Untergrenze', () => {
	assert.equal(run({ present: [1, 0, 1], lowerLimit: false }).out, -1);
	assert.equal(run({ present: [1, 0, 1], lowerLimit: true }).out, 0);
});

test('a word counts only as 0 or 1: 2 is refused', () => {
	assert.throws(() => run({ present: [2, 0, 0], lowerLimit: true }), RangeError);
	assert.throws(() => assertPresent(0.5), RangeError);
	assert.equal(assertPresent(1), 1);
});

test('exactly one entry per word is required', () => {
	assert.throws(() => run({ present: [1, 0], lowerLimit: true }), RangeError);
	assert.throws(() => run({ present: [1, 0, 0, 0], lowerLimit: true }), RangeError);
});

test('the guesses contain the answer for the Zielfrage (all words 1, Untergrenze on)', () => {
	const answer = run({ present: [1, 1, 1], lowerLimit: true }).out;
	assert.equal(answer, 1);
	assert.ok(GUESSES.includes(answer));
	assert.deepEqual(GUESSES, [1, 3, 5]);
});

test('judge compares guess and output exactly', () => {
	assert.equal(judge(0, 0), true);
	assert.equal(judge(1, 0), false);
});

test('numbers are written with the typographic minus sign', () => {
	assert.equal(formatNumber(-1), '−1');
	assert.equal(formatNumber(0), '0');
	assert.equal(formatNumber(3), '3');
});

test('the calculation steps show the terms, the bias and the Untergrenze', () => {
	assert.deepEqual(steps({ present: [1, 1, 0], lowerLimit: true }), [
		'Gewinn 1 · 3 + gratis 1 · 2 + Rechnung 0 · (−2) = 5',
		'Grundregler −2: 3',
		'Untergrenze: 3',
	]);
});

test('without the Untergrenze the steps end with the sum', () => {
	assert.deepEqual(steps({ present: [0, 0, 0], lowerLimit: false }), [
		'Gewinn 0 · 3 + gratis 0 · 2 + Rechnung 0 · (−2) = 0',
		'Grundregler −2: −2',
	]);
});
