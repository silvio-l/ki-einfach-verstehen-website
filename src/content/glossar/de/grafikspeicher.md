---
title: 'Grafikspeicher'
description: 'Der schnelle Speicher direkt an einem Grafikchip, auch VRAM genannt. Damit ein Modell zügig läuft, müssen seine Parameter darin Platz finden.'
translationKey: grafikspeicher
---

Grafikspeicher (oft VRAM genannt) ist der schnelle Speicher direkt an einem Grafikchip. Mit Zahlen, die dort liegen, kann der Chip am schnellsten rechnen. Damit ein Modell zügig läuft, müssen deshalb alle seine [Parameter](/de/glossar/parameter) darin Platz finden. Passt ein Modell nicht auf einen Chip, wird es auf mehrere verteilt.

Faustregel: Milliarden Parameter mal Bytes pro Zahl ergibt mindestens den Speicherbedarf in Gigabyte, mit 2 Byte pro Zahl also das Doppelte der Parameterzahl.

**Ein Beispiel:** Eine Spiele-Grafikkarte wie die GeForce RTX 4090 hat 24 Gigabyte Grafikspeicher. Llama 3.1 8B braucht mit 2 Byte pro Parameter rund 16 Gigabyte und passt darauf. Die größte Fassung, Llama 3.1 405B, kommt auf rund 810 Gigabyte. Selbst ein Rechenzentrumschip wie die H100 von Nvidia fasst in der verbreiteten Fassung nur 80 Gigabyte, also braucht dieses Modell mehrere Chips. Die erste Grenze ist der Platz, nicht das Tempo.

**Nicht verwechseln mit dem Arbeitsspeicher:** Den Arbeitsspeicher eines Computers oder Handys teilen sich System und alle Apps. Ein Handy hat keinen eigenen Grafikspeicher, ein Modell muss dort in den gemeinsamen Arbeitsspeicher passen. Auch der Gerätespeicher, auf dem die Modelldatei abgelegt ist, zählt nicht: Gerechnet wird erst, wenn die Zahlen in den schnellen Speicher geladen sind.

**Wo du dem Begriff begegnest:** In Datenblättern und auf Produktseiten von Grafikkarten, meist als „VRAM“ in Gigabyte angegeben. Und überall, wo es darum geht, ein Sprachmodell auf dem eigenen Rechner laufen zu lassen: Dort entscheidet der Grafikspeicher, welche Modellgröße überhaupt infrage kommt. Mit [Quantisierung](/de/glossar/quantisierung) lässt sich der Bedarf verkleinern.

Eingeführt in [Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft](/de/bausteine/parameter-training-inferenz-hardware).
