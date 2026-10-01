---
title: 'Sampling'
description: 'Auswahl des nächsten Textstücks per gewichtetem Zufall: Jedes Stück kommt ungefähr so oft dran, wie seine Wahrscheinlichkeit angibt.'
translationKey: sampling
---

Beim Sampling wählt ein Sprachmodell das nächste Textstück zufällig aus, aber gewichtet nach den [Wahrscheinlichkeiten](/de/glossar/wahrscheinlichkeit): Ein Stück mit 72 Prozent kommt bei vielen Versuchen ungefähr 72-mal von 100 dran, eins mit 1 Prozent ungefähr einmal. Man kann es sich wie ein Glücksrad vorstellen, dessen Felder so groß sind wie die Wahrscheinlichkeiten.

Die Alternative ist, immer das wahrscheinlichste Stück zu nehmen (Greedy-Auswahl). Das führt bei längeren Texten oft zu fadem Text und Wiederholungen. Sampling bringt Abwechslung hinein und erklärt, warum ein Chatbot auf dieselbe Frage verschieden antworten kann. Wie stark der Zufall wirkt, regelt die [Temperatur](/de/glossar/temperatur).

**Ein Beispiel:** Nach „Die Katze“ stehen „sitzt“ mit 72, „schläft“ mit 27 und „fliegt“ mit 1 Prozent zur Wahl. Bei 100 Drehungen des Rads landet der Zeiger ungefähr 72-mal auf „sitzt“, 27-mal auf „schläft“ und einmal auf „fliegt“. Für jedes weitere Textstück wird ein neues Rad gedreht. Bleibt der Zeiger früh woanders stehen, bauen alle folgenden Runden darauf auf.

**Nicht verwechseln mit einem Würfelwurf:** Zufall heißt hier nicht, dass jedes Stück gleich oft drankommt. Die Felder des Rads sind verschieden groß, deshalb bleiben Antworten mit Sampling meist sinnvoll. Das englische Wort bedeutet Stichprobe; mit dem Sampling in der Musik hat es nichts zu tun.

**Wo du dem Begriff begegnest:** Beim Knopf zum Neu-Erzeugen einer Antwort in Chat-Apps, auch wenn er dort nicht so heißt: Alle Räder werden dann noch einmal gedreht. In Einstellungen und Fachtexten tauchen dazu die Temperatur und Verfahren wie Top-k oder Top-p auf, die ganz unpassende Stücke vor dem Drehen aussortieren.

Eingeführt in [Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](/de/bausteine/wahrscheinlichkeit-und-softmax).
