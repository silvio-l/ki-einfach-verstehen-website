import { getCollection } from 'astro:content';

export interface ThemenbereichBaustein {
	order: number;
	title: string;
	/** Permanent future slug for a not-yet-written Baustein; undefined once published (slug then lives on the content entry). */
	slug?: string;
}

export interface Themenbereich {
	/** Language-independent key used by Baustein frontmatter. */
	key: string;
	/** Localized URL segment, e.g. `grundlagen` or `foundations`. */
	routeSlug: string;
	title: string;
	description: string;
	order: number;
	bausteine: ThemenbereichBaustein[];
}

export const TOPIC_ROUTE_SEGMENT = { de: 'themenbereich', en: 'topic' } as const;

export async function getThemenbereiche(lang: 'de' | 'en'): Promise<Themenbereich[]> {
	const entries = await getCollection('themenbereiche', (entry) => entry.id.startsWith(`${lang}/`));
	return entries
		.map((entry) => ({
			key: entry.data.translationKey,
			routeSlug: entry.data.routeSlug,
			title: entry.data.title,
			description: entry.data.description,
			order: entry.data.order,
			bausteine: [...entry.data.bausteine].sort((a, b) => a.order - b.order).map((b) => ({ order: b.order, title: b.title, slug: b.slug })),
		}))
		.sort((a, b) => a.order - b.order);
}

export function getThemenbereichHref(themenbereich: Themenbereich, lang: 'de' | 'en'): string {
	return `/${lang}/${TOPIC_ROUTE_SEGMENT[lang]}/${themenbereich.routeSlug}/`;
}

const LESSON_ROUTE_SEGMENT = { de: 'bausteine', en: 'lessons' } as const;

/** Stub-page href for a not-yet-published Baustein with a reserved slug; undefined until a slug is reserved. */
export function getPlannedBausteinHref(baustein: ThemenbereichBaustein, lang: 'de' | 'en'): string | undefined {
	if (!baustein.slug) return undefined;
	return `/${lang}/${LESSON_ROUTE_SEGMENT[lang]}/${baustein.slug}/`;
}
