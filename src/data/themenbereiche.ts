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

/**
 * How many Themenbereiche and planned Bausteine the roadmap currently has.
 * Pages derive every count they show from here at build time, so copy never
 * drifts from the content collection (scripts/check-curriculum-counts.test.mjs
 * rejects hard-coded counts in the site source).
 */
export async function getCurriculumCounts(lang: 'de' | 'en'): Promise<{ themenbereiche: number; bausteine: number }> {
	const themenbereiche = await getThemenbereiche(lang);
	return {
		themenbereiche: themenbereiche.length,
		bausteine: themenbereiche.reduce((n, tb) => n + tb.bausteine.length, 0),
	};
}

const COUNT_WORDS = {
	de: ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'],
	en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'],
} as const;

/** Small counts as words ("vier", "Four"), larger ones as digits -- the usual style rule for running text. */
export function countWord(n: number, lang: 'de' | 'en', capitalize = false): string {
	const word = COUNT_WORDS[lang][n] ?? String(n);
	return capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}
