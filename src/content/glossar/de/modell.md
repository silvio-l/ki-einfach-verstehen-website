---
title: 'Modell'
description: 'Ein fester Rechenweg, dessen Verhalten zusätzlich von gespeicherten, trainierten Zahlenwerten (Parametern) abhängt.'
translationKey: modell
---

Ein Modell ist ein fester Rechenweg, dessen Verhalten zusätzlich von gespeicherten Zahlenwerten abhängt — den [Parametern](/de/glossar/parameter). Ein [Algorithmus](/de/glossar/algorithmus) (der [Trainingsalgorithmus](/de/glossar/trainingsalgorithmus)) stellt diese Werte anhand von Beispielen ein; kein Mensch legt sie einzeln von Hand fest.

*Denkbild: ein Mischpult mit sehr vielen Reglern.* Die Anordnung der Regler (die Architektur, also der Bauplan des Modells) steht fest, ihre genauen Stellungen (die Parameter) ergeben sich erst aus dem Training.

Ist ein Modell einmal trainiert, rechnet es im Betrieb nur noch mit seinen festen Parametern: Es nimmt einen Input entgegen und berechnet daraus einen Output.

**Ein Beispiel:** Ein einfacher Spamfilter speichert für jedes Wort ein Gewicht, mit ausgedachten Werten etwa +3 für „Gewinn“ und −2 für „Rechnung“. Für jede Mail zählt er die Gewichte ihrer Wörter zusammen und vergleicht die Summe mit einer Schwelle. Diese Rechenvorschrift sagt nichts über Spam. Welche Wörter verdächtig sind, steht allein in den Zahlen. Ändert sich eine davon, entscheidet der Filter anders, ohne dass sich eine Zeile Code ändert.

**Nicht verwechseln mit einem Regelbuch:** Bei einem klassischen Programm findest du die Zeile, die eine Entscheidung ausgelöst hat, und kannst sie ändern. In einem rein trainierten Modell gibt es diese Zeile nicht, nur Zahlen. Bei großen Modellen sind es so viele, dass sich ein einzelner Parameter meist nicht in Worten beschreiben lässt.

**Wo du dem Begriff begegnest:** In Chat-Apps, in denen du oft zwischen verschiedenen Modellen wählen kannst, in Nachrichten über neue Modellversionen und auf Produktseiten, die nennen, welches Modell hinter einem Dienst oder einer App steckt. Ein [Sprachmodell](/de/glossar/sprachmodell) ist dabei ein Modell, das speziell auf Text trainiert wurde.

Ausführlicher erklärt in [„Programm, Algorithmus, Modell im Vergleich“](/de/bausteine/programm-algorithmus-modell).
