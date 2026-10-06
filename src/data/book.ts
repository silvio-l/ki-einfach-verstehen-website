// Scope of the first book (ADR-0029): Themenbereiche 1 to 3. Same list as
// BOOK_THEMENBEREICHE in packages/ebook/scripts/chapters.mjs, which the book
// compiler enforces; this package is mirrored publicly and cannot import from
// packages/ebook, so keep both in sync.
import { getPublished } from './published';
import { getThemenbereiche, getThemenbereichHref } from './themenbereiche';

export const BOOK_THEMENBEREICHE = ['grundlagen', 'weg-durchs-modell', 'wie-lernen-funktioniert'];

export interface BookPart {
	title: string;
	href: string;
	/** Planned Bausteine of this Themenbereich (= chapters of the book part). */
	planned: number;
	published: number;
}

/** The book's parts and its progress, counted live from the content collections. */
export async function getBookScope(lang: 'de' | 'en'): Promise<{ parts: BookPart[]; planned: number; published: number }> {
	const published = await getPublished(lang);
	const parts = (await getThemenbereiche(lang))
		.filter((tb) => BOOK_THEMENBEREICHE.includes(tb.key))
		.map((tb) => ({
			title: tb.title,
			href: getThemenbereichHref(tb, lang),
			planned: tb.bausteine.length,
			published: published.filter((p) => p.themenbereichSlug === tb.key).length,
		}));
	return {
		parts,
		planned: parts.reduce((sum, part) => sum + part.planned, 0),
		published: parts.reduce((sum, part) => sum + part.published, 0),
	};
}
