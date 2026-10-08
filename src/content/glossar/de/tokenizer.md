---
title: 'Tokenizer'
description: 'Das feste Verfahren, das Text in Tokens und Token-IDs umwandelt und IDs wieder zu Text zusammensetzt.'
translationKey: tokenizer
---

Ein Tokenizer zerlegt Text nach festgelegten Regeln in [Tokens](/de/glossar/token) und ordnet ihnen über sein [Vokabular](/de/glossar/vokabular) Zahlen zu. Beim Dekodieren setzt er eine Folge solcher Zahlen wieder zu Text zusammen.

Tokenizer und trainiertes Modell bilden ein festes Paar, weil das Modell auf genau die [Token-IDs](/de/glossar/token-id) dieses Tokenizers trainiert wurde.

**Ein Beispiel:** Schreibst du einem Chatbot eine Frage, zerlegt ein Tokenizer sie zuerst in Tokens und übersetzt sie in eine Folge von Zahlen. Erst diese Folge geht ins Modell. Die Antwort entsteht ebenfalls als Folge von IDs, die der Tokenizer Stück für Stück wieder in lesbaren Text verwandelt. Beide Richtungen laufen bei jeder Nachricht.

**Nicht verwechseln mit dem Modell:** Der Tokenizer versteht nichts und sagt nichts vorher. Er wandelt nur Text in IDs um und IDs zurück in Text, nach festen Regeln: Derselbe Text ergibt mit demselben Tokenizer dieselbe Zerlegung. Welches Token als Nächstes kommt, entscheidet allein das [Sprachmodell](/de/glossar/sprachmodell). Wo der Tokenizer ein Wort trennt, folgt auch keiner Silbenlehre, sondern dem gelernten Vokabular, meist aus [Subword-Tokens](/de/glossar/subword-token).

**Wo du dem Begriff begegnest:** Bei frei verfügbaren Modellen zum Herunterladen gehören Tokenizer-Dateien mit Vokabular und Regeln ausdrücklich dazu, weil sie fest zum Modell passen müssen. Ein neues Modell bringt oft einen eigenen Tokenizer mit, und derselbe Satz ergibt dort andere IDs. Außerdem stellen viele Anbieter Werkzeuge bereit, mit denen du die Tokens eines Textes zählen kannst.

Ausführlicher erklärt in [Tokenizer: Wie Text in Tokens zerfällt](/de/bausteine/tokenizer-ids-vokabular); Kodieren und Dekodieren zeigt [Token-IDs: Wie aus Tokens Zahlen werden](/de/bausteine/token-ids-und-vokabular).
