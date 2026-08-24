// Resolves which roadmap Bausteine actually exist as content-collection
// entries for a given language, in confirmed roadmap order. This is the one
// place that joins the decided roadmap (src/data/themenbereiche.ts) with the
// published articles, so every component (nav CTA, hero resume logic,
// Wegkarte, cards, spotlight) agrees on what is readable and what is still
// "in Vorbereitung".
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { getThemenbereiche } from './themenbereiche';

export const ROUTE_SEGMENT = { de: 'bausteine', en: 'lessons' } as const;

export interface PublishedBaustein {
	/** Language-independent roadmap slot, e.g. "grundlagen:1". */
	key: string;
	/** Language-independent translation key — also the localStorage progress key. */
	tk: string;
	href: string;
	title: string;
	description: string;
	/** Raw markdown body (for derived facts like reading time). */
	body: string;
	themenbereichSlug: string;
	order: number;
	quiz: CollectionEntry<'bausteine'>['data']['quiz'];
}

export async function getPublished(lang: 'de' | 'en'): Promise<PublishedBaustein[]> {
	const entries = await getCollection('bausteine', (e) => e.id.startsWith(`${lang}/`));
	const themenbereiche = await getThemenbereiche(lang);
	const list: PublishedBaustein[] = [];
	for (const tb of themenbereiche) {
		for (const b of tb.bausteine) {
			const entry = entries.find((e) => e.data.themenbereich === tb.key && e.data.order === b.order);
			if (!entry) continue;
			list.push({
				key: `${tb.key}:${b.order}`,
				tk: entry.data.translationKey,
				href: `/${lang}/${ROUTE_SEGMENT[lang]}/${entry.id.slice(lang.length + 1)}`,
				title: entry.data.title,
				description: entry.data.description,
				body: entry.body ?? '',
				themenbereichSlug: tb.key,
				order: b.order,
				quiz: entry.data.quiz,
			});
		}
	}
	return list;
}

export async function getPublishedMap(lang: 'de' | 'en'): Promise<Map<string, PublishedBaustein>> {
	return new Map((await getPublished(lang)).map((p) => [p.key, p]));
}

/** Derived, honest reading-time estimate from the actual article body. */
export function readingMinutes(body: string): number {
	const words = body.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}
