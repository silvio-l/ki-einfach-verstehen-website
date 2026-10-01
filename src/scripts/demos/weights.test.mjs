import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { FILTER, equation, score, segments } from './weights.js';

test('the two mails of the Baustein score as printed', () => {
	const { words, threshold, mails } = FILTER.de;
	assert.deepEqual(score(mails[0], words, threshold), { hits: [words[1], words[0]], sum: 5, spam: true });
	assert.equal(score(mails[1], words, threshold).sum, 1);
	assert.equal(score(mails[1], words, threshold).spam, false);
	assert.equal(score('Rechnung für unser Treffen', words, threshold).sum, -2);
});

test('a sum equal to the threshold stays in the inbox', () => {
	const { words } = FILTER.de;
	assert.equal(score('Gewinn', words, 3).spam, false);
	assert.equal(score('Gewinn', words, 2).spam, true);
});

test('matching ignores case and keeps the rest of the subject', () => {
	assert.deepEqual(segments('Pokal-Gewinn: Feier'), ['Pokal', '-', 'Gewinn', ': ', 'Feier']);
	assert.equal(score('GEWINN gratis', FILTER.de.words, 2).sum, 5);
});

test('the equation reads like the text', () => {
	const { words, mails } = FILTER.de;
	assert.equal(equation(score(mails[0], words, 2).hits), '2 + 3 = 5');
	assert.equal(equation(score(mails[1], words, 2).hits), '3 − 2 = 1');
	assert.equal(equation([{ weight: -2 }, { weight: -1 }]), '−2 − 1 = −3');
	assert.equal(equation([]), '');
});
