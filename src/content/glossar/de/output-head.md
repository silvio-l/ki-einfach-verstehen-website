---
title: 'Output Head'
description: 'Die letzte Rechenschicht eines Sprachmodells: Sie macht aus dem letzten Zustand einen Score für jeden Eintrag im Vokabular.'
translationKey: output-head
---

Der Output Head, auf Deutsch etwa Ausgabekopf, ist die letzte Rechenschicht eines [Sprachmodells](/de/glossar/sprachmodell). Er macht aus dem Zustand der letzten Position eine Liste mit einem [Score](/de/glossar/score) für jeden Eintrag im [Vokabular](/de/glossar/vokabular). Dafür hat er eine Zeile pro Token. Der Score eines Tokens entsteht, indem der Zustand Stelle für Stelle mit dessen Zeile malgenommen und alles zusammengezählt wird. Je besser Zustand und Zeile übereinstimmen, desto höher der Score.

**Ein Beispiel:** Mit ausgedachten Zahlen: Der Zustand ist (1,0 | 0,5 | −1,0), die Zeile von „Katze“ ist (2,0 | 1,0 | −1,5). Das ergibt 2,0 + 0,5 + 1,5 = 4,0. Bei Qwen3-0.6B hat jede Zeile 1.024 Zahlen, und es gibt 151.936 Zeilen.

**Nicht verwechseln mit dem Auswahlschritt:** Der Output Head schreibt kein Wort. Er liefert nur die Scores. Erst [Softmax](/de/glossar/softmax) macht daraus Prozente, und erst ein eigener Auswahlschritt wählt genau ein Token, etwa per [Sampling](/de/glossar/sampling). Bei vielen kleinen Modellen ist die Tabelle des Output Heads dieselbe wie die Tabelle am Eingang, aus der jede [Token-ID](/de/glossar/token-id) ihre Zahlen holt.

**Wo du dem Begriff begegnest:** In technischen Beschreibungen von Sprachmodellen, oft englisch als „language modeling head“ oder im Programmcode als „lm_head“. Seine Ausgabe, die Scores vor Softmax, heißt dort meist Logits.

Eingeführt in [Output Head: Vom letzten Zustand zur Vorhersage](/de/bausteine/output-head).
