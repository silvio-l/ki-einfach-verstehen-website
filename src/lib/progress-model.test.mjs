import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	emptyProgress,
	LIMITS,
	mergeProgress,
	normalizeProgress,
	pickNewer,
	previewMerge,
	ProgressError,
	resetProgress,
	sameProgress,
	serializeProgress,
	summarizeProgress,
} from './progress-model.mjs';

const NOW = Date.UTC(2026, 9, 6, 12);
const T0 = Date.UTC(2026, 8, 1);

// ——— A small seeded generator for property tests (no dependency) ———

function rng(seed) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let t = s;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const TKS = ['was-ist-ki', 'tokens', 'training', 'parameter'];
const QIDS = ['a', 'b', 'c'];

/** Random normalised documents over a tiny key and time space, so that
 * collisions -- same key, same timestamp, different entries -- are common. */
function randomDoc(random) {
	const pick = (list) => list[Math.floor(random() * list.length)];
	const at = () => T0 + Math.floor(random() * 4) * 1000;
	const doc = emptyProgress();
	for (const tk of TKS) {
		if (random() < 0.6) doc.read[tk] = random() < 0.3 ? { at: at(), del: true } : { at: at() };
		for (const qid of QIDS) {
			if (random() < 0.4) {
				const t = at();
				doc.quiz[`${tk}:${qid}`] =
					random() < 0.25
						? { at: t, del: true }
						: { at: t, level: Math.floor(random() * 6), attempts: 1 + Math.floor(random() * 3), correct: random() < 0.5, due: t + 86400000 };
			}
		}
	}
	if (random() < 0.5) doc.name = random() < 0.3 ? { at: at(), del: true } : { at: at(), value: pick(['Ada', 'Grace', 'Alan']) };
	return doc;
}

const eq = (a, b, message) => assert.equal(serializeProgress(a), serializeProgress(b), message);

test('merge is commutative', () => {
	const random = rng(1);
	for (let i = 0; i < 500; i += 1) {
		const a = randomDoc(random);
		const b = randomDoc(random);
		eq(mergeProgress(a, b), mergeProgress(b, a), `run ${i}`);
	}
});

test('merge is associative', () => {
	const random = rng(2);
	for (let i = 0; i < 500; i += 1) {
		const [a, b, c] = [randomDoc(random), randomDoc(random), randomDoc(random)];
		eq(mergeProgress(mergeProgress(a, b), c), mergeProgress(a, mergeProgress(b, c)), `run ${i}`);
	}
});

test('merge is idempotent, and merging a result again changes nothing', () => {
	const random = rng(3);
	for (let i = 0; i < 500; i += 1) {
		const a = randomDoc(random);
		const b = randomDoc(random);
		eq(mergeProgress(a, a), a, `self ${i}`);
		const ab = mergeProgress(a, b);
		eq(mergeProgress(ab, b), ab, `absorb ${i}`);
	}
});

test('the empty document is the identity of merge', () => {
	const random = rng(4);
	for (let i = 0; i < 100; i += 1) {
		const a = randomDoc(random);
		eq(mergeProgress(a, emptyProgress()), a);
	}
});

test('normalising a valid document is a no-op (round-trip stable)', () => {
	const random = rng(5);
	for (let i = 0; i < 200; i += 1) {
		const a = randomDoc(random);
		eq(normalizeProgress(JSON.parse(serializeProgress(a)), { now: NOW }).doc, a);
	}
});

test('last writer wins per entry; a newer reset beats an older read and vice versa', () => {
	assert.deepEqual(pickNewer({ at: 2 }, { at: 1, del: true }), { at: 2 });
	assert.deepEqual(pickNewer({ at: 1 }, { at: 2, del: true }), { at: 2, del: true });
	// Tie: the reset is the more deliberate act.
	assert.deepEqual(pickNewer({ at: 5 }, { at: 5, del: true }), { at: 5, del: true });
	assert.deepEqual(pickNewer({ at: 5, del: true }, { at: 5 }), { at: 5, del: true });
});

test('reading again after a reset counts again', () => {
	const read = { ...emptyProgress(), read: { tokens: { at: T0 } } };
	const reset = resetProgress(read, T0 + 1000);
	assert.equal(summarizeProgress(reset).read, 0);
	const again = mergeProgress(reset, { ...emptyProgress(), read: { tokens: { at: T0 + 2000 } } });
	assert.equal(summarizeProgress(again).read, 1);
});

test('a reset wins even over entries stamped slightly ahead of this clock', () => {
	const doc = { ...emptyProgress(), read: { tokens: { at: NOW + 1000 } } };
	const reset = resetProgress(doc, NOW);
	assert.deepEqual(reset.read.tokens, { at: NOW + 1001, del: true });
	eq(mergeProgress(doc, reset), reset);
});

