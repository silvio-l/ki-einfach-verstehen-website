---
title: 'Score'
description: 'Ein Zahlenwert, den ein Sprachmodell einem möglichen nächsten Textstück zuweist — noch keine Wahrscheinlichkeit und noch keine Entscheidung.'
translationKey: score
---

Ein Score ist ein Zahlenwert, den ein Sprachmodell einem einzelnen möglichen nächsten Textstück zuweist. Ein hoher Score bedeutet: Dieses Textstück passt aus Sicht des Modells gut an diese Stelle. Ein niedriger oder negativer Score bedeutet: eher unpassend.

Ein Score ist weder eine Wahrscheinlichkeit noch eine Entscheidung. Er sagt nur, wie ein Kandidat im Vergleich zu allen anderen dasteht — nicht, wie ein späterer Auswahlschritt daraus am Ende ein konkretes Textstück macht. Der [Output](/de/glossar/output) eines Sprachmodells besteht aus genau so einer Liste von Scores, einem pro Kandidat im Vokabular.

Ausführlicher erklärt in [Input und Output: Wie eine Funktion „denkt"](/de/bausteine/input-und-output).
