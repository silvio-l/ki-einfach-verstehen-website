// /version.json -- which website source a deployment was built from, so
// `pnpm check:published` (private repo) can tell whether live and staging
// serve what the repo says they should (ADR-0035). `tree` is the git tree
// hash of the website directory: the same value in the private monorepo
// (HEAD:packages/website) and in the public mirror (its root tree), because
// the subtree split keeps trees unchanged. It carries no commit hash, branch
// or path of the private repo. Without git (e.g. a tarball build) the fields
// are null instead of failing the build.
import { execFileSync } from 'node:child_process';
import type { APIRoute } from 'astro';

const git = (args: string[]) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

function source(): { tree: string | null; dirty: boolean | null } {
	try {
		// "HEAD:./" resolves relative to the working directory, the website root.
		return { tree: git(['rev-parse', 'HEAD:./']), dirty: git(['status', '--porcelain', '--', '.']) !== '' };
	} catch {
		return { tree: null, dirty: null };
	}
}

export const GET: APIRoute = () =>
	new Response(JSON.stringify({ ...source(), builtAt: new Date().toISOString() }, null, 2), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
