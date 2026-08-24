---
title: 'Kontextfenster'
description: 'Die begrenzte Zahl von Tokenpositionen, die ein Modell in einem Verarbeitungsvorgang berücksichtigen kann.'
translationKey: kontextfenster
---

Das Kontextfenster beschreibt, wie viele [Tokens](/de/glossar/token) ein Modell bei einer Verarbeitung berücksichtigen kann. Je nach System teilen sich Eingabe und erzeugte Ausgabe diesen begrenzten Raum.

Ein Text mit vielen kleinen Tokens braucht mehr Platz im Kontextfenster als ein gleich lang wirkender Text, der in größere Tokens zerlegt wurde. Wort- und Zeichenzahl bestimmen die Auslastung deshalb nicht exakt.

Ausführlicher erklärt in [Tokenizer: Wie Sprache zu Zahlen wird](/de/bausteine/tokenizer-ids-vokabular).
