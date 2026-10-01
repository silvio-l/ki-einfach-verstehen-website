---
title: 'Matrix'
description: 'Eine Matrix ist eine Tabelle aus Zahlen mit zwei Achsen, Zeilen und Spalten, in der jede Zahl eine feste Adresse hat.'
translationKey: matrix
---

Eine Matrix ist eine Tabelle aus Zahlen mit zwei **Achsen**: Zeilen und Spalten. Um eine Zahl darin zu finden, braucht man zwei Angaben, etwa Stadt und Tag in einer Wettertabelle. Ihre **Form** nennt die Länge beider Achsen, zum Beispiel 4 × 7 für vier Städte und sieben Tage.

Jede Zeile einer Matrix ist ein [Vektor](/de/glossar/vektor). In einem Sprachmodell wird ein Satz zu einer Matrix mit einer Zeile pro [Token](/de/glossar/token). Mehrere Matrizen gleicher Form lassen sich zu einem [Tensor](/de/glossar/tensor) stapeln.

**Ein Beispiel:** Angenommen, dein Satz „Die Katze sitzt.“ wird wie im Baustein über den Tokenizer in fünf Tokens zerlegt. Bei der kleinsten Version von GPT-2 bringt jedes davon einen Vektor mit 768 Zahlen mit. Untereinandergeschrieben ergeben sie eine Matrix der Form 5 × 768, zusammen 3.840 Zahlen. Auch ein Farbfoto besteht für ein Modell aus Matrizen: je eine Tabelle für Rot, Grün und Blau.

**Nicht verwechseln mit einer beliebigen Tabelle:** In einer Tabellenkalkulation dürfen Namen, Datumsangaben und Zahlen nebeneinanderstehen, und manche Zellen bleiben leer. Eine Matrix enthält nur Zahlen derselben Sorte, und jede Zeile ist gleich lang. Erst dadurch hat jede Zahl eine feste Adresse aus Zeile und Spalte.

**Wo du dem Begriff begegnest:** Im Mathematikunterricht und in Erklärtexten über KI-Modelle, etwa wenn es darum geht, warum Grafikprozessoren solche Zahlenblöcke in großen Portionen parallel verarbeiten. Im Alltag steckt dasselbe Prinzip in jeder Zahlentabelle mit festen Zeilen und Spalten, etwa einer Wettervorhersage für mehrere Städte oder einer Entfernungstabelle zwischen Städten.

Eingeführt in [Skalar, Vektor, Matrix, Tensor: die Bausteine der Zahlen](/de/bausteine/skalar-vektor-matrix-tensor).
