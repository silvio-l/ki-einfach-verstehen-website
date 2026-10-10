---
title: 'Neuron'
description: 'Eine feste Rechenvorschrift, die aus ihren Eingaben, Gewichten und dem Grundregler eine Zahl macht, die durch einen Knick läuft.'
translationKey: neuron
---

Ein künstliches Neuron nimmt mehrere Zahlen als Eingabe, multipliziert jede mit ihrem [Gewicht](/de/glossar/parameter), zählt alles zusammen und addiert den [Grundregler](/de/glossar/grundregler). Danach läuft das Ergebnis durch die [Aktivierungsfunktion](/de/glossar/aktivierungsfunktion). Die Zahl, die dabei herauskommt, heißt Ausgabe des Neurons.

**Ein Beispiel:** Der Spamfilter aus dem ersten Baustein rechnet mit den ausgedachten Gewichten „Gewinn“ +3, „gratis“ +2 und „Rechnung“ −2 und dem Grundregler −2. Eine Mail mit „Gewinn“ und „gratis“ ergibt 3 + 2, also 5, und mit dem Grundregler insgesamt 3. Diese 3 ist die Ausgabe dieses Neurons.

**Nicht verwechseln mit einer Nervenzelle:** Der Name stammt aus der Biologie. Ein künstliches Neuron ist aber eine Rechenvorschrift aus Summe, Grundregler und Knick. Es lernt nicht selbst, gelernt werden die Gewichte und der Grundregler.

**Wo du dem Begriff begegnest:** In Fachtexten und Modellbeschreibungen, fast immer zusammen mit [Schicht](/de/glossar/schicht). Wenn ein Text von vielen Neuronen spricht, meint er viele solcher Rechenvorschriften in Schichten.

Eingeführt in [Neuronale Netze: Wie aus vielen kleinen Rechnungen ein Modell wird](/de/bausteine/neuronale-netze).
