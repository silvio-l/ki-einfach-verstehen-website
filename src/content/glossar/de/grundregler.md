---
title: 'Grundregler'
description: 'Eine Zahl (Fachbegriff: Bias), die ein Neuron zu seiner gewichteten Summe addiert, bevor die Aktivierungsfunktion greift; beim Antworten bleibt sie fest.'
translationKey: grundregler
---

Der Grundregler ist eine Zahl, die zu einem [Neuron](/de/glossar/neuron) gehört. Sie wird nach der gewichteten Summe dazugezählt, bevor die [Aktivierungsfunktion](/de/glossar/aktivierungsfunktion) greift (im Baustein „Das künstliche Neuron“ Untergrenze genannt: sie setzt negative Werte auf null), und kann positiv oder negativ sein. Beim Antworten bleibt sie fest; gelernt wird sie im Training zusammen mit den Gewichten. Er bestimmt, wie hoch die Summe liegen muss, bevor das Neuron etwas nach vorn weitergibt. Im Englischen und in Fachtexten heißt er Bias.

**Ein Beispiel:** Ein Neuron hat die gewichtete Summe 5 und den Grundregler −2. Es rechnet 5 + (−2), also 3, und reicht die 3 weiter. Ohne Grundregler wären es 5.

**Nicht verwechseln mit der Schwelle:** Der Spamfilter aus dem ersten Baustein verglich seine Summe mit 2. Das ist dieselbe Stellschraube in umgekehrter Form: „Summe über 2“ ergibt dasselbe wie „Summe minus 2 über 0“. Der Grundregler wird addiert, er wird nicht von der Summe abgezogen. Ein Neuron hat höchstens einen Grundregler, unabhängig davon, wie viele Eingaben es bekommt. In den Bausteinen hat jedes Neuron genau einen; manche Sprachmodelle wie Qwen3 lassen ihn dagegen in ihren [Feed-Forward-Netzen](/de/glossar/feed-forward-netz) ganz weg. Bei einer Schicht mit drei Neuronen sind es also bis zu drei Grundregler.

**Wo du dem Begriff begegnest:** In Modellangaben und Programmbibliotheken. In PyTorch, einem verbreiteten Programm zum Bauen neuronaler Netze, ist der Bias bei einer [Schicht](/de/glossar/schicht) standardmäßig eingeschaltet.

Eingeführt in [Das künstliche Neuron: Wie aus einer Summe eine Ausgabe wird](/de/bausteine/kuenstliches-neuron).
