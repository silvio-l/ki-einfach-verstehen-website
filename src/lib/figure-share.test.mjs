import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
	MAX_ISSUE_URL,
	apaCitation,
	attributionText,
	bibtexCitation,
	demoAnchor,
	demoEmbedHtml,
	demoEmbedPath,
	extractDemos,
	extractFigures,
	figureAnchor,
	figureEmbedHtml,
	figureIdFromSrc,
	figurePagePath,
	figurePngPath,
	issueSection,
	issueUrl,
	pairFigures,
	parseLessonPath,
	sortCredits,
} from './figure-share.mjs';

const REPO = 'https://github.com/silvio-l/ki-einfach-verstehen-website';
const PAGE = 'https://ki-einfach-verstehen.de/de/bausteine/tokenizer-ids-vokabular/';

test('figure id: file name without extension, stable across the PNG -> WebP swap', () => {
	assert.equal(figureIdFromSrc('/bausteine/tokenizer-ids-vokabular/text-zu-ids.svg'), 'text-zu-ids');
	assert.equal(figureIdFromSrc('/bausteine/x/baukasten.png'), 'baukasten');
	assert.equal(figureIdFromSrc('/bausteine/x/baukasten.webp'), 'baukasten');
	assert.equal(figureIdFromSrc('/bausteine/x/textschleife.html'), 'textschleife');
	assert.equal(figureIdFromSrc('/bausteine/x/textschleife.static.svg'), 'textschleife');
	assert.equal(figureIdFromSrc('/bausteine/x/Score_Liste 1.svg?v=2'), 'score-liste-1');
	assert.throws(() => figureIdFromSrc(''));
});

test('anchors and routes per language', () => {
	assert.equal(figureAnchor('de', 'text-zu-ids'), 'abb-text-zu-ids');
	assert.equal(figureAnchor('en', 'text-to-ids'), 'fig-text-to-ids');
	assert.equal(demoAnchor('de', 'tokenizer'), 'demo-tokenizer-de');
	assert.equal(figurePagePath('de', 'tokenizer-ids-vokabular', 'text-zu-ids'), '/de/abbildung/tokenizer-ids-vokabular/text-zu-ids/');
	assert.equal(figurePagePath('en', 'tokenizer-ids-vocabulary', 'text-to-ids'), '/en/figure/tokenizer-ids-vocabulary/text-to-ids/');
	assert.equal(figurePngPath('de', 's', 'i', 'source'), '/de/abbildung/s/i/mit-quelle.png');
	assert.equal(figurePngPath('en', 's', 'i', 'preview'), '/en/figure/s/i/preview.png');
	assert.equal(demoEmbedPath('en', 'weights'), '/embed/weights/en/');
	assert.throws(() => figureAnchor('fr', 'x'));
});

test('lesson path detection: only real Baustein routes', () => {
	assert.deepEqual(parseLessonPath('/de/bausteine/input-und-output/'), { lang: 'de', slug: 'input-und-output' });
	assert.deepEqual(parseLessonPath('/en/lessons/input-and-output'), { lang: 'en', slug: 'input-and-output' });
	assert.equal(parseLessonPath('/de/lessons/input-und-output/'), null);
	assert.equal(parseLessonPath('/de/so-funktionierts/'), null);
	assert.equal(parseLessonPath('/de/abbildung/x/y/'), null);
});

const MDX = `import Figure from '../../../components/Figure.astro';

Intro.

## Der [Tokenizer](/de/glossar/tokenizer) **zerlegt**

<Figure kind="diagram" caption="Ein Satz &quot;zerlegt&quot; &amp; nummeriert.">
<img src="/bausteine/t/text-zu-ids.svg" alt="Der Satz &lt;Die Katze&gt;" width="640" height="360" />
</Figure>

\`\`\`
<Figure kind="icon" caption="in code"><img src="/x/ignored.svg" alt="" /></Figure>
\`\`\`

## Animation

<Figure kind="mechanism" caption="Die Schleife.">
<iframe src="/bausteine/t/textschleife.html" data-static-src="/bausteine/t/textschleife.static.svg" title="Animation der Schleife" sandbox="allow-scripts" loading="lazy"></iframe>
</Figure>

<WebOnly>
<TokenizerDemo lang="de" />
</WebOnly>
<TextLoopDemo lang="de" />
`;

