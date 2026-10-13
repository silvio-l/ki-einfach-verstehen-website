---
title: 'Instruktionsmodell'
description: 'Ein Modell, das nach dem Nachtraining Anweisungen befolgen und auf Fragen mit Antworten reagieren soll.'
translationKey: instruktionsmodell
---

Ein Instruktionsmodell ist das Ergebnis des [Nachtrainings](/de/glossar/nachtraining), das Anweisungen befolgen soll. Der Name beschreibt dieses Ziel: Instruktion heißt Anweisung, und das Modell soll Anweisungen folgen, die als Text vor ihm stehen. Es entsteht aus demselben [Grundmodell](/de/glossar/grundmodell), das mit anderen Beispielen und einer anderen Bewertung weitertrainiert wurde. Die Parameter werden dabei ebenfalls schrittweise angepasst, aber der Fehler wird anders bestimmt, wie im Nachtraining beschrieben.

**Ein Beispiel:** Im Paper von 2022 setzte das Grundmodell GPT-3 eine Aufgabe mit weiteren Aufgaben fort. Das Ergebnis des Nachtrainings, InstructGPT, wurde dagegen auf einem Testset mit Anfragen von API-Kundinnen und -Kunden, die nicht im Training vorkamen, von den Auftragskräften den Antworten von GPT-3 vorgezogen, obwohl es mit 1,3 Milliarden [Parametern](/de/glossar/parameter) deutlich kleiner war. Gemessen wurde dabei die Vorliebe in diesem Test, nicht eine Leistung in allen Aufgaben. Genau diese Anpassung an Anweisungen ist das Ziel des Nachtrainings.

**Nicht verwechseln mit jedem Chatmodell:** Nicht jedes Modell, das im Chat antwortet, ist im selben Sinn ein Instruktionsmodell. Der Begriff beschreibt das Ziel des Nachtrainings, nicht die genauen Verfahren eines bestimmten Anbieters. Das Wort sagt auch nichts darüber, ob eine Antwort stimmt.

**Wo du dem Begriff begegnest:** In Modellnamen mit einem Zusatz wie „Instruct“, etwa Qwen2.5-7B-Instruct, und in Beschreibungen des Nachtrainings.

Eingeführt in [Vom Textfortsetzer zum Assistenten: Was das Nachtraining aus einem Modell macht](/de/bausteine/vom-textfortsetzer-zum-assistenten).
