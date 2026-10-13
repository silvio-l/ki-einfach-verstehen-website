// Rules for the demo "Drei Stellen" (Baustein trainingsdaten-urheberrecht-und-
// datenschutz). Simplified on purpose: it shows which question each of the three
// places asks, not what a court would decide. No legal advice, no numbers.

export const TEXT_KINDS = {
	blog: { oeffentlich: true, chat: false },
	lied: { oeffentlich: true, chat: false },
	gedicht: { oeffentlich: false, chat: false },
	foto: { oeffentlich: true, chat: false },
	chat: { oeffentlich: false, chat: true },
};

// Wording per language; the rules in assess() are the same for both.
const LINES = {
	de: {
		chatAus: 'Dein Gespräch fließt nach der Einstellung nicht in ein späteres Training, soweit der Anbieter sie umsetzt. Ob der Anbieter trotzdem Feedback oder Gespräche zur Sicherheitsprüfung nutzt, steht in seinen Bedingungen. Der Anbieter kann das Gespräch für Betrieb und Sicherheit aufbewahren.',
		chatAn: 'Dein Gespräch kann in ein späteres Training fließen, wenn der Anbieter das so vorsieht.',
		privat: 'Der Text ist nicht öffentlich abrufbar und liegt auf keinem Weg, den ein Sammelprogramm erreicht. Die Ausnahme für Text und Data Mining beginnt hier gar nicht erst.',
		vorbehalt: 'Der maschinenlesbare Vorbehalt wirkt. Sammeln für das Training ist für künftige Nutzungen nicht gedeckt.',
		offen: 'Der Text ist öffentlich abrufbar und ohne maschinenlesbaren Vorbehalt. Die Ausnahme für Text und Data Mining kann greifen. Ein Satz nur für Menschen zählt dabei nicht.',
		modellNachVorbehalt: 'Für Kopien, die nach dem Vorbehalt entstehen, fehlt die Grundlage. Ob ältere Kopien erfasst sind, ist offen. Ob die Stellungen im Modell als Kopie gelten, ist offen.',
		modellOhneGrundlage: 'Ohne Grundlage für die Kopie fehlt schon der erste Schritt. Ob die Stellungen im Modell als Kopie gelten, ist offen.',
		modellWiederholt: 'Wiederholt im Netz: Der Text prägt sich eher ein, und die Chance auf wörtliche Wiedergabe steigt. Offen bleibt, ob die Stellungen als Kopie gelten.',
		modellEinmal: 'Nur einmal im Netz: Der Text prägt sich seltener wörtlich ein, aber nicht ausgeschlossen. Offen bleibt, ob die Stellungen als Kopie gelten.',
		ausgabeWiederholt: 'Eine wörtliche Passage in einer Antwort ist möglich. Ob sie auftaucht, lässt sich nicht vorhersagen.',
		ausgabeSelten: 'Eine wörtliche Passage ist unwahrscheinlicher, aber nicht ausgeschlossen.',
		ausgabeGerichte: 'Ob eine wörtliche Passage in der Antwort rechtlich eine Vervielfältigung ist, klären die Gerichte gerade. Ob der Text trotzdem im Training war, lässt sich von außen oft nicht sagen.',
		chatOhneZeile: 'Für einen eigenen Chat gilt diese Zeile nicht; sie betrifft Texte aus dem Netz.',
		datenschutzJa: 'Namen oder Kontaktdaten sind personenbezogene Daten. Nach Art. 21 Abs. 1 DSGVO kannst du aus Gründen deiner besonderen Situation widersprechen. Ob bereits Verarbeitetes betroffen ist, ist nicht allgemein geklärt.',
		datenschutzNein: 'Ohne Namen oder Kontaktdaten steht vor allem das Urheberrecht im Vordergrund.',
	},
	en: {
		chatAus: 'Once the setting is off, your conversation does not flow into later training, as far as the provider implements this. Whether the provider still uses feedback or conversations for safety review is set out in its terms. The provider may keep the conversation for operation and safety.',
		chatAn: 'Your conversation may flow into later training if the provider provides for this.',
		privat: 'The text is not publicly accessible and sits on no route a collection program can reach. The exception for text and data mining does not even start here.',
		vorbehalt: 'The machine-readable reservation takes effect. Collecting for training is not covered for future uses.',
		offen: 'The text is publicly accessible and has no machine-readable reservation. The exception for text and data mining may apply. A notice meant only for humans does not count here.',
		modellNachVorbehalt: 'Copies made after the reservation lack a basis. Whether older copies are covered is open. Whether the fader positions in the model count as a copy is open.',
		modellOhneGrundlage: 'Without a basis for the copy, the first step is already missing. Whether the fader positions in the model count as a copy is open.',
		modellWiederholt: 'Repeated online: the text is more likely to be memorized, and the chance of word-for-word reproduction rises. Open: whether the fader positions count as a copy.',
		modellEinmal: 'Seen only once online: the text is less likely to be memorized word for word, but that is not ruled out. Open: whether the fader positions count as a copy.',
		ausgabeWiederholt: 'A verbatim passage in an answer is possible. Whether one appears cannot be predicted.',
		ausgabeSelten: 'A verbatim passage is less likely, but not ruled out.',
		ausgabeGerichte: 'Whether a verbatim passage in an answer counts as a legal reproduction is being decided by the courts right now. Whether the text was in the training anyway often cannot be told from outside.',
		chatOhneZeile: 'This line does not apply to your own chat; it concerns texts from the web.',
		datenschutzJa: 'Names or contact details are personal data. Under Art. 21(1) GDPR you can object on grounds of your particular situation. Whether data already processed is affected is not generally settled.',
		datenschutzNein: 'Without names or contact details, copyright is the main question.',
	},
};

