import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { CASES, CORRECT, KEYS, MISSET, backward, batchNotes, caseError, direction, formatNumber, forward, probe, target } from './backprop.mjs';

const BOTH = [1, 1];
const NONE = [0, 0];
const near = (actual, expected, eps = 1e-9) => assert.ok(Math.abs(actual - expected) < eps, `${actual} is not ${expected}`);

test('the correct Treppenlicht gives 0, 1, 1, 0 and no error', () => {
	assert.deepEqual(
		CASES.map((c) => forward(c, CORRECT).out),
		[0, 1, 1, 0],
	);
	assert.deepEqual(CASES.map(target), [0, 1, 1, 0]);
	for (const c of CASES) assert.equal(caseError(c, CORRECT), 0);
});

test('the misset network is wrong only in case "beide": A 2, B 1, C 1, error 1', () => {
	const f = forward(BOTH, MISSET);
	assert.deepEqual([f.a, f.b, f.out], [2, 1, 1]);
	assert.deepEqual(
		CASES.map((c) => caseError(c, MISSET)),
		[0, 0, 0, 1],
	);
});

test('the slope at C is 2; moving C to 1.01 gives the error 1.0201', () => {
	const r = backward(BOTH, MISSET);
	assert.equal(r.slope, 2);
	near(1.01 ** 2, 1.0201);
});

test('the notes of case "beide" match the table of the text', () => {
	const { notes, influence, gate } = backward(BOTH, MISSET);
	assert.deepEqual(influence, { a: 2, b: -2 });
	assert.deepEqual(gate, { a: 1, b: 1 });
	assert.deepEqual(notes, { wa0: 2, wa1: 2, ba: 2, wb0: -2, wb1: -2, bb: -2, wc0: 4, wc1: 2, bc: 2 });
	assert.equal(direction(notes.wc0), 'lower');
	assert.equal(direction(notes.wb0), 'higher');
});

test('the largest note hangs on C\'s weight for A, which is set correctly', () => {
	const { notes } = backward(BOTH, MISSET);
	const largest = KEYS.reduce((best, k) => (Math.abs(notes[k]) > Math.abs(notes[best]) ? k : best));
	assert.equal(largest, 'wc0');
	assert.equal(MISSET.wc0, CORRECT.wc0);
});

test('the check at the misset weight: -1.01 gives C 0.99 and the error 0.9801', () => {
	const turned = { ...MISSET, wc1: -1.01 };
	near(forward(BOTH, turned).out, 0.99);
	near(caseError(BOTH, turned), 0.9801);
});

test('probing gives the rounded notes of the graphic, one forward pass per slider', () => {
	const shown = Object.fromEntries(KEYS.map((k) => [k, formatNumber(probe(BOTH, MISSET, k))]));
	assert.deepEqual(shown, { wa0: '2,01', wa1: '2,01', ba: '2,01', wb0: '−1,99', wb1: '−1,99', bb: '−1,99', wc0: '4,04', wc1: '2,01', bc: '2,01' });
});

test('in case "keiner" every note is 0 and the lower limit blocks B', () => {
	const r = backward(NONE, MISSET);
	assert.equal(r.forward.bSum, -1);
	assert.equal(r.gate.b, 0);
	for (const k of KEYS) assert.equal(r.notes[k], 0);
	// Turning B's bias to -0.99 leaves B at 0: nothing reaches C.
	assert.equal(forward(NONE, { ...MISSET, bb: -0.99 }).b, 0);
});

test('a wrong output in case "keiner" still gives B no note', () => {
	const wrongC = { ...MISSET, bc: 0.5 };
	const r = backward(NONE, wrongC);
	assert.ok(r.slope !== 0);
	assert.equal(r.notes.bc, r.slope);
	for (const k of ['wb0', 'wb1', 'bb']) assert.equal(r.notes[k], 0);
});

test('following C\'s weight for A down to 0 breaks "oben" and "unten"', () => {
	const followed = { ...MISSET, wc0: 0 };
	assert.deepEqual(
		CASES.map((c) => forward(c, followed).out),
		[0, 0, 0, -1],
	);
});

test('at 0.9 the four cases disagree and the batch note is their average 0.7', () => {
	const moved = { ...MISSET, wc0: 0.9 };
	const perCase = CASES.map((c) => backward(c, moved).notes.wc0);
	perCase.forEach((n, i) => near(n, [0, -0.2, -0.2, 3.2][i]));
	near(batchNotes(moved).wc0, 0.7);
	assert.deepEqual(
		CASES.map((c) => formatNumber(forward(c, moved).out)),
		['0', '0,9', '0,9', '0,8'],
	);
});

test('over the four cases of the misset network the note of C for A is 1', () => {
	const b = batchNotes(MISSET);
	assert.equal(b.wc0, 1);
	assert.equal(b.wb0, -0.5);
});

test('formatNumber uses the typographic minus and the language\'s decimal mark', () => {
	assert.equal(formatNumber(-1.99, 'de'), '−1,99');
	assert.equal(formatNumber(-1.99, 'en'), '−1.99');
	assert.equal(formatNumber(2.0100000000000016), '2,01');
	assert.equal(formatNumber(-0.000001), '0');
});
