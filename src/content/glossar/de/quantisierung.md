---
title: 'Quantisierung'
description: 'Die Parameter eines Modells mit weniger Bit speichern, also gröber runden, damit das Modell weniger Speicher braucht.'
translationKey: quantisierung
---

Bei der Quantisierung werden die [Parameter](/de/glossar/parameter) eines Modells mit weniger Bit gespeichert als üblich, meist weniger als die 16 Bit der veröffentlichten Fassung, also gröber gerundet. Ein Bit ist die kleinste Ja-Nein-Stelle eines Speichers, ein Byte hat 8 davon. Mit 8 statt 16 Bit halbiert sich der Speicherbedarf, mit 4 Bit schrumpft er auf ein Viertel. So passen Modelle auf Geräte mit wenig [Grafikspeicher](/de/glossar/grafikspeicher) oder auf ein Handy.

Gröber gerundete Zahlen können etwas Genauigkeit kosten. Wie viel, hängt vom Verfahren und von der Bitzahl ab: Bei 8 Bit ist der Verlust oft kaum messbar, je weniger Bit, desto eher leidet die Qualität.

**Ein Beispiel:** Auf manchen Handys läuft bei Apple ein Sprachmodell mit rund 3 Milliarden Parametern direkt auf dem Gerät. Mit 2 Byte pro Zahl bräuchte es rund 6 der 8 Gigabyte Arbeitsspeicher eines Handys. Apple speichert den größten Teil der Zahlen deshalb mit nur 2 Bit, also auf ein Achtel verkleinert. Damit braucht das Modell nicht viel mehr als drei Viertel eines Gigabytes.

**Nicht verwechseln mit einem kleineren Modell:** Ein quantisiertes Modell hat genauso viele Parameter wie vorher. Es fehlt kein Regler, jede Stellung ist nur mit weniger Stellen notiert. Ein Modell mit weniger Parametern ist dagegen ein anderes, kleineres Pult mit einem eigenen Training.

**Wo du dem Begriff begegnest:** Auf Download-Seiten frei verfügbarer Modelle, die dasselbe Modell oft in Fassungen mit unterschiedlich vielen Bit anbieten. In Programmen, mit denen du Sprachmodelle auf dem eigenen Rechner ausführst, und in Meldungen über KI, die direkt auf Handy oder Laptop läuft statt im Rechenzentrum.

Eingeführt in [Modellgröße und Hardware: Wo ein Modell Platz findet](/de/bausteine/modellgroesse-und-hardware).
