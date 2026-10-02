import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { NEGATIVE_VOTE, helpOffers } from './feedback-help.js';

test('a positive vote never reveals help', () => {
	assert.deepEqual(helpOffers({ vote: 'hilfreich', hasExplain: true, hasCommunity: true }), {
		show: false,
		explain: false,
		community: false,
	});
});

test('a missing or unknown vote never reveals help', () => {
	for (const vote of [null, undefined, '', 'Not really']) {
		assert.equal(helpOffers({ vote, hasExplain: true, hasCommunity: true }).show, false);
	}
});

test('a negative vote offers both when both are on the page', () => {
	assert.deepEqual(helpOffers({ vote: NEGATIVE_VOTE, hasExplain: true, hasCommunity: true }), {
		show: true,
		explain: true,
		community: true,
	});
});

test('a negative vote offers only what the page actually carries', () => {
	assert.deepEqual(helpOffers({ vote: NEGATIVE_VOTE, hasExplain: true, hasCommunity: false }), {
		show: true,
		explain: true,
		community: false,
	});
	assert.deepEqual(helpOffers({ vote: NEGATIVE_VOTE, hasExplain: false, hasCommunity: true }), {
		show: true,
		explain: false,
		community: true,
	});
});

test('a negative vote with nothing to offer reveals nothing', () => {
	assert.deepEqual(helpOffers({ vote: NEGATIVE_VOTE, hasExplain: false, hasCommunity: false }), {
		show: false,
		explain: false,
		community: false,
	});
});
