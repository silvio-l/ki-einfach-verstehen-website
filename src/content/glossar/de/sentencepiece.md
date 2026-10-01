---
title: 'SentencePiece'
description: 'Ein sprachunabhängiges System, das Subword-Tokenizer direkt aus Rohtext lernt und anwendet, ohne ihn vorher in Wörter zu zerlegen.'
translationKey: sentencepiece
---

SentencePiece ist ein System, das Vokabulare aus **[Subword-Tokens](/de/glossar/subword-token)**, also wiederverwendbaren Wortteilen, direkt aus **Rohtext** lernen kann. Damit ist der ursprüngliche Text gemeint, bevor ein anderes Programm ihn bereinigt, markiert oder in Wörter zerlegt hat. SentencePiece untersucht ihn als fortlaufende Zeichenfolge und muss nicht vorher raten, wo jedes Wort beginnt und endet. Das ist wichtig, weil Leerzeichen im Deutschen oder Englischen meist Wörter trennen, Sprachen wie Japanisch oder Thai ihre Wortgrenzen aber nicht auf dieselbe Weise schreiben. SentencePiece unterstützt unterschiedliche Subword-Verfahren, darunter **[Byte Pair Encoding (BPE)](/de/glossar/byte-pair-encoding)**, das häufige Zeichenpaare schrittweise zu größeren Einheiten zusammenfasst.

Damit ist SentencePiece kein einzelnes festes Vokabular, sondern ein Werkzeug und Verfahren, mit dem unterschiedliche [Tokenizer](/de/glossar/tokenizer) erzeugt werden können.

**Ein Beispiel:** Soll ein Tokenizer deutsche und japanische Texte gleichermaßen verarbeiten, bräuchte ein wortbasierter Ansatz für jede Sprache eigene Regeln, wo ein Wort endet. SentencePiece überspringt diesen Schritt: Es lernt aus den unveränderten Sätzen beider Sprachen, welche Zeichenfolgen häufig sind, und bildet daraus ein gemeinsames Vokabular.

**Nicht verwechseln mit BPE:** BPE beschreibt, wie Einheiten gelernt werden, nämlich durch wiederholtes Zusammenführen häufiger Paare. SentencePiece ist das Werkzeug drumherum, das ein solches Verfahren direkt auf Rohtext anwendet. Ein Tokenizer kann also „mit SentencePiece trainiertes BPE“ verwenden, ohne dass die beiden Begriffe dasselbe meinen.

**Wo du dem Begriff begegnest:** In technischen Dokumentationen und Modellbeschreibungen, wenn erklärt wird, wie der Tokenizer eines Modells erzeugt wurde, und in den Tokenizer-Dateien, die mit manchen frei verfügbaren Modellen ausgeliefert werden.

Eingeordnet in [Tokenizer: Wie Sprache zu Zahlen wird](/de/bausteine/tokenizer-ids-vokabular).
