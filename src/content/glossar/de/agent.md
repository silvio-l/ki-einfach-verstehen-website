---
title: 'Agent'
description: 'Ein Zusammenspiel aus Modell und Programm, das in einer Schleife Werkzeuge nutzt: Das Modell schreibt Aufrufe, das Programm führt sie aus, und die Ergebnisse kommen als Text zurück.'
translationKey: agent
---

Ein Agent ist das Zusammenspiel aus einem [Sprachmodell](/de/glossar/sprachmodell) und einer Schleife, die ein Programm drumherum betreibt. Das Modell schreibt [Werkzeugaufrufe](/de/glossar/werkzeugaufruf) in festem Format. Das Programm führt sie aus, legt die Ergebnisse als Text in den Verlauf und lässt das Modell weitermachen. Ein Agent arbeitet so eine Aufgabe in mehreren Schritten ab, bis kein Aufruf mehr folgt.

**Ein Beispiel:** Du bittest, eine Datei umzubenennen. Das Modell schreibt zuerst einen Aufruf, um die Dateien im Ordner aufzulisten. Das Programm führt ihn aus und legt die Liste als Text in den Verlauf. Danach schreibt das Modell den Aufruf zum Umbenennen. Das Programm fragt nach deiner Freigabe, führt die Umbenennung aus und das Modell antwortet dir.

**Nicht verwechseln mit einem Programm, das nur Regeln abarbeitet:** Der Agent ist nicht festgelegt, welchen Schritt er als Nächstes wählt. Das Modell schreibt die Folge, und das Programm führt nur aus, was seine Regeln erlauben. Ob das Ergebnis richtig ist, sagt der Agent nicht von selbst. Dafür braucht es eine Prüfung durch einen Menschen oder einen Test.

**Wo du dem Begriff begegnest:** In Programmierwerkzeugen wie Claude Code, einem Programm, mit dem Claude im Projektordner Dateien liest und ändert, arbeitet ein Agent Aufgaben über mehrere Dateien ab. Auch Chat-Apps mit Websuche nutzen dieselbe Schleife, meist unsichtbar.

Eingeführt wird der Begriff in [Vom Chatbot zum Agenten: Wie KI eine Aufgabe abarbeitet](/de/bausteine/vom-chatbot-zum-agenten).
