import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { HIGH, LOW, START, STEPS, WARMUP, endError, formatNumber, loss, lowest, noises, rateAt, run, runAll } from './lernraten-plan.js';

test('the toy: one fader, valley at 0, start at 6', () => {
	assert.equal(loss(0), 0);
	assert.equal(loss(START), 18);
	assert.deepEqual(noises(3), noises(3));
	assert.equal(noises(3).length, STEPS);
});

test('the schedule warms up to the peak, then falls along a cosine to zero', () => {
	assert.ok(Math.abs(rateAt('plan', 0) - HIGH / WARMUP) < 1e-12);
	assert.ok(Math.abs(rateAt('plan', WARMUP - 1) - HIGH) < 1e-12);
	assert.ok(Math.abs(rateAt('plan', WARMUP) - HIGH) < 1e-12);
	for (let t = 1; t < WARMUP; t++) assert.ok(rateAt('plan', t) > rateAt('plan', t - 1));
	for (let t = WARMUP + 1; t < STEPS; t++) assert.ok(rateAt('plan', t) < rateAt('plan', t - 1));
	assert.ok(rateAt('plan', STEPS - 1) < 0.001);
	assert.equal(rateAt('high', 50), HIGH);
	assert.equal(rateAt('low', 50), LOW);
});

test('with the start notes the schedule ends lowest, high jitters, low barely moves', () => {
	const r = runAll();
	assert.equal(lowest(r), 'plan');
	assert.ok(endError(r.plan) < endError(r.high) / 10);
	// High is near the valley after a few steps but keeps jittering.
	assert.ok(r.high.errors[5] < 1);
	assert.ok(endError(r.high) > 0.1);
	// Low is still far from the valley: more than a third of the way is left.
	assert.ok(endError(r.low) > loss(START) / 8);
});

test('with new notes the schedule ends lowest almost always', () => {
	let wins = 0;
	for (let seed = 1; seed <= 200; seed++) if (lowest(runAll({ seed })) === 'plan') wins += 1;
	assert.ok(wins >= 195, `${wins} of 200`);
	for (let seed = 3; seed <= 40; seed++) assert.equal(lowest(runAll({ seed })), 'plan', `seed ${seed}`);
});

test('the warm-up starts small and still reaches the valley within its steps', () => {
	// The toy has no random start and no adaptive step sizes, which the
	// warm-up protects in real training, so here it only costs a few steps.
	const r = run('plan');
	assert.equal(r.ws[0], START);
	assert.ok(r.errors[WARMUP] < 1);
});

test('number formatting', () => {
	assert.equal(formatNumber(0.3777, 'de'), '0,38');
	assert.equal(formatNumber(0.0028, 'en'), '0.003');
	assert.equal(formatNumber(18, 'de'), '18');
});