test('previewMerge counts what becomes new and what an incoming reset removes', () => {
	const local = { ...emptyProgress(), read: { a: { at: T0 }, b: { at: T0 } } };
	const incoming = { ...emptyProgress(), read: { b: { at: T0 + 1, del: true }, c: { at: T0 } }, quiz: { 'c:x': { at: T0, level: 1, attempts: 1, correct: true, due: T0 + 1 } } };
	const p = previewMerge(local, incoming);
	assert.equal(p.addedRead, 1);
	assert.equal(p.removedRead, 1);
	assert.equal(p.addedQuiz, 1);
	assert.equal(p.incoming.read, 1);
	assert.equal(p.changes, 3);
	assert.equal(previewMerge(p.merged, incoming).changes, 0, 'merging the same code twice changes nothing');
});

test('previewMerge reports incoming entries that lose against a newer local reset', () => {
	const old = { ...emptyProgress(), read: { a: { at: T0 } } };
	const local = resetProgress(old, T0 + 5000);
	const p = previewMerge(local, old);
	assert.equal(p.changes, 0);
	assert.equal(p.shadowed, 1);
});

// ——— Validation ———

test('a newer version is reported as such, garbage as invalid', () => {
	assert.throws(() => normalizeProgress({ v: 2, read: {} }, { now: NOW }), (e) => e instanceof ProgressError && e.reason === 'version');
	for (const bad of [null, 'x', [], {}, { v: 0 }, { v: '1' }]) {
		assert.throws(() => normalizeProgress(bad, { now: NOW }), (e) => e instanceof ProgressError && e.reason === 'invalid');
	}
});

test('bad ids, unknown ids and bad entries are dropped and counted', () => {
	const catalog = { bausteine: new Set(['tokens']), questions: new Set(['tokens:a']) };
	const { doc, dropped } = normalizeProgress(
		{
			v: 1,
			read: { tokens: { at: T0 }, 'Not-Valid': { at: T0 }, unknown: { at: T0 }, 'tokens-2': 'x' },
			quiz: {
				'tokens:a': { at: T0, level: 2, attempts: 3, correct: true, due: T0 + 1000 },
				'tokens:b': { at: T0, level: 2, attempts: 3, correct: true, due: T0 },
				'tokens:a:b': { at: T0, del: true },
			},
		},
		{ now: NOW, catalog },
	);
	assert.deepEqual(Object.keys(doc.read), ['tokens']);
	assert.deepEqual(Object.keys(doc.quiz), ['tokens:a']);
	assert.equal(dropped.unknown, 3);
	assert.equal(dropped.invalid, 2);
});

test('timestamps: future ones are clamped to now, nonsense is dropped', () => {
	const { doc } = normalizeProgress(
		{ v: 1, read: { a: { at: NOW + 60 * 60 * 1000 }, b: { at: NOW + 1000 }, c: { at: 12 }, d: { at: 'x' }, e: { at: T0 + 0.7 } } },
		{ now: NOW },
	);
	assert.deepEqual(doc.read, { a: { at: NOW }, b: { at: NOW + 1000 }, e: { at: T0 } });
});

test('quiz fields are range-checked and due is kept within a sane window', () => {
	const base = { at: T0, level: 1, attempts: 1, correct: false, due: T0 };
	const { doc, dropped } = normalizeProgress(
		{
			v: 1,
			quiz: {
				'a:ok': { ...base, due: T0 + 10 ** 13 },
				'a:early': { ...base, due: T0 - 5 },
				'a:level': { ...base, level: 6 },
				'a:attempts': { ...base, attempts: 0 },
				'a:correct': { ...base, correct: 'yes' },
			},
		},
		{ now: NOW },
	);
	assert.equal(doc.quiz['a:ok'].due, T0 + LIMITS.maxDueOffsetMs);
	assert.equal(doc.quiz['a:early'].due, T0);
	assert.equal(dropped.invalid, 3);
});

test('the name is cleaned, cut to the limit, and an empty one is dropped', () => {
	const long = 'x'.repeat(200);
	assert.deepEqual(normalizeProgress({ v: 1, name: { at: T0, value: '  Ada\n\tLovelace  ' } }, { now: NOW }).doc.name, { at: T0, value: 'Ada Lovelace' });
	assert.equal(normalizeProgress({ v: 1, name: { at: T0, value: long } }, { now: NOW }).doc.name.value.length, LIMITS.maxNameLength);
	assert.equal(normalizeProgress({ v: 1, name: { at: T0, value: '   ' } }, { now: NOW }).doc.name, null);
});

test('over the entry limit the newest entries survive', () => {
	const read = {};
	for (let i = 0; i < LIMITS.maxRead + 5; i += 1) read[`k${i}`] = { at: T0 + i };
	const { doc, dropped } = normalizeProgress({ v: 1, read }, { now: NOW });
	assert.equal(Object.keys(doc.read).length, LIMITS.maxRead);
	assert.equal(dropped.overLimit, 5);
	assert.ok(!('k0' in doc.read) && `k${LIMITS.maxRead + 4}` in doc.read);
});

test('sameProgress ignores key order', () => {
	const a = { ...emptyProgress(), read: { a: { at: T0 }, b: { at: T0 } } };
	const b = { ...emptyProgress(), read: { b: { at: T0 }, a: { at: T0 } } };
	assert.ok(sameProgress(a, b));
});
