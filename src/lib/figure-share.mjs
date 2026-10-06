// Pure helpers for taking a graphic along (docs/research/social-growth-loops.md
// §3 E2) and for the error-report back channel (E1): stable figure ids and
// anchors, the share/embed routes, attribution and citation texts, embed
// snippets and the prefilled GitHub issue link. No DOM, no Astro -- used at
// build time (Figure.astro, the figure share pages, the embed routes) and in
// the browser (the share dialog), and covered by figure-share.test.mjs.
// Plain JS (not .ts) so node --test can cover it without a build step.

export const SITE_NAME = 'KI einfach verstehen';
export const SITE_ORIGIN = 'https://ki-einfach-verstehen.de';

/** Content licence (code stays MIT, see LICENSE-CONTENT.md). */
export const CONTENT_LICENSE = {
	name: 'CC BY 4.0',
	url: { de: 'https://creativecommons.org/licenses/by/4.0/deed.de', en: 'https://creativecommons.org/licenses/by/4.0/' },
};

export const LESSON_SEGMENT = { de: 'bausteine', en: 'lessons' };
export const FIGURE_SEGMENT = { de: 'abbildung', en: 'figure' };
const ANCHOR_PREFIX = { de: 'abb', en: 'fig' };

const LANGS = new Set(['de', 'en']);

function assertLang(lang) {
	if (!LANGS.has(lang)) throw new Error(`figure-share: invalid lang "${lang}"`);
	return lang;
}

/**
 * Stable figure id: the graphic's file name without extension(s), e.g.
 * `/bausteine/x/text-zu-ids.svg` -> `text-zu-ids`. File names are
 * descriptive and unique within a Baustein (schreibanleitung.md §6), so the
 * id survives reordering, and the PNG -> WebP delivery swap
 * (rehype-content-images.mjs) keeps it unchanged.
 * @param {string} src
 */
