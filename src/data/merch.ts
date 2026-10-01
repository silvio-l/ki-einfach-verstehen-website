export type MerchProductType = 'tshirt' | 'hoodie' | 'sweatshirt' | 'tumbler';

export interface MerchProduct {
	type: MerchProductType;
	/** Amazon.de ASIN of the parent listing (all sizes/colors/fits are variations of it). */
	asin: string;
	/** Suggested list price on amazon.de in EUR, as set in Merch on Demand. Amazon may sell below it. */
	priceEur: number;
}

export interface MerchDesign {
	/** Matches the WebP filename under /public/merch/ (without extension). */
	id: string;
	slogan: string;
	/** Live products, first entry is the card's default selection. Empty until the design is live. */
	products: MerchProduct[];
}

// Display order of product types in the shop filter and in each card's
// variant switch.
export const MERCH_PRODUCT_TYPES: MerchProductType[] = ['tshirt', 'hoodie', 'sweatshirt', 'tumbler'];

// Every product links to amazon.de by ASIN, for both site languages: the
// ASIN is the one stable identifier, so DE and EN always land on exactly the
// same product. EN readers get amazon.de's English interface via the
// documented `/-/en/` path prefix instead of a different marketplace (whose
// listings would carry different ASINs and, for most designs, don't exist).
export function amazonProductUrl(asin: string, lang: 'de' | 'en'): string {
	return lang === 'en' ? `https://www.amazon.de/-/en/dp/${asin}` : `https://www.amazon.de/dp/${asin}`;
}

// Same 12 designs on both the DE and EN shop — these are products, not
// copy, so the slogans are shown as-is (some German, some English) rather
// than translated per page.
//
// A 13th design ("02-transformer") existed in this collection but was
// rejected by Amazon for trademark/copyright reasons (referenced "Transformer"
// and "Autobots", both Hasbro trademarks) and was dropped entirely rather than
// reworked — no replacement design, final collection size is 12.
//
// ASINs read from the Merch on Demand account (Verwalten → Produkte, brand
// "ki-einfach-verstehen.de", marketplace DE, status PUBLISHED) on 2026-10-01
// and each confirmed to resolve on amazon.de.
export const MERCH_DESIGNS: MerchDesign[] = [
	{ id: '01-ratelimit', slogan: 'Mein Gehirn hat gerade Rate Limit.', products: [{ type: 'tshirt', asin: 'B0HGH77W18', priceEur: 15.99 }] },
	{ id: '03-kontextfenster', slogan: 'Mein Kontextfenster ist voll.', products: [{ type: 'tshirt', asin: 'B0HGH9BNZK', priceEur: 15.99 }] },
	{ id: '04-latenz', slogan: 'Meine Latenz ist heute erhöht.', products: [{ type: 'tshirt', asin: 'B0HGHKTKX4', priceEur: 15.99 }] },
	{ id: '05-timeout', slogan: 'Mein Gehirn antwortet mit Timeout.', products: [{ type: 'tshirt', asin: 'B0HGGRLP56', priceEur: 15.99 }] },
	{ id: '06-kaffee-inferenz', slogan: 'Ohne Kaffee keine Inferenz.', products: [{ type: 'tshirt', asin: 'B0HGGWM1GK', priceEur: 15.99 }] },
	{ id: '07-system-prompt', slogan: 'Kaffee ist mein System-Prompt.', products: [{ type: 'tshirt', asin: 'B0HGGN26HS', priceEur: 15.99 }] },
	{ id: '08-keine-ahnung', slogan: 'Keine Ahnung. Aber eine sehr fundierte.', products: [{ type: 'tshirt', asin: 'B0HGGPGHCY', priceEur: 15.99 }] },
	{ id: '09-verstanden', slogan: 'Ich hab’s verstanden. Glaube ich.', products: [{ type: 'tshirt', asin: 'B0HGGQYR82', priceEur: 15.99 }] },
	{ id: '10-thinking-quota', slogan: 'Thinking quota exceeded.', products: [{ type: 'tshirt', asin: 'B0HGGNLQMV', priceEur: 15.99 }] },
	{ id: '11-brain-unavailable', slogan: 'Brain unavailable. Try again later.', products: [{ type: 'tshirt', asin: 'B0HGGPZN1S', priceEur: 15.99 }] },
	{ id: '12-reasoning-disabled', slogan: 'Reasoning temporarily disabled.', products: [{ type: 'tshirt', asin: 'B0HGGVHNK1', priceEur: 15.99 }] },
	{
		id: '13-context-limit',
		slogan: 'Context limit reached.',
		products: [
			{ type: 'tshirt', asin: 'B0HGHPVCGB', priceEur: 15.99 },
			{ type: 'hoodie', asin: 'B0HGH9C36K', priceEur: 29.99 },
			{ type: 'sweatshirt', asin: 'B0HGHPNVPD', priceEur: 33.99 },
		],
	},
];
