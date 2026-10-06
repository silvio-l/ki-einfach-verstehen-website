import assert from 'node:assert/strict';
import { test } from 'node:test';
import { catalogFrom, LEGACY_QUIZ_KEY, LEGACY_READ_KEY, loadStored, mergeIntoLocal, PROGRESS_KEY, projectLegacy, resetLocal, syncFromLegacy } from './progress-store.js';
import { emptyQuizProgress, recordAnswer } from './quiz-progress.js';
import { summarizeProgress } from '../lib/progress-model.mjs';

const T0 = Date.UTC(2026, 8, 1);
const NOW = Date.UTC(2026, 9, 6, 12);

function fakeStorage(initial = {}) {
	const map = new Map(Object.entries(initial));
	return {
		getItem: (k) => (map.has(k) ? map.get(k) : null),
		setItem: (k, v) => map.set(k, String(v)),
		removeItem: (k) => map.delete(k),
		dump: () => Object.fromEntries(map),
	};
}

function legacyQuiz() {
	let q = emptyQuizProgress();
	q = recordAnswer(q, 'tokens', 'anzahl', true, T0);
	q = recordAnswer(q, 'tokens', 'grenze', false, T0 + 1000);
	return q;
}

test('first sync migrates the legacy keys into the document without loss', () => {
	const quiz = legacyQuiz();
	const storage = fakeStorage({
		[LEGACY_READ_KEY]: JSON.stringify(['was-ist-ki', 'tokens']),
		[LEGACY_QUIZ_KEY]: JSON.stringify(quiz),
	});
	const { doc } = syncFromLegacy(storage, NOW);
	assert.deepEqual(doc.read, { tokens: { at: NOW }, 'was-ist-ki': { at: NOW } });
	assert.equal(doc.quiz['tokens:anzahl'].at, T0);
	assert.ok(storage.getItem(PROGRESS_KEY));
	// The projection reproduces the legacy records exactly.
	assert.deepEqual(projectLegacy(doc).quiz, quiz);
	assert.deepEqual(projectLegacy(doc).read.sort(), ['tokens', 'was-ist-ki']);
});

test('a second sync without new legacy writes changes nothing', () => {
	const storage = fakeStorage({ [LEGACY_READ_KEY]: JSON.stringify(['tokens']) });
	syncFromLegacy(storage, NOW);
	const before = storage.getItem(PROGRESS_KEY);
	syncFromLegacy(storage, NOW + 5000);
	assert.equal(storage.getItem(PROGRESS_KEY), before);
});

test('rollback: the legacy keys stay complete, and writes of the old build come back in', () => {
	const storage = fakeStorage({ [LEGACY_READ_KEY]: JSON.stringify(['tokens']) });
	mergeIntoLocal({ v: 1, read: { training: { at: T0 } }, quiz: {}, name: null }, storage, NOW);
	// The old build only knows the legacy key -- and finds both reads there.
	assert.deepEqual(JSON.parse(storage.getItem(LEGACY_READ_KEY)).sort(), ['tokens', 'training']);
	// The old build marks one more as read, in the legacy key only.
	storage.setItem(LEGACY_READ_KEY, JSON.stringify(['tokens', 'training', 'parameter']));
	const { doc } = syncFromLegacy(storage, NOW + 1000);
	assert.deepEqual(Object.keys(doc.read).sort(), ['parameter', 'tokens', 'training']);
	assert.equal(doc.read.parameter.at, NOW + 1000);
});

test('a document from a newer build is never overwritten', () => {
	const newer = JSON.stringify({ v: 2, whatever: true });
	const storage = fakeStorage({ [PROGRESS_KEY]: newer, [LEGACY_READ_KEY]: JSON.stringify(['tokens']) });
	assert.equal(loadStored(storage, NOW).writable, false);
	mergeIntoLocal({ v: 1, read: { training: { at: T0 } }, quiz: {}, name: null }, storage, NOW);
	assert.equal(storage.getItem(PROGRESS_KEY), newer);
	assert.deepEqual(JSON.parse(storage.getItem(LEGACY_READ_KEY)).sort(), ['tokens', 'training']);
});

test('an unreadable document is rebuilt from the legacy keys', () => {
	const storage = fakeStorage({ [PROGRESS_KEY]: '{broken', [LEGACY_READ_KEY]: JSON.stringify(['tokens']) });
	const { doc } = syncFromLegacy(storage, NOW);
	assert.deepEqual(Object.keys(doc.read), ['tokens']);
});

test('reset empties the legacy keys and leaves tombstones in the document', () => {
	const storage = fakeStorage({ [LEGACY_READ_KEY]: JSON.stringify(['tokens']), [LEGACY_QUIZ_KEY]: JSON.stringify(legacyQuiz()) });
	const doc = resetLocal(storage, NOW);
	assert.deepEqual(JSON.parse(storage.getItem(LEGACY_READ_KEY)), []);
	assert.deepEqual(JSON.parse(storage.getItem(LEGACY_QUIZ_KEY)).records, {});
	assert.equal(summarizeProgress(doc).read, 0);
	assert.equal(doc.read.tokens.del, true);
	// Reading the Baustein again afterwards counts again.
	storage.setItem(LEGACY_READ_KEY, JSON.stringify(['tokens']));
	assert.equal(summarizeProgress(syncFromLegacy(storage, NOW + 1000).doc).read, 1);
});

test('a stale tab writing an old quiz snapshot cannot undo a reset', () => {
	const storage = fakeStorage({ [LEGACY_QUIZ_KEY]: JSON.stringify(legacyQuiz()) });
	resetLocal(storage, NOW);
	// A tab opened before the reset writes its old snapshot back.
	storage.setItem(LEGACY_QUIZ_KEY, JSON.stringify(legacyQuiz()));
	const { doc } = syncFromLegacy(storage, NOW + 1000);
	assert.equal(summarizeProgress(doc).quiz, 0);
});

test('merging into local progress keeps local entries and adds the new ones', () => {
	const storage = fakeStorage({ [LEGACY_READ_KEY]: JSON.stringify(['tokens']) });
	const incoming = {
		v: 1,
		read: { training: { at: T0 } },
		quiz: { 'training:kosten': { at: T0, level: 1, attempts: 1, correct: true, due: T0 + 3 * 86400000 } },
		name: null,
	};
	mergeIntoLocal(incoming, storage, NOW);
	assert.deepEqual(JSON.parse(storage.getItem(LEGACY_READ_KEY)).sort(), ['tokens', 'training']);
	const records = JSON.parse(storage.getItem(LEGACY_QUIZ_KEY)).records;
	assert.equal(records['training:kosten'].answeredAt, new Date(T0).toISOString());
	assert.equal(records['training:kosten'].lastCorrect, true);
});

test('catalogFrom builds the id sets the import validates against', () => {
	const c = catalogFrom([{ tk: 'tokens', questionIds: ['a', 'b'] }, { tk: 'leer', questionIds: [] }]);
	assert.deepEqual([...c.bausteine], ['tokens', 'leer']);
	assert.deepEqual([...c.questions], ['tokens:a', 'tokens:b']);
});
