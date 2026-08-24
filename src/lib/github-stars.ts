// Build-time star count for the public website mirror. Fetched once per
// build (module-level cached promise -- Astro frontmatter runs per page,
// and this repo builds 100+ pages) and never allowed to fail the build:
// a rate-limited or unreachable GitHub API just means the UI renders
// without a number.
export const GITHUB_REPO = 'silvio-l/ki-einfach-verstehen-website';
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`;

let starsPromise: Promise<number | null> | null = null;

async function fetchStars(): Promise<number | null> {
	try {
		const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
		// Set by packages/website/.github/workflows/deploy.yml from the
		// Actions-provided secrets.GITHUB_TOKEN -- lifts the anonymous 60
		// req/hr cap, not a project secret.
		const token = process.env.GITHUB_TOKEN;
		if (token) headers.Authorization = `Bearer ${token}`;
		const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, { headers });
		if (!res.ok) return null;
		const data = await res.json();
		return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
	} catch {
		return null;
	}
}

export function getGithubStars(): Promise<number | null> {
	if (!starsPromise) starsPromise = fetchStars();
	return starsPromise;
}
