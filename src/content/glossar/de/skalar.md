---
title: 'Skalar'
description: 'Ein Skalar ist eine einzelne Zahl ohne Platz in einer Liste oder Tabelle, der einfachste Zahlenblock ganz ohne Achse.'
translationKey: skalar
---

Ein Skalar ist eine einzelne Zahl, etwa die Temperatur von heute Mittag: 18 Grad. Er hat keine **Achse**, weil er sich in keine Richtung ausdehnt.

In Bibliotheken für maschinelles Lernen gilt ein Skalar als [Tensor](/de/glossar/tensor) ohne Achse. Mehrere Skalare in fester Reihenfolge bilden einen [Vektor](/de/glossar/vektor).

**Ein Beispiel:** Am Ende bewertet ein Sprachmodell jedes mögliche nächste Textstück mit einer einzelnen Zahl, dem [Score](/de/glossar/score). Jeder dieser Scores für sich ist ein Skalar, etwa 7,1 für ein naheliegendes Stück oder −2,3 für ein unpassendes. Erst alle Scores zusammen, in fester Reihenfolge, ergeben eine Liste und damit einen Vektor.

**Nicht verwechseln mit einer kleinen oder einfachen Zahl:** Ob etwas ein Skalar ist, hängt nicht vom Wert ab, sondern von der Anordnung. 0,5 ist ebenso ein Skalar wie 50.257. Auch das „Skalieren“ von Modellen, also ihr Vergrößern, ist damit nicht gemeint. Er sagt nur: Hier steht eine Zahl allein, ohne Platz in einer Liste oder Tabelle.

**Wo du dem Begriff begegnest:** Aus dem Physikunterricht kennst du ihn vielleicht als Größe ohne Richtung, etwa Temperatur oder Masse. Erklärtexte über KI beginnen mit ihm meist die Reihe Skalar, Vektor, Matrix, Tensor, und in der Dokumentation von Bibliotheken für maschinelles Lernen taucht er als Tensor ohne Achse auf. Im Alltag ist jede Einzelangabe ein Skalar: der Akkustand deines Handys, ein Preis, die Temperatur in der Wetter-App.

Eingeführt in [Skalar, Vektor, Matrix, Tensor: die Bausteine der Zahlen](/de/bausteine/skalar-vektor-matrix-tensor).
