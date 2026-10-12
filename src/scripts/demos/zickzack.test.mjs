import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { BETAS, DEFAULT, RATES, START, STEPS, VALLEY, WALL, formatNumber, gradient, loss, noises, run, runAll, speedup, sway, winner } from './zickzack.js';

test('the ravine: across is a hundred times steeper than along', () => {
	assert.equal(loss({ across: 0, along: 0 }), 0);
	assert.equal(loss({ across: 1, along: 0 }), 5);
	assert.ok(Math.abs(loss({ across: 0, along: 10 }) - 5) < 1e-12);
	assert.deepEqual(gradient({ across: 1, along: 1 }), { across: 10, along: 0.1 });
	assert.ok(loss(START) > VALLEY);
});

test('the noise is seeded and the same for every rule', () => {
	assert.deepEqual(noises(7), noises(7));
	assert.notDeepEqual(noises(7), noises(8));
	assert.equal(noises(7).length, STEPS);
	const r = runAll();
	for (const k of ['plain', 'momentum', 'adam']) assert.deepEqual(r[k].points[0], START);
});

test('the defaults are on the sliders', () => {
	assert.ok(RATES.includes(DEFAULT.rate));
	assert.ok(BETAS.includes(DEFAULT.beta));
});

test('with the defaults Adam reaches the valley first, and momentum is calmer than plain', () => {
	const r = runAll();
	assert.equal(winner(r), 'adam');
	assert.ok(r.adam.reached > 0 && r.adam.reached < r.momentum.reached);
	assert.ok(!r.plain.escaped && !r.momentum.escaped && !r.adam.escaped);
	// Plain zigzags from side to side; momentum stays near the middle.
	assert.ok(sway(r.plain) > 2.5 * sway(r.momentum), `${sway(r.plain)} vs ${sway(r.momentum)}`);
});

test('Adam wins on every one of 50 seeds from a learning rate of 0.12 up', () => {
	for (const rate of RATES.filter((x) => x >= 0.12)) {
		for (let seed = 1; seed <= 50; seed++) assert.equal(winner(runAll({ rate, seed })), 'adam', `rate ${rate}, seed ${seed}`);
	}
});

test('a large learning rate throws the plain rule out of the ravine, momentum stays inside', () => {
	const r = runAll({ rate: 0.22 });
	assert.equal(r.plain.escaped, true);
	assert.ok(Math.abs(r.plain.points.at(-1).across) <= WALL);
	assert.equal(r.momentum.escaped, false);
	assert.equal(r.adam.escaped, false);
	for (let seed = 1; seed <= 50; seed++) assert.equal(run('momentum', { rate: 0.22, seed }).escaped, false);
});

test('too much momentum (99 %) is sluggish and does not reach the valley', () => {
	const slow = run('momentum', { beta: 0.99 });
	const normal = run('momentum', { beta: 0.9 });
	assert.equal(slow.reached, -1);
	assert.ok(slow.points.at(-1).along > 2 * normal.points.at(-1).along);
});

test('small learning rates: nobody reaches the valley within the run', () => {
	const r = runAll({ rate: 0.06 });
	assert.equal(winner(r), null);
});

test('number formatting', () => {
	assert.equal(formatNumber(0.18, 'de'), '0,18');
	assert.equal(formatNumber(0.9, 'en'), '0.9');
	assert.equal(formatNumber(44, 'de'), '44');
});

test('the guess: with the defaults Adam is about twice as fast as the plain rule', () => {
	const r = runAll();
	assert.equal(r.plain.reached, 76);
	assert.equal(r.adam.reached, 44);
	assert.equal(speedup(r), 'double');
	assert.equal(speedup(runAll({ rate: 0.22 })), null);
});
