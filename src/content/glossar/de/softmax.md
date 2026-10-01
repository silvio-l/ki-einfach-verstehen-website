---
title: 'Softmax'
description: 'Die Rechnung, mit der ein Modell aus einer Liste von Scores Wahrscheinlichkeiten macht, die zusammen 100 Prozent ergeben.'
translationKey: softmax
---

Softmax macht aus einer Liste von [Scores](/de/glossar/score) eine [Wahrscheinlichkeitsverteilung](/de/glossar/wahrscheinlichkeit). Dazu wird jeder Score in eine positive Zahl verwandelt, wobei jeder Punkt Vorsprung diese Zahl etwa 2,7-mal so groß macht. Danach wird jede dieser Zahlen durch ihre Summe geteilt. Aus den Scores 3,0, 2,0 und −1,0 werden so rund 72, 27 und 1 Prozent.

Die Reihenfolge der Scores bleibt dabei erhalten, und es zählen nur ihre Abstände: Bekommen alle Scores denselben Betrag dazu, ändert sich nichts. Kein Kandidat fällt ganz auf null. Sprachmodelle wenden Softmax für jedes nächste Textstück auf alle Scores des Vokabulars an, Bilderkennungen auf die Scores ihrer Klassen.

Eingeführt in [Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](/de/bausteine/wahrscheinlichkeit-und-softmax).
