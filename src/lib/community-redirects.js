// Redirect stubs for moved or retired Bausteine (docs/community/spec.md §7.4,
// ADR-0022): every old slug of a retired Baustein and every entry of the
// `redirects` content file becomes a static page that forwards to its
// target. Pure functions, unit-tested in community-redirects.test.mjs; the
// page src/pages/[...redirect].astro and the endpoint
// src/pages/community-redirects.json.ts do the collection reads.
//
// Every check here throws and thereby fails the build: a stub that would
// overwrite a real page, or one that forwards into a 404, is a bug in the
// content files, not something to ship.

const LESSON_SEGMENT = { de: 'bausteine', en: 'lessons' };

// A source is always a locale-prefixed, lower-case, trailing-slash path --
// the only shape a Baustein URL ever had (ADR-0002).
const FROM_PATTERN = /^\/(?:de|en)\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)+$/;
// A target is an internal, absolute, trailing-slash path -- never a URL,
// never protocol-relative.
const TO_PATTERN = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/;

/**
 * @typedef {{ from: string, to: string }} Redirect
 */

/**
 * @param {object} input
 * @param {{ key: string, successors: string[], oldSlugs: { de: string[], en: string[] } }[]} input.retired
 * @param {Redirect[]} input.redirects explicit old path → new path entries
 * @param {{ lang: 'de' | 'en', slug: string, translationKey: string }[]} input.bausteine published Bausteine
 * @param {Iterable<string>} input.routes every real route the site generates (trailing slash)
 * @returns {Redirect[]} sorted by source path
 */
export function buildRedirects({ retired, redirects, bausteine, routes }) {
	const routeSet = new Set(routes);
	const slugOf = (key, lang) => bausteine.find((b) => b.translationKey === key && b.lang === lang)?.slug;

	/** @type {Redirect[]} */
	const candidates = [];
	for (const r of retired) {
		const successor = r.successors[0];
		for (const lang of /** @type {const} */ (['de', 'en'])) {
			const successorSlug = successor ? slugOf(successor, lang) : undefined;
			// No successor, or none in this language: the language home is the
			// honest fallback -- never a dead end, never a guess.
			const to = successorSlug ? `/${lang}/${LESSON_SEGMENT[lang]}/${successorSlug}/` : `/${lang}/`;
			for (const slug of r.oldSlugs[lang] ?? []) {
				candidates.push({ from: `/${lang}/${LESSON_SEGMENT[lang]}/${slug}/`, to });
			}
		}
	}
	for (const { from, to } of redirects) candidates.push({ from, to });

	const seen = new Set();
	for (const { from, to } of candidates) {
		if (typeof from !== 'string' || !FROM_PATTERN.test(from)) {
			throw new Error(`community-redirects: invalid "from" path "${from}" (expected /de/... or /en/... with a trailing slash)`);
		}
		if (typeof to !== 'string' || !TO_PATTERN.test(to)) {
			throw new Error(`community-redirects: invalid "to" path "${to}" for "${from}" (expected an internal path with a trailing slash)`);
		}
		if (from === to) throw new Error(`community-redirects: "${from}" redirects to itself`);
		if (seen.has(from)) throw new Error(`community-redirects: "${from}" is listed twice`);
		seen.add(from);
		if (routeSet.has(from)) throw new Error(`community-redirects: "${from}" collides with a real page`);
		if (!routeSet.has(to)) throw new Error(`community-redirects: target "${to}" of "${from}" does not exist`);
	}
	for (const { from, to } of candidates) {
		if (seen.has(to)) throw new Error(`community-redirects: "${from}" → "${to}" would form a redirect chain`);
	}

	return candidates.sort((a, b) => a.from.localeCompare(b.from));
}

/**
 * Routes Astro generates from static page files (relative paths as
 * `import.meta.glob` lists them under src/pages). Dynamic routes (`[...]`)
 * are skipped -- their paths come from the content collections instead.
 * @param {Iterable<string>} files e.g. './de/datenschutz.astro'
 * @returns {Set<string>}
 */
export function routesFromPageFiles(files) {
	const routes = new Set();
	for (const file of files) {
		if (file.includes('[')) continue;
		let route = file.replace(/^\.\//, '/');
		if (route.endsWith('.astro')) {
			route = route.slice(0, -'.astro'.length);
			route = route.endsWith('/index') ? route.slice(0, -'index'.length) : `${route}/`;
		} else if (route.endsWith('.ts') || route.endsWith('.js')) {
			// Endpoint: the file name minus the module extension is the path.
			route = route.replace(/\.(ts|js)$/, '');
		} else {
			continue;
		}
		routes.add(route);
	}
	return routes;
}
