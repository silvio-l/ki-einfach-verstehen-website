// Toy tokenizers for the live demo in Baustein 3 (tokenizer-ids-vokabular).
// Three deliberately different tokenizers -- one per vocabulary idea the
// Baustein discusses (whole words, reusable word pieces, single characters)
// -- so the reader sees the same sentence split three ways and the IDs
// differ between them (tokenizer and model are a fixed pair). Everything is
// invented and tiny; the word-piece vocabulary contains the five pieces of
// the Baustein's toy example with the IDs the text uses, so "Die Katze
// sitzt." encodes to 417, 82, 903, 771, 13 exactly as printed.

/** @typedef {{ text: string, id: number | null, unknown?: boolean }} Token */

const WORDS = {
	de: [
		'der', 'die', 'das', 'und', 'ist', 'ein', 'eine', 'nicht', 'auf', 'dem', 'ich', 'du', 'es', 'in',
		'zu', 'mit', 'sich', 'von', 'den', 'im', 'an', 'für', 'wie', 'was', 'wird', 'auch', 'sie', 'er',
		'wir', 'noch', 'aber', 'oder', 'so', 'nur', 'schon', 'hat', 'sind', 'kann', 'sehr', 'viel',
		'mehr', 'heute', 'morgen', 'gut', 'neu', 'alt', 'groß', 'klein', 'katze', 'hund', 'haus', 'auto',
		'sofa', 'sitzt', 'steht', 'liegt', 'läuft', 'geht', 'kommt', 'spielt', 'schläft', 'modell',
		'zahl', 'text', 'wort', 'satz', 'wörter', 'tokens', 'token', 'sprache', 'computer', 'frage',
		'antwort', 'regen', 'sonne', 'tag', 'nacht', 'zeit', 'jahr', 'kind', 'mensch', 'leben', 'welt',
		'wasser', 'buch', 'tisch', 'stuhl', 'fenster', 'tür', 'stadt', 'weg', 'hand', 'kopf', 'wahr',
		'schnell', 'langsam', 'warm', 'kalt', 'lang', 'kurz', 'hier', 'dort', 'jetzt', 'immer', 'nie',
		'.', ',', '!', '?', ':', ';',
	],
	en: [
		'the', 'a', 'an', 'and', 'is', 'are', 'was', 'not', 'on', 'in', 'at', 'to', 'of', 'for', 'with',
		'i', 'you', 'we', 'they', 'he', 'she', 'it', 'this', 'that', 'what', 'how', 'why', 'also',
		'but', 'or', 'so', 'only', 'already', 'has', 'have', 'can', 'very', 'much', 'more', 'today',
		'tomorrow', 'good', 'new', 'old', 'big', 'small', 'cat', 'cats', 'dog', 'house', 'car', 'sofa',
		'sit', 'sits', 'sat', 'stands', 'lies', 'runs', 'goes', 'comes', 'plays', 'sleeps', 'model',
		'number', 'text', 'word', 'words', 'sentence', 'token', 'tokens', 'language', 'computer',
		'question', 'answer', 'rain', 'sun', 'day', 'night', 'time', 'year', 'child', 'person', 'life',
		'world', 'water', 'book', 'table', 'chair', 'window', 'door', 'city', 'way', 'hand', 'head',
		'true', 'fast', 'slow', 'warm', 'cold', 'long', 'short', 'here', 'there', 'now', 'always',
		'never', '.', ',', '!', '?', ':', ';',
	],
};

