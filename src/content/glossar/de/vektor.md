---
title: 'Vektor'
description: 'Eine geordnete Liste von Zahlen, in der jeder Platz zur Information gehört; ein Sprachmodell holt für jedes Token so eine Liste aus einer Tabelle.'
translationKey: vektor
---

Ein Vektor ist eine geordnete Liste von Zahlen, etwa die Temperaturen einer Woche: Jede Zahl hat einen festen Platz, und der Platz gehört zur Information dazu. Er hat eine **Achse**; seine Länge ist die Zahl der Einträge. In einem Sprachmodell wählt die [Token-ID](/de/glossar/token-id) eine Zeile einer großen Tabelle aus, und diese Zeile ist der gelernte Vektor des Tokens.

Anders als bei der Wetterliste hat eine einzelne Zahl in einem Token-Vektor meist keinen Namen, den ein Mensch ablesen könnte. Was die Liste ausdrückt, ergibt sich erst aus allen Zahlen zusammen, und festgelegt wird es beim Training. Mehrere Vektoren untereinander ergeben eine [Matrix](/de/glossar/matrix), viele Matrizen gestapelt einen [Tensor](/de/glossar/tensor).

**Ein Beispiel:** Für das Token „Die“ holt die kleinste Version von GPT-2 eine Liste mit 768 Zahlen aus ihrer Tabelle, also einen Vektor der Länge 768. Auch die Liste am Ende des Modells ist ein Vektor: ein [Score](/de/glossar/score) für jeden Eintrag des Vokabulars.

**Nicht verwechseln mit dem Pfeil aus der Schule:** Dort ist ein Vektor meist ein Pfeil in der Ebene oder im Raum, beschrieben durch zwei oder drei Zahlen. Bei KI-Modellen ist er zuerst eine Zahlenliste, und die lässt sich bei 768 Einträgen nicht mehr zeichnen. Ist von „768 Dimensionen“ die Rede, ist die Länge der Liste gemeint, nicht die Zahl ihrer Achsen.

**Wo du dem Begriff begegnest:** In Erklärtexten über Sprachmodelle, sobald es darum geht, wie aus Text Zahlen werden. Dort steht für den gelernten Vektor eines Tokens oft das englische Wort Embedding.

Eingeführt in [Skalar, Vektor, Matrix, Tensor: die Bausteine der Zahlen](/de/bausteine/skalar-vektor-matrix-tensor).
