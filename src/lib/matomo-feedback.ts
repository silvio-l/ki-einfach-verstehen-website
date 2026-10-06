import { MATOMO_URL, MATOMO_SITE_ID } from './matomo';

// Build-time aggregate for the "War dieser Baustein hilfreich?" header badge.
// Same fail-open, cache-once pattern as github-stars.ts -- a missing token or
// an unreachable Matomo just means the badge doesn't render, never a broken
// build. The Reporting API call uses a dedicated, view-only Matomo user
// scoped to this one site (see ~/Documents/Projekte/matomo/bin/
// create-readonly-reporting-user.php) -- MATOMO_READONLY_TOKEN never reaches
// the client, only this Node build process reads it (GitHub Actions secret).
//
// Taxonomy (see BausteinFeedback.astro): category "Baustein-Feedback"
// (stable), action = the translationKey, name = the vote
// ("hilfreich"/"nicht hilfreich"). Queried here via a single Events.getName
// call with secondaryDimension=eventAction -- top-level rows are the vote,
// each with a nested subtable of per-Baustein counts. Deliberately
// unsegmented: this Matomo instance has browser/API-triggered archiving
// disabled for segments (enable_browser_archiving_triggering=0,
// browser_archiving_disabled_enforce=1 in config.ini.php), so any `segment=`
// param silently returns an empty result set instead of an error. Plain
// range reports are exempt (archiving_range_force_on_browser_request=1 in
// global.ini.php), which is what makes this call work without one.
//
// getName aggregates by event name across the WHOLE site, not just this
// category, so the "hilfreich"/"nicht hilfreich" buckets can carry
// unrelated historical rows (e.g. a retired event scheme's action value).
// SLUG_RE filters the nested action label down to plausible translationKeys
// (lowercase kebab-case) so stray non-slug labels can't pollute a tally.
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const MIN_VOTES_TO_SHOW = 5;
// Production release day: everything before it is the author's own test
// votes (2026-08-24 tracking verification), which must never surface as a
// public "x% found this helpful" figure.
export const TALLY_SINCE = '2026-10-02';

export interface FeedbackTally {
	helpfulPercent: number;
	total: number;
}

let tallyPromise: Promise<Map<string, FeedbackTally>> | null = null;

async function fetchTallies(): Promise<Map<string, FeedbackTally>> {
	const token = process.env.MATOMO_READONLY_TOKEN;
	if (!token) return new Map();

	try {
		const params = new URLSearchParams({
			module: 'API',
			method: 'Events.getName',
			idSite: String(MATOMO_SITE_ID),
			period: 'range',
			date: `${TALLY_SINCE},${new Date().toISOString().slice(0, 10)}`,
			expanded: '1',
			secondaryDimension: 'eventAction',
			format: 'JSON',
			token_auth: token,
		});
		const res = await fetch(`${MATOMO_URL}index.php?${params.toString()}`);
		if (!res.ok) return new Map();
		const rows = await res.json();
		if (!Array.isArray(rows)) return new Map();

		const votes = new Map<string, { yes: number; no: number }>();
		for (const row of rows) {
			const vote = typeof row?.label === 'string' ? row.label : null;
			if (vote !== 'hilfreich' && vote !== 'nicht hilfreich') continue;
			const subtable = Array.isArray(row?.subtable) ? row.subtable : [];
			for (const sub of subtable) {
				const translationKey = typeof sub?.label === 'string' ? sub.label : null;
				const count = typeof sub?.nb_events === 'number' ? sub.nb_events : 0;
				if (!translationKey || !count || !SLUG_RE.test(translationKey)) continue;
				const entry = votes.get(translationKey) ?? { yes: 0, no: 0 };
				if (vote === 'hilfreich') entry.yes += count;
				else entry.no += count;
				votes.set(translationKey, entry);
			}
		}

		const tallies = new Map<string, FeedbackTally>();
		for (const [translationKey, { yes, no }] of votes) {
			const total = yes + no;
			if (total < MIN_VOTES_TO_SHOW) continue;
			tallies.set(translationKey, { helpfulPercent: Math.round((yes / total) * 100), total });
		}
		return tallies;
	} catch {
		return new Map();
	}
}

export function getFeedbackTallies(): Promise<Map<string, FeedbackTally>> {
	if (!tallyPromise) tallyPromise = fetchTallies();
	return tallyPromise;
}

/** Start of the public tally as shown next to the badge, e.g. "2. Okt. 2026" / "2 Oct 2026". */
export function tallySinceLabel(lang: 'de' | 'en'): string {
	return new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		timeZone: 'UTC',
	}).format(new Date(`${TALLY_SINCE}T00:00:00Z`));
}
