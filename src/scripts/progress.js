// Client-side reading-progress tracking. No account, no backend — per
// ADR-0001 (client-side interactivity, no backend) this stays localStorage
// only; a cross-device account system is a separate, explicitly deferred
// decision (see docs/chatverlauf.md).
//
// The stored keys are `translationKey`s (language-independent), so progress
// survives switching between /de/ and /en/ — both variants of a Baustein
// count as the same read.
const STORAGE_KEY = 'kev:read-bausteine';

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
