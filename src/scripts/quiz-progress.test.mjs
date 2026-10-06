import assert from 'node:assert/strict';
import { test } from 'node:test';

import { optionOrder } from './quiz-progress.js';

test('optionOrder returns every index exactly once', () => {
	for (let run = 0; run < 50; run += 1) {
		assert.deepEqual([...optionOrder(4)].sort(), [0, 1, 2, 3]);
	}
});

test('optionOrder moves the first option away from the top', () => {
	// random() = 0 swaps each position with index 0: [1, 2, 3, 0].
	assert.deepEqual(optionOrder(4, () => 0), [1, 2, 3, 0]);
});

test('optionOrder spreads the correct answer over all positions', () => {
	const positions = new Set();
	for (let run = 0; run < 200; run += 1) positions.add(optionOrder(4).indexOf(0));
	assert.deepEqual([...positions].sort(), [0, 1, 2, 3]);
});

test('optionOrder handles a single option', () => {
	assert.deepEqual(optionOrder(1), [0]);
});
