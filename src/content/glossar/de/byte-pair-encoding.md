---
title: 'Byte Pair Encoding (BPE)'
description: 'Ein Verfahren, das häufige benachbarte Zeichen oder bereits gebildete Textstücke schrittweise zu größeren Einheiten zusammenführt.'
translationKey: byte-pair-encoding
---

Byte Pair Encoding, kurz BPE, lernt wiederverwendbare Einheiten, indem es häufige benachbarte Zeichen oder bereits gebildete Textstücke wiederholt zusammenführt. Jede gerade betrachtete Einheit — anfangs etwa ein Buchstabe, später auch ein Textstück — heißt dabei **Symbol**. Tauchen etwa „e" und „s" oft nebeneinander auf, kann daraus zuerst „es" werden; kommt danach häufig „t", kann später „est" entstehen. Jede gelernte Kombination wird als neuer, eigener Eintrag in das Vokabular aufgenommen und fortan wie ein einzelner Textbaustein behandelt. So werden auch mehrbuchstabige Folgen wie „est" zu [Tokens](/de/glossar/token) im [Vokabular](/de/glossar/vokabular), der festen Liste aller erlaubten Textstücke.

Seltene Folgen bleiben aus kleineren Einheiten darstellbar. Das konkrete Ergebnis hängt vom Trainingsmaterial, der Vorverarbeitung und den gewählten Lernregeln ab.

Ausführlicher erklärt in [Tokenizer: Wie Sprache zu Zahlen wird](/de/bausteine/tokenizer-ids-vokabular).
