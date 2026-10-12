---
title: 'Momentum'
description: 'Ein gleitender Durchschnitt früherer Steigungen, dem der Optimierer statt dem einzelnen Gradienten folgt; auf Deutsch auch Schwung genannt.'
translationKey: momentum
---

Momentum, auf Deutsch Schwung, ist ein gleitender Durchschnitt der früheren Steigungen eines [Parameters](/de/glossar/parameter). Der [Optimierer](/de/glossar/optimierer) folgt diesem Durchschnitt statt jedem einzelnen Gradienten. Bei jedem [Batch](/de/glossar/batch) (einem Stapel von Beispielen) besteht der neue Schwung zum größten Teil aus dem bisherigen und zu einem kleinen Teil aus der neuen Steigung. Was hin und her zeigt, hebt sich dabei fast auf. Was immer in dieselbe Richtung zeigt, sammelt sich. Wie viel vom alten Schwung bleibt, ist ein [Hyperparameter](/de/glossar/hyperparameter).

**Ein Beispiel:** Ein ausgedachter [Parameter](/de/glossar/parameter) bekommt abwechselnd die Steigungen +8 und −8, ein zweiter jedes Mal 1. Der Optimierer behält 90 Prozent des alten Schwungs und nimmt 10 Prozent der neuen Steigung dazu. Nach zwanzig Batches schwankt der Schwung des ersten noch zwischen rund −0,4 und +0,5, der des zweiten liegt bei fast 0,9.

**Nicht verwechseln mit Schwung im physikalischen Sinn:** Hier rollt nichts. Momentum ist eine gespeicherte Zahl pro Parameter, ein Rechenstand des Trainings und kein Teil des fertigen Modells. Mehr Momentum ist auch nicht immer besser: Behält der Optimierer fast alles, reagiert er träge auf neue Steigungen.

**Wo du dem Begriff begegnest:** In Berichten über das Training großer Modelle, oft versteckt als erste Einstellung von Adam oder AdamW. Bei GPT-3 lag dieser Anteil laut Forschungspapier bei 90 Prozent. In Lehrbüchern zum maschinellen Lernen steht Momentum meist gleich nach der einfachen Regel „Schritt gleich Steigung mal Lernrate“.

Eingeführt in [Optimierung: Wer die Gewichte tatsächlich ändert](/de/bausteine/optimierung-der-gewichte).
