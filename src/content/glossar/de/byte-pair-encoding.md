---
title: 'Byte Pair Encoding (BPE)'
description: 'Ein Verfahren, das häufige benachbarte Zeichen oder bereits gebildete Textstücke schrittweise zu größeren Einheiten zusammenführt.'
translationKey: byte-pair-encoding
---

Byte Pair Encoding, kurz BPE, lernt wiederverwendbare Einheiten, indem es häufige benachbarte Zeichen oder bereits gebildete Textstücke wiederholt zusammenführt. Jede gerade betrachtete Einheit (anfangs etwa ein Buchstabe, später auch ein Textstück) heißt dabei **Symbol**. Tauchen etwa „e“ und „s“ oft nebeneinander auf, kann daraus zuerst „es“ werden; kommt danach häufig „t“, kann später „est“ entstehen. Jede gelernte Kombination wird als neuer, eigener Eintrag in das Vokabular aufgenommen und fortan wie ein einzelner Textbaustein behandelt. So werden auch mehrbuchstabige Folgen wie „est“ zu [Tokens](/de/glossar/token) im [Vokabular](/de/glossar/vokabular), der festen Liste aller erlaubten Textstücke.

Seltene Folgen bleiben aus kleineren Einheiten darstellbar. Das konkrete Ergebnis hängt vom Trainingsmaterial, der Vorverarbeitung und den gewählten Lernregeln ab.

**Ein Beispiel:** Stehen im Trainingsmaterial häufig „lernen“, „lernt“ und „gelernt“, werden zuerst häufige Buchstabenpaare zusammengeführt und später größere Folgen wie „lern“. Beim Zerlegen eines neuen Textes spielt der Tokenizer die gelernten Zusammenführungen in derselben Reihenfolge ab. Derselbe Text ergibt deshalb immer dieselbe Zerlegung.

**Nicht verwechseln mit SentencePiece:** BPE ist eine Methode, nach der Einheiten gelernt werden. [SentencePiece](/de/glossar/sentencepiece) ist ein Werkzeug, das unter anderem diese Methode direkt auf unzerlegten Text anwendet. Beide sind kein fertiger [Tokenizer](/de/glossar/tokenizer), sondern Wege, einen zu erzeugen.

**Wo du dem Begriff begegnest:** In technischen Beschreibungen von Sprachmodellen und ihren Tokenizern, oft als „Byte-Level-BPE“. So arbeitet etwa der Tokenizer von GPT-2, einem frühen Sprachmodell von OpenAI. Byte-Level bedeutet: Die kleinsten Einheiten sind Bytes statt Buchstaben. Weil es nur 256 verschiedene Bytes gibt, passen alle ins Grundvokabular. Und da jedes Zeichen aus einem oder mehreren Bytes besteht, lässt sich damit jede Zeichenfolge darstellen.

Ausführlicher erklärt in [Tokenizer: Wie Text in Tokens zerfällt](/de/bausteine/tokenizer-ids-vokabular).
