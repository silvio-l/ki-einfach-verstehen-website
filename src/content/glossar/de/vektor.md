---
title: 'Vektor'
description: 'Eine geordnete Liste von Zahlen, mit der ein Modell Eigenschaften als gemeinsame numerische Repräsentation verarbeitet.'
translationKey: vektor
---

Ein Vektor ist eine geordnete Liste von Zahlen, etwa die Temperaturen einer Woche: Jede Zahl hat einen festen Platz, und der Platz gehört zur Information dazu. Er hat eine **Achse**; seine Länge ist die Zahl der Einträge. In einem Sprachmodell wählt die [Token-ID](/de/glossar/token-id) eine Zeile einer großen Tabelle aus, und diese Zeile ist der gelernte Vektor des Tokens.

Anders als bei der Wetterliste hat eine einzelne Zahl in einem Token-Vektor meist keinen Namen, den ein Mensch ablesen könnte. Die einzelnen Zahlen — auch **Komponenten** genannt — sind gemeinsam relevant; die Bedeutung entsteht aus ihrem Zusammenspiel. Zusammen bilden sie eine numerische Repräsentation, mit der das Modell weiterrechnet. Mehrere Vektoren können zu einem [Tensor](/de/glossar/tensor) zusammengefasst werden.

Eingeführt in [Skalar, Vektor, Matrix, Tensor: die Bausteine der Zahlen](/de/bausteine/skalar-vektor-matrix-tensor).
