---
title: 'Tokenizer'
description: 'Das feste Verfahren, das Text in Tokens und Token-IDs umwandelt und IDs wieder zu Text zusammensetzt.'
translationKey: tokenizer
---

Ein Tokenizer zerlegt Text nach festen Regeln in [Tokens](/de/glossar/token), also in Textstücke. Mithilfe seines [Vokabulars](/de/glossar/vokabular) ordnet er jedem Stück eine Zahl zu: die dazugehörige [Token-ID](/de/glossar/token-id). Das Vokabular ist eine feste Liste aller Einträge, meist Textstücke. Bei vielen Tokenizern besteht das Vokabular aus [Subword-Tokens](/de/glossar/subword-token), also aus Wortstücken. Das können häufige ganze Wörter, Wortteile oder einzelne Zeichen sein. Die Einteilung richtet sich nicht nach Silben, sondern danach, welche Buchstabenfolgen in den Texten oft vorkamen, aus denen der Tokenizer gebaut wurde. Beim Dekodieren setzt er Zahlenfolgen wieder zu Text zusammen.

Ein Modell braucht genau den Tokenizer, mit dem es trainiert wurde, denn es hat seine Zahlen für genau diese Token-IDs gelernt. Mehrere Modelle einer Familie können sich denselben Tokenizer teilen.

**Ein Beispiel:** Schreibst du einem Chatbot eine Frage, zerlegt der Tokenizer sie in Tokens und übersetzt sie in eine Folge von Zahlen. Die Chat-App ergänzt sie um Anweisungen und Verlauf; die ganze Folge geht ins Modell. Auch die Antwort entsteht als IDs, die er wieder in Text verwandelt.

**Nicht verwechseln mit dem Modell:** Der Tokenizer wandelt Text nach festen Regeln in IDs und die IDs wieder in Text um. Deshalb wird derselbe Text immer gleich zerlegt. Das [Sprachmodell](/de/glossar/sprachmodell) berechnet dagegen für jedes Stück seines Vokabulars eine Bewertung, den [Score](/de/glossar/score). Ein weiterer Schritt wählt daraus das nächste Stück, oft mit etwas Zufall.

**Wo du dem Begriff begegnest:** Ein Tokenizer bestimmt, wie viele Tokens ein Text ergibt. Nutzt du ein Modell über einen Entwicklerzugang (API, eine Schnittstelle für Programme), zahlst du oft pro Token. Auch wie schnell ein langer Chat das [Kontextfenster](/de/glossar/kontextfenster) füllt, hängt davon ab.

Mehr dazu: [Tokenizer: Wie Text in Tokens zerfällt](/de/bausteine/tokenizer-ids-vokabular). Kodieren und Dekodieren zeigt [Token-IDs: Was eine Nummer bedeutet](/de/bausteine/token-ids-und-vokabular).
