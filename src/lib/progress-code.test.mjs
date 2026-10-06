import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CodeError, crc32, decodeProgressCode, encodeProgressCode, extractCode, fromBase64Url, importLink, toBase64Url } from './progress-code.mjs';
import { emptyProgress, mergeProgress, serializeProgress } from './progress-model.mjs';

const NOW = Date.UTC(2026, 9, 6, 12);
const T0 = Date.UTC(2026, 8, 1, 8, 30, 15); // whole seconds: survives the code exactly

const sample = () => ({
	v: 1,
	read: { 'was-ist-ki': { at: T0 }, tokens: { at: T0 + 60_000 }, training: { at: T0 + 120_000, del: true } },
	quiz: {
		'tokens:anzahl': { at: T0 + 5000, level: 2, attempts: 3, correct: true, due: T0 + 5000 + 7 * 86400000 },
		'tokens:grenze': { at: T0 + 6000, level: 0, attempts: 1, correct: false, due: T0 + 6000 + 86400000 },
		'training:kosten': { at: T0 + 9000, del: true },
	},
	name: null,
});

const catalog = {
	bausteine: new Set(['was-ist-ki', 'tokens', 'training']),
	questions: new Set(['tokens:anzahl', 'tokens:grenze', 'training:kosten']),
};

async function rejectsWith(promise, reason) {
	await assert.rejects(promise, (e) => e instanceof CodeError && e.reason === reason);
}

test('encode -> decode round-trips a document with second-precision timestamps', async () => {
	const code = await encodeProgressCode(sample());
	assert.match(code, /^[A-Za-z0-9_-]+$/);
	const { doc, dropped } = await decodeProgressCode(code, { now: NOW, catalog });
	assert.equal(serializeProgress(doc), serializeProgress(sample()));
	assert.deepEqual(dropped, { unknown: 0, invalid: 0, overLimit: 0 });
});

test('the name survives the code when the document has one', async () => {
	const doc = { ...sample(), name: { at: T0, value: 'Ada Lovelace' } };
	const decoded = await decodeProgressCode(await encodeProgressCode(doc), { now: NOW });
	assert.deepEqual(decoded.doc.name, { at: T0, value: 'Ada Lovelace' });
});

test('millisecond timestamps are truncated, and the original still wins on merge', async () => {
	const original = { ...emptyProgress(), read: { tokens: { at: T0 + 789 } } };
	const { doc } = await decodeProgressCode(await encodeProgressCode(original), { now: NOW });
	assert.deepEqual(doc.read.tokens, { at: T0 });
	assert.equal(serializeProgress(mergeProgress(original, doc)), serializeProgress(original));
});

test('an empty document makes a valid, short code', async () => {
	const code = await encodeProgressCode(emptyProgress());
	assert.ok(code.length < 20, code);
	const { doc } = await decodeProgressCode(code, { now: NOW });
	assert.equal(serializeProgress(doc), serializeProgress(emptyProgress()));
});

test('a realistic full progress stays well inside one QR code', async () => {
	const doc = emptyProgress();
	for (let b = 0; b < 60; b += 1) {
		const tk = `baustein-nummer-${b}`;
		doc.read[tk] = { at: T0 + b * 3_600_000 };
		for (let q = 0; q < 6; q += 1) {
			const at = T0 + b * 3_600_000 + q * 20_000;
			doc.quiz[`${tk}:frage-${q}`] = { at, level: q % 5, attempts: 1 + (q % 3), correct: q % 2 === 0, due: at + 3 * 86400000 };
		}
	}
	const code = await encodeProgressCode(doc);
	// QR version 40-L holds 2953 bytes; the link adds ~50.
	assert.ok(code.length < 2800, `code length ${code.length}`);
});

test('with a catalog, unknown ids are left out of the code and dropped on import', async () => {
	const doc = { ...sample(), read: { ...sample().read, 'nicht-mehr-da': { at: T0 } } };
	const small = await encodeProgressCode(doc, { catalog });
	const { doc: decoded } = await decodeProgressCode(small, { now: NOW });
	assert.ok(!('nicht-mehr-da' in decoded.read));
	const full = await encodeProgressCode(doc);
	const { dropped } = await decodeProgressCode(full, { now: NOW, catalog });
	assert.equal(dropped.unknown, 1);
});

test('links and pasted text: the code is found and whitespace ignored', async () => {
	const code = await encodeProgressCode(sample());
	assert.equal(extractCode(importLink('https://ki-einfach-verstehen.de', 'de', code)), code);
	assert.equal(extractCode(`  ${code.slice(0, 10)}\n${code.slice(10)}  `), code);
	assert.equal(importLink('https://x.test', 'en', 'abc'), 'https://x.test/en/progress/#c=abc');
	assert.equal(extractCode('https://x.test/de/fortschritt/?c=abc'), 'abc');
});

test('a typo or a truncated copy fails the checksum', async () => {
	const code = await encodeProgressCode(sample());
	const i = Math.floor(code.length / 2);
	const typo = code.slice(0, i) + (code[i] === 'A' ? 'B' : 'A') + code.slice(i + 1);
	await rejectsWith(decodeProgressCode(typo, { now: NOW }), 'checksum');
	await rejectsWith(decodeProgressCode(code.slice(0, -4), { now: NOW }), 'checksum');
});

test('empty input, foreign characters and too-short codes are format errors', async () => {
	await rejectsWith(decodeProgressCode('   ', { now: NOW }), 'empty');
	await rejectsWith(decodeProgressCode('hallo welt!', { now: NOW }), 'format');
	await rejectsWith(decodeProgressCode('AAAA', { now: NOW }), 'format');
});

function withChecksum(body) {
	const crc = crc32(body);
	const bytes = new Uint8Array(body.length + 4);
	bytes.set(body);
	bytes.set([crc >>> 24, (crc >>> 16) & 0xff, (crc >>> 8) & 0xff, crc & 0xff], body.length);
	return toBase64Url(bytes);
}

test('a code from a newer version says so, instead of "broken"', async () => {
	const bytes = fromBase64Url(await encodeProgressCode(sample()));
	const body = bytes.slice(0, -4);
	body[0] = 2;
	await rejectsWith(decodeProgressCode(withChecksum(body), { now: NOW }), 'version');
});

test('a valid checksum over a broken payload is reported as corrupt', async () => {
	await rejectsWith(decodeProgressCode(withChecksum(new Uint8Array([1, 0xff, 0xfe, 0x00, 0x13])), { now: NOW }), 'corrupt');
});

test('well-formed JSON in the wrong shape is "corrupt", not a crash', async () => {
	// No base time `b`: valid deflate, valid JSON, not a payload.
	const json = new TextEncoder().encode(JSON.stringify({ r: { a: 1 } }));
	const deflated = new Uint8Array(await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());
	const body = new Uint8Array(1 + deflated.length);
	body[0] = 1;
	body.set(deflated, 1);
	await rejectsWith(decodeProgressCode(withChecksum(body), { now: NOW }), 'corrupt');
});

test('base64url round-trips arbitrary bytes', () => {
	for (let n = 0; n < 40; n += 1) {
		const bytes = Uint8Array.from({ length: n }, (_, i) => (i * 37 + n) & 0xff);
		assert.deepEqual(fromBase64Url(toBase64Url(bytes)), bytes);
	}
});

test('crc32 matches the reference value', () => {
	assert.equal(crc32(new TextEncoder().encode('123456789')), 0xcbf43926);
});
