import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { SCENARIOS, SOURCES, judge } from './schreibtisch.js';

test('every scenario answers from one of the five offered sources', () => {
	for (const [name, s] of Object.entries(SCENARIOS)) {
		assert.ok(SOURCES.includes(s.answer), `${name} has an unknown answer`);
	}
});

test('the Hauptstadt answer comes from the weights, without any text on the desk', () => {
	assert.equal(judge('hauptstadt', 'gewichte').correct, true);
	assert.equal(judge('hauptstadt', 'kontext').correct, false);
});

test('the weather answer comes from a tool, because the search brought the value onto the desk', () => {
	const verdict = judge('wetter', 'notiz');
	assert.equal(verdict.correct, false);
	assert.equal(verdict.answer, 'werkzeug');
	assert.equal(judge('wetter', 'werkzeug').correct, true);
});

test('without a search, the current state is guessed, not read from the weights', () => {
	assert.equal(judge('stand', 'geraten').correct, true);
	assert.equal(judge('stand', 'gewichte').correct, false);
});

test('a saved memory is the answer when the desk holds a stored statement about the reader', () => {
	assert.equal(judge('kinder', 'notiz').correct, true);
	assert.equal(judge('kinder', 'werkzeug').correct, false);
});

test('unknown scenarios and sources are rejected', () => {
	assert.throws(() => judge('nope', 'gewichte'));
	assert.throws(() => judge('hauptstadt', 'magie'));
});
