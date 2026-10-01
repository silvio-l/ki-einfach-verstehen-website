---
title: 'Score'
description: 'Ein Zahlenwert, mit dem ein Modell eine mögliche Antwort bewertet, etwa eine Klasse oder ein mögliches nächstes Textstück — noch keine Wahrscheinlichkeit und noch keine Entscheidung.'
translationKey: score
---

Ein Score ist ein Zahlenwert, mit dem ein Modell eine mögliche Antwort bewertet: bei einer Bilderkennung jede Klasse, bei einem Sprachmodell jedes mögliche nächste Textstück. Ein hoher Score bedeutet: Diese Möglichkeit passt aus Sicht des Modells gut. Ein niedriger oder negativer Score bedeutet: eher unpassend.

Ein Score ist weder eine Wahrscheinlichkeit noch eine Entscheidung. Er zeigt nur, wie ein Kandidat im Vergleich zu allen anderen dasteht. Erst ein späterer Auswahlschritt bestimmt daraus ein konkretes Textstück. Der [Output](/de/glossar/output) eines Sprachmodells besteht aus genau so einer Liste von Scores, einem pro Kandidat im Vokabular. In Wahrscheinlichkeiten verwandelt werden die Scores erst durch [Softmax](/de/glossar/softmax); in der Fachsprache heißen sie vor diesem Schritt auch **Logits**.

Ausführlicher erklärt in [Input und Output: Was eine Funktion tut](/de/bausteine/input-und-output).
