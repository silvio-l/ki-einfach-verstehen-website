---
title: 'Aktivierungsfunktion'
description: 'Die Stufe nach der Summe eines Neurons, die die Zahl umformt; im Baustein „Das künstliche Neuron“ heißt sie Untergrenze, sie setzt negative Werte auf null.'
translationKey: aktivierungsfunktion
---

Eine Aktivierungsfunktion nimmt die Zahl, die ein [Neuron](/de/glossar/neuron) nach Summe und [Grundregler](/de/glossar/grundregler) erreicht hat, und formt sie um. Die bekannteste Form heißt ReLU: Negative Werte werden auf null gesetzt, positive bleiben, wie sie sind. Im Baustein „Das künstliche Neuron“ heißt die Stufe Untergrenze.

**Ein Beispiel:** Liegt die Zahl nach Summe und Grundregler bei −1, gibt das Neuron 0 aus. Liegt sie bei 2, gibt es 2 aus. Ohne diese Stufe bliebe die −1 bestehen.

**Nicht verwechseln mit einer Schwelle:** Eine Schwelle entscheidet nur Ja oder Nein. Eine Aktivierungsfunktion gibt eine Zahl aus, die die nächste Schicht weiterverarbeitet. Ohne sie bleiben gestapelte [Schichten](/de/glossar/schicht) im Ergebnis eine einzige gewichtete Summe. Erst mit ihr lohnt sich das Stapeln, denn eine zweite Schicht kann dann etwas darstellen, was die erste allein nicht schafft. Im Treppenlicht aus dem Baustein [Schichten](/de/bausteine/schichten) ist das „genau einer von beiden“: Das Licht brennt nur, wenn genau einer von zwei Schaltern gedrückt ist, und dieses Muster entsteht ohne die Stufe nicht.

**Wo du dem Begriff begegnest:** In Modellbeschreibungen, etwa als `hidden_act` in der Konfigurationsdatei eines Sprachmodells, der Datei mit seinen Bauangaben. Manche Sprachmodelle, etwa Qwen3-8B, nutzen statt der scharfen Ecke eine abgerundete Variante namens SiLU.

Eingeführt in [Das künstliche Neuron: Wie aus einer Summe eine Ausgabe wird](/de/bausteine/kuenstliches-neuron).
