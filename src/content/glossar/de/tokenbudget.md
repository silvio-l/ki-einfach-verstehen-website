---
title: 'Tokenbudget'
description: 'Die Gesamtzahl der Tokens, die ein Training verarbeitet, Wiederholungen mitgezählt, also die Zahl, mit der sich Trainingsläufe vergleichen lassen.'
translationKey: tokenbudget
---

Das Tokenbudget ist die Gesamtzahl der [Tokens](/de/glossar/token), die ein Training verarbeitet, Wiederholungen mitgezählt. Es ist ein [Hyperparameter](/de/glossar/hyperparameter): Menschen legen es fest, bevor das Training beginnt. Zusammen mit der Zahl der [Parameter](/de/glossar/parameter) bestimmt es grob, wie viel Rechenzeit ein Training kostet.

**Ein Beispiel:** GPT-3 wurde 2020 mit 300 Milliarden Tokens trainiert, das größte Llama-3.1-Modell 2024 mit 15,6 Billionen. Eine Studie von DeepMind fand 2022, dass bei fester Rechenzeit rund 20 Tokens pro Parameter am günstigsten sind. Für ein Modell mit 8 Milliarden Parametern wären das rund 160 Milliarden Tokens. Llama 3 8B bekam über 15 Billionen und wurde laut Meta noch immer besser.

**Nicht verwechseln mit der Größe der Trainingsdaten:** Wie viel Text vorhanden ist, sagt noch nicht, wie viel das Training liest. Manche Quellen kommen mehrfach dran, andere nicht einmal ganz. Das Tokenbudget zählt, was tatsächlich verarbeitet wurde, gleich ob zum ersten oder zum dritten Mal.

**Wo du dem Begriff begegnest:** In technischen Berichten und Ankündigungen neuer Modelle, meist als „trainiert auf … Tokens“. Es ist die Zahl, mit der sich Trainingsläufe am besten vergleichen lassen, weil sie anders als die Zahl der [Schritte](/de/glossar/schritt) nicht von der Größe der Stapel abhängt.

Eingeführt in [Batch, Epoch, Step, Tokenbudget: Wie man Trainingsfortschritt misst](/de/bausteine/batch-epoch-step-tokenbudget).
