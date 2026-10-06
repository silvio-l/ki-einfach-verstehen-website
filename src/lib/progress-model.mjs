// The learning-progress document (ADR-0025): one versioned, language-
// independent record of what a learner has done, shared by every place that
// stores or moves progress -- the browser (src/scripts/progress-store.js),
// the transfer code (progress-code.mjs) and, later, the opt-in sync with the
// forum account. Pure functions only: no storage, no DOM, no clock unless
// passed in, so the later server can reuse this module unchanged.
//
// Shape (version 1):
//   {
//     v: 1,
//     read: { [translationKey]: { at } | { at, del: true } },
//     quiz: { ['<translationKey>:<questionId>']: { at, level, attempts, correct, due } | { at, del: true } },
//     name: { at, value } | { at, del: true } | null,
//   }
// `at` is a Unix timestamp in milliseconds: when the entry was written. An
// entry with `del: true` is a tombstone -- "progress was reset here" -- and
// competes with live entries like any other write: the newer one wins.
//
// Merge is a per-entry last-writer-wins register, a state-based CRDT:
// commutative, associative and idempotent (progress-model.test.mjs proves
// it with randomised property tests), so two devices -- or a device and a
// server -- converge no matter in which order they exchange documents.

export const PROGRESS_VERSION = 1;

/** Baustein translationKeys and Abrufmoment question ids (content.config.ts, ADR-0022). */
export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const LIMITS = Object.freeze({
	/** Per id; translationKeys and question ids are short kebab-case slugs. */
	maxIdLength: 80,
	/** Far above the roadmap (~100 Bausteine); only ever reached by garbage. */
	maxRead: 1000,
	/** Far above ~100 Bausteine x ~10 questions. */
	maxQuiz: 10000,
	/** The Lernnachweis name field has maxlength 80. */
	maxNameLength: 80,
	/** Clock skew tolerated before a timestamp counts as "from the future". */
	futureSkewMs: 5 * 60 * 1000,
	/** Sanity floor: older timestamps are garbage, not a wrong-but-real clock. */
	minTimestamp: Date.UTC(2000, 0, 1),
	/** Upper bound for a review interval (quiz-progress.js uses at most 60 days). */
	maxDueOffsetMs: 366 * 24 * 60 * 60 * 1000,
	/** quiz-progress.js CORRECT_INTERVAL_DAYS has 5 levels. */
	maxLevel: 5,
	maxAttempts: 1_000_000,
});

export class ProgressError extends Error {
	/**
	 * @param {'invalid' | 'version'} reason
	 * @param {string} message
	 */
	constructor(reason, message) {
		super(message);
		this.name = 'ProgressError';
		this.reason = reason;
	}
}

export function emptyProgress() {
	return { v: PROGRESS_VERSION, read: {}, quiz: {}, name: null };
}

export function quizKey(translationKey, questionId) {
	return `${translationKey}:${questionId}`;
}

/** Splits a quiz key; null when it is not `<id>:<id>`. */
export function splitQuizKey(key) {
	const parts = typeof key === 'string' ? key.split(':') : [];
	if (parts.length !== 2 || !isId(parts[0]) || !isId(parts[1])) return null;
	return { tk: parts[0], qid: parts[1] };
}

function isId(value) {
	return typeof value === 'string' && value.length > 0 && value.length <= LIMITS.maxIdLength && ID_PATTERN.test(value);
}

export function isLive(entry) {
	return Boolean(entry) && entry.del !== true;
}

// ——— Last-writer-wins ———

/**
 * Canonical text of a normalised entry, used only to break ties between two
 * different entries with the same timestamp. Fixed field order, so it does
 * not depend on how the object was built.
 */
function canonical(entry) {
	if (entry.del === true) return `d|${entry.at}`;
	if ('value' in entry) return `n|${entry.at}|${entry.value}`;
	if ('level' in entry) return `q|${entry.at}|${entry.level}|${entry.attempts}|${entry.correct ? 1 : 0}|${entry.due}`;
	return `r|${entry.at}`;
}

/**
 * The winner of two entries for the same key: the newer `at` wins; on a tie a
 * tombstone beats a live entry (a reset is the more deliberate act), and any
 * remaining tie is broken by the canonical text. That makes the choice a
 * maximum over a total order -- the reason merge is a CRDT.
 */
export function pickNewer(a, b) {
	if (!a) return b ?? null;
	if (!b) return a;
	if (a.at !== b.at) return a.at > b.at ? a : b;
	const aDel = a.del === true;
	const bDel = b.del === true;
	if (aDel !== bDel) return aDel ? a : b;
	return canonical(a) >= canonical(b) ? a : b;
}

