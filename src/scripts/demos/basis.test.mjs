import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { BASES, DEFAULT_BASE, OPERANDS, PUBLISHED, sumInBase, toBase } from './basis.js';

test('the numbers of the demo: 47 and 38 in bases 8, 9, 10, 11, 16', () => {
	assert.equal(toBase(47, 9), '52');
	assert.equal(toBase(38, 9), '42');
	assert.equal(toBase(47, 8), '57');
	assert.equal(toBase(38, 8), '46');
	assert.equal(toBase(47, 11), '43');
	assert.equal(toBase(38, 11), '35');
	assert.equal(toBase(47, 16), '2F');
	assert.equal(toBase(38, 16), '26');
	assert.equal(toBase(47, 10), '47');
	assert.equal(toBase(38, 10), '38');
});

test('the sums in each base: 85 is 104 / 125 / 85 / 78 / 55', () => {
	assert.equal(sumInBase(47, 38, 9).sum, '104');
	assert.equal(sumInBase(47, 38, 8).sum, '125');
	assert.equal(sumInBase(47, 38, 10).sum, '85');
	assert.equal(sumInBase(47, 38, 11).sum, '78');
	assert.equal(sumInBase(47, 38, 16).sum, '55');
});

test('the sum is the same number in every base: parsing the digits back gives 85', () => {
	for (const base of BASES) {
		const r = sumInBase(...OPERANDS, base);
		assert.equal(r.decimal, 85);
		assert.equal(parseInt(r.sum, base), 85, `base ${base}`);
		assert.equal(parseInt(r.a, base), 47, `base ${base}`);
		assert.equal(parseInt(r.b, base), 38, `base ${base}`);
	}
});

test('the bases and their published values: five bases, Table 18 of Wu et al. 2023', () => {
	assert.deepEqual(BASES, [8, 9, 10, 11, 16]);
	assert.equal(DEFAULT_BASE, 10);
	assert.deepEqual(
		BASES.map((b) => PUBLISHED[b]),
		[60.2, 38.6, 98.2, 56.5, 74.0],
	);
	for (const base of BASES) assert.ok(PUBLISHED[base] > 0 && PUBLISHED[base] <= 100);
});

test('toBase rejects what is not a natural number or a base from 2 to 36', () => {
	assert.throws(() => toBase(-1, 10), RangeError);
	assert.throws(() => toBase(1.5, 10), RangeError);
	assert.throws(() => toBase(4, 1), RangeError);
	assert.throws(() => toBase(4, 37), RangeError);
	assert.equal(toBase(0, 2), '0');
	assert.equal(toBase(255, 16), 'FF');
});
