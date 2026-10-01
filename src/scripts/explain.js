// "Explain it simpler" deep links (ExplainSimpler.astro): turn a passage of a
// Baustein into a ready-made prompt for an external chatbot. Pure functions
// only -- the DOM wiring lives in the component, this file is unit-tested
// (explain.test.mjs).
//
// Provider behaviour, checked live on 2026-10-01: ChatGPT and Claude prefill
// their input from `?q=` and wait for the reader to send; Perplexity sends the
// query at once. Mistral Le Chat was dropped -- it redirects logged-out
// readers to its login page and loses the prompt on the way.

export const MODES = ['simpler', 'example', 'detailed'];

export const PROVIDERS = {
	chatgpt: { label: 'ChatGPT', href: 'https://chatgpt.com/' },
	claude: { label: 'Claude', href: 'https://claude.ai/new' },
	perplexity: { label: 'Perplexity', href: 'https://www.perplexity.ai/search' },
};

export const DEFAULT_PROVIDER = 'chatgpt';

// Longest prefilled URL. Counted after encoding (an umlaut takes 6
// characters), it stays well below what browsers and the providers accept and
// still fits a full paragraph plus the prompt frame; anything longer goes via
// the clipboard.
export const MAX_URL = 6000;

const COPY = {
	de: {
		quote: (s) => `„${s}“`,
		context: (title, section, url) =>
			`Ich lese gerade den Artikel ${title} auf „KI einfach verstehen“ (${url})` +
			(section ? `, Abschnitt ${section}` : '') +
			'. Diese Stelle habe ich noch nicht richtig verstanden:',
		surrounding: 'Sie steht in diesem Zusammenhang:',
		ask:
			'Ich bin Laie ohne technisches Vorwissen. Erkläre mir diese Stelle deutlich einfacher, als der Artikel es tut.',
		modes: {
			simpler:
				'Beginne mit der Kernaussage in ein, zwei ganz einfachen Sätzen. Erkläre sie dann mit einem anschaulichen Vergleich aus dem Alltag und sag kurz, wo der Vergleich an seine Grenzen kommt.',
			example:
				'Spiel die Stelle an einem einzigen, ganz konkreten Beispiel Schritt für Schritt durch, mit Dingen oder Zahlen, die man sich gut vorstellen kann. Fasse am Ende in einem Satz zusammen, was das Beispiel zeigt.',
			detailed:
				'Geh ausführlich und Schritt für Schritt vor: Erkläre jeden Gedankenschritt einzeln, beantworte die Warum-Fragen, die sich ein Laie dabei stellt, und nenne typische Missverständnisse samt Richtigstellung.',
		},
		rules:
			'Benutze Fachbegriffe nur, wenn du sie sofort in Alltagssprache erklärst, und bleib inhaltlich korrekt. Antworte auf Deutsch.',
	},
	en: {
		quote: (s) => `"${s}"`,
		context: (title, section, url) =>
			`I'm reading the article ${title} on "KI einfach verstehen" (${url})` +
			(section ? `, section ${section}` : '') +
			". I haven't really understood this passage yet:",
		surrounding: 'It appears in this context:',
		ask: "I'm a complete beginner with no technical background. Explain this passage to me much simpler than the article does.",
		modes: {
			simpler:
				'Start with the core idea in one or two very simple sentences. Then explain it with a vivid everyday comparison and briefly say where the comparison falls short.',
			example:
				'Walk through the passage step by step using one single, very concrete example, with things or numbers that are easy to picture. End with one sentence on what the example shows.',
			detailed:
				'Go into detail, step by step: explain each step of the reasoning on its own, answer the "why" questions a beginner would ask along the way, and name common misconceptions along with the correction.',
		},
		rules: 'Only use technical terms if you immediately explain them in everyday words, and stay factually correct. Answer in English.',
	},
};

// Collapses the whitespace a DOM text read leaves behind. Line breaks survive
// only in front of list items ("- ..."), so a list stays readable as a list.
export function normalizeExcerpt(text) {
	return text
		.split('\n')
		.map((line) => line.replace(/\s+/g, ' ').trim())
		.filter(Boolean)
		.reduce((out, line) => (!out ? line : `${out}${line.startsWith('- ') ? '\n' : ' '}${line}`), '');
}

// `context` is the paragraph around a selection, so a fragment like "the
// trained weights" still reaches the chatbot with its meaning.
export function buildPrompt({ lang, mode, excerpt, context = '', title, section, url }) {
	const t = Object.hasOwn(COPY, lang) ? COPY[lang] : null;
	if (!t) throw new Error(`Unknown language: ${lang}`);
	if (!MODES.includes(mode)) throw new Error(`Unknown mode: ${mode}`);
	return [
		t.context(t.quote(title), section ? t.quote(section) : '', url),
		`"""\n${excerpt}\n"""`,
		...(context && context !== excerpt ? [`${t.surrounding}\n\n"""\n${context}\n"""`] : []),
		`${t.ask} ${t.modes[mode]}`,
		t.rules,
	].join('\n\n');
}

// Provider ids come back from localStorage and markup -- anything unknown
// falls back to the default instead of becoming part of a URL.
export function resolveProvider(id) {
	return typeof id === 'string' && Object.hasOwn(PROVIDERS, id) ? id : DEFAULT_PROVIDER;
}

// Where to send the reader: the prompt goes prefilled via `?q=` while the URL
// stays within MAX_URL; beyond that the bare provider opens and the full
// prompt goes to the clipboard -- it is never cut.
export function launchPlan({ provider, prompt }) {
	const base = PROVIDERS[resolveProvider(provider)].href;
	// encodeURIComponent, not URLSearchParams: spaces must arrive as %20 --
	// a "+" is only decoded to a space by form-style parsers.
	const href = `${base}?q=${encodeURIComponent(prompt)}`;
	return href.length <= MAX_URL ? { href, viaClipboard: false } : { href: base, viaClipboard: true };
}
