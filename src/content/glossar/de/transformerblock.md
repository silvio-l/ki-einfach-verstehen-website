---
title: 'Transformerblock'
description: 'Das wiederholte Bauteil eines Transformers: Attention mischt zwischen den Tokens, eine Weiterverarbeitung rechnet auf jedem Token für sich.'
translationKey: transformerblock
---

Ein Transformerblock ist das Bauteil, das ein [Transformer](/de/glossar/transformer) viele Male hintereinander verwendet. Die Blöcke laufen nacheinander, nicht gleichzeitig. Er hat zwei Teile. Zuerst mischt die [Attention](/de/glossar/attention) Information zwischen den Positionen: In den Zustand jedes [Tokens](/de/glossar/token) fließt etwas von anderen Tokens ein. Danach rechnet eine Weiterverarbeitung, das Feed-Forward-Netz, auf jeder Position für sich, ohne auf andere Tokens zu schauen. Attention und Weiterverarbeitung bilden zusammen den Block.

Beide Teile geben ihr Ergebnis nicht als Ersatz zurück, es wird zum bisherigen [Zustand](/de/glossar/zwischenwert) des Tokens addiert. In der Regel sind alle Blöcke eines Modells gleich gebaut, haben aber eigene [Parameter](/de/glossar/parameter).

**Ein Beispiel:** Qwen3-8B hat 36 Blöcke. Bei Qwen3-8B steckt rund zwei Drittel der Parameter in den Weiterverarbeitungen der Blöcke.

**Nicht verwechseln mit einem Denkschritt:** Ein Block ist kein Schritt einer Überlegung, wie ein Mensch sie anstellt. Jeder Block formt alle Zustände nach demselben Bauplan ein Stück weiter um. Nach dem letzten Block steckt in jedem Zustand viel Kontext.

**Wo du dem Begriff begegnest:** In Modellbeschreibungen meist als „Layer“ oder „Schicht“. In der Konfiguration frei verfügbarer Modelle steht die Zahl oft unter einem Namen wie „num_hidden_layers“.

Eingeführt in [Transformerblöcke und Attention: Wie Kontext eingemischt wird](/de/bausteine/transformerbloecke-und-attention).
