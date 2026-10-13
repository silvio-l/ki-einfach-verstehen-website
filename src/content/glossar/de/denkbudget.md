---
title: 'Denkbudget'
description: 'Der Richtwert, wie viel ein Modell vor der Antwort denken soll, der früher als feste Zahl gesetzt wurde.'
translationKey: denkbudget
---

Ein Denkbudget ist ein Richtwert dafür, wie viel ein Modell vor der Antwort denken soll. Früher gab man es als feste Zahl [Denk-Tokens](/de/glossar/denk-tokens) an. Es ist keine harte Grenze. Hart begrenzt ist nur die Höchstzahl der Tokens, die das Modell insgesamt schreiben darf. Sie umfasst Denken und Antwort zusammen, denn beide teilen sich denselben Platz.

**Ein Beispiel (ausgedacht):** Bei einem Limit von 4.000 Tokens und einem Denkbudget von 2.000 gilt für das Denken nur dieser Richtwert. Denkt das Modell mehr als 2.000 Tokens, bleibt der Antwort weniger Platz, denn beides zusammen darf die 4.000 nicht überschreiten. Denkt es weniger, hat die Antwort mehr Raum. Ist das Limit zu knapp gesetzt, kann die Antwort abgeschnitten sein, bevor sie endet.

**Nicht verwechseln mit einem Versprechen:** Ein Denkbudget ist ein Rahmen, kein Versprechen, dass es voll ausgeschöpft wird. Keine Vorgabe garantiert, dass das Modell überhaupt denkt. Bei den neueren Modellen von Anthropic entscheidet das Modell selbst, wie viel es denkt; eine einfache Faktenfrage bekommt dort oft gar keinen Denkabschnitt, also keinen Zwischenschritt vor der Antwort.

**Wo du dem Begriff begegnest:** In den Parametern der Programmierschnittstellen (API) der Anbieter und in den Einstellungen mancher Apps. Dort steht heute oft eine Stufe statt einer Zahl, also eine Auswahl wie „niedrig“, „mittel“ oder „hoch“. Die feste Zahl ist bei Claude 4.6 veraltet (Versionsnummern der Modelle von Anthropic) und wird ab Claude 4.7 von der Schnittstelle abgelehnt. Mehr dazu im Baustein [Wie ein Modell „nachdenkt“: Zwischenschritte, die es selbst schreibt](/de/bausteine/wie-ein-modell-nachdenkt).