function mergeMap(a, b) {
	const out = {};
	const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
	for (const key of [...keys].sort()) out[key] = pickNewer(a[key], b[key]);
	return out;
}

/**
 * Merges two normalised documents. Never drops a key, never invents one:
 * the result holds, per key, the newer of the two entries. Size limits are
 * deliberately not applied here (capping would break associativity); they
 * are enforced where untrusted data comes in, in normalizeProgress().
 */
export function mergeProgress(a, b) {
	return {
		v: PROGRESS_VERSION,
		read: mergeMap(a.read, b.read),
		quiz: mergeMap(a.quiz, b.quiz),
		name: pickNewer(a.name, b.name),
	};
}

/** True when both documents hold exactly the same entries. */
export function sameProgress(a, b) {
	return serializeProgress(a) === serializeProgress(b);
}

/** Deterministic JSON (sorted keys) -- for storage, comparison and ETags. */
export function serializeProgress(doc) {
	const sortMap = (map) => Object.fromEntries(Object.keys(map).sort().map((k) => [k, map[k]]));
	return JSON.stringify({ v: doc.v, read: sortMap(doc.read), quiz: sortMap(doc.quiz), name: doc.name ?? null });
}

// ——— Reset ———

/**
 * Tombstones every entry. Each tombstone is at least 1 ms newer than the
 * entry it replaces, so the reset wins locally even when an entry carries a
 * timestamp slightly ahead of this device's clock.
 */
export function resetProgress(doc, now) {
	const tomb = (entry) => ({ at: Math.max(now, entry.at + 1), del: true });
	const tombMap = (map) => Object.fromEntries(Object.entries(map).map(([k, e]) => [k, e.del === true ? e : tomb(e)]));
	return {
		v: PROGRESS_VERSION,
		read: tombMap(doc.read),
		quiz: tombMap(doc.quiz),
		name: doc.name && doc.name.del !== true ? tomb(doc.name) : doc.name ?? null,
	};
}

// ——— Summaries for the UI ———

/** Counts of live entries. */
export function summarizeProgress(doc) {
	const count = (map) => Object.values(map).filter(isLive).length;
	return {
		read: count(doc.read),
		quiz: count(doc.quiz),
		hasName: isLive(doc.name),
		empty: count(doc.read) === 0 && count(doc.quiz) === 0 && !isLive(doc.name),
	};
}

/**
 * What merging `incoming` into `local` would change on this device:
 * entries that become live or change (`added*`), live entries an incoming
 * tombstone removes (`removed*`), and incoming live entries that lose
 * against a newer local reset (`shadowed`). Drives the import preview.
 */
export function previewMerge(local, incoming) {
	const merged = mergeProgress(local, incoming);
	const diff = (before, after) => {
		let added = 0;
		let removed = 0;
		for (const key of Object.keys(after)) {
			const was = before[key];
			const now = after[key];
			if (isLive(now) && (!was || canonical(was) !== canonical(now))) added += 1;
			else if (!isLive(now) && isLive(was)) removed += 1;
		}
		return { added, removed };
	};
	const read = diff(local.read, merged.read);
	const quiz = diff(local.quiz, merged.quiz);
	const shadow = (from, after) => Object.keys(from).filter((k) => isLive(from[k]) && !isLive(after[k])).length;
	return {
		merged,
		incoming: summarizeProgress(incoming),
		addedRead: read.added,
		removedRead: read.removed,
		addedQuiz: quiz.added,
		removedQuiz: quiz.removed,
		shadowed: shadow(incoming.read, merged.read) + shadow(incoming.quiz, merged.quiz),
		changes: read.added + read.removed + quiz.added + quiz.removed + (sameName(local.name, merged.name) ? 0 : 1),
	};
}

function sameName(a, b) {
	if (!a || !b) return a === b;
	return canonical(a) === canonical(b);
}

// ——— Validation: the one rule set for every ingress (browser and server) ———

function timestamp(value, now) {
	if (typeof value !== 'number' || !Number.isFinite(value)) return null;
	const t = Math.floor(value);
	if (t < LIMITS.minTimestamp) return null;
	// From the future: a wrong clock on the writing device. Clamp instead of
	// dropping -- the entry is real, only its time is not trustworthy.
	return t > now + LIMITS.futureSkewMs ? now : t;
}

