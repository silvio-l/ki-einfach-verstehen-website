// "Fragen aus der Community" widget (docs/community/spec.md §7.3): URL
// helpers, strict response validation and a DOM renderer that only ever
// uses createElement/textContent -- never innerHTML, never markup built from
// strings. Everything here is pure or takes the document as a parameter, so
// it is unit-tested with a minimal DOM stand-in (community-widget.test.mjs);
// the IntersectionObserver/fetch wiring lives in CommunityAsk.astro.
//
// Trust boundary: the forum API is operated by the project, but its data
// comes from forum members. Every field is treated as attacker-controlled.

export const QUESTION_LIMIT = 5;

/** Same pattern the manifest and the forum enforce for Baustein keys. */
const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LANGS = new Set(['de', 'en']);
const STATUSES = new Set(['open', 'answered']);
const MAX_TITLE_LENGTH = 300;

export const COPY = {
	de: {
		count: (n) => (n === 1 ? '1 Frage aus der Community' : `${n} Fragen aus der Community`),
		none: 'Noch keine Fragen zu diesem Baustein. Stell die erste.',
		// Same vocabulary as the board: "gelöst" = an accepted answer,
		// "unbeantwortet" = no answer at all.
		status: { answered: 'gelöst', open: 'noch nicht gelöst', unanswered: 'unbeantwortet' },
		answers: (n) => (n === 1 ? '1 Antwort' : `${n} Antworten`),
		all: 'Alle Fragen ansehen',
	},
	en: {
		count: (n) => (n === 1 ? '1 question from the community' : `${n} questions from the community`),
		none: 'No questions about this lesson yet. Ask the first one.',
		status: { answered: 'solved', open: 'not solved yet', unanswered: 'unanswered' },
		answers: (n) => (n === 1 ? '1 answer' : `${n} answers`),
		all: 'See all questions',
	},
};

function assertOrigin(origin) {
	let url;
	try {
		url = new URL(origin);
	} catch {
		throw new Error(`community-widget: invalid origin "${origin}"`);
	}
	if (url.protocol !== 'https:' || url.origin !== origin) {
		throw new Error(`community-widget: origin must be a bare https origin, got "${origin}"`);
	}
	return origin;
}

function assertKey(key) {
	if (typeof key !== 'string' || !KEY_PATTERN.test(key)) throw new Error(`community-widget: invalid Baustein key "${key}"`);
	return key;
}

function assertLang(lang) {
	if (!LANGS.has(lang)) throw new Error(`community-widget: invalid lang "${lang}"`);
	return lang;
}

/** "Frage zu diesem Baustein stellen" target. */
export function askUrl({ origin, key, lang }) {
	return `${assertOrigin(origin)}/neu?baustein=${encodeURIComponent(assertKey(key))}&lang=${assertLang(lang)}`;
}

// "In der Community fragen" from the explain-simpler menu (spec §7.3): the
// ask form additionally receives the passage the reader was stuck on and a
// link back to it. `ref` carries a text fragment (#:~:text=) so the forum's
// back-link lands right on the passage; a quote too short to be a reliable
// fragment falls back to the nearest heading id, and without one the page
// URL stands on its own. `quote` is never sent whole: 300 characters at a
// word boundary, and the total URL stays under MAX_ASK_URL -- the quote
// shrinks first, the fragment goes last.
export const MAX_ASK_URL = 2000;
const QUOTE_LIMIT = 300;
const QUOTE_STEP = 50;
const EXCERPT_LIMIT = 60;
const MIN_FRAGMENT_QUOTE = 20;
const HEADING_ID_PATTERN = /^[A-Za-z][\w.:-]*$/;

const collapse = (text) => (typeof text === 'string' ? text.replace(/\s+/g, ' ').trim() : '');

/** Cuts `text` to at most `limit` characters at a word boundary (`ellipsis` counts). */
function cutAtWord(text, limit, ellipsis = '') {
	if (text.length <= limit) return text;
	if (limit <= ellipsis.length) return '';
	const head = text.slice(0, limit - ellipsis.length);
	const space = head.lastIndexOf(' ');
	// A single over-long word is cut hard rather than dropped entirely -- but
	// never inside a surrogate pair, which encodeURIComponent would reject.
	const cut = (space > 0 ? head.slice(0, space) : head).replace(/[\uD800-\uDBFF]$/, '').trimEnd();
	return cut === '' ? '' : `${cut}${ellipsis}`;
}

/** Text fragment directive; `-`, `,` and `&` are reserved inside it and must be percent-encoded. */
function textFragment(excerpt) {
	return `#:~:text=${encodeURIComponent(excerpt).replace(/-/g, '%2D')}`;
}

/**
 * "In der Community fragen" target with the passage in tow.
 * @param {{ origin: string, key: string, lang: string, pageUrl: string, quote: string, headingId?: string }} input
 */
