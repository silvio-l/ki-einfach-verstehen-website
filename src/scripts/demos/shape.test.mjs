import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { formatShape, nameOf, shapeOf } from './shape.js';

test('single-entry axes do not count as directions', () => {
	assert.deepEqual(shapeOf([1, 1, 1]), { dims: [], axes: 0, count: 1 });
	assert.deepEqual(shapeOf([1, 1, 7]), { dims: [7], axes: 1, count: 7 });
	assert.deepEqual(shapeOf([1, 4, 7]), { dims: [4, 7], axes: 2, count: 28 });
	assert.deepEqual(shapeOf([3, 4, 7]), { dims: [3, 4, 7], axes: 3, count: 84 });
});

test('names and shape strings follow the Baustein', () => {
	assert.equal(nameOf(0, 'de'), 'Skalar');
	assert.equal(nameOf(2, 'en'), 'Matrix');
	assert.equal(nameOf(3, 'de'), 'Tensor');
	assert.equal(formatShape([3, 4, 7], 'de'), '3 × 4 × 7');
	assert.equal(formatShape([5, 768], 'de'), '5 × 768');
	assert.equal(formatShape([], 'en'), 'no axis');
});
