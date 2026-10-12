import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { BATCHES_M, BUDGETS_BN, GPT3_BATCH_M, GPT3_BUDGET_BN, GPT3_SOURCES, epochsAt, formatDecimal, formatEpochs, formatInt, steps } from './trainingplan.js';

test('GPT-3 makes the steps of the Baustein', () => {
	assert.equal(steps(GPT3_BUDGET_BN, GPT3_BATCH_M), 93750);
	assert.equal(formatInt(steps(300, 3.2), 'de'), '93.750');
	assert.equal(formatInt(steps(300, 3.2), 'en'), '93,750');
});

test('four times the batch means a quarter of the steps', () => {
	assert.equal(steps(300, 12.8), steps(300, 3.2) / 4);
	assert.ok(BATCHES_M.includes(12.8) && BATCHES_M.includes(GPT3_BATCH_M));
	assert.ok(BUDGETS_BN.includes(GPT3_BUDGET_BN));
});

test('the epochs at 300 billion tokens are the paper’s', () => {
	assert.deepEqual(
		GPT3_SOURCES.map((s) => formatEpochs(epochsAt(s, 300), 'de')),
		['0,44', '2,9', '1,9', '0,43', '3,4'],
	);
	assert.equal(GPT3_SOURCES.reduce((sum, s) => sum + s.share, 0), 101);
});

test('epochs grow with the budget and ignore the batch', () => {
	const cc = GPT3_SOURCES.find((s) => s.key === 'cc');
	assert.ok(epochsAt(cc, 600) < 1);
	assert.ok(epochsAt(cc, 1000) > 1);
	assert.equal(formatEpochs(epochsAt(cc, 1000), 'en'), '1.5');
	const wiki = GPT3_SOURCES.find((s) => s.key === 'wiki');
	assert.equal(formatEpochs(epochsAt(wiki, 3000), 'de'), '34');
});

test('decimals are written per language', () => {
	assert.equal(formatDecimal(3.2, 'de'), '3,2');
	assert.equal(formatDecimal(12.8, 'en'), '12.8');
});
