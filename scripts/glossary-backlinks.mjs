// A glossary entry ends with a back-reference to its Baustein ("Eingeführt
// in [<Baustein-Titel>](/de/bausteine/<slug>)", docs/content-plan/prinzipien.md
// "Glossar-Pflicht"). The link text repeats the Baustein's title, so every
// title change has to be carried into the glossary -- this catches the ones
// that were missed. Only the closing paragraph is checked: links inside the
// prose may be worded freely.

// Literal per language (no RegExp built from input): link text, Baustein slug.
const BAUSTEIN_LINK = {
	de: /\[([^\]]+)\]\(\/de\/bausteine\/([a-z0-9-]+)\/?\)/g,
	en: /\[([^\]]+)\]\(\/en\/lessons\/([a-z0-9-]+)\/?\)/g,
};
const QUOTES = /^[„“"']+|[„“"']+$/g;

/**
 * @param {string} body glossary entry body (without frontmatter)
 * @param {'de' | 'en'} lang
 * @param {Map<string, string>} titles Baustein slug -> current title, same language
 * @returns {string[]} one message per mismatching back-reference
 */
export function backlinkTitleErrors(body, lang, titles) {
	const closing = body.trim().split(/\n\s*\n/).at(-1) ?? '';
	const errors = [];
	for (const [, text, slug] of closing.matchAll(BAUSTEIN_LINK[lang])) {
		const title = titles.get(slug);
		if (title !== undefined && text.replace(QUOTES, '') !== title)
			errors.push(`link text "${text}" is not the title of "${slug}" ("${title}")`);
	}
	return errors;
}
