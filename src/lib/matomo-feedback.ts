import { MATOMO_URL, MATOMO_SITE_ID } from './matomo';

// Build-time aggregate for the "War dieser Baustein hilfreich?" header badge.
// Same fail-open, cache-once pattern as github-stars.ts -- a missing token or
// an unreachable Matomo just means the badge doesn't render, never a broken
// build. The Reporting API call uses a dedicated, view-only Matomo user
// scoped to this one site (see ~/Documents/Projekte/matomo/bin/
// create-readonly-reporting-user.php) -- MATOMO_READONLY_TOKEN never reaches
// the client, only this Node build process reads it (GitHub Actions secret).
//
// event_name encodes "<translationKey>:<vote>" (see BausteinFeedback.astro),
// so one Events.getName call for the whole site, segmented down to the
// stable category/action pair, gives every Baustein's tally in one request.
const MIN_VOTES_TO_SHOW = 5;

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
			date: `2000-01-01,${new Date().toISOString().slice(0, 10)}`,
			segment: 'eventCategory==Baustein;eventAction==Baustein bewertet',
			flat: '1',
			format: 'JSON',
			token_auth: token,
		});
		const res = await fetch(`${MATOMO_URL}index.php?${params.toString()}`);
		if (!res.ok) return new Map();
		const rows = await res.json();
		if (!Array.isArray(rows)) return new Map();

		const votes = new Map<string, { yes: number; no: number }>();
		for (const row of rows) {
			const label = typeof row?.label === 'string' ? row.label : null;
			const count = typeof row?.nb_events === 'number' ? row.nb_events : 0;
			if (!label || !count) continue;
			const sep = label.indexOf(':');
			if (sep === -1) continue;
			const translationKey = label.slice(0, sep);
			const vote = label.slice(sep + 1);
			const entry = votes.get(translationKey) ?? { yes: 0, no: 0 };
			if (vote === 'hilfreich') entry.yes += count;
			else if (vote === 'nicht hilfreich') entry.no += count;
			else continue;
			votes.set(translationKey, entry);
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
