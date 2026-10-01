---
title: 'Grafikspeicher'
description: 'Der schnelle Speicher direkt an einem Grafikchip, auch VRAM genannt. Damit ein Modell zügig läuft, müssen seine Parameter darin Platz finden.'
translationKey: grafikspeicher
---

Grafikspeicher (oft VRAM genannt) ist der schnelle Speicher direkt an einem Grafikchip. Mit Zahlen, die dort liegen, kann der Chip am schnellsten rechnen. Damit ein Modell zügig läuft, müssen deshalb alle seine [Parameter](/de/glossar/parameter) darin Platz finden. Passt ein Modell nicht auf einen Chip, wird es auf mehrere verteilt.

Faustregel: Milliarden Parameter mal Bytes pro Zahl ergibt mindestens den Speicherbedarf in Gigabyte, mit 2 Byte pro Zahl also das Doppelte der Parameterzahl.

Eingeführt in [Parameter, Training und Inferenz, Hardware: Wie ein Modell läuft](/de/bausteine/parameter-training-inferenz-hardware).
