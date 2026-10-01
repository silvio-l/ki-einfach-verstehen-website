---
title: 'Trainingsalgorithmus'
description: 'Das feste Verfahren, das auf Trainingsbeispiele angewendet wird und daraus die Parameter eines Modells erzeugt.'
translationKey: trainingsalgorithmus
---

Ein Trainingsalgorithmus ist ein eigener [Algorithmus](/de/glossar/algorithmus): ein festes Verfahren, das auf Trainingsbeispiele angewendet wird und daraus etwas Neues erzeugt — die [Parameter](/de/glossar/parameter) eines [Modells](/de/glossar/modell). Anders als bei klassischen Algorithmen ist das Ergebnis hier keine sofort ablesbare Lösung, sondern ein Satz eingestellter Zahlenwerte.

*Denkbild: ein Arbeitsplan für ein Mischpult. Über viele kleine Schritte werden die Regler anhand der Trainingsdaten verstellt. Die am Ende gespeicherten Reglerstellungen sind das Modell.*

**Ein Beispiel:** Bei einem [Spamfilter](/de/glossar/spamfilter) stehen zu Beginn alle Gewichte auf null. Der Trainingsalgorithmus lässt den Filter eine bereits markierte Mail bewerten und vergleicht dessen Antwort mit der Markierung. Lässt der Filter „Gratis: Dein Gewinn wartet“ durch, obwohl die Mail als Spam markiert ist, rücken die Gewichte von „gratis“ und „Gewinn“ ein kleines Stück nach oben. Dann kommt das nächste Beispiel, tausende Male hintereinander.

**Nicht verwechseln mit der Rechenvorschrift des Modells:** Im Spamfilter arbeiten zwei Verfahren. Das eine bewertet eine Mail: Gewichte zusammenzählen, mit der Schwelle vergleichen. Der Trainingsalgorithmus ist das andere. Er stellt die Zahlen ein, mit denen das erste rechnet, und arbeitet nur während des Trainings. Danach bleiben die Parameter stehen, und im Einsatz ([Inferenz](/de/glossar/inferenz)) rechnet das Modell nur noch mit ihnen.

**Wo du dem Begriff begegnest:** Selten wörtlich. Meist steckt er hinter Sätzen wie „das Modell wurde mit vielen Beispielen trainiert“ oder „die KI hat gelernt“. Wer tiefer einsteigt, trifft auf Einstellwerte des Trainings wie die [Lernrate](/de/glossar/lernrate), die festlegt, wie stark jeder einzelne Schritt die Parameter nachstellt.

Ausführlicher erklärt in [„Programm, Algorithmus, Modell im Vergleich“](/de/bausteine/programm-algorithmus-modell).
