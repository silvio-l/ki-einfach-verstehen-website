---
title: 'Sonde'
description: 'Ein kleines, zusätzliches Auslesegerät, das die Zahlen im Modell daraufhin prüft, ob sie eine bestimmte Information enthalten.'
translationKey: sonde
---

Eine Sonde (englisch Probe) ist ein kleines Zusatzmodell, das auf den [Zwischenwerten](/de/glossar/zwischenwert) eines fertigen Modells trainiert wird. Zwischenwerte sind die Zahlen, die im Modell bei jeder Eingabe entstehen. Die Sonde bekommt sie und versucht daraus eine bestimmte Information vorherzusagen, etwa den Zustand eines Spielbretts oder den Ort, zu dem ein Name gehört. Das Modell selbst bleibt unverändert.

**Ein Beispiel (ausgedacht):** Eine Sonde soll aus den Zwischenwerten eines Modells sagen, ob ein Feld eines Spielbretts gerade von Schwarz oder von Weiß besetzt ist. Gelingt das bei neuen Stellungen zuverlässig, steckt die Information lesbar in den Zahlen. Ob das Modell sie für seine Antworten benutzt, ist eine andere Frage, die die Sonde nicht beantwortet.

**Nicht verwechseln mit einem Beweis der Benutzung:** Eine Sonde zeigt, dass sich eine Information aus den Zahlen auslesen lässt. Sie zeigt nicht, dass das Modell damit rechnet. Ob die Sonde die Information nur ausliest oder selbst errechnet, zeigt ein Vergleich mit einem Netz, das nicht trainiert wurde: Liest die Sonde dort genauso gut aus, hat sie die Information selbst errechnet. Dafür braucht es zusätzlich einen Test, bei dem man einzelne Zahlen gezielt verändert und prüft, ob sich die Antwort des Modells ändert. Gurnee und Tegmark (2024) schreiben ausdrücklich, dass aus lesbarer Information nicht folgt, dass das Modell sie benutzt.

**Wo du dem Begriff begegnest:** In Forschungsarbeiten zur Interpretierbarkeit, also zur Frage, was in den Zahlen eines Modells steckt. Die Befunde dazu, mit Quellen, stehen im Baustein [Versteht KI, was sie sagt?](/de/bausteine/versteht-ki-was-sie-sagt).
