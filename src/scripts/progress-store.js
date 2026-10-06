// Browser side of the progress document (ADR-0025, src/lib/progress-model.mjs).
//
// Storage layout:
//   kev:progress:v1      the canonical document: per-entry timestamps and
//                        reset tombstones, everything merge needs.
//   kev:read-bausteine   legacy read set (array of translationKeys) and
//   kiev:quiz:v1         legacy Abrufmoment records (quiz-progress.js).
//
// The two legacy keys stay what every page reads, and they are rewritten as a
// projection of the document after each change. So a rollback to a build
// without this file loses nothing: the old code finds its keys complete and
// current. Writes the old code makes are folded back in by
// syncFromLegacy() on the next change or visit of the progress page. The
// device-local bookkeeping keys (kev:lernpfad-events, onboarding/tour flags,
// display preferences, feedback votes) are not progress and stay out.
//
// Every function takes the storage as a parameter (default localStorage) so
// node --test can drive it with a Map-backed fake.
import { emptyProgress, isLive, mergeProgress, normalizeProgress, ProgressError, quizKey, resetProgress, sameProgress, serializeProgress, splitQuizKey } from '../lib/progress-model.mjs';

export const PROGRESS_KEY = 'kev:progress:v1';
export const LEGACY_READ_KEY = 'kev:read-bausteine';
export const LEGACY_QUIZ_KEY = 'kiev:quiz:v1';
const LEGACY_QUIZ_VERSION = 1;

function parse(raw) {
	try {
		return raw == null ? null : JSON.parse(raw);
	} catch {
		return null;
	}
}

/** The legacy read set as an array of strings (garbage ignored). */
function readLegacyRead(storage) {
	const parsed = parse(storage.getItem(LEGACY_READ_KEY));
	return Array.isArray(parsed) ? parsed.filter((tk) => typeof tk === 'string') : [];
}

/** The legacy quiz records, or {} when missing or of another version. */
function readLegacyQuiz(storage) {
	const parsed = parse(storage.getItem(LEGACY_QUIZ_KEY));
	if (parsed?.version !== LEGACY_QUIZ_VERSION || !parsed.records || typeof parsed.records !== 'object') return {};
	return parsed.records;
}

/** Legacy quiz record -> document entry (at = answeredAt); null if unusable. */
export function entryFromLegacyRecord(record) {
	if (!record || typeof record !== 'object') return null;
	const at = Date.parse(record.answeredAt);
	const due = Date.parse(record.dueAt);
	if (!Number.isFinite(at) || !Number.isFinite(due)) return null;
	return { at, level: record.level, attempts: record.attempts, correct: record.lastCorrect === true, due };
}

/** Document entry -> legacy quiz record (the shape quiz-progress.js writes). */
export function legacyRecordFromEntry(entry) {
	return {
		level: entry.level,
		attempts: entry.attempts,
		lastCorrect: entry.correct,
		answeredAt: new Date(entry.at).toISOString(),
		dueAt: new Date(entry.due).toISOString(),
	};
}

/**
 * Folds the legacy keys into the document. A translationKey in the legacy
 * read set that is not live in the document was written after the last
 * projection (by markRead, another tab, or a rolled-back build), so it is a
 * new read now -- stamped at least 1 ms after any tombstone it replaces.
 * Legacy quiz records carry their own answeredAt and merge last-writer-wins,
 * so a stale tab can never undo a newer answer or a newer reset.
 */
export function reconcileLegacy(doc, legacyRead, legacyQuiz, now) {
	const incoming = { v: 1, read: {}, quiz: {}, name: null };
	for (const tk of legacyRead) {
		const current = doc.read[tk];
		if (!isLive(current)) incoming.read[tk] = { at: Math.max(now, (current?.at ?? 0) + 1) };
	}
	for (const [key, record] of Object.entries(legacyQuiz)) {
		const entry = entryFromLegacyRecord(record);
		if (entry) incoming.quiz[key] = entry;
	}
	// Same validation as every other ingress; ids are not checked against the
	// catalog here -- local data is never thrown away for being unknown.
	const { doc: clean } = normalizeProgress(incoming, { now });
	return mergeProgress(doc, clean);
}

/** Legacy projections of a document. */
export function projectLegacy(doc) {
	const read = Object.keys(doc.read).filter((tk) => isLive(doc.read[tk]));
	const records = {};
	for (const [key, entry] of Object.entries(doc.quiz)) {
		if (isLive(entry) && splitQuizKey(key)) records[key] = legacyRecordFromEntry(entry);
	}
	return { read, quiz: { version: LEGACY_QUIZ_VERSION, records } };
}

