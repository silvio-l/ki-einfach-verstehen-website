---
title: 'Denkaufwand'
description: 'Die Rechenarbeit, die ein Modell vor einer Antwort einsetzt, gemessen an den Denk-Tokens und Durchläufen durch das Netz.'
translationKey: denkaufwand
---

Denkaufwand ist die Menge an Rechenarbeit, die ein Modell vor und während einer Antwort einsetzt. Ablesen lässt er sich vor allem an der Zahl der [Denk-Tokens](/de/glossar/denk-tokens), die die Anbieter als geschriebenen Text abrechnen. Vereinfachend gilt: Für jedes Token rechnet das Modell das gesamte gespeicherte Netz einmal durch. Mehr Denk-Tokens heißt mehr Arbeit und mehr Wartezeit. Anbieter geben den Aufwand oft als Stufe vor, etwa niedrig, mittel oder hoch. Bei OpenAI heißt der Regler `reasoning_effort`. Anthropic beschreibt das Denken als adaptiv: Die Stufe ist dort eine Vorgabe, und das Modell entscheidet im Rahmen, ob und wie viel es denkt.

**Ein Beispiel (ausgedacht):** Dieselbe Frage kann mit wenig Denkaufwand sofort beantwortet werden. Mit viel Denkaufwand schreibt das Modell einen langen Gedankengang, bevor es antwortet. Die Antwort kann in beiden Fällen gleich kurz sein.

**Nicht verwechseln mit Qualität:** Mehr Denkaufwand kann eine Antwort verbessern, vor allem bei Aufgaben aus mehreren aufeinander aufbauenden Schritten. Wie viel es bringt, hängt von der Aufgabe ab; eine allgemeine Regel gibt es nicht. Mehr Denken ist kein Ersatz für Wissen, das im Modell fehlt. Ein höherer Aufwand macht die Antwort auch nicht automatisch richtiger.

**Wo du dem Begriff begegnest:** In den Einstellungen mancher Chat-Apps, in den Parametern der Programmierschnittstellen (API) der Anbieter und in den Abrechnungen, wo die Denk-Tokens als Ausgabe erscheinen. Mehr dazu im Baustein [Wie ein Modell „nachdenkt“: Zwischenschritte, die es selbst schreibt](/de/bausteine/wie-ein-modell-nachdenkt).
