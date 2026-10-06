---
title: 'Positions-Embedding'
description: 'Eine gelernte Zahlenliste für einen Platz im Text, die zum Embedding eines Tokens addiert wird, damit das Modell die Reihenfolge kennt.'
translationKey: positions-embedding
---

Ein Positions-Embedding ist ein [Vektor](/de/glossar/vektor) für einen Platz im Text: einer für Platz 1, einer für Platz 2 und so weiter. Er ist so lang wie ein [Embedding](/de/glossar/embedding) und wird Zahl für Zahl dazu addiert. Nötig ist das, weil die Rechenschritte eines Transformer-Modells jede Zeile gleich behandeln, egal wo sie steht, und die Reihenfolge deshalb nicht verlässlich von selbst erfassen. Ohne Positionssignal brächten zwei Sätze mit denselben Wörtern in anderer Reihenfolge dieselben Steckbriefe mit, nur umsortiert.

**Ein Beispiel:** GPT-2 hat eine eigene Tabelle mit 1.024 Zeilen, eine pro möglichem Platz, jede mit 768 Zahlen. Auch sie startet zufällig und wird im Training gelernt. In „Hund beißt Mann“ bekommt „Hund“ den Zusatz für Platz 1, in „Mann beißt Hund“ den für Platz 3.

**Nicht verwechseln mit RoPE:** Viele heutige Modelle wie Llama addieren am Eingang keine Positions-Embeddings mehr. Sie bringen den Platz in jeder Schicht durch eine Drehung der Zahlen ein, dort, wo Tokens einander betrachten. Der Zweck ist derselbe, der Weg ein anderer.

**Wo du dem Begriff begegnest:** In Beschreibungen der Transformer-Architektur, oft auch als Positionskodierung oder englisch positional encoding.

Eingeführt in [Embeddings: wie aus einer Nummer ein bedeutungsvoller Vektor wird](/de/bausteine/embeddings).