/**
 * Reads the stored document. `writable` is false when the stored document
 * comes from a newer build (rollback case): then this build works from the
 * legacy keys only and must never overwrite the newer document.
 */
export function loadStored(storage, now) {
	const parsed = parse(storage.getItem(PROGRESS_KEY));
	if (parsed == null) return { doc: emptyProgress(), writable: true };
	try {
		return { doc: normalizeProgress(parsed, { now }).doc, writable: true };
	} catch (error) {
		if (error instanceof ProgressError && error.reason === 'version') return { doc: emptyProgress(), writable: false };
		// Unreadable document: start over from the legacy keys, which are
		// always complete (they are the projection).
		return { doc: emptyProgress(), writable: true };
	}
}

function save(storage, doc, writable) {
	if (writable) storage.setItem(PROGRESS_KEY, serializeProgress(doc));
	const legacy = projectLegacy(doc);
	storage.setItem(LEGACY_READ_KEY, JSON.stringify(legacy.read));
	storage.setItem(LEGACY_QUIZ_KEY, JSON.stringify(legacy.quiz));
}

/**
 * Loads the document with all legacy writes folded in, persisting the result
 * when it changed. This is also the one-time migration: on the first call
 * the document is empty and is built entirely from the legacy keys.
 */
export function syncFromLegacy(storage = globalThis.localStorage, now = Date.now()) {
	const { doc, writable } = loadStored(storage, now);
	const merged = reconcileLegacy(doc, readLegacyRead(storage), readLegacyQuiz(storage), now);
	if (writable && (!sameProgress(doc, merged) || storage.getItem(PROGRESS_KEY) == null)) {
		storage.setItem(PROGRESS_KEY, serializeProgress(merged));
	}
	return { doc: merged, writable };
}

/** Best-effort sync for the legacy write paths (markRead, writeQuizProgress). */
export function trySyncFromLegacy(storage = globalThis.localStorage) {
	try {
		syncFromLegacy(storage);
	} catch {
		/* storage unavailable or full -- the legacy write already happened */
	}
}

/** Merges an incoming (normalised) document into local progress. */
export function mergeIntoLocal(incoming, storage = globalThis.localStorage, now = Date.now()) {
	const { doc, writable } = syncFromLegacy(storage, now);
	const merged = mergeProgress(doc, incoming);
	save(storage, merged, writable);
	return merged;
}

/** Resets all progress on this device (tombstones, so a sync spreads it). */
export function resetLocal(storage = globalThis.localStorage, now = Date.now()) {
	const { doc, writable } = syncFromLegacy(storage, now);
	const reset = resetProgress(doc, now);
	save(storage, reset, writable);
	return reset;
}

/** The Lernnachweis name the reader chose to remember, or '' (ADR-0025). */
export function getStoredName(storage = globalThis.localStorage, now = Date.now()) {
	const { doc } = loadStored(storage, now);
	return isLive(doc.name) ? doc.name.value : '';
}

/**
 * Remembers the Lernnachweis name (opt-in), or forgets it when `value` is
 * empty. Forgetting writes a tombstone, so a code or a later sync spreads the
 * deletion instead of bringing the name back. Validation (length, control
 * characters) is the model's, like every other ingress.
 */
export function setStoredName(value, storage = globalThis.localStorage, now = Date.now()) {
	const { doc, writable } = syncFromLegacy(storage, now);
	const trimmed = typeof value === 'string' ? value.trim() : '';
	if (!trimmed && !isLive(doc.name)) return doc;
	const entry = trimmed ? { at: Math.max(now, (doc.name?.at ?? 0) + 1), value: trimmed } : { at: Math.max(now, (doc.name?.at ?? 0) + 1), del: true };
	const { doc: incoming } = normalizeProgress({ v: 1, read: {}, quiz: {}, name: entry }, { now: entry.at });
	const merged = mergeProgress(doc, incoming);
	save(storage, merged, writable);
	return merged;
}

/** Catalog of known ids from the build: [{ tk, questionIds }]. */
export function catalogFrom(list) {
	const bausteine = new Set();
	const questions = new Set();
	for (const { tk, questionIds } of list) {
		bausteine.add(tk);
		for (const id of questionIds) questions.add(quizKey(tk, id));
	}
	return { bausteine, questions };
}
