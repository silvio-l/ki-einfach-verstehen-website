---
title: 'Temperatur'
description: 'Ein Einstellwert, durch den die Scores vor Softmax geteilt werden: Niedrige Werte machen die Auswahl vorhersehbarer, hohe abwechslungsreicher.'
translationKey: temperatur
---

Die Temperatur ist ein Einstellwert für die Auswahl des nächsten Textstücks. Vor [Softmax](/de/glossar/softmax) werden alle [Scores](/de/glossar/score) durch sie geteilt. Eine Temperatur unter 1 vergrößert die Abstände zwischen den Scores, das wahrscheinlichste Stück bekommt noch mehr. Eine Temperatur über 1 verkleinert sie, und unwahrscheinlichere Stücke kommen beim [Sampling](/de/glossar/sampling) öfter dran. Durch 0 lässt sich nicht teilen, deshalb nehmen Anbieter bei Temperatur 0 nach Abmachung immer das wahrscheinlichste Stück.

**Ein Beispiel:** Für „Die Katze …“ ergeben die Scores bei Temperatur 1 die Anteile 72, 27 und 1 Prozent für „sitzt“, „schläft“ und „fliegt“. Bei Temperatur 0,5 werden daraus 88, 12 und 0,03 Prozent. Bei Temperatur 2 sind es 57, 35 und 8 Prozent, und „fliegt“ kommt ungefähr bei jeder 13. Drehung dran statt bei jeder hundertsten.

**Nicht verwechseln mit einem Parameter:** Die Temperatur ist kein [Parameter](/de/glossar/parameter) des Modells und wird nicht trainiert. Sie ändert weder das Modell noch die Scores, die es berechnet. Geteilt werden sie erst bei der Auswahl, und das bestimmt nur, wie stark ihre Abstände zählen. Eine hohe Temperatur macht ein Modell deshalb nicht klüger. Sie gibt unwahrscheinlicheren Stücken öfter eine Chance, guten Überraschungen ebenso wie Unsinn.

**Wo du dem Begriff begegnest:** In den Einstellungen der Programmierschnittstellen, meist mit Werten zwischen 0 und 1 oder 0 und 2. Empfohlen werden oft niedrige Werte für Aufgaben mit einer richtigen Antwort und höhere für kreative. In Chat-Apps gibt es meist keinen Regler, und bei manchen neuen Modellen legt der Anbieter den Wert selbst fest. Ganz gleiche Antworten garantiert auch Temperatur 0 nicht, weil die Rechnung im Rechenzentrum winzig schwanken kann.

Eingeführt in [Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](/de/bausteine/wahrscheinlichkeit-und-softmax).