test('extractFigures: order, kinds, decoded attributes, section, static fallback; code blocks ignored', () => {
	const figs = extractFigures(MDX);
	assert.equal(figs.length, 2);
	assert.deepEqual(figs[0], {
		id: 'text-zu-ids',
		kind: 'diagram',
		caption: 'Ein Satz "zerlegt" & nummeriert.',
		src: '/bausteine/t/text-zu-ids.svg',
		alt: 'Der Satz <Die Katze>',
		width: 640,
		height: 360,
		section: 'Der Tokenizer zerlegt',
	});
	assert.equal(figs[1].kind, 'mechanism');
	assert.equal(figs[1].id, 'textschleife');
	assert.equal(figs[1].staticSrc, '/bausteine/t/textschleife.static.svg');
	assert.equal(figs[1].alt, 'Animation der Schleife');
	assert.equal(figs[1].section, 'Animation');
});

test('extractFigures: duplicate file names fail loudly', () => {
	const twice = '<Figure caption="a"><img src="/a/x.svg" alt="" /></Figure>\n<Figure caption="b"><img src="/b/x.png" alt="" /></Figure>';
	assert.throws(() => extractFigures(twice), /x/);
});

test('extractDemos: component names to demo keys', () => {
	assert.deepEqual(extractDemos(MDX), ['tokenizer', 'textloop']);
});

test('pairFigures: by position only when both lists agree', () => {
	const de = [{ id: 'a-de', kind: 'diagram' }, { id: 'b-de', kind: 'icon' }];
	const en = [{ id: 'a-en', kind: 'diagram' }, { id: 'b-en', kind: 'icon' }];
	assert.deepEqual([...pairFigures(de, en)], [['a-de', 'a-en'], ['b-de', 'b-en']]);
	assert.equal(pairFigures(de, en.slice(0, 1)).size, 0);
	assert.equal(pairFigures(de, [en[1], en[0]]).size, 0);
});

test('attribution text in the agreed format', () => {
	assert.equal(
		attributionText({ lang: 'de', title: 'Tokenizer: Wie Sprache zu Zahlen wird', url: 'https://x.de/a/' }),
		'KI einfach verstehen, ‚Tokenizer: Wie Sprache zu Zahlen wird‘, CC BY 4.0, https://x.de/a/',
	);
	assert.equal(attributionText({ lang: 'en', title: 'Tokenizers', url: 'https://x.de/b/' }), 'KI einfach verstehen, ‘Tokenizers’, CC BY 4.0, https://x.de/b/');
});

test('APA and BibTeX citations', () => {
	assert.equal(
		apaCitation({ lang: 'de', title: 'Input und Output', url: 'https://x.de/a/', year: 2026 }),
		'KI einfach verstehen. (2026). Input und Output [Abbildung]. https://x.de/a/',
	);
	assert.equal(apaCitation({ lang: 'en', title: 'T', url: 'u', year: 2026, kind: 'demo' }), 'KI einfach verstehen. (2026). T [Interactive demo]. u');
	const bib = bibtexCitation({ lang: 'de', title: 'Skalar & Vektor_1 {x} 50%', url: 'https://x.de/a/', year: 2026, key: 'kiev:skalar/a b' });
	assert.match(bib, /^@misc\{kiev:skalar-a-b,/);
	assert.match(bib, /title {8}= \{Skalar \\& Vektor\\_1 \\\{x\\\} 50\\%\},/);
	assert.match(bib, /author {7}= \{\{KI einfach verstehen\}\},/);
	assert.match(bib, /howpublished = \{Abbildung, \\url\{https:\/\/x\.de\/a\/\}\},/);
	assert.match(bib, /note {9}= \{Lizenz: CC BY 4\.0\},\n\}$/);
});

