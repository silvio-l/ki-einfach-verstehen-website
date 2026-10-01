---
title: 'Quantisierung'
description: 'Die Parameter eines Modells mit weniger Bit speichern, also gröber runden, damit das Modell weniger Speicher braucht.'
translationKey: quantisierung
---

Bei der Quantisierung werden die [Parameter](/de/glossar/parameter) eines Modells mit weniger Bit gespeichert als im Training, also gröber gerundet. Mit 8 statt 16 Bit halbiert sich der Speicherbedarf, mit 4 Bit schrumpft er auf ein Viertel. So passen Modelle auf Geräte mit wenig [Grafikspeicher](/de/glossar/grafikspeicher) oder auf ein Handy.

Gröber gerundete Zahlen können etwas Genauigkeit kosten. Wie viel, hängt vom Verfahren ab; gute Verfahren kommen mit sehr wenig Verlust aus.

Eingeführt in [Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft](/de/bausteine/parameter-training-inferenz-hardware).
