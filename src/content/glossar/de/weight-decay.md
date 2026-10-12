---
title: 'Weight Decay'
description: 'Ein stetiger Zug im Training, der jeden Parameter bei jedem Schritt ein winziges Stück Richtung null rückt, getrennt vom Gradienten.'
translationKey: weight-decay
---

Weight Decay, auf Deutsch etwa Gewichtsschwund, ist ein stetiger Zug im Training: Bei jedem Schritt rückt der [Optimierer](/de/glossar/optimierer) jeden [Parameter](/de/glossar/parameter) ein winziges Stück Richtung null, im Verhältnis zu seinem Wert. Ein Parameter mit doppelt so großem Wert rückt doppelt so weit. Der Zug wirkt immer, egal was der Gradient gerade sagt. Parameter, die das Modell braucht, bekommen Steigungen, die dagegenhalten. Wie stark der Zug ist, ist ein [Hyperparameter](/de/glossar/hyperparameter).

**Ein Beispiel:** Ein Regler steht bei 2, ein anderer bei 1. Beide bekommen bei jedem Batch den Gradienten null. Ohne Weight Decay blieben sie stehen. Mit Weight Decay schrumpfen beide Schritt für Schritt um denselben kleinen Anteil ihres Werts, der erste also doppelt so schnell. Nach sehr vielen Schritten stehen beide nahe null.

**Nicht verwechseln mit dem Entfernen von Parametern:** Weight Decay löscht keinen Parameter, es macht ihn nur kleiner, wenn nichts dagegenhält. Auch das Absenken der [Lernrate](/de/glossar/lernrate) ist etwas anderes, das regelt der Lernraten-Plan. Bei Adam zählt, wie der Zug angewendet wird: Zählt man ihn zum Gradienten dazu, teilt Adam ihn mit durch die übliche Größe, und Parameter mit großen Steigungen spüren ihn kaum. AdamW wendet ihn deshalb getrennt an.

**Wo du dem Begriff begegnest:** In den Trainingseinstellungen großer Modelle, als kleine Zahl neben dem Optimierer. GPT-3 nutzte laut Forschungspapier den Wert 0,1. Das W in AdamW steht für dieses getrennte Weight Decay.

Eingeführt in [Optimierung: Wer die Gewichte tatsächlich ändert](/de/bausteine/optimierung-der-gewichte).
