---
title: 'Schicht'
description: 'Eine Gruppe von Neuronen, die dieselbe Eingabe bekommt und parallel rechnet. In Modellangaben steht Schicht oft für einen ganzen Transformerblock.'
translationKey: schicht
---

Eine Schicht ist eine Reihe von [Neuronen](/de/glossar/neuron), die alle dieselbe Eingabe bekommen und gleichzeitig rechnen. Die Ausgaben dieser Reihe bilden die nächste Eingabe. Zählt man die Gewichte einer Schicht, ergibt sich: Eingaben mal Neuronen, dazu je ein [Grundregler](/de/glossar/grundregler) pro Neuron, sofern die Schicht Grundregler hat.

**Ein Beispiel:** Eine Schicht mit zwei Eingaben und drei Neuronen hat 2 mal 3, also 6 Gewichte, und dazu 3 Grundregler. Zusammen sind das 9 Zahlen.

**Nicht verwechseln mit einem Transformerblock:** In Modellangaben wie „96 Schichten“ beim Sprachmodell GPT-3 ist ein ganzer [Transformerblock](/de/glossar/transformerblock) gemeint, der selbst mehrere Neuronenschichten enthält. Die Angabe zählt also Blöcke, nicht einzelne Reihen von Neuronen.

**Wo du dem Begriff begegnest:** In Modellangaben und in Programmbibliotheken, etwa in PyTorch, einem verbreiteten Programm zum Bauen neuronaler Netze.

Eingeführt in [Neuronale Netze: Wie aus vielen kleinen Rechnungen ein Modell wird](/de/bausteine/neuronale-netze).
