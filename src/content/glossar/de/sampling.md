---
title: 'Sampling'
description: 'Auswahl des nächsten Textstücks per gewichtetem Zufall: Jedes Stück kommt ungefähr so oft dran, wie seine Wahrscheinlichkeit angibt.'
translationKey: sampling
---

Beim Sampling wählt ein Sprachmodell das nächste Textstück zufällig aus, aber gewichtet nach den [Wahrscheinlichkeiten](/de/glossar/wahrscheinlichkeit): Ein Stück mit 72 Prozent kommt bei vielen Versuchen ungefähr 72-mal von 100 dran, eins mit 1 Prozent ungefähr einmal. Man kann es sich wie ein Glücksrad vorstellen, dessen Felder so groß sind wie die Wahrscheinlichkeiten.

Die Alternative ist, immer das wahrscheinlichste Stück zu nehmen (Greedy-Auswahl). Das führt bei längeren Texten oft zu fadem Text und Wiederholungen. Sampling bringt Abwechslung hinein und erklärt, warum ein Chatbot auf dieselbe Frage verschieden antworten kann. Wie stark der Zufall wirkt, regelt die [Temperatur](/de/glossar/temperatur).

Eingeführt in [Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](/de/bausteine/wahrscheinlichkeit-und-softmax).
