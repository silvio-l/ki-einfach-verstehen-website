// Self-hosted Matomo instance (existing, shared across projects -- see
// ~/.claude/infrastructure/README.md). Not a secret: the site ID and
// tracker URL are visible in the client-side snippet by definition, so
// both are committed literals rather than env vars.
export const MATOMO_URL = 'https://matomo.silvio-und-maik.de/';
// TODO: replace once the "ki-einfach-verstehen.de" site exists in the
// Matomo admin and its numeric ID is known (see chat -- open question).
export const MATOMO_SITE_ID = 0;
