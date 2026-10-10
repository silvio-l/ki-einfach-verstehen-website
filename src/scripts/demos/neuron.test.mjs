import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { CASES, DEFAULT_BIASES, DEFAULT_WEIGHTS, assertSwitch, formatNumber, GUESSES, judge, relu, run, table } from './neuron.mjs';

test('the knick sets negative values to zero and keeps positive ones', () => {
	assert.equal(relu(-1), 0);
	assert.equal(relu(0), 0);
	assert.equal(relu(2), 2);
});

test('with knick the text gives 0, 1, 1, 0', () => {
	assert.deepEqual(table({ weights: DEFAULT_WEIGHTS, biases: DEFAULT_BIASES, knick: true }), [0, 1, 1, 0]);
});

test('without knick the text gives 2, 1, 1, 0', () => {
	assert.deepEqual(table({ weights: DEFAULT_WEIGHTS, biases: DEFAULT_BIASES, knick: false }), [2, 1, 1, 0]);
});

test('the Zielfrage: no switch pressed, no knick, output 2', () => {
	const result = run({ switches: [0, 0], knick: false });
	assert.equal(result.a.sum, 0);
	assert.equal(result.b.sum, -1);
	assert.equal(result.b.value, -1);
	assert.equal(result.out, 2);
});

test('with knick the same position passes B as 0 on', () => {
	const result = run({ switches: [0, 0], knick: true });
	assert.equal(result.b.sum, -1);
	assert.equal(result.b.value, 0);
	assert.equal(result.out, 0);
});

test('both switches pressed: A rechnet 2, B rechnet 1 (knick has no effect)', () => {
	const result = run({ switches: [1, 1], knick: true });
	assert.equal(result.a.value, 2);
	assert.equal(result.b.value, 1);
	assert.equal(result.out, 0);
});

test('CASES follow the order of the text: none, top, bottom, both', () => {
	assert.deepEqual(CASES, [
		[0, 0],
		[1, 0],
		[0, 1],
		[1, 1],
	]);
});

test('changing a weight changes the output, the default stays untouched', () => {
	const weights = { ...DEFAULT_WEIGHTS, c: [1, -1] };
	assert.equal(run({ switches: [1, 1], weights, knick: true }).out, 1);
	assert.deepEqual(DEFAULT_WEIGHTS.c, [1, -2]);
});

test('a bias of the output neuron adds to the output', () => {
	const biases = { ...DEFAULT_BIASES, c: 1 };
	assert.equal(run({ switches: [0, 0], biases, knick: true }).out, 1);
});

test('switches accept only 0 and 1', () => {
	assert.equal(assertSwitch(0), 0);
	assert.equal(assertSwitch(1), 1);
	assert.throws(() => assertSwitch(2), RangeError);
	assert.throws(() => assertSwitch(0.5), RangeError);
	assert.throws(() => run({ switches: [1, 3] }), RangeError);
});

test('the guesses contain the right answer and the three typical wrong ones', () => {
	assert.deepEqual(GUESSES, [0, 2, 1, -2]);
	assert.equal(judge(2, 2), true);
	assert.equal(judge(0, 2), false);
});

test('numbers are written with the typographic minus sign', () => {
	assert.equal(formatNumber(-1), '−1');
	assert.equal(formatNumber(0), '0');
	assert.equal(formatNumber(2), '2');
});
