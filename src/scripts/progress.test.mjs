import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { spotlightTarget } from './progress.js';

const items = [{ tk: 'a' }, { tk: 'b' }, { tk: 'c' }];

test('the spotlight starts with the first Baustein', () => {
	assert.deepEqual(spotlightTarget(items, new Set()), { item: items[0], first: true });
});

test('once the first is read, it shows the next unread one in roadmap order', () => {
	assert.deepEqual(spotlightTarget(items, new Set(['a'])), { item: items[1], first: false });
	assert.deepEqual(spotlightTarget(items, new Set(['a', 'b'])), { item: items[2], first: false });
	assert.deepEqual(spotlightTarget(items, new Set(['a', 'c'])), { item: items[1], first: false }, 'gaps are filled first');
});

test('the first stays the target while it is unread, even if later ones are read', () => {
	assert.deepEqual(spotlightTarget(items, new Set(['b', 'c'])), { item: items[0], first: true });
});

test('everything read, or nothing published: no spotlight', () => {
	assert.equal(spotlightTarget(items, new Set(['a', 'b', 'c'])), null);
	assert.equal(spotlightTarget([], new Set()), null);
});
