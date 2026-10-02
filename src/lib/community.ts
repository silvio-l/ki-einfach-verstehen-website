// Community board (docs/community/spec.md, ADR-0020/-0022): the one place
// the website knows the forum's origin. Production is the literal below;
// a staging build points at the staging forum via PUBLIC_COMMUNITY_ORIGIN
// (same mechanism as PUBLIC_ANALYTICS/PUBLIC_ADS in scripts/deploy-staging.sh).
// A bare https origin only -- no path, no trailing slash -- because every
// URL the widget builds is `${COMMUNITY_ORIGIN}/...` and the widget drops
// any thread URL that is not on exactly this origin.
const DEFAULT_ORIGIN = 'https://community.ki-einfach-verstehen.de';

function resolveOrigin(value: unknown): string {
	if (typeof value !== 'string' || value === '') return DEFAULT_ORIGIN;
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		throw new Error(`PUBLIC_COMMUNITY_ORIGIN is not a URL: "${value}"`);
	}
	if (url.protocol !== 'https:' || url.origin !== value) {
		throw new Error(`PUBLIC_COMMUNITY_ORIGIN must be a bare https origin (no path, no trailing slash): "${value}"`);
	}
	return value;
}

export const COMMUNITY_ORIGIN = resolveOrigin(import.meta.env.PUBLIC_COMMUNITY_ORIGIN);

// Launch switch. Until the forum is live, the website carries no links into
// it: the community page keeps its "in Vorbereitung" status, Bausteine
// render neither the ask button nor the widget, and the privacy policy does
// not describe a request that never happens. Set PUBLIC_COMMUNITY_LIVE=true
// in the production build once the forum answers.
export const COMMUNITY_LIVE = import.meta.env.PUBLIC_COMMUNITY_LIVE === 'true';

export const COMMUNITY_PRIVACY_HREF = { de: `${COMMUNITY_ORIGIN}/datenschutz`, en: `${COMMUNITY_ORIGIN}/privacy` } as const;

// Board entry per website language: the forum reads `?lang=en` to open in
// English; German is its default and needs no hint.
export const COMMUNITY_BOARD_HREF = { de: COMMUNITY_ORIGIN, en: `${COMMUNITY_ORIGIN}/?lang=en` } as const;

// Every link into the board carries target="_blank" rel="noopener" (owner
// decision 2026-10-02): the reader keeps their place in the Baustein, and the
// board is a separate site with its own header. Written out on each <a>, not
// spread from a shared object: Astro adds its scoped class to spread props.
