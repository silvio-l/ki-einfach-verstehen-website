---
title: 'Tensor'
description: 'Ein Zahlenblock mit beliebig vielen Achsen; Skalar, Vektor und Matrix sind Sonderfälle davon, und in solchen Blöcken rechnen KI-Modelle.'
translationKey: tensor
---

Ein Tensor ist in Bibliotheken für maschinelles Lernen ein Zahlenblock, in dem alle Zahlen von derselben Sorte sind, etwa lauter Kommazahlen. Die Zahl seiner **Achsen** gibt an, wie viele Nummern man braucht, um eine Stelle darin zu finden: In einer Liste genügt die Platznummer. In einer Tabelle braucht man Zeile und Spalte. In einem Stapel von Tabellen kommen Stapelnummer, Zeile und Spalte zusammen. Für vier Achsen braucht man einfach eine vierte Nummer, etwa „Gruppe 2, Tabelle 5, Zeile 1, Spalte 3“. Man muss sich dafür keinen vierdimensionalen Gegenstand vorstellen; entscheidend ist nur die vierteilige Adresse. Ein [Skalar](/de/glossar/skalar), ein [Vektor](/de/glossar/vektor) und eine [Matrix](/de/glossar/matrix) sind die Sonderfälle mit null, einer und zwei Achsen. Die **Form** nennt die Länge jeder Achse, etwa 3 × 4 × 7.

Ein Satz ergibt bei einem Sprachmodell eine Matrix mit einer Zeile pro Token. Beim Training werden die Matrizen vieler Sätze zu einem Tensor gestapelt, damit der Rechenchip sie in einem Durchgang verarbeiten kann.

**Ein Beispiel:** Ein Farbfoto mit 400 Bildpunkten Höhe und 600 Breite wird für ein Modell zu drei Tabellen, je eine für Rot, Grün und Blau. Übereinandergelegt ergeben sie einen Tensor der Form 3 × 400 × 600, das sind 720.000 Zahlen.

**Nicht verwechseln mit dem Tensor aus Physik und Mathematik:** Dort steht hinter dem Wort ein strengerer Begriff mit eigenen Rechenregeln. Bei KI-Modellen ist schlicht ein Zahlenblock gemeint.

**Wo du dem Begriff begegnest:** Im Namen der Bibliothek TensorFlow und in der Dokumentation anderer Bibliotheken für maschinelles Lernen, wo zu fast jedem Zahlenblock seine Form angegeben wird.

Eingeführt in [Skalar, Vektor, Matrix, Tensor: die Bausteine der Zahlen](/de/bausteine/skalar-vektor-matrix-tensor).
