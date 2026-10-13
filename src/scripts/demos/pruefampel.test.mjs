import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AMPELN, SCHRITTE, FAELLE, judge } from './pruefampel.js';

test('every case has a known light and a known check', () => {
	for (const f of FAELLE) {
		assert.ok(AMPELN.includes(f.ampel));
		assert.ok(SCHRITTE.includes(f.schritt));
	}
});

test('the medication case is red and needs a specialist', () => {
	assert.deepEqual(judge('medikament', 'rot', 'fachperson'), {
		ampelRichtig: true,
		schrittRichtig: true,
		ampel: 'rot',
		schritt: 'fachperson',
	});
});

test('a correct light with a wrong check is reported per part', () => {
	const v = judge('zitat', 'gelb', 'selbst');
	assert.equal(v.ampelRichtig, true);
	assert.equal(v.schrittRichtig, false);
});

test('unknown input is rejected', () => {
	assert.throws(() => judge('nichts', 'gruen', 'selbst'));
	assert.throws(() => judge('zitat', 'blau', 'selbst'));
	assert.throws(() => judge('zitat', 'gelb', 'raten'));
});
