---
title: 'Embedding-Matrix'
description: 'Die große Tabelle am Eingang eines Sprachmodells mit einer Zeile gelernter Zahlen für jedes Token des Vokabulars.'
translationKey: embedding-matrix
---

Die Embedding-Matrix ist die Tabelle, aus der ein [Sprachmodell](/de/glossar/sprachmodell) die [Embeddings](/de/glossar/embedding) seiner Tokens holt. Sie hat eine Zeile für jedes Token des [Vokabulars](/de/glossar/vokabular), und jede Zeile ist so lang wie ein Embedding. Die [Token-ID](/de/glossar/token-id) ist die Zeilennummer: Das Modell rechnet an dieser Stelle nichts, es schlägt nur nach. Die Zahlen in der Tabelle gehören zu den [Parametern](/de/glossar/parameter) und werden im Training gelernt.

**Ein Beispiel:** Bei GPT-2 hat die Embedding-Matrix 50.257 Zeilen zu je 768 Zahlen, zusammen gut 38 Millionen Zahlen und damit rund 31 Prozent des ganzen Modells. Bei Llama 3.1 8B sind es rund 525 Millionen Zahlen, aber nur etwa 6,5 Prozent des Modells.

**Nicht verwechseln mit dem Vokabular:** Das Vokabular ist die Liste der Textstücke mit ihren Nummern und gehört zum Tokenizer. Die Embedding-Matrix gehört zum Modell und enthält zu jeder Nummer die gelernten Zahlen. Deshalb passen Tokenizer und Modell nur als festes Paar zusammen.

**Wo du dem Begriff begegnest:** In Erklärungen zum Aufbau von Sprachmodellen und in Angaben zur Modellgröße, oft auch als Embedding-Tabelle oder Embedding-Schicht.

Eingeführt in [Embeddings: wie aus einer Nummer ein bedeutungsvoller Vektor wird](/de/bausteine/embeddings).
