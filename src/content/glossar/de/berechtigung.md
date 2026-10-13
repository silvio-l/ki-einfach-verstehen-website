---
title: 'Berechtigung'
description: 'Die Regel eines Programms, die festlegt, welche Werkzeugaufrufe ohne Rückfrage laufen, welche nachfragen und welche nicht laufen.'
translationKey: berechtigung
---

Eine Berechtigung ist eine Regel der Anwendung, die über [Werkzeugaufrufe](/de/glossar/werkzeugaufruf) entscheidet. Sie legt fest, was ohne Rückfrage ausgeführt wird, wofür das Programm dich fragt und was es ablehnt. Die Regeln sind meist in Modi zusammengefasst, also in Einstellungen für den Grad der Freigabe.

**Ein Beispiel:** In einem Programmierwerkzeug kann eine Datei im Projekt gelesen werden, ohne zu fragen. Im Modus „Manuell“ (intern `default`) fragt eine Umbenennung nach. Im Modus, der alles ablehnt, was sonst gefragt würde, läuft die Umbenennung nur, wenn eine Erlaubnisregel sie ausdrücklich zulässt.

**Nicht verwechseln mit der Bitte im Text:** Schreibt das Modell „Darf ich die Datei umbenennen?“, ist das ein Text. Die Berechtigung ist eine Regel des Programms. Anweisungen im Prompt oder in der Datei CLAUDE.md (eine Textdatei mit Anweisungen für Claude Code) prägen, was das Modell versucht; sie ändern nicht, was das Programm erlaubt. Erlaubt wird etwas über die Einstellungen des Programms, etwa über einen Modus oder über Erlaubnisregeln.

**Wo du dem Begriff begegnest:** In Einstellungen von Programmierwerkzeugen, etwa als Modus oder als Liste erlaubter Befehle. Dort siehst du, welcher Modus gerade gilt; er entscheidet bei jedem folgenden Aufruf, ob das Programm fragt oder nicht. Bei Server-Werkzeugen des Anbieters gibt es diesen Schalter für dich nicht; dort entscheidet der Anbieter.

Eingeführt wird der Begriff in [Vom Chatbot zum Agenten: Wie KI eine Aufgabe abarbeitet](/de/bausteine/vom-chatbot-zum-agenten).
