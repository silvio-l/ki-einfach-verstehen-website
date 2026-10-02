// First-visit onboarding, the guided tour in the first Baustein and the
// support placements share one set of decisions: which localStorage flags
// exist, when a block shows, and how the tour walks its steps. All of it is
// pure and DOM-free so it can be unit-tested; the components
// (Onboarding.astro, FirstVisitHint.astro, GuidedTour.astro,
// GithubStarCta.astro, Lernstand.astro) only read the DOM and call in here. Storage stays localStorage-only per
// ADR-0001 -- there is no account and nothing leaves the browser.

import { STORAGE_KEY as READ_KEY } from './progress.js';

/**
 * One "this reader knows the site" flag for every first-visit surface: the
 * start-page block (Onboarding.astro) and the hint bar on every other entry
 * page (FirstVisitHint.astro). Written by either dismiss button, by a click
 * on one of the hint's links and by a visit to the "So funktioniert's" page.
 */
export const ONBOARDING_DISMISS_KEY = 'kev:onboarding-dismissed';
export const TOUR_DONE_KEY = 'kev:tour-done';
export const SUPPORT_NUDGE_DISMISS_KEY = 'kev:support-nudge-dismissed';

/** The end-of-Baustein support block upgrades from the plain star CTA here. */
export const SUPPORT_BLOCK_MIN_READ = 2;
/** The Lernstand dock shows its one-line support nudge from here on. */
export const SUPPORT_NUDGE_MIN_READ = 8;

/**
 * Boolean flag in localStorage. Any value counts as set; a missing or
 * unreadable storage reads as "not set", so every block falls back to its
 * safe default (onboarding hidden, tour not started, nudge hidden).
 */
export function readFlag(key, storage = globalThis.localStorage) {
	try {
		const value = storage?.getItem(key);
		return value !== null && value !== undefined;
	} catch {
		return false;
	}
}

export function writeFlag(key, storage = globalThis.localStorage) {
	try {
		storage?.setItem(key, '1');
	} catch {
		// localStorage unavailable (private mode, quota) -- the block will show again next time, nothing breaks.
	}
}

/** First-visit block on the start page: nothing read yet and not dismissed. */
export function showOnboarding({ readCount, dismissed }) {
	return readCount === 0 && !dismissed;
}

/** Attribute the head script sets on <html> while the first-visit hint applies. */
export const FIRST_VISIT_ATTR = 'data-first-visit';

/**
 * Inline <head> script (PageShell) that decides the first-visit hint before
 * the first paint, so revealing the in-flow bar never shifts the layout:
 * it sets FIRST_VISIT_ATTR on <html> when nothing has been read yet and the
 * onboarding flag is not set. Unreadable storage means "no hint" -- a
 * dismissal could not be remembered there, so the bar would nag on every
 * page. Self-contained ES5, like display-prefs.mjs HEAD_SCRIPT.
 */
export const FIRST_VISIT_HEAD_SCRIPT = `(function () {
	try {
		var s = window.localStorage;
		if (!s || s.getItem('${ONBOARDING_DISMISS_KEY}') !== null) return;
		var raw = s.getItem('${READ_KEY}');
		var read = raw ? JSON.parse(raw) : [];
		if (read && read.length > 0) return;
		document.documentElement.setAttribute('${FIRST_VISIT_ATTR}', '');
	} catch (e) {}
})();`;

/**
 * The guided tour runs once; the flag is written the moment it starts. A
 * reader can ask for it again ("So funktioniert's" links the first Baustein
 * with ?tour=1): `forced` then wins over the done-flag.
 */
export function shouldStartTour({ tourDone, forced = false }) {
	return forced || !tourDone;
}

/** The query parameter that re-runs the tour (TOUR_RESTART_HREF builds the link). */
export const TOUR_RESTART_PARAM = 'tour';

/** True when the URL asks for the tour explicitly. */
export function tourForced(search) {
	return new URLSearchParams(search).get(TOUR_RESTART_PARAM) === '1';
}

export function showSupportBlock({ readCount }) {
	return readCount >= SUPPORT_BLOCK_MIN_READ;
}

export function showSupportNudge({ readCount, dismissed }) {
	return readCount >= SUPPORT_NUDGE_MIN_READ && !dismissed;
}

/** Tour steps in walking order; each one is anchored to a page element. */
export const TOUR_STEP_IDS = ['explain', 'actions', 'quiz', 'community'];

/**
 * Keeps only the steps whose anchor exists on this page, in walking order.
 * The community step is absent until the forum is live, the quiz step when a
 * Baustein ships without questions.
 * @param {Record<string, boolean>} available step id -> anchor present
 */
export function planTour(available) {
	return TOUR_STEP_IDS.filter((id) => Boolean(available[id]));
}

/**
 * Minimal step machine over a planned step list. `next()` returns the step
 * that is now current, or null once the tour is over; `skip()` ends it at
 * once. `reason` records how it ended for the analytics event.
 * @param {string[]} stepIds
 */
export function createTour(stepIds) {
	const steps = [...stepIds];
	let index = steps.length > 0 ? 0 : -1;
	let reason = steps.length > 0 ? null : 'empty';

	return {
		get total() {
			return steps.length;
		},
		get index() {
			return index;
		},
		get current() {
			return index >= 0 && index < steps.length ? steps[index] : null;
		},
		get isLast() {
			return index >= 0 && index === steps.length - 1;
		},
		get finished() {
			return reason !== null;
		},
		get reason() {
			return reason;
		},
		next() {
			if (reason !== null) return null;
			if (index >= steps.length - 1) {
				index = steps.length;
				reason = 'completed';
				return null;
			}
			index += 1;
			return steps[index];
		},
		skip() {
			if (reason === null) reason = 'skipped';
			index = steps.length;
			return null;
		},
	};
}

/**
 * Viewport placement for a fixed-position callout next to its anchor: below
 * the anchor when it fits, else above it, and always inside the viewport
 * with a margin. An anchor that fills the viewport (a whole quiz section)
 * leaves no side: the callout then sits at the bottom edge, `inside` the
 * anchor, so the anchor's heading stays readable above it. Pure so the
 * clamping can be tested without a browser.
 * @param {{ anchor: {top:number,bottom:number,left:number}, callout: {width:number,height:number}, viewport: {width:number,height:number}, margin?: number, navHeight?: number }} input
 */
export function placeCallout({ anchor, callout, viewport, margin = 12, navHeight = 0 }) {
	const minTop = navHeight + margin;
	const maxTop = Math.max(minTop, viewport.height - callout.height - margin);
	const maxLeft = Math.max(margin, viewport.width - callout.width - margin);
	const left = Math.min(Math.max(anchor.left, margin), maxLeft);
	const below = anchor.bottom + margin;
	const above = anchor.top - callout.height - margin;
	if (below + callout.height + margin <= viewport.height) {
		return { top: Math.min(Math.max(below, minTop), maxTop), left, side: 'below' };
	}
	if (above >= minTop) {
		return { top: Math.min(above, maxTop), left, side: 'above' };
	}
	return { top: maxTop, left, side: 'inside' };
}

/**
 * Whether an anchor is too tall to be centred with a callout beside it; the
 * tour then scrolls its top edge under the nav instead.
 */
export function anchorFillsViewport({ anchorHeight, calloutHeight, viewportHeight, navHeight = 0, margin = 12 }) {
	return anchorHeight + calloutHeight + 2 * margin > viewportHeight - navHeight;
}
