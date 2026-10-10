---
title: 'Output Head'
description: 'Die letzte Rechenschicht eines Sprachmodells: Sie macht aus dem letzten Zustand einen Score für jeden Eintrag im Vokabular.'
translationKey: output-head
---

Der Output Head, auf Deutsch etwa Ausgabekopf, ist die letzte Rechenschicht eines [Sprachmodells](/de/glossar/sprachmodell). Er macht aus dem Zustand der letzten Position eine Liste mit einem [Score](/de/glossar/score) für jeden Eintrag im [Vokabular](/de/glossar/vokabular), mit einer Zeile pro Token. Man kann sich das wie die Punktetafel eines Quizabends vorstellen: Jede Zeile bekommt so viele Punkte, wie der Zustand in ihre Richtung zeigt. Ein Token-Score entsteht, indem der Zustand Stelle für Stelle mit dessen Zeile malgenommen und alles zusammengezählt wird. Je mehr beide in dieselbe Richtung zeigen, desto höher der Score. Anders als auf einer Punktetafel vergibt kein Schiedsrichter die Punkte nach nachlesbaren Regeln: Die Zeilen sind gelernte Zahlen ohne beschriftete Stellen. Scores können sogar alle negativ sein; es zählen nur die Abstände.

**Ein Beispiel:** Mit ausgedachten Zahlen: Der Zustand ist (1,0 | 0,5 | −1,0), die Zeile von „Katze“ ist (2,0 | 1,0 | −1,5). Das ergibt 2,0 + 0,5 + 1,5 = 4,0. Bei Qwen3-0.6B hat jede Zeile 1.024 Zahlen, und es gibt 151.936 Zeilen.

**Nicht verwechseln mit dem Auswahlschritt:** Der Output Head schreibt kein Wort. Er liefert nur die Scores. Erst [Softmax](/de/glossar/softmax) macht daraus Prozente, dann wählt ein eigener Auswahlschritt genau ein Token, etwa per [Sampling](/de/glossar/sampling). Bei manchen Modellen, etwa dem kleinen GPT-2, ist die Tabelle des Output Heads dieselbe wie die Tabelle am Eingang, aus der jede [Token-ID](/de/glossar/token-id) ihre Zahlen holt; bei anderen, etwa Qwen3-8B, ist sie eine eigene.

**Wo du dem Begriff begegnest:** In technischen Beschreibungen von Sprachmodellen, oft englisch als „language modeling head“ oder im Programmcode als „lm_head“. Seine Ausgabe, die Scores vor Softmax, heißt dort meist Logits.

Eingeführt in [Output Head: Vom letzten Zustand zur Vorhersage](/de/bausteine/output-head).
