// The progress transfer code (ADR-0025): a progress document packed into a
// short text that can be copied, typed or scanned as a QR code, so a learner
// can move progress between devices without any server. Pure functions plus
// the platform's CompressionStream (browsers, Node >= 18).
//
// Wire format (code version 1), base64url without padding:
//   byte 0        code version (1)
//   bytes 1..n-5  deflate-raw of the compact JSON payload (below)
//   bytes n-4..   CRC-32 (big endian) over bytes 0..n-5
// The checksum catches typos and truncated copies before anything is
// decompressed; the version byte lets an older page say "this code is from a
// newer version" instead of "broken".
//
// Compact payload (timestamps in whole seconds, relative to `b`):
//   { b: baseSeconds,
//     r: { tk: dt | -(dt + 1) },                              read / tombstone
//     q: { tk: [g, { qid: [dq, level, attempts, correct01, dueOffsetSeconds] | -(dq + 1) }] },
//                     g = group offset from b, dq = offset from g
//     n: [dt, name] | -(dt + 1) }
// Second precision is deliberate (shorter codes). A decoded entry is at most
// 999 ms older than the original, so where both meet again the original wins
// -- both sides still converge to the same state.
import { normalizeProgress, ProgressError, splitQuizKey, quizKey } from './progress-model.mjs';

export const CODE_VERSION = 1;

/** Fragment parameter of the import link: /de/fortschritt/#c=<code>. */
export const CODE_PARAM = 'c';

export class CodeError extends Error {
	/**
	 * @param {'empty' | 'format' | 'checksum' | 'version' | 'corrupt' | 'unsupported'} reason
	 */
	constructor(reason, message = reason) {
		super(message);
		this.name = 'CodeError';
		this.reason = reason;
	}
}

// ——— CRC-32 (IEEE 802.3) ———

const CRC_TABLE = (() => {
	const table = new Uint32Array(256);
	for (let n = 0; n < 256; n += 1) {
		let c = n;
		for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
		table[n] = c >>> 0;
	}
	return table;
})();

export function crc32(bytes) {
	let crc = 0xffffffff;
	for (let i = 0; i < bytes.length; i += 1) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
}

// ——— base64url ———

export function toBase64Url(bytes) {
	let binary = '';
	for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromBase64Url(text) {
	if (!/^[A-Za-z0-9_-]*$/.test(text) || text.length % 4 === 1) throw new CodeError('format');
	const b64 = text.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text.length + 3) % 4);
	const binary = atob(b64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
	return bytes;
}

// ——— deflate-raw via CompressionStream ———

function assertStreams() {
	if (typeof CompressionStream !== 'function' || typeof DecompressionStream !== 'function') {
		throw new CodeError('unsupported', 'CompressionStream is not available');
	}
}

async function pipe(bytes, stream) {
	const out = new Blob([bytes]).stream().pipeThrough(stream);
	return new Uint8Array(await new Response(out).arrayBuffer());
}

// ——— Document <-> compact payload ———

const sec = (ms) => Math.floor(ms / 1000);

function toPayload(doc) {
	const times = [
		...Object.values(doc.read).map((e) => e.at),
		...Object.values(doc.quiz).map((e) => e.at),
		...(doc.name ? [doc.name.at] : []),
	];
	const base = times.length ? sec(Math.min(...times)) : 0;
	const dt = (entry) => sec(entry.at) - base;
	const stamp = (entry) => (entry.del === true ? -(dt(entry) + 1) : dt(entry));

	const payload = { b: base };
	const r = {};
	for (const tk of Object.keys(doc.read).sort()) r[tk] = stamp(doc.read[tk]);
	if (Object.keys(r).length) payload.r = r;

	// Quiz entries are grouped per Baustein, timed relative to the group's
	// earliest entry: answers come minutes apart, so the numbers stay short.
	const groups = new Map();
	for (const key of Object.keys(doc.quiz).sort()) {
		const parts = splitQuizKey(key);
		if (!parts) continue;
		if (!groups.has(parts.tk)) groups.set(parts.tk, []);
		groups.get(parts.tk).push([parts.qid, doc.quiz[key]]);
	}
	const q = {};
	for (const [tk, list] of groups) {
		const g = Math.min(...list.map(([, e]) => dt(e)));
		const cells = {};
		for (const [qid, e] of list) {
			const d = dt(e) - g;
			cells[qid] = e.del === true ? -(d + 1) : [d, e.level, e.attempts, e.correct ? 1 : 0, Math.round((e.due - e.at) / 1000)];
		}
		q[tk] = [g, cells];
	}
	if (Object.keys(q).length) payload.q = q;

	if (doc.name) payload.n = doc.name.del === true ? stamp(doc.name) : [dt(doc.name), doc.name.value];
	return payload;
}

