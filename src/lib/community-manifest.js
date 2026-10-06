// Builds /community-manifest.json (docs/community/spec.md §7.1, ADR-0022):
// the list of Themenbereiche and Bausteine the community board anchors its
// questions on. Pure function over already-loaded collection data, so it is
// unit-tested without Astro (community-manifest.test.mjs); the endpoint
// src/pages/community-manifest.json.ts does the collection reads.
//
// Every validation here throws, which fails the build: a manifest that
// names a successor the website does not have, or a key the forum cannot
// parse, must never reach the forum's sync job.

/** Key format the forum validates strictly (spec §7.2). */
export const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const SCHEMA_VERSION = 1;

/**
 * @typedef {'de' | 'en'} Lang
 * @typedef {{ lang: Lang, key: string, order: number, routeSlug: string, title: string }} ThemenbereichEntry
 * @typedef {{ lang: Lang, slug: string, translationKey: string, themenbereich: string, order: number, title: string, ueberarbeitet?: Date | null }} BausteinEntry
 * @typedef {{ key: string, retiredOn: Date, successors: string[], oldSlugs: { de: string[], en: string[] } }} RetiredEntry
 * @typedef {{ lang: Lang, slug: string, translationKey: string, title: string, description: string }} GlossarEntry
 */

/** Byte limits the forum enforces on glossary entries (newsletter, ADR-0004). */
export const GLOSSAR_TITLE_MAX_BYTES = 200;
export const GLOSSAR_DESCRIPTION_MAX_BYTES = 400;

const utf8 = new TextEncoder();
const byteLength = (s) => utf8.encode(s).length;

/**
 * Shortens `text` to at most `maxBytes` UTF-8 bytes, cutting at the last
 * word boundary that still fits and appending "…". Text within the limit
 * is returned unchanged.
 */
export function truncateBytes(text, maxBytes) {
	if (byteLength(text) <= maxBytes) return text;
	const budget = maxBytes - byteLength('…');
	let cut = '';
	for (const ch of text) {
		if (byteLength(cut + ch) > budget) break;
		cut += ch;
	}
	// Cut mid-word? Drop the partial word (unless it is the only one).
	if (/\S/.test(text[cut.length] ?? ' ')) {
		const space = cut.search(/\s\S*$/);
		if (space > 0) cut = cut.slice(0, space);
	}
	return `${cut.trimEnd().replace(/[\s,;:.–—-]+$/, '')}…`;
}

function assertKey(key, what) {
	if (typeof key !== 'string' || !KEY_PATTERN.test(key)) {
		throw new Error(`community-manifest: ${what} "${key}" does not match ${KEY_PATTERN}`);
	}
}

