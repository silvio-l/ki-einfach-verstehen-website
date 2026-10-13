import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MODES, ACTIONS, outcome, judge } from './berechtigung.js';

test('every mode and action has an outcome', () => {
	for (const m of MODES) for (const a of ACTIONS) assert.ok(outcome(m, a));
});

test('reading in the project runs in every mode', () => {
	for (const m of MODES) assert.equal(outcome(m, 'lesen'), 'laeuft');
});

test('dontAsk refuses what would otherwise ask', () => {
	assert.equal(outcome('dontAsk', 'umbenennen'), 'laeuft_nicht');
});

test('default asks before renaming', () => {
	assert.deepEqual(judge('default', 'umbenennen', 'fragt'), { correct: true, outcome: 'fragt' });
});

test('unknown mode, action or outcome throws', () => {
	assert.throws(() => outcome('auto', 'lesen'));
	assert.throws(() => outcome('default', 'löschen'));
	assert.throws(() => judge('default', 'lesen', 'vielleicht'));
});
