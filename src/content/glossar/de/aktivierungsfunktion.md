---
title: 'Aktivierungsfunktion'
description: 'Die Stufe, die auf die Summe eines Neurons folgt und dafür sorgt, dass gestapelte Schichten mehr können als eine einzige Summe. Im Text dieses Bausteins heißt sie Knick.'
translationKey: aktivierungsfunktion
---

Eine Aktivierungsfunktion nimmt die Zahl, die ein [Neuron](/de/glossar/neuron) nach Summe und [Grundregler](/de/glossar/grundregler) erreicht hat, und formt sie um. Die bekannteste Form heißt ReLU: Negative Werte werden auf null gesetzt, positive bleiben, wie sie sind. Im Text dieses Bausteins heißt die Stufe Knick.

**Ein Beispiel:** Liegt die Summe bei −1, gibt das Neuron 0 aus. Liegt sie bei 2, gibt es 2 aus. Ohne diese Stufe bliebe die −1 bestehen.

**Nicht verwechseln mit einer Schwelle:** Eine Schwelle entscheidet nur Ja oder Nein. Eine Aktivierungsfunktion gibt eine Zahl aus, die die nächste Schicht weiterverarbeitet. Ohne sie bleiben gestapelte [Schichten](/de/glossar/schicht) im Ergebnis eine einzige gewichtete Summe.

**Wo du dem Begriff begegnest:** In Modellbeschreibungen, etwa als `hidden_act` in der Konfigurationsdatei eines Sprachmodells, der Datei mit seinen Bauangaben. Manche Sprachmodelle, etwa Qwen3-8B, nutzen statt des scharfen Knicks eine abgerundete Variante namens SiLU.

Eingeführt in [Neuronale Netze: Wie aus vielen kleinen Rechnungen ein Modell wird](/de/bausteine/neuronale-netze).
