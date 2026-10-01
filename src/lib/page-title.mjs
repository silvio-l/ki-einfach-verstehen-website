// <title> for content entry pages (ContentEntryLayout). Google cuts titles
// off at roughly 65 characters, so the brand suffix is only appended while
// the whole title still fits (docs/content-plan/seo-technik.md). Glossary
// entries additionally name what the page offers -- a bare "Token — KI
// einfach verstehen" says nothing to a searcher looking for what a token is.
// Plain JS (not .ts) so node --test can cover it without a build step.

export const BRAND_SUFFIX = ' — KI einfach verstehen';
export const MAX_TITLE_LENGTH = 65;

const GLOSSARY_QUALIFIER = { de: ': Definition und Beispiel', en: ': Definition and Example' };

/**
 * @param {string} title the entry's frontmatter title
 * @param {'bausteine' | 'glossar'} collection
 * @param {'de' | 'en'} lang
 */
export function contentPageTitle(title, collection, lang) {
	const fits = (t) => t.length <= MAX_TITLE_LENGTH;
	if (collection === 'glossar') {
		const qualified = `${title}${GLOSSARY_QUALIFIER[lang]}${BRAND_SUFFIX}`;
		if (fits(qualified)) return qualified;
	}
	const branded = `${title}${BRAND_SUFFIX}`;
	return fits(branded) ? branded : title;
}
