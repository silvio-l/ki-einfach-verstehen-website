---
title: 'Tensor'
description: 'Ein Zahlenblock mit beliebig vielen Achsen (ein Skalar hat keine), der als Datenstruktur für Modellberechnungen dient.'
translationKey: tensor
---

Ein Tensor ist in Bibliotheken für maschinelles Lernen ein Zahlenblock mit einheitlichem Zahlentyp. Die Zahl seiner **Achsen** gibt an, wie viele Nummern man braucht, um eine Stelle darin zu finden: In einer Liste genügt die Platznummer. In einer Tabelle braucht man Zeile und Spalte. In einem Stapel von Tabellen kommen Stapelnummer, Zeile und Spalte zusammen. Für vier Achsen braucht man einfach eine vierte Nummer, etwa „Gruppe 2, Tabelle 5, Zeile 1, Spalte 3". Man muss sich dafür keinen vierdimensionalen Gegenstand vorstellen; entscheidend ist nur die vierteilige Adresse. Ein [Skalar](/de/glossar/skalar), ein [Vektor](/de/glossar/vektor) und eine [Matrix](/de/glossar/matrix) sind die Sonderfälle mit null, einer und zwei Achsen. Die **Form** nennt die Länge jeder Achse, etwa 3 × 4 × 7.

Sprachmodelle fassen die Vektoren vieler Tokenpositionen in Tensoren zusammen. So können ganze Folgen innerhalb einer gemeinsamen Datenstruktur verarbeitet werden.

Eingeführt in [Skalar, Vektor, Matrix, Tensor: die Bausteine der Zahlen](/de/bausteine/skalar-vektor-matrix-tensor).
