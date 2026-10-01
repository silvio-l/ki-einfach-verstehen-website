---
title: 'Score'
description: 'Ein Zahlenwert, mit dem ein Modell eine mögliche Antwort wie eine Klasse oder das nächste Textstück bewertet, bevor daraus eine Wahrscheinlichkeit wird.'
translationKey: score
---

Ein Score ist ein Zahlenwert, mit dem ein Modell eine mögliche Antwort bewertet: bei einer Bilderkennung jede Klasse, bei einem Sprachmodell jedes mögliche nächste Textstück. Ein hoher Score bedeutet: Diese Möglichkeit passt aus Sicht des Modells gut. Ein niedriger oder negativer Score bedeutet: eher unpassend.

Ein Score ist weder eine Wahrscheinlichkeit noch eine Entscheidung. Er zeigt nur, wie ein Kandidat im Vergleich zu allen anderen dasteht. Erst ein späterer Auswahlschritt bestimmt daraus ein konkretes Textstück. Der [Output](/de/glossar/output) eines Sprachmodells besteht aus genau so einer Liste von Scores, einem pro Kandidat im Vokabular. In Wahrscheinlichkeiten verwandelt werden die Scores erst durch [Softmax](/de/glossar/softmax); in der Fachsprache heißen sie vor diesem Schritt auch **Logits**.

**Ein Beispiel:** Eine Bilderkennung bekommt das Foto einer Katze. Mit ausgedachten Zahlen könnten die Scores so aussehen: Katze 6,2, Hund 2,9, Fuchs 1,4, Auto −3,0. Ein eigener Schritt danach nimmt die Klasse mit dem höchsten Score, hier also „Katze“.

**Nicht verwechseln mit einer Wahrscheinlichkeit:** Scores können negativ sein und haben keine feste Obergrenze. Eine [Wahrscheinlichkeit](/de/glossar/wahrscheinlichkeit) liegt dagegen immer zwischen 0 und 100 Prozent, und alle Möglichkeiten zusammen ergeben 100 Prozent. Softmax behält die Reihenfolge der Scores bei, rechnet sie aber in genau solche Prozentwerte um.

**Wo du dem Begriff begegnest:** Im Alltag kennst du Scores als Punktestand oder Bewertung. In Erklärungen und technischen Dokumentationen zu Sprachmodellen steht meist das Fachwort Logits. Wenn ein Chatbot seine Antwort Stück für Stück aufbaut, steckt hinter jedem Stück eine solche Score-Liste.

Ausführlicher erklärt in [Input und Output: Was eine Funktion tut](/de/bausteine/input-und-output).
