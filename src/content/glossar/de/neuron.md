---
title: 'Neuron'
description: 'Eine feste Rechenvorschrift, die aus ihren Eingaben, Gewichten und dem Grundregler eine Zahl macht, die durch eine Untergrenze läuft.'
translationKey: neuron
---

Ein künstliches Neuron nimmt mehrere Zahlen als Eingabe, multipliziert jede mit ihrem [Gewicht](/de/glossar/parameter), zählt alles zusammen und addiert den [Grundregler](/de/glossar/grundregler). Danach läuft das Ergebnis durch eine [Aktivierungsfunktion](/de/glossar/aktivierungsfunktion). Ihre einfachste Form, die Untergrenze, setzt negative Werte auf null und lässt positive stehen; aktuelle Sprachmodelle nutzen oft glattere Stufen. Die Zahl, die dabei herauskommt, heißt Ausgabe des Neurons.

**Ein Beispiel:** Der Spamfilter aus dem ersten Baustein rechnete mit den ausgedachten Gewichten „Gewinn“ +3, „gratis“ +2 und „Rechnung“ −2 und verglich die Summe mit der Schwelle 2. Als Grundregler eines Neurons wäre das −2. Eine Mail mit „Gewinn“ und „gratis“ ergibt 3 + 2, also 5, und mit dem Grundregler insgesamt 3. Diese 3 ist die Ausgabe dieses Neurons.

**Nicht verwechseln mit einer Nervenzelle:** Der Name stammt aus der Biologie und erklärt nur den Namen. Ein künstliches Neuron ist eine feste Rechenvorschrift aus Summe, Grundregler und Untergrenze. Als Kanal am Mischpult kannst du es dir vorstellen: Die Regler sind die Gewichte, die Summe läuft durch den Kanal, die Anzeige zeigt die Ausgabe. Gelernt werden aber nur die Gewichte und der Grundregler; das Neuron selbst lernt nicht. Das Mischpult-Bild stimmt also für die Rechnung, nicht für das Lernen.

**Wo du dem Begriff begegnest:** In Fachtexten und Modellbeschreibungen, fast immer zusammen mit [Schicht](/de/glossar/schicht). Wenn ein Text von vielen Neuronen spricht, meint er viele solcher Rechenvorschriften in Schichten.

Eingeführt in [Das künstliche Neuron: Wie aus einer Summe eine Ausgabe wird](/de/bausteine/kuenstliches-neuron).