/** Expands a compact payload back into an (unvalidated) progress document. */
function fromPayload(payload) {
	if (!payload || typeof payload !== 'object' || Array.isArray(payload) || !Number.isInteger(payload.b)) {
		throw new CodeError('corrupt');
	}
	const base = payload.b;
	const at = (dt) => (base + dt) * 1000;
	const cell = (v) => (Number.isInteger(v) ? (v < 0 ? { at: at(-v - 1), del: true } : { at: at(v) }) : null);
	const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});

	const read = {};
	for (const [tk, v] of Object.entries(obj(payload.r))) read[tk] = cell(v);

	const quiz = {};
	for (const [tk, group] of Object.entries(obj(payload.q))) {
		if (!Array.isArray(group) || group.length !== 2 || !Number.isInteger(group[0])) throw new CodeError('corrupt');
		const g = group[0];
		for (const [qid, v] of Object.entries(obj(group[1]))) {
			if (Array.isArray(v) && v.length === 5 && v.every(Number.isInteger)) {
				const t = at(g + v[0]);
				quiz[quizKey(tk, qid)] = { at: t, level: v[1], attempts: v[2], correct: v[3] === 1, due: t + v[4] * 1000 };
			} else {
				quiz[quizKey(tk, qid)] = Number.isInteger(v) && v < 0 ? { at: at(g - v - 1), del: true } : null;
			}
		}
	}

	let name = null;
	if (Array.isArray(payload.n) && payload.n.length === 2 && Number.isInteger(payload.n[0])) {
		name = { at: at(payload.n[0]), value: payload.n[1] };
	} else if (payload.n !== undefined) {
		name = cell(payload.n);
	}
	return { v: 1, read, quiz, name };
}

// ——— Public API ———

/**
 * Packs a normalised progress document into a transfer code. With a
 * `catalog`, entries for ids the site does not publish are left out (they
 * would be dropped on import anyway).
 *
 * @param {object} doc
 * @param {{ catalog?: { bausteine: Set<string>, questions: Set<string> } }} [options]
 */
export async function encodeProgressCode(doc, { catalog } = {}) {
	assertStreams();
	let source = doc;
	if (catalog) {
		const keep = (map, set) => Object.fromEntries(Object.entries(map).filter(([k]) => set.has(k)));
		source = { ...doc, read: keep(doc.read, catalog.bausteine), quiz: keep(doc.quiz, catalog.questions) };
	}
	const json = new TextEncoder().encode(JSON.stringify(toPayload(source)));
	const deflated = await pipe(json, new CompressionStream('deflate-raw'));
	const body = new Uint8Array(1 + deflated.length);
	body[0] = CODE_VERSION;
	body.set(deflated, 1);
	const crc = crc32(body);
	const bytes = new Uint8Array(body.length + 4);
	bytes.set(body, 0);
	bytes[body.length] = crc >>> 24;
	bytes[body.length + 1] = (crc >>> 16) & 0xff;
	bytes[body.length + 2] = (crc >>> 8) & 0xff;
	bytes[body.length + 3] = crc & 0xff;
	return toBase64Url(bytes);
}

/**
 * Pulls the code out of whatever was pasted: the bare code, or a full link
 * with `#c=<code>` (or `?c=<code>`). Whitespace and line breaks from copying
 * are ignored. Returns '' when nothing is left.
 */
export function extractCode(input) {
	const text = String(input ?? '').trim();
	const match = text.match(/[#?&]c=([^&#\s]*)/);
	return (match ? match[1] : text).replace(/\s+/g, '');
}

/**
 * Unpacks and validates a transfer code. Throws CodeError with a reason the
 * UI turns into a plain message; on success returns the normalised document
 * and the counts of entries dropped by validation.
 *
 * @param {string} input bare code or link
 * @param {{ now: number, catalog?: { bausteine: Set<string>, questions: Set<string> } }} options
 */
export async function decodeProgressCode(input, { now, catalog } = {}) {
	const code = extractCode(input);
	if (!code) throw new CodeError('empty');
	const bytes = fromBase64Url(code);
	if (bytes.length < 6) throw new CodeError('format');
	const body = bytes.subarray(0, bytes.length - 4);
	const stored = ((bytes[bytes.length - 4] << 24) | (bytes[bytes.length - 3] << 16) | (bytes[bytes.length - 2] << 8) | bytes[bytes.length - 1]) >>> 0;
	if (crc32(body) !== stored) throw new CodeError('checksum');
	if (body[0] > CODE_VERSION) throw new CodeError('version');
	if (body[0] !== CODE_VERSION) throw new CodeError('format');

	assertStreams();
	let payload;
	try {
		const inflated = await pipe(body.subarray(1), new DecompressionStream('deflate-raw'));
		payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(inflated));
	} catch {
		throw new CodeError('corrupt');
	}
	try {
		return normalizeProgress(fromPayload(payload), { now, catalog });
	} catch (error) {
		if (error instanceof ProgressError && error.reason === 'version') throw new CodeError('version');
		throw new CodeError('corrupt');
	}
}

/** The import link carried by the QR code; the code lives in the fragment. */
export function importLink(origin, lang, code) {
	const path = lang === 'en' ? '/en/progress/' : '/de/fortschritt/';
	return `${origin}${path}#${CODE_PARAM}=${code}`;
}
