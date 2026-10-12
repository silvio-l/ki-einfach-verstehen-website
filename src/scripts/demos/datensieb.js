// Logic for the data sieve demo (Baustein aus-text-werden-uebungsaufgaben):
// invented web pages run through three stages, the way real training data is
// filtered. The quality rules are the thresholds DeepMind published for
// Gopher's MassiveWeb data (Rae et al. 2021, arXiv 2112.11446, section A.1.1);
// the language check is a simplified stand-in for a real language classifier
// (Llama 3 uses fastText), and duplicates are exact copies after normalising
// case and whitespace. datensieb.test.mjs pins every page's outcome.

/** Gopher's quality thresholds. */
export const RULES = {
	minWords: 50,
	maxWords: 100_000,
	minMeanWordLength: 3,
	maxMeanWordLength: 10,
	maxSymbolRatio: 0.1,
	maxBulletShare: 0.9,
	maxEllipsisShare: 0.3,
	minLetterShare: 0.8,
};

const BULLET = /^\s*[•·\-*‣▪]/;
const ELLIPSIS_END = /(\.\.\.|…)\s*$/;

/** The measurements the quality rules look at. */
export function stats(text) {
	const words = text.split(/\s+/).filter(Boolean);
	const lines = text.split('\n').filter((line) => line.trim());
	const n = words.length || 1;
	return {
		words: words.length,
		meanWordLength: words.reduce((sum, w) => sum + [...w].length, 0) / n,
		// Gopher checks each symbol on its own: hashes per word, ellipses per word.
		symbolRatio: Math.max((text.match(/#/g) ?? []).length, (text.match(/\.\.\.|…/g) ?? []).length) / n,
		bulletShare: lines.filter((l) => BULLET.test(l)).length / (lines.length || 1),
		ellipsisShare: lines.filter((l) => ELLIPSIS_END.test(l)).length / (lines.length || 1),
		letterShare: words.filter((w) => /\p{L}/u.test(w)).length / n,
	};
}

/** Keys of every quality rule a text fails, in a fixed order. */
export function qualityReasons(text) {
	const s = stats(text);
	const reasons = [];
	if (s.words < RULES.minWords) reasons.push('too-short');
	if (s.words > RULES.maxWords) reasons.push('too-long');
	if (s.words >= RULES.minWords && (s.meanWordLength < RULES.minMeanWordLength || s.meanWordLength > RULES.maxMeanWordLength)) reasons.push('word-length');
	if (s.symbolRatio > RULES.maxSymbolRatio) reasons.push('symbols');
	if (s.bulletShare > RULES.maxBulletShare) reasons.push('bullets');
	if (s.ellipsisShare > RULES.maxEllipsisShare) reasons.push('ellipsis');
	if (s.letterShare < RULES.minLetterShare) reasons.push('letters');
	return reasons;
}

const STOPWORDS = {
	de: new Set(['der', 'die', 'das', 'und', 'du', 'dein', 'ist', 'nicht', 'mit', 'den', 'dem', 'im', 'ein', 'eine', 'einen', 'zu', 'für', 'auf', 'sie', 'es', 'bei', 'von', 'oder', 'wenn', 'lass', 'so']),
	en: new Set(['the', 'and', 'you', 'your', 'is', 'a', 'an', 'to', 'of', 'in', 'it', 'for', 'on', 'with', 'if', 'that', 'after', 'before', 'or', 'have', 'keeps']),
};

/** 'de', 'en', or null when the page has too few ordinary words to tell. */
export function detectLanguage(text) {
	const words = text.toLowerCase().match(/\p{L}+/gu) ?? [];
	const de = words.filter((w) => STOPWORDS.de.has(w)).length;
	const en = words.filter((w) => STOPWORDS.en.has(w)).length;
	if (de + en < 3 || de === en) return null;
	return de > en ? 'de' : 'en';
}

const normalise = (text) => text.toLowerCase().replace(/\s+/g, ' ').trim();

/** The stages in order; a page leaves at the first one that removes it. */
export const STAGES = ['language', 'quality', 'duplicates'];

/**
 * Run the pages through all stages for a part in language `main`.
 * Returns one result per page: { id, stage, reasons } where stage is the
 * index in STAGES that took the page out, or null if it stays.
 */
export function sieve(pages, main) {
	const seen = new Set();
	return pages.map((page) => {
		const lang = detectLanguage(page.text);
		if (lang && lang !== main) return { id: page.id, stage: 0, reasons: [lang] };
		const reasons = qualityReasons(page.text);
		if (reasons.length) return { id: page.id, stage: 1, reasons };
		const key = normalise(page.text);
		if (seen.has(key)) return { id: page.id, stage: 2, reasons: ['duplicate'] };
		seen.add(key);
		return { id: page.id, stage: null, reasons: [] };
	});
}

/** How many pages are still in after `done` stages. */
export function remainingAfter(results, done) {
	return results.filter((r) => r.stage === null || r.stage >= done).length;
}

// ---------------------------------------------------------------------------
// The invented pages. Every page and address is made up for the demo.

const keywordsDe = [
	'Fahrrad günstig kaufen', 'Fahrrad kaufen online', 'E-Bike günstig bestellen', 'Fahrrad Angebot heute',
	'Fahrrad billig kaufen', 'Fahrrad Sale jetzt', 'Rennrad günstig kaufen', 'Fahrrad kaufen Berlin',
	'Fahrrad kaufen Hamburg', 'Fahrrad kaufen München', 'Kinderfahrrad günstig kaufen', 'Fahrrad gebraucht kaufen',
	'Fahrrad Schnäppchen online', 'Fahrrad Rabatt heute', 'Fahrrad Angebote vergleichen', 'Fahrrad kaufen schnell',
	'Mountainbike günstig kaufen', 'Fahrrad bestellen günstig', 'Fahrrad Versand kostenlos', 'Fahrrad kaufen jetzt',
];
const keywordsEn = [
	'buy cheap bike', 'buy bike online', 'cheap e-bike order', 'bike deal today',
	'bike sale now', 'cheap road bike', 'buy bike London', 'buy bike Leeds',
	'buy bike Bristol', 'cheap kids bike', 'used bike buy', 'bike bargain online',
	'bike discount today', 'compare bike deals', 'buy bike fast', 'cheap mountain bike',
	'order bike cheap', 'bike free delivery', 'buy bike now', 'best bike price',
];
const codes = Array.from({ length: 25 }, (_, i) => `# ${String(4711 + i * 37).padStart(4, '0')}-${String(815 + i * 53).padStart(4, '0')}`).join('\n');

const careDe =
	'Ein Fahrrad fährt länger gut, wenn du es regelmäßig pflegst. Wisch nach einer Fahrt im Regen den Rahmen und die Kette trocken. Einmal im Monat bekommt die Kette ein paar Tropfen Öl, überschüssiges Öl nimmst du mit einem Lappen ab. Prüf vor jeder längeren Tour den Luftdruck der Reifen und die Bremsen. Klingt eine Bremse schleifend oder greift sie schwach, lass sie in einer Werkstatt einstellen. So bleibt das Rad sicher und leise.';
const careEn =
	'A bike keeps running well if you look after it regularly. After a ride in the rain, wipe the frame and the chain dry. Once a month, give the chain a few drops of oil and wipe off what is left over with a cloth. Before every longer ride, check the tyre pressure and the brakes. If a brake sounds scratchy or feels weak, have a workshop adjust it. That keeps the bike safe and quiet.';

export const PAGES = {
	de: [
		{ id: 'pflege', address: 'radratgeber.example/pflege', title: 'So pflegst du dein Fahrrad', text: careDe },
		{ id: 'suchbegriffe', address: 'rad-deals.example/angebote', title: 'Fahrrad günstig kaufen', text: keywordsDe.map((k) => `• ${k}`).join('\n') },
		{ id: 'menue', address: 'radverein.example/', title: 'Menü', text: 'Start\nÜber uns\nKontakt\nImpressum\nDatenschutz' },
		{ id: 'kopie', address: 'fahrrad-tipps.example/pflege-kopie', title: 'So pflegst du dein Fahrrad', text: careDe },
		{ id: 'englisch', address: 'bike-guide.example/care', title: 'How to look after your bike', text: careEn },
		{
			id: 'amtsdeutsch',
			address: 'landratsamt.example/antrag',
			title: 'Hinweise zur Antragstellung',
			text: 'Antragsberechtigte Personen reichen die vollständigen Antragsunterlagen innerhalb der Bearbeitungsfrist beim zuständigen Bürgerservicezentrum ein. Erforderlich sind Einkommensnachweise, Mietbescheinigungen, Meldebescheinigungen sowie gegebenenfalls Unterhaltsnachweise. Unvollständige Antragsunterlagen verzögern die Bearbeitung erheblich. Über Fristverlängerungsanträge entscheidet die Bewilligungsstelle nach pflichtgemäßem Ermessen. Gegen Ablehnungsbescheide besteht Widerspruchsmöglichkeit innerhalb eines Monats nach Bekanntgabe. Zuständigkeitsbereich, Sprechzeiten und Terminvereinbarung entnehmen Antragstellerinnen und Antragsteller bitte dem Behördenverzeichnis. Datenschutzrechtliche Informationen enthält das beigefügte Merkblatt zur Verarbeitung personenbezogener Daten.',
		},
		{
			id: 'teaser',
			address: 'rad-news.example/',
			title: 'Das musst du lesen',
			text: [
				'Zehn Tipps für deinen nächsten Radurlaub …',
				'Diese Strecke am See kennt kaum jemand …',
				'Was Profis beim Packen ganz anders machen …',
				'Der eine Fehler, den fast alle Radler machen …',
				'So findest du den richtigen Sattel für dich …',
				'Warum dein Reifen immer wieder Luft verliert …',
				'Die schönsten Radwege an der Küste im Überblick …',
				'Mit diesem Trick bleibt die Kette lange sauber …',
				'Was ein gutes Schloss wirklich kosten sollte …',
			].join('\n'),
		},
		{
			id: 'rezept',
			address: 'backstube.example/apfelkuchen',
			title: 'Einfacher Apfelkuchen',
			text: 'Für einen einfachen Apfelkuchen verrührst du 200 Gramm Mehl, 100 Gramm Zucker, 125 Gramm weiche Butter und zwei Eier zu einem glatten Teig. Drück den Teig in eine gefettete Form. Schneide drei Äpfel in dünne Spalten und leg sie dicht auf den Teig. Streu etwas Zimt darüber. Back den Kuchen bei 180 Grad etwa 40 Minuten, bis er goldbraun ist. Lass ihn vor dem Anschneiden ein wenig abkühlen.',
		},
		{ id: 'nummern', address: 'teile-lager.example/liste', title: 'Bestellnummern', text: codes },
	],
	en: [
		{ id: 'pflege', address: 'bike-guide.example/care', title: 'How to look after your bike', text: careEn },
		{ id: 'suchbegriffe', address: 'bike-deals.example/offers', title: 'Buy cheap bike', text: keywordsEn.map((k) => `• ${k}`).join('\n') },
		{ id: 'menue', address: 'cycling-club.example/', title: 'Menu', text: 'Home\nAbout us\nContact\nImprint\nPrivacy' },
		{ id: 'kopie', address: 'bike-tips.example/care-copy', title: 'How to look after your bike', text: careEn },
		{ id: 'englisch', address: 'radratgeber.example/pflege', title: 'So pflegst du dein Fahrrad', text: careDe },
		{
			id: 'teaser',
			address: 'bike-news.example/',
			title: 'You have to read this',
			text: [
				'Ten tips for your next cycling holiday …',
				'Hardly anyone knows this lakeside route …',
				'What professionals do differently when packing …',
				'The one mistake that almost every cyclist makes …',
				'How to find the right saddle for you …',
				'Why your tyre keeps losing air again and again …',
				'The most beautiful coastal cycle paths at a glance …',
				'With this trick your chain stays clean for longer …',
				'What a good lock should really cost you …',
			].join('\n'),
		},
		{
			id: 'rezept',
			address: 'bakery.example/apple-cake',
			title: 'Simple apple cake',
			text: 'For a simple apple cake, mix 200 grams of flour, 100 grams of sugar, 125 grams of soft butter and two eggs into a smooth dough. Press the dough into a greased tin. Cut three apples into thin slices and lay them closely on the dough. Sprinkle a little cinnamon over them. Bake the cake at 180 degrees for about 40 minutes until it is golden brown. Let it cool a little before you cut it.',
		},
		{ id: 'nummern', address: 'parts-store.example/list', title: 'Order numbers', text: codes },
	],
};
