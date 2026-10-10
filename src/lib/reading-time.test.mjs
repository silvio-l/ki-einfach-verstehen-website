import assert from 'node:assert/strict';
import test from 'node:test';

import { readingMinutes, readingWords } from './reading-time.mjs';

const words = (n) => Array.from({ length: n }, () => 'Wort').join(' ');

test('figures, imports, tags and exercises do not count', () => {
	const body = [
		"import Figure from '../../../components/Figure.astro';",
		'## Titel',
		`${words(10)} [Link](/de/glossar/token) **fett**.`,
		`<Figure kind="diagram" caption="${words(30)}">\n<img src="/a.svg" alt="${words(30)}" />\n</Figure>`,
		`<Uebung>\n\n${words(50)}\n\n</Uebung>`,
		'| a | b |\n|---|---|',
	].join('\n\n');
	assert.equal(readingWords(body), 12);
});

test('the quiz counts: question, options and explanation', () => {
	const quiz = [{ frage: 'Eins zwei?', optionen: ['drei', 'vier fünf'], erklaerung: 'sechs' }];
	assert.equal(readingWords('Text hier.', quiz), 8);
});

test('minutes at 200 words per minute, at least 1', () => {
	assert.equal(readingMinutes(words(3000)), 15);
	assert.equal(readingMinutes(words(3099)), 15);
	assert.equal(readingMinutes('kurz'), 1);
});
