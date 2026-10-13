import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
	DEFAULT_GUESS,
	DEFAULT_KNOWN,
	DEFAULT_SCORING,
	SCORING_PENALTY,
	SCORING_ZERO_ONE,
	clampPercent,
	expected,
	formatPoints,
	leader,
	points,
	scores,
} from './klausur.js';

test('the defaults of the demo: 40 known, 25 % hit chance, only right answers count', () => {
	assert.equal(DEFAULT_KNOWN, 40);
	assert.equal(DEFAULT_GUESS, 25);
	assert.equal(DEFAULT_SCORING, SCORING_ZERO_ONE);
	assert.deepEqual(scores(DEFAULT_KNOWN, DEFAULT_GUESS), { a: 40, b: 55 });
});

test('the numbers of the text: only right answers 40 / 55, with a penalty 40 / 10', () => {
	assert.deepEqual(scores(40, 25, SCORING_ZERO_ONE), { a: 40, b: 55 });
	assert.deepEqual(scores(40, 25, SCORING_PENALTY), { a: 40, b: 10 });
});

test('expected outcomes: A never guesses, B gets k + (100 - k) p right', () => {
	const e = expected(40, 25);
	assert.deepEqual(e.a, { right: 40, wrong: 0 });
	assert.equal(e.b.right, 55);
	assert.equal(e.b.wrong, 45);
	assert.equal(e.b.right + e.b.wrong, 100);
	assert.equal(e.b.right - 40, 15);
	assert.equal(e.b.wrong, 0.75 * 60);
});

test('the unsure part of the solution: 60 questions at 1 in 4 give 15 right, 45 wrong', () => {
	const e = expected(40, 25);
	assert.equal((100 - 40) * 0.25, 15);
	assert.equal((100 - 40) * 0.75, 45);
	assert.equal(points({ right: e.b.right - 40, wrong: e.b.wrong }, SCORING_PENALTY) + 40, 10);
});

test('the scoring switch changes only the points, not the outcomes', () => {
	const e = expected(40, 25);
	assert.equal(points(e.b, SCORING_ZERO_ONE), 55);
	assert.equal(points(e.b, SCORING_PENALTY), 10);
	assert.equal(points(e.a, SCORING_PENALTY), 40);
});

test('the penalty reverses the lead only when the hit chance is below 50 percent', () => {
	assert.equal(leader(...Object.values(scores(40, 25, SCORING_ZERO_ONE))), 'b');
	assert.equal(leader(...Object.values(scores(40, 25, SCORING_PENALTY))), 'a');
	for (const k of [0, 10, 40, 75, 99]) {
		const s = scores(k, 50, SCORING_PENALTY);
		assert.equal(leader(s.a, s.b), 'tie', `k = ${k} at 50 % must be a tie`);
		assert.ok(Math.abs(s.b - k) < 1e-9);
	}
	assert.ok(scores(0, 60, SCORING_PENALTY).b > 0);
	assert.ok(scores(0, 40, SCORING_PENALTY).b < 0);
});

test('zero-one scoring: B is never behind A, because guessing costs nothing', () => {
	for (const k of [0, 25, 40, 90]) {
		for (const p of [0, 10, 25, 60, 100]) {
			const s = scores(k, p, SCORING_ZERO_ONE);
			assert.ok(s.b >= s.a, `k = ${k}, p = ${p}`);
		}
	}
});

test('edge k = 0: nothing known, B only guesses', () => {
	const e = expected(0, 25);
	assert.deepEqual(e.a, { right: 0, wrong: 0 });
	assert.equal(e.b.right, 25);
	assert.equal(e.b.wrong, 75);
	assert.deepEqual(scores(0, 25, SCORING_ZERO_ONE), { a: 0, b: 25 });
	assert.deepEqual(scores(0, 25, SCORING_PENALTY), { a: 0, b: -50 });
});

test('edge k = 100: both models know everything, nothing is guessed', () => {
	assert.deepEqual(expected(100, 25), { a: { right: 100, wrong: 0 }, b: { right: 100, wrong: 0 } });
	assert.deepEqual(scores(100, 25, SCORING_PENALTY), { a: 100, b: 100 });
	assert.equal(leader(100, 100), 'tie');
});

test('edge p = 0: B never hits, it gets the same right answers as A', () => {
	assert.deepEqual(expected(40, 0).b, { right: 40, wrong: 60 });
	assert.deepEqual(scores(40, 0, SCORING_ZERO_ONE), { a: 40, b: 40 });
	assert.deepEqual(scores(40, 0, SCORING_PENALTY), { a: 40, b: -20 });
});

test('edge p = 100: every guess is right, B is never wrong', () => {
	assert.deepEqual(expected(40, 100).b, { right: 100, wrong: 0 });
	assert.deepEqual(scores(40, 100, SCORING_PENALTY), { a: 40, b: 100 });
});

test('out-of-range inputs are clamped to 0..100', () => {
	assert.equal(clampPercent(150), 100);
	assert.equal(clampPercent(-5), 0);
	assert.equal(clampPercent(Number.NaN), 0);
	assert.deepEqual(scores(150, 25), scores(100, 25));
	assert.deepEqual(scores(40, -5), scores(40, 0));
});

test('leader names the model with more points or a tie', () => {
	assert.equal(leader(40, 55), 'b');
	assert.equal(leader(40, 10), 'a');
	assert.equal(leader(10, 10), 'tie');
});

test('points are shown as whole numbers, with a decimal comma in German', () => {
	assert.equal(formatPoints(55, 'de'), '55');
	assert.equal(formatPoints(-30, 'de'), '−30');
	assert.equal(formatPoints(10.5, 'de'), '10,5');
	assert.equal(formatPoints(10.5, 'en'), '10.5');
});
