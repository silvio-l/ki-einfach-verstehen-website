// Self-hosted Matomo instance (existing, shared across projects -- see
// ~/.claude/infrastructure/README.md, and the dedicated admin project at
// ~/Documents/Projekte/matomo, docs/sites.md). Not a secret: the site ID
// and tracker URL are visible in the client-side snippet by definition,
// so both are committed literals rather than env vars.
export const MATOMO_URL = 'https://matomo.silvio-und-maik.de/';
// Site 9, "KI einfach verstehen" -- registered 2026-08-24.
export const MATOMO_SITE_ID = 9;
