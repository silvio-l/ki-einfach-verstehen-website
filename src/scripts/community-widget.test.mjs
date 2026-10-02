import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
	MAX_ASK_URL,
	QUESTION_LIMIT,
	allQuestionsUrl,
	askUrl,
	askWithContextUrl,
	questionsApiUrl,
	renderQuestions,
	statusOf,
	validateResponse,
} from './community-widget.js';

const ORIGIN = 'https://community.ki-einfach-verstehen.de';
const PAGE = 'https://ki-einfach-verstehen.de/de/bausteine/input-und-output/';

const askContext = (overrides = {}) =>
	askWithContextUrl({ origin: ORIGIN, key: 'input-und-output', lang: 'de', pageUrl: PAGE, quote: 'x', ...overrides });

/** The parsed `ref` and `quote` of an ask URL, plus its first parameters. */
function parseAsk(url) {
	const parsed = new URL(url);
	const params = parsed.searchParams;
	return {
		path: parsed.pathname,
		baustein: params.get('baustein'),
		lang: params.get('lang'),
		ref: params.get('ref'),
		quote: params.get('quote'),
	};
}

// ——— Minimal DOM stand-in: only the surface the widget is allowed to use
// (createElement, textContent, setAttribute, append). Anything else -- most
// importantly innerHTML -- does not exist here, so a render that reached
// for it would throw. serialize() escapes text the way a browser would.
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

class FakeText {
	constructor(text) {
		this.data = text;
	}
	serialize() {
		return escape(this.data);
	}
}

class FakeElement {
	constructor(tagName) {
		this.tagName = tagName.toUpperCase();
		this.attributes = {};
		this.childNodes = [];
	}
	get textContent() {
		return this.childNodes.map((n) => (n instanceof FakeText ? n.data : n.textContent)).join('');
	}
	set textContent(value) {
		this.childNodes = value === '' ? [] : [new FakeText(String(value))];
	}
	set className(value) {
		this.attributes.class = value;
	}
	get className() {
		return this.attributes.class ?? '';
	}
	setAttribute(name, value) {
		this.attributes[name] = String(value);
	}
	getAttribute(name) {
		return this.attributes[name] ?? null;
	}
	append(...nodes) {
		for (const node of nodes) this.childNodes.push(typeof node === 'string' ? new FakeText(node) : node);
	}
	querySelectorAll(selector) {
		const tag = selector.toUpperCase();
		const out = [];
		for (const n of this.childNodes) {
			if (n instanceof FakeElement) {
				if (n.tagName === tag) out.push(n);
				out.push(...n.querySelectorAll(selector));
			}
		}
		return out;
	}
	serialize() {
		const attrs = Object.entries(this.attributes)
			.map(([k, v]) => ` ${k}="${escape(v)}"`)
			.join('');
		return `<${this.tagName.toLowerCase()}${attrs}>${this.childNodes.map((n) => n.serialize()).join('')}</${this.tagName.toLowerCase()}>`;
	}
}

const doc = { createElement: (tag) => new FakeElement(tag) };

const item = (overrides = {}) => ({
	publicId: '01J9ABCDEF',
	title: 'Warum ist der Output eine Liste?',
	url: `${ORIGIN}/t/01J9ABCDEF/warum-ist-der-output-eine-liste`,
	lang: 'de',
	status: 'answered',
	answerCount: 3,
	helpfulCount: 2,
	...overrides,
});

test('the ask link carries key and language as query parameters', () => {
	assert.equal(askUrl({ origin: ORIGIN, key: 'input-und-output', lang: 'de' }), `${ORIGIN}/neu?baustein=input-und-output&lang=de`);
	assert.equal(askUrl({ origin: ORIGIN, key: 'input-und-output', lang: 'en' }), `${ORIGIN}/neu?baustein=input-und-output&lang=en`);
});

test('the API and overview URLs follow the forum contract', () => {
	assert.equal(
		questionsApiUrl({ origin: ORIGIN, key: 'input-und-output', lang: 'en' }),
		`${ORIGIN}/api/v1/bausteine/input-und-output/questions?lang=en&limit=${QUESTION_LIMIT}`,
	);
	assert.equal(allQuestionsUrl({ origin: ORIGIN, key: 'input-und-output' }), `${ORIGIN}/b/input-und-output`);
});

