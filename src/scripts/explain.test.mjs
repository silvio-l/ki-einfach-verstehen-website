import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
	MAX_URL,
	MODES,
	PROVIDERS,
	buildPrompt,
	launchPlan,
	normalizeExcerpt,
	resolveProvider,
} from './explain.js';

const base = {
	lang: 'de',
	mode: 'simpler',
	excerpt: 'Ein Modell gibt für jedes Textstück einen Score aus.',
	title: 'Input und Output',
	section: 'Eine Bewertung für jede Möglichkeit',
	url: 'https://ki-einfach-verstehen.de/de/bausteine/input-und-output/',
};

test('the German prompt carries excerpt, title, section and source link', () => {
	const prompt = buildPrompt(base);
	assert.ok(prompt.includes(base.excerpt));
	assert.ok(prompt.includes('„Input und Output“'));
	assert.ok(prompt.includes('„Eine Bewertung für jede Möglichkeit“'));
	assert.ok(prompt.includes(base.url));
});

test('every mode asks for a simpler explanation than the article, for a lay reader', () => {
	for (const mode of MODES) {
		const prompt = buildPrompt({ ...base, mode });
		assert.match(prompt, /deutlich einfacher, als der Artikel es tut/);
		assert.match(prompt, /Laie ohne technisches Vorwissen/);
		assert.match(prompt, /Antworte auf Deutsch/);
	}
});

test('the three modes produce three different instructions', () => {
	const prompts = MODES.map((mode) => buildPrompt({ ...base, mode }));
	assert.equal(new Set(prompts).size, 3);
	assert.match(buildPrompt({ ...base, mode: 'simpler' }), /Vergleich aus dem Alltag/);
	assert.match(buildPrompt({ ...base, mode: 'example' }), /Beispiel/);
	assert.match(buildPrompt({ ...base, mode: 'detailed' }), /Missverständnisse/);
});

test('the English prompt is fully English', () => {
	const prompt = buildPrompt({ ...base, lang: 'en', title: 'Input and output', section: 'A score for every option' });
	assert.match(prompt, /much simpler than the article does/);
	assert.match(prompt, /complete beginner/);
	assert.match(prompt, /Answer in English/);
	assert.ok(prompt.includes('"Input and output"'));
	assert.doesNotMatch(prompt, /Deutsch|Artikel|„/);
});

test('a selection carries its surrounding paragraph as context', () => {
	const context = 'Halte diese zwei Schritte auseinander. Das Zusammenzählen der trainierten Gewichte bewertet die Mail.';
	const prompt = buildPrompt({ ...base, excerpt: 'trainierten Gewichte', context });
	assert.ok(prompt.includes('"""\ntrainierten Gewichte\n"""'));
	assert.match(prompt, /Sie steht in diesem Zusammenhang:/);
	assert.ok(prompt.includes(context));
	const en = buildPrompt({ ...base, lang: 'en', excerpt: 'trained weights', context: 'The trained weights score the mail.' });
	assert.match(en, /It appears in this context:/);
});

test('without context, or when the context is the excerpt itself, no context block appears', () => {
	assert.doesNotMatch(buildPrompt(base), /Zusammenhang/);
	assert.doesNotMatch(buildPrompt({ ...base, context: base.excerpt }), /Zusammenhang/);
});

test('a passage before the first heading omits the section part', () => {
	const prompt = buildPrompt({ ...base, section: '' });
	assert.doesNotMatch(prompt, /Abschnitt/);
	assert.ok(prompt.includes('„Input und Output“'));
});

test('an unknown mode or language is a programming error', () => {
	assert.throws(() => buildPrompt({ ...base, mode: 'eli5' }));
	assert.throws(() => buildPrompt({ ...base, lang: 'fr' }));
});

test('excerpts are trimmed and whitespace runs collapse to one space', () => {
	assert.equal(normalizeExcerpt('  Ein\n\n  Satz\t mit   Lücken  '), 'Ein Satz mit Lücken');
	assert.equal(normalizeExcerpt(''), '');
});

test('list items keep their line breaks', () => {
	assert.equal(normalizeExcerpt('- eins\n  - zwei '), '- eins\n- zwei');
});

test('each provider gets the prompt as a prefilled q parameter', () => {
	const prompt = buildPrompt(base);
	const expected = {
		chatgpt: 'https://chatgpt.com/',
		claude: 'https://claude.ai/new',
		perplexity: 'https://www.perplexity.ai/search',
	};
	assert.deepEqual(Object.keys(PROVIDERS), Object.keys(expected));
	for (const [id, origin] of Object.entries(expected)) {
		const plan = launchPlan({ provider: id, prompt });
		const url = new URL(plan.href);
		assert.equal(`${url.origin}${url.pathname}`, origin);
		assert.equal(url.searchParams.get('q'), prompt);
		assert.equal(plan.viaClipboard, false);
	}
});

test('spaces travel as %20, never as a form-style plus', () => {
	const plan = launchPlan({ provider: 'chatgpt', prompt: 'a b+c' });
	assert.equal(plan.href, 'https://chatgpt.com/?q=a%20b%2Bc');
});

test('a typical full paragraph travels in the URL', () => {
	const paragraph = 'Das Modell zählt die Gewichte der Wörter zusammen und vergleicht das Ergebnis mit einer Schwelle. '.repeat(10);
	const plan = launchPlan({ provider: 'chatgpt', prompt: buildPrompt({ ...base, excerpt: paragraph }) });
	assert.equal(plan.viaClipboard, false);
	assert.ok(plan.href.length <= MAX_URL);
});

test('a URL at the limit still travels, one character more goes via the clipboard', () => {
	const frame = 'https://chatgpt.com/?q='.length;
	const atLimit = launchPlan({ provider: 'chatgpt', prompt: 'a'.repeat(MAX_URL - frame) });
	assert.equal(atLimit.viaClipboard, false);
	assert.equal(atLimit.href.length, MAX_URL);

	const over = launchPlan({ provider: 'claude', prompt: 'a'.repeat(MAX_URL) });
	assert.equal(over.viaClipboard, true);
	assert.equal(over.href, 'https://claude.ai/new');
});

test('the limit counts encoded characters, so umlauts weigh more', () => {
	const plain = launchPlan({ provider: 'chatgpt', prompt: 'a'.repeat(1500) });
	const umlauts = launchPlan({ provider: 'chatgpt', prompt: 'ä'.repeat(1500) });
	assert.equal(plain.viaClipboard, false);
	assert.equal(umlauts.viaClipboard, true);
});

test('the prompt itself is never cut, even when it goes via the clipboard', () => {
	const long = 'Wort '.repeat(600).trim();
	const prompt = buildPrompt({ ...base, excerpt: long });
	assert.ok(prompt.includes(long));
});

test('unknown or tampered provider ids fall back to ChatGPT', () => {
	assert.equal(resolveProvider('claude'), 'claude');
	assert.equal(resolveProvider('javascript:alert(1)'), 'chatgpt');
	assert.equal(resolveProvider(null), 'chatgpt');
	assert.equal(resolveProvider('__proto__'), 'chatgpt');
	const plan = launchPlan({ provider: 'https://evil.example', prompt: 'x' });
	assert.equal(new URL(plan.href).origin, 'https://chatgpt.com');
});
