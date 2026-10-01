---
title: 'Softmax'
description: 'Die Rechnung, mit der ein Modell aus einer Liste von Scores Wahrscheinlichkeiten macht, die zusammen 100 Prozent ergeben.'
translationKey: softmax
---

Softmax macht aus einer Liste von [Scores](/de/glossar/score) eine [Wahrscheinlichkeitsverteilung](/de/glossar/wahrscheinlichkeit). Dazu wird jeder Score in eine positive Zahl verwandelt, wobei jeder Punkt Vorsprung diese Zahl etwa 2,7-mal so groß macht. Danach wird jede dieser Zahlen durch ihre Summe geteilt. Aus den Scores 3,0, 2,0 und −1,0 werden so rund 72, 27 und 1 Prozent.

Die Reihenfolge der Scores bleibt dabei erhalten, und es zählen nur ihre Abstände: Bekommen alle Scores denselben Betrag dazu, ändert sich nichts. Kein Kandidat fällt ganz auf null. Sprachmodelle wenden Softmax für jedes nächste Textstück auf alle Scores des Vokabulars an, Bilderkennungen auf die Scores ihrer Klassen.

**Ein Beispiel:** Eine Bilderkennung rechnet für jede Klasse zuerst einen Score aus, etwa „Katze 6,2“. Angezeigt bekommst du aber einen Anteil wie „Katze 93 %“ (beide Zahlen ausgedacht). Dazwischen steht meist Softmax.

**Nicht verwechseln mit einfacher Prozentrechnung:** Bei Punkten auf einer Quiz-Tafel teilst du jeden Wert durch die Summe. Bei Scores klappt das nicht: Aus 3,0, 2,0 und −1,0 würden 75, 50 und −25 Prozent, und ein negativer Anteil ist unbrauchbar. Der Name stammt vom Vergleich mit der Regel „nimm den Größten“: Softmax ist eine weiche Version davon, bei der die übrigen Kandidaten etwas behalten.

**Wo du dem Begriff begegnest:** In Fachtexten über KI-Modelle, oft zusammen mit dem Wort **Logits** für die Scores davor. In Apps siehst du nur das Ergebnis: Wo dir eine KI Prozente zeigt, hat sie die Scores bereits umgerechnet. Auch die [Temperatur](/de/glossar/temperatur) setzt hier an, denn durch sie werden die Scores vor Softmax geteilt.

Eingeführt in [Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](/de/bausteine/wahrscheinlichkeit-und-softmax).
