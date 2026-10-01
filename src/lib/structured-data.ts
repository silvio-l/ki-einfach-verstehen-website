// schema.org JSON-LD builders for the few page types search engines get
// structured data for: the homepage (WebSite + Organization), a Baustein
// (Article + BreadcrumbList) and a glossary entry (DefinedTerm +
// BreadcrumbList). Layouts pass the result to PageShell's `jsonLd` prop.
// Kept deliberately small -- only properties Google documents as used, no
// speculative vocab.
import { GITHUB_REPO_URL } from './github-stars';

export const SITE_NAME = 'KI einfach verstehen';
const SITE_DESCRIPTION = {
	de: 'KI einfach verstehen zeigt dir, wie Künstliche Intelligenz wirklich funktioniert — verständlich erklärt, ohne an der Oberfläche stehen zu bleiben.',
	en: 'KI einfach verstehen shows you how artificial intelligence really works — explained clearly, without stopping at the surface.',
} as const;

type Lang = 'de' | 'en';
type Json = Record<string, unknown>;

const abs = (site: URL, path: string) => new URL(path, site).href;

/** Stable node ids so pages can reference the publisher instead of repeating it. */
const organizationId = (site: URL) => abs(site, '/#organization');

export function organization(site: URL): Json {
	return {
		'@type': 'Organization',
		'@id': organizationId(site),
		name: SITE_NAME,
		url: site.href,
		logo: { '@type': 'ImageObject', url: abs(site, '/apple-touch-icon.png'), width: 180, height: 180 },
		sameAs: [GITHUB_REPO_URL],
	};
}

/** Homepage graph: the site itself plus the organization behind it. */
export function homeGraph(site: URL, lang: Lang): Json {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': abs(site, '/#website'),
				url: site.href,
				name: SITE_NAME,
				description: SITE_DESCRIPTION[lang],
				inLanguage: ['de', 'en'],
				publisher: { '@id': organizationId(site) },
			},
			organization(site),
		],
	};
}

export interface Crumb {
	name: string;
	/** Absolute URL; omitted for the current page (last crumb). */
	url?: string;
}

export function breadcrumbList(crumbs: Crumb[]): Json {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			...(c.url ? { item: c.url } : {}),
		})),
	};
}

export interface ArticleInput {
	site: URL;
	lang: Lang;
	url: string;
	headline: string;
	description: string;
	image: string;
	/** ISO dates (YYYY-MM-DD) from git history; omitted when unknown. */
	datePublished?: string;
	dateModified?: string;
	wordCount?: number;
	crumbs: Crumb[];
}

/** A Baustein: an Article published by the project, with its breadcrumb trail. */
export function articleGraph(a: ArticleInput): Json {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'Article',
				'@id': `${a.url}#article`,
				mainEntityOfPage: a.url,
				url: a.url,
				headline: a.headline,
				description: a.description,
				inLanguage: a.lang,
				image: a.image,
				...(a.datePublished ? { datePublished: a.datePublished } : {}),
				...(a.dateModified ? { dateModified: a.dateModified } : {}),
				...(a.wordCount ? { wordCount: a.wordCount } : {}),
				isAccessibleForFree: true,
				author: { '@id': organizationId(a.site) },
				publisher: { '@id': organizationId(a.site) },
			},
			breadcrumbList(a.crumbs),
			organization(a.site),
		],
	};
}

export interface TermInput {
	site: URL;
	lang: Lang;
	url: string;
	name: string;
	description: string;
	/** Absolute URL of the glossary index this term belongs to. */
	glossaryUrl: string;
	glossaryName: string;
	crumbs: Crumb[];
}

/** A glossary entry: a DefinedTerm inside the site's glossary set. */
export function termGraph(t: TermInput): Json {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'DefinedTerm',
				'@id': `${t.url}#term`,
				url: t.url,
				name: t.name,
				description: t.description,
				inLanguage: t.lang,
				inDefinedTermSet: { '@type': 'DefinedTermSet', name: t.glossaryName, url: t.glossaryUrl },
			},
			breadcrumbList(t.crumbs),
		],
	};
}
