---
title: 'Schritt'
description: 'Eine Runde im Training: ein Stapel Beispiele, ein Vergleich mit den richtigen Antworten, einmal alle Parameter nachstellen.'
translationKey: schritt
---

Ein Schritt, englisch step, ist eine Runde im Training. Das Modell rechnet einen Stapel Beispiele vorwärts, der Loss misst, wie weit es danebenlag, und der [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus) stellt daraufhin alle [Parameter](/de/glossar/parameter) einmal ein kleines Stück nach. Wie groß dieses Stück ist, legt die [Lernrate](/de/glossar/lernrate) fest.

**Ein Beispiel:** GPT-3 wurde mit 300 Milliarden [Tokens](/de/glossar/token) trainiert, jeder Stapel enthielt 3,2 Millionen Tokens. Geteilt ergibt das knapp 94.000 Schritte. Weil der Stapel zu Beginn kleiner war und erst wuchs, waren es tatsächlich ein paar mehr.

**Nicht verwechseln mit der Größe der Korrektur:** Als Zählwort meint Schritt die ganze Runde, nicht die Strecke, um die ein einzelner Parameter rückt. Schrittzahlen lassen sich außerdem nur vergleichen, wenn die Stapel gleich groß sind. Ein Team mit viermal so großen Stapeln verarbeitet in gleich vielen Schritten viermal so viel Text. Was ein Training wirklich gesehen hat, zählt das [Tokenbudget](/de/glossar/tokenbudget).

**Wo du dem Begriff begegnest:** In technischen Berichten zu Sprachmodellen, oft zusammen mit einem Plan für die Lernrate, der über eine feste Zahl von Schritten läuft. Beim größten Llama-3.1-Modell waren es 1,2 Millionen. In Trainingsprogrammen zählt eine Anzeige die Schritte mit, meist als „step“.

Eingeführt in [Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst](/de/bausteine/batch-epoch-step-tokenbudget).