// Word pieces. The first five are the Baustein's toy example with its IDs;
// the rest get invented IDs from 1000 upwards. A leading space is part of
// the piece, as in real vocabularies ("Katze" at a sentence start is a
// different entry than " Katze" mid-sentence). " Katze"/" cats" is
// deliberately absent, so the toy sentence must use two pieces.
const PIECES = {
	de: {
		toy: [['Die', 417], [' Kat', 82], ['ze', 903], [' sitzt', 771], ['.', 13]],
		rest: [
			' der', ' die', ' das', ' und', ' ist', ' ein', ' eine', ' nicht', ' auf', ' dem', ' einem',
			' ich', ' du', ' es', ' in', ' zu', ' mit', ' sich', ' von', ' den', ' im', ' an', ' für',
			' wie', ' was', ' wird', ' auch', ' sie', ' er', ' wir', ' noch', ' aber', ' oder', ' so',
			' nur', ' schon', ' hat', ' sind', ' kann', ' sehr', ' viel', ' mehr', ' heute', ' morgen',
			' gut', ' neu', ' alt', ' groß', ' klein', ' Hund', ' Haus', ' Auto', ' Sofa', ' Modell',
			' Lern', ' Zahl', ' Text', ' Wort', ' Satz', ' steht', ' liegt', ' läuft', ' geht', ' kommt',
			' spielt', ' schläft', ' Regen', ' Sonne', ' Tag', ' Nacht', ' Zeit', ' Jahr', ' Kind',
			' Mensch', ' Welt', ' Wasser', ' Buch', ' Tisch', ' Stuhl', ' Fenster', ' Stadt', ' Weg',
			' Hand', ' Kopf', ' schnell', ' langsam', ' warm', ' kalt', ' hier', ' dort', ' jetzt',
			' immer', ' nie', ' un', ' ge', ' ver', ' be', ' ent', ' er', ' Kat', ' Spiel', ' Lauf',
			' Sprach', ' Rechen', ' Daten', ' Com', ' Kon', ' Pro', ' Tok',
			'Der', 'Das', 'Ein', 'Eine', 'Ich', 'Du', 'Wir', 'Es', 'Lern', 'Un', 'Ge', 'Ver', 'Kat',
			'Was', 'Wie', 'Wer', 'Wo', 'Heute', 'Morgen', 'Mein', 'Dein',
			'modell', 'wahr', 'schein', 'lich', 'keit', 'heit', 'ung', 'ungen', 'isch', 'ig', 'ich',
			'en', 'er', 'es', 'em', 'st', 'te', 'ten', 'tet', 'sch', 'ch', 'ck', 'ei', 'ie', 'au', 'eu',
			'äu', 'ge', 'ver', 'be', 'ent', 'zer', 'puter', 'sprache', 'wort', 'satz', 'zahl', 'zeit',
			'tag', 'hund', 'haus', 'auto', 'sofa', 'tisch', 'maschine', 'ieren', 'iert', 'ierung',
			'gen', 'ger', 'les', 'ren', 'sen', 'den', 'ber', 'ter', 'ler', 'ner', 'mer', 'del', 'kel',
			'ar', 'or', 'al', 'el', 'il', 'ol', 'ul', 'at', 'it', 'ot', 'ut', 'an', 'in', 'on', 'un',
			',', '!', '?', ':', ';', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
		],
	},
	en: {
		toy: [['The', 417], [' cat', 82], ['s', 903], [' sit', 771], ['.', 13]],
		rest: [
			' the', ' a', ' an', ' and', ' is', ' are', ' was', ' not', ' on', ' in', ' at', ' to',
			' of', ' for', ' with', ' I', ' you', ' we', ' they', ' he', ' she', ' it', ' this', ' that',
			' what', ' how', ' why', ' also', ' but', ' or', ' so', ' only', ' already', ' has', ' have',
			' can', ' very', ' much', ' more', ' today', ' tomorrow', ' good', ' new', ' old', ' big',
			' small', ' dog', ' house', ' car', ' sofa', ' sits', ' sat', ' stands', ' lies', ' runs',
			' goes', ' comes', ' plays', ' sleeps', ' model', ' number', ' text', ' word', ' sentence',
			' token', ' language', ' computer', ' question', ' answer', ' rain', ' sun', ' day',
			' night', ' time', ' year', ' child', ' person', ' life', ' world', ' water', ' book',
			' table', ' chair', ' window', ' door', ' city', ' way', ' hand', ' head', ' true', ' fast',
			' slow', ' warm', ' cold', ' long', ' short', ' here', ' there', ' now', ' always', ' never',
			' un', ' re', ' pre', ' dis', ' learn', ' play', ' walk', ' speak', ' count', ' data',
			' com', ' con', ' pro', ' tok', ' im', ' prob', ' like', ' qu',
			'A', 'An', 'This', 'That', 'I', 'You', 'We', 'It', 'Learn', 'Un', 'Re', 'What', 'How',
			'Why', 'Today', 'My', 'Your', 'Cat', 'Dog',
			'ing', 'ed', 'er', 'est', 'ly', 'ness', 'ment', 'tion', 'sion', 'able', 'ible', 'ful',
			'less', 'ous', 'ive', 'al', 'ic', 'ity', 'ize', 'ise', 'ism', 'ist', 'ance', 'ence', 'ent',
			'ant', 'ure', 'age', 'ate', 'ary', 'ory', 'ery', 'ish', 'y', 'es', 's', 'th', 'ch', 'sh',
			'ck', 'ea', 'ee', 'oo', 'ou', 'ai', 'ie', 'ei', 'ar', 'or', 'ir', 'ur', 'el', 'il', 'ol',
			'ul', 'at', 'it', 'ot', 'ut', 'an', 'in', 'on', 'un', 'en', 'puter', 'model', 'guage',
			'bab', 'ly', 'ten', 'ter', 'ner', 'mer', 'der', 'ber', 'ler', 'ken', 'ing',
			',', '!', '?', ':', ';', '-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
		],
	},
};

