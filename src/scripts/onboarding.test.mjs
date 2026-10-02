import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import vm from 'node:vm';
import {
	FIRST_VISIT_ATTR,
	FIRST_VISIT_HEAD_SCRIPT,
	ONBOARDING_DISMISS_KEY,
	SUPPORT_BLOCK_MIN_READ,
	SUPPORT_NUDGE_MIN_READ,
	TOUR_STEP_IDS,
	anchorFillsViewport,
	createTour,
	placeCallout,
	planTour,
	readFlag,
	shouldStartTour,
	showOnboarding,
	showSupportBlock,
	showSupportNudge,
	tourForced,
	writeFlag,
} from './onboarding.js';

function fakeStorage(initial = {}) {
	const map = new Map(Object.entries(initial));
	return {
		getItem: (k) => (map.has(k) ? map.get(k) : null),
		setItem: (k, v) => map.set(k, String(v)),
	};
}

test('flags: missing storage or a throwing storage read as "not set"', () => {
	assert.equal(readFlag(ONBOARDING_DISMISS_KEY, undefined), false);
	const broken = {
		getItem() {
			throw new Error('blocked');
		},
		setItem() {
			throw new Error('blocked');
		},
	};
	assert.equal(readFlag(ONBOARDING_DISMISS_KEY, broken), false);
	assert.doesNotThrow(() => writeFlag(ONBOARDING_DISMISS_KEY, broken));
});

test('flags: writing then reading round-trips, any stored value counts as set', () => {
	const storage = fakeStorage();
	assert.equal(readFlag('kev:x', storage), false);
	writeFlag('kev:x', storage);
	assert.equal(readFlag('kev:x', storage), true);
	assert.equal(readFlag('kev:y', fakeStorage({ 'kev:y': '' })), true);
});

test('onboarding shows only for an empty read set that was not dismissed', () => {
	assert.equal(showOnboarding({ readCount: 0, dismissed: false }), true);
	assert.equal(showOnboarding({ readCount: 0, dismissed: true }), false);
	assert.equal(showOnboarding({ readCount: 1, dismissed: false }), false);
});

test('the tour starts exactly while its done-flag is absent, or when asked for again', () => {
	assert.equal(shouldStartTour({ tourDone: false }), true);
	assert.equal(shouldStartTour({ tourDone: true }), false);
	assert.equal(shouldStartTour({ tourDone: true, forced: true }), true);
});

test('tourForced reads only ?tour=1', () => {
	assert.equal(tourForced('?tour=1'), true);
	assert.equal(tourForced('?lang=de&tour=1'), true);
	assert.equal(tourForced('?tour=0'), false);
	assert.equal(tourForced(''), false);
});

test('support block upgrades from two read Bausteine, nudge from eight unless dismissed', () => {
	assert.equal(showSupportBlock({ readCount: SUPPORT_BLOCK_MIN_READ - 1 }), false);
	assert.equal(showSupportBlock({ readCount: SUPPORT_BLOCK_MIN_READ }), true);
	assert.equal(showSupportNudge({ readCount: SUPPORT_NUDGE_MIN_READ - 1, dismissed: false }), false);
	assert.equal(showSupportNudge({ readCount: SUPPORT_NUDGE_MIN_READ, dismissed: false }), true);
	assert.equal(showSupportNudge({ readCount: 16, dismissed: true }), false);
});

test('planTour keeps the walking order and drops steps without an anchor', () => {
	assert.deepEqual(planTour({ explain: true, actions: true, quiz: true, community: true }), TOUR_STEP_IDS);
	assert.deepEqual(planTour({ community: true, quiz: false, explain: true, actions: true }), ['explain', 'actions', 'community']);
	assert.deepEqual(planTour({}), []);
	assert.deepEqual(planTour({ unknown: true }), []);
});

test('createTour walks every step, flags the last one and ends as completed', () => {
	const tour = createTour(['explain', 'actions', 'quiz']);
	assert.equal(tour.total, 3);
	assert.equal(tour.index, 0);
	assert.equal(tour.current, 'explain');
	assert.equal(tour.isLast, false);
	assert.equal(tour.finished, false);
	assert.equal(tour.next(), 'actions');
	assert.equal(tour.next(), 'quiz');
	assert.equal(tour.isLast, true);
	assert.equal(tour.next(), null);
	assert.equal(tour.finished, true);
	assert.equal(tour.reason, 'completed');
	assert.equal(tour.current, null);
	assert.equal(tour.next(), null, 'stays finished');
});

