// Newsletter "Neues aus KI einfach verstehen" (EN "News from KI einfach
// verstehen", ADR-0004). The community board keeps the subscriber list, the
// double opt-in and the archive; the website only renders a plain HTML form
// that posts straight to the board (no JS, no cookies, no third party). The
// board answers 303 to /de/newsletter/danke/ resp. /en/newsletter/thanks/.
import { COMMUNITY_ORIGIN } from './community';

// Launch switch, like COMMUNITY_LIVE: until the board release with the
// newsletter endpoints is in production, the website renders no form, no
// footer link and no glossary list in the community manifest (an older
// board rejects unknown manifest keys). The staging build sets it; set
// PUBLIC_NEWSLETTER_LIVE=true in the production build after the board release.
export const NEWSLETTER_LIVE = import.meta.env.PUBLIC_NEWSLETTER_LIVE === 'true';

export const NEWSLETTER_NAME = { de: 'Neues aus KI einfach verstehen', en: 'News from KI einfach verstehen' } as const;

/** Board endpoint the signup form posts to (path per language, the board derives the subscriber's language from it). */
export const NEWSLETTER_SIGNUP_ACTION = {
	de: `${COMMUNITY_ORIGIN}/neues/anmelden`,
	en: `${COMMUNITY_ORIGIN}/news/subscribe`,
} as const;

/** Public web archive of sent issues on the board. */
export const NEWSLETTER_ARCHIVE_HREF = { de: `${COMMUNITY_ORIGIN}/neues`, en: `${COMMUNITY_ORIGIN}/news` } as const;

/** Explanation page and thank-you page on the website. */
export const NEWSLETTER_PAGE_HREF = { de: '/de/newsletter/', en: '/en/newsletter/' } as const;
export const NEWSLETTER_THANKS_HREF = { de: '/de/newsletter/danke/', en: '/en/newsletter/thanks/' } as const;

/**
 * Version of the consent text below. The board stores this id with every
 * signup as proof of consent (Art. 7(1) GDPR); change both together, here and
 * in packages/community, whenever the wording changes.
 */
export const NEWSLETTER_CONSENT_VERSION = '2026-10-06';

/** The consent sentence, split around the privacy link. Must match the board verbatim. */
export const NEWSLETTER_CONSENT = {
	de: {
		pre: 'Mit dem Absenden bist du einverstanden, dass dir das Projekt höchstens einmal im Monat „Neues aus KI einfach verstehen“ per E-Mail schickt. Zuerst kommt eine Mail zum Bestätigen; abmelden kannst du dich jederzeit über den Link in jeder Ausgabe. Mehr dazu in der ',
		link: 'Datenschutzerklärung',
		post: '.',
		href: '/de/datenschutz/#newsletter',
	},
	en: {
		pre: 'By subscribing you agree that the project sends you “News from KI einfach verstehen” by email at most once a month. You first get an email to confirm; you can unsubscribe at any time via the link in every issue. Details in the ',
		link: 'privacy policy',
		post: '.',
		href: '/en/privacy/#newsletter',
	},
} as const;

/** Board account page where forum members switch the newsletter on (identity.notifications). */
export const NEWSLETTER_ACCOUNT_HREF = {
	de: `${COMMUNITY_ORIGIN}/konto/benachrichtigungen`,
	en: `${COMMUNITY_ORIGIN}/account/notifications`,
} as const;
