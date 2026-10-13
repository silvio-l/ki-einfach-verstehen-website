import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { ANSWER, INPUT_TOKENS, THINK, anteile, kontext, passes, verhaeltnis } from './denkschritte.js';

test('the sliders start where the demo says and sit on their steps', () => {
	assert.deepEqual(THINK, { min: 0, max: 2000, step: 50, start: 400 });
	assert.deepEqual(ANSWER, { min: 50, max: 500, step: 10, start: 150 });
	assert.equal(INPUT_TOKENS, 60);
	assert.equal((THINK.start - THINK.min) % THINK.step, 0);
	assert.equal((ANSWER.start - ANSWER.min) % ANSWER.step, 0);
});

test('passes count thinking and answer together', () => {
	assert.equal(passes(THINK.start, ANSWER.start), 550);
	assert.equal(passes(0, ANSWER.min), 50);
});

test('the context adds the fixed question to both parts', () => {
	assert.equal(kontext(400, 150), 610);
	assert.equal(kontext(400, 150, 0), 550);
});

test('doubling only the thinking tokens gives 950 passes, about 1.7 times the start', () => {
	assert.equal(passes(800, 150), 950);
	assert.equal(verhaeltnis(800, 150).toFixed(1), '1.7');
});

test('the start itself is the factor 1, and doubling both parts doubles the passes', () => {
	assert.equal(verhaeltnis(400, 150), 1);
	assert.equal(verhaeltnis(800, 300), 2);
});

test('the shares of thinking and answer add up to one', () => {
	const s = anteile(400, 150);
	assert.ok(Math.abs(s.denken - 400 / 550) < 1e-12);
	assert.ok(Math.abs(s.antwort - 150 / 550) < 1e-12);
	assert.ok(Math.abs(s.denken + s.antwort - 1) < 1e-12);
});

test('without any passes the shares are zero, not NaN', () => {
	assert.deepEqual(anteile(0, 0), { denken: 0, antwort: 0 });
});
