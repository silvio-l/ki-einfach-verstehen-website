---
title: 'Token-ID'
description: 'Die feste Kennnummer eines Tokens im Vokabular eines bestimmten Tokenizers, mit der das Modell statt mit Text arbeitet.'
translationKey: token-id
---

Eine Token-ID ist die ganze Zahl, unter der ein [Token](/de/glossar/token) im [Vokabular](/de/glossar/vokabular) eines bestimmten Tokenizers geführt wird. Sie dient als Nachschlageadresse für das Modell.

Die Zahl besitzt für sich allein keine Bedeutung und ist nicht zwischen Tokenizern übertragbar. Dieselbe ID kann in zwei Vokabularen auf unterschiedliche Textstücke zeigen.

**Ein Beispiel:** In einem erfundenen Mini-Vokabular trägt „Die“ die ID 417, „ Kat“ die 82, „ze“ die 903, „ sitzt“ die 771 und der Punkt die 13. Aus „Die Katze sitzt.“ wird so die Folge 417, 82, 903, 771, 13. Genau diese Zahlen bekommt das [Modell](/de/glossar/modell) als Eingabe. Auf dem Rückweg schlägt der [Tokenizer](/de/glossar/tokenizer) jede Zahl nach und setzt die Textstücke in derselben Reihenfolge wieder zusammen.

**Nicht verwechseln mit einem Bedeutungswert:** Die 417 misst weder Bedeutung noch Häufigkeit oder Wichtigkeit. Sie ist nur die Nummer auf einer Karteikarte. Mit IDs zu rechnen ergibt deshalb keinen Sinn: 417 plus 82 ergibt nicht die Bedeutung von 499. Was ein Modell mit einer ID verbindet, steckt in seinen trainierten [Parametern](/de/glossar/parameter). Dort dient die Nummer als Adresse für eine Liste gelernter Zahlen.

**Wo du dem Begriff begegnest:** Im Chatfenster siehst du Token-IDs normalerweise nicht. Sie tauchen in Werkzeugen auf, die sichtbar machen, wie ein Text zerlegt wird, und beim Programmieren mit Zerlegewerkzeugen wie OpenAIs tiktoken. Auch Spezial-Tokens, die etwa das Ende eines Textes markieren, haben eine eigene ID.

Ausführlicher erklärt in [Token-IDs: Wie aus Tokens Zahlen werden](/de/bausteine/token-ids-und-vokabular).