test('keys and languages are never interpolated raw into a URL', () => {
	assert.throws(() => askUrl({ origin: ORIGIN, key: '../admin?x=', lang: 'de' }), /key/);
	assert.throws(() => askUrl({ origin: ORIGIN, key: 'input-und-output', lang: 'fr' }), /lang/);
	assert.throws(() => questionsApiUrl({ origin: ORIGIN, key: 'a b', lang: 'de' }), /key/);
	assert.throws(() => allQuestionsUrl({ origin: ORIGIN, key: 'Input' }), /key/);
	assert.throws(() => askUrl({ origin: 'http://community.ki-einfach-verstehen.de', key: 'x', lang: 'de' }), /origin/);
	assert.throws(() => askUrl({ origin: `${ORIGIN}/`, key: 'x', lang: 'de' }), /origin/);
});

test('the ask-with-context link extends the ask link with ref and quote', () => {
	const quote = 'Ein Modell gibt für jedes Textstück einen Score aus, keine Entscheidung.';
	const url = askContext({ quote });
	assert.ok(url.startsWith(`${askUrl({ origin: ORIGIN, key: 'input-und-output', lang: 'de' })}&ref=`));
	const { path, baustein, lang, ref, quote: q } = parseAsk(url);
	assert.equal(path, '/neu');
	assert.equal(baustein, 'input-und-output');
	assert.equal(lang, 'de');
	assert.equal(q, quote);
	// The text fragment holds the first ~60 characters, cut at a word boundary.
	assert.equal(ref, `${PAGE}#:~:text=${encodeURIComponent('Ein Modell gibt für jedes Textstück einen Score aus, keine')}`);
	// Everything after `&ref=` is encoded: the fragment's own `#`, `%` and `:` never appear raw.
	const tail = url.slice(url.indexOf('&ref=') + 5);
	assert.doesNotMatch(tail, /[#:]/);
	assert.doesNotMatch(tail, /%[^0-9A-F]/);
});

test('the quote is whitespace-normalised and cut at 300 characters on a word boundary', () => {
	const { quote } = parseAsk(askContext({ quote: '  Mehrere\n\tWörter   mit\nUmbruch  ' }));
	assert.equal(quote, 'Mehrere Wörter mit Umbruch');
	const long = Array.from({ length: 80 }, (_, i) => `wort${i}`).join(' ');
	const cut = parseAsk(askContext({ quote: long })).quote;
	assert.ok(cut.length <= 300, `${cut.length} chars`);
	assert.ok(cut.endsWith('…'));
	const body = cut.slice(0, -1);
	assert.ok(long.startsWith(body));
	assert.doesNotMatch(body, /\s$/, 'no trailing space before the ellipsis');
	assert.ok(long.split(' ').includes(body.split(' ').at(-1)), 'cut lands between words');
	// Exactly at the limit: nothing is cut, no ellipsis.
	const exact = 'a'.repeat(300);
	assert.equal(parseAsk(askContext({ quote: exact })).quote, exact);
});

test('reserved text-fragment characters are percent-encoded inside ref', () => {
	const quote = 'Wert, Gewicht & Bias - alles Zahlen, die das Modell beim Training lernt.';
	const { ref } = parseAsk(askContext({ quote }));
	const directive = ref.slice(ref.indexOf('#:~:text=') + 9);
	assert.doesNotMatch(directive, /[-,&]/);
	assert.ok(directive.includes('%2D'));
	assert.ok(directive.includes('%2C'));
	assert.ok(directive.includes('%26'));
	assert.equal(decodeURIComponent(directive), 'Wert, Gewicht & Bias - alles Zahlen, die das Modell beim');
});

test('ref drops query and hash of the page URL and keeps origin and path', () => {
	const { ref } = parseAsk(askContext({ pageUrl: `${PAGE}?utm=x#alt`, quote: 'kurz' }));
	assert.equal(ref, PAGE);
	assert.throws(() => askContext({ pageUrl: 'not a url' }), /page URL/);
});

test('ref keeps the origin of the page it was built on (staging stays staging)', () => {
	// ExplainSimpler passes location.href, not the build's `site`, so the
	// staging board (website.origin = staging) accepts the ref.
	const staging = 'https://staging.ki-einfach-verstehen.de/de/bausteine/input-und-output/';
	const { ref } = parseAsk(askContext({ pageUrl: staging, quote: 'kurz' }));
	assert.ok(ref.startsWith(staging), ref);
	assert.ok(parseAsk(askContext({ quote: 'kurz' })).ref.startsWith(PAGE), 'production unchanged');
});

test('a short quote falls back to the nearest heading id, and without one to the bare page', () => {
	assert.equal(parseAsk(askContext({ quote: 'Score', headingId: 'eine-bewertung' })).ref, `${PAGE}#eine-bewertung`);
	assert.equal(parseAsk(askContext({ quote: 'Score' })).ref, PAGE);
	assert.equal(parseAsk(askContext({ quote: 'Score', headingId: '' })).ref, PAGE);
	// A heading id is never interpolated raw.
	assert.equal(parseAsk(askContext({ quote: 'Score', headingId: 'x y?z' })).ref, PAGE);
	// From 20 characters on, the text fragment wins over the heading.
	const twenty = 'zwanzig zeichen lang';
	assert.equal(twenty.length, 20);
	assert.equal(parseAsk(askContext({ quote: twenty, headingId: 'h' })).ref, `${PAGE}#:~:text=${encodeURIComponent(twenty)}`);
	assert.equal(parseAsk(askContext({ quote: twenty.slice(0, 19), headingId: 'h' })).ref, `${PAGE}#h`);
});

test('an empty quote yields the ask link plus ref only', () => {
	const url = askContext({ quote: '   ', headingId: 'abschnitt' });
	assert.equal(url, `${ORIGIN}/neu?baustein=input-und-output&lang=de&ref=${encodeURIComponent(`${PAGE}#abschnitt`)}`);
});

test('the URL stays under the cap: the quote shrinks first, the fragment goes last', () => {
	// Every character encodes to 9 bytes, so 300 of them alone would exceed the cap.
	const cjk = '模型为每个文本片段输出一个分数而不是一个决定'.repeat(20);
	const url = askContext({ quote: cjk });
	assert.ok(url.length <= MAX_ASK_URL, `${url.length} chars`);
	const { ref, quote } = parseAsk(url);
	assert.ok(quote.length < 300 && quote.endsWith('…'));
	assert.ok(ref.includes('#:~:text='), 'the fragment survives as long as a shorter quote suffices');
	// Emoji in the quote and the page path: shrinking the quote is not enough, the fragment goes.
	const emoji = '🧠'.repeat(400);
	const deep = askWithContextUrl({
		origin: ORIGIN,
		key: 'input-und-output',
		lang: 'de',
		pageUrl: `https://ki-einfach-verstehen.de/de/${'🧠'.repeat(60)}/`,
		quote: emoji,
	});
	assert.ok(deep.length <= MAX_ASK_URL, `${deep.length} chars`);
	assert.ok(!parseAsk(deep).ref.includes('#'));
	assert.ok(parseAsk(deep).quote.length > 0, 'a shortened quote still travels');
	// Ordinary prose never comes near the cap and keeps everything.
	const prose = askContext({ quote: 'Ein Modell gibt für jedes Textstück einen Score aus. '.repeat(10) });
	assert.ok(prose.length < 1200);
	assert.ok(parseAsk(prose).ref.includes('#:~:text='));
});

test('the ask-with-context link validates origin, key and language like the ask link', () => {
	assert.throws(() => askContext({ key: '../admin' }), /key/);
	assert.throws(() => askContext({ lang: 'fr' }), /lang/);
	assert.throws(() => askContext({ origin: 'http://community.ki-einfach-verstehen.de' }), /origin/);
});

test('a well-formed response yields total and items', () => {
	const data = { total: 7, questions: [item(), item({ publicId: 'b', status: 'open', answerCount: 0, helpfulCount: 0 })] };
	const result = validateResponse(data, ORIGIN);
	assert.equal(result.total, 7);
	assert.equal(result.items.length, 2);
	assert.deepEqual(result.items[0], item());
});

test('a bare array is accepted and counted', () => {
	const result = validateResponse([item(), item({ publicId: 'b' })], ORIGIN);
	assert.equal(result.total, 2);
	assert.equal(result.items.length, 2);
});

test('garbage responses yield null', () => {
	for (const bad of [null, undefined, 'text', 42, true, { questions: 'nope' }, { total: 'x' }]) {
		assert.equal(validateResponse(bad, ORIGIN), null, JSON.stringify(bad));
	}
});

test('items with a URL outside the forum thread space are dropped', () => {
	const bad = [
		item({ url: 'javascript:alert(1)' }),
		item({ url: 'https://evil.example/t/x' }),
		item({ url: `${ORIGIN}.evil.example/t/x` }),
		item({ url: `${ORIGIN}/admin` }),
		item({ url: `http://community.ki-einfach-verstehen.de/t/x` }),
		item({ url: 42 }),
	];
	const result = validateResponse({ total: bad.length + 1, questions: [...bad, item()] }, ORIGIN);
	assert.equal(result.items.length, 1);
	assert.equal(result.items[0].url, item().url);
});

test('items with wrong field types or values are dropped, extra fields are stripped', () => {
	const bad = [
		item({ publicId: 1 }),
		item({ title: '' }),
		item({ title: '   ' }),
		item({ title: ['x'] }),
		item({ lang: 'fr' }),
		item({ status: 'hidden' }),
		item({ answerCount: -1 }),
		item({ answerCount: 1.5 }),
		item({ helpfulCount: '2' }),
		'not an object',
		null,
	];
	const result = validateResponse({ questions: [...bad, item({ extra: '<script>' })] }, ORIGIN);
	assert.equal(result.items.length, 1);
	assert.equal('extra' in result.items[0], false);
});

test('an over-long title is cut, never passed through whole', () => {
	const result = validateResponse([item({ title: 'x'.repeat(1000) })], ORIGIN);
	assert.ok(result.items[0].title.length <= 300);
});

test('the list never exceeds the limit, whatever the API sends', () => {
	const many = Array.from({ length: 20 }, (_, i) => item({ publicId: `id${i}` }));
	const result = validateResponse({ total: 20, questions: many }, ORIGIN);
	assert.equal(result.items.length, QUESTION_LIMIT);
	assert.equal(result.total, 20);
});

test('attacker-controlled titles render as text, never as markup', () => {
	const container = doc.createElement('div');
	const payload = '<img src=x onerror=alert(1)>';
	const data = validateResponse([item({ title: payload }), item({ publicId: 'b', title: '"><script>alert(2)</script>' })], ORIGIN);
	renderQuestions(container, data, { doc, lang: 'de', allHref: allQuestionsUrl({ origin: ORIGIN, key: 'input-und-output' }) });
	const html = container.serialize();
	assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
	assert.ok(!html.includes('<img'));
	assert.ok(!html.includes('<script')); // nosemgrep: javascript.lang.security.audit.unknown-value-with-script-tag.unknown-value-with-script-tag -- asserts the tag is absent
	const links = container.querySelectorAll('a');
	assert.equal(links[0].textContent, payload);
	assert.equal(links[0].getAttribute('href'), item().url);
});

test('the rendered list shows count, status, answer count and the overview link', () => {
	const container = doc.createElement('div');
	const data = validateResponse(
		{
			total: 7,
			questions: [
				item(),
				item({ publicId: 'b', status: 'open', answerCount: 1 }),
				item({ publicId: 'c', status: 'open', answerCount: 0 }),
			],
		},
		ORIGIN,
	);
	renderQuestions(container, data, { doc, lang: 'de', allHref: `${ORIGIN}/b/input-und-output` });
	const text = container.textContent;
	assert.match(text, /7 Fragen/);
	assert.match(text, /3 Antworten · gelöst/);
	assert.match(text, /1 Antwort · noch nicht gelöst/);
	assert.match(text, /0 Antworten · unbeantwortet/);
	assert.doesNotMatch(text, /beantwortet(?!.)|offen/, 'the old accepted/not-accepted words are gone');
	const links = container.querySelectorAll('a');
	assert.equal(links.at(-1).getAttribute('href'), `${ORIGIN}/b/input-und-output`);
	assert.match(links.at(-1).textContent, /Alle Fragen ansehen/);
	assert.equal(links.at(-1).getAttribute('rel'), 'noopener');
});

test('English copy for English pages', () => {
	const container = doc.createElement('div');
	const data = validateResponse({ total: 1, questions: [item({ lang: 'en', status: 'answered', answerCount: 1 })] }, ORIGIN);
	renderQuestions(container, data, { doc, lang: 'en', allHref: `${ORIGIN}/b/input-und-output` });
	assert.match(container.textContent, /1 question(?!s)/);
	assert.match(container.textContent, /1 answer · solved/);
	assert.match(container.textContent, /See all questions/);
});

test('status: accepted answer = solved, no answer = unanswered, else not solved yet', () => {
	assert.equal(statusOf({ status: 'answered', answerCount: 2 }), 'answered');
	assert.equal(statusOf({ status: 'open', answerCount: 2 }), 'open');
	assert.equal(statusOf({ status: 'open', answerCount: 0 }), 'unanswered');
	const container = doc.createElement('div');
	const data = validateResponse({ total: 1, questions: [item({ lang: 'en', status: 'open', answerCount: 2 })] }, ORIGIN);
	renderQuestions(container, data, { doc, lang: 'en', allHref: `${ORIGIN}/b/x` });
	assert.match(container.textContent, /2 answers · not solved yet/);
});

test('zero questions render an invitation, not an empty list', () => {
	const container = doc.createElement('div');
	renderQuestions(container, { total: 0, items: [] }, { doc, lang: 'de', allHref: `${ORIGIN}/b/x` });
	assert.match(container.textContent, /Noch keine Fragen/);
	assert.equal(container.querySelectorAll('ul').length, 0);
});

test('rendering replaces any previous content of the container', () => {
	const container = doc.createElement('div');
	container.textContent = 'stale';
	renderQuestions(container, { total: 0, items: [] }, { doc, lang: 'de', allHref: `${ORIGIN}/b/x` });
	assert.doesNotMatch(container.textContent, /stale/);
});
