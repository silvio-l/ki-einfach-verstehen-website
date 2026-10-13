---
title: 'Denk-Tokens'
description: 'Die Zwischenschritte als Text, die ein Modell vor der Antwort schreibt.'
translationKey: denk-tokens
---

Denk-Tokens sind die [Tokens](/de/glossar/token), die ein Modell schreibt, bevor es seine eigentliche Antwort beginnt, und manchmal auch zwischen zwei Schritten, in denen es ein [Hilfswerkzeug](/de/glossar/werkzeug) nutzt. Zusammen bilden sie einen Gedankengang aus Text. Für das Modell sind sie Text wie jeder andere: Beim nächsten Schritt liest es sie und schreibt weiter. Oft zeigt die App sie nicht oder nur als Zusammenfassung. Trotzdem zählen sie. Sie kosten Rechenzeit, belegen Platz im [Kontextfenster](/de/glossar/kontextfenster), dem begrenzten Textumfang, den ein Modell in einem Gespräch verarbeiten kann, und werden bei Anthropic als Ausgabe abgerechnet, also als Text, den das Modell schreibt. Das gilt auch, wenn man sie nicht liest.

**Ein Beispiel (ausgedacht):** Eine Rechenaufgabe mit fünf Schritten kann einige hundert Denk-Tokens brauchen, bevor die Antwort mit dem Ergebnis beginnt. Die Antwort selbst ist vielleicht zwei Sätze lang. Der größte Teil der Ausgabe war dann Zwischenschritt.

**Nicht verwechseln mit Wissen:** Denk-Tokens sind kein zusätzliches Wissen. Sie sind Text, den das Modell in diesem Gespräch selbst schreibt. Ein Modell, das über eine Stadt nichts gelernt hat, wird durch Denk-Tokens nicht kundiger. Mehr Denken ersetzt kein fehlendes Wissen.

**Wo du dem Begriff begegnest:** In Anzeigen wie „denkt nach …“, in den Dokumentationen der Anbieter und in der Abrechnung. Eingeführt wird der Begriff in [Wie ein Modell „nachdenkt“: Zwischenschritte, die es selbst schreibt](/de/bausteine/wie-ein-modell-nachdenkt).
