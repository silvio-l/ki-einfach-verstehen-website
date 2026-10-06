---
title: 'Causal Mask'
description: 'Die Sperre in der Attention eines Sprachmodells, durch die jedes Token nur sich selbst und frühere Tokens sehen kann.'
translationKey: causal-mask
---

Die Causal Mask sorgt dafür, dass in einem Sprachmodell jede Position nur sich selbst und die Positionen davor sieht, nie die danach. Dazu wird vor [Softmax](/de/glossar/softmax) der [Score](/de/glossar/score) jeder späteren Position auf minus unendlich gesetzt. Softmax macht daraus ein Gewicht von genau 0. In der [Attention](/de/glossar/attention) fließt von späteren Tokens also nichts ein.

Der Grund liegt im Training: Das Modell lernt, an jeder Stelle das nächste [Token](/de/glossar/token) vorherzusagen. Könnte es nach vorne schauen, stünde die Lösung schon da. Beim Erzeugen einer Antwort gibt es die späteren Tokens ohnehin noch nicht. Bei sieben Tokens sind von 49 möglichen Blickpaaren 28 erlaubt; die erlaubten Felder bilden ein Dreieck.

**Ein Beispiel:** In „Ich sitze auf der Bank im Park“ kann „Bank“ nicht auf „Park“ schauen. „Park“ dagegen sieht „Bank“, und spätere Positionen bekommen Information aus beiden Wörtern.

**Nicht verwechseln mit der Attention Mask für Füllzeichen:** Diese Maske mit 1 und 0 markiert Füllzeichen, mit denen kürzere Texte in einem Stapel auf gleiche Länge gebracht werden. Die Causal Mask sperrt dagegen echte Tokens, sobald sie später im Text stehen.

**Wo du dem Begriff begegnest:** In Fachtexten über Sprachmodelle, auch als „kausale Maske“ oder „maskierte Self-Attention“. Modelle, die so arbeiten, werden oft „kausale Sprachmodelle“ oder „Decoder-Modelle“ genannt.

Eingeführt in [Transformerblöcke und Attention: Wie Kontext eingemischt wird](/de/bausteine/transformerbloecke-und-attention).
