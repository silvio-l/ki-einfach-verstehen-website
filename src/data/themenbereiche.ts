import { getCollection } from 'astro:content';

export interface ThemenbereichBaustein {
	order: number;
	title: string;
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
			bausteine: [...entry.data.bausteine].sort((a, b) => a.order - b.order),
		}))
		.sort((a, b) => a.order - b.order);
}

export function getThemenbereichHref(themenbereich: Themenbereich, lang: 'de' | 'en'): string {
	return `/${lang}/${TOPIC_ROUTE_SEGMENT[lang]}/${themenbereich.routeSlug}`;
}
