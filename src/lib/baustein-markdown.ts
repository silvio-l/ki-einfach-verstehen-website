// Converts a Baustein's raw MDX body into a clean, standalone Markdown
// document for the "copy/save as Markdown" actions (BausteinActions.astro)
// and the `[slug].md` endpoints. Handles the two embed patterns Bausteine
// currently use -- self-closing `<ConceptDiagram .../>` and raw inline
// `<svg>...</svg>` illustrations -- by swapping them for a short bracketed
// placeholder; a `<details>` excursion and GFM tables already are valid
// Markdown and pass through untouched. Adding a new embedded component to a
// Baustein requires extending this function too.
import type { CollectionEntry } from 'astro:content';

const PLACEHOLDER = {
	de: {
		diagram: 'Interaktives Diagramm — auf der Website ansehen',
		svg: (title?: string) => (title ? `Diagramm: ${title}` : 'Diagramm'),
		source: 'Quelle',
	},
	en: {
		diagram: 'Interactive diagram — view on the website',
		svg: (title?: string) => (title ? `Diagram: ${title}` : 'Diagram'),
		source: 'Source',
	},
};

function attr(tag: string, name: string): string | undefined {
	// Both call sites pass a fixed literal ("src"/"alt"), never externally controlled input.
	return tag.match(new RegExp(`${name}="([^"]*)"`))?.[1]; // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
}

export function bausteinToMarkdown(
	entry: CollectionEntry<'bausteine'>,
	opts: { lang: 'de' | 'en'; siteUrl: string; pageUrl: string },
): string {
	const { lang, siteUrl, pageUrl } = opts;
	const t = PLACEHOLDER[lang];
	let body = entry.body ?? '';

	body = body.replace(/^import .*$/gm, '');
	body = body.replace(/<ConceptDiagram\b[^>]*\/>/g, `*[${t.diagram}]*`);
	body = body.replace(/<img\b([^>]*)\/>/g, (_match, attrs: string) => {
		const src = attr(attrs, 'src') ?? '';
		const alt = attr(attrs, 'alt') ?? '';
		const absSrc = src.startsWith('/') ? `${siteUrl}${src}` : src;
		return `\n\n![${alt}](${absSrc})\n\n`;
	});
	body = body.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
		const title = match.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim();
		return `\n\n*[${t.svg(title)}]*\n\n`;
	});
	// Root-relative links (glossary cross-links, internal nav) become
	// absolute so the copied/downloaded document stands on its own.
	body = body.replace(/\]\(\//g, `](${siteUrl}/`);
	body = body.replace(/\n{3,}/g, '\n\n').trim();

	return `# ${entry.data.title}\n\n${entry.data.description}\n\n${body}\n\n---\n\n${t.source}: ${pageUrl}\n`;
}
