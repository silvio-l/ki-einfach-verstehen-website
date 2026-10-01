import { test } from 'node:test';
import assert from 'node:assert/strict';
import { backlinkTitleErrors } from './glossary-backlinks.mjs';

const titles = new Map([['input-und-output', 'Input und Output: Was eine Funktion tut']]);

test('accepts a back-reference whose link text is the current title, quoted or not', () => {
	for (const text of ['Input und Output: Was eine Funktion tut', '„Input und Output: Was eine Funktion tut“', '"Input und Output: Was eine Funktion tut"'])
		assert.deepEqual(backlinkTitleErrors(`Definition.\n\nEingeführt in [${text}](/de/bausteine/input-und-output).`, 'de', titles), []);
});

test('flags a back-reference that still carries an old Baustein title', () => {
	const body = 'Definition.\n\nAusführlicher erklärt in [Input und Output: Wie eine Funktion „denkt“](/de/bausteine/input-und-output).';
	assert.deepEqual(backlinkTitleErrors(body, 'de', titles), [
		'link text "Input und Output: Wie eine Funktion „denkt“" is not the title of "input-und-output" ("Input und Output: Was eine Funktion tut")',
	]);
});

test('only the closing back-reference paragraph is checked; inline prose links may use any wording', () => {
	const body = 'Mehr dazu im [Baustein über Funktionen](/de/bausteine/input-und-output).\n\nEingeführt in [Input und Output: Was eine Funktion tut](/de/bausteine/input-und-output).';
	assert.deepEqual(backlinkTitleErrors(body, 'de', titles), []);
});

test('English entries check /en/lessons links; unknown slugs are left to the broken-link check', () => {
	const en = new Map([['input-and-output', 'Input and Output: What a Function Does']]);
	assert.equal(backlinkTitleErrors('X.\n\nExplained in more depth in [Input and Output: How a Function "Thinks"](/en/lessons/input-and-output).', 'en', en).length, 1);
	assert.deepEqual(backlinkTitleErrors('X.\n\nSee [Whatever](/en/lessons/unknown).', 'en', en), []);
});
