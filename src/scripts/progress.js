// Client-side reading-progress tracking. No account, no backend — per
// ADR-0001 (client-side interactivity, no backend) this stays localStorage
// only; a cross-device account system is a separate, explicitly deferred
// decision (see docs/chatverlauf.md).
//
// The stored keys are `translationKey`s (language-independent), so progress
// survives switching between /de/ and /en/ — both variants of a Baustein
// count as the same read.
//
// The read set is the legacy projection of the progress document
// (ADR-0025, progress-store.js): readers keep using it, every write is
// folded into the document right after.
import { LEGACY_READ_KEY, trySyncFromLegacy } from './progress-store.js';

export const STORAGE_KEY = LEGACY_READ_KEY;

export function getReadSet() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return new Set(raw ? JSON.parse(raw) : []);
	} catch {
		return new Set();
	}
}

export function markRead(translationKey) {
	try {
		const set = getReadSet();
		set.add(translationKey);
		localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
		trySyncFromLegacy();
	} catch {
		// localStorage unavailable (private mode, quota) — reading still works, just unremembered.
	}
}

// `published` is an ordered array of { tk, href, ... } in roadmap order (see
// src/data/published.ts). Returns the first not-yet-read published Baustein,
// or null if everything published is read.
export function getNextUnread(published) {
	const read = getReadSet();
	return published.find((p) => !read.has(p.tk)) ?? null;
}

// The homepage spotlight ("Fang hier an"): the first published Baustein
// until it is read, then the next unread one, and nothing once every
// published Baustein is read. `items` is in roadmap order, `read` a Set of
// translation keys (getReadSet()). Returns { item, first } or null.
export function spotlightTarget(items, read) {
	if (items.length === 0) return null;
	if (!read.has(items[0].tk)) return { item: items[0], first: true };
	const next = items.find((i) => !read.has(i.tk));
	return next ? { item: next, first: false } : null;
}
