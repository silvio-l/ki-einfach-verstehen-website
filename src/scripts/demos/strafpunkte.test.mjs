import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { GOAL_PERCENT, HALVING_MIN, START_PERCENT, curvePath, formatField, formatNumber, halve, halvings, penalty } from './strafpunkte.js';

const pts = (percent, lang = 'de') => formatNumber(penalty(percent), lang, 2);

test('the numbers of the text: 72 / 27 / 1 % -> 0,33 / 1,31 / 4,61, Paris 47,5 -> 0,74', () => {
	assert.equal(pts(72), '0,33');
	assert.equal(pts(27), '1,31');
	assert.equal(pts(1), '4,61');
	assert.equal(pts(47.539), '0,74');
	assert.equal(pts(72, 'en'), '0.33');
});

test('the halving series of the text: 100 / 50 / 25 / 12,5 / 6,25 -> 0 / 0,7 / 1,4 / 2,1 / 2,8', () => {
	assert.deepEqual(
		[100, 50, 25, 12.5, 6.25].map((p) => formatNumber(penalty(p), 'de', 1)),
		['0,0', '0,7', '1,4', '2,1', '2,8'],
	);
	assert.equal(penalty(100), 0);
	assert.equal(formatNumber(penalty(0.001), 'de', 1), '11,5');
});

test('every halving adds ln 2, wherever it starts', () => {
	for (const p of [100, 72, 36, 3, 0.02]) {
		assert.ok(Math.abs(penalty(p / 2) - penalty(p) - Math.LN2) < 1e-12);
	}
	assert.ok(Math.abs(halvings(1) - 6.644) < 0.001);
	assert.equal(halvings(12.5), 3);
});

test('the goal of the demo: half of 72 % costs about 1,0', () => {
	assert.equal(START_PERCENT, 72);
	assert.equal(GOAL_PERCENT, START_PERCENT / 2);
	assert.equal(pts(GOAL_PERCENT), '1,02');
});

test('no upper limit: the penalty grows without bound towards 0 %', () => {
	assert.equal(penalty(0), Infinity);
	assert.ok(penalty(1e-9) > 20);
	assert.equal(halve(72), 36);
	assert.equal(halve(HALVING_MIN), HALVING_MIN);
});

test('field sizes are written like the text: 72, 4,5, 0,28', () => {
	assert.deepEqual(
		[72, 36, 4.5, 2.25, 0.28125, 0.001].map((p) => formatField(p, 'de')),
		['72', '36', '4,5', '2,3', '0,28', '0,001'],
	);
	assert.equal(formatField(4.5, 'en'), '4.5');
});

test('the curve starts at 100 % on the floor and is clipped at the top', () => {
	const d = curvePath(300, 150, 5);
	assert.match(d, /^M/);
	const points = d.slice(1).split('L').map((p) => p.split(',').map(Number));
	const last = points.at(-1);
	assert.deepEqual(last, [300, 150]);
	assert.ok(points.every(([x, y]) => x >= 0 && x <= 300 && y >= 0 && y <= 150));
	assert.equal(points[0][1], 0);
});
