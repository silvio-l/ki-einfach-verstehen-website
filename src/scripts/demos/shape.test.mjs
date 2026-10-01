import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { STEPS, formatShape, nameOf, shapeOf, weatherValue } from './shape.js';

test('single-entry axes do not count as directions', () => {
	assert.deepEqual(shapeOf([1, 1, 1]), { dims: [], axes: 0, count: 1 });
	assert.deepEqual(shapeOf([1, 1, 7]), { dims: [7], axes: 1, count: 7 });
	assert.deepEqual(shapeOf([1, 4, 7]), { dims: [4, 7], axes: 2, count: 28 });
	assert.deepEqual(shapeOf([3, 4, 7]), { dims: [3, 4, 7], axes: 3, count: 84 });
});

test('the four steps run from scalar to tensor as in the Baustein', () => {
	const names = STEPS.map((dims) => nameOf(shapeOf(dims).axes, 'de'));
	assert.deepEqual(names, ['Skalar', 'Vektor', 'Matrix', 'Tensor']);
	assert.equal(formatShape(shapeOf(STEPS[3]).dims, 'de'), '3 × 4 × 7');
	assert.equal(formatShape([], 'en'), 'no axis');
	assert.equal(nameOf(2, 'en'), 'Matrix');
});

test('the week for Berlin shows the temperatures printed in the text', () => {
	const week = Array.from({ length: 7 }, (_, day) => weatherValue(0, 0, day));
	assert.deepEqual(week, [18, 21, 19, 15, 14, 17, 20]);
});
