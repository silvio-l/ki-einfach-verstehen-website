---
title: 'SentencePiece'
description: 'Ein sprachunabhängiges System, das Subword-Tokenizer direkt aus noch nicht zerlegtem oder anderweitig aufbereitetem Text lernt.'
translationKey: sentencepiece
---

SentencePiece ist ein System, das Vokabulare aus **[Subword-Tokens](/de/glossar/subword-token)** — wiederverwendbaren Wortteilen — direkt aus **Rohtext** lernen kann. Damit ist der ursprüngliche Text gemeint, bevor ein anderes Programm ihn bereinigt, markiert oder in Wörter zerlegt hat. SentencePiece untersucht ihn als fortlaufende Zeichenfolge und muss nicht vorher raten, wo jedes Wort beginnt und endet. Das ist wichtig, weil Leerzeichen im Deutschen oder Englischen meist Wörter trennen, Sprachen wie Japanisch oder Thai ihre Wortgrenzen aber nicht auf dieselbe Weise schreiben. SentencePiece unterstützt unterschiedliche Subword-Verfahren, darunter **[Byte Pair Encoding (BPE)](/de/glossar/byte-pair-encoding)**, das häufige Zeichenpaare schrittweise zu größeren Einheiten zusammenfasst.

Damit ist SentencePiece kein einzelnes festes Vokabular, sondern ein Werkzeug und Verfahren, mit dem unterschiedliche [Tokenizer](/de/glossar/tokenizer) erzeugt werden können.

Eingeordnet in [Tokenizer: Wie Sprache zu Zahlen wird](/de/bausteine/tokenizer-ids-vokabular).
