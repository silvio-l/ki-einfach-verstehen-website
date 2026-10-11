---
title: 'Sprachmodell'
description: 'Ein auf großen Textmengen trainiertes Modell, das bewertet, wie gut jedes bekannte Textstück als Nächstes passt. So entsteht Stück für Stück Text.'
translationKey: sprachmodell
---

Ein Sprachmodell ist ein [Modell](/de/glossar/modell), das auf riesigen Textmengen menschlicher Sprache trainiert wurde. Dabei lernt es, mit welcher Wahrscheinlichkeit einzelne Textstücke (ganze Wörter, Wortteile oder Satzzeichen) an einer bestimmten Stelle folgen. So kann es einen Text Stück für Stück fortsetzen, etwa als Antwort auf eine Frage.

Das Sprachmodell erhält den Text als Zahlenfolge. Sein unmittelbares Ergebnis (Output) ist keine fertige Antwort, sondern eine Liste: Sie enthält für jedes Textstück, das es kennt, eine Bewertung (Score). Erst ein Auswahlschritt setzt daraus Stück für Stück Text zusammen.

**Ein Beispiel:** Du gibst einem Chatbot den Text „Die Katze sitzt“. Das Sprachmodell dahinter weist jedem Textstück ([Token](/de/glossar/token)), das es kennt, einen Score zu. Dieser zeigt, wie gut das Textstück als Nächstes passt. Im Auswahlschritt wird zum Beispiel „auf“ gewählt und an den bisherigen Text angehängt. Danach erhält das Modell den verlängerten Text und vergibt wieder Scores. So entsteht die Antwort.

**Nicht verwechseln mit einem Chatbot:** Der Chatbot ist die Anwendung, in die du schreibst. Das Sprachmodell darin berechnet die Scores. Bei jeder neuen Nachricht wird der bisherige Gesprächsverlauf erneut mitgeschickt. Dein Gespräch verändert das Sprachmodell nicht: Seine [Parameter](/de/glossar/parameter) (die gespeicherten Zahlen des Modells) bleiben gleich, bis das Modell erneut trainiert wird.

**Wo du dem Begriff begegnest:** In Berichten über KI-Chatbots ist oft von einem „großen Sprachmodell“ die Rede, auf Englisch Large Language Model, kurz LLM.

Eingeführt wird der Begriff in [„Input und Output: Was ein Modell aus einer Eingabe macht“](/de/bausteine/input-und-output).
