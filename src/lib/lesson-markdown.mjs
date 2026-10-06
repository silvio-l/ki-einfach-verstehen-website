// Turns a Baustein's raw MDX body into plain Markdown. Shared by the
// `[slug].md` endpoints (via baustein-markdown.ts: "copy/save as Markdown")
// and scripts/export-lessons.mjs (the readable lessons/** copies in the
// public repo), so both outputs come from the same rules.
//
// Embeds Bausteine use today:
//   <Figure caption="…"><img …/></Figure>          → image + italic caption
//   <Figure kind="mechanism" …><iframe data-static-src=… title=…></Figure>
//                                                   → static frame + link to the animation
//   <WebOnly>…</WebOnly> (live demos)               → one-line pointer to the website
//   loose <img/>, inline <svg>, <ConceptDiagram/>   → image / placeholder
// <details>/<summary>, tables and plain Markdown pass through untouched.
// A new embedded component needs a rule here, otherwise its tag leaks into
// the Markdown -- lesson-markdown.test.mjs fails on any leftover capitalised
// JSX tag.

const COPY = {
	de: {
		demo: 'Interaktive Demo',
		demoLink: 'auf der Website ausprobieren',
		animationLink: 'Animation auf der Website ansehen',
		diagram: 'Interaktives Diagramm — auf der Website ansehen',
		svg: (title) => (title ? `Diagramm: ${title}` : 'Diagramm'),
		source: 'Quelle',
	},
	en: {
		demo: 'Interactive demo',
		demoLink: 'try it on the website',
		animationLink: 'watch the animation on the website',
		diagram: 'Interactive diagram — view on the website',
		svg: (title) => (title ? `Diagram: ${title}` : 'Diagram'),
		source: 'Source',
	},
};

// Attribute list of a JSX/HTML tag; quoted values may contain `>`.
const ATTRS = String.raw`((?:\s+[\w:-]+(?:="[^"]*")?)*)\s*`;
const FIGURE_RE = new RegExp(String.raw`<Figure\b${ATTRS}>([\s\S]*?)<\/Figure>`, 'g');
const IMG_RE = new RegExp(String.raw`<img\b${ATTRS}\/?>`, 'g');
const IFRAME_RE = new RegExp(String.raw`<iframe\b${ATTRS}>[\s\S]*?<\/iframe>`, 'g');

const ENTITIES = { '&quot;': '"', '&amp;': '&', '&lt;': '<', '&gt;': '>', '&#39;': "'" };

/** Value of one attribute in a tag's attribute string, entity-decoded. */
export function attr(attrs, name) {
	for (const m of attrs.matchAll(/([\w:-]+)="([^"]*)"/g)) {
		if (m[1] === name) return m[2].replace(/&(quot|amp|lt|gt|#39);/g, (e) => ENTITIES[e]);
	}
	return undefined;
}

/** Root-relative site path → absolute URL, page paths with their trailing slash. */
export function absoluteUrl(siteUrl, path) {
	const [, pathname, suffix = ''] = /^([^?#]*)(.*)$/.exec(path) ?? [];
	const isPage = !/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('/');
	return `${siteUrl}${pathname}${isPage ? '/' : ''}${suffix}`;
}

/**
 * Delivered file for a content image: an older `.png` under /bausteine/ is
 * served as its `.webp` sibling when that exists (same rule as
 * scripts/rehype-content-images.mjs).
 * @param {string} path root-relative path
 * @param {(path: string) => boolean} exists checks a root-relative path in public/
 */
export function deliveredAsset(path, exists) {
	if (!/^\/bausteine\/.+\.png$/.test(path)) return path;
	const webp = path.replace(/\.png$/, '.webp');
	return exists(webp) ? webp : path;
}

const escapeAlt = (text) => text.replace(/[[\]]/g, '\\$&');

/**
 * @param {string} body raw MDX body (without frontmatter)
 * @param {{
 *   lang: 'de' | 'en',
 *   siteUrl: string,
 *   pageUrl: string,
 *   imageSrc?: (path: string) => string,
 *   linkHref?: (path: string) => string,
 * }} opts imageSrc/linkHref map root-relative paths (default: absolute site URLs)
 */
export function mdxToMarkdown(body, opts) {
	const { lang, siteUrl, pageUrl } = opts;
	const t = COPY[lang];
	const imageSrc = opts.imageSrc ?? ((p) => `${siteUrl}${p}`);
	const linkHref = opts.linkHref ?? ((p) => absoluteUrl(siteUrl, p));
	const src = (s) => (s.startsWith('/') ? imageSrc(s) : s);
	const image = (alt, s) => `![${escapeAlt(alt)}](${src(s)})`;

	const figureMedia = (inner) => {
		const img = [...inner.matchAll(IMG_RE)][0];
		if (img) return image(attr(img[1], 'alt') ?? '', attr(img[1], 'src') ?? '');
		const frame = [...inner.matchAll(IFRAME_RE)][0];
		if (frame) {
			const title = attr(frame[1], 'title') ?? '';
			const still = attr(frame[1], 'data-static-src');
			const link = `[▶ ${t.animationLink}](${pageUrl})`;
			return still ? `${image(title, still)}\n\n${link}` : link;
		}
		return '';
	};

	let md = body;
	md = md.replace(/^import .*$/gm, '');
	md = md.replace(/<WebOnly\b[^>]*>[\s\S]*?<\/WebOnly>/g, () => `\n\n> **${t.demo}:** [${t.demoLink}](${pageUrl})\n\n`);
	md = md.replace(FIGURE_RE, (_m, attrs, inner) => {
		const caption = attr(attrs, 'caption');
		const media = figureMedia(inner);
		return `\n\n${media}${caption ? `\n\n*${caption}*` : ''}\n\n`;
	});
	md = md.replace(/<ConceptDiagram\b[^>]*\/>/g, `*[${t.diagram}]*`);
	md = md.replace(IMG_RE, (_m, attrs) => `\n\n${image(attr(attrs, 'alt') ?? '', attr(attrs, 'src') ?? '')}\n\n`);
	md = md.replace(/<svg[\s\S]*?<\/svg>/g, (match) => {
		const title = match.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim();
		return `\n\n*[${t.svg(title)}]*\n\n`;
	});
	// Markdown images first (they carry asset paths), then links.
	md = md.replace(/!\[([^\]]*)\]\((\/[^)\s]+)\)/g, (_m, alt, p) => `![${alt}](${imageSrc(p)})`);
	md = md.replace(/(?<!!)\]\((\/[^)\s]*)\)/g, (_m, p) => `](${linkHref(p)})`);
	return md.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Standalone Markdown document for one Baustein: title, description, body
 * and a source line. `header` (already Markdown) goes right below the title.
 * @param {{ title: string, description: string, body: string }} entry
 * @param {Parameters<typeof mdxToMarkdown>[1] & { header?: string }} opts
 */
export function lessonDocument(entry, opts) {
	const t = COPY[opts.lang];
	const header = opts.header ? `${opts.header}\n\n` : '';
	const body = mdxToMarkdown(entry.body, opts);
	return `# ${entry.title}\n\n${header}${entry.description}\n\n${body}\n\n---\n\n${t.source}: ${opts.pageUrl}\n`;
}