const SPACE = '␣';

function pieceVocabulary(lang) {
	const map = new Map();
	for (const [piece, id] of PIECES[lang].toy) map.set(piece, id);
	let next = 1000;
	for (const piece of PIECES[lang].rest) {
		if (!map.has(piece)) map.set(piece, next);
		next += 1;
	}
	return map;
}

const cache = new Map();
function pieces(lang) {
	if (!cache.has(lang)) cache.set(lang, pieceVocabulary(lang));
	return cache.get(lang);
}

const isSpace = (ch) => /\s/.test(ch);
const isLetter = (ch) => /[\p{L}\p{N}]/u.test(ch);

/**
 * Word tokenizer: every run of letters/digits or every single punctuation
 * mark is one token; spaces are dropped. A word that is not in the word
 * list becomes the placeholder "unknown" token (id null).
 * @returns {Token[]}
 */
export function tokenizeWords(text, lang) {
	const list = WORDS[lang] ?? WORDS.de;
	const ids = new Map(list.map((word, index) => [word, index + 1]));
	const tokens = [];
	let i = 0;
	while (i < text.length) {
		const ch = text[i];
		if (isSpace(ch)) {
			i += 1;
			continue;
		}
		let piece = ch;
		if (isLetter(ch)) {
			let j = i + 1;
			while (j < text.length && isLetter(text[j])) j += 1;
			piece = text.slice(i, j);
		}
		i += piece.length;
		const id = ids.get(piece.toLowerCase()) ?? null;
		tokens.push(id === null ? { text: piece, id: null, unknown: true } : { text: piece, id });
	}
	return tokens;
}

/**
 * Word-piece tokenizer: greedy longest match against the piece vocabulary,
 * falling back to single characters (with invented IDs 5000+) so nothing
 * is ever unknown -- the "down to bytes" idea of the Baustein in miniature.
 * @returns {Token[]}
 */
export function tokenizePieces(text, lang) {
	const vocab = pieces(lang in PIECES ? lang : 'de');
	const maxLen = Math.max(...[...vocab.keys()].map((piece) => piece.length));
	const tokens = [];
	let i = 0;
	while (i < text.length) {
		let matched = null;
		for (let len = Math.min(maxLen, text.length - i); len >= 1; len -= 1) {
			const candidate = text.slice(i, i + len);
			if (vocab.has(candidate)) {
				matched = candidate;
				break;
			}
		}
		if (matched) {
			tokens.push({ text: matched, id: vocab.get(matched) });
			i += matched.length;
			continue;
		}
		const ch = String.fromCodePoint(text.codePointAt(i));
		tokens.push({ text: ch, id: 5000 + (ch.codePointAt(0) % 4000) });
		i += ch.length;
	}
	return tokens;
}

/**
 * Character tokenizer: one token per character, the ID is the character's
 * Unicode number (the one real number in this demo).
 * @returns {Token[]}
 */
export function tokenizeChars(text) {
	return [...text].map((ch) => ({ text: ch, id: ch.codePointAt(0) }));
}

export const MODES = ['words', 'pieces', 'chars'];

export function tokenize(text, mode, lang) {
	if (mode === 'words') return tokenizeWords(text, lang);
	if (mode === 'chars') return tokenizeChars(text);
	return tokenizePieces(text, lang);
}

/** Visible form of a token: spaces become an open box so they count as characters. */
export function display(text) {
	return text.replace(/ /g, SPACE).replace(/\n/g, '⏎').replace(/\t/g, '⇥');
}

/** Decoding: the stored pieces joined in the given order. Word tokens lost
 * their spaces during encoding, so they come back with one space each. */
export function decode(tokens, mode) {
	if (mode === 'words') {
		return tokens
			.map((t) => (t.unknown ? '?' : t.text))
			.reduce((out, piece) => (out && !/^[.,!?:;]$/.test(piece) && piece !== '?' ? `${out} ${piece}` : out && piece === '?' ? `${out} ?` : out + piece), '');
	}
	return tokens.map((t) => t.text).join('');
}

export function countWords(text) {
	return text.split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
}
