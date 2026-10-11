#!/usr/bin/env node
// Fails when the German and English content drift apart. Every Baustein,
// glossary entry and Themenbereich exists in both languages, and the two
// variants agree on everything that is not wording: structure, quiz keys,
// sources, figures, demos and which pages they link to. A translation that
// lost a quiz question, a figure that still shows the German graphic, a lesson
// missing from one language's topic list -- each of these is a red lint, not
// something a reader finds on the live site.
//
// Deliberate, justified differences are not hard-coded here. They live in
// scripts/language-parity-exceptions.yaml, one entry per check and key, each
// with its reason, so every exception is visible and reviewable.
//
//   node scripts/check-language-parity.mjs   exit 1 on any unexplained drift

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { splitFrontmatter } from './export-lessons.mjs';

const LANGS = ['de', 'en'];
const SEGMENT = {
	bausteine: { de: 'bausteine', en: 'lessons' },
	glossar: { de: 'glossar', en: 'glossary' },
};

function readCollection(root, collection, lang) {
	const dir = join(root, 'src/content', collection, lang);
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((f) => ['.md', '.mdx'].includes(extname(f)))
		.sort()
		.map((file) => {
			const { data, body } = splitFrontmatter(readFileSync(join(dir, file), 'utf8'), file);
			return { slug: file.slice(0, -extname(file).length), file: `${collection}/${lang}/${file}`, data, body };
		});
}

/** Body without fenced code, so example markup in code blocks is not counted. */
const prose = (body) => body.replace(/^```[\s\S]*?^```/gm, '');

/** "foo-en.svg" and "foo.svg" name the same figure in two languages. */
const neutralAsset = (src) => src.replace(/-(?:de|en)(\.[a-z0-9]+)$/i, '$1');

/** True when an SVG under public/ draws visible words (a <text> with letters). */
function svgHasWords(root, src) {
	const file = join(root, 'public', src);
	if (!existsSync(file)) return false;
	return [...readFileSync(file, 'utf8').matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].some((m) => /\p{L}{2,}/u.test(m[1].replace(/<[^>]+>/g, '')));
}

