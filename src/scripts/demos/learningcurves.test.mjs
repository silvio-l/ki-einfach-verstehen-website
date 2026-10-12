import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { PLOT, bestEpoch, curvePath, formatLoss, pointAt, stepsAfter } from './learningcurves.js';

const data = JSON.parse(readFileSync(new URL('./data/lernkurven.json', import.meta.url), 'utf8'));
const { klein, gross } = data.runs;

test('the data has one value per epoch for both runs', () => {
	for (const run of [klein, gross]) {
		assert.equal(run.train.length, data.setup.epochs + 1);
		assert.equal(run.val.length, data.setup.epochs + 1);
		assert.equal(run.steps, stepsAfter(run, data.setup.epochs));
	}
	assert.equal(klein.val[0], gross.val[0], 'both runs start from the same weights');
});

test('the figures of the Baustein come out of the run', () => {
	assert.equal(bestEpoch(klein), 9);
	assert.equal(formatLoss(klein.val[9], 'de'), '2,44');
	assert.equal(klein.val.at(-1).toFixed(1), '3.6');
	assert.equal(klein.train.at(-1).toFixed(1), '0.3');
	assert.equal(gross.val.at(-1).toFixed(1), '1.7');
	assert.equal(gross.train.at(-1).toFixed(1), '1.4');
	assert.equal(klein.val[0].toFixed(1), '4.3');
	assert.ok(Math.min(...gross.val) < Math.min(...klein.val));
	assert.equal(data.setup.vocab, 67);
	assert.ok(Math.abs(data.setup.parameters - 14000) < 500);
});

test('the small run overfits, the large one does not', () => {
	assert.ok(klein.val.at(-1) > klein.val[bestEpoch(klein)] + 1);
	assert.ok(gross.val.at(-1) - Math.min(...gross.val) < 0.05);
});

test('curves are drawn inside the plot box', () => {
	const d = curvePath(klein.val);
	assert.ok(d.startsWith(`M${PLOT.left.toFixed(1)},`));
	assert.equal(d.split(' ').length, klein.val.length);
	assert.equal(curvePath(klein.val, 9).split(' ').length, 10);
	const end = pointAt(klein.val, 50);
	assert.equal(end.x, PLOT.right);
	assert.ok(end.y > PLOT.top && end.y < PLOT.bottom);
});