function intIn(value, min, max) {
	return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function normalizeRead(entry, now) {
	if (!entry || typeof entry !== 'object') return null;
	const at = timestamp(entry.at, now);
	if (at === null) return null;
	return entry.del === true ? { at, del: true } : { at };
}

function normalizeQuiz(entry, now) {
	if (!entry || typeof entry !== 'object') return null;
	const at = timestamp(entry.at, now);
	if (at === null) return null;
	if (entry.del === true) return { at, del: true };
	if (!intIn(entry.level, 0, LIMITS.maxLevel)) return null;
	if (!intIn(entry.attempts, 1, LIMITS.maxAttempts)) return null;
	if (typeof entry.correct !== 'boolean') return null;
	if (typeof entry.due !== 'number' || !Number.isFinite(entry.due)) return null;
	const due = Math.min(Math.max(Math.floor(entry.due), at), at + LIMITS.maxDueOffsetMs);
	return { at, level: entry.level, attempts: entry.attempts, correct: entry.correct, due };
}

export function normalizeName(value) {
	if (typeof value !== 'string') return '';
	// eslint-disable-next-line no-control-regex
	return value.replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, LIMITS.maxNameLength);
}

function normalizeNameEntry(entry, now) {
	if (!entry || typeof entry !== 'object') return null;
	const at = timestamp(entry.at, now);
	if (at === null) return null;
	if (entry.del === true) return { at, del: true };
	const value = normalizeName(entry.value);
	return value ? { at, value } : null;
}

/** Keeps the `max` newest entries (ties: smaller key first) -- deterministic. */
function capNewest(map, max) {
	const keys = Object.keys(map);
	if (keys.length <= max) return { map, dropped: 0 };
	keys.sort((a, b) => map[b].at - map[a].at || (a < b ? -1 : a > b ? 1 : 0));
	const kept = keys.slice(0, max).sort();
	return { map: Object.fromEntries(kept.map((k) => [k, map[k]])), dropped: keys.length - max };
}

/**
 * Validates untrusted input into a normalised document. Throws ProgressError
 * 'version' for a document from a newer schema (never guess at it) and
 * 'invalid' when the input is not a progress document at all. Individual bad
 * entries are dropped, not fatal, and counted in `dropped`.
 *
 * Rules: ids must match ID_PATTERN (and, when a `catalog` is given, name a
 * known Baustein / question -- unknown ids are dropped); timestamps must be
 * integers >= LIMITS.minTimestamp, future ones are clamped to `now`; quiz
 * fields must be in range; the name is cleaned and cut to maxNameLength;
 * at most maxRead / maxQuiz entries survive (newest first).
 *
 * @param {unknown} input
 * @param {{ now: number, catalog?: { bausteine: Set<string>, questions: Set<string> } }} options
 */
export function normalizeProgress(input, { now, catalog } = {}) {
	if (typeof now !== 'number') throw new TypeError('normalizeProgress needs options.now');
	if (!input || typeof input !== 'object' || Array.isArray(input)) {
		throw new ProgressError('invalid', 'not a progress document');
	}
	if (!Number.isInteger(input.v) || input.v < 1) throw new ProgressError('invalid', 'missing version');
	if (input.v > PROGRESS_VERSION) throw new ProgressError('version', `progress version ${input.v} is newer than ${PROGRESS_VERSION}`);

	const dropped = { unknown: 0, invalid: 0, overLimit: 0 };
	const asMap = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

	const read = {};
	for (const [tk, raw] of Object.entries(asMap(input.read))) {
		if (!isId(tk)) { dropped.invalid += 1; continue; }
		if (catalog && !catalog.bausteine.has(tk)) { dropped.unknown += 1; continue; }
		const entry = normalizeRead(raw, now);
		if (entry) read[tk] = entry;
		else dropped.invalid += 1;
	}

	const quiz = {};
	for (const [key, raw] of Object.entries(asMap(input.quiz))) {
		if (!splitQuizKey(key)) { dropped.invalid += 1; continue; }
		if (catalog && !catalog.questions.has(key)) { dropped.unknown += 1; continue; }
		const entry = normalizeQuiz(raw, now);
		if (entry) quiz[key] = entry;
		else dropped.invalid += 1;
	}

	let name = null;
	if (input.name != null) {
		name = normalizeNameEntry(input.name, now);
		if (!name) dropped.invalid += 1;
	}

	const cappedRead = capNewest(read, LIMITS.maxRead);
	const cappedQuiz = capNewest(quiz, LIMITS.maxQuiz);
	dropped.overLimit = cappedRead.dropped + cappedQuiz.dropped;

	return {
		doc: { v: PROGRESS_VERSION, read: cappedRead.map, quiz: cappedQuiz.map, name },
		dropped,
	};
}