/** Structural fingerprint of a Baustein body. */
export function bodyShape(body) {
	const text = prose(body);
	const imgs = [...text.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g), ...text.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]);
	return {
		h2: (text.match(/^## /gm) ?? []).length,
		h3: (text.match(/^### /gm) ?? []).length,
		figures: [...text.matchAll(/<Figure\b[^>]*\bkind="([^"]+)"/g)].map((m) => m[1]),
		images: imgs,
		components: [...text.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((m) => m[1]).filter((c) => c !== 'Figure'),
		demoLangs: [...text.matchAll(/<[A-Z][A-Za-z0-9]*Demo\b[^>]*\blang="([a-z]+)"/g)].map((m) => m[1]),
	};
}

/** Internal links of a text as language-independent keys ("bausteine:<translationKey>"). */
export function linkKeys(text, lang, slugToKey) {
	const keys = [];
	const foreign = [];
	for (const m of prose(text).matchAll(/\/(de|en)\/(bausteine|lessons|glossar|glossary)\/([a-z0-9-]+)/g)) {
		const [, linkLang, segment, slug] = m;
		const kind = segment === SEGMENT.bausteine[linkLang] ? 'bausteine' : segment === SEGMENT.glossar[linkLang] ? 'glossar' : null;
		if (linkLang !== lang || !kind) {
			foreign.push(m[0]);
			continue;
		}
		keys.push(`${kind}:${slugToKey[kind][lang].get(slug) ?? `?${slug}`}`);
	}
	return { keys: keys.sort(), foreign };
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const show = (v) => JSON.stringify(v);

/** Every drift as { check, key, message }. */
export function findDrift(root) {
	const problems = [];
	const add = (check, key, message) => problems.push({ check, key, message });

	const coll = (name) => Object.fromEntries(LANGS.map((lang) => [lang, readCollection(root, name, lang)]));
	const bausteine = coll('bausteine');
	const glossar = coll('glossar');
	const topics = coll('themenbereiche');
	const slugToKey = Object.fromEntries(
		[['bausteine', bausteine], ['glossar', glossar]].map(([kind, entries]) => [
			kind,
			Object.fromEntries(LANGS.map((lang) => [lang, new Map(entries[lang].map((e) => [e.slug, e.data.translationKey]))])),
		]),
	);

	// Pairs by translationKey; a missing or doubled partner is drift on its own.
	const pairsOf = (kind, entries) => {
		const byKey = new Map();
		for (const lang of LANGS)
			for (const e of entries[lang]) {
				const key = e.data.translationKey;
				if (!key) {
					add(`${kind}-pair`, e.file, `${e.file} has no translationKey`);
					continue;
				}
				const slot = byKey.get(key) ?? {};
				if (slot[lang]) add(`${kind}-pair`, key, `two ${lang} files share translationKey "${key}": ${slot[lang].file}, ${e.file}`);
				slot[lang] = e;
				byKey.set(key, slot);
			}
		const pairs = [];
		for (const [key, slot] of byKey) {
			const missing = LANGS.filter((l) => !slot[l]);
			if (missing.length) add(`${kind}-pair`, key, `"${key}" exists only in ${LANGS.filter((l) => slot[l]).join('')} (${Object.values(slot)[0].file}), ${missing.join('/')} is missing`);
			else pairs.push([key, slot]);
		}
		return pairs;
	};

	const compareLinks = (check, key, de, en) => {
		const d = linkKeys(de.body, 'de', slugToKey);
		const e = linkKeys(en.body, 'en', slugToKey);
		for (const [entry, f] of [[de, d], [en, e]])
			for (const link of f.foreign) add(`${check}-foreign-link`, key, `${entry.file} links to ${link} (wrong language or unknown section)`);
		for (const [entry, f] of [[de, d], [en, e]])
			for (const k of f.keys.filter((x) => x.includes(':?'))) add(`${check}-dead-link`, key, `${entry.file} links to a page that does not exist: ${k}`);
		const ds = [...new Set(d.keys)].sort();
		const es = [...new Set(e.keys)].sort();
		if (!same(ds, es)) {
			const onlyDe = ds.filter((x) => !es.includes(x));
			const onlyEn = es.filter((x) => !ds.includes(x));
			add(`${check}-links`, key, `link targets differ: only DE ${show(onlyDe)}, only EN ${show(onlyEn)}`);
		}
	};

	for (const [key, { de, en }] of pairsOf('baustein', bausteine)) {
		for (const field of ['themenbereich', 'order', 'videoId'])
			if (!same(de.data[field], en.data[field])) add('baustein-meta', key, `${field}: DE ${show(de.data[field])} vs EN ${show(en.data[field])}`);
		const quiz = (e) => (e.data.quiz ?? []).map((q) => ({ id: q.id, richtig: q.richtig, optionen: q.optionen?.length, lernziel: q.lernziel, aufgabe: q.aufgabe }));
		if (!same(quiz(de), quiz(en))) add('baustein-quiz', key, `quiz differs (id, richtig, number of options, lernziel or aufgabe): DE ${show(quiz(de))} vs EN ${show(quiz(en))}`);
		const quellen = (e) => (e.data.quellen ?? []).map((q) => q.url);
		if (!same(quellen(de), quellen(en))) add('baustein-quellen', key, `sources differ (count or URL order): DE ${show(quellen(de))} vs EN ${show(quellen(en))}`);
		const ds = bodyShape(de.body);
		const es = bodyShape(en.body);
		for (const field of ['h2', 'h3', 'figures', 'components'])
			if (!same(ds[field], es[field])) add('baustein-structure', key, `${field}: DE ${show(ds[field])} vs EN ${show(es[field])}`);
		// EN often uses translated file names, so compare counts, and catch one
		// shared file whose graphic carries words (it can only fit one language).
		if (ds.images.length !== es.images.length) add('baustein-images', key, `number of images differs: DE ${show(ds.images)} vs EN ${show(es.images)}`);
		for (const src of ds.images.filter((s) => es.images.includes(s) && s.endsWith('.svg')))
			if (svgHasWords(root, src)) add('baustein-shared-text-image', `${key}:${src}`, `DE and EN both show ${src}, which contains text -- one language reads the other's words`);
		// A language variant of an image exists -> each language must use its own.
		for (const [lang, shape] of [['de', ds], ['en', es]])
			for (const src of shape.images) {
				if (!src.startsWith('/')) continue;
				const other = lang === 'de' ? 'en' : 'de';
				const ext = extname(src);
				const base = neutralAsset(src).slice(0, -ext.length);
				const own = `${base}-${lang}${ext}`;
				const foreign = `${base}-${other}${ext}`;
				if (src === foreign || (src === `${base}${ext}` && lang === 'en' && existsSync(join(root, 'public', own))))
					add('baustein-image-language', `${key}:${src}`, `${lang === 'de' ? de.file : en.file} shows ${src}, but its ${lang} variant ${src === foreign ? `${base}${ext} / ${own}` : own} exists`);
			}
		for (const [lang, shape, entry] of [['de', ds, de], ['en', es, en]])
			for (const l of shape.demoLangs) if (l !== lang) add('baustein-demo-language', key, `${entry.file} renders a demo with lang="${l}"`);
		compareLinks('baustein', key, de, en);
	}

	for (const [key, { de, en }] of pairsOf('glossar', glossar)) compareLinks('glossar', key, de, en);

	// Themenbereiche: same keys, same planned orders, same published lessons.
	for (const [key, { de, en }] of pairsOf('themenbereich', topics)) {
		if (!same(de.data.order, en.data.order)) add('themenbereich-meta', key, `order: DE ${de.data.order} vs EN ${en.data.order}`);
		const planned = (e) => (e.data.bausteine ?? []).map((b) => b.order).sort((a, b) => a - b);
		if (!same(planned(de), planned(en))) add('themenbereich-plan', key, `planned orders differ: DE ${show(planned(de))} vs EN ${show(planned(en))}`);
	}
	for (const lang of LANGS) {
		const listed = new Set(topics[lang].flatMap((t) => (t.data.bausteine ?? []).map((b) => `${t.data.translationKey}:${b.order}`)));
		for (const b of bausteine[lang])
			if (!listed.has(`${b.data.themenbereich}:${b.data.order}`))
				add('themenbereich-listing', `${lang}:${b.data.translationKey}`, `${b.file} (themenbereich ${b.data.themenbereich}, order ${b.data.order}) is not listed in its ${lang} Themenbereich`);
	}

	// Community redirects: every retired page has its counterpart in the other language.
	const redirectsFile = join(root, 'src/content/community/redirects.json');
	if (existsSync(redirectsFile)) {
		const redirects = JSON.parse(readFileSync(redirectsFile, 'utf8'));
		const keyOf = (path) => {
			const m = /^\/(de|en)\/(bausteine|lessons)\/([a-z0-9-]+)\/$/.exec(path);
			return m ? slugToKey.bausteine[m[1]].get(m[3]) ?? `?${m[3]}` : null;
		};
		const targets = Object.fromEntries(LANGS.map((l) => [l, []]));
		for (const [from, { to }] of Object.entries(redirects)) {
			const lang = from.split('/')[1];
			if (!LANGS.includes(lang) || !to.startsWith(`/${lang}/`)) add('redirects-language', from, `redirect ${from} -> ${to} crosses languages`);
			else targets[lang].push(keyOf(to) ?? to);
		}
		const count = (list) => list.reduce((m, k) => ({ ...m, [k]: (m[k] ?? 0) + 1 }), {});
		if (!same(Object.entries(count(targets.de)).sort(), Object.entries(count(targets.en)).sort()))
			add('redirects-parity', 'redirects.json', `redirect targets differ: DE ${show(count(targets.de))} vs EN ${show(count(targets.en))}`);
	}

	// README.md (EN) and README.de.md: same sections around the generated contents.
	const readme = (f) => (existsSync(join(root, f)) ? readFileSync(join(root, f), 'utf8') : '');
	const sections = (t) => (t.match(/^#{1,3} /gm) ?? []).length;
	if (sections(readme('README.md')) !== sections(readme('README.de.md')))
		add('readme-structure', 'README', `README.md has ${sections(readme('README.md'))} headings, README.de.md ${sections(readme('README.de.md'))}`);

	// Term register: every term in both languages.
	const begriffeFile = join(root, '../content/begriffe.yaml');
	if (existsSync(begriffeFile))
		for (const b of parseYaml(readFileSync(begriffeFile, 'utf8'))?.begriffe ?? [])
			if (!b.de || !b.en) add('begriffe', b.de ?? b.en ?? '?', `begriffe.yaml: "${b.de ?? b.en}" lacks its ${b.de ? 'en' : 'de'} term`);

	return problems;
}

/** Exceptions file: [{ check, key, reason }]; every entry needs a reason and must still be needed. */
export function applyExceptions(problems, exceptions) {
	const errors = [];
	for (const e of exceptions) if (!e?.check || !e?.key || !String(e?.reason ?? '').trim()) errors.push(`exception without check, key or reason: ${show(e)}`);
	const used = new Set();
	const open = problems.filter((p) => {
		const i = exceptions.findIndex((e) => e.check === p.check && e.key === p.key);
		if (i === -1) return true;
		used.add(i);
		return false;
	});
	exceptions.forEach((e, i) => {
		if (!used.has(i)) errors.push(`stale exception (no longer needed, remove it): ${e.check} ${e.key}`);
	});
	return { open, errors };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const root = fileURLToPath(new URL('..', import.meta.url));
	const exceptionsFile = join(root, 'scripts/language-parity-exceptions.yaml');
	const exceptions = existsSync(exceptionsFile) ? parseYaml(readFileSync(exceptionsFile, 'utf8'))?.ausnahmen ?? [] : [];
	const { open, errors } = applyExceptions(findDrift(root), exceptions);
	for (const p of open) console.error(`✖ [${p.check}] ${p.key}: ${p.message}`);
	for (const e of errors) console.error(`✖ ${e}`);
	if (open.length || errors.length) {
		console.error(`\ncheck-language-parity: ${open.length + errors.length} problem(s). Fix the drift, or justify a deliberate difference in scripts/language-parity-exceptions.yaml.`);
		process.exit(1);
	}
	console.log('check-language-parity: DE and EN agree.');
}
