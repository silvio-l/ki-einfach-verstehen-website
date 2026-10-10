---
title: 'Softmax'
description: 'Die Rechnung, mit der ein Modell aus einer Liste von Scores Wahrscheinlichkeiten macht, die zusammen 100 Prozent ergeben.'
translationKey: softmax
---

Softmax macht aus einer Liste von [Scores](/de/glossar/score) eine [Wahrscheinlichkeitsverteilung](/de/glossar/wahrscheinlichkeit). Dazu wird jeder Score zu einer positiven Zahl; jeder Punkt Vorsprung macht sie etwa 2,7-mal so groß. Dann teilt man jede Zahl durch die Summe aller. Aus den Scores 3,0, 2,0 und −1,0 werden so rund 72, 27 und 1 Prozent. Man stelle sich ein Glücksrad vor, dessen Felder so groß sind wie diese Prozente.

Die Reihenfolge bleibt, und nur die Abstände zählen: Addiert man zu allen Scores denselben Betrag, ändert sich nichts. Kein Kandidat fällt ganz auf null. Sprachmodelle wenden Softmax für jedes nächste Textstück auf alle Scores des Vokabulars an, Bilderkennungen auf ihre Klassenscores.

**Ein Beispiel:** Eine Bilderkennung rechnet einen Score pro Klasse aus, etwa „Katze 6,2“ neben „Hund 2,9“, „Fuchs 1,4“ und „Auto −3,0“. Angezeigt wird ein Anteil wie „Katze 96 %“ (ausgedachte Zahlen). Dazwischen steht meist Softmax.

**Nicht verwechseln mit einfacher Prozentrechnung:** Bei Punkten auf einer Quiz-Tafel teilst du jeden Wert durch die Summe. Bei Scores klappt das nicht: Aus 3,0, 2,0 und −1,0 würden 75, 50 und −25 Prozent, und ein negativer Anteil ist unbrauchbar. Der Name kommt von der Regel „nimm den Größten“: Softmax ist deren weiche Version, wobei die übrigen Kandidaten etwas behalten. Die Grenze des Bildes: Ein echtes Rad hat ein Feld pro Vokabulareintrag, die meisten haarfein.

**Wo du dem Begriff begegnest:** In Fachtexten über KI-Modelle, oft mit **Logits** für die Scores davor. In Apps siehst du nur das Ergebnis: Prozente auf dem Bildschirm heißen, dass die Scores bereits umgerechnet sind. Auch die [Temperatur](/de/glossar/temperatur) setzt hier an: Sie teilt die Scores vor Softmax.

Eingeführt in [Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](/de/bausteine/wahrscheinlichkeit-und-softmax).