/** ISO 8601 without milliseconds, as in the spec example. */
function isoSeconds(date) {
	return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/** Calendar date (UTC) for `ueberarbeitet`. */
function isoDate(date) {
	return date.toISOString().slice(0, 10);
}

/**
 * @param {object} input
 * @param {ThemenbereichEntry[]} input.themenbereiche one entry per language variant
 * @param {BausteinEntry[]} input.bausteine one entry per published language variant
 * @param {RetiredEntry[]} [input.retired]
 * @param {GlossarEntry[] | null} [input.glossar] one entry per language variant; omitted/null emits no `glossar` key
 * @param {Date} input.generatedAt
 */
export function buildManifest({ themenbereiche, bausteine, retired = [], glossar = null, generatedAt }) {
	// ——— Themenbereiche: group the language variants by key ———
	const tbByKey = new Map();
	for (const t of themenbereiche) {
		assertKey(t.key, 'Themenbereich key');
		const group = tbByKey.get(t.key) ?? { key: t.key, order: t.order, slug: { de: null, en: null }, title: { de: null, en: null } };
		if (group.order !== t.order) {
			throw new Error(`community-manifest: Themenbereich "${t.key}" has different orders per language (${group.order} vs ${t.order})`);
		}
		group.slug[t.lang] = t.routeSlug;
		group.title[t.lang] = t.title;
		tbByKey.set(t.key, group);
	}
	for (const group of tbByKey.values()) {
		if (group.slug.de === null) throw new Error(`community-manifest: Themenbereich "${group.key}" has no German variant`);
	}
	const themenbereicheOut = [...tbByKey.values()].sort((a, b) => a.order - b.order);

	// ——— Published Bausteine: group DE/EN by translationKey ———
	const byKey = new Map();
	for (const b of bausteine) {
		assertKey(b.translationKey, 'Baustein translationKey');
		if (!tbByKey.has(b.themenbereich)) {
			throw new Error(`community-manifest: Baustein "${b.translationKey}" (${b.lang}) points at unknown Themenbereich "${b.themenbereich}"`);
		}
		const group = byKey.get(b.translationKey) ?? {
			key: b.translationKey,
			themenbereich: b.themenbereich,
			order: b.order,
			status: 'published',
			slug: { de: null, en: null },
			title: { de: null, en: null },
			ueberarbeitet: null,
			successors: [],
		};
		if (group.themenbereich !== b.themenbereich || group.order !== b.order) {
			throw new Error(
				`community-manifest: the language variants of Baustein "${b.translationKey}" disagree on Themenbereich/order (${group.themenbereich}:${group.order} vs ${b.themenbereich}:${b.order})`,
			);
		}
		if (group.slug[b.lang] !== null) {
			throw new Error(`community-manifest: two ${b.lang} Bausteine share translationKey "${b.translationKey}"`);
		}
		group.slug[b.lang] = b.slug;
		group.title[b.lang] = b.title;
		// The DE variant is the editorial lead; its revision date is the one
		// the forum compares thread dates against.
		if (b.lang === 'de' && b.ueberarbeitet instanceof Date) group.ueberarbeitet = isoDate(b.ueberarbeitet);
		byKey.set(b.translationKey, group);
	}
	for (const group of byKey.values()) {
		if (group.slug.de === null) throw new Error(`community-manifest: Baustein "${group.key}" has no German variant (DE is the lead language)`);
	}
	const tbOrder = new Map(themenbereicheOut.map((t, i) => [t.key, i]));
	const published = [...byKey.values()].sort(
		(a, b) => tbOrder.get(a.themenbereich) - tbOrder.get(b.themenbereich) || a.order - b.order,
	);

	// ——— Retired Bausteine ———
	const retiredOut = [];
	const seenRetired = new Set();
	for (const r of retired) {
		assertKey(r.key, 'retired Baustein key');
		if (byKey.has(r.key)) throw new Error(`community-manifest: retired Baustein "${r.key}" is still published`);
		if (seenRetired.has(r.key)) throw new Error(`community-manifest: retired Baustein "${r.key}" is listed twice`);
		seenRetired.add(r.key);
		for (const s of r.successors) {
			assertKey(s, `successor of "${r.key}"`);
			if (!byKey.has(s)) throw new Error(`community-manifest: successor "${s}" of retired Baustein "${r.key}" is not a published Baustein`);
		}
		retiredOut.push({
			key: r.key,
			themenbereich: null,
			order: null,
			status: 'retired',
			slug: { de: null, en: null },
			title: { de: null, en: null },
			ueberarbeitet: null,
			successors: [...r.successors],
		});
	}
	retiredOut.sort((a, b) => a.key.localeCompare(b.key));

	const manifest = {
		schemaVersion: SCHEMA_VERSION,
		generatedAt: isoSeconds(generatedAt),
		themenbereiche: themenbereicheOut,
		bausteine: [...published, ...retiredOut],
	};
	// Optional, so a board release that does not know the key yet still
	// parses the manifest (the website emits it only with NEWSLETTER_LIVE).
	if (glossar != null) manifest.glossar = buildGlossar(glossar);
	return manifest;
}

/** Glossary entries grouped DE/EN by translationKey, sorted by key. */
function buildGlossar(entries) {
	const byKey = new Map();
	for (const g of entries) {
		assertKey(g.translationKey, 'Glossar translationKey');
		assertKey(g.slug, `Glossar slug of "${g.translationKey}" (${g.lang})`);
		if (byteLength(g.title) > GLOSSAR_TITLE_MAX_BYTES) {
			throw new Error(`community-manifest: Glossar title of "${g.translationKey}" (${g.lang}) exceeds ${GLOSSAR_TITLE_MAX_BYTES} bytes`);
		}
		const group = byKey.get(g.translationKey) ?? {
			key: g.translationKey,
			slug: { de: null, en: null },
			title: { de: null, en: null },
			description: { de: null, en: null },
		};
		if (group.slug[g.lang] !== null) {
			throw new Error(`community-manifest: two ${g.lang} Glossar entries share translationKey "${g.translationKey}"`);
		}
		group.slug[g.lang] = g.slug;
		group.title[g.lang] = g.title;
		group.description[g.lang] = truncateBytes(g.description, GLOSSAR_DESCRIPTION_MAX_BYTES);
		byKey.set(g.translationKey, group);
	}
	for (const group of byKey.values()) {
		if (group.slug.de === null) throw new Error(`community-manifest: Glossar entry "${group.key}" has no German variant (DE is the lead language)`);
	}
	return [...byKey.values()].sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}
