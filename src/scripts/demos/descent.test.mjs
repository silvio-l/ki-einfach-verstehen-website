import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { FLAT, PROBE, PURCHASES, RANGE, RATES, START, atBottom, best, formatNumber, loss, numericSlope, path, predict, probe, slope, step } from './descent.js';

test('the start state is the text example: three purchases, fader at 0', () => {
	assert.deepEqual(PURCHASES, [
		{ kg: 1, euro: 2 },
		{ kg: 1, euro: 4 },
		{ kg: 2, euro: 6 },
	]);
	assert.equal(START, 0);
	assert.equal(predict(2, 2), 4);
});

test('the errors are the numbers of the text', () => {
	assert.equal(loss(0), 56); // 4 + 16 + 36
	assert.equal(loss(1), 26); // 1 + 9 + 16
	assert.equal(loss(2), 8);
	assert.equal(loss(3), 2); // the bottom, not 0
	assert.equal(loss(4), 8);
	assert.equal(best(), 3);
	// Falls by 30, 18, 6 per whole euro: steep far away, flat near the bottom.
	assert.deepEqual([loss(0) - loss(1), loss(1) - loss(2), loss(2) - loss(3)], [30, 18, 6]);
});

test('the slope found by trying equals the exact slope', () => {
	for (const w of [-0.5, 0, 0.7, 1, 2.25, 3, 4.1, 6]) {
		assert.ok(Math.abs(numericSlope(w) - slope(w)) < 1e-6, `w = ${w}`);
	}
	assert.equal(slope(0), -36);
	assert.equal(slope(3), 0);
	assert.ok(slope(4) > 0);
});

test('a probe a little higher at the start makes the error smaller', () => {
	const up = probe(START, 1);
	assert.ok(up.smaller);
	assert.equal(up.to, PROBE);
	assert.ok(Math.abs(up.after - 52.46) < 1e-9);
	assert.equal(probe(START, -1).smaller, false);
});

test('probes point the right way until the bottom is reached', () => {
	for (const w of path(START, RATES.small, 12)) {
		if (atBottom(w)) continue;
		const downhill = slope(w) < 0 ? 1 : -1;
		assert.ok(probe(w, downhill).smaller, `w = ${w}`);
		assert.ok(!probe(w, -downhill).smaller, `w = ${w}`);
	}
});

test('small steps lower the error every time and reach the bottom', () => {
	const ws = path(START, RATES.small, 6);
	assert.deepEqual(ws.slice(0, 4), [0, 1.5, 2.25, 2.625]);
	for (let i = 1; i < ws.length; i++) assert.ok(loss(ws[i]) < loss(ws[i - 1]), `step ${i}`);
	assert.ok(!atBottom(ws[5]));
	assert.ok(atBottom(ws[6]));
	assert.ok(Math.abs(ws[6] - 3) < 0.05);
	// Any small enough learning rate lowers the error.
	for (const rate of [0.001, 0.01, 0.05, 0.08]) assert.ok(loss(step(1, rate)) < loss(1), `rate ${rate}`);
});

test('a too large step overshoots: it jumps across the valley and never arrives', () => {
	const ws = path(START, RATES.big, 4);
	assert.deepEqual(ws, [0, 6, 0, 6, 0]);
	for (const w of ws) assert.equal(loss(w), 56);
	// Even larger steps make the error grow.
	const wild = path(START, 0.2, 3);
	assert.ok(loss(wild[3]) > loss(wild[2]) && loss(wild[2]) > loss(wild[1]));
});

test('the chart range holds every point the demo can reach', () => {
	for (const w of [...path(START, RATES.small, 20), ...path(START, RATES.big, 20)]) {
		assert.ok(w >= RANGE.min && w <= RANGE.max, `w = ${w}`);
	}
	assert.ok(FLAT > 0);
});

test('numbers are formatted like the text', () => {
	assert.equal(formatNumber(56, 'de'), '56');
	assert.equal(formatNumber(15.5, 'de'), '15,5');
	assert.equal(formatNumber(15.5, 'en'), '15.5');
	assert.equal(formatNumber(2.8125, 'de'), '2,81');
});