export function figureIdFromSrc(src) {
	const file = String(src ?? '').split(/[?#]/)[0].split('/').pop() ?? '';
	const id = file
		.replace(/\.static\.svg$/i, '')
		.replace(/\.[a-z0-9]+$/i, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	if (!id) throw new Error(`figure-share: cannot derive a figure id from "${src}"`);
	return id;
}

/** In-page anchor of a figure: `abb-<id>` (DE) / `fig-<id>` (EN). */
export function figureAnchor(lang, id) {
	return `${ANCHOR_PREFIX[assertLang(lang)]}-${id}`;
}

/** In-page anchor of a live demo -- the id Demo.astro has always set. */
export function demoAnchor(lang, demo) {
	return `demo-${demo}-${assertLang(lang)}`;
}

export function lessonPath(lang, slug) {
	return `/${assertLang(lang)}/${LESSON_SEGMENT[lang]}/${slug}/`;
}

/** Share page of one figure, e.g. `/de/abbildung/<baustein-slug>/<fig-id>/`. */
export function figurePagePath(lang, slug, id) {
	return `/${assertLang(lang)}/${FIGURE_SEGMENT[lang]}/${slug}/${id}/`;
}

/** Rendered PNGs next to a figure page: social preview and download with source line. */
export const FIGURE_PNG = {
	de: { preview: 'vorschau.png', source: 'mit-quelle.png' },
	en: { preview: 'preview.png', source: 'with-source.png' },
};

/** e.g. `/de/abbildung/<slug>/<id>/mit-quelle.png`. */
export function figurePngPath(lang, slug, id, variant) {
	return `${figurePagePath(lang, slug, id)}${FIGURE_PNG[lang][variant]}`;
}

/** Minimal embed route of a live demo, e.g. `/embed/tokenizer/de/`. */
export function demoEmbedPath(lang, demo) {
	return `/embed/${demo}/${assertLang(lang)}/`;
}

/**
 * Which Baustein page a pathname belongs to, or null for any other page.
 * @param {string} pathname
 * @returns {{ lang: 'de' | 'en', slug: string } | null}
 */
export function parseLessonPath(pathname) {
	const m = /^\/(de|en)\/(bausteine|lessons)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(String(pathname ?? ''));
	if (!m || LESSON_SEGMENT[m[1]] !== m[2]) return null;
	return { lang: /** @type {'de' | 'en'} */ (m[1]), slug: m[3] };
}

// ——— Reading figures and demos out of a Baustein's MDX source ———

const ENTITIES = { amp: '&', quot: '"', lt: '<', gt: '>', apos: "'", nbsp: ' ' };
const decodeEntities = (s) =>
	s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, e) => {
		if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
		return ENTITIES[e.toLowerCase()] ?? all;
	});

function parseAttrs(source) {
	/** @type {Record<string, string>} */
	const attrs = {};
	for (const m of source.matchAll(/([A-Za-z][\w-]*)="([^"]*)"/g)) attrs[m[1]] = decodeEntities(m[2]);
	return attrs;
}

/** Heading text without inline markdown (links, emphasis, code). */
const plainHeading = (s) =>
	s
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/[*_`]/g, '')
		.trim();

/**
 * @typedef {{
 *   id: string, kind: 'icon' | 'illustration' | 'diagram' | 'mechanism',
 *   caption: string, src: string, staticSrc?: string, alt: string,
 *   width?: number, height?: number, section?: string
 * }} FigureSource
 */

/**
 * Every `<Figure>` in a Baustein's MDX source, in document order, with the
 * `##` section it sits in. Mechanism figures carry their static fallback
 * (`data-static-src`) and use the iframe title as alt text.
 * @param {string} body raw MDX body
 * @returns {FigureSource[]}
 */
export function extractFigures(body) {
	const text = String(body ?? '').replace(/```[\s\S]*?```/g, (block) => ' '.repeat(block.length));
	const headings = [...text.matchAll(/^##[ \t]+(.+)$/gm)].map((m) => ({ at: m.index ?? 0, text: plainHeading(m[1]) }));
	/** @type {FigureSource[]} */
	const figures = [];
	for (const m of text.matchAll(/<Figure\b([^>]*)>([\s\S]*?)<\/Figure>/g)) {
		const outer = parseAttrs(m[1]);
		const media = /<(img|iframe)\b([^>]*)>/.exec(m[2]);
		if (!media) continue;
		const inner = parseAttrs(media[2]);
		if (!inner.src) continue;
		const at = m.index ?? 0;
		const section = headings.filter((h) => h.at < at).pop()?.text;
		const kind = /** @type {FigureSource['kind']} */ (outer.kind ?? 'diagram');
		const width = Number(inner.width) || undefined;
		const height = Number(inner.height) || undefined;
		figures.push({
			id: figureIdFromSrc(inner.src),
			kind,
			caption: outer.caption ?? '',
			src: inner.src,
			...(inner['data-static-src'] ? { staticSrc: inner['data-static-src'] } : {}),
			alt: (media[1] === 'iframe' ? inner.title : inner.alt) ?? '',
			...(width ? { width } : {}),
			...(height ? { height } : {}),
			...(section ? { section } : {}),
		});
	}
	const seen = new Set();
	for (const f of figures) {
		if (seen.has(f.id)) throw new Error(`figure-share: two figures share the id "${f.id}" -- file names must be unique within a Baustein`);
		seen.add(f.id);
	}
	return figures;
}

/** Live demos the Baustein embeds (`<TokenizerDemo lang="de" />` -> `tokenizer`). */
export function extractDemos(body) {
	return [...String(body ?? '').matchAll(/<([A-Z][A-Za-z]*)Demo\b[^>]*\/>/g)].map((m) => m[1].toLowerCase());
}

/**
 * Pairs the figures of a DE Baustein with those of its EN counterpart for
 * hreflang. Both variants carry the same figures in the same order (one
 * translation per graphic), so pairing goes by position -- but only while
 * the two lists agree in length and kind, never a guessed pair.
 * @param {Pick<FigureSource, 'id' | 'kind'>[]} a
 * @param {Pick<FigureSource, 'id' | 'kind'>[]} b
 * @returns {Map<string, string>} id in `a` -> id in `b`
 */
export function pairFigures(a, b) {
	const pairs = new Map();
	if (a.length !== b.length || a.some((f, i) => f.kind !== b[i].kind)) return pairs;
	a.forEach((f, i) => pairs.set(f.id, b[i].id));
	return pairs;
}

// ——— Attribution and citations ———

const KIND_LABEL = {
	de: { figure: 'Abbildung', demo: 'Interaktive Demo' },
	en: { figure: 'Figure', demo: 'Interactive demo' },
};

/**
 * The attribution line CC BY asks for:
 * „KI einfach verstehen, ‚<Titel>‘, CC BY 4.0, <URL>“.
 * @param {{ lang: 'de' | 'en', title: string, url: string }} input
 */
export function attributionText({ lang, title, url }) {
	return assertLang(lang) === 'de'
		? `${SITE_NAME}, ‚${title}‘, ${CONTENT_LICENSE.name}, ${url}`
		: `${SITE_NAME}, ‘${title}’, ${CONTENT_LICENSE.name}, ${url}`;
}

/**
 * APA 7 reference (corporate author, year, title, medium in brackets, URL).
 * @param {{ lang: 'de' | 'en', title: string, url: string, year: number | string, kind?: 'figure' | 'demo' }} input
 */
export function apaCitation({ lang, title, url, year, kind = 'figure' }) {
	return `${SITE_NAME}. (${year}). ${title} [${KIND_LABEL[assertLang(lang)][kind]}]. ${url}`;
}

/** Escapes the characters BibTeX/LaTeX treat specially in a field value. */
function bibEscape(s) {
	return String(s)
		.replace(/\\/g, '\\textbackslash{}')
		.replace(/([{}&%$#_])/g, '\\$1')
		.replace(/~/g, '\\textasciitilde{}')
		.replace(/\^/g, '\\textasciicircum{}');
}

/**
 * BibTeX `@misc` entry.
 * @param {{ lang: 'de' | 'en', title: string, url: string, year: number | string, key: string, kind?: 'figure' | 'demo' }} input
 */
export function bibtexCitation({ lang, title, url, year, key, kind = 'figure' }) {
	const citeKey = String(key).replace(/[^A-Za-z0-9:_-]+/g, '-');
	const licence = lang === 'de' ? 'Lizenz' : 'License';
	return [
		`@misc{${citeKey},`,
		`  author       = {{${SITE_NAME}}},`,
		`  title        = {${bibEscape(title)}},`,
		`  howpublished = {${KIND_LABEL[assertLang(lang)][kind]}, \\url{${url}}},`,
		`  year         = {${year}},`,
		`  note         = {${licence}: ${CONTENT_LICENSE.name}},`,
		`}`,
	].join('\n');
}

// ——— Embed snippets ———

const escapeHtml = (s) =>
	String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

/** Text of the attribution link inside an embed (without the licence, which is its own link). */
const creditLine = (lang, title) => (lang === 'de' ? `${SITE_NAME}, ‚${title}‘` : `${SITE_NAME}, ‘${title}’`);

/**
 * `<figure>` snippet for a still graphic: the image from this site, the
 * caption and a figcaption that carries the attribution with a backlink to
 * the figure page and the licence link.
 * @param {{ lang: 'de' | 'en', title: string, caption: string, alt: string, imageUrl: string, pageUrl: string, width?: number, height?: number }} input
 */
export function figureEmbedHtml({ lang, title, caption, alt, imageUrl, pageUrl, width, height }) {
	assertLang(lang);
	const size = width && height ? ` width="${width}" height="${height}"` : '';
	return [
		'<figure>',
		`  <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(alt)}"${size} loading="lazy" style="max-width:100%;height:auto">`,
		`  <figcaption>${escapeHtml(caption)} <small><a href="${escapeHtml(pageUrl)}">${escapeHtml(creditLine(lang, title))}</a>, <a href="${CONTENT_LICENSE.url[lang]}" rel="license">${CONTENT_LICENSE.name}</a></small></figcaption>`,
		'</figure>',
	].join('\n');
}

/** Message the embed pages post to their parent window with their content height. */
export const EMBED_HEIGHT_MESSAGE = 'kevEmbedHeight';

/**
 * `<iframe>` snippet for a live demo, followed by a visible attribution
 * line and an optional one-line resize listener (sites that strip scripts
 * keep the fixed height).
 * @param {{ lang: 'de' | 'en', title: string, demoTitle: string, embedUrl: string, pageUrl: string, height?: number }} input
 */
export function demoEmbedHtml({ lang, title, demoTitle, embedUrl, pageUrl, height = 720 }) {
	assertLang(lang);
	const frameTitle = lang === 'de' ? `Live-Demo: ${demoTitle}` : `Live demo: ${demoTitle}`;
	const origin = new URL(embedUrl).origin;
	return [
		`<iframe src="${escapeHtml(embedUrl)}" title="${escapeHtml(frameTitle)}" width="100%" height="${height}" style="border:0;max-width:56rem" loading="lazy" data-kev-embed></iframe>`,
		`<p><small><a href="${escapeHtml(pageUrl)}">${escapeHtml(creditLine(lang, title))}</a>, <a href="${CONTENT_LICENSE.url[lang]}" rel="license">${CONTENT_LICENSE.name}</a></small></p>`,
		`<script>addEventListener('message',function(e){if(e.origin!=='${origin}'||!e.data||typeof e.data.${EMBED_HEIGHT_MESSAGE}!=='number')return;document.querySelectorAll('iframe[data-kev-embed]').forEach(function(f){if(f.contentWindow===e.source)f.style.height=e.data.${EMBED_HEIGHT_MESSAGE}+'px'})})</script>`,
	].join('\n');
}

// ——— "Fehler melden / Verbesserung vorschlagen" (E1 back channel) ———

export const ISSUE_TEMPLATE = 'fehler-im-baustein.yml';
export const MAX_ISSUE_URL = 2000;
const ABSCHNITT_LIMIT = 400;

const collapse = (s) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim() : '');

function cutAtWord(text, limit) {
	if (text.length <= limit) return text;
	const head = text.slice(0, Math.max(0, limit - 1));
	const space = head.lastIndexOf(' ');
	const cut = (space > limit / 2 ? head.slice(0, space) : head).replace(/[\uD800-\uDBFF]$/, '').trimEnd();
	return cut ? `${cut}…` : '';
}

/**
 * The `abschnitt` field: a marked passage (quoted, with its heading) wins
 * over the heading the reader is currently in.
 * @param {{ lang: 'de' | 'en', heading?: string, passage?: string }} input
 */
export function issueSection({ lang, heading, passage }) {
	const h = collapse(heading);
	const p = collapse(passage);
	if (!p) return h;
	const quoted = lang === 'de' ? `„${p}“` : `“${p}”`;
	if (!h) return quoted;
	return lang === 'de' ? `${quoted} (Abschnitt „${h}“)` : `${quoted} (section “${h}”)`;
}

/**
 * Prefilled issue form in the public website repo. Field ids match the
 * issue template exactly: `baustein`, `abschnitt` (`art` and `beschreibung`
 * stay for the reader). The section text shrinks until the URL fits.
 * @param {{ repoUrl: string, lang: 'de' | 'en', title: string, pageUrl: string, heading?: string, passage?: string }} input
 */
export function issueUrl({ repoUrl, lang, title, pageUrl, heading, passage }) {
	assertLang(lang);
	const base = `${String(repoUrl).replace(/\/+$/, '')}/issues/new`;
	const issueTitle = lang === 'de' ? `[Baustein] ${title}` : `[Lesson] ${title}`;
	const build = (limit) => {
		const params = new URLSearchParams({ template: ISSUE_TEMPLATE, baustein: pageUrl });
		const abschnitt = cutAtWord(issueSection({ lang, heading, passage }), limit);
		if (abschnitt) params.set('abschnitt', abschnitt);
		params.set('title', issueTitle);
		return `${base}?${params.toString().replace(/\+/g, '%20')}`;
	};
	let limit = ABSCHNITT_LIMIT;
	let url = build(limit);
	while (url.length > MAX_ISSUE_URL && limit > 0) {
		limit = Math.max(0, limit - 50);
		url = build(limit);
	}
	return url;
}

// ——— Credits (`dank` frontmatter) ———

export const CREDIT_KINDS = ['korrektur', 'community-frage', 'uebersetzung', 'quelle', 'verbesserung'];

const CREDIT_LABEL = {
	de: { korrektur: 'Korrektur', 'community-frage': 'Community-Frage', uebersetzung: 'Übersetzung', quelle: 'Quellenhinweis', verbesserung: 'Verbesserungsvorschlag' },
	en: { korrektur: 'correction', 'community-frage': 'community question', uebersetzung: 'translation', quelle: 'source suggestion', verbesserung: 'suggested improvement' },
};

/** Human label of a credit kind. */
export function creditLabel(lang, kind) {
	return CREDIT_LABEL[assertLang(lang)][kind] ?? kind;
}

/**
 * Credits in display order: oldest first (dated before undated), so the
 * list reads like a changelog and never like a ranking.
 * @template {{ datum?: Date | string }} T
 * @param {T[]} credits
 * @returns {T[]}
 */
export function sortCredits(credits) {
	const time = (c) => (c.datum ? new Date(c.datum).getTime() : Number.POSITIVE_INFINITY);
	return [...(credits ?? [])].map((c, i) => ({ c, i })).sort((a, b) => time(a.c) - time(b.c) || a.i - b.i).map(({ c }) => c);
}

export { escapeHtml };
