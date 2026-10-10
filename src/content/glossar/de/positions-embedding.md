---
title: 'Positions-Embedding'
description: 'Ein Vektor für einen Platz im Text, der dem Modell die Reihenfolge mitteilt, meist zum Embedding addiert und gelernt oder fest berechnet wird.'
translationKey: positions-embedding
---

Ein Positions-Embedding ist ein [Vektor](/de/glossar/vektor) für einen Platz im Text: einer für Platz 1, einer für Platz 2 und so weiter. Er ist so lang wie ein [Embedding](/de/glossar/embedding) und wird, bei Modellen mit eigener Positionstabelle, Zahl für Zahl dazu addiert; er kann gelernt oder fest berechnet sein. Nötig ist das, weil die Rechenschritte eines Transformer-Modells jede Zeile gleich behandeln, egal wo sie steht, und die Reihenfolge deshalb nicht verlässlich von selbst erfassen. Ohne Positionssignal brächten zwei Sätze mit denselben Wörtern in anderer Reihenfolge dieselben Embeddings mit, nur umsortiert.

**Das Bild dazu:** Der Sitzplatz im Satz: Jedes Wort bekommt seinen Platz, und der Platz wird zum Embedding addiert. Die Grenze des Bildes: Wörtlich gilt das nur für Modelle mit eigener Positionstabelle; bei RoPE wird am Eingang nichts addiert.

**Ein Beispiel:** GPT-2 hat eine eigene Tabelle mit 1.024 Zeilen, eine pro möglichem Platz, jede mit 768 Zahlen. Auch sie startet zufällig und wird im Training gelernt. In „Hund beißt Mann“ bekommt „Hund“ den Zusatz für Platz 1, in „Mann beißt Hund“ den für Platz 3.

**Nicht verwechseln mit RoPE:** RoPE steht für Rotary Position Embedding. Viele heutige Modelle wie Llama addieren am Eingang keine Positions-Embeddings mehr. Sie bringen den Platz in jeder Schicht durch eine Drehung der Zahlen ein, dort, wo Tokens einander betrachten. Beide kodieren die Reihenfolge, auf verschiedenen Wegen.

**Wo du dem Begriff begegnest:** In Beschreibungen der Transformer-Architektur, oft auch als Positionskodierung oder englisch positional encoding.

Eingeführt in [Transformerblöcke und Attention: Wie Kontext eingemischt wird](/de/bausteine/transformerbloecke-und-attention).
