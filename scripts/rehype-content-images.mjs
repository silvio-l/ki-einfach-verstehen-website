// Rehype plugin (astro.config.mjs) for images embedded in content pages:
//
//  1. `loading="lazy"` / `decoding="async"` unless the author set them.
//     Content images sit below the fold by the placement rules in
//     docs/content-plan/grafiken.md (a Figure always follows the paragraph
//     that introduces it), so deferring them never touches the LCP element
//     but keeps a long Baustein from fetching every illustration up front.
//  2. A `.png` source under /bausteine/ is served as its `.webp` sibling when
//     that file exists in public/ -- the delivery format is a build concern,
//     not an editorial one. Bausteine are reviewed by file hash
//     (docs/content-plan/pruefberichte/, `pnpm check:reviews`), so swapping
//     the format in the reviewed .mdx would invalidate every report for a
//     change no reviewer needs to see. New illustrations are generated as
//     .webp directly (scripts/generate-illustration.py) and referenced as
//     such; the rewrite only carries the older PNG references.
//
// Handles both plain markdown images (hast `element`) and the raw `<img>`
// tags Bausteine use inside <Figure> (MDX JSX nodes with an attribute list).
import { existsSync } from 'node:fs';
import path from 'node:path';

const DEFAULTS = { loading: 'lazy', decoding: 'async' };

/**
 * @param {{ publicDir?: string, exists?: (file: string) => boolean }} [options]
 *   publicDir: where site assets live (default: ./public); exists: file
 *   check, injectable for tests.
 */
export default function rehypeContentImages(options = {}) {
	const publicDir = options.publicDir ?? path.resolve('public');
	const exists = options.exists ?? existsSync;
	const webpFor = (src) => {
		if (typeof src !== 'string' || !/^\/bausteine\/.+\.png$/.test(src)) return undefined;
		const webp = src.replace(/\.png$/, '.webp');
		return exists(path.join(publicDir, webp)) ? webp : undefined;
	};
	return (tree) => {
		walk(tree, webpFor);
	};
}

function walk(node, webpFor) {
	if (!node || typeof node !== 'object') return;
	if (node.type === 'element' && node.tagName === 'img') {
		node.properties ??= {};
		for (const [k, v] of Object.entries(DEFAULTS)) node.properties[k] ??= v;
		const webp = webpFor(node.properties.src);
		if (webp) node.properties.src = webp;
	} else if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === 'img') {
		node.attributes ??= [];
		const attr = (name) => node.attributes.find((a) => a.type === 'mdxJsxAttribute' && a.name === name);
		for (const [k, v] of Object.entries(DEFAULTS)) {
			if (!attr(k)) node.attributes.push({ type: 'mdxJsxAttribute', name: k, value: v });
		}
		const src = attr('src');
		const webp = src && webpFor(src.value);
		if (webp) src.value = webp;
	}
	for (const child of node.children ?? []) walk(child, webpFor);
}
