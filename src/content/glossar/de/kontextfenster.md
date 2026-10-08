---
title: 'Kontextfenster'
description: 'Die begrenzte Zahl von Tokenpositionen, die ein Modell in einem Verarbeitungsvorgang berücksichtigen kann.'
translationKey: kontextfenster
---

Das Kontextfenster beschreibt, wie viele [Tokens](/de/glossar/token) ein Modell bei einer Verarbeitung berücksichtigen kann. Je nach System teilen sich Eingabe und erzeugte Ausgabe diesen begrenzten Raum.

Ein Text mit vielen kleinen Tokens braucht mehr Platz im Kontextfenster als ein gleich lang wirkender Text, der in größere Tokens zerlegt wurde. Wort- und Zeichenzahl bestimmen die Auslastung deshalb nicht exakt.

**Ein Beispiel:** In einem langen Chat mit einem KI-Assistenten geht bei jeder Runde der ganze bisherige Verlauf erneut als [Input](/de/glossar/input) ins Modell, und er wird mit jeder Antwort länger. Passt er irgendwann nicht mehr ins Kontextfenster, muss das System einen Teil weglassen, kürzen oder in mehreren Schritten verarbeiten. Dann wirkt es, als hätte das Modell vergessen, was ganz am Anfang stand.

**Nicht verwechseln mit dem Wissen des Modells:** Das Kontextfenster enthält nur die Tokens, die bei der aktuellen Verarbeitung vorliegen, also etwa deinen Chatverlauf. Was das Modell im Training gelernt hat, steckt dagegen dauerhaft in seinen [Parametern](/de/glossar/parameter). Fällt ein Teil des Verlaufs aus dem Fenster, ändert das am Gelernten nichts, aber das Modell sieht diesen Teil nicht mehr.

**Wo du dem Begriff begegnest:** In Modellbeschreibungen von KI-Anbietern, wo die Größe des Kontextfensters in Tokens angegeben wird, und in Meldungen, dein Text sei zu lang. Ungewöhnliche Produktkennungen, lange Zahlenreihen oder Sprachen, die das Vokabular weniger kompakt abdeckt, füllen das Fenster schneller. Beim frühen Sprachmodell GPT-2 von 2019 waren es 1024 Positionen, beim größten GPT-3 schon 2048. Heutige Modellbeschreibungen nennen meist weit größere Werte.

Ausführlicher erklärt in [Token-IDs: Wie aus Tokens Zahlen werden](/de/bausteine/token-ids-und-vokabular).
