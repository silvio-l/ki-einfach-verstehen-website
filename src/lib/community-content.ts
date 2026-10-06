// Collection reads behind the community manifest and the redirect stubs.
// This is the only glue between Astro's content layer and the pure,
// unit-tested builders (community-manifest.js, community-redirects.js);
// everything that can go wrong in the data throws there and fails the build.
import { getCollection } from 'astro:content';
import { buildManifest } from './community-manifest.js';
import { NEWSLETTER_LIVE } from './newsletter';
import { buildRedirects, routesFromPageFiles } from './community-redirects.js';
import { ROUTE_SEGMENT } from '../data/published';
import { TOPIC_ROUTE_SEGMENT, getThemenbereiche } from '../data/themenbereiche';
// The raw files, only to know whether they hold anything: Astro's
// getCollection() warns on every build about a collection with no entries,
// and both files are legitimately empty until the first Baustein moves.
import retiredRaw from '../content/community/retired-bausteine.json';
import redirectsRaw from '../content/community/redirects.json';

const hasEntries = (raw: object) => Object.keys(raw).length > 0;

type Lang = 'de' | 'en';
const LANGS: Lang[] = ['de', 'en'];
const GLOSSAR_SEGMENT = { de: 'glossar', en: 'glossary' } as const;

function langOf(id: string): Lang {
	return id.startsWith('en/') ? 'en' : 'de';
}

async function loadBausteine() {
	const entries = await getCollection('bausteine');
	return entries.map((e) => ({
		lang: langOf(e.id),
		slug: e.id.slice(3),
		translationKey: e.data.translationKey,
		themenbereich: e.data.themenbereich,
		order: e.data.order,
		title: e.data.title,
		ueberarbeitet: e.data.ueberarbeitet ?? null,
	}));
}

async function loadGlossar() {
	const entries = await getCollection('glossar');
	return entries.map((e) => ({
		lang: langOf(e.id),
		slug: e.id.slice(3),
		translationKey: e.data.translationKey,
		title: e.data.title,
		description: e.data.description,
	}));
}

async function loadRetired() {
	if (!hasEntries(retiredRaw)) return [];
	const entries = await getCollection('retired-bausteine');
	return entries.map((e) => ({ key: e.id, ...e.data }));
}

async function loadRedirects() {
	if (!hasEntries(redirectsRaw)) return [];
	const entries = await getCollection('redirects');
	return entries.map((e) => ({ from: e.id, to: e.data.to }));
}

export async function getCommunityManifest() {
	const tbEntries = await getCollection('themenbereiche');
	const themenbereiche = tbEntries.map((e) => ({
		lang: langOf(e.id),
		key: e.data.translationKey,
		order: e.data.order,
		routeSlug: e.data.routeSlug,
		title: e.data.title,
	}));
	return buildManifest({
		themenbereiche,
		bausteine: await loadBausteine(),
		retired: await loadRetired(),
		// Only once the board release that parses `glossar` is live (newsletter.ts).
		glossar: NEWSLETTER_LIVE ? await loadGlossar() : null,
		generatedAt: new Date(),
	});
}

// Every route the site really generates, so a redirect stub can neither
// shadow a page nor forward into a 404. Static pages come from the file
// tree, dynamic ones from the collections that feed their getStaticPaths.
async function collectRoutes(): Promise<Set<string>> {
	const pageFiles = Object.keys(import.meta.glob('../pages/**/*.{astro,ts}')).map((f) => f.replace(/^.*\/pages/, '.'));
	const routes = routesFromPageFiles(pageFiles);
	for (const b of await loadBausteine()) routes.add(`/${b.lang}/${ROUTE_SEGMENT[b.lang]}/${b.slug}/`);
	for (const g of await getCollection('glossar')) {
		const lang = langOf(g.id);
		routes.add(`/${lang}/${GLOSSAR_SEGMENT[lang]}/${g.id.slice(3)}/`);
	}
	for (const lang of LANGS) {
		for (const tb of await getThemenbereiche(lang)) {
			routes.add(`/${lang}/${TOPIC_ROUTE_SEGMENT[lang]}/${tb.routeSlug}/`);
			// Planned Bausteine with a reserved slug already own their address
			// (noindex stub page, see src/pages/de/bausteine/[slug].astro).
			for (const b of tb.bausteine) if (b.slug) routes.add(`/${lang}/${ROUTE_SEGMENT[lang]}/${b.slug}/`);
		}
	}
	return routes;
}

export async function getCommunityRedirects() {
	return buildRedirects({ retired: await loadRetired(), redirects: await loadRedirects(), bausteine: await loadBausteine(), routes: await collectRoutes() });
}