export function askWithContextUrl({ origin, key, lang, pageUrl, quote, headingId }) {
	const base = askUrl({ origin, key, lang });
	let page;
	try {
		page = new URL(pageUrl);
	} catch {
		throw new Error(`community-widget: invalid page URL "${pageUrl}"`);
	}
	const ref = `${page.origin}${page.pathname}`;
	const text = collapse(quote);
	const heading = typeof headingId === 'string' && HEADING_ID_PATTERN.test(headingId) ? `#${headingId}` : '';
	const fragment = text.length >= MIN_FRAGMENT_QUOTE ? textFragment(cutAtWord(text, EXCERPT_LIMIT)) : heading;

	const build = (limit, frag) => {
		const q = cutAtWord(text, limit, '…');
		return `${base}&ref=${encodeURIComponent(ref + frag)}${q ? `&quote=${encodeURIComponent(q)}` : ''}`;
	};
	let url = build(QUOTE_LIMIT, fragment);
	for (let limit = QUOTE_LIMIT - QUOTE_STEP; url.length > MAX_ASK_URL && limit >= QUOTE_STEP; limit -= QUOTE_STEP) {
		url = build(limit, fragment);
	}
	if (url.length > MAX_ASK_URL) url = build(QUOTE_STEP, '');
	if (url.length > MAX_ASK_URL) url = build(0, '');
	return url;
}

/** Public read API (spec §7.5). */
export function questionsApiUrl({ origin, key, lang, limit = QUESTION_LIMIT }) {
	return `${assertOrigin(origin)}/api/v1/bausteine/${encodeURIComponent(assertKey(key))}/questions?lang=${assertLang(lang)}&limit=${limit}`;
}

/** "Alle Fragen ansehen" target. */
export function allQuestionsUrl({ origin, key }) {
	return `${assertOrigin(origin)}/b/${encodeURIComponent(assertKey(key))}`;
}

const isCount = (n) => Number.isInteger(n) && n >= 0;

/** A thread URL must live under `<origin>/t/` -- anything else is dropped. */
function isThreadUrl(url, origin) {
	if (typeof url !== 'string') return false;
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}
	return parsed.origin === origin && parsed.username === '' && parsed.password === '' && parsed.pathname.startsWith('/t/');
}

function validateItem(raw, origin) {
	if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null;
	const { publicId, title, url, lang, status, answerCount, helpfulCount } = raw;
	if (typeof publicId !== 'string' || publicId === '') return null;
	if (typeof title !== 'string' || title.trim() === '') return null;
	if (!isThreadUrl(url, origin)) return null;
	if (!LANGS.has(lang) || !STATUSES.has(status)) return null;
	if (!isCount(answerCount) || !isCount(helpfulCount)) return null;
	return { publicId, title: title.trim().slice(0, MAX_TITLE_LENGTH), url, lang, status, answerCount, helpfulCount };
}

/**
 * Accepts either a bare array of questions or `{ total, questions }`
 * (`items` as an alias). Returns `{ total, items }` with every malformed
 * item dropped, or null when the response is not usable at all.
 * @param {unknown} data parsed JSON
 * @param {string} origin the forum origin thread URLs must belong to
 */
export function validateResponse(data, origin) {
	assertOrigin(origin);
	let list;
	let total;
	if (Array.isArray(data)) {
		list = data;
	} else if (data !== null && typeof data === 'object') {
		list = data.questions ?? data.items;
		if (!Array.isArray(list)) return null;
		if (data.total !== undefined && !isCount(data.total)) return null;
		total = data.total;
	} else {
		return null;
	}
	const items = [];
	for (const raw of list) {
		const item = validateItem(raw, origin);
		if (item) items.push(item);
		if (items.length === QUESTION_LIMIT) break;
	}
	return { total: total ?? items.length, items };
}

/**
 * Display state of a validated item: the API's "answered" (an accepted
 * answer) or "open", where an open question without any answer is
 * "unanswered".
 * @param {{ status: 'open' | 'answered', answerCount: number }} item
 * @returns {'answered' | 'open' | 'unanswered'}
 */
export function statusOf({ status, answerCount }) {
	if (status === 'answered') return 'answered';
	return answerCount === 0 ? 'unanswered' : 'open';
}

/**
 * Renders count, list and overview link into `container`, replacing its
 * content. Uses only createElement/textContent/setAttribute/append.
 * @param {{ textContent: string, append: (...nodes: unknown[]) => void }} container
 * @param {{ total: number, items: ReturnType<typeof validateItem>[] }} data
 * @param {{ doc: { createElement: (tag: string) => any }, lang: 'de' | 'en', allHref: string }} options
 */
export function renderQuestions(container, { total, items }, { doc, lang, allHref }) {
	const copy = COPY[assertLang(lang)];
	container.textContent = '';

	const count = doc.createElement('p');
	count.className = 'community-count';
	count.textContent = total === 0 ? copy.none : copy.count(total);
	container.append(count);

	if (items.length > 0) {
		const list = doc.createElement('ul');
		list.className = 'community-list';
		for (const item of items) {
			const li = doc.createElement('li');
			const link = doc.createElement('a');
			link.setAttribute('href', item.url);
			link.setAttribute('target', '_blank');
			link.setAttribute('rel', 'noopener');
			link.textContent = item.title;
			const meta = doc.createElement('span');
			meta.className = 'community-meta';
			const answers = doc.createElement('span');
			answers.textContent = copy.answers(item.answerCount);
			const state = statusOf(item);
			const status = doc.createElement('span');
			status.className = `community-status community-status--${state}`;
			status.textContent = copy.status[state];
			meta.append(answers, ' · ', status);
			li.append(link, meta);
			list.append(li);
		}
		container.append(list);
	}

	const more = doc.createElement('p');
	more.className = 'community-all';
	const all = doc.createElement('a');
	all.setAttribute('href', allHref);
	all.setAttribute('target', '_blank');
	all.setAttribute('rel', 'noopener');
	all.textContent = copy.all;
	more.append(all);
	container.append(more);
}
