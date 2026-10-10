---
title: 'Sprachmodell'
description: 'Ein auf großen Textmengen trainiertes Modell, das für jedes Textstück bewertet, wie gut es als Nächstes passt; so entsteht Text Stück für Stück.'
translationKey: sprachmodell
---

Ein Sprachmodell ist ein [Modell](/de/glossar/modell), dessen Training speziell auf menschliche Sprache ausgerichtet ist: Es lernt anhand riesiger Mengen an Text, wie wahrscheinlich verschiedene Textstücke (ganze Wörter, Wortteile, Satzzeichen) in einem gegebenen Zusammenhang sind, und nutzt das, um Text Stück für Stück fortzusetzen, etwa als Antwort auf eine Frage.

Sein Input ist Text, sein unmittelbarer Output aber nicht: Er ist eine Score-Liste über alle Textstücke, die es kennt. Text entsteht daraus erst durch einen Auswahlschritt und eine Schleife.

**Ein Beispiel:** Du gibst einem Chatbot den Text „Die Katze sitzt“. Das Sprachmodell dahinter liefert nicht sofort eine fertige Antwort. Es gibt für jedes Textstück ([Token](/de/glossar/token)), das es kennt, einen Score aus, wie gut dieses Stück als Nächstes passt. Ein Auswahlschritt nimmt etwa „auf“, hängt es an, und der längere Text geht wieder hinein. So entsteht die Antwort Stück für Stück.

**Nicht verwechseln mit einem Chatbot:** Der Chatbot ist die Anwendung, in die du schreibst. Das Sprachmodell ist das Modell darin, das die Scores berechnet. Der bisherige Gesprächsverlauf wird jedes Mal wieder als Input mitgeschickt. Durch dein Gespräch ändert sich das Sprachmodell selbst nicht, seine [Parameter](/de/glossar/parameter) bleiben stehen, bis jemand neu trainiert.

**Wo du dem Begriff begegnest:** In Berichten über KI-Chatbots, oft als „großes Sprachmodell“ oder englisch Large Language Model, kurz LLM. Auf manchen Handys läuft ein Sprachmodell direkt auf dem Gerät. Wer ein Sprachmodell über eine Programmierschnittstelle (API) nutzt, zahlt pro Token. Dann bezahlst du Zusatztext, [Spezial-Tokens](/de/glossar/spezial-token) und Verlauf in jeder Runde mit.

Eingeführt in [„Input und Output: Was eine Funktion tut“](/de/bausteine/input-und-output).
