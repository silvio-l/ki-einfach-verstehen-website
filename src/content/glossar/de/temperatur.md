---
title: 'Temperatur'
description: 'Ein Einstellwert, durch den die Scores vor Softmax geteilt werden: Niedrige Werte machen die Auswahl vorhersehbarer, hohe abwechslungsreicher.'
translationKey: temperatur
---

Die Temperatur ist ein Einstellwert für die Auswahl des nächsten Textstücks. Vor [Softmax](/de/glossar/softmax) werden alle [Scores](/de/glossar/score) durch sie geteilt. Eine Temperatur unter 1 vergrößert die Abstände zwischen den Scores, das wahrscheinlichste Stück bekommt noch mehr. Eine Temperatur über 1 verkleinert sie, und unwahrscheinlichere Stücke kommen beim [Sampling](/de/glossar/sampling) öfter dran. Bei Temperatur 0 wird immer das wahrscheinlichste Stück gewählt.

Die Temperatur ist kein [Parameter](/de/glossar/parameter) des Modells und wird nicht trainiert. Sie ändert weder das Modell noch seine Scores, sondern nur, wie stark deren Abstände bei der Auswahl zählen. Eine hohe Temperatur macht ein Modell deshalb nicht klüger.

Eingeführt in [Wahrscheinlichkeit und Softmax: Wie ein Modell sich entscheidet](/de/bausteine/wahrscheinlichkeit-und-softmax).