test('figure embed snippet: escaped, attributed, licence-linked', () => {
	const html = figureEmbedHtml({
		lang: 'de',
		title: 'A "B"',
		caption: 'Zeigt <x> & y',
		alt: 'Alt "text"',
		imageUrl: 'https://x.de/i.svg',
		pageUrl: 'https://x.de/de/abbildung/a/i/',
		width: 640,
		height: 360,
	});
	assert.match(html, /^<figure>\n {2}<img src="https:\/\/x\.de\/i\.svg" alt="Alt &quot;text&quot;" width="640" height="360"/);
	assert.match(html, /Zeigt &lt;x&gt; &amp; y/);
	assert.match(html, /<a href="https:\/\/x\.de\/de\/abbildung\/a\/i\/">KI einfach verstehen, ‚A &quot;B&quot;‘<\/a>/);
	assert.match(html, /href="https:\/\/creativecommons\.org\/licenses\/by\/4\.0\/deed\.de" rel="license">CC BY 4\.0</);
	assert.match(html, /<\/figure>$/);
});

test('demo embed snippet: iframe, attribution, origin-checked resize listener', () => {
	const html = demoEmbedHtml({
		lang: 'en',
		title: 'Tokenizers',
		demoTitle: 'Your sentence',
		embedUrl: 'https://ki-einfach-verstehen.de/embed/tokenizer/en/',
		pageUrl: 'https://ki-einfach-verstehen.de/en/lessons/t/#demo-tokenizer-en',
		height: 600,
	});
	assert.match(html, /<iframe src="https:\/\/ki-einfach-verstehen\.de\/embed\/tokenizer\/en\/" title="Live demo: Your sentence" width="100%" height="600"/);
	assert.match(html, /creativecommons\.org\/licenses\/by\/4\.0\/"/);
	assert.match(html, /e\.origin!=='https:\/\/ki-einfach-verstehen\.de'/);
});

test('issue section: marked passage wins, heading as context', () => {
	assert.equal(issueSection({ lang: 'de', heading: 'Ein Abschnitt' }), 'Ein Abschnitt');
	assert.equal(issueSection({ lang: 'de', heading: 'H', passage: '  zwei\n Wörter ' }), '„zwei Wörter“ (Abschnitt „H“)');
	assert.equal(issueSection({ lang: 'en', passage: 'x' }), '“x”');
	assert.equal(issueSection({ lang: 'en' }), '');
});

test('issue URL: exact template and field ids, encoded values', () => {
	const url = new URL(issueUrl({ repoUrl: `${REPO}/`, lang: 'de', title: 'Tokenizer & IDs', pageUrl: PAGE, heading: 'Warum nicht?', passage: 'Die Katze sitzt.' }));
	assert.equal(url.origin + url.pathname, `${REPO}/issues/new`);
	assert.equal(url.searchParams.get('template'), 'fehler-im-baustein.yml');
	assert.equal(url.searchParams.get('baustein'), PAGE);
	assert.equal(url.searchParams.get('abschnitt'), '„Die Katze sitzt.“ (Abschnitt „Warum nicht?“)');
	assert.equal(url.searchParams.get('title'), '[Baustein] Tokenizer & IDs');
	assert.ok(!url.search.includes('+'), 'spaces are %20, not +');
	const en = new URL(issueUrl({ repoUrl: REPO, lang: 'en', title: 'T', pageUrl: PAGE }));
	assert.equal(en.searchParams.has('abschnitt'), false);
	assert.equal(en.searchParams.get('title'), '[Lesson] T');
});

test('issue URL: a long passage is cut at a word boundary to keep the URL short', () => {
	const passage = 'Wörter mit Umlauten äöü '.repeat(200);
	const url = issueUrl({ repoUrl: REPO, lang: 'de', title: 'T', pageUrl: PAGE, passage });
	assert.ok(url.length <= MAX_ISSUE_URL, String(url.length));
	const abschnitt = new URL(url).searchParams.get('abschnitt') ?? '';
	assert.ok(abschnitt.startsWith('„Wörter mit'));
	assert.ok(abschnitt.endsWith('…'));
});

test('credits: oldest first, undated last, stable otherwise', () => {
	const list = [
		{ name: 'c' },
		{ name: 'b', datum: '2026-10-05' },
		{ name: 'a', datum: new Date('2026-09-01') },
		{ name: 'd' },
	];
	assert.deepEqual(sortCredits(list).map((c) => c.name), ['a', 'b', 'c', 'd']);
	assert.deepEqual(sortCredits(undefined), []);
});
