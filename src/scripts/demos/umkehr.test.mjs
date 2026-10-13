import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { PUBLISHED, compareGuess } from './umkehr.js';

test('the published values are the ones of Berglund et al. 2024, Experiment 2', () => {
	assert.deepEqual(PUBLISHED, { parent: 79, child: 33 });
});

test('a guess for the parent question is correct', () => {
	assert.deepEqual(compareGuess('parent'), { guess: 'parent', correct: true, better: 'parent' });
});

test('a guess for the child question is wrong', () => {
	assert.equal(compareGuess('child').correct, false);
});

test('unknown questions are rejected', () => {
	assert.throws(() => compareGuess('sibling'), RangeError);
});
