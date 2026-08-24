---
title: 'Tensor'
description: 'Eine mehrdimensional angeordnete Sammlung von Zahlen, die als Datenstruktur für Modellberechnungen dient.'
translationKey: tensor
---

Ein Tensor ist eine geordnete Sammlung von Zahlen. **Dimensionen** geben an, wie viele Nummern man braucht, um eine Stelle darin zu finden: In einer Liste genügt die Platznummer. In einer Tabelle braucht man Zeile und Spalte. In einem Stapel von Tabellen kommen Stapelnummer, Zeile und Spalte zusammen. Für vier Dimensionen braucht man einfach eine vierte Nummer, etwa „Gruppe 2, Tabelle 5, Zeile 1, Spalte 3". Man muss sich dafür keinen vierdimensionalen Gegenstand vorstellen; entscheidend ist nur die vierteilige Adresse. Ein [Vektor](/de/glossar/vektor) ist der eindimensionale Sonderfall.

Sprachmodelle fassen die Vektoren vieler Tokenpositionen in Tensoren zusammen. So können ganze Folgen innerhalb einer gemeinsamen Datenstruktur verarbeitet werden.

Der Übergang von IDs zu Tensoren beginnt in [Tokenizer: Wie Sprache zu Zahlen wird](/de/bausteine/tokenizer-ids-vokabular).
