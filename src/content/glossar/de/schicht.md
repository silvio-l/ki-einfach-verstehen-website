---
title: 'Schicht'
description: 'Eine Gruppe von Neuronen, die dieselbe Eingabe bekommt und parallel rechnet; in Modellangaben steht Schicht oft für einen ganzen Transformerblock.'
translationKey: schicht
---

Eine Schicht ist eine Reihe von [Neuronen](/de/glossar/neuron), die alle dieselbe Eingabe bekommen und gleichzeitig rechnen. Die Ausgaben dieser Reihe bilden die nächste Eingabe, deshalb rechnet ein Netz in Stufen. Zählt man die Gewichte einer Schicht, ergibt sich: Eingaben mal Neuronen, dazu je ein [Grundregler](/de/glossar/grundregler) pro Neuron. Manche Modelle lassen die Grundregler in einzelnen Schichten weg; dann fallen sie aus der Zählung heraus.

**Das Bild dazu:** Eine Reihe von Kanälen am Mischpult, die gemeinsam dieselbe Eingabe abhören. Die Grenze des Bildes: Die Kanäle einer Reihe laufen nebeneinander; in einem Netz wird die Ausgabe jeder Schicht außer der letzten zur Eingabe der nächsten.

**Ein Beispiel:** Eine Schicht mit zwei Eingaben und drei Neuronen hat 2 mal 3, also 6 Gewichte, und dazu 3 Grundregler. Zusammen sind das 9 Zahlen. Ein zweites Beispiel ist das Treppenlicht: Zwei Neuronen, A und B, bekommen dieselben zwei Schalter als Eingabe (dort steuern die Schalter ein Licht); deshalb bilden sie eine Schicht. Das Ausgabe-Neuron C ist eine Schicht mit nur einem Neuron; auch das zählt als Schicht. Die Ausgaben von A und B sind für C Zwischenwerte, und das Licht brennt genau dann, wenn genau einer der beiden Schalter gedrückt ist; sind beide oder keiner gedrückt, bleibt es dunkel.

**Nicht verwechseln mit einem Transformerblock:** In Modellangaben wie „96 Schichten“ beim Sprachmodell GPT-3 ist ein ganzer [Transformerblock](/de/glossar/transformerblock) gemeint, der selbst mehrere Neuronenschichten enthält. Die Angabe zählt also Blöcke, nicht einzelne Reihen von Neuronen.

**Wo du dem Begriff begegnest:** In Modellangaben und in Programmbibliotheken, etwa in PyTorch, einem verbreiteten Programm zum Bauen neuronaler Netze.

Eingeführt in [Schichten: Wie aus vielen Neuronen ein Netz wird](/de/bausteine/schichten).
