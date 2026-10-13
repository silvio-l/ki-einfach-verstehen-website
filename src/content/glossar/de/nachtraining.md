---
title: 'Nachtraining'
description: 'Das zweite Training nach dem Grundtraining, das ein Modell mit Beispielen von Menschen und Bewertungen auf Antworten im Gespräch ausrichtet.'
translationKey: nachtraining
---

Das Nachtraining ist ein zweites Training, das nach dem Grundtraining kommt. Es arbeitet mit Beispielen, die Menschen geschrieben oder bewertet haben, und lehrt das Modell, welche Art von Antwort passt. Aus einem [Grundmodell](/de/glossar/grundmodell) wird so ein Modell, das Anweisungen befolgt.

**Ein Beispiel:** Das Paper InstructGPT von 2022 beschreibt das Verfahren in drei Schritten. Zuerst trainierte das Team das Modell mit Musterantworten zu rund 13.000 [Prompts](/de/glossar/prompt). Danach lernte ein [Belohnungsmodell](/de/glossar/belohnungsmodell) aus Rangfolgen mehrerer Antworten; dafür nutzte es rund 33.000 Prompts. Im dritten Schritt wurde das Modell gegen dieses Belohnungsmodell angepasst, mit rund 31.000 Prompts aus der API des Anbieters. Das Ergebnis heißt [Instruktionsmodell](/de/glossar/instruktionsmodell).

**Nicht verwechseln mit dem Grundtraining:** Auch das Nachtraining passt die [Parameter](/de/glossar/parameter) schrittweise an. Anders ist, wie der Fehler bestimmt wird: Im Grundtraining war das Ziel das nächste Textstück, im Nachtraining sind es Musterantworten und Rangfolgen. Aus den Rangfolgen lernt ein Belohnungsmodell, zwei Antworten zu vergleichen, und im dritten Schritt optimiert das Modell mit einem Verfahren des verstärkenden Lernens auf dessen Bewertung. Das Nachtraining ersetzt das Grundtraining also nicht, es baut darauf auf.

**Wo du dem Begriff begegnest:** In Modellkarten und Papern, die Verfahren wie SFT oder RLHF beschreiben. Dort wird empfohlen, ein Grundmodell vor dem Einsatz in Gesprächen nachzutrainieren.

Eingeführt in [Vom Textfortsetzer zum Assistenten: Was das Nachtraining aus einem Modell macht](/de/bausteine/vom-textfortsetzer-zum-assistenten).
