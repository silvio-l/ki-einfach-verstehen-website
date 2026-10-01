// Rehype plugin (astro.config.mjs): appends the trailing slash to internal
// page links in content (`/de/glossar/tokenizer` -> `/de/glossar/tokenizer/`).
// GitHub Pages answers the slash-less form with a 301, so every such link
// cost a redirect hop and let Google index both URL variants as duplicates
// (seen in Search Console, 2026-10-01). Authors keep writing links either
// way; the delivered HTML is always canonical. Files (`.md`, images) and
// non-/de|/en paths are left alone, as are #fragments and ?queries.
const INTERNAL = /^\/(de|en)(\/[^?#]*)?([?#].*)?$/;

export function withTrailingSlash(href) {
	if (typeof href !== 'string') return href;
	const m = INTERNAL.exec(href);
	if (!m) return href;
	const path = `/${m[1]}${m[2] ?? ''}`;
	if (path.endsWith('/') || /\.[a-z0-9]+$/i.test(path)) return href;
	return `${path}/${m[3] ?? ''}`;
}

export default function rehypeTrailingSlash() {
	return (tree) => walk(tree);
}

function walk(node) {
	if (node.type === 'element' && node.tagName === 'a' && node.properties) {
		node.properties.href = withTrailingSlash(node.properties.href);
	}
	// MDX JSX elements (<a href> written as JSX inside .mdx)
	if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && Array.isArray(node.attributes)) {
		for (const attr of node.attributes) {
			if (attr.type === 'mdxJsxAttribute' && attr.name === 'href') attr.value = withTrailingSlash(attr.value);
		}
	}
	if (Array.isArray(node.children)) node.children.forEach(walk);
}
