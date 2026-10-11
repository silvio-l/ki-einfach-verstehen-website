---
title: 'Kontextfenster'
description: 'Die begrenzte Zahl von Tokens, die ein Modell bei einer Verarbeitung berücksichtigen kann.'
translationKey: kontextfenster
---

Das Kontextfenster gibt an, wie viele [Tokens](/de/glossar/token) ein Modell auf einmal berücksichtigen kann. Tokens sind kleine Textstücke, oft Wortteile. Eingabe und Antwort teilen sich diesen begrenzten Raum. Bei gleicher Wortzahl füllt ein Text mehr vom Kontextfenster, wenn er in mehr Tokens zerfällt. Mitgezählt wird alles, was ins Modell geht: Anweisungen der Chat-App, Verlauf, deine Nachricht und die entstehende Antwort.

**Ein Beispiel:** In einem langen Chat erhält das Modell bei jeder Runde den gesamten bisherigen Verlauf erneut als [Input](/de/glossar/input). Dadurch wird die Eingabe mit jeder Antwort länger. Um im Fenster Platz zu machen, kann die Chat-App nach und nach die ältesten Teile des Gesprächs entfernen. Dann wirkt es, als hätte das Modell den Anfang vergessen.

**Nicht verwechseln mit dem Wissen des Modells:** Das Kontextfenster enthält nur, was bei der aktuellen Verarbeitung vorliegt. Was das Modell im Training gelernt hat, steckt dagegen dauerhaft in seinen [Parametern](/de/glossar/parameter), den Zahlenwerten aus dem Training. Fällt ein Teil des Verlaufs aus dem Fenster, ändert sich am Gelernten nichts. Das Modell sieht ihn dann nicht mehr.

**Wo du dem Begriff begegnest:** In Modellbeschreibungen wird die Größe des Kontextfensters in Tokens angegeben. Ist schon die Eingabe zu lang, lehnt Anthropic die Anfrage mit einer Fehlermeldung ab, wenn ein Programm das Modell direkt anspricht (über die API, eine Schnittstelle für Entwickler). Im Chat von claude.ai können stattdessen die ältesten Teile des Verlaufs herausfallen. Reicht der verbleibende Platz nicht für die ganze Antwort, bricht die Ausgabe oft ab. Das Kontextfenster von Claude Opus 5.5, einem Sprachmodell von Anthropic, umfasst rund eine Million Tokens.

Eingeführt wird der Begriff in [Tokenisierung im Modell: Wie dein Chat zu einer Tokenfolge wird](/de/bausteine/tokenisierung-im-modell).
