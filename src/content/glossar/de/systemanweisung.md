---
title: 'Systemanweisung'
description: 'Vorgaben am Anfang eines Gesprächs, die als Nachricht mit der Rolle system an das Modell gehen, bevor die Frage des Nutzers kommt.'
translationKey: systemanweisung
---

Eine Systemanweisung sind Vorgaben, die am Anfang eines Gesprächs stehen, bevor die Frage des Nutzers kommt, etwa wie das Modell antworten soll oder welches Datum heute ist. Sie steht in der Folge, die das Modell liest, als Nachricht mit der Rolle system; bei manchen Modellen heißt die Rolle developer. Auf Englisch heißt sie „system prompt“.

**Ein Beispiel:** Ein ausgedachtes Beispiel: Eine App schreibt in die Systemanweisung „Antworte kurz und auf Deutsch.“ Danach fragt eine Person nach einer Zugverbindung. Das Modell bekommt beides als Text, getrennt nur durch die Marken der [Chat-Vorlage](/de/glossar/chat-vorlage). Die Vorgabe wirkt, weil sie im [Input](/de/glossar/input) steht, nicht weil das Modell sie gesondert kennt.

**Nicht verwechseln mit der Frage des Nutzers:** Die Systemanweisung kommt von der App oder dem Dienst, die das Modell einsetzen, nicht von der Person, die gerade tippt. Im Modell gibt es dafür keinen eigenen Kanal. Es sieht eine einzige Folge aus Vorgaben, bisherigen Nachrichten und der neuen Frage.

**Wo du dem Begriff begegnest:** In Dokumentationen zur Programmierschnittstelle, wo sie als eigene Rolle erscheint, und in Veröffentlichungen, in denen Anbieter die Vorgaben ihrer Apps offenlegen.

Eingeführt in [Vom Textfortsetzer zum Assistenten: Was das Nachtraining aus einem Modell macht](/de/bausteine/vom-textfortsetzer-zum-assistenten).
