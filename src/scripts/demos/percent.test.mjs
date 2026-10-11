import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { hundredPercents } from './percent.js';

const sum = (xs) => xs.reduce((a, b) => a + (b ?? 0), 0);

test('three equal thirds show 34, 33, 33, not 33 three times', () => {
	assert.deepEqual(hundredPercents([1 / 3, 1 / 3, 1 / 3]), [34, 33, 33]);
});

test('plain rounding would show 101 %, largest remainder shows 100 %', () => {
	const shares = [0.335, 0.335, 0.33];
	assert.equal(sum(shares.map((s) => Math.round(s * 100))), 101);
	assert.equal(sum(hundredPercents(shares)), 100);
});

test('shares below one step stay null and count as what they are', () => {
	// Softmax of 3, 2, -1 at temperature 0.5: 88.05, 11.92 and 0.03 %.
	const shares = [0.880537, 0.119168, 0.000295];
	assert.deepEqual(hundredPercents(shares), [88, 12, null]);
	// Many tiny shares: the shown whole numbers leave room for them.
	const tiny = [0.5, 0.48, ...Array(4).fill(0.005)];
	assert.deepEqual(hundredPercents(tiny), [50, 48, null, null, null, null]);
});

test('null entries (masked tokens) are kept as null', () => {
	assert.deepEqual(hundredPercents([0.6, 0.4, null]), [60, 40, null]);
});

test('tenths add up to 100.0', () => {
	const shares = [0.47512, 0.21337, 0.11151, 0.2];
	const shown = hundredPercents(shares, 1);
	assert.equal(Math.round(sum(shown) * 10), 1000);
	assert.deepEqual(shown, [47.5, 21.3, 11.2, 20]);
});

test('random distributions always show 100 when nothing is tiny', () => {
	let seed = 7;
	const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
	for (let n = 0; n < 500; n++) {
		const raw = Array.from({ length: 2 + (n % 6) }, () => 0.2 + rand());
		const total = sum(raw);
		const shown = hundredPercents(raw.map((x) => x / total));
		assert.equal(sum(shown), 100, `run ${n}: ${shown}`);
	}
});
