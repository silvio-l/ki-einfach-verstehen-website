export interface MerchDesign {
	/** Matches the PNG filename under /public/merch/ (without extension). */
	id: string;
	slogan: string;
	/** Amazon Merch on Demand product page. Null until the design is actually submitted and live. */
	amazonUrl: string | null;
}

// Same 13 designs on both the DE and EN gallery — these are products, not
// copy, so the slogans are shown as-is (some German, some English) rather
// than translated per page.
export const MERCH_DESIGNS: MerchDesign[] = [
	{ id: '01-ratelimit', slogan: 'Mein Gehirn hat gerade Rate Limit.', amazonUrl: null },
	{ id: '02-transformer', slogan: 'Ich weiß, was ein Transformer macht — und meine nicht die Autobots.', amazonUrl: null },
	{ id: '03-kontextfenster', slogan: 'Mein Kontextfenster ist voll.', amazonUrl: null },
	{ id: '04-latenz', slogan: 'Meine Latenz ist heute erhöht.', amazonUrl: null },
	{ id: '05-timeout', slogan: 'Mein Gehirn antwortet mit Timeout.', amazonUrl: null },
	{ id: '06-kaffee-inferenz', slogan: 'Ohne Kaffee keine Inferenz.', amazonUrl: null },
	{ id: '07-system-prompt', slogan: 'Kaffee ist mein System-Prompt.', amazonUrl: null },
	{ id: '08-keine-ahnung', slogan: 'Keine Ahnung. Aber eine sehr fundierte.', amazonUrl: null },
	{ id: '09-verstanden', slogan: 'Ich hab’s verstanden. Glaube ich.', amazonUrl: null },
	{ id: '10-thinking-quota', slogan: 'Thinking quota exceeded.', amazonUrl: null },
	{ id: '11-brain-unavailable', slogan: 'Brain unavailable. Try again later.', amazonUrl: null },
	{ id: '12-reasoning-disabled', slogan: 'Reasoning temporarily disabled.', amazonUrl: null },
	{ id: '13-context-limit', slogan: 'Context limit reached.', amazonUrl: null },
];
