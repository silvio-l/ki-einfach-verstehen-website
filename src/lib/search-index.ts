// Build-time search index for the nav menu (Bausteine + Glossar). One small
// static JSON per language, fetched lazily on the first menu open — no search
// service, no extra dependency, per ADR-0001 (client-side only).
import { getCollection } from 'astro:content';
import { getPublished } from '../data/published';

export interface SearchEntry {
	/** Display title. */
	t: string;
	/** Short description shown under the title. */
	d: string;
	/** Absolute path. */
	h: string;
	/** Kind label key: "b" = Baustein, "g" = Glossar. */
	k: 'b' | 'g';
}

const GLOSSARY_SEGMENT = { de: 'glossar', en: 'glossary' } as const;

export async function buildSearchIndex(lang: 'de' | 'en'): Promise<SearchEntry[]> {
	const published = await getPublished(lang);
	const bausteine: SearchEntry[] = published.map((p) => ({ t: p.title, d: p.description, h: p.href, k: 'b' }));
	const glossar = await getCollection('glossar', (e) => e.id.startsWith(`${lang}/`));
	const terms: SearchEntry[] = glossar
		.map((e) => ({
			t: e.data.title,
			d: e.data.description,
			h: `/${lang}/${GLOSSARY_SEGMENT[lang]}/${e.id.slice(lang.length + 1)}/`,
			k: 'g' as const,
		}))
		.sort((a, b) => a.t.localeCompare(b.t, lang));
	return [...bausteine, ...terms];
}
