// Follow-up help after a negative Baustein vote (BausteinFeedback.astro).
// Pure decision logic, kept out of the component so it can be unit-tested:
// which offers to reveal depends on the vote and on what the page actually
// carries -- the "explain it simpler" buttons are injected client-side by
// ExplainSimpler.astro (and skip near-empty blocks), the community link only
// exists while the forum is live (COMMUNITY_LIVE).

/** The vote value that asks for help (matches data-feedback-vote). */
export const NEGATIVE_VOTE = 'nicht hilfreich';

/**
 * @param {{ vote: string | null | undefined, hasExplain: boolean, hasCommunity: boolean }} input
 * @returns {{ show: boolean, explain: boolean, community: boolean }}
 */
export function helpOffers({ vote, hasExplain, hasCommunity }) {
	if (vote !== NEGATIVE_VOTE) return { show: false, explain: false, community: false };
	const explain = Boolean(hasExplain);
	const community = Boolean(hasCommunity);
	return { show: explain || community, explain, community };
}
