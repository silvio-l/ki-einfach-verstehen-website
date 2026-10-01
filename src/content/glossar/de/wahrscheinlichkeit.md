---
title: 'Wahrscheinlichkeit'
description: 'Eine Zahl zwischen 0 und 100 Prozent, die angibt, wie oft etwas eintritt, wenn sich dieselbe Lage sehr oft wiederholt.'
translationKey: wahrscheinlichkeit
---

Eine Wahrscheinlichkeit gibt an, wie oft etwas eintritt, wenn sich dieselbe Lage sehr oft wiederholt. Eine Regenwahrscheinlichkeit von 80 Prozent heißt: An 8 von 10 Tagen mit einer solchen Wetterlage fiel Niederschlag. Jede Wahrscheinlichkeit liegt zwischen 0 und 100 Prozent.

Eine **Wahrscheinlichkeitsverteilung**, kurz Verteilung, ist eine Liste mit einer Wahrscheinlichkeit für jede Möglichkeit; alle zusammen ergeben genau 100 Prozent. Ein Sprachmodell berechnet für jede nächste Stelle eine solche Verteilung über alle möglichen Textstücke, indem es seine [Scores](/de/glossar/score) mit [Softmax](/de/glossar/softmax) umrechnet. Die Prozente beschreiben, welche Fortsetzung naheliegt, nicht, ob eine Antwort stimmt.

**Ein Beispiel:** Nach „Die Katze“ hat ein Modell drei Kandidaten mit ausgedachten Scores. Softmax macht daraus „sitzt“ 72 Prozent, „schläft“ 27 Prozent und „fliegt“ 1 Prozent, zusammen genau 100. Wählt das Modell per [Sampling](/de/glossar/sampling), kommt „sitzt“ bei vielen Versuchen ungefähr 72-mal von 100 dran.

**Nicht verwechseln mit Sicherheit:** 72 Prozent heißen nicht, dass das Modell sich zu 72 Prozent sicher ist, dass „sitzt“ stimmt. Der Wert spiegelt ungefähr, was beim Training in ähnlichen Texten als Nächstes folgte. Ob die Prozente eines Modells zu seiner Trefferquote passen, muss eigens geprüft werden, und oft passt es nicht. Auch ein Score ist noch keine Wahrscheinlichkeit: Er kann negativ sein und hat keine feste Summe.

**Wo du dem Begriff begegnest:** In der Regenwahrscheinlichkeit deiner Wetter-App, bei Bilderkennungen, die etwa „Katze 93 %“ melden, und in den Wortvorschlägen deiner Handy-Tastatur. Für seine Tastatur Gboard beschreibt Google es so: In der Mitte der Vorschlagsleiste steht das Wort, das ein Sprachmodell für am wahrscheinlichsten hält.

Eingeführt in [Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](/de/bausteine/wahrscheinlichkeit-und-softmax).
