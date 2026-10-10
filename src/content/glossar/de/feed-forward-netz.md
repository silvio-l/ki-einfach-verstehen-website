---
title: 'Feed-Forward-Netz'
description: 'Ein Netz aus Schichten, dessen Eingaben nur nach vorn fließen, ohne Rückkopplung. Auch MLP genannt.'
translationKey: feed-forward-netz
---

Ein Feed-Forward-Netz (englisch für vorwärts gerichtetes Netz) besteht aus [Schichten](/de/glossar/schicht), durch die Zahlen in einer Richtung fließen: von der Eingabe über die Zwischenwerte zur Ausgabe. Eine Schicht bekommt nur die Ausgabe der vorigen, nichts fließt zurück. Das Kürzel MLP (für Multilayer Perceptron, ein älterer englischer Name für ein Netz aus mehreren Schichten) meint oft dasselbe.

**Ein Beispiel:** Das Treppenlicht aus dem Baustein zu neuronalen Netzen ist ein kleines Feed-Forward-Netz mit zwei Stufen: Die Zahlen von A und B gehen nur in das Ausgabe-Neuron C, nie zurück.

**Nicht verwechseln mit dem ganzen Transformerblock:** Ein Transformerblock enthält ein Feed-Forward-Netz als zweiten Teil. Das Feed-Forward-Netz rechnet dort für jedes [Token](/de/glossar/token) einzeln, während die [Attention](/de/glossar/attention) Informationen zwischen den Tokens mischt.

**Wo du dem Begriff begegnest:** In Fachtexten zu Sprachmodellen und in der Architekturbeschreibung großer Modelle, oft unter dem Kürzel MLP.

Eingeführt in [Neuronale Netze: Wie aus vielen kleinen Rechnungen ein Modell wird](/de/bausteine/neuronale-netze).
