import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withTrailingSlash } from './rehype-trailing-slash.mjs';

test('adds the slash to internal page links', () => {
	assert.equal(withTrailingSlash('/de/glossar/tokenizer'), '/de/glossar/tokenizer/');
	assert.equal(withTrailingSlash('/en/lessons/input-and-output#quiz'), '/en/lessons/input-and-output/#quiz');
	assert.equal(withTrailingSlash('/de'), '/de/');
});

test('leaves canonical, file, external and other links alone', () => {
	for (const href of ['/de/glossar/', '/de/#themenbereiche', '/de/bausteine/x.md', '/bausteine/a.webp', 'https://example.com/de/x', '#anchor', '/denkfehler']) {
		assert.equal(withTrailingSlash(href), href);
	}
});
