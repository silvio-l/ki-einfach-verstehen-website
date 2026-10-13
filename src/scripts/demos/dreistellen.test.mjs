import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { TEXT_KINDS, assess } from './dreistellen.js';

const base = { kind: 'blog', oeffentlich: true, vorbehalt: false, personenbezogen: false, wiederholt: false, trainingAus: false };

test('a public text without a reservation may be copied for text and data mining', () => {
	const r = assess(base);
	assert.match(r.sammeln, /kann greifen/);
});

test('a machine-readable reservation blocks the copy for future use', () => {
	const r = assess({ ...base, vorbehalt: true });
	assert.match(r.sammeln, /wirkt/);
	assert.match(r.modell, /Grundlage/);
});

test('a private poem is outside the exception because it is not publicly accessible', () => {
	const r = assess({ ...base, kind: 'gedicht', oeffentlich: false });
	assert.match(r.sammeln, /nicht öffentlich abrufbar/);
});

test('repetition raises the chance of verbatim output', () => {
	const once = assess(base);
	const often = assess({ ...base, wiederholt: true });
	assert.match(often.modell, /eher ein/);
	assert.match(once.modell, /seltener/);
	assert.match(often.modell, /offen/i);
	assert.match(once.modell, /offen/i);
	assert.match(often.ausgabe, /möglich/);
});

test('a chat with training off is not used for later training, but may be stored', () => {
	const r = assess({ ...base, kind: 'chat', oeffentlich: false, trainingAus: true });
	assert.match(r.sammeln, /nicht in ein späteres Training/);
	assert.match(r.sammeln, /aufbewahren/);
});

test('for a chat the model and output lines do not apply', () => {
	const r = assess({ ...base, kind: 'chat', oeffentlich: false, trainingAus: true });
	assert.match(r.modell, /gilt diese Zeile nicht/);
	assert.match(r.ausgabe, /gilt diese Zeile nicht/);
});

test('a reservation names copies made after it and leaves older copies open', () => {
	const r = assess({ ...base, vorbehalt: true });
	assert.match(r.modell, /nach dem Vorbehalt/);
	assert.match(r.modell, /ältere Kopien/);
});

test('without a copy, the output line leaves the question to the courts', () => {
	const r = assess({ ...base, vorbehalt: true });
	assert.match(r.ausgabe, /klären die Gerichte/);
});

test('personal data adds the objection right and its limit', () => {
	const r = assess({ ...base, personenbezogen: true });
	assert.match(r.datenschutz, /Art\. 21/);
	assert.match(r.datenschutz, /besonderen Situation/);
	assert.match(r.datenschutz, /nicht allgemein geklärt/);
});

test('every text kind has a default for public access', () => {
	assert.deepEqual(Object.keys(TEXT_KINDS), ['blog', 'lied', 'gedicht', 'foto', 'chat']);
});

test('en: a public text without a reservation may be copied for text and data mining', () => {
	const r = assess(base, 'en');
	assert.match(r.sammeln, /may apply/);
	assert.match(r.sammeln, /not ruled out|publicly accessible/);
});

test('en: a machine-readable reservation takes effect and leaves older copies open', () => {
	const r = assess({ ...base, vorbehalt: true }, 'en');
	assert.match(r.sammeln, /takes effect/);
	assert.match(r.modell, /Copies made after the reservation lack a basis/);
	assert.match(r.modell, /Whether older copies are covered is open/);
	assert.match(r.ausgabe, /decided by the courts/);
});

test('en: a chat with training off is not used for later training, but may be stored', () => {
	const r = assess({ ...base, kind: 'chat', oeffentlich: false, trainingAus: true }, 'en');
	assert.match(r.sammeln, /does not flow into later training/);
	assert.match(r.sammeln, /keep the conversation/);
	assert.match(r.modell, /does not apply to your own chat/);
	assert.match(r.ausgabe, /does not apply to your own chat/);
});

test('en: personal data adds the objection right and its limit', () => {
	const r = assess({ ...base, personenbezogen: true }, 'en');
	assert.match(r.datenschutz, /Art\. 21\(1\) GDPR/);
	assert.match(r.datenschutz, /particular situation/);
	assert.match(r.datenschutz, /not generally settled/);
});

test('en: repetition raises the chance of verbatim output', () => {
	const often = assess({ ...base, wiederholt: true }, 'en');
	assert.match(often.modell, /more likely to be memorized/);
	assert.match(often.ausgabe, /possible/);
});

test('lang defaults to German and an unknown language falls back to German', () => {
	assert.deepEqual(assess(base), assess(base, 'de'));
	assert.deepEqual(assess(base, 'fr'), assess(base, 'de'));
});
