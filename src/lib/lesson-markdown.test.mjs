import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { absoluteUrl, attr, deliveredAsset, lessonDocument, mdxToMarkdown } from './lesson-markdown.mjs';

const opts = { lang: 'de', siteUrl: 'https://example.org', pageUrl: 'https://example.org/de/bausteine/x/' };

test('a Figure becomes image plus italic caption, even with ">" in the caption', () => {
	const body = `<Figure kind="diagram" caption="A -> B: &quot;Pfeil&quot;">\n<img src="/bausteine/x/a.svg" alt="Zwei [Kästen]" width="10" height="10" />\n</Figure>`;
	assert.equal(mdxToMarkdown(body, opts), '![Zwei \\[Kästen\\]](https://example.org/bausteine/x/a.svg)\n\n*A -> B: "Pfeil"*');
});

test('a mechanism Figure shows its static frame and links to the animation', () => {
	const body = `<Figure kind="mechanism" caption="Schleife">\n<iframe src="/bausteine/x/s.html" data-static-src="/bausteine/x/s.static.svg" title="Animation: Schleife" sandbox="allow-scripts"></iframe>\n</Figure>`;
	const md = mdxToMarkdown(body, opts);
	assert.match(md, /^!\[Animation: Schleife\]\(https:\/\/example\.org\/bausteine\/x\/s\.static\.svg\)/);
	assert.match(md, /\[▶ Animation auf der Website ansehen\]\(https:\/\/example\.org\/de\/bausteine\/x\/\)/);
	assert.match(md, /\*Schleife\*$/);
});

test('WebOnly blocks and imports turn into a pointer to the website', () => {
	const body = `import Demo from '../Demo.astro';\n\nVorher.\n\n<WebOnly>\n<TokenizerDemo lang="de" />\n</WebOnly>\n\nNachher.`;
	const md = mdxToMarkdown(body, { ...opts, lang: 'en' });
	assert.equal(md, 'Vorher.\n\n> **Interactive demo:** [try it on the website](https://example.org/de/bausteine/x/)\n\nNachher.');
});

test('root-relative links become absolute page URLs; hooks can redirect them', () => {
	const body = 'Siehe [Input](/de/glossar/input) und [Abschnitt](/de/bausteine/y#teil) und ![Bild](/bausteine/x/b.png).';
	assert.equal(
		mdxToMarkdown(body, opts),
		'Siehe [Input](https://example.org/de/glossar/input/) und [Abschnitt](https://example.org/de/bausteine/y/#teil) und ![Bild](https://example.org/bausteine/x/b.png).',
	);
	const local = mdxToMarkdown(body, { ...opts, imageSrc: (p) => `../..${p}`, linkHref: (p) => `L${p}` });
	assert.equal(local, 'Siehe [Input](L/de/glossar/input) und [Abschnitt](L/de/bausteine/y#teil) und ![Bild](../../bausteine/x/b.png).');
});

test('details blocks pass through untouched', () => {
	const body = '<details>\n<summary>Eine Ebene tiefer</summary>\n\nText.\n\n</details>';
	assert.equal(mdxToMarkdown(body, opts), body);
});

test('deliveredAsset swaps a .png for an existing .webp sibling only', () => {
	assert.equal(deliveredAsset('/bausteine/x/a.png', () => true), '/bausteine/x/a.webp');
	assert.equal(deliveredAsset('/bausteine/x/a.png', () => false), '/bausteine/x/a.png');
	assert.equal(deliveredAsset('/other/a.png', () => true), '/other/a.png');
});

test('absoluteUrl adds the trailing slash only to page paths', () => {
	assert.equal(absoluteUrl('https://e.org', '/de/glossar/x'), 'https://e.org/de/glossar/x/');
	assert.equal(absoluteUrl('https://e.org', '/de/glossar/x/'), 'https://e.org/de/glossar/x/');
	assert.equal(absoluteUrl('https://e.org', '/a/b.svg'), 'https://e.org/a/b.svg');
	assert.equal(absoluteUrl('https://e.org', '/de/x#h'), 'https://e.org/de/x/#h');
});

test('attr decodes entities and ignores attributes that only share a suffix', () => {
	assert.equal(attr(' data-src="a" src="b&amp;c"', 'src'), 'b&c');
});

test('lessonDocument puts the header between title and description', () => {
	const doc = lessonDocument({ title: 'T', description: 'D', body: 'B' }, { ...opts, header: '> H' });
	assert.equal(doc, '# T\n\n> H\n\nD\n\nB\n\n---\n\nQuelle: https://example.org/de/bausteine/x/\n');
});
