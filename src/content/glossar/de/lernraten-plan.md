---
title: 'Lernraten-Plan'
description: 'Der vorher festgelegte Verlauf der Lernrate über ein Training: meist kurz hochfahren, das Aufwärmen, und danach lange absenken.'
translationKey: lernraten-plan
---

Ein Lernraten-Plan legt fest, wie sich die [Lernrate](/de/glossar/lernrate) im Lauf eines Trainings ändert. Bei großen Sprachmodellen beginnt sie meist fast bei null und wird in kurzer Zeit hochgefahren, das heißt Aufwärmen. Danach sinkt sie lange und langsam. Am Anfang stehen die Parameter zufällig, und Verfahren wie [Adam](/de/glossar/optimierer) kennen die übliche Größe der Steigungen erst aus wenigen [Batches](/de/glossar/batch) (Stapeln von Beispielen), deshalb gehen große Schritte leicht schief. Am Ende würden große Schritte das Modell immer wieder aus dem Tal schubsen, also aus dem Punkt mit dem kleinsten [Loss](/de/glossar/loss), weil die Steigungen von Batch zu Batch weiter wackeln. Der Plan wird vor dem Training gewählt und ist ein [Hyperparameter](/de/glossar/hyperparameter).

**Ein Beispiel:** Beim größten Llama-3.1-Modell stieg die Lernrate laut Meta 8.000 Schritte lang an und sank dann über 1,2 Millionen Schritte langsam auf ein Hundertstel. Ganz am Ende des Trainings ging sie auf null.

**Nicht verwechseln mit einer Lernrate, die sich selbst anpasst:** Der Plan richtet sich nach der Schrittzahl, nicht danach, wie gut das Training gerade läuft. Er steht vorher fest. Dass Adam jedem Parameter eine eigene Schrittweite gibt, kommt zusätzlich dazu und ersetzt den Plan nicht. Eine hohe Lernrate heißt auch nicht schnelles Lernen: Gegen Ende springt das Modell mit ihr über das Tal.

**Wo du dem Begriff begegnest:** In Forschungspapieren und technischen Berichten zu großen Modellen, oft mit Fachwörtern wie „warmup“ für das Aufwärmen und „cosine decay“ für den Bogen nach unten. Auch GPT-3 wurde so trainiert: erst hochgefahren, dann abgesenkt.

Eingeführt in [Optimierung: Wer die Gewichte tatsächlich ändert](/de/bausteine/optimierung-der-gewichte).
