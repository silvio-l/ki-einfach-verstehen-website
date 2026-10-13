---
title: 'Belohnungsmodell'
description: 'Ein Modell, das lernt vorherzusagen, welche von mehreren Antworten Menschen bevorzugen, und dafür jeder Antwort eine Zahl als Bewertung gibt.'
translationKey: belohnungsmodell
---

Ein Belohnungsmodell ist ein [Modell](/de/glossar/modell), das lernt vorherzusagen, welche von mehreren Antworten Menschen bevorzugen. Für jede neue Antwort gibt es eine Zahl als Bewertung aus. Im [Nachtraining](/de/glossar/nachtraining) steht es zwischen den Rangfolgen von Menschen und dem Modell, das anschließend besser werden soll.

**Ein Beispiel:** Im Paper InstructGPT ordneten Auftragskräfte zu einer Frage zwischen vier und neun Antworten nach Hilfsbereitschaft. Aus diesen Rangfolgen lernte das Belohnungsmodell, welche Antwort ein Mensch bevorzugen würde. Gelernt wird also ein Vergleich: Die Antwort, die in der Rangfolge höher steht, ist die bevorzugte. Dafür nutzte das Team rund 33.000 [Prompts](/de/glossar/prompt). Danach kann das Belohnungsmodell neue Antworten mit einer Zahl bewerten, ohne dass dafür jemand die Antwort liest.

**Nicht verwechseln mit einem Urteil im Moment der Antwort:** Das Belohnungsmodell ist selbst ein Modell. Es ahmt die Urteile nach, die vorher gesammelt wurden, und liest nicht mit, während du eine Antwort bekommst. Die Zahl misst also, was in den gesammelten Rangfolgen bevorzugt wurde. Ob eine Antwort stimmt, misst sie damit nicht.

**Wo du dem Begriff begegnest:** In Beschreibungen des Nachtrainings, etwa bei RLHF oder im Paper InstructGPT.

Eingeführt in [Vom Textfortsetzer zum Assistenten: Was das Nachtraining aus einem Modell macht](/de/bausteine/vom-textfortsetzer-zum-assistenten).
