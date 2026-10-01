import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { BRAND_SUFFIX, MAX_TITLE_LENGTH, contentPageTitle } from './page-title.mjs';

test('Baustein: brand suffix while it fits, bare title once it would be cut off', () => {
	assert.equal(contentPageTitle('Input und Output: Was eine Funktion tut', 'bausteine', 'de'), `Input und Output: Was eine Funktion tut${BRAND_SUFFIX}`);
	const long = 'Programm, Algorithmus, Modell im Vergleich!'; // 43 chars: suffix would exceed 65
	assert.equal(contentPageTitle(long, 'bausteine', 'de'), long);
});

test('glossary entry: says what the page offers, per language', () => {
	assert.equal(contentPageTitle('Token', 'glossar', 'de'), `Token: Definition und Beispiel${BRAND_SUFFIX}`);
	assert.equal(contentPageTitle('Token', 'glossar', 'en'), `Token: Definition and Example${BRAND_SUFFIX}`);
});

test('glossary entry: falls back to the plain rule when the qualifier would not fit', () => {
	// 19 + 25 + 23 = 67 > 65
	assert.equal(contentPageTitle('Maschinelles Lernen', 'glossar', 'de'), `Maschinelles Lernen${BRAND_SUFFIX}`);
});

test('no result ever exceeds the limit unless the bare title itself does', () => {
	for (const len of [1, 10, 20, 30, 42, 43, 60, 80]) {
		const title = 'x'.repeat(len);
		for (const kind of ['bausteine', 'glossar'])
			for (const lang of ['de', 'en']) {
				const out = contentPageTitle(title, kind, lang);
				assert.ok(out.length <= Math.max(MAX_TITLE_LENGTH, len), `${kind}/${lang}/${len}: ${out.length}`);
				assert.ok(out.startsWith(title));
			}
	}
});
