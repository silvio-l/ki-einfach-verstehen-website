---
title: 'Feed-Forward-Netz'
description: 'Ein Netz aus Schichten, dessen Eingaben nur nach vorn fließen, ohne Rückkopplung; auch MLP genannt.'
translationKey: feed-forward-netz
---

Ein Feed-Forward-Netz (englisch für vorwärts gerichtetes Netz) besteht aus [Schichten](/de/glossar/schicht), durch die Zahlen in einer Richtung fließen: von der Eingabe über die [Zwischenwerte](/de/glossar/zwischenwert), also die Zahlen zwischen Eingabe und Ausgabe, zur Ausgabe. Eine Schicht bekommt nur die Ausgabe der vorigen, nichts fließt zurück. Das Kürzel MLP (für Multilayer Perceptron, ein älterer englischer Name für ein Netz aus mehreren Schichten) meint oft dasselbe.

**Ein Beispiel:** Das Treppenlicht aus dem Baustein [Schichten](/de/bausteine/schichten) ist ein kleines Feed-Forward-Netz mit zwei Schichten. Das Licht hat zwei Schalter und brennt nur, wenn genau einer davon gedrückt ist. Zwei Neuronen, A und B, sitzen vorn und sehen beide Schalter. Sie geben ihre Zahlen nur an das Ausgabe-Neuron C weiter, nie zurück. Erst C entscheidet, ob das Licht brennt. Die Ausgaben von A und B sind dabei Zwischenwerte: Sie wandern als Eingabe in C und sind selbst keine Antwort.

**Nicht verwechseln mit dem ganzen Transformerblock:** Ein [Transformerblock](/de/glossar/transformerblock) enthält ein Feed-Forward-Netz als zweiten Teil. Das Feed-Forward-Netz rechnet dort für jedes [Token](/de/glossar/token) einzeln, während die [Attention](/de/glossar/attention) Informationen zwischen den Tokens mischt. Allein ist das Feed-Forward-Netz nur ein Stapel aus Schichten; erst der Block ergänzt es um die Attention.

**Wo du dem Begriff begegnest:** In Fachtexten zu Sprachmodellen und in der Architekturbeschreibung großer Modelle, oft unter dem Kürzel MLP.

Eingeführt in [Schichten: Wie aus vielen Neuronen ein Netz wird](/de/bausteine/schichten).