test('createTour: skip ends the tour at once and keeps the first reason', () => {
	const tour = createTour(['explain', 'actions']);
	assert.equal(tour.skip(), null);
	assert.equal(tour.finished, true);
	assert.equal(tour.reason, 'skipped');
	assert.equal(tour.current, null);
	tour.next();
	assert.equal(tour.reason, 'skipped');
});

test('createTour with no steps is finished from the start', () => {
	const tour = createTour([]);
	assert.equal(tour.current, null);
	assert.equal(tour.finished, true);
	assert.equal(tour.reason, 'empty');
	assert.equal(tour.isLast, false);
});

test('placeCallout prefers below the anchor and clamps into the viewport', () => {
	const viewport = { width: 1440, height: 900 };
	const callout = { width: 320, height: 160 };
	const below = placeCallout({ anchor: { top: 100, bottom: 132, left: 200 }, callout, viewport });
	assert.deepEqual(below, { top: 144, left: 200, side: 'below' });

	const above = placeCallout({ anchor: { top: 800, bottom: 832, left: 200 }, callout, viewport });
	assert.equal(above.side, 'above');
	assert.equal(above.top, 800 - 160 - 12);

	const right = placeCallout({ anchor: { top: 100, bottom: 132, left: 1400 }, callout, viewport });
	assert.equal(right.left, 1440 - 320 - 12);
	const left = placeCallout({ anchor: { top: 100, bottom: 132, left: -40 }, callout, viewport });
	assert.equal(left.left, 12);
});

test('placeCallout never sits under the sticky nav and survives a 360px viewport', () => {
	const viewport = { width: 360, height: 640 };
	const callout = { width: 336, height: 200 };
	const nav = placeCallout({ anchor: { top: 70, bottom: 100, left: 300 }, callout, viewport, navHeight: 64 });
	assert.equal(nav.left, 12);
	assert.equal(nav.top, 112);
	const tight = placeCallout({ anchor: { top: 500, bottom: 530, left: 0 }, callout, viewport, navHeight: 64 });
	assert.equal(tight.side, 'above');
	assert.equal(tight.top, 500 - 200 - 12);
	// Anchor near the top where "above" would run under the nav, and below
	// does not fit either: the callout sits at the bottom edge, inside the anchor.
	const huge = placeCallout({ anchor: { top: 20, bottom: 630, left: 0 }, callout, viewport, navHeight: 64 });
	assert.equal(huge.side, 'inside');
	assert.equal(huge.top, 640 - 200 - 12);
	assert.ok(huge.top >= 76);
});

test('anchorFillsViewport flags anchors that leave no room for the callout', () => {
	assert.equal(anchorFillsViewport({ anchorHeight: 120, calloutHeight: 300, viewportHeight: 900, navHeight: 64 }), false);
	assert.equal(anchorFillsViewport({ anchorHeight: 600, calloutHeight: 300, viewportHeight: 900, navHeight: 64 }), true);
	assert.equal(anchorFillsViewport({ anchorHeight: 500, calloutHeight: 300, viewportHeight: 740, navHeight: 64 }), true);
});

function runFirstVisitHead(storage) {
	const attrs = {};
	const context = {
		window: { localStorage: storage },
		document: { documentElement: { setAttribute: (k, v) => (attrs[k] = v) } },
	};
	vm.runInNewContext(FIRST_VISIT_HEAD_SCRIPT, context);
	return FIRST_VISIT_ATTR in attrs;
}

test('first-visit hint: only for readers with nothing read and no dismissal', () => {
	assert.equal(runFirstVisitHead(fakeStorage()), true);
	assert.equal(runFirstVisitHead(fakeStorage({ 'kev:read-bausteine': '[]' })), true);
	assert.equal(runFirstVisitHead(fakeStorage({ [ONBOARDING_DISMISS_KEY]: '1' })), false);
	assert.equal(runFirstVisitHead(fakeStorage({ 'kev:read-bausteine': '["a"]' })), false);
});

test('first-visit hint: unreadable or corrupt storage shows nothing', () => {
	const broken = {
		getItem() {
			throw new Error('blocked');
		},
	};
	assert.equal(runFirstVisitHead(broken), false);
	assert.equal(runFirstVisitHead(undefined), false);
	assert.equal(runFirstVisitHead(fakeStorage({ 'kev:read-bausteine': '{' })), false);
});