/**
 * Three stages for one text. `input` is the reader's choice:
 * { kind, oeffentlich, vorbehalt, personenbezogen, wiederholt, trainingAus }.
 * `lang` is 'de' (default) or 'en'. Returns { sammeln, modell, ausgabe, datenschutz },
 * each a short line in that language.
 */
export function assess(input, lang = 'de') {
	const t = LINES[lang === 'en' ? 'en' : 'de'];
	const { kind, oeffentlich, vorbehalt, personenbezogen, wiederholt, trainingAus } = input;
	const isChat = Boolean(TEXT_KINDS[kind]?.chat);

	let sammeln;
	let kopieErlaubt;
	if (isChat) {
		kopieErlaubt = !trainingAus;
		sammeln = trainingAus ? t.chatAus : t.chatAn;
	} else if (!oeffentlich) {
		kopieErlaubt = false;
		sammeln = t.privat;
	} else if (vorbehalt) {
		kopieErlaubt = false;
		sammeln = t.vorbehalt;
	} else {
		kopieErlaubt = true;
		sammeln = t.offen;
	}

	let modell;
	if (!kopieErlaubt && vorbehalt && !isChat) {
		modell = t.modellNachVorbehalt;
	} else if (!kopieErlaubt) {
		modell = t.modellOhneGrundlage;
	} else if (wiederholt) {
		modell = t.modellWiederholt;
	} else {
		modell = t.modellEinmal;
	}

	let ausgabe;
	if (wiederholt && kopieErlaubt) {
		ausgabe = t.ausgabeWiederholt;
	} else if (kopieErlaubt) {
		ausgabe = t.ausgabeSelten;
	} else {
		ausgabe = t.ausgabeGerichte;
	}

	// For the reader's own chat, the model and output lines do not apply.
	if (isChat) {
		modell = t.chatOhneZeile;
		ausgabe = t.chatOhneZeile;
	}

	const datenschutz = personenbezogen ? t.datenschutzJa : t.datenschutzNein;

	return { sammeln, modell, ausgabe, datenschutz };
}
