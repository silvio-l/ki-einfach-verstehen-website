---
title: 'Backpropagation'
description: 'Das Verfahren, das den Gradienten ausrechnet: ein einziger Rückweg vom Fehler zum Eingang, der jedem Regler seine Steigung gibt, ohne ihn zu drehen.'
translationKey: backpropagation
---

Backpropagation, ungefähr „Rückwärtsausbreitung“, ist das Verfahren, das den [Gradienten](/de/glossar/gradient) eines Modells ausrechnet. Die Rechnung beginnt beim Fehler am Ausgang und geht [Schicht](/de/glossar/schicht) für Schicht zurück zum Eingang. Unterwegs bekommt jeder [Parameter](/de/glossar/parameter) seine Steigung. Dafür braucht sie die Zwischenwerte aus dem Vorwärtsdurchlauf, die das Training so lange aufbewahrt.

**Ein Beispiel:** Ein ausgedachtes Netz für ein Treppenlicht mit zwei Schaltern hat ein Neuron B mit drei Reglern (zwei Gewichte und ein Grundregler). Statt jeden einzeln probezudrehen, rechnet der Rückweg einmal aus, wie stark der Fehler auf B reagiert, und nutzt diese Zahl für alle drei. So reicht ein Rückweg: Probedrehen bräuchte im Netz mit seinen neun Reglern neun zusätzliche Vorwärtsdurchläufe, einen pro Regler.

**Nicht verwechseln mit dem ganzen Lernen:** Backpropagation rechnet nur aus, wohin und wie stark der Fehler jeden Regler zieht. Gedreht wird danach, in einem eigenen Schritt. Nach der Backpropagation stehen alle Regler noch genau wie vorher. Sie findet auch nicht den „schuldigen“ Regler: Der größte Eintrag kann an einem Regler hängen, der richtig steht.

**Wo du dem Begriff begegnest:** In Erklärungen, wie neuronale Netze trainiert werden, oft kurz „Backprop“ genannt. Für neuronale Netze wurde es Mitte der 1980er-Jahre mehrfach unabhängig entdeckt; 1986 beschrieben es David Rumelhart, Geoffrey Hinton und Ronald Williams in der Fachzeitschrift Nature. Die zugrunde liegende Idee ist älter.

Eingeführt in [Backpropagation und Gradienten: Wie das Modell weiß, was es ändern muss](/de/bausteine/backpropagation-und-gradienten).
