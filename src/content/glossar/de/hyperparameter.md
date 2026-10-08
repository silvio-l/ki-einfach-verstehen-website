---
title: 'Hyperparameter'
description: 'Einstellungen, die Menschen festlegen, bevor ein Trainingslauf beginnt, etwa die Lernrate oder die Größe des Modells. Das Training selbst ändert sie nicht.'
translationKey: hyperparameter
---

Hyperparameter sind Einstellungen, die Menschen festlegen, bevor ein Trainingslauf beginnt. Dazu gehören Größen, die den Bauplan bestimmen, etwa die Zahl der Rechenstufen, die Größe des [Vokabulars](/de/glossar/vokabular) oder das [Kontextfenster](/de/glossar/kontextfenster), und Größen, die das Training steuern, etwa die [Lernrate](/de/glossar/lernrate).

Im Unterschied zu den [Parametern](/de/glossar/parameter) werden Hyperparameter nicht trainiert. Passende Werte finden Fachleute oft, indem sie mehrere Trainingsläufe mit verschiedenen Werten vergleichen.

**Ein Beispiel:** Bei GPT-2 legten die Entwickler vor dem Training fest, dass das Kontextfenster 1024 Tokens fasst, doppelt so viele wie beim Vorgänger. Auch dass Llama 3.1 8B rund acht und nicht neun Milliarden Parameter hat, ist eine solche Entscheidung. Das Training stellt die Regler, aber es baut kein neues Pult: Wie viele Regler es gibt, steht vorher fest.

**Nicht verwechseln mit Einstellungen beim Benutzen:** Die [Temperatur](/de/glossar/temperatur) eines Sprachmodells wird erst beim Benutzen gesetzt, bei jeder Anfrage neu, und lässt das Modell unverändert. Manche zählen sie trotzdem zu den Hyperparametern. Der wichtigere Unterschied: Eine Trainingseinstellung wie die Lernrate wirkt nur während des Trainings und hinterlässt ihre Spuren in den Parametern.

**Wo du dem Begriff begegnest:** In Forschungspapieren und technischen Berichten zu neuen Modellen, die ihre Hyperparameter meist als Liste oder Tabelle angeben. Das Papier zu GPT-3 nennt etwa die Zahl der Schichten, das Kontextfenster und die Lernrate. Bei frei verfügbaren Modellen stehen die Hyperparameter des Bauplans in einer kleinen Konfigurationsdatei neben den Gewichtsdateien.

Eingeführt in [Parameter, Training und Inferenz: Wie ein Modell lernt](/de/bausteine/parameter-training-inferenz-hardware).
