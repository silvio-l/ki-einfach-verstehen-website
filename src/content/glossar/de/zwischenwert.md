---
title: 'Zwischenwert'
description: 'Die Zahl, die ein Neuron beim Durchrechnen einer Eingabe erzeugt und an die nächste Schicht weitergibt; sie entsteht für jeden Text neu.'
translationKey: zwischenwert
---

Ein Zwischenwert ist die Ausgabe eines [Neurons](/de/glossar/neuron), die als Eingabe in die nächste [Schicht](/de/glossar/schicht) wandert. Er ist weder die Antwort des Modells noch ein gespeicherter Wert. Jede Eingabe erzeugt eine eigene Reihe von Zwischenwerten.

**Ein Beispiel:** Im Treppenlicht aus [Schichten](/de/bausteine/schichten) steuern zwei Schalter ein Licht, das nur brennt, wenn genau einer gedrückt ist. Die Neuronen A und B sehen beide Schalter; ihre Ausgaben sind die Zwischenwerte. Ist keiner der Schalter gedrückt, sind beide 0. Ist einer gedrückt, sind sie 1 und 0. Sind beide gedrückt, sind sie 2 und 1. Ein drittes Neuron, das Ausgabe-Neuron, rechnet daraus weiter, und erst dessen Ergebnis zeigt das Licht.

**Nicht verwechseln mit den Parametern:** Die [Parameter](/de/glossar/parameter), also Gewichte und Grundregler, bleiben beim Antworten fest. Zwischenwerte ändern sich mit jeder Eingabe; eine Zahl ist nur durch ihre Rolle in der Rechnung ein Zwischenwert. Das Bild dazu sind Anzeigen über den Reglern eines Mischpults, die wechseln mit dem, was gerade hindurchläuft. Die Grenze dieses Bildes: Am echten Pult gehört jede Anzeige zu einem Kanal und einem Instrument. Ein Zwischenwert gehört dagegen zu keinem Thema und wirkt an vielen Merkmalen mit. Ein Merkmal ist ein Muster über viele Zwischenwerte, das bei passendem Text anspringt.

**Wo du dem Begriff begegnest:** In Fachtexten über das Innere von Sprachmodellen, etwa wenn es um Merkmale geht, die in Zwischenwerten sichtbar werden.

Eingeführt in [Schichten: Wie aus vielen Neuronen ein Netz wird](/de/bausteine/schichten).
