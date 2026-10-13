import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STEPS, judge, ACTORS } from './schleife.js';

test('six lines, each with a known actor', () => {
	assert.equal(STEPS.length, 6);
	for (const s of STEPS) assert.ok(ACTORS.includes(s.actor));
});

test('the run starts with a model call and ends with a model answer', () => {
	assert.equal(STEPS[0].actor, 'modell');
	assert.equal(STEPS[5].actor, 'modell');
});

test('the permission question comes from the program, results come back as text', () => {
	assert.equal(judge(1, 'ergebnis').correct, true);
	assert.equal(judge(3, 'programm').correct, true);
	assert.equal(judge(4, 'ergebnis').correct, true);
});

test('a wrong guess is reported as wrong with the real actor', () => {
	assert.deepEqual(judge(2, 'programm'), { correct: false, actor: 'modell' });
});

test('unknown step or actor throws', () => {
	assert.throws(() => judge(9, 'modell'));
	assert.throws(() => judge(0, 'anbieter'));
});
